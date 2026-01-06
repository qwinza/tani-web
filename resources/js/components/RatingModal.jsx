import React, { useState } from 'react';
import { X, Star, MessageSquare, CheckCircle } from 'lucide-react';

export default function RatingModal({ order, isOpen, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !order) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Silakan berikan rating bintang terlebih dahulu');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(order.id, { rating, review });
            onClose();
        } catch (error) {
            console.error("Failed to submit rating:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 text-center border-b border-gray-50 bg-gray-50/50 relative">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-200">
                        <Star className="w-10 h-10 text-white fill-current" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 font-outfit">Beri Rating</h3>
                    <p className="text-sm font-bold text-gray-400">Bagaimana pengalaman belanja Anda di {order.product?.user?.name || 'AgriMatch'}?</p>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    {/* Stars */}
                    <div className="flex flex-col items-center">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`p-1 transition-transform hover:scale-125 active:scale-95 ${
                                        (hover || rating) >= star ? 'text-amber-400' : 'text-gray-200'
                                    }`}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star className={`w-10 h-10 ${ (hover || rating) >= star ? 'fill-current' : '' }`} />
                                </button>
                            ))}
                        </div>
                        <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                            {rating === 5 ? 'Sangat Puas!' : 
                             rating === 4 ? 'Puas' : 
                             rating === 3 ? 'Cukup' : 
                             rating === 2 ? 'Kurang' : 
                             rating === 1 ? 'Sangat Kurang' : 'Pilih Rating'}
                        </p>
                    </div>

                    {/* Review Textarea */}
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">
                            <MessageSquare className="w-3 h-3" /> Ulasan Opsional
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Apa yang membuat Anda senang dengan produk ini?"
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-6 text-sm font-bold text-gray-700 focus:bg-white focus:border-emerald-500 transition-all outline-none min-h-[120px] resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0}
                        className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${
                            isSubmitting || rating === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 hover:scale-[1.02]'
                        }`}
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" /> Kirim & Selesaikan
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
