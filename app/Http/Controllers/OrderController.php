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
        $request->validate(['status' => 'required|in:pending,paid,completed,cancelled']);
        
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
}
