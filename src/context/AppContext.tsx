import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserPreferences,
  ProductCategory,
  ReuseIdea,
  Product,
  EducationalArticle,
  PushNotificationItem,
  MainTab,
  UserBadge,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_ARTICLES } from '../data/educational';
import confetti from 'canvas-confetti';

const INITIAL_BADGES: UserBadge[] = [
  { id: 'b_eco_starter', name: 'Eco Starter', description: 'Completed onboarding & set your green priorities', icon: '🌱', unlocked: true, unlockedDate: 'Today' },
  { id: 'b_green_explorer', name: 'Green Explorer', description: 'Discovered & bookmarked 3 sustainable products', icon: '🧭', unlocked: false },
  { id: 'b_waste_reducer', name: 'Waste Reducer', description: 'Prevented over 50 single-use plastic items', icon: '♻️', unlocked: false },
  { id: 'b_sustainability_learner', name: 'Sustainability Learner', description: 'Read 2 in-depth eco-guides and tips', icon: '📚', unlocked: false },
  { id: 'b_reuse_champion', name: 'Reuse Champion', description: 'Used AI "What Can I Make?" to analyze materials', icon: '✨', unlocked: false },
];

const DEFAULT_PREFERENCES: UserPreferences = {
  interests: ['Bamboo', 'Recycled'],
  priorityFactors: ['Environmental impact', 'Durability'],
  budget: '₹500–₹1,000',
  purpose: 'Personal use',
  sustainabilityGoal: 'Reduce plastic',
};

const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'notif_welcome',
    title: 'Welcome to EcoBrand & Reuse 🌱',
    message: 'Your personalized sustainable dashboard is configured based on your preferences.',
    type: 'campaign',
    timestamp: 'Just now',
    read: false,
    targetScreen: 'home',
  },
  {
    id: 'notif_bamboo_update',
    title: 'New Bamboo Products Available 🎋',
    message: 'New insulated bamboo travel drinkware has landed in your preferred ₹500–₹1,000 range.',
    type: 'product',
    timestamp: '2h ago',
    read: false,
    targetScreen: 'explore',
  },
  {
    id: 'notif_reuse_prompt',
    title: 'Have Unused Denim or Glass? ♻️',
    message: 'Try "What Can I Make?" to turn old clothes into tote bags and planters.',
    type: 'reuse',
    timestamp: '1d ago',
    read: true,
    targetScreen: 'reuse',
  },
];

