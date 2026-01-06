/**
 * Midtrans Payment Integration Example
 *
 * Usage in any React component (e.g., Cart, Checkout page):
 *
 * import axios from 'axios';
 *
 * const handlePayment = async (productId, quantity, totalPrice) => {
 *     try {
 *         const response = await axios.post('/api/payment/checkout', {
 *             product_id: productId,
 *             quantity: quantity,
 *             total_price: totalPrice,
 *         });
 *
 *         if (response.data.success) {
 *             const snapToken = response.data.snap_token;
 *
 *             // Open Midtrans Snap popup
 *             window.snap.pay(snapToken, {
 *                 onSuccess: function(result) {
 *                     console.log('Payment success:', result);
 *                     // Redirect to order history or success page
 *                     window.location.href = '/buyer/orders';
 *                 },
 *                 onPending: function(result) {
 *                     console.log('Payment pending:', result);
 *                     alert('Menunggu pembayaran. Silakan selesaikan pembayaran Anda.');
 *                     window.location.href = '/buyer/orders';
 *                 },
 *                 onError: function(result) {
 *                     console.error('Payment error:', result);
 *                     alert('Pembayaran gagal. Silakan coba lagi.');
 *                 },
 *                 onClose: function() {
 *                     console.log('Payment popup closed');
 *                     alert('Anda menutup halaman pembayaran sebelum menyelesaikan transaksi.');
 *                 }
 *             });
 *         }
 *     } catch (error) {
 *         console.error('Checkout error:', error);
 *         alert('Gagal membuat pembayaran. Silakan coba lagi.');
 *     }
 * };
 *
 * // Call this function when user clicks "Pay Now" button
 * <button onClick={() => handlePayment(productId, qty, price)}>
 *     Bayar Sekarang
 * </button>
 */

export const initiateMidtransPayment = async (
    productId,
    quantity,
    totalPrice
) => {
    try {
        const response = await axios.post("/api/payment/checkout", {
            product_id: productId,
            quantity: quantity,
            total_price: totalPrice,
        });

        if (response.data.success) {
            const snapToken = response.data.snap_token;

            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                    console.log("Payment success:", result);
                    window.location.href = "/buyer/orders";
                },
                onPending: function (result) {
                    console.log("Payment pending:", result);
                    alert(
                        "Menunggu pembayaran. Silakan selesaikan pembayaran Anda."
                    );
                    window.location.href = "/buyer/orders";
                },
                onError: function (result) {
                    console.error("Payment error:", result);
                    alert("Pembayaran gagal. Silakan coba lagi.");
                },
                onClose: function () {
                    console.log("Payment popup closed");
                },
            });
        }
    } catch (error) {
        console.error("Checkout error:", error);
        throw error;
    }
};
