import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  X,
  Heart,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Recycle,
  Package,
  Award,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProductDetailModal: React.FC<{ product: Product; onClose: () => void }> = ({
  product,
  onClose,
}) => {
  const {
    isProductSaved,
    toggleSaveProduct,
    products,
    openModal,
    markProductViewed,
    trackEvent,
    addNotification,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isSaved = isProductSaved(product.id);

  // You May Also Like recommendations (same category or similar)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.rating >= 4.8))
    .slice(0, 3);

  const handleBuy = () => {
    setPurchaseSuccess(true);
    trackEvent('product_buy_intent', { productId: product.id, title: product.title, price: product.price });
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } catch {}

    addNotification({
      title: 'Order Confirmed! 📦',
      message: `Your order for "${product.title}" has been placed in eco-friendly plastic-free packaging!`,
      type: 'product',
      targetScreen: 'saved',
    });

    setTimeout(() => {
      setPurchaseSuccess(false);
    }, 4000);
  };

  const handleShare = () => {
    trackEvent('product_share', { productId: product.id, title: product.title });
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this sustainable ${product.title} on EcoBrand!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-50 w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Header Actions */}
        <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-md px-4 py-3 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {product.category}
            </span>
            <span className="text-xs text-stone-700">★ {product.rating} ({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-200/70 text-stone-600 transition-colors"
              title="Share Product"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleSaveProduct(product.id)}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-red-500 bg-red-50' : 'text-stone-600 hover:bg-stone-200/70'
              }`}
              title={isSaved ? 'Saved to favorites' : 'Save product'}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copiedLink && (
          <div className="bg-emerald-700 text-white text-xs py-1.5 px-4 text-center font-medium animate-fadeIn">
            ✓ Product link copied to clipboard!
          </div>
        )}

        {/* Product Image Gallery */}
        <div className="relative bg-stone-200/50 aspect-4/3 overflow-hidden">
          <img
            src={product.images[activeImageIndex] || product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImageIndex === i ? 'w-5 bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6">
          {/* Title & Price */}
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight leading-snug">
              {product.title}
            </h2>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-2xl font-extrabold text-emerald-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-600 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Zero Plastic Packaging
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-stone-700 leading-relaxed">
            {product.description}
          </div>

          {/* Environmental Impact Metrics Card */}
          <div className="bg-emerald-900 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-emerald-700/30 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Verified Ecological Impact
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <span className="text-xl font-bold text-white block">
                  {product.sustainability.plasticSavedBottles}
                </span>
                <span className="text-[11px] text-emerald-100">PET bottles diverted/yr</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <span className="text-xl font-bold text-white block">
                  {product.sustainability.co2SavedKg} kg
                </span>
                <span className="text-[11px] text-emerald-100">Estimated CO2 offset</span>
              </div>
            </div>
          </div>

          {/* Mandatory Sustainability Information Section */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-stone-900">Sustainability Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
              <div>
                <span className="text-stone-600 block">Primary Material:</span>
                <span className="font-semibold text-stone-800">{product.sustainability.material}</span>
              </div>
              <div>
                <span className="text-stone-600 block">Reusable:</span>
                <span className="font-semibold text-emerald-700">
                  {product.sustainability.reusable ? 'Yes (Multi-Year Life)' : 'Compostable single-cycle'}
                </span>
              </div>
              <div>
                <span className="text-stone-600 block">Packaging:</span>
                <span className="font-semibold text-stone-800">{product.sustainability.packaging}</span>
              </div>
              <div>
                <span className="text-stone-600 block">Plastic Usage:</span>
                <span className="font-semibold text-emerald-700">{product.sustainability.plasticUsage}</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-600 block">Expected Durability:</span>
                <span className="font-semibold text-stone-800">{product.sustainability.durability}</span>
              </div>
            </div>

            {/* Sustainability Benefits Bullets */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-700 block mb-1.5">
                Key Ecological Benefits:
              </span>
              <ul className="space-y-1.5">
                {product.sustainability.benefits.map((benefit, i) => (
                  <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
              {product.sustainability.certifications.map((cert, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                >
                  <Award className="w-3 h-3 text-emerald-600" />
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Product Features */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-stone-900 mb-2.5">Key Product Features</h3>
            <ul className="space-y-2">
              {product.features.map((feat, i) => (
                <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* "You May Also Like" */}
          {relatedProducts.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-stone-900 mb-3">You May Also Like</h3>
              <div className="grid grid-cols-3 gap-2.5">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      markProductViewed(rel.id);
                      openModal('product', rel);
                    }}
                    className="bg-white rounded-xl p-2 border border-stone-200/80 cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between"
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full aspect-square rounded-lg object-cover mb-1.5"
                    />
                    <div className="text-[11px] font-semibold text-stone-900 line-clamp-1">
                      {rel.title}
                    </div>
                    <div className="text-xs font-bold text-emerald-800 mt-0.5">
                      ₹{rel.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Checkout Action */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 border-t border-stone-200 flex items-center gap-3">
          <div className="shrink-0">
            <span className="text-[11px] text-stone-700 block">Total Price</span>
            <span className="text-xl font-extrabold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          {purchaseSuccess ? (
            <div className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              Order Placed (+35 Eco Points)
            </div>
          ) : (
            <button
              onClick={handleBuy}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              Get Sustainable Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
