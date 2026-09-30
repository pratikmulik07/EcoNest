import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MainTab } from '../../types';
import {
  Home,
  Compass,
  Recycle,
  Bookmark,
  User,
  Bell,
  BarChart3,
  Wifi,
  Battery,
  Smartphone,
  Maximize2,
} from 'lucide-react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentTab,
    setCurrentTab,
    unreadNotificationsCount,
    openModal,
    useMobileFrame,
    setUseMobileFrame,
  } = useApp();

  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { tab: MainTab; label: string; icon: any; isCenter?: boolean }[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'explore', label: 'Explore', icon: Compass },
    { tab: 'reuse', label: 'Reuse', icon: Recycle, isCenter: true },
    { tab: 'saved', label: 'Saved', icon: Bookmark },
    { tab: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center sm:py-6 sm:px-4 font-sans select-none antialiased">
      {/* Top Desktop Controls Bar (Frame Switcher & Marketing Analytics Shortcut) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-2 text-stone-300 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseMobileFrame(!useMobileFrame)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-all"
          >
            {useMobileFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            {useMobileFrame ? 'Expand Width' : 'Mobile Frame'}
          </button>
        </div>

        <button
          onClick={() => openModal('adminAnalytics')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-all shadow-xs"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics Dashboard
        </button>
      </div>

      {/* Main Mobile Device Container */}
      <div
        className={`w-full bg-stone-50 flex flex-col relative transition-all duration-300 overflow-hidden ${
          useMobileFrame
            ? 'sm:max-w-[420px] sm:h-[870px] sm:rounded-[48px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] sm:border-[10px] sm:border-stone-800'
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Dynamic Island / Mobile Notch + Status Bar */}
        <div className="w-full bg-stone-50/90 backdrop-blur-md pt-3 px-6 pb-2 flex items-center justify-between z-30 shrink-0 sticky top-0">
          <span className="text-xs font-semibold text-stone-800 tracking-tight">{currentTime}</span>

          {/* Simulated Mobile Speaker & Camera Notch */}
          <div className="w-20 h-4 bg-stone-900 rounded-full flex items-center justify-end px-1.5 gap-1 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-stone-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-900/60" />
          </div>

          <div className="flex items-center gap-1.5 text-stone-800">
            <span className="text-[10px] font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Application Brand Header */}
        <div className="px-4 py-2.5 bg-stone-50/95 backdrop-blur-md flex items-center justify-between border-b border-stone-200/60 shrink-0 z-20">
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center text-xs shadow-xs font-bold">
              🌱
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight text-emerald-950 flex items-center gap-1">
                EcoBrand & Reuse
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                  PRO
                </span>
              </div>
              <div className="text-[10px] text-stone-600 font-medium">Sustainable Lifestyle</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openModal('adminAnalytics')}
              className="p-2 rounded-full hover:bg-stone-200/70 text-stone-700 transition-colors"
              title="Admin Marketing Dashboard"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => openModal('notifications')}
              className="p-2 rounded-full hover:bg-stone-200/70 text-stone-700 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-stone-50" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative overscroll-contain">
          {children}
        </div>

        {/* BOTTOM NAVIGATION BAR (5 Main Sections) */}
        <div className="w-full bg-white/95 backdrop-blur-lg border-t border-stone-200/80 px-2 pt-2 pb-5 flex items-center justify-around shrink-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;

            if (item.isCenter) {
              return (
                <button
                  key={item.tab}
                  onClick={() => setCurrentTab(item.tab)}
                  className="flex flex-col items-center -mt-5 transition-transform active:scale-90"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 scale-105'
                        : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Icon className="w-6 h-6 animate-pulse" />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 ${
                      isActive ? 'text-emerald-900 font-extrabold' : 'text-stone-600'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.tab}
                onClick={() => setCurrentTab(item.tab)}
                className="flex flex-col items-center justify-center py-1 px-3 text-center transition-all active:scale-95"
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? 'text-emerald-800' : 'text-stone-600 hover:text-stone-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span
                  className={`text-[10px] tracking-tight ${
                    isActive ? 'font-bold text-emerald-900' : 'font-medium text-stone-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