interface AppContextType {
  profile: UserProfile;
  onboardingCompleted: boolean;
  completeOnboarding: (prefs: UserPreferences) => void;
  resetOnboarding: () => void;
  currentTab: MainTab;
  setCurrentTab: (tab: MainTab) => void;
  selectedCategory: ProductCategory | null;
  setSelectedCategory: (cat: ProductCategory | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  products: Product[];
  articles: EducationalArticle[];
  viewedProductIds: string[];
  markProductViewed: (id: string) => void;
  isProductSaved: (id: string) => boolean;
  toggleSaveProduct: (id: string) => void;
  isReuseIdeaSaved: (id: string) => boolean;
  toggleSaveReuseIdea: (idea: ReuseIdea) => void;
  markArticleRead: (id: string) => void;
  updatePreferences: (newPrefs: UserPreferences) => void;
  completeChallengeDay: (day: number) => void;
  recordScannedMaterial: (material: string) => void;
  notifications: PushNotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<PushNotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  unreadNotificationsCount: number;
  activeModal: { type: string; data?: any } | null;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  trackEvent: (eventType: string, payload?: Record<string, any>) => void;
  useMobileFrame: boolean;
  setUseMobileFrame: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('ecobrand_onboarded') === 'true';
  });

  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'bamboo bottle',
    'recycled notebook',
    'cloth bag',
    'zero waste',
  ]);

  const [useMobileFrame, setUseMobileFrame] = useState<boolean>(() => {
    // Default to true on desktop screens for mobile presentation; auto false on native mobile devices
    return window.innerWidth > 768;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ecobrand_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'usr_green_' + Math.random().toString(36).substring(2, 7),
      name: 'Priya Sharma',
      email: 'priya.green@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      preferences: DEFAULT_PREFERENCES,
      savedProductIds: ['prod_bamboo_bottle'],
      savedReuseIdeas: [],
      readArticleIds: [],
      scannedMaterialHistory: ['Denim jeans'],
      badges: INITIAL_BADGES,
      challengeDay: 2,
      completedChallengeDays: [1],
      ecoPoints: 180,
      notificationPreferences: {
        productUpdates: true,
        recommendations: true,
        reuseReminders: true,
        dailyTips: true,
        campaigns: true,
      },
    };
  });

  const [notifications, setNotifications] = useState<PushNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [viewedProductIds, setViewedProductIds] = useState<string[]>(['prod_bamboo_bottle']);
  const [activeModal, setActiveModal] = useState<{ type: string; data?: any } | null>(null);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('ecobrand_profile', JSON.stringify(profile));
  }, [profile]);

  // Analytics event dispatcher
  const trackEvent = (eventType: string, payload: Record<string, any> = {}) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        userId: profile.id,
        userSegment: deriveUserSegment(profile),
        payload,
      }),
    }).catch(err => console.debug('Track failed silently:', err));
  };

  const deriveUserSegment = (p: UserProfile): string => {
    if (p.scannedMaterialHistory.length >= 2 || p.savedReuseIdeas.length >= 1) return 'Reuse Enthusiast';
    if (p.readArticleIds.length >= 2) return 'Eco Explorer';
    if (p.savedProductIds.length >= 2) return 'Product Explorer';
    if (p.preferences.budget === 'Under ₹500') return 'Price Conscious';
    return 'Eco Explorer';
  };

  const completeOnboarding = (prefs: UserPreferences) => {
    setOnboardingCompleted(true);
    localStorage.setItem('ecobrand_onboarded', 'true');
    setProfile(prev => ({
      ...prev,
      preferences: prefs,
      ecoPoints: prev.ecoPoints + 50,
    }));
    trackEvent('user_registration', { preferences: prefs });
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const resetOnboarding = () => {
    setOnboardingCompleted(false);
    localStorage.removeItem('ecobrand_onboarded');
  };

  const markProductViewed = (id: string) => {
    if (!viewedProductIds.includes(id)) {
      setViewedProductIds(prev => [id, ...prev]);
    }
    trackEvent('product_view', { productId: id });
  };

  const isProductSaved = (id: string) => profile.savedProductIds.includes(id);

  const toggleSaveProduct = (id: string) => {
    setProfile(prev => {
      const isSaved = prev.savedProductIds.includes(id);
      const newSaved = isSaved
        ? prev.savedProductIds.filter(itemId => itemId !== id)
        : [...prev.savedProductIds, id];

      // Check badge unlock for 3 saved items
      let updatedBadges = prev.badges;
      if (!isSaved && newSaved.length >= 3) {
        updatedBadges = prev.badges.map(b =>
          b.id === 'b_green_explorer' ? { ...b, unlocked: true, unlockedDate: 'Today' } : b
        );
      }

      const updatedPoints = isSaved ? prev.ecoPoints : prev.ecoPoints + 15;

      return {
        ...prev,
        savedProductIds: newSaved,
        badges: updatedBadges,
        ecoPoints: updatedPoints,
      };
    });

    const isCurrentlySaved = profile.savedProductIds.includes(id);
    trackEvent(isCurrentlySaved ? 'product_unsave' : 'product_save', { productId: id });
  };

  const isReuseIdeaSaved = (id: string) => {
    return profile.savedReuseIdeas.some(item => item.id === id);
  };

  const toggleSaveReuseIdea = (idea: ReuseIdea) => {
    setProfile(prev => {
      const exists = prev.savedReuseIdeas.some(i => i.id === idea.id);
      const newIdeas = exists
        ? prev.savedReuseIdeas.filter(i => i.id !== idea.id)
        : [...prev.savedReuseIdeas, idea];

      return {
        ...prev,
        savedReuseIdeas: newIdeas,
        ecoPoints: exists ? prev.ecoPoints : prev.ecoPoints + 25,
      };
    });

    const exists = profile.savedReuseIdeas.some(i => i.id === idea.id);
    trackEvent(exists ? 'reuse_idea_unsave' : 'reuse_idea_saved', { ideaTitle: idea.name, ideaId: idea.id });
  };

  const markArticleRead = (id: string) => {
    setProfile(prev => {
      if (prev.readArticleIds.includes(id)) return prev;
      const newRead = [...prev.readArticleIds, id];
      let updatedBadges = prev.badges;
      if (newRead.length >= 2) {
        updatedBadges = prev.badges.map(b =>
          b.id === 'b_sustainability_learner' ? { ...b, unlocked: true, unlockedDate: 'Today' } : b
        );
      }
      return {
        ...prev,
        readArticleIds: newRead,
        badges: updatedBadges,
        ecoPoints: prev.ecoPoints + 20,
      };
    });
    trackEvent('educational_view', { articleId: id });
  };

  const updatePreferences = (newPrefs: UserPreferences) => {
    setProfile(prev => ({
      ...prev,
      preferences: newPrefs,
    }));
    trackEvent('preferences_updated', { preferences: newPrefs });
  };

  const completeChallengeDay = (day: number) => {
    setProfile(prev => {
      if (prev.completedChallengeDays.includes(day)) return prev;
      const newCompleted = [...prev.completedChallengeDays, day];
      const nextDay = Math.min(day + 1, 7);

      let updatedBadges = prev.badges;
      if (newCompleted.length >= 3) {
        updatedBadges = prev.badges.map(b =>
          b.id === 'b_waste_reducer' ? { ...b, unlocked: true, unlockedDate: 'Today' } : b
        );
      }

      return {
        ...prev,
        challengeDay: nextDay,
        completedChallengeDays: newCompleted,
        ecoPoints: prev.ecoPoints + 35,
      };
    });
    try {
      confetti({ particleCount: 50, spread: 50 });
    } catch {}
    trackEvent('challenge_day_completed', { day });
  };

  const recordScannedMaterial = (material: string) => {
    setProfile(prev => {
      const history = [material, ...prev.scannedMaterialHistory.filter(m => m !== material)].slice(0, 10);
      const updatedBadges = prev.badges.map(b =>
        b.id === 'b_reuse_champion' ? { ...b, unlocked: true, unlockedDate: 'Today' } : b
      );
      return {
        ...prev,
        scannedMaterialHistory: history,
        badges: updatedBadges,
        ecoPoints: prev.ecoPoints + 30,
      };
    });
    trackEvent('ai_material_detected', { material });
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => [query, ...prev.filter(q => q.toLowerCase() !== query.toLowerCase())].slice(0, 8));
    trackEvent('product_search', { query });
  };

  const clearRecentSearches = () => setRecentSearches([]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    trackEvent('notification_opened', { notificationId: id });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif: Omit<PushNotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const item: PushNotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [item, ...prev]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const openModal = (type: string, data?: any) => {
    setActiveModal({ type, data });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        onboardingCompleted,
        completeOnboarding,
        resetOnboarding,
        currentTab,
        setCurrentTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        products: INITIAL_PRODUCTS,
        articles: INITIAL_ARTICLES,
        viewedProductIds,
        markProductViewed,
        isProductSaved,
        toggleSaveProduct,
        isReuseIdeaSaved,
        toggleSaveReuseIdea,
        markArticleRead,
        updatePreferences,
        completeChallengeDay,
        recordScannedMaterial,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        unreadNotificationsCount,
        activeModal,
        openModal,
        closeModal,
        trackEvent,
        useMobileFrame,
        setUseMobileFrame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
