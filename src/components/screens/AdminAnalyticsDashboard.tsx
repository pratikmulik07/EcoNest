import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  TrendingUp,
  Users,
  Search,
  Camera,
  Layers,
  BarChart3,
  PieChart,
  RefreshCw,
  Award,
  ArrowUpRight,
  Filter,
  Activity,
  Zap,
} from 'lucide-react';

export const AdminAnalyticsDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'segments' | 'campaigns' | 'telemetry'>('overview');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/stats');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-stone-50 w-full max-w-4xl max-h-[94vh] rounded-3xl overflow-y-auto flex flex-col shadow-2xl animate-scaleUp">
        {/* Dashboard Top Header */}
        <div className="sticky top-0 z-20 bg-stone-900 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  Capstone Marketing Analytics Console
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-400/20 text-emerald-300">
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Eco Product Branding & Digital Consumer Engagement Metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-100 px-5 pt-3 border-b border-stone-200 flex gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'KPI Overview', icon: BarChart3 },
            { id: 'funnel', label: 'Conversion Funnel', icon: TrendingUp },
            { id: 'segments', label: 'User Segments', icon: Users },
            { id: 'campaigns', label: 'Marketing Campaigns', icon: Zap },
            { id: 'telemetry', label: 'Live Events Feed', icon: Activity },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Content */}
        <div className="p-5 flex-1 space-y-6">
          {loading && !data ? (
            <div className="py-20 text-center text-xs text-stone-700 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              <p>Aggregating digital marketing analytics...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                      <span className="text-[11px] font-semibold text-stone-600 block">Total Users</span>
                      <span className="text-2xl font-black text-stone-900 mt-1 block">
                        {data?.stats?.totalUsers || 164}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-0.5 mt-1">
                        <ArrowUpRight className="w-3 h-3" /> +14.2% this week
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                      <span className="text-[11px] font-semibold text-stone-600 block">30-Day Retention</span>
                      <span className="text-2xl font-black text-emerald-900 mt-1 block">
                        {data?.stats?.retentionRate30d || '54.2%'}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-0.5 mt-1">
                        <ArrowUpRight className="w-3 h-3" /> High loyalty index
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                      <span className="text-[11px] font-semibold text-stone-600 block">AI Reuse Scans</span>
                      <span className="text-2xl font-black text-stone-900 mt-1 block">
                        {data?.stats?.materialScans || 72}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-0.5 mt-1">
                        <ArrowUpRight className="w-3 h-3" /> +28% adoption
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                      <span className="text-[11px] font-semibold text-stone-600 block">Ideas Saved</span>
                      <span className="text-2xl font-black text-stone-900 mt-1 block">
                        {data?.stats?.reuseIdeasSaved || 48}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-0.5 mt-1">
                        <ArrowUpRight className="w-3 h-3" /> High purchase intent
                      </span>
                    </div>
                  </div>

                  {/* Secondary Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Share Distribution */}
                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 mb-3 flex items-center justify-between">
                        <span>Category Engagement Share</span>
                        <span className="text-emerald-700 text-[11px] normal-case">Bamboo leads</span>
                      </h3>
                      <div className="space-y-3">
                        {data?.popularCategories?.map((cat: any) => (
                          <div key={cat.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-stone-800">{cat.name} Products</span>
                              <span className="text-stone-600">
                                {cat.share}% ({cat.growth})
                              </span>
                            </div>
                            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-600 h-full rounded-full"
                                style={{ width: `${cat.share}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Search & Material Discovery Trends */}
                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 mb-3 flex items-center justify-between">
                        <span>Top Consumer Search Terms</span>
                        <Search className="w-3.5 h-3.5 text-stone-400" />
                      </h3>
                      <div className="space-y-2">
                        {data?.searchTrends?.map((trend: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                          >
                            <span className="font-medium text-stone-800">
                              #{i + 1} "{trend.term}"
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {trend.count} searches
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Reuse Materials Detected */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-800 mb-3 flex items-center justify-between">
                      <span>Most Detected Materials in "What Can I Make?"</span>
                      <Camera className="w-4 h-4 text-emerald-700" />
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {data?.topMaterialsDetected?.map((mat: any, i: number) => (
                        <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                          <span className="font-bold text-stone-900 block">{mat.material}</span>
                          <span className="text-[11px] text-stone-700 mt-1 block">
                            Top Idea: <span className="text-emerald-800 font-semibold">{mat.topIdea}</span>
                          </span>
                          <span className="text-[10px] text-stone-600 block mt-1">
                            {mat.count} photo uploads
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONVERSION FUNNEL */}
              {activeTab === 'funnel' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-emerald-900 text-white rounded-2xl">
                    <h3 className="font-bold text-sm">Sustainable Product Conversion Funnel</h3>
                    <p className="text-xs text-emerald-200 mt-1">
                      Tracking drop-off rates across Discovery, Product Browsing, AI Reuse Engagement, and Custom Artisan / Purchase Conversion.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {data?.funnel?.map((step: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span className="font-bold text-stone-900">{step.stage}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-stone-900 text-sm">{step.count} users</span>
                            <span className="text-[11px] text-stone-600 block">Drop-off: {step.dropOff}</span>
                          </div>
                        </div>

                        <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-700 to-emerald-500 h-full rounded-full transition-all"
                            style={{
                              width: `${Math.max(15, (step.count / (data.funnel[0]?.count || 200)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: USER SEGMENTS */}
              {activeTab === 'segments' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-stone-900 text-white rounded-2xl">
                    <h3 className="font-bold text-sm">Behavioral User Segmentation (Section 24)</h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Algorithmic segmentation based on educational reading, catalog filtering, budget focus, and AI material upcycling usage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'Eco Explorer', count: data?.segments?.['Eco Explorer'] || 42, color: 'bg-emerald-600', desc: 'High content engagement, reads sustainability guides and tips.' },
                      { name: 'Product Explorer', count: data?.segments?.['Product Explorer'] || 28, color: 'bg-teal-600', desc: 'Frequently browses bamboo, recycled, and reusable catalogues.' },
                      { name: 'Reuse Enthusiast', count: data?.segments?.['Reuse Enthusiast'] || 35, color: 'bg-indigo-600', desc: 'Repeatedly uploads photos in "What Can I Make?" and saves DIY blueprints.' },
                      { name: 'Price Conscious', count: data?.segments?.['Price Conscious'] || 19, color: 'bg-amber-600', desc: 'Filters products under ₹500 and monitors budget-friendly deals.' },
                      { name: 'New User', count: data?.segments?.['New User'] || 14, color: 'bg-sky-600', desc: 'Recently registered; exploring initial dashboard recommendations.' },
                      { name: 'Inactive User', count: data?.segments?.['Inactive User'] || 7, color: 'bg-stone-500', desc: 'Dormant for >14 days; targeted for automated re-engagement push.' },
                    ].map(seg => (
                      <div key={seg.name} className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-stone-900">{seg.name}</span>
                          <span className="text-xs font-black text-stone-900">{seg.count} users</span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-snug">{seg.desc}</p>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-3">
                          <div
                            className={`${seg.color} h-full rounded-full`}
                            style={{ width: `${Math.min(100, seg.count * 2)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CAMPAIGNS */}
              {activeTab === 'campaigns' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-emerald-900 text-white rounded-2xl">
                    <h3 className="font-bold text-sm">Active Digital Marketing Campaigns</h3>
                    <p className="text-xs text-emerald-200 mt-1">
                      Channel attribution for push notifications, AI camera triggers, and personalized product modules.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {data?.campaigns?.map((camp: any) => (
                      <div key={camp.id} className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-stone-900">{camp.name}</span>
                            <span className="text-[11px] text-stone-600 block">{camp.channel}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {camp.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-100 text-center text-xs">
                          <div>
                            <span className="text-stone-600 block text-[10px]">Impressions</span>
                            <span className="font-bold text-stone-800">{camp.impressions}</span>
                          </div>
                          <div>
                            <span className="text-stone-600 block text-[10px]">Clicks</span>
                            <span className="font-bold text-stone-800">{camp.clicks}</span>
                          </div>
                          <div>
                            <span className="text-stone-600 block text-[10px]">CTR</span>
                            <span className="font-bold text-emerald-700">{camp.ctr}</span>
                          </div>
                          <div>
                            <span className="text-stone-600 block text-[10px]">Conversions</span>
                            <span className="font-bold text-stone-900">{camp.conversions}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TELEMETRY / LIVE EVENTS */}
              {activeTab === 'telemetry' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-stone-700 px-1">
                    <span>Recent Client Telemetry Stream</span>
                    <span>Stored in Backend Memory</span>
                  </div>

                  <div className="bg-stone-900 text-stone-300 font-mono text-[11px] p-4 rounded-2xl overflow-x-auto max-h-96 space-y-2 shadow-inner">
                    {data?.recentEvents?.map((ev: any, i: number) => (
                      <div key={ev.id || i} className="border-b border-stone-800/80 pb-1.5 flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0">[{new Date(ev.timestamp).toLocaleTimeString()}]</span>
                        <span className="text-amber-300 font-bold shrink-0">{ev.eventType}</span>
                        <span className="text-stone-400 truncate">
                          {JSON.stringify(ev.payload || {})}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
