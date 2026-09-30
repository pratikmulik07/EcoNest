import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, UserPreferences } from '../../types';
import {
  User,
  Settings,
  Award,
  Calendar,
  CheckCircle,
  Circle,
  Sparkles,
  Bookmark,
  Heart,
  BookOpen,
  Camera,
  ChevronRight,
  Edit3,
  Bell,
  BarChart2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    updatePreferences,
    completeChallengeDay,
    openModal,
    setCurrentTab,
    resetOnboarding,
  } = useApp();

  const [editingPreferences, setEditingPreferences] = useState(false);
  const [tempPrefs, setTempPrefs] = useState<UserPreferences>(profile.preferences);

  const challengeDays = [
    { day: 1, title: 'Use a reusable bottle / cup all day', desc: 'Prevent disposable cup & plastic bottle usage' },
    { day: 2, title: 'Learn about recycling vs upcycling', desc: 'Read a verified educational guide' },
    { day: 3, title: 'Explore an alternative to single-use', desc: 'Examine bamboo or beeswax wraps' },
    { day: 4, title: 'Test "What Can I Make?" with material', desc: 'Upload old denim, wood, or glass' },
    { day: 5, title: 'Cold-water laundry & energy check', desc: 'Conserve water heating energy' },
    { day: 6, title: 'Zero plastic shopping challenge', desc: 'Carry your own cloth produce bags' },
    { day: 7, title: 'Share an eco tip with a classmate', desc: 'Spread circular lifestyle awareness' },
  ];

  const handleSavePreferences = () => {
    updatePreferences(tempPrefs);
    setEditingPreferences(false);
    try {
      confetti({ particleCount: 35, spread: 50 });
    } catch {}
  };

  const toggleInterest = (cat: ProductCategory) => {
    setTempPrefs(prev => ({
      ...prev,
      interests: prev.interests.includes(cat)
        ? prev.interests.length > 1
          ? prev.interests.filter(c => c !== cat)
          : prev.interests
        : [...prev.interests, cat],
    }));
  };

  return (
    <div className="pb-28 pt-2 px-4 space-y-6 animate-fadeIn">
      {/* User Identity Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600/30"
          />
          <div>
            <h1 className="text-base font-bold text-stone-900 leading-tight">{profile.name}</h1>
            <p className="text-xs text-stone-600">{profile.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Eco Points: {profile.ecoPoints}
              </span>
              <span className="text-[10px] text-stone-700">• Level 2 Conscious Citizen</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setEditingPreferences(!editingPreferences)}
          className="p-2.5 rounded-xl border border-stone-200 hover:border-emerald-500 text-stone-700 transition-colors"
          title="Edit Preferences"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Preferences Section (View or Edit) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Personalization & Preferences
            </h2>
          </div>
          <button
            onClick={() => setEditingPreferences(!editingPreferences)}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            {editingPreferences ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingPreferences ? (
          <div className="space-y-4 animate-slideDown">
            {/* Edit Interests */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Preferred Categories
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Bamboo', 'Reusable', 'Recycled', 'Organic'] as ProductCategory[]).map(cat => {
                  const isSelected = tempPrefs.interests.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleInterest(cat)}
                      className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Edit Budget */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Preferred Budget
              </label>
              <select
                value={tempPrefs.budget}
                onChange={e => setTempPrefs({ ...tempPrefs, budget: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-900"
              >
                <option value="Under ₹500">Under ₹500</option>
                <option value="₹500–₹1,000">₹500–₹1,000</option>
                <option value="₹1,000–₹2,000">₹1,000–₹2,000</option>
                <option value="Above ₹2,000">Above ₹2,000</option>
              </select>
            </div>

            {/* Edit Sustainability Goal */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Sustainability Goal
              </label>
              <select
                value={tempPrefs.sustainabilityGoal}
                onChange={e =>
                  setTempPrefs({ ...tempPrefs, sustainabilityGoal: e.target.value as any })
                }
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-900"
              >
                <option value="Reduce plastic">Reduce plastic</option>
                <option value="Reduce waste">Reduce waste</option>
                <option value="Reuse existing materials">Reuse existing materials</option>
                <option value="Choose sustainable alternatives">Choose sustainable alternatives</option>
                <option value="Learn about sustainability">Learn about sustainability</option>
              </select>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-sm hover:bg-emerald-800 transition-all"
            >
              Save & Recalibrate Recommendations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-stone-700 block text-[10px] font-semibold uppercase">
                Categories
              </span>
              <span className="font-bold text-stone-900 mt-0.5 block">
                {profile.preferences.interests.join(', ')}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-stone-700 block text-[10px] font-semibold uppercase">
                Budget
              </span>
              <span className="font-bold text-emerald-900 mt-0.5 block">
                {profile.preferences.budget}
              </span>
            </div>

            <div className="col-span-2 p-3 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-stone-700 block text-[10px] font-semibold uppercase">
                Primary Goal
              </span>
              <span className="font-bold text-stone-900 mt-0.5 block">
                {profile.preferences.sustainabilityGoal}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Gamification / Badges (Section 21) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Achievements & Badges
            </h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
            {profile.badges.filter(b => b.unlocked).length} / {profile.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {profile.badges.map(badge => (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                badge.unlocked
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-stone-200 bg-stone-50 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  badge.unlocked ? 'bg-white shadow-xs' : 'bg-stone-200 grayscale'
                }`}
              >
                {badge.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 leading-snug truncate">
                    {badge.name}
                  </span>
                  {badge.unlocked && (
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Earned
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-stone-600 line-clamp-1 mt-0.5">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Sustainable Challenge (Section 21) */}
      <div className="bg-gradient-to-br from-emerald-950 to-stone-900 text-white rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-300" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              7-Day Sustainability Challenge
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
            Day {profile.challengeDay} of 7
          </span>
        </div>

        <div className="space-y-2">
          {challengeDays.map(item => {
            const isCompleted = profile.completedChallengeDays.includes(item.day);
            const isCurrent = profile.challengeDay === item.day;
            return (
              <div
                key={item.day}
                onClick={() => {
                  if (!isCompleted) completeChallengeDay(item.day);
                }}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  isCompleted
                    ? 'bg-white/10 border-white/20 text-emerald-200'
                    : isCurrent
                    ? 'bg-emerald-600/30 border-emerald-400 text-white ring-1 ring-emerald-400'
                    : 'bg-black/20 border-white/5 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-bold leading-snug">
                      Day {item.day}: {item.title}
                    </div>
                    <div className="text-[10px] opacity-75">{item.desc}</div>
                  </div>
                </div>

                {!isCompleted && isCurrent && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      completeChallengeDay(item.day);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 text-stone-950 text-[10px] font-bold shadow-xs hover:bg-emerald-400 transition-all shrink-0"
                  >
                    Complete (+35 pts)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning & AI History Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => setCurrentTab('saved')}
          className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-stone-700 block">
            Saved Creations
          </span>
          <span className="text-2xl font-black text-stone-900 mt-1 block">
            {profile.savedProductIds.length + profile.savedReuseIdeas.length}
          </span>
          <span className="text-[10px] text-stone-600">Wishlist & DIY plans</span>
        </div>

        <div
          onClick={() => setCurrentTab('reuse')}
          className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
        >
          <span className="text-[10px] uppercase font-bold text-stone-700 block">
            Scanned Materials
          </span>
          <span className="text-2xl font-black text-stone-900 mt-1 block">
            {profile.scannedMaterialHistory.length}
          </span>
          <span className="text-[10px] text-stone-600">Textile & wood scans</span>
        </div>
      </div>

      {/* Capstone Admin Analytics Dashboard Launcher */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Capstone Marketing Analytics
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
            Admin Console
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          Open the Digital Marketing Analytics Dashboard to inspect user segments (Eco Explorer, Reuse Enthusiast), conversion funnels, search trends, and live telemetry for project evaluation.
        </p>

        <button
          onClick={() => openModal('adminAnalytics')}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <BarChart2 className="w-4 h-4" />
          Open Marketing Analytics Dashboard
        </button>
      </div>

      {/* Reset Onboarding Option for Testing */}
      <div className="pt-2 text-center">
        <button
          onClick={resetOnboarding}
          className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center justify-center gap-1 mx-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset & Replay Onboarding Flow
        </button>
      </div>
    </div>
  );
};
