import { Product, UserPreferences } from '../types';

export interface ScoredProduct {
  product: Product;
  score: number;
  matchReasons: string[];
}

export function calculateRecommendationScore(
  product: Product,
  preferences: UserPreferences,
  viewedProductIds: string[] = [],
  searchHistory: string[] = [],
  savedProductIds: string[] = [],
  scannedMaterials: string[] = []
): ScoredProduct {
  let score = 50; // base score
  const matchReasons: string[] = [];

  // 1. Category / Interest Match (+30 pts)
  if (preferences.interests.includes(product.category)) {
    score += 30;
    matchReasons.push(`Matches your interest in ${product.category}`);
  }

  // 2. Budget Match (+20 pts)
  const price = product.price;
  let matchesBudget = false;
  switch (preferences.budget) {
    case 'Under ₹500':
      if (price < 500) matchesBudget = true;
      break;
    case '₹500–₹1,000':
      if (price >= 500 && price <= 1000) matchesBudget = true;
      break;
    case '₹1,000–₹2,000':
      if (price > 1000 && price <= 2000) matchesBudget = true;
      break;
    case 'Above ₹2,000':
      if (price > 2000) matchesBudget = true;
      break;
  }
  if (matchesBudget) {
    score += 20;
    matchReasons.push(`Fits your preferred ${preferences.budget} budget`);
  }

  // 3. Sustainability Goal Match (+15 pts)
  const goal = preferences.sustainabilityGoal.toLowerCase();
  const titleAndDesc = (product.title + ' ' + product.description + ' ' + product.sustainability.benefits.join(' ')).toLowerCase();

  if (goal.includes('plastic') && (titleAndDesc.includes('plastic') || product.sustainability.plasticUsage.toLowerCase().includes('zero'))) {
    score += 15;
    matchReasons.push('Supports your goal to Reduce Plastic');
  } else if (goal.includes('waste') && (titleAndDesc.includes('zero waste') || titleAndDesc.includes('recycled') || titleAndDesc.includes('compostable'))) {
    score += 15;
    matchReasons.push('Directly helps Reduce Waste');
  } else if (goal.includes('reuse') && product.sustainability.reusable) {
    score += 15;
    matchReasons.push('Reusable design for long-term circularity');
  } else if (goal.includes('sustainable alternatives') && (product.category === 'Bamboo' || product.category === 'Organic')) {
    score += 15;
    matchReasons.push('Natural renewable alternative');
  }

  // 4. Material Match with AI Material Scans (+15 pts)
  // If user scanned denim/textiles or wood, products with related materials get boosted!
  for (const scanned of scannedMaterials) {
    const s = scanned.toLowerCase();
    if (s.includes('denim') && product.tags.includes('upcycled denim')) {
      score += 18;
      matchReasons.push('Aligns with your scanned textile materials');
      break;
    }
    if (s.includes('wood') && (product.category === 'Bamboo' || product.tags.includes('neem wood'))) {
      score += 14;
      matchReasons.push('Matches natural timber material scans');
      break;
    }
    if (s.includes('cotton') && (product.category === 'Organic' || product.category === 'Reusable')) {
      score += 14;
      matchReasons.push('Complements your scanned cotton fabrics');
      break;
    }
  }

  // 5. Search History alignment (+10 pts)
  const recentSearches = searchHistory.slice(0, 5).map(s => s.toLowerCase());
  for (const query of recentSearches) {
    if (product.tags.some(tag => tag.toLowerCase().includes(query)) || product.title.toLowerCase().includes(query)) {
      score += 12;
      matchReasons.push(`Based on your recent search for "${query}"`);
      break;
    }
  }

  // 6. Popularity & Rating boost
  if (product.rating >= 4.8) {
    score += 8;
  }
  if (product.isPopular) {
    score += 5;
  }

  // Minor adjustment: if already saved or viewed, slightly prioritize or balance
  if (savedProductIds.includes(product.id)) {
    score += 5;
  } else if (viewedProductIds.includes(product.id)) {
    score += 3;
  }

  return {
    product,
    score: Math.min(score, 99),
    matchReasons: matchReasons.slice(0, 2),
  };
}

export function getPersonalizedRecommendations(
  allProducts: Product[],
  preferences: UserPreferences,
  viewedProductIds: string[] = [],
  searchHistory: string[] = [],
  savedProductIds: string[] = [],
  scannedMaterials: string[] = [],
  limit = 5
): ScoredProduct[] {
  return allProducts
    .map(p =>
      calculateRecommendationScore(
        p,
        preferences,
        viewedProductIds,
        searchHistory,
        savedProductIds,
        scannedMaterials
      )
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
