import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReuseIdea } from '../../types';
import { X, Hammer, CheckCircle2, Send, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GetItMadeModal: React.FC<{ idea: ReuseIdea; onClose: () => void }> = ({
  idea,
  onClose,
}) => {
  const { profile, addNotification, trackEvent } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(idea.customization?.size || 'Standard');
  const [notes, setNotes] = useState('Please preserve the authentic wash and pocket structure.');
  const [contactEmail, setContactEmail] = useState(profile.email || 'user@example.com');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/custom-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: idea.name,
          materials: idea.materialsRequired,
          quantity,
          size,
          customization: idea.customization || { default: true },
          notes,
          contactEmail,
        }),
      });

      const data = await res.json();
      setSubmitted(true);
      trackEvent('get_it_made_submitted', { ideaName: idea.name, quantity });

      try {
        confetti({ particleCount: 60, spread: 70 });
      } catch {}

      addNotification({
        title: 'Artisan Request Logged! 🛠️',
        message: `Your request to craft "${idea.name}" has been logged. An artisan partner is being assigned.`,
        type: 'reuse',
        targetScreen: 'saved',
      });
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-50 w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-md px-4 py-3 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Hammer className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Get It Made Service</h2>
              <p className="text-[11px] text-stone-700">Zero-Waste Artisan Crafting</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 animate-fadeIn my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Request Successfully Received!</h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              We have dispatched your material specifications and design customization to our local zero-waste artisan network. You will receive an email update at <span className="font-semibold text-stone-800">{contactEmail}</span>.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-medium max-w-xs mx-auto">
              Estimated crafting turnaround: 3-5 business days. You've earned <span className="font-bold">+35 Eco Points</span>!
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs shadow-sm hover:bg-emerald-800 transition-all"
            >
              Back to App
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Value Proposition Box */}
            <div className="p-3.5 bg-emerald-900 text-white rounded-2xl flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-300 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Don't have time to stitch or build?</h4>
                <p className="text-[11px] text-emerald-100 leading-snug mt-0.5">
                  Send your unused material or drop it at a partner hub. A skilled local artisan will craft it for you.
                </p>
              </div>
            </div>

            {/* Target Project Summary */}
            <div className="p-3 bg-white rounded-xl border border-stone-200/80 flex items-center gap-3">
              <img
                src={idea.previewUrl}
                alt={idea.name}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                  Selected Creation
                </span>
                <h4 className="text-sm font-bold text-stone-900 leading-tight">{idea.name}</h4>
                <p className="text-[11px] text-stone-700 mt-0.5">
                  Materials: {idea.materialsRequired.join(', ')}
                </p>
              </div>
            </div>

            {/* Quantity & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Quantity</label>
                <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-xs text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Target Size</label>
                <select
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Compact (Mini)">Compact (Mini)</option>
                  <option value="Standard">Standard</option>
                  <option value="Oversized (Maxi)">Oversized (Maxi)</option>
                </select>
              </div>
            </div>

            {/* Additional Instructions */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Additional Instructions for Artisan
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Keep original label intact, reinforce handle stitches, etc."
                className="w-full p-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Fair Wage Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-stone-700 bg-stone-100 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% of tailoring charges go directly to certified local artisan women.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                'Submitting Request...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Artisan Order Request
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
