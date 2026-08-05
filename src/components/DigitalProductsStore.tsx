import React, { useState } from 'react';
import { 
  ShoppingBag, BookOpen, Code, FileCode, Download, Star, 
  CreditCard, Check, ShieldCheck, ExternalLink, Sparkles, Wallet
} from 'lucide-react';
import { DigitalProduct, UserProfile } from '../types';

interface DigitalProductsStoreProps {
  products: DigitalProduct[];
  user: UserProfile;
  onPurchaseProduct: (product: DigitalProduct, paymentMethod: string) => void;
}

export const DigitalProductsStore: React.FC<DigitalProductsStoreProps> = ({
  products,
  user,
  onPurchaseProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Flutterwave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);

  const categories = ['All', 'eBook', 'Course', 'Template', 'Software'];

  const filtered = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPurchasedProducts(prev => [...prev, selectedProduct.id]);
      onPurchaseProduct(selectedProduct, paymentMethod);
      alert(`Success! You purchased "${selectedProduct.title}" via ${paymentMethod}. Download link activated.`);
      setSelectedProduct(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-[#F5F5F5]">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-orange-950/30 via-[#080808] to-orange-950/20 border border-orange-600/30 rounded-3xl space-y-2 shadow-2xl">
        <span className="px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 border border-orange-600/30 font-bold text-[10px] tracking-widest uppercase inline-flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5" /> Digital Store Marketplace
        </span>
        <h1 className="text-3xl font-serif text-white leading-tight">Buy & Sell eBooks, Online Courses, Templates & Software</h1>
        <p className="text-xs text-white/60 max-w-2xl">
          Monetize your developer knowledge. Secure payment processing powered by Flutterwave, Paystack, Stripe, PayPal, and Bank Transfers.
        </p>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 pt-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)]'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(prod => {
          const isBought = purchasedProducts.includes(prod.id);

          return (
            <div
              key={prod.id}
              className="bg-[#080808] border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img src={prod.coverImage} alt={prod.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 border border-white/10 text-orange-400 font-bold text-[10px] uppercase tracking-widest backdrop-blur-md">
                    {prod.category}
                  </span>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-black/80 text-orange-400 font-bold text-xs border border-white/10 backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 fill-current text-orange-400" />
                    <span>{prod.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-white line-clamp-2">{prod.title}</h3>
                  <p className="text-xs text-white/50 line-clamp-3">{prod.description}</p>

                  <div className="flex items-center justify-between pt-2 text-xs text-white/40">
                    <div className="flex items-center gap-1.5">
                      <img src={prod.creatorAvatar} alt={prod.creatorName} className="w-5 h-5 rounded-full object-cover border border-white/10" />
                      <span className="text-white/70 font-medium">{prod.creatorName}</span>
                    </div>
                    <span className="font-mono text-[10px]">{prod.salesCount} sold</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-3 flex items-center justify-between border-t border-white/5 mt-2">
                <span className="text-lg font-bold text-white font-mono">${prod.price.toFixed(2)}</span>

                {isBought ? (
                  <button
                    onClick={() => alert(`Downloading ${prod.title}...`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600/20 text-orange-400 border border-orange-600/40"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedProduct(prod)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)] transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Buy Product</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout / Multi-Payment Gateway Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#080808] border border-orange-600/30 rounded-3xl p-6 shadow-2xl space-y-5 text-[#F5F5F5]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-lg text-white">Checkout Digital Product</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-white/40 hover:text-white">✕</button>
            </div>

            {/* Item summary */}
            <div className="p-3 bg-black/60 rounded-2xl border border-white/10 flex items-center gap-3">
              <img src={selectedProduct.coverImage} alt={selectedProduct.title} className="w-16 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-white truncate">{selectedProduct.title}</h4>
                <p className="text-[10px] text-white/40">By {selectedProduct.creatorName}</p>
              </div>
              <span className="text-sm font-bold text-orange-400 font-mono">${selectedProduct.price.toFixed(2)}</span>
            </div>

            {/* Select Gateway */}
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/80">Select Payment Gateway:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'Flutterwave', label: 'Flutterwave 🇳🇬/🌍' },
                    { id: 'Paystack', label: 'Paystack 🌍' },
                    { id: 'Stripe', label: 'Stripe Credit Card 💳' },
                    { id: 'PayPal', label: 'PayPal 🅿️' },
                    { id: 'Bank Transfer', label: 'Bank Transfer 🏦' },
                    { id: 'Internal Wallet', label: `Wallet ($${user.walletBalance.toFixed(2)}) 👛` },
                  ].map(gw => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setPaymentMethod(gw.id)}
                      className={`p-2.5 rounded-xl font-semibold text-left border transition-all ${
                        paymentMethod === gw.id
                          ? 'bg-orange-600/20 text-orange-400 border-orange-500 shadow-md'
                          : 'bg-black text-white/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {gw.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white/80 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)] disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Gateway...' : `Pay $${selectedProduct.price.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
