import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, FileText, AlertTriangle, GitBranch, Map,
  BarChart3, Search, Filter, ArrowUpRight, CheckCircle2, Clock,
  MapPin, Wrench, Eye, ChevronRight, X, Shield, Activity,
  Layers, User, LogOut, ChevronDown, Bell, TrendingUp, Radio,
  Zap, Building2
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import RiskBadge from '../components/shared/RiskBadge';
import StatusBadge from '../components/shared/StatusBadge';
import { reports, heatmapZones, trendData, hazardCategories, causalChains, predictions, facilities } from '../data/mockData';
import type { RiskLevel } from '../types';
import type { Role } from '../App';
import { PredictionsView, PredictionDetail } from './PredictionsView';
import SensorIntelligenceView from './SensorIntelligenceView';
import EvidenceFusionView from './EvidenceFusionView';
import { getDashboardSummary, type DashboardSummary } from '../api';

type DashView =
  | 'overview'
  | 'predictions'
  | 'sensor-intel'
  | 'evidence-fusion'
  | 'reports'
  | 'sif'
  | 'chains'
  | 'heatmap'
  | 'analytics'
  | 'report-detail'
  | 'chain-detail'
  | 'prediction-detail'
  | 'explorer';

// ── Nav config ────────────────────────────────────────────────────────────────
const navGroups = [
  {
    label: 'Predictive Intelligence',
    items: [
      { id: 'overview'       as DashView, label: 'Command Center',        icon: LayoutDashboard },
      { id: 'predictions'    as DashView, label: 'Active Predictions',    icon: TrendingUp, badge: '6' },
      { id: 'sensor-intel'   as DashView, label: 'Sensor Intelligence',   icon: Radio },
      { id: 'evidence-fusion'as DashView, label: 'Evidence Fusion',       icon: Zap },
    ],
  },
  {
    label: 'Safety Reports',
    items: [
      { id: 'reports' as DashView, label: 'All Reports',       icon: FileText },
      { id: 'sif'     as DashView, label: 'SIF Precursors',   icon: AlertTriangle, badge: '47' },
      { id: 'chains'  as DashView, label: 'Failure Pathways', icon: GitBranch },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'heatmap'  as DashView, label: 'Predictive Heatmap', icon: Map },
      { id: 'analytics'as DashView, label: 'Analytics',           icon: BarChart3 },
      { id: 'explorer' as DashView, label: 'Report Explorer',     icon: Search },
    ],
  },
];

