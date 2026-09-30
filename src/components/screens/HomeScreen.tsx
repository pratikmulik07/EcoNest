import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product, EducationalArticle } from '../../types';
import { getPersonalizedRecommendations } from '../../utils/recommendationEngine';
import { DAILY_TIPS } from '../../data/educational';
import {
  Search,
  Sparkles,
  Camera,
  ArrowRight,
  Heart,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Leaf,
  Layers,
  Award,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    profile,
    products,
    articles,
    setCurrentTab,
    setSelectedCategory,
    setSearchQuery,
    addRecentSearch,
    openModal,
    isProductSaved,
    toggleSaveProduct,
    markProductViewed,
    viewedProductIds,
    recentSearches,
  } = useApp();

  // Personalized recommendations calculated based on user preferences and behavior
  const recommendedScored = useMemo(() => {
    return getPersonalizedRecommendations(
      products,
      profile.preferences,
      viewedProductIds,
      recentSearches,
      profile.savedProductIds,
      profile.scannedMaterialHistory,
      4
    );
  }, [
    products,
    profile.preferences,
    viewedProductIds,
    recentSearches,
    profile.savedProductIds,
    profile.scannedMaterialHistory,
  ]);

  const popularProducts = useMemo(() => {
    return products.filter(p => p.isPopular).slice(0, 4);
  }, [products]);

  const featuredArticles = useMemo(() => {
    return articles.slice(0, 3);
  }, [articles]);

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setCurrentTab('explore');
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('search') as HTMLInputElement;
    if (input && input.value.trim()) {
      addRecentSearch(input.value.trim());
      setSearchQuery(input.value.trim());
      setCurrentTab('explore');
    }
  };

  const todayTip = DAILY_TIPS[0];

  return (
    <div className="pb-24 pt-2 px-4 space-y-6 animate-fadeIn">
      {/* Top Greeting & Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-stone-800 text-xs font-medium">
              <span>Good Morning</span>
              <span className="text-sm">👋</span>
              <span className="font-semibold text-stone-900">• {profile.name.split(' ')[0]}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 mt-0.5">
              What are you looking for today?
            </h1>
          </div>

          <div
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <span className="text-xs">🌱</span>
            <span className="text-xs font-bold text-emerald-800">{profile.ecoPoints} pts</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            name="search"
            type="text"
            placeholder="Search sustainable products..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-200/90 text-xs text-stone-900 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-xs"
          />
          <Search className="w-4 h-4 text-stone-600 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-xl transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* A. PRODUCT CATEGORIES (Horizontal cards) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Product Categories
          </h2>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentTab('explore');
            }}
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-0.5"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'Bamboo' as ProductCategory, icon: '🎋', label: 'Bamboo', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200/80' },
            { id: 'Reusable' as ProductCategory, icon: '🔄', label: 'Reusable', bg: 'bg-teal-50 text-teal-900 border-teal-200/80' },
            { id: 'Recycled' as ProductCategory, icon: '♻️', label: 'Recycled', bg: 'bg-indigo-50 text-indigo-900 border-indigo-200/80' },
            { id: 'Organic' as ProductCategory, icon: '🌿', label: 'Organic', bg: 'bg-amber-50 text-amber-900 border-amber-200/80' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs ${cat.bg}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[11px] font-bold">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* B. RECOMMENDED FOR YOU (Personalized Products) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Recommended For You
            </h2>
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            {profile.preferences.budget}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x no-scrollbar">
          {recommendedScored.map(({ product, score, matchReasons }) => {
            const isSaved = isProductSaved(product.id);
            return (
              <div
                key={product.id}
                onClick={() => {
                  markProductViewed(product.id);
                  openModal('product', product);
                }}
                className="w-48 shrink-0 bg-white rounded-2xl p-2.5 border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-600/50 transition-all flex flex-col justify-between snap-start"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-emerald-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                      {score}%
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSaveProduct(product.id);
                      }}
                      className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-stone-600 hover:text-red-500 shadow-xs transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h3 className="text-xs font-bold text-stone-900 mt-1 line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  {matchReasons[0] && (
                    <p className="text-[10px] text-stone-700 line-clamp-1 mt-0.5">
                      {matchReasons[0]}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                  <span className="text-xs font-extrabold text-stone-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-stone-700">★ {product.rating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* C. WHAT CAN I MAKE? (Visually prominent hero card) */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        {/* Soft background glow circles */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 right-2 opacity-15 text-6xl pointer-events-none">
          ♻️
        </div>

        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-semibold text-emerald-200">
            <Camera className="w-3.5 h-3.5 text-emerald-300" />
            AI "What Can I Make?"
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
            Have unused material lying around?
          </h2>

          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-[270px]">
            Upload a photo of old denim, glass jars, or wood. Discover personalized upcycled creations you can make or get made!
          </p>

          <button
            onClick={() => setCurrentTab('reuse')}
            className="mt-1 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span>Try It Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* D. POPULAR PRODUCTS */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Popular Products
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('explore')}
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-0.5"
          >
            Browse all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {popularProducts.map(product => {
            const isSaved = isProductSaved(product.id);
            return (
              <div
                key={product.id}
                onClick={() => {
                  markProductViewed(product.id);
                  openModal('product', product);
                }}
                className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleSaveProduct(product.id);
                      }}
                      className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-stone-600 hover:text-red-500 shadow-xs transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                  </div>
                  <span className="text-[10px] font-semibold text-stone-700">
                    {product.category}
                  </span>
                  <h3 className="text-xs font-bold text-stone-900 mt-0.5 line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                  <span className="text-xs font-extrabold text-stone-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-stone-700">★ {product.rating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* E. LEARN & DISCOVER */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Learn & Discover
            </h2>
          </div>
        </div>

        <div className="space-y-2.5">
          {featuredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => openModal('article', article)}
              className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-500/50 transition-all flex items-center gap-3"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {article.category}
                </span>
                <h3 className="text-xs font-bold text-stone-900 mt-1 line-clamp-1 leading-snug">
                  {article.title}
                </h3>
                <p className="text-[11px] text-stone-700 line-clamp-1 mt-0.5">
                  {article.summary}
                </p>
                <span className="text-[10px] text-stone-600 block mt-1">
                  {article.readTime} • {article.likesCount} readers
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-600 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* F. SUSTAINABILITY TIP */}
      <div className="bg-emerald-50/90 border border-emerald-200/70 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl">{todayTip.icon}</span>
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Sustainability Tip of the Day
            </span>
          </div>
          <p className="text-xs text-emerald-950 leading-relaxed font-medium">
            "{todayTip.tip}"
          </p>
          <span className="text-[10px] text-emerald-700 mt-1 block">
            — {todayTip.author}
          </span>
        </div>
      </div>
    </div>
  );
};
