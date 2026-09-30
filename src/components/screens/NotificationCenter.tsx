import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PushNotificationItem } from '../../types';
import { X, Bell, Check, Trash2, Sparkles, ArrowRight, ShoppingBag, BookOpen, RefreshCw } from 'lucide-react';

export const NotificationCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    setCurrentTab,
    addNotification,
    openModal,
    products,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'settings'>('all');

  const handleNotificationClick = (n: PushNotificationItem) => {
    markNotificationAsRead(n.id);
    onClose();
    if (n.targetScreen) {
      setCurrentTab(n.targetScreen);
    }
    if (n.type === 'product' && products.length > 0) {
      openModal('product', products[0]);
    }
  };

  const handleSimulatePush = () => {
    addNotification({
      title: 'Personalized Eco Alert 🎋',
      message: 'A new Bamboo Travel Thermos matching your ₹500–₹1,000 budget is back in stock!',
      type: 'recommendation',
      targetScreen: 'explore',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-50 w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-md px-4 py-3.5 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Bell className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-stone-900">Notifications</h2>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-stone-700 hover:text-stone-900 font-semibold"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-4 pt-3 flex gap-2 border-b border-stone-200/60 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Messages ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-emerald-800 text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Notification List */}
        <div className="p-4 space-y-2.5 flex-1">
          {activeTab === 'all' ? (
            notifications.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Bell className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-700">No new notifications right now.</p>
                <button
                  onClick={handleSimulatePush}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold hover:bg-emerald-200 transition-all"
                >
                  + Simulate Push Notification
                </button>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    n.read
                      ? 'bg-white border-stone-200/70 opacity-80'
                      : 'bg-emerald-50/70 border-emerald-300/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">
                        {n.type === 'product' && '🎋'}
                        {n.type === 'recommendation' && '✨'}
                        {n.type === 'reuse' && '♻️'}
                        {n.type === 'educational' && '📚'}
                        {n.type === 'campaign' && '🌱'}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 leading-snug">{n.title}</h4>
                    </div>
                    <span className="text-[10px] text-stone-600 shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed mt-1 pl-5">{n.message}</p>
                </div>
              ))
            )
          ) : (
            /* Notification Settings Control */
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-2">
                Push Notification Controls
              </h3>
              {[
                { title: 'Product Updates', desc: 'New arrivals in Bamboo, Recycled & Reusable' },
                { title: 'Personalized Recommendations', desc: 'Curated products matching your budget & goal' },
                { title: 'Reuse & Upcycling Reminders', desc: 'Updates on saved "What Can I Make?" ideas' },
                { title: 'Daily Sustainability Tip', desc: 'Morning zero-waste habit micro-tips' },
                { title: 'Earth Month Campaigns', desc: 'Special green initiatives & artisan spotlights' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">{item.title}</span>
                    <span className="text-[11px] text-stone-700">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Quick Action */}
        <div className="p-3 bg-stone-100 border-t border-stone-200/80 flex items-center justify-between text-xs">
          <span className="text-stone-700">Digital Marketing Push Engine</span>
          <button
            onClick={handleSimulatePush}
            className="text-emerald-800 font-bold hover:underline"
          >
            + Trigger Test Push
          </button>
        </div>
      </div>
    </div>
  );
};
