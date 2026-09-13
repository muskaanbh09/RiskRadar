import { useState } from 'react';
import {
  Eye, EyeOff, Shield, AlertTriangle, GitBranch, Activity,
  Zap, HardHat, BarChart3, AlertCircle, ChevronRight, Check,
  TrendingUp, Radio
} from 'lucide-react';
import type { Role } from '../App';

interface LoginPageProps {
  onAuthenticate: (username: string, password: string, role: Role) => Promise<void>;
}

const pillars = [
  {
    icon: TrendingUp,
    title: 'Predictive Failure Analysis',
    desc: 'Identifies developing failure signals BEFORE incidents occur — the core innovation.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Radio,
    title: 'Sensor + Observation Fusion',
    desc: 'Combines live sensor data, worker reports, and historical patterns into a unified risk signal.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: AlertTriangle,
    title: 'SIF Precursor Detection',
    desc: 'AI/NLP flags Serious Injury & Fatality precursors across all worker-submitted reports.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    icon: GitBranch,
    title: 'Potential Failure Pathways',
    desc: 'Connects individual signals to reveal multi-step failure sequences across zones and equipment.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
];

export default function LoginPage({ onAuthenticate }: LoginPageProps) {
  const [tab, setTab] = useState<'worker' | 'officer'>('officer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your Employee ID and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onAuthenticate(email.trim(), password, tab);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex bg-[#f8f9fb]">

      {/* ── Left: Branding ── */}
      <div className="hidden lg:flex w-[52%] bg-[#0f1824] flex-col relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Radial accent */}
        <div className="absolute top-[30%] left-[40%] w-[480px] h-[480px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-white font-black text-xl tracking-tight leading-none">RiskRadar</p>
              <p className="text-white/35 text-[10px] font-mono uppercase tracking-widest">AI-Powered Predictive Safety Intelligence</p>
            </div>
          </div>

          {/* Badge */}
          <div className="mt-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/25 rounded-full px-3 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 text-[11px] font-semibold tracking-wide">OIL India Limited · Smart India Hackathon 2026</span>
            </div>

            <h1 className="text-[2.1rem] font-black text-white leading-[1.15]">
              Don't just react to<br />
              safety incidents.<br />
              <span className="text-amber-400">Predict them.</span>
            </h1>

            <p className="text-white/45 text-sm leading-relaxed mt-5 max-w-[380px]">
              RiskRadar fuses sensor anomalies, worker observations, and historical patterns to identify developing failure signals — before they become incidents.
            </p>
          </div>

          {/* Traditional vs RiskRadar */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Traditional Safety</p>
                <div className="space-y-1 text-xs text-white/40">
                  <p>Incident occurs</p>
                  <p>↓ Report filed</p>
                  <p>↓ Investigated</p>
                  <p className="text-red-400 font-medium">↓ React (too late)</p>
                </div>
              </div>
              <div className="space-y-2 border-l border-white/10 pl-4">
                <p className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-widest">RiskRadar</p>
                <div className="space-y-1 text-xs text-white/60">
                  <p>Sensor signal detected</p>
                  <p>↓ Worker observation filed</p>
                  <p>↓ Pattern recognised</p>
                  <p className="text-green-400 font-medium">↓ Prevent before failure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature pillars */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {pillars.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={`rounded-xl ${bg} border border-white/8 p-3.5 space-y-1.5`}>
                <div className="flex items-center gap-2">
                  <Icon size={14} className={color} />
                  <p className="text-white text-xs font-semibold leading-tight">{title}</p>
                </div>
                <p className="text-white/35 text-[10px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-auto pt-8 grid grid-cols-3 gap-4 border-t border-white/10">
            {[
              { v: '6',     l: 'Active predictions' },
              { v: '1,284', l: 'Reports processed'  },
              { v: '5',     l: 'Facilities monitored'},
            ].map(({ v, l }) => (
              <div key={l}>
                <p className="text-white font-black text-xl font-mono">{v}</p>
                <p className="text-white/30 text-[10px] mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login card ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-[#0f1824] rounded-lg flex items-center justify-center">
            <Shield size={15} className="text-amber-400" />
          </div>
          <div>
            <p className="font-black text-[#1a2235] text-base leading-none">RiskRadar</p>
            <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">Predictive Safety Intelligence</p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h2 className="text-2xl font-black text-[#1a2235]">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to access your safety intelligence workspace.</p>
          </div>

          {/* Role tabs */}
          <div className="flex mb-5 bg-slate-100 rounded-xl p-1 gap-1">
            {(['worker', 'officer'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t ? 'bg-white text-[#1a2235] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === 'worker' ? '👷 Worker Login' : '🛡️ Safety Officer Login'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 fade-in">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {tab === 'worker' ? 'Employee ID' : 'Employee ID / Email'}
              </label>
              <input
                type="text"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder={tab === 'worker' ? 'e.g. OIL-2041' : 'e.g. priya@oilindia.in'}
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none text-[#1a2235] placeholder-slate-400 transition-colors ${error ? 'border-red-300' : 'border-slate-200 focus:border-[#1a2235]'}`}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-slate-400 hover:text-[#1a2235] transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 pr-11 text-sm bg-white border rounded-xl outline-none text-[#1a2235] placeholder-slate-400 transition-colors ${error ? 'border-red-300' : 'border-slate-200 focus:border-[#1a2235]'}`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRememberMe(p => !p)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${rememberMe ? 'bg-[#1a2235] border-[#1a2235]' : 'border-slate-300 bg-white'}`}
              >
                {rememberMe && <Check size={10} className="text-white" strokeWidth={3} />}
              </button>
              <span className="text-xs text-slate-500">Remember me on this device</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1a2235] text-white font-bold text-sm hover:bg-[#243049] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                : <>{tab === 'worker' ? 'Worker Sign In' : 'Officer Sign In'} <ChevronRight size={15} /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Quick Demo Access</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Demo buttons */}
          <div className="space-y-3">
            <button
              onClick={() => { setTab('worker'); void onAuthenticate('worker', 'worker123', 'worker').catch(error => setError(error instanceof Error ? error.message : 'Unable to sign in.')); }}
              className="w-full flex items-center gap-4 bg-white border-2 border-slate-200 hover:border-[#1a2235] rounded-xl px-4 py-3.5 text-left transition-all group hover:shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#1a2235] flex items-center justify-center shrink-0 transition-colors">
                <HardHat size={18} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1a2235]">Demo Worker</p>
                <p className="text-xs text-slate-400 mt-0.5">Report observations · AI chat · See prediction signal</p>
              </div>
              <ChevronRight size={15} className="text-slate-300 group-hover:text-[#1a2235] shrink-0 transition-colors" />
            </button>

            <button
              onClick={() => { setTab('officer'); void onAuthenticate('officer', 'officer123', 'officer').catch(error => setError(error instanceof Error ? error.message : 'Unable to sign in.')); }}
              className="w-full flex items-center gap-4 bg-[#0f1824] hover:bg-[#1a2235] border-2 border-[#0f1824] rounded-xl px-4 py-3.5 text-left transition-all group shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Activity size={18} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Demo Safety Officer</p>
                <p className="text-xs text-white/45 mt-0.5">Predictions · Sensor intelligence · Heatmap · Analytics</p>
              </div>
              <ChevronRight size={15} className="text-white/30 group-hover:text-white shrink-0 transition-colors" />
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            RiskRadar · OIL India Limited · SIH 2026 Demo
          </p>
        </div>
      </div>
    </div>
  );
}
