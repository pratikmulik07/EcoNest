/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/mobile/MobileFrame';
import { OnboardingFlow } from './components/screens/OnboardingFlow';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { ReuseScreen } from './components/screens/ReuseScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ProductDetailModal } from './components/screens/ProductDetailModal';
import { ArticleDetailModal } from './components/screens/ArticleDetailModal';
import { ReuseDetailModal } from './components/screens/ReuseDetailModal';
import { CustomizeModal } from './components/screens/CustomizeModal';
import { GetItMadeModal } from './components/screens/GetItMadeModal';
import { NotificationCenter } from './components/screens/NotificationCenter';
import { AdminAnalyticsDashboard } from './components/screens/AdminAnalyticsDashboard';

const MainAppContent: React.FC = () => {
  const { onboardingCompleted, currentTab, activeModal, closeModal } = useApp();

  // If user hasn't completed onboarding, present modern onboarding flow
  if (!onboardingCompleted) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center sm:p-4">
        <div className="w-full sm:max-w-[420px] sm:h-[870px] sm:rounded-[44px] bg-stone-50 overflow-hidden shadow-2xl sm:border-[8px] sm:border-stone-800 flex flex-col">
          <OnboardingFlow />
        </div>
      </div>
    );
  }

  return (
    <MobileFrame>
      {/* 5 Main Tab Screens */}
      {currentTab === 'home' && <HomeScreen />}
      {currentTab === 'explore' && <ExploreScreen />}
      {currentTab === 'reuse' && <ReuseScreen />}
      {currentTab === 'saved' && <SavedScreen />}
      {currentTab === 'profile' && <ProfileScreen />}

      {/* Global Interactive Modals */}
      {activeModal?.type === 'product' && activeModal.data && (
        <ProductDetailModal product={activeModal.data} onClose={closeModal} />
      )}

      {activeModal?.type === 'article' && activeModal.data && (
        <ArticleDetailModal article={activeModal.data} onClose={closeModal} />
      )}

      {activeModal?.type === 'reuse' && activeModal.data && (
        <ReuseDetailModal idea={activeModal.data} onClose={closeModal} />
      )}

      {activeModal?.type === 'customize' && activeModal.data && (
        <CustomizeModal idea={activeModal.data} onClose={closeModal} />
      )}

      {activeModal?.type === 'getItMade' && activeModal.data && (
        <GetItMadeModal idea={activeModal.data} onClose={closeModal} />
      )}

      {activeModal?.type === 'notifications' && (
        <NotificationCenter onClose={closeModal} />
      )}

      {activeModal?.type === 'adminAnalytics' && (
        <AdminAnalyticsDashboard onClose={closeModal} />
      )}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
