export type ProductCategory = 'Bamboo' | 'Reusable' | 'Recycled' | 'Organic';

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number; // In ₹ INR
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  sustainability: {
    material: string;
    reusable: boolean;
    recyclable: boolean;
    packaging: string;
    plasticUsage: string; // e.g. "100% Zero Single-Use Plastic"
    benefits: string[];
    durability: string; // e.g. "5+ years with regular care"
    co2SavedKg: number;
    plasticSavedBottles: number;
    certifications: string[];
  };
  isPopular?: boolean;
  tags: string[];
}

export type EducationalCategory = 'Sustainability Basics' | 'Recycling' | 'Sustainable Shopping';

export interface EducationalArticle {
  id: string;
  title: string;
  category: EducationalCategory;
  readTime: string;
  image: string;
  summary: string;
  author: string;
  publishedDate: string;
  content: string[];
  keyTakeaways: string[];
  tags: string[];
  likesCount: number;
}

export interface UserPreferences {
  interests: ProductCategory[];
  priorityFactors: string[];
  budget: 'Under ₹500' | '₹500–₹1,000' | '₹1,000–₹2,000' | 'Above ₹2,000';
  purpose: 'Personal use' | 'Home' | 'College/work' | 'Travel' | 'Gifts';
  sustainabilityGoal: 'Reduce plastic' | 'Reduce waste' | 'Reuse existing materials' | 'Choose sustainable alternatives' | 'Learn about sustainability';
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: UserPreferences;
  savedProductIds: string[];
  savedReuseIdeas: ReuseIdea[];
  readArticleIds: string[];
  scannedMaterialHistory: string[];
  badges: UserBadge[];
  challengeDay: number;
  completedChallengeDays: number[];
  ecoPoints: number;
  notificationPreferences: {
    productUpdates: boolean;
    recommendations: boolean;
    reuseReminders: boolean;
    dailyTips: boolean;
    campaigns: boolean;
  };
}

export interface DetectedMaterial {
  material: string;
  dominantColor: string;
  pattern: string;
  condition: string;
  confidence: number;
  ecoScore: number;
}

export interface ReuseIdea {
  id: string;
  name: string;
  matchPercentage: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  suitabilityReason: string;
  materialsRequired: string[];
  toolsRequired: string[];
  sustainabilityBenefit: string;
  steps: string[];
  imagePrompt: string;
  previewUrl: string;
  customization?: {
    size?: string;
    handleType?: string;
    pocket?: string;
    designStyle?: string;
    textCustom?: string;
    colorTheme?: string;
  };
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'product' | 'recommendation' | 'reuse' | 'educational' | 'campaign';
  timestamp: string;
  read: boolean;
  targetScreen?: 'home' | 'explore' | 'reuse' | 'saved' | 'profile';
  targetId?: string;
}

export type MainTab = 'home' | 'explore' | 'reuse' | 'saved' | 'profile';

export type UserSegmentName =
  | 'Eco Explorer'
  | 'Product Explorer'
  | 'Reuse Enthusiast'
  | 'Price Conscious'
  | 'New User'
  | 'Inactive User';
