import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalArticle } from '../../types';
import { X, BookOpen, CheckCircle, Share2, Sparkles, ThumbsUp, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArticleDetailModal: React.FC<{ article: EducationalArticle; onClose: () => void }> = ({
  article,
  onClose,
}) => {
  const { profile, markArticleRead, trackEvent } = useApp();
  const [likes, setLikes] = useState(article.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const isRead = profile.readArticleIds.includes(article.id);

  const handleCompleteRead = () => {
    markArticleRead(article.id);
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      trackEvent('article_liked', { articleId: article.id });
    }
  };

  const handleShare = () => {
    trackEvent('article_shared', { articleId: article.id });
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-50 w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-md px-4 py-3 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {article.category}
            </span>
            <span className="text-xs text-stone-700">{article.readTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-200/70 text-stone-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
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
            ✓ Article link copied to clipboard!
          </div>
        )}

        {/* Hero Image */}
        <div className="relative aspect-16/9 bg-stone-200 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] text-emerald-300 font-semibold tracking-wide uppercase">
              {article.author} • {article.publishedDate}
            </span>
            <h2 className="text-lg font-bold leading-tight mt-0.5 text-white">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* Summary Callout */}
          <div className="p-3.5 bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-xl text-xs text-emerald-950 leading-relaxed font-medium">
            {article.summary}
          </div>

          {/* Key Takeaways Box */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                Key Actionable Takeaways
              </h3>
            </div>
            <ul className="space-y-2">
              {article.keyTakeaways.map((item, i) => (
                <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Paragraphs */}
          <div className="space-y-3.5 text-stone-800 text-sm leading-relaxed">
            {article.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200/70 text-stone-700 text-[11px]"
              >
                <Tag className="w-3 h-3 text-stone-700" />
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={handleLike}
            className={`px-3 py-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              hasLiked
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-emerald-600' : ''}`} />
            <span>{likes} Helpful</span>
          </button>

          {isRead ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              Completed (+20 Eco Points)
            </div>
          ) : (
            <button
              onClick={handleCompleteRead}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              Mark as Read (+20 Pts)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
