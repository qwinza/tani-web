<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Get order history for the current buyer.
     */
    public function index()
    {
        return response()->json(
            Order::with('product.user')
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    /**
     * Process checkout.
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'phone_number' => 'required|string',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $orders = [];
                foreach ($request->items as $item) {
                    $product = Product::lockForUpdate()->find($item['product_id']);

                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Stok tidak mencukupi untuk produk: {$product->name}");
                    }

                    $order = Order::create([
                        'user_id' => Auth::id(),
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'total_price' => $product->price * $item['quantity'],
                        'status' => 'pending',
                        'shipping_address' => $request->shipping_address,
                        'phone_number' => $request->phone_number,
                    ]);

                    $product->decrement('stock', $item['quantity']);
                    $orders[] = $order;
                }

                return response()->json([
                    'message' => 'Checkout berhasil',
                    'orders' => $orders
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Get incoming orders for a farmer.
     */
    public function farmerOrders()
    {
        return response()->json(
            Order::with(['buyer', 'product'])
                ->whereHas('product', function ($query) {
                    $query->where('user_id', Auth::id());
                })
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    /**
     * Update order status (Farmer).
     */
    public function updateStatus(Order $order, Request $request)
    {
        $request->validate(['status' => 'required|in:pending,processing,shipped,completed,cancelled']);
        
        // Ensure farmer owns the product
        if ($order->product->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status pesanan diperbarui',
            'order' => $order
        ]);
    }

    /**
     * Get single order detail.
     */
    public function show(Order $order)
    {
        // Load relationships
        $order->load(['buyer', 'product.user']);

        // Check authorization
        if ($order->user_id !== Auth::id() && $order->product->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return response()->json($order);
    }

    /**
     * Approve order (Farmer).
     */
    public function approve(Order $order)
    {
        if ($order->product->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $order->update(['status' => 'processing']);

        return response()->json([
            'message' => 'Pesanan telah disetujui dan sedang disiapkan',
            'order' => $order
        ]);
    }

    /**
     * Ship order (Farmer).
     */
    public function ship(Order $order, Request $request)
    {
        if ($order->product->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'shipping_proof' => 'required|image|max:2048'
        ]);

        $path = $request->file('shipping_proof')->store('shipping_proofs', 'public');

        $order->update([
            'status' => 'shipped',
            'shipping_proof' => $path
        ]);

        return response()->json([
            'message' => 'Pesanan telah dikirim ke ekspedisi',
            'order' => $order
        ]);
    }

    /**
     * Complete order (Buyer).
     */
    public function complete(Order $order, Request $request)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string'
        ]);

        $order->update([
            'status' => 'completed',
            'rating' => $request->rating,
            'review' => $request->review,
        ]);

        return response()->json([
            'message' => 'Pesanan telah selesai',
            'order' => $order
        ]);
    }
}
