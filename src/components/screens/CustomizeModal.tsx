import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReuseIdea } from '../../types';
import { X, Sparkles, Check, Palette, RefreshCw, Wand2, Hammer, Bookmark } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomizeModal: React.FC<{ idea: ReuseIdea; onClose: () => void }> = ({
  idea,
  onClose,
}) => {
  const { openModal, toggleSaveReuseIdea, trackEvent } = useApp();

  const [size, setSize] = useState('Standard');
  const [handleType, setHandleType] = useState('Reinforced Woven Cotton');
  const [pocket, setPocket] = useState('Front Patch Pocket');
  const [designStyle, setDesignStyle] = useState('Minimalist Botanical');
  const [colorTheme, setColorTheme] = useState('Natural Indigo');
  const [customText, setCustomText] = useState('REUSE • RENEW');

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    trackEvent('ai_design_customize_generate', {
      ideaName: idea.name,
      size,
      handleType,
      pocket,
      designStyle,
      colorTheme,
      customText,
    });

    try {
      const res = await fetch('/api/customize-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaName: idea.name,
          size,
          handleType,
          pocket,
          designStyle,
          textCustom: customText,
          colorTheme,
        }),
      });

      const data = await res.json();
      setPreviewData(data);
      try {
        confetti({ particleCount: 40, spread: 50 });
      } catch {}
    } catch (e) {
      console.error(e);
      setPreviewData({
        previewDescription: `Customized ${idea.name} with ${size} dimensions, ${handleType} handle, and ${designStyle} styling in ${colorTheme}.`,
        estimatedArtisanCraftTime: '2-3 working days',
        estimatedMaterialDivertedKg: 0.85,
        waterSavedLiters: 2400,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceedToGetItMade = () => {
    onClose();
    openModal('getItMade', {
      ...idea,
      customization: {
        size,
        handleType,
        pocket,
        designStyle,
        colorTheme,
        customText,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-50 w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-md px-4 py-3 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Palette className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-stone-900">AI Design & Customization</h2>
              <p className="text-[11px] text-stone-700">{idea.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-5">
          {/* AI Banner */}
          <div className="p-3 bg-emerald-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wand2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <div>
                <span className="text-xs font-bold block text-white">Generative Concept Studio</span>
                <span className="text-[10px] text-emerald-200">
                  Configure structural elements & generate a tailored upcycle blueprint.
                </span>
              </div>
            </div>
          </div>

          {/* Option A: Dimensions / Size */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
              1. Dimensions & Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Compact (Mini)', 'Standard', 'Oversized (Maxi)'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                    size === s
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Option B: Handle & Strap Type */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
              2. Handle & Carry Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Reinforced Woven Cotton',
                'Braided Jute / Twine',
                'Original Denim Hem Straps',
                'Recycled Seatbelt Webbing',
              ].map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHandleType(h)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    handleType === h
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Option C: Pocket & Storage Utility */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
              3. Pocket & Organization
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Original Jeans Back Pocket',
                'Hidden Zippered Pouch',
                'Dual Side Bottle Holders',
                'Minimal Clean (No Pocket)',
              ].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPocket(p)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    pocket === p
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Option D: Color Accent & Motif */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
              4. Palette & Aesthetic Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Natural Indigo', color: '#1e3a8a' },
                { name: 'Sage & Forest Green', color: '#166534' },
                { name: 'Raw Unbleached Ecru', color: '#d97706' },
                { name: 'Charcoal Monolith', color: '#374151' },
              ].map(t => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setColorTheme(t.name)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    colorTheme === t.name
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Option E: Custom Monogram or Text */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1.5">
              5. Custom Stamped / Embroidered Text
            </label>
            <input
              type="text"
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="e.g. PRIYA • ZERO WASTE 2026"
              maxLength={30}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
          </div>

          {/* Generate Preview Button */}
          <button
            type="button"
            onClick={handleGeneratePreview}
            disabled={isGenerating}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Synthesizing Custom Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate AI Preview & Specs
              </>
            )}
          </button>

          {/* AI Generated Preview Output Card */}
          {previewData && (
            <div className="bg-white rounded-2xl p-4 border-2 border-emerald-600/60 shadow-md space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  AI Concept Generated
                </span>
                <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                  AI Blueprint
                </span>
              </div>

              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {previewData.previewDescription}
              </p>

              <div className="p-3 bg-stone-100 rounded-xl grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-600 block">Crafting Time:</span>
                  <span className="font-semibold text-stone-900">{previewData.estimatedArtisanCraftTime}</span>
                </div>
                <div>
                  <span className="text-stone-600 block">Landfill Diverted:</span>
                  <span className="font-semibold text-emerald-800">{previewData.estimatedMaterialDivertedKg} kg</span>
                </div>
              </div>

              <div className="text-[10px] text-stone-700 italic border-t border-stone-200 pt-2">
                * Note: Clearly labeled AI-generated design concept for visualization. Actual handmade results depend on original material wear and artisan cut lines.
              </div>

              <button
                type="button"
                onClick={handleProceedToGetItMade}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Hammer className="w-3.5 h-3.5" />
                Send Custom Blueprint to Artisan ("Get It Made")
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
