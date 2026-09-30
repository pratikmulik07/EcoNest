import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';
import {
  Search,
  SlidersHorizontal,
  X,
  Heart,
  Sparkles,
  ArrowUpDown,
  Check,
  RotateCcw,
} from 'lucide-react';

export const ExploreScreen: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    openModal,
    isProductSaved,
    toggleSaveProduct,
    markProductViewed,
  } = useApp();

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'popular' | 'newest' | 'priceLow' | 'priceHigh'>('relevance');

  // Filter States
  const [filterPrice, setFilterPrice] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [filterZeroPlasticOnly, setFilterZeroPlasticOnly] = useState<boolean>(false);
  const [filterMinRating, setFilterMinRating] = useState<number>(0);

  // Suggested quick searches
  const suggestedQueries = ['water bottle', 'bamboo bottle', 'recycled notebook', 'cloth bag', 'zero waste'];

  // Handle search input
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
    }
  };

  const handleSelectSuggested = (query: string) => {
    setSearchQuery(query);
    addRecentSearch(query);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setFilterPrice('all');
    setFilterMaterial('all');
    setFilterZeroPlasticOnly(false);
    setFilterMinRating(0);
    setSortBy('relevance');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchTitle && !matchCategory && !matchTags && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory && p.category !== selectedCategory) {
          return false;
        }

        // Price filter
        if (filterPrice === 'under500' && p.price >= 500) return false;
        if (filterPrice === '500to1000' && (p.price < 500 || p.price > 1000)) return false;
        if (filterPrice === '1000to2000' && (p.price < 1000 || p.price > 2000)) return false;
        if (filterPrice === 'above2000' && p.price <= 2000) return false;

        // Material filter
        if (filterMaterial !== 'all') {
          const mat = p.sustainability.material.toLowerCase();
          if (!mat.includes(filterMaterial.toLowerCase())) return false;
        }

        // Zero plastic only
        if (filterZeroPlasticOnly && !p.sustainability.plasticUsage.toLowerCase().includes('zero')) {
          return false;
        }

        // Rating filter
        if (filterMinRating > 0 && p.rating < filterMinRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.reviewCount - a.reviewCount;
          case 'priceLow':
            return a.price - b.price;
          case 'priceHigh':
            return b.price - a.price;
          case 'newest':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    filterPrice,
    filterMaterial,
    filterZeroPlasticOnly,
    filterMinRating,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (filterPrice !== 'all' ? 1 : 0) +
    (filterMaterial !== 'all' ? 1 : 0) +
    (filterZeroPlasticOnly ? 1 : 0) +
    (filterMinRating > 0 ? 1 : 0);

  return (
    <div className="pb-24 pt-2 px-4 space-y-4 animate-fadeIn">
      {/* Search Header */}
      <div>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sustainable products..."
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs text-stone-900 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs"
            />
            <Search className="w-4 h-4 text-stone-600 absolute left-3 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-stone-200 text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              activeFiltersCount > 0
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && <span>({activeFiltersCount})</span>}
          </button>
        </form>

        {/* Suggested Searches & Recent Searches (when searching or starting) */}
        {!searchQuery && (
          <div className="mt-2.5 space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
              <span className="text-stone-700 font-medium shrink-0">Try:</span>
              {suggestedQueries.map(s => (
                <button
                  key={s}
                  onClick={() => handleSelectSuggested(s)}
                  className="px-2.5 py-1 rounded-full bg-stone-200/80 hover:bg-stone-300/80 text-stone-700 font-medium shrink-0 transition-colors"
                >
                  "{s}"
                </button>
              ))}
            </div>

            {recentSearches.length > 0 && (
              <div className="flex items-center justify-between text-[11px] text-stone-700 pt-1">
                <span className="font-semibold">Recent searches:</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-[10px] text-stone-700 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === null
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
          }`}
        >
          All Categories ({products.length})
        </button>

        {(['Bamboo', 'Reusable', 'Recycled', 'Organic'] as ProductCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort & Count Header */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-stone-600 font-medium">
          Showing <span className="font-bold text-stone-900">{filteredProducts.length}</span> verified products
        </span>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-600" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-stone-800 border-none focus:outline-none cursor-pointer"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="popular">Sort: Popular</option>
            <option value="newest">Sort: Highest Rated</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Drawer / Panel */}
      {showFilterDrawer && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-md space-y-4 animate-slideDown">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
              Filter Sustainable Catalogue
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">Price Range</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under500', label: 'Under ₹500' },
                { id: '500to1000', label: '₹500 – ₹1,000' },
                { id: '1000to2000', label: '₹1,000 – ₹2,000' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFilterPrice(opt.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    filterPrice === opt.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-stone-200 text-stone-700 bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Material */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">Material</label>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Bamboo', 'Cotton', 'Denim', 'Neem', 'Silicone'].map(mat => (
                <button
                  key={mat}
                  onClick={() => setFilterMaterial(mat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    filterMaterial === mat
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-stone-200 text-stone-700 bg-stone-50'
                  }`}
                >
                  {mat === 'all' ? 'All Materials' : mat}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle: Zero Single-Use Plastic */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-bold text-stone-800 block">
                100% Zero Single-Use Plastic
              </span>
              <span className="text-[10px] text-stone-600">
                Only show certified plastic-free items
              </span>
            </div>
            <input
              type="checkbox"
              checked={filterZeroPlasticOnly}
              onChange={e => setFilterZeroPlasticOnly(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <button
            onClick={() => setShowFilterDrawer(false)}
            className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs shadow-xs"
          >
            Apply Filters ({filteredProducts.length} Results)
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200/80 p-6">
          <Search className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-sm font-bold text-stone-900">No matching sustainable products</h3>
          <p className="text-xs text-stone-600 max-w-xs mx-auto">
            Try adjusting your search terms or clearing price and category filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => {
            const isSaved = isProductSaved(product.id);
            return (
              <div
                key={product.id}
                onClick={() => {
                  markProductViewed(product.id);
                  openModal('product', product);
                }}
                className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-500/60 transition-all flex flex-col justify-between"
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
                    <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  <p className="text-[10px] text-emerald-700 font-medium line-clamp-1 mt-1">
                    {product.sustainability.plasticUsage}
                  </p>
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
      )}
    </div>
  );
};
