import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_MATERIAL_PRESETS, SampleMaterialPreset } from '../../data/sampleMaterials';
import { DetectedMaterial, ReuseIdea } from '../../types';
import {
  Camera,
  UploadCloud,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
  Bookmark,
  CheckCircle2,
  Clock,
  Palette,
  Hammer,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReuseScreen: React.FC = () => {
  const { openModal, toggleSaveReuseIdea, isReuseIdeaSaved, recordScannedMaterial, trackEvent } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Uploaded images state (supports multiple materials!)
  const [uploadedImages, setUploadedImages] = useState<{ id: string; url: string; base64?: string; name: string }[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<SampleMaterialPreset | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedMaterials, setDetectedMaterials] = useState<DetectedMaterial[]>([]);
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  const [reuseIdeas, setReuseIdeas] = useState<ReuseIdea[]>([]);
  const [analysisSource, setAnalysisSource] = useState<string>('');

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedImages(prev => [
          ...prev,
          {
            id: `img_${Date.now()}_${Math.random()}`,
            url: URL.createObjectURL(file),
            base64,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Preset Selection for fast instant demo
  const handleSelectPreset = (preset: SampleMaterialPreset) => {
    setSelectedPreset(preset);
    setUploadedImages([
      {
        id: preset.id,
        url: preset.imageUrl,
        name: preset.name,
      },
    ]);
  };

  // Trigger AI Material Analysis
  const handleRunAnalysis = async () => {
    if (uploadedImages.length === 0 && !selectedPreset) return;

    setIsAnalyzing(true);
    trackEvent('ai_photo_upload', {
      imagesCount: uploadedImages.length,
      samplePreset: selectedPreset?.name || 'Custom upload',
    });

    try {
      const primaryImage = uploadedImages[0];
      const materialHints = selectedPreset
        ? selectedPreset.materialsHint
        : uploadedImages.map(img => img.name);
      const colors = selectedPreset ? selectedPreset.colors : ['Indigo Blue', 'Natural'];

      const res = await fetch('/api/analyze-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: primaryImage?.base64 || '',
          mimeType: 'image/jpeg',
          materialHints,
          colors,
          materialsCount: uploadedImages.length,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDetectedMaterials(data.detectedMaterials || []);
        setAnalysisSummary(data.summary || '');
        setReuseIdeas(data.compatibleIdeas || []);
        setAnalysisSource(data.source || 'gemini-3.8-flash');

        if (data.detectedMaterials && data.detectedMaterials[0]) {
          recordScannedMaterial(data.detectedMaterials[0].material);
        }

        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {}
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    if (uploadedImages.length <= 1) {
      setSelectedPreset(null);
      setDetectedMaterials([]);
      setReuseIdeas([]);
    }
  };

  const clearAll = () => {
    setUploadedImages([]);
    setSelectedPreset(null);
    setDetectedMaterials([]);
    setAnalysisSummary('');
    setReuseIdeas([]);
  };

  return (
    <div className="pb-24 pt-2 px-4 space-y-6 animate-fadeIn">
      {/* Title & Concept Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
            <Camera className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Intelligent Circular Reuse
          </span>
        </div>
        <h1 className="text-xl font-black text-stone-900 tracking-tight">
          WHAT CAN I MAKE? ♻️
        </h1>
        <p className="text-xs text-stone-700 mt-1 leading-relaxed">
          Upload photos of leftover materials—old denim, timber pallets, or glass jars. AI identifies material condition and generates functional upcycling projects.
        </p>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload & Camera Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="p-4 rounded-2xl border border-emerald-600/30 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
        >
          <Camera className="w-6 h-6 text-emerald-700" />
          <span className="text-xs font-bold">Take Photo</span>
          <span className="text-[10px] text-stone-700">Open Camera</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-900 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
        >
          <UploadCloud className="w-6 h-6 text-stone-700" />
          <span className="text-xs font-bold">Upload Photos</span>
          <span className="text-[10px] text-stone-700">Single or Multiple</span>
        </button>
      </div>

      {/* Quick Test Presets (Instant Capstone Evaluation) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Quick Test Presets (Instant Demo)
          </span>
          <span className="text-[10px] text-stone-700">Tap to load</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {SAMPLE_MATERIAL_PRESETS.map(preset => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center gap-2 p-2 rounded-xl border shrink-0 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/20'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <img
                  src={preset.imageUrl}
                  alt={preset.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <div className="text-xs font-semibold text-stone-900 max-w-[130px] truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-stone-600">{preset.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected / Uploaded Materials Preview Strip */}
      {uploadedImages.length > 0 && (
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">
              Uploaded Material Photos ({uploadedImages.length})
            </span>
            <button
              onClick={clearAll}
              className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-0.5"
            >
              <Trash2 className="w-3 h-3" /> Clear all
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto py-1">
            {uploadedImages.map(img => (
              <div key={img.id} className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-stone-200 group">
                <img src={img.url} alt="material" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Add another material photo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-600 flex flex-col items-center justify-center text-stone-700 hover:text-emerald-700 shrink-0 transition-colors"
            >
              <Plus className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-bold">+ Material</span>
            </button>
          </div>

          {/* Multiple materials note */}
          {uploadedImages.length > 1 && (
            <div className="p-2.5 bg-indigo-50 border border-indigo-200/70 rounded-xl text-xs text-indigo-950 font-medium flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Multi-material analysis enabled: AI will propose hybrid ideas combining these materials!</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Material Composition with Vision AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Material & Generate "What Can I Make?"
              </>
            )}
          </button>
        </div>
      )}

      {/* AI ANALYSIS RESULTS (Detected Properties) */}
      {detectedMaterials.length > 0 && (
        <div className="space-y-4 animate-slideUp">
          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                  AI Material Detection Analysis
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                {analysisSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash Vision' : 'Smart Heuristics Engine'}
              </span>
            </div>

            {/* Detected material properties */}
            <div className="grid grid-cols-2 gap-2.5">
              {detectedMaterials.map((mat, i) => (
                <div key={i} className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1">
                  <div className="font-extrabold text-stone-900 text-sm">{mat.material}</div>
                  <div className="text-[11px] text-stone-600">
                    Color: <span className="font-semibold text-stone-800">{mat.dominantColor}</span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Pattern: <span className="font-semibold text-stone-800">{mat.pattern}</span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Condition: <span className="font-semibold text-emerald-700">{mat.condition}</span>
                  </div>
                  <div className="text-[10px] text-stone-600 pt-1 border-t border-stone-200 flex justify-between">
                    <span>Confidence: {mat.confidence}%</span>
                    <span className="text-emerald-700 font-bold">Eco Score: {mat.ecoScore}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Summary */}
            {analysisSummary && (
              <p className="text-xs text-stone-700 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 font-medium leading-relaxed">
                {analysisSummary}
              </p>
            )}
          </div>

          {/* Compatible "What Can I Make?" Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                Recommended Upcycle Creations ({reuseIdeas.length})
              </h3>
              <span className="text-[10px] text-stone-700">Tap for DIY steps & customization</span>
            </div>

            <div className="space-y-3">
              {reuseIdeas.map(idea => {
                const isSaved = isReuseIdeaSaved(idea.id);
                return (
                  <div
                    key={idea.id}
                    onClick={() => openModal('reuse', idea)}
                    className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs cursor-pointer hover:border-emerald-500/60 transition-all flex gap-3.5 items-center justify-between"
                  >
                    <img
                      src={idea.previewUrl}
                      alt={idea.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {idea.matchPercentage}% Match
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            idea.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {idea.difficulty}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                        {idea.name}
                      </h4>

                      <p className="text-[11px] text-stone-600 line-clamp-1">
                        {idea.suitabilityReason}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-stone-700 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {idea.estimatedTime}
                        </span>
                        <span>{idea.materialsRequired.length} items needed</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleSaveReuseIdea(idea);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          isSaved ? 'text-emerald-700 bg-emerald-50' : 'text-stone-600 hover:bg-stone-100'
                        }`}
                        title={isSaved ? 'Saved' : 'Save Idea'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-700' : ''}`} />
                      </button>
                      <ArrowRight className="w-4 h-4 text-stone-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Educational Explainer Note */}
      <div className="bg-stone-100 rounded-2xl p-4 text-xs text-stone-700 space-y-1.5 border border-stone-200/60">
        <div className="flex items-center gap-1.5 font-bold text-stone-900">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          How "What Can I Make?" Works
        </div>
        <p className="leading-relaxed">
          1. <strong>Vision Analysis:</strong> Computer vision estimates material weave, tensile properties, and condition.<br />
          2. <strong>Upcycling Compatibility:</strong> Matches suitable templates (bags, sleeves, planters) with minimum cuts.<br />
          3. <strong>Circular Freedom:</strong> Make it yourself with DIY steps, or use "Get It Made" to connect with zero-waste artisans.
        </p>
      </div>
    </div>
  );
};
