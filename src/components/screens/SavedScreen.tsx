import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ReuseIdea } from '../../types';
import { Bookmark, Heart, Trash2, ArrowRight, Sparkles, Clock, ShoppingBag } from 'lucide-react';

export const SavedScreen: React.FC = () => {
  const {
    products,
    profile,
    toggleSaveProduct,
    toggleSaveReuseIdea,
    openModal,
    markProductViewed,
    setCurrentTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'reuse'>('products');

  const savedProducts = products.filter(p => profile.savedProductIds.includes(p.id));
  const savedReuseIdeas = profile.savedReuseIdeas;

  return (
    <div className="pb-24 pt-2 px-4 space-y-4 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900">
          Saved Items & Ideas
        </h1>
        <p className="text-xs text-stone-700 mt-0.5">
          Your bookmarked sustainable products and AI upcycling project blueprints.
        </p>
      </div>

      {/* Tabs Switcher: Saved Products vs Saved Reuse Ideas */}
      <div className="flex bg-stone-200/80 p-1 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          Saved Products ({savedProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('reuse')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'reuse'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
          Reuse Ideas ({savedReuseIdeas.length})
        </button>
      </div>

      {/* Tab 1: Saved Products */}
      {activeTab === 'products' && (
        <div className="space-y-3 animate-fadeIn">
          {savedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-6">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-900">No saved products yet</h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Explore our sustainable catalogue and tap the heart icon to save products to your wishlist.
              </p>
              <button
                onClick={() => setCurrentTab('explore')}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold"
              >
                Browse Sustainable Catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => {
                    markProductViewed(product.id);
                    openModal('product', product);
                  }}
                  className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-500 transition-all flex items-center justify-between gap-3"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {product.category}
                    </span>
                    <h3 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1 leading-snug">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-extrabold text-stone-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-700">★ {product.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSaveProduct(product.id);
                      }}
                      className="p-2 text-stone-600 hover:text-red-500 rounded-full hover:bg-stone-100 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-stone-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Reuse Ideas */}
      {activeTab === 'reuse' && (
        <div className="space-y-3 animate-fadeIn">
          {savedReuseIdeas.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-6">
              <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-900">No saved reuse ideas yet</h3>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Scan your leftover materials in "What Can I Make?" and bookmark your favorite upcycling project ideas.
              </p>
              <button
                onClick={() => setCurrentTab('reuse')}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold"
              >
                Scan Unused Materials
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedReuseIdeas.map(idea => (
                <div
                  key={idea.id}
                  onClick={() => openModal('reuse', idea)}
                  className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-500 transition-all flex items-center justify-between gap-3"
                >
                  <img
                    src={idea.previewUrl}
                    alt={idea.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {idea.matchPercentage}% Match
                      </span>
                      <span className="text-[10px] text-stone-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {idea.estimatedTime}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1 leading-snug">
                      {idea.name}
                    </h3>
                    <p className="text-[10px] text-stone-600 line-clamp-1 mt-0.5">
                      {idea.materialsRequired.join(', ')}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSaveReuseIdea(idea);
                      }}
                      className="p-2 text-stone-600 hover:text-red-500 rounded-full hover:bg-stone-100 transition-colors"
                      title="Remove idea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-stone-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
