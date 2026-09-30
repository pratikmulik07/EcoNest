import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, UserPreferences } from '../../types';
import { Sparkles, ArrowRight, ArrowLeft, Check, Leaf, ShieldCheck, Heart, Zap } from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState<number>(1);

  const [interests, setInterests] = useState<ProductCategory[]>(['Bamboo', 'Recycled']);
  const [priorityFactors, setPriorityFactors] = useState<string[]>(['Environmental impact', 'Durability']);
  const [budget, setBudget] = useState<'Under ₹500' | '₹500–₹1,000' | '₹1,000–₹2,000' | 'Above ₹2,000'>('₹500–₹1,000');
  const [purpose, setPurpose] = useState<'Personal use' | 'Home' | 'College/work' | 'Travel' | 'Gifts'>('Personal use');
  const [sustainabilityGoal, setSustainabilityGoal] = useState<'Reduce plastic' | 'Reduce waste' | 'Reuse existing materials' | 'Choose sustainable alternatives' | 'Learn about sustainability'>('Reduce plastic');

  const toggleInterest = (cat: ProductCategory) => {
    setInterests(prev =>
      prev.includes(cat) ? (prev.length > 1 ? prev.filter(c => c !== cat) : prev) : [...prev, cat]
    );
  };

  const togglePriority = (factor: string) => {
    setPriorityFactors(prev =>
      prev.includes(factor) ? (prev.length > 1 ? prev.filter(f => f !== factor) : prev) : [...prev, factor]
    );
  };

  const handleFinish = () => {
    const preferences: UserPreferences = {
      interests,
      priorityFactors,
      budget,
      purpose,
      sustainabilityGoal,
    };
    completeOnboarding(preferences);
  };

  const totalSteps = 5;

  return (
    <div className="min-h-full bg-stone-50 flex flex-col justify-between p-5 text-stone-900 select-none">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🌱
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-emerald-950">EcoBrand & Reuse</h1>
              <p className="text-[11px] text-stone-700">Sustainable Lifestyle & Analytics</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step 1: Sustainable Categories */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Section A</span>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 mt-1 mb-2">
              What sustainable products interest you most?
            </h2>
            <p className="text-sm text-stone-700 mb-6">
              Select one or more categories. We will personalize your feed and product recommendations.
            </p>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                {
                  id: 'Bamboo' as ProductCategory,
                  icon: '🎋',
                  title: 'Bamboo',
                  desc: 'Bottles, toothbrushes, organizers & dining',
                },
                {
                  id: 'Reusable' as ProductCategory,
                  icon: '🔄',
                  title: 'Reusable',
                  desc: 'Produce bags, tumblers, wraps & zero-waste kits',
                },
                {
                  id: 'Recycled' as ProductCategory,
                  icon: '♻️',
                  title: 'Recycled',
                  desc: 'Upcycled denim, post-consumer cotton & ocean plastics',
                },
                {
                  id: 'Organic' as ProductCategory,
                  icon: '🌿',
                  title: 'Organic',
                  desc: 'GOTS cotton canvas, neem wood & natural shell ware',
                },
              ].map(cat => {
                const isSelected = interests.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleInterest(cat.id)}
                    type="button"
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-600/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="text-3xl mb-3">{cat.icon}</span>
                    <div>
                      <h3 className="font-semibold text-stone-900 text-sm">{cat.title}</h3>
                      <p className="text-[11px] text-stone-700 leading-tight mt-0.5">{cat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: What matters most */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Section B</span>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 mt-1 mb-2">
              What matters most to your lifestyle?
            </h2>
            <p className="text-sm text-stone-700 mb-6">
              Choose the qualities you prioritize when evaluating eco-friendly products.
            </p>

            <div className="space-y-2.5">
              {[
                { id: 'Environmental impact', label: 'Environmental impact', icon: '🌍', desc: 'Measurable CO2 and plastic diversion' },
                { id: 'Affordable price', label: 'Affordable price', icon: '🏷️', desc: 'Accessible green alternatives without eco-tax' },
                { id: 'Durability', label: 'Durability & Lifespan', icon: '🛡️', desc: 'Built to last 3+ years with daily use' },
                { id: 'Natural materials', label: '100% Natural materials', icon: '🍃', desc: 'Zero synthetic petrochemical polymers' },
                { id: 'Recyclability', label: 'Recyclability & Compostability', icon: '🔄', desc: 'Zero-waste circular end-of-life' },
              ].map(factor => {
                const isSelected = priorityFactors.includes(factor.id);
                return (
                  <button
                    key={factor.id}
                    onClick={() => togglePriority(factor.id)}
                    type="button"
                    className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{factor.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-900 text-sm">{factor.label}</div>
                        <div className="text-xs text-stone-700">{factor.desc}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Preferred Budget */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Section C</span>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 mt-1 mb-2">
              What is your preferred budget range?
            </h2>
            <p className="text-sm text-stone-700 mb-6">
              Our recommendation engine balances quality and price to match your spending preference.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Under ₹500', label: 'Under ₹500', desc: 'Everyday budget essentials', badge: 'Great for students' },
                { id: '₹500–₹1,000', label: '₹500–₹1,000', desc: 'Insulated bottles, wraps & journals', badge: 'Most popular' },
                { id: '₹1,000–₹2,000', label: '₹1,000–₹2,000', desc: 'Premium desk sets & accessories', badge: 'High durability' },
                { id: 'Above ₹2,000', label: 'Above ₹2,000', desc: 'Artisan denim bags & full sets', badge: 'Artisanal crafts' },
              ].map(b => {
                const isSelected = budget === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id as any)}
                    type="button"
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600 mb-2">
                        {b.badge}
                      </span>
                      <h3 className="font-bold text-base text-stone-900">{b.label}</h3>
                    </div>
                    <p className="text-xs text-stone-700 mt-3">{b.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Primary Purpose */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Section D</span>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 mt-1 mb-2">
              Where will you use these sustainable products?
            </h2>
            <p className="text-sm text-stone-700 mb-6">
              Tailors products and DIY upcycling ideas for your specific daily context.
            </p>

            <div className="space-y-2.5">
              {[
                { id: 'Personal use', label: 'Personal use & Daily commute', icon: '🎒', desc: 'Drinkware, personal care, cutlery' },
                { id: 'Home', label: 'Home & Kitchen', icon: '🏡', desc: 'Food wraps, planters, storage jars' },
                { id: 'College/work', label: 'College & Workstation', icon: '💻', desc: 'Desk docks, journals, laptop sleeves' },
                { id: 'Travel', label: 'Travel & Outdoor', icon: '✈️', desc: 'Foldable cups, travel cutlery, daypacks' },
                { id: 'Gifts', label: 'Eco-friendly Gifting', icon: '🎁', desc: 'Curated hampers & handmade items' },
              ].map(p => {
                const isSelected = purpose === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPurpose(p.id as any)}
                    type="button"
                    className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-900 text-sm">{p.label}</div>
                        <div className="text-xs text-stone-700">{p.desc}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Sustainability Goal */}
        {step === 5 && (
          <div className="animate-fadeIn">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Section E</span>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 mt-1 mb-2">
              What is your primary sustainability goal?
            </h2>
            <p className="text-sm text-stone-700 mb-6">
              We align your dashboard, tips, and AI "What Can I Make?" material challenges with this goal.
            </p>

            <div className="space-y-2.5">
              {[
                { id: 'Reduce plastic', title: 'Reduce Single-Use Plastic', icon: '🚯', desc: 'Replace PET bottles, straws, and shopping polythene bags' },
                { id: 'Reduce waste', title: 'Zero Waste & Landfill Diversion', icon: '📉', desc: 'Transition towards a closed-loop minimal trash footprint' },
                { id: 'Reuse existing materials', title: 'Reuse & Upcycle Existing Materials', icon: '♻️', desc: 'Repurpose old clothes, denim, glass, and wood with AI' },
                { id: 'Choose sustainable alternatives', title: 'Choose Sustainable Alternatives', icon: '🎋', desc: 'Swap everyday items for bamboo, hemp, and recycled products' },
                { id: 'Learn about sustainability', title: 'Learn & Build Eco Habits', icon: '📚', desc: 'Master green principles, recycling codes, and carbon literacy' },
              ].map(goal => {
                const isSelected = sustainabilityGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSustainabilityGoal(goal.id as any)}
                    type="button"
                    className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-900 text-sm">{goal.title}</div>
                        <div className="text-xs text-stone-700">{goal.desc}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="pt-6 border-t border-stone-200 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-3 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium flex items-center gap-1.5 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => setStep(s => s + 1)}
            className="flex-1 max-w-[200px] ml-auto px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="flex-1 ml-auto px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            Launch My Dashboard
          </button>
        )}
      </div>
    </div>
  );
};
