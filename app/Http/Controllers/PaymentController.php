<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function __construct()
    {
        // Set Midtrans configuration
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Create checkout and get Snap token
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'shipping_address' => 'required|string',
            'phone_number' => 'required|string',
        ]);

        try {
            // Create order in database
            $order = Order::create([
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'total_price' => $request->total_price,
                'status' => 'pending',
                'external_id' => 'ORDER-' . time() . '-' . auth()->id(),
                'shipping_address' => $request->shipping_address,
                'phone_number' => $request->phone_number,
            ]);

            // Prepare Midtrans transaction details
            $params = [
                'transaction_details' => [
                    'order_id' => $order->external_id,
                    'gross_amount' => (int) $order->total_price,
                ],
                'customer_details' => [
                    'first_name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                ],
                'item_details' => [
                    [
                        'id' => $order->product_id,
                        'price' => (int) ($order->total_price / $order->quantity),
                        'quantity' => $order->quantity,
                        'name' => $order->product->name ?? 'Product',
                    ],
                ],
            ];

            // Get Snap token from Midtrans
            $snapToken = Snap::getSnapToken($params);

            // Save snap token to order
            $order->update(['snap_token' => $snapToken]);

            return response()->json([
                'success' => true,
                'snap_token' => $snapToken,
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle Midtrans notification callback
     */
    public function callback(Request $request)
    {
        try {
            $serverKey = config('midtrans.server_key');
            $hashed = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

            // Verify signature key
            if ($hashed !== $request->signature_key) {
                return response()->json(['message' => 'Invalid signature'], 403);
            }

            // Find order by external_id
            $order = Order::where('external_id', $request->order_id)->first();

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            $transactionStatus = $request->transaction_status;
            $paymentType = $request->payment_type;

            // Update order based on transaction status
            if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
                $order->update([
                    'status' => 'pending',
                    'payment_type' => $paymentType,
                ]);
            } elseif ($transactionStatus == 'pending') {
                $order->update([
                    'status' => 'pending',
                    'payment_type' => $paymentType,
                ]);
            } elseif ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
                $order->update([
                    'status' => 'cancelled',
                    'payment_type' => $paymentType,
                ]);
            }

            return response()->json(['message' => 'Callback processed successfully']);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Callback failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