const viewTitles: Record<DashView, string> = {
  overview:          'Safety Command Center',
  predictions:       'Active Predictions',
  'sensor-intel':    'Sensor Intelligence',
  'evidence-fusion': 'Evidence Fusion',
  reports:           'All Reports',
  sif:               'SIF Precursors',
  chains:            'Potential Failure Pathways',
  heatmap:           'Predictive Risk Heatmap',
  analytics:         'Analytics',
  'report-detail':   'Report Detail',
  'chain-detail':    'Failure Pathway Investigation',
  'prediction-detail':'Prediction Investigation',
  explorer:          'Report Explorer',
};

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav }: { active: DashView; onNav: (v: DashView) => void }) {
  return (
    <aside className="w-56 bg-[#0f1824] flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="px-5 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center justify-center shrink-0">
            <Shield size={14} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-white/35 font-mono uppercase tracking-widest leading-none">OIL India</p>
            <p className="text-sm font-black text-white leading-tight">RiskRadar</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-3 mb-2">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => onNav(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    active === id || (active === 'prediction-detail' && id === 'predictions')
                      ? 'bg-white/15 text-white'
                      : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono ${active === id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>{badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-white/10 shrink-0">
        <p className="text-[10px] text-white/20 font-mono">RiskRadar v1.0 · SIH 2026</p>
      </div>
    </aside>
  );
}

// ── Facility selector ─────────────────────────────────────────────────────────
function FacilitySelector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fac = facilities.find(f => f.id === selected) ?? facilities[0];

  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <Building2 size={12} className="text-slate-400" />
        {fac.name}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
          {facilities.map(f => (
            <button
              key={f.id}
              onClick={() => { onSelect(f.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left ${f.id === selected ? 'bg-slate-50' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${f.status === 'Critical' ? 'bg-red-500' : f.status === 'Elevated' ? 'bg-amber-400' : 'bg-green-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1a2235]">{f.name}</p>
                <p className="text-[10px] text-slate-400">{f.location}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[9px] font-mono font-bold text-red-500">{f.predictions} pred.</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Officer user menu ──────────────────────────────────────────────────────────
function OfficerUserMenu({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)} className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#1a2235] flex items-center justify-center">
            <span className="text-white text-xs font-semibold">PS</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="text-left leading-tight">
          <p className="text-xs font-semibold text-[#1a2235]">Dr. Priya Sharma</p>
          <p className="text-[10px] text-slate-400">Safety Officer</p>
        </div>
        <ChevronDown size={12} className="text-slate-400 ml-1" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
          {showProfile ? (
            <div className="px-3 py-2">
              <button onClick={() => setShowProfile(false)} className="text-[10px] text-slate-400 hover:text-[#1a2235] mb-2">← Back</button>
              <p className="text-xs font-bold text-[#1a2235]">Officer Profile</p>
              <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                <p>Dr. Priya Sharma</p>
                <p>Safety Officer</p>
                <p>OIL Assam Facility</p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                <p className="text-xs font-bold text-[#1a2235] mt-0.5">Safety Officer · OIL Assam</p>
              </div>
              <button onClick={() => setShowProfile(true)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <User size={13} className="text-slate-400" />Profile
              </button>
              <button onClick={() => setOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <LayoutDashboard size={13} className="text-slate-400" />Dashboard
              </button>
            </>
          )}
          <div className="border-t border-slate-100 mt-1 pt-1">
            <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={13} />Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Top bar ────────────────────────────────────────────────────────────────────
function TopBar({ title, facilityId, onFacilityChange, onLogout }: { title: string; facilityId: string; onFacilityChange: (id: string) => void; onLogout: () => void }) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0">
      <h1 className="text-base font-bold text-[#1a2235] flex-1">{title}</h1>
      <div className="flex items-center gap-3">
        <FacilitySelector selected={facilityId} onSelect={onFacilityChange} />
        <button className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          Last 30 Days <ChevronDown size={11} />
        </button>
        <button className="relative p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <OfficerUserMenu onLogout={onLogout} />
      </div>
    </div>
  );
}

// ── Predictive Overview ────────────────────────────────────────────────────────
function PredictiveOverview({ onNav, facilityId, summary }: { onNav: (v: DashView) => void; facilityId: string; summary: DashboardSummary | null }) {
  const fac = facilities.find(f => f.id === facilityId) ?? facilities[0];
  const isAssam = facilityId === 'assam';

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { l: 'Active Predictions',   v: summary?.activePredictions.toString() ?? (isAssam ? '6' : fac.predictions.toString()),   c: 'text-red-600',    sub: 'Potential failures' },
          { l: 'Critical Risk',         v: summary?.criticalPredictions.toString() ?? (isAssam ? '1' : '0'),   c: 'text-red-700',   sub: 'Needs immediate action' },
          { l: 'Sensor Anomalies',      v: isAssam ? '8' : '3',   c: 'text-amber-600', sub: 'Active deviations' },
          { l: 'SIF Precursors',        v: summary?.sifReports.toString() ?? fac.sif.toString(),     c: 'text-orange-600',sub: 'This month' },
          { l: 'Worker Obs. Signals',   v: summary?.totalReports.toString() ?? (isAssam ? '12' : '4'),  c: 'text-[#1a2235]', sub: 'Feeding predictions' },
        ].map(({ l, v, c, sub }) => (
          <div key={l} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{l}</p>
            <p className={`text-3xl font-black font-mono mt-1 ${c}`}>{v}</p>
            <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Top prediction alert */}
      {isAssam && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <TrendingUp size={22} className="text-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Top Priority Prediction</span>
              <RiskBadge level="HIGH" size="xs" />
            </div>
            <p className="text-base font-black text-[#1a2235]">Potential Compressor Mechanical Failure — C-101, Zone B</p>
            <p className="text-xs text-slate-500 mt-1">Score 84/100 · Horizon: Next 24 Hours · Confidence: High</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Vibration +23%', 'Temperature +25%', '3 worker reports', '2 historical matches'].map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-red-100 text-[10px] text-red-700 font-medium">{t}</span>
              ))}
            </div>
          </div>
          <button onClick={() => onNav('predictions')} className="shrink-0 px-4 py-2 rounded-xl bg-[#1a2235] text-white text-xs font-bold hover:bg-[#243049] transition-colors">
            Investigate <ChevronRight size={13} className="inline" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        {/* Predictive heatmap mini */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-[#1a2235]">Predictive Risk Heatmap</p>
            <button onClick={() => onNav('heatmap')} className="text-xs text-slate-400 hover:text-[#1a2235] flex items-center gap-1 transition-colors">
              Full view <ArrowUpRight size={11} />
            </button>
          </div>
          <PredictiveHeatmapMini onNav={onNav} />
        </div>

        {/* Active predictions compact */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-[#1a2235]">Active Predictions</p>
            <button onClick={() => onNav('predictions')} className="text-xs text-slate-400 hover:text-[#1a2235] flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {predictions.map(pred => (
              <div key={pred.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black font-mono text-[#1a2235]">{pred.score}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1a2235] truncate">{pred.title}</p>
                  <p className="text-[10px] text-slate-400">{pred.equipment} · {pred.horizon}</p>
                </div>
                <RiskBadge level={pred.risk} size="xs" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent worker reports + sensor anomalies */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-[#1a2235]">Recent Worker Observation Signals</p>
            <span className="text-[10px] text-slate-400">Feeding predictions</span>
          </div>
          <div className="divide-y divide-slate-50">
            {reports.slice(0, 4).map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0">{r.id}</span>
                <p className="text-xs text-slate-700 flex-1 line-clamp-1 italic">"{r.description}"</p>
                <RiskBadge level={r.risk} size="xs" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-[#1a2235]">Potential Failure Pathways</p>
            <button onClick={() => onNav('chains')} className="text-xs text-slate-400 hover:text-[#1a2235] transition-colors flex items-center gap-1">View all <ArrowUpRight size={11} /></button>
          </div>
          <div className="p-4 space-y-3">
            {causalChains.map(chain => (
              <div key={chain.id} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#1a2235]">{chain.title}</p>
                  <RiskBadge level={chain.risk} size="xs" />
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {chain.steps.slice(0, 3).map((s, i) => (
                    <span key={i} className="flex items-center gap-1 text-[10px] text-slate-500">
                      {s}{i < 2 && <ChevronRight size={9} className="text-slate-300" />}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-400">…</span>
                </div>
                <p className="text-[10px] text-amber-600 font-medium">→ Linked to {chain.linkedPrediction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Predictive Heatmap mini ────────────────────────────────────────────────────
const riskColors: Record<string, { bg: string; border: string; text: string; num: string; predicted: string }> = {
  CRITICAL: { bg: 'bg-red-100',    border: 'border-red-400',   text: 'text-red-800',   num: 'text-red-600',   predicted: 'bg-red-200 text-red-800'   },
  HIGH:     { bg: 'bg-orange-50',  border: 'border-orange-300',text: 'text-orange-800',num: 'text-orange-600',predicted: 'bg-orange-100 text-orange-800'},
  MEDIUM:   { bg: 'bg-amber-50',   border: 'border-amber-200', text: 'text-amber-800', num: 'text-amber-600', predicted: 'bg-amber-100 text-amber-800' },
  LOW:      { bg: 'bg-green-50',   border: 'border-green-200', text: 'text-green-700', num: 'text-green-600', predicted: 'bg-green-100 text-green-700' },
};

function PredictiveHeatmapMini({ onNav }: { onNav: (v: DashView) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {heatmapZones.map(zone => {
          const c = riskColors[zone.predictedRisk];
          const isCritical = zone.predictedRisk === 'CRITICAL';
          return (
            <button
              key={zone.id}
              onClick={() => onNav('heatmap')}
              className={`rounded-xl border-2 p-2.5 text-center hover:shadow-sm transition-all ${c.bg} ${isCritical ? c.border + ' ring-1 ring-red-300' : c.border}`}
            >
              <p className={`text-[10px] font-bold ${c.text}`}>{zone.name}</p>
              <p className={`text-xs font-mono font-black ${c.num}`}>{zone.predictedRisk}</p>
              {zone.activePredictions > 0 && (
                <p className="text-[9px] text-red-500 font-semibold">{zone.activePredictions} pred.</p>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-[9px] text-slate-400">
        <span className="font-semibold">Predicted Risk →</span>
        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(l => (
          <span key={l} className={`px-1.5 py-0.5 rounded font-bold ${riskColors[l].predicted}`}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ── Full Predictive Heatmap ────────────────────────────────────────────────────
function PredictiveHeatmapView() {
  const [selected, setSelected] = useState<string | null>('B');

  const sel = heatmapZones.find(z => z.id === selected);
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-bold text-[#1a2235]">Predictive Risk Heatmap — Assam Facility</p>
            <p className="text-xs text-slate-400 mt-0.5">Shows both current and predicted risk. Click a zone for details.</p>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-slate-400 font-semibold">Predicted Risk:</span>
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(l => (
              <span key={l} className={`px-2 py-0.5 rounded font-bold ${riskColors[l].predicted}`}>{l}</span>
            ))}
          </div>
        </div>

        <div className="border-2 border-slate-200 rounded-2xl p-4 bg-slate-50">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-4 text-center">Assam Facility · Compressor & Processing Block</p>
          <div className="grid grid-cols-3 gap-3">
            {heatmapZones.map(zone => {
              const c = riskColors[zone.predictedRisk];
              const isSelected = selected === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelected(zone.id === selected ? null : zone.id)}
                  className={`aspect-[3/2] rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all p-3 ${c.bg} ${isSelected ? 'border-[#1a2235] ring-2 ring-[#1a2235]/20' : c.border}`}
                >
                  <p className={`text-sm font-black ${c.text}`}>{zone.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-center">
                      <p className="text-[8px] text-slate-400 uppercase">Current</p>
                      <p className={`text-[10px] font-bold font-mono ${riskColors[zone.currentRisk].num}`}>{zone.currentRisk}</p>
                    </div>
                    <ChevronRight size={10} className="text-slate-300" />
                    <div className="text-center">
                      <p className="text-[8px] text-slate-400 uppercase">Predicted</p>
                      <p className={`text-[10px] font-black font-mono ${c.num}`}>{zone.predictedRisk}</p>
                    </div>
                  </div>
                  {zone.activePredictions > 0 && (
                    <span className="mt-1 text-[9px] font-bold text-red-500">{zone.activePredictions} active prediction{zone.activePredictions > 1 ? 's' : ''}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Zone detail */}
      {sel && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-black text-[#1a2235]">{sel.name} — {sel.description}</p>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { l: 'Current Risk',     v: sel.currentRisk,   color: riskColors[sel.currentRisk].num   },
              { l: 'Predicted Risk',   v: sel.predictedRisk, color: riskColors[sel.predictedRisk].num },
              { l: 'SIF Precursors',   v: sel.sif.toString(),   color: 'text-[#1a2235]' },
              { l: 'Active Predictions', v: sel.activePredictions.toString(), color: sel.activePredictions > 0 ? 'text-red-600' : 'text-green-600' },
            ].map(({ l, v, color }) => (
              <div key={l} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{l}</p>
                <p className={`text-lg font-black font-mono mt-1 ${color}`}>{v}</p>
              </div>
            ))}
          </div>
          {sel.patterns.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detected Patterns</p>
              {sel.patterns.map(p => (
                <div key={p} className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Zone comparison table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-bold text-[#1a2235]">Zone Risk Comparison</p>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Zone', 'Description', 'SIF Events', 'Current Risk', 'Predicted Risk', 'Active Predictions'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {heatmapZones.map(z => (
              <tr key={z.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-sm text-[#1a2235]">{z.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{z.description}</td>
                <td className="px-4 py-3 font-mono text-sm font-bold text-[#1a2235]">{z.sif}</td>
                <td className="px-4 py-3"><RiskBadge level={z.currentRisk} size="xs" /></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-xs font-semibold tracking-wide ${riskColors[z.predictedRisk].predicted} border ${riskColors[z.predictedRisk].border}`}>
                    <TrendingUp size={9} />
                    {z.predictedRisk}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm font-bold text-red-500">{z.activePredictions || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Reports View ───────────────────────────────────────────────────────────────
function ReportsView({ onReportClick }: { onReportClick: () => void }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? reports : reports.filter(r => r.risk === filter || r.zone === filter);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none text-[#1a2235] placeholder-slate-400 focus:border-[#1a2235] transition-colors" placeholder="Search reports…" />
        </div>
        {['All', 'HIGH', 'MEDIUM', 'Zone B'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-[#1a2235] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{f}</button>
        ))}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"><Filter size={13} /> Filters</button>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>{['Report ID','Date','Zone','Equipment','Hazard','Risk','Status','SIF',''].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs font-bold text-[#1a2235]">{r.id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.zone}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.equipment}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{r.hazard}</td>
                <td className="px-4 py-3"><RiskBadge level={r.risk} size="xs" /></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">{r.isSIF && <span className="px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-[9px] font-bold text-red-600 font-mono">SIF</span>}</td>
                <td className="px-4 py-3"><button onClick={onReportClick} className="text-slate-300 group-hover:text-[#1a2235] transition-colors"><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Chains View ────────────────────────────────────────────────────────────────
function ChainsView({ onChainClick }: { onChainClick: () => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Potential Failure Pathways</span> are AI-generated possible sequences detected from connected reports, sensor data, and historical patterns. Each pathway is linked to an active prediction. These are investigation aids — not confirmed causality.
        </p>
      </div>
      {causalChains.map(chain => (
        <div key={chain.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} className="text-amber-500" />
              <div>
                <p className="text-sm font-bold text-[#1a2235]">{chain.title}</p>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <MapPin size={10} />{chain.zone} <span>·</span> <Wrench size={10} />{chain.equipment} <span>·</span> {chain.reportCount} reports
                  <span className="ml-1 text-amber-600 font-semibold">→ {chain.linkedPrediction}</span>
                </p>
              </div>
            </div>
            <RiskBadge level={chain.risk} />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 flex-wrap">
              {chain.steps.map((step, i) => (
                <span key={i} className="flex items-center gap-2">
                  <div className={`rounded-xl border px-3 py-2 text-xs font-medium ${i === chain.steps.length - 1 ? 'bg-red-50 border-red-200 text-red-700 font-bold' : 'bg-slate-50 border-slate-200 text-[#1a2235]'}`}>
                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">{chain.dates[i]}</p>
                    {step}
                  </div>
                  {i < chain.steps.length - 1 && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
                </span>
              ))}
            </div>
          </div>
          <div className="px-5 pb-4">
            <button onClick={onChainClick} className="px-4 py-2 rounded-lg bg-[#1a2235] text-white text-xs font-semibold hover:bg-[#243049] transition-colors">Investigate Pathway</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── SIF View ──────────────────────────────────────────────────────────────────
function SIFView({ onReportClick }: { onReportClick: () => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: 'Total SIF Precursors', v: '47', bg: 'bg-red-50 border-red-200',    c: 'text-red-700',   s: '↑8% this month' },
          { l: 'Electrical Hazards',   v: '18', bg: 'bg-amber-50 border-amber-200', c: 'text-amber-700', s: 'Highest category' },
          { l: 'Zone B Concentration', v: '30%',bg: 'bg-slate-50 border-slate-200', c: 'text-[#1a2235]', s: 'Of all SIF events' },
        ].map(({ l, v, bg, c, s }) => (
          <div key={l} className={`border rounded-2xl p-4 ${bg}`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{l}</p>
            <p className={`text-3xl font-black font-mono mt-1 ${c}`}>{v}</p>
            <p className="text-xs text-slate-400 mt-1">{s}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100"><p className="text-sm font-bold text-[#1a2235]">SIF Precursor Events</p></div>
        <div className="divide-y divide-slate-50">
          {reports.filter(r => r.isSIF).map(r => (
            <div key={r.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <span className="font-mono text-xs font-bold text-[#1a2235]">{r.id}</span>
                <p className="text-sm text-slate-700 mt-0.5 leading-tight">{r.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} />{r.zone}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{r.date}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Wrench size={10} />{r.equipment}</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-3 shrink-0">
                <RiskBadge level={r.risk} /><StatusBadge status={r.status} />
                <button onClick={onReportClick} className="text-slate-400 hover:text-[#1a2235] transition-colors"><Eye size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Analytics View ────────────────────────────────────────────────────────────
function AnalyticsView() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <p className="text-sm font-bold text-[#1a2235] mb-1">SIF Precursors & Predictions — Weekly Trend</p>
          <p className="text-xs text-slate-400 mb-4">4-week rolling view</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="sif"         stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4, fill: '#dc2626' }} name="SIF Precursors" />
              <Line type="monotone" dataKey="predictions" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4, fill: '#d97706' }} name="Predictions" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <p className="text-sm font-bold text-[#1a2235] mb-1">Top Hazard Categories</p>
          <p className="text-xs text-slate-400 mb-4">By SIF precursor count</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hazardCategories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="SIF Events">
                {hazardCategories.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#dc2626' : i === 1 ? '#d97706' : '#1a2235'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <p className="text-sm font-bold text-[#1a2235] mb-4">Zone Risk Distribution</p>
        <div className="grid grid-cols-6 gap-4">
          {heatmapZones.map(z => {
            const color = z.predictedRisk === 'CRITICAL' ? '#b91c1c' : z.predictedRisk === 'HIGH' ? '#dc2626' : z.predictedRisk === 'MEDIUM' ? '#d97706' : '#16a34a';
            return (
              <div key={z.id} className="text-center space-y-2">
                <div className="w-full bg-slate-100 rounded-full overflow-hidden h-24 flex items-end">
                  <div className="w-full rounded-t-sm" style={{ height: `${(z.sif / 14) * 100}%`, backgroundColor: color }} />
                </div>
                <p className="text-xs font-semibold text-[#1a2235]">{z.name}</p>
                <p className="font-mono text-sm font-bold" style={{ color }}>{z.sif}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Explorer View ──────────────────────────────────────────────────────────────
function ExplorerView({ onReportClick }: { onReportClick: () => void }) {
  const [query, setQuery] = useState('');
  const [facility, setFacility] = useState('All Facilities');
  const [zone, setZone] = useState('All Zones');
  const [hazard, setHazard] = useState('All Hazards');
  const [risk, setRisk] = useState('All Levels');
  const [equipment, setEquipment] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sifOnly, setSifOnly] = useState(false);
  const [nearMissOnly, setNearMissOnly] = useState(false);
  const [predictionOnly, setPredictionOnly] = useState(false);
  const [relatedOnly, setRelatedOnly] = useState(false);

  const filteredReports = reports.filter(report => {
    const searchable = [report.id, report.date, report.zone, report.equipment, report.hazard, report.description, report.status, report.reporterType].join(' ').toLowerCase();
    const reportDate = new Date(report.date).getTime();
    const fromDate = dateFrom ? new Date(dateFrom).getTime() : null;
    const toDate = dateTo ? new Date(dateTo).getTime() : null;
    const isNearMiss = report.description.toLowerCase().includes('near miss');
    const hasPrediction = ['R-1092', 'R-1089', 'R-1085', 'R-1079', 'R-1065'].includes(report.id);
    const hasRelatedReports = ['R-1092', 'R-1089', 'R-1085', 'R-1079', 'R-1078', 'R-1041'].includes(report.id);

    return (
      searchable.includes(query.trim().toLowerCase()) &&
      (facility === 'All Facilities' || facility === 'Assam Facility') &&
      (zone === 'All Zones' || report.zone === zone) &&
      (hazard === 'All Hazards' || report.hazard === hazard) &&
      (risk === 'All Levels' || report.risk === risk) &&
      (!equipment.trim() || report.equipment.toLowerCase().includes(equipment.trim().toLowerCase())) &&
      (!fromDate || reportDate >= fromDate) &&
      (!toDate || reportDate <= toDate) &&
      (!sifOnly || report.isSIF) &&
      (!nearMissOnly || isNearMiss) &&
      (!predictionOnly || hasPrediction) &&
      (!relatedOnly || hasRelatedReports)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={event => setQuery(event.target.value)} className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl outline-none text-[#1a2235] placeholder-slate-400 focus:border-[#1a2235] shadow-sm transition-colors" placeholder="Search reports… (try 'vibration', 'Zone B', 'compressor')" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: 'Facility', opts: ['All Facilities', ...facilities.map(f => f.name)] },
          { l: 'Zone', opts: ['All Zones', 'Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'] },
          { l: 'Hazard', opts: ['All Hazards', 'Mechanical', 'Electrical', 'Maintenance', 'Process'] },
          { l: 'Risk Level', opts: ['All Levels', 'HIGH', 'MEDIUM', 'LOW'] },
        ].map(({ l, opts }) => (
          <div key={l} className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{l}</label>
            <select value={l === 'Facility' ? facility : l === 'Zone' ? zone : l === 'Hazard' ? hazard : risk} onChange={event => { if (l === 'Facility') setFacility(event.target.value); else if (l === 'Zone') setZone(event.target.value); else if (l === 'Hazard') setHazard(event.target.value); else setRisk(event.target.value); }} className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-[#1a2235] outline-none">{opts.map(o => <option key={o}>{o}</option>)}</select>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: 'Equipment', placeholder: 'e.g. C-101' },
          { l: 'Date from', placeholder: '01 Sep 2026' },
          { l: 'Date to',   placeholder: '11 Sep 2026' },
        ].map(({ l, placeholder }) => (
          <div key={l} className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{l}</label>
            <input type={l.startsWith('Date') ? 'date' : 'text'} value={l === 'Equipment' ? equipment : l === 'Date from' ? dateFrom : dateTo} onChange={event => { if (l === 'Equipment') setEquipment(event.target.value); else if (l === 'Date from') setDateFrom(event.target.value); else setDateTo(event.target.value); }} className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-[#1a2235] placeholder-slate-400 outline-none" placeholder={placeholder} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {['SIF precursor only', 'Near miss only', 'Has related prediction', 'Has related reports'].map(l => (
          <label key={l} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input type="checkbox" checked={l === 'SIF precursor only' ? sifOnly : l === 'Near miss only' ? nearMissOnly : l === 'Has related prediction' ? predictionOnly : relatedOnly} onChange={event => { if (l === 'SIF precursor only') setSifOnly(event.target.checked); else if (l === 'Near miss only') setNearMissOnly(event.target.checked); else if (l === 'Has related prediction') setPredictionOnly(event.target.checked); else setRelatedOnly(event.target.checked); }} className="rounded" /> {l}
          </label>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500">{filteredReports.length} results</p>
          <Activity size={13} className="text-slate-400" />
        </div>
        <div className="divide-y divide-slate-50">
          {filteredReports.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-400">No reports match the selected filters.</div>
          ) : filteredReports.map(r => (
            <div key={r.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={onReportClick}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1a2235]">{r.id}</span>
                  <RiskBadge level={r.risk} size="xs" />
                  {r.isSIF && <span className="px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-[9px] font-bold text-red-600 font-mono">SIF</span>}
                </div>
                <p className="text-sm text-slate-700 mt-0.5 italic line-clamp-1">"{r.description}"</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{r.date}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} />{r.zone}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Wrench size={10} />{r.equipment}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={r.status} />
                {r.isSIF && <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5"><TrendingUp size={10} /> In prediction</span>}
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Report Detail ──────────────────────────────────────────────────────────────
function ReportDetail({ onBack, onChainClick }: { onBack: () => void; onChainClick: () => void }) {
  const r = reports[0];
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1a2235] transition-colors">
        <ArrowUpRight size={14} className="rotate-180" /> Back
      </button>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-lg font-black text-[#1a2235]">{r.id}</span>
                <RiskBadge level={r.risk} />
                <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-[10px] font-bold text-red-600 font-mono">SIF PRECURSOR</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock size={11} />{r.date} · {r.time}</span>
                <span className="flex items-center gap-1"><MapPin size={11} />{r.zone}</span>
                <span className="flex items-center gap-1"><Wrench size={11} />{r.equipment}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Original Report</p>
              <p className="text-sm text-[#1a2235] bg-slate-50 rounded-xl p-3 border border-slate-100 italic">"{r.description}"</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">AI-Extracted Information</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: 'Observation', v: 'Unusual vibration', alert: true },
                  { l: 'Equipment',   v: 'Compressor C-101' },
                  { l: 'Equipment State', v: 'Running',      alert: true },
                  { l: 'Location',    v: 'Zone B' },
                  { l: 'Worker Exposure', v: 'Possible',    alert: true },
                  { l: 'Language',    v: 'Hinglish → EN' },
                ].map(({ l, v, alert }) => (
                  <div key={l} className={`rounded-xl p-3 border ${alert ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">{l}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${alert ? 'text-red-600' : 'text-[#1a2235]'}`}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">Mark for Investigation</button>
            <button className="px-4 py-2 rounded-xl bg-[#1a2235] text-white text-sm font-semibold hover:bg-[#243049] transition-colors">Assign to Safety Team</button>
            <button onClick={onChainClick} className="px-4 py-2 rounded-xl border border-slate-200 text-[#1a2235] text-sm font-medium hover:bg-slate-50 transition-colors">View Failure Pathway</button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-amber-700">Linked to Prediction</p>
            <p className="text-sm font-black text-[#1a2235]">PRED-001</p>
            <p className="text-xs text-amber-600">Potential Compressor Mechanical Failure · HIGH · Next 24h</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</p>
            <StatusBadge status={r.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Chain Detail ───────────────────────────────────────────────────────────────
function ChainDetail({ onBack }: { onBack: () => void }) {
  const chain = causalChains[0];
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1a2235] transition-colors">
        <ArrowUpRight size={14} className="rotate-180" /> Back
      </button>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-[#1a2235]">{chain.title}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <MapPin size={10} />{chain.zone} <span>·</span> <Layers size={10} />{chain.reportCount} events <span>·</span>
                  <span className="text-amber-600 font-semibold">→ {chain.linkedPrediction}</span>
                </p>
              </div>
              <RiskBadge level={chain.risk} />
            </div>
            <div className="space-y-1">
              {chain.steps.map((step, i) => (
                <div key={i}>
                  <div
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${i === chain.steps.length - 1 ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    onClick={() => setExpanded(expanded === step ? null : step)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 ${i === chain.steps.length - 1 ? 'bg-red-600 text-white' : 'bg-[#1a2235] text-white'}`}>{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${i === chain.steps.length - 1 ? 'text-red-700' : 'text-[#1a2235]'}`}>{step}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-xs text-slate-400">{chain.dates[i]}</span>
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{chain.reportIds[i]}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} className={`text-slate-300 shrink-0 mt-1 transition-transform ${expanded === step ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  {i < chain.steps.length - 1 && (
                    <div className="flex items-center pl-[18px] h-4"><ArrowUpRight size={12} className="text-slate-300 rotate-90" /></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed"><span className="font-bold">Note:</span> This is an AI-generated potential failure pathway for safety investigation. It represents a possible event sequence — not confirmed causality.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Common Factors</p>
            {['Compressor system', 'Zone B', 'Maintenance activity'].map(f => (
              <div key={f} className="flex items-center gap-2 text-xs text-[#1a2235]"><div className="w-1.5 h-1.5 rounded-full bg-[#1a2235]" />{f}</div>
            ))}
          </div>
          <div className="bg-[#0f1824] rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Suggested Investigation Focus</p>
            <p className="text-xs text-white/85 leading-relaxed">Review maintenance readiness and safety controls around Compressor C-101. Verify LOTO compliance and equipment inspection records.</p>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors">Open Investigation</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Shell ────────────────────────────────────────────────────────────
export default function OfficerDashboard({ onSwitchToWorker, onLogout, role: _role, token }: { onSwitchToWorker: () => void; onLogout: () => void; role: Role; token: string }) {
  const [view, setView] = useState<DashView>('overview');
  const [predDetailId, setPredDetailId] = useState<string>('PRED-001');
  const [facilityId, setFacilityId] = useState('assam');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    getDashboardSummary(token).then(setSummary).catch(() => setSummary(null));
  }, [token]);

  function nav(v: DashView) { setView(v); }
  function openPred(id: string) { setPredDetailId(id); setView('prediction-detail'); }

  return (
    <div className="h-full flex bg-[#f8f9fb]">
      <Sidebar active={view} onNav={nav} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar title={viewTitles[view]} facilityId={facilityId} onFacilityChange={setFacilityId} onLogout={onLogout} />
        {/* Worker interface switcher */}
        <button
          onClick={onSwitchToWorker}
          className="absolute top-3 right-[220px] z-40 text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-500 px-2 py-1 rounded transition-colors"
        >
          ← Worker View
        </button>
        <main className="flex-1 overflow-y-auto p-6">
          {view === 'overview'          && <PredictiveOverview onNav={nav} facilityId={facilityId} summary={summary} />}
          {view === 'predictions'       && <PredictionsView onInvestigate={openPred} />}
          {view === 'prediction-detail' && <PredictionDetail id={predDetailId} onBack={() => nav('predictions')} />}
          {view === 'sensor-intel'      && <SensorIntelligenceView />}
          {view === 'evidence-fusion'   && <EvidenceFusionView />}
          {view === 'reports'           && <ReportsView onReportClick={() => nav('report-detail')} />}
          {view === 'sif'               && <SIFView onReportClick={() => nav('report-detail')} />}
          {view === 'chains'            && <ChainsView onChainClick={() => nav('chain-detail')} />}
          {view === 'heatmap'           && <PredictiveHeatmapView />}
          {view === 'analytics'         && <AnalyticsView />}
          {view === 'report-detail'     && <ReportDetail onBack={() => nav('reports')} onChainClick={() => nav('chain-detail')} />}
          {view === 'chain-detail'      && <ChainDetail onBack={() => nav('chains')} />}
          {view === 'explorer'          && <ExplorerView onReportClick={() => nav('report-detail')} />}
        </main>
      </div>
    </div>
  );
}
