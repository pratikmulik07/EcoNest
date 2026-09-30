import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReuseIdea } from '../../types';
import {
  X,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  Scissors,
  Wrench,
  Layers,
  ArrowRight,
  Palette,
  CheckCircle2,
  Hammer,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReuseDetailModal: React.FC<{ idea: ReuseIdea; onClose: () => void }> = ({
  idea,
  onClose,
}) => {
  const { isReuseIdeaSaved, toggleSaveReuseIdea, openModal, trackEvent } = useApp();
  const [activeStepTab, setActiveStepTab] = useState<'overview' | 'steps'>('overview');
  const [copied, setCopied] = useState(false);

  const isSaved = isReuseIdeaSaved(idea.id);

  const handleShare = () => {
    trackEvent('reuse_idea_share', { ideaTitle: idea.name, ideaId: idea.id });
    if (navigator.share) {
      navigator.share({
        title: `What Can I Make: ${idea.name}`,
        text: `I discovered how to upcycle materials into a ${idea.name} with AI!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCustomize = () => {
    trackEvent('reuse_idea_customize_click', { ideaTitle: idea.name });
    openModal('customize', idea);
  };

  const handleGetItMade = () => {
    trackEvent('reuse_idea_get_it_made_click', { ideaTitle: idea.name });
    openModal('getItMade', idea);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-50 w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-md px-4 py-3 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {idea.matchPercentage}% AI Match
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                idea.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700'
                  : idea.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {idea.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-200/70 text-stone-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleSaveReuseIdea(idea)}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-emerald-700 bg-emerald-50' : 'text-stone-600 hover:bg-stone-200/70'
              }`}
              title={isSaved ? 'Saved idea' : 'Save idea'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-emerald-700' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copied && (
          <div className="bg-emerald-700 text-white text-xs py-1.5 px-4 text-center font-medium animate-fadeIn">
            ✓ Upcycling project link copied!
          </div>
        )}

        {/* Hero Visual Preview */}
        <div className="relative aspect-16/10 bg-stone-200 overflow-hidden">
          <img
            src={idea.previewUrl}
            alt={idea.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {idea.estimatedTime}
          </div>
          <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-200 text-[10px] px-2 py-0.5 rounded-md">
            AI-Generated Concept Visual
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Title & Quick Stats */}
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight leading-snug">
              {idea.name}
            </h2>
            <p className="text-xs text-stone-700 mt-1">
              Estimated effort: <span className="font-semibold text-stone-800">{idea.estimatedTime}</span> • Skill level: <span className="font-semibold text-stone-800">{idea.difficulty}</span>
            </p>
          </div>

          {/* Quick Segment Switcher: Overview vs Step-by-Step Instructions */}
          <div className="flex bg-stone-200/70 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveStepTab('overview')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeStepTab === 'overview'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Overview & Materials
            </button>
            <button
              onClick={() => setActiveStepTab('steps')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeStepTab === 'steps'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Step-by-Step Guide ({idea.steps.length})
            </button>
          </div>

          {activeStepTab === 'overview' ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Why This Material is Suitable */}
              <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/60">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Why Your Material is Suitable
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  {idea.suitabilityReason}
                </p>
              </div>

              {/* Sustainability Benefit Card */}
              <div className="bg-stone-900 text-white rounded-2xl p-4">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                  Environmental Divergence
                </span>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {idea.sustainabilityBenefit}
                </p>
              </div>

              {/* Materials & Tools Required */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                      Materials Required
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {idea.materialsRequired.map((mat, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                        <span className="text-emerald-600">•</span>
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Scissors className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                      Tools Required
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {idea.toolsRequired.map((tool, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                        <span className="text-emerald-600">•</span>
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Step-by-Step Instructions */
            <div className="space-y-3 animate-fadeIn">
              <h3 className="font-bold text-sm text-stone-900 mb-1">How to Make: Step-by-Step Guide</h3>
              <p className="text-xs text-stone-700 mb-3">
                Follow these instructions carefully. Always use proper precautions when cutting or fastening materials.
              </p>
              <div className="space-y-3">
                {idea.steps.map((stepText, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="text-xs text-stone-800 leading-relaxed font-medium">
                      {stepText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar (Customize, How to Make, Get It Made, Save) */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 border-t border-stone-200 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveReuseIdea(idea)}
              className={`py-3 px-3.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                isSaved
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-700' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save Idea'}</span>
            </button>

            <button
              onClick={handleCustomize}
              className="flex-1 py-3 px-3 rounded-xl border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Palette className="w-4 h-4 text-emerald-700" />
              Customize Design
            </button>

            <button
              onClick={handleGetItMade}
              className="flex-1 py-3 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Hammer className="w-4 h-4" />
              Get It Made
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
