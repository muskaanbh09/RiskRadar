import { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, ChevronRight, MapPin, Wrench, CheckCircle2,
  Circle, Loader2, AlertTriangle, Clock, SquareArrowOutUpRight,
  ArrowLeft, Send, Link2, Activity, LogOut, User, FileText, ChevronDown
} from 'lucide-react';
import RiskBadge from '../components/shared/RiskBadge';
import type { Role } from '../App';
import { TrendingUp } from 'lucide-react';
import { createReport } from '../api';

type WorkerScreen =
  | 'home'
  | 'voice'
  | 'chat'
  | 'analysis'
  | 'result'
  | 'related'
  | 'chain';

interface WorkerFlowProps {
  onSwitchToDashboard: () => void;
  onLogout: () => void;
  role: Role;
  token: string;
}

function UserMenu({ role, onLogout }: { role: Role; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const [menuView, setMenuView] = useState<'profile' | 'reports' | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-[#1a2235] flex items-center justify-center">
            <span className="text-white text-xs font-semibold">RK</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="text-right leading-tight">
          <p className="text-xs font-semibold text-[#1a2235]">Rajesh Kumar</p>
          <p className="text-[10px] text-slate-400">Field Worker</p>
        </div>
        <ChevronDown size={12} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 fade-in">
          {menuView === null ? (
            <>
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                <p className="text-xs font-bold text-[#1a2235] mt-0.5">Worker · Frontline</p>
              </div>
              <button onClick={() => setMenuView('profile')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <User size={13} className="text-slate-400" />Profile
              </button>
              <button onClick={() => setMenuView('reports')} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <FileText size={13} className="text-slate-400" />My Reports
              </button>
            </>
          ) : (
            <div className="px-3 py-2">
              <button onClick={() => setMenuView(null)} className="text-[10px] text-slate-400 hover:text-[#1a2235] mb-2">← Back</button>
              <p className="text-xs font-bold text-[#1a2235]">{menuView === 'profile' ? 'Worker Profile' : 'My Reports'}</p>
              {menuView === 'profile' ? (
                <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                  <p>Rajesh Kumar</p>
                  <p>Frontline Worker</p>
                  <p>Employee ID: OIL-2041</p>
                </div>
              ) : (
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Your submitted safety reports will appear here after submission.</p>
              )}
            </div>
          )}
          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Screen 1: Worker Home ─────────────────────────────────────────────────────
function WorkerHome({ onNext, onLogout, role, onReportText }: { onNext: (s: WorkerScreen) => void; onLogout: () => void; role: Role; onReportText: (text: string) => void }) {
  const [reportText, setReportText] = useState('');

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/20 border border-amber-300/40 rounded-lg flex items-center justify-center">
              <span className="text-amber-700 text-[10px] font-black font-mono">RR</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-none font-mono">RiskRadar</p>
              <p className="text-sm font-bold text-[#1a2235] leading-tight">Safety Report</p>
            </div>
          </div>
          <UserMenu role={role} onLogout={onLogout} />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-5 max-w-sm mx-auto w-full">
        <div>
          <h1 className="text-xl font-bold text-[#1a2235]">Report a Safety Issue</h1>
          <p className="text-sm text-slate-500 mt-1">Report unsafe acts, unsafe conditions, or near misses. Your observation may be a critical signal for predictive safety analysis.</p>
        </div>

        {/* Prediction signal notice */}
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <TrendingUp size={13} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-relaxed">Your observation is combined with sensor data and historical patterns to predict developing risks.</p>
        </div>

        {/* Input card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
          <textarea
            className="w-full text-sm text-[#1a2235] placeholder-slate-400 resize-none outline-none leading-relaxed"
            rows={4}
            placeholder="Example: Compressor se unusual vibration aa rahi hai…"
            value={reportText}
            onChange={e => { setReportText(e.target.value); onReportText(e.target.value); }}
          />
          <div className="border-t border-slate-100 pt-3 flex gap-2">
            <button
              onClick={() => onNext('chat')}
              className="flex-1 py-2.5 rounded-lg bg-[#1a2235] text-white text-sm font-medium hover:bg-[#243049] transition-colors"
            >
              Type Report
            </button>
            <button
              onClick={() => onNext('voice')}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[#1a2235] text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <Mic size={15} />
              Speak
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plant / Zone</label>
          <div className="flex items-center gap-2 text-sm text-[#1a2235]">
            <MapPin size={15} className="text-slate-400 shrink-0" />
            <span className="font-medium">Assam Facility</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium">Compressor Area</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-amber-600">Zone B</span>
          </div>
          <div className="h-px bg-slate-100" />
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Equipment <span className="text-slate-400 font-normal normal-case">(optional)</span></label>
          <div className="flex items-center gap-2 text-sm text-[#1a2235]">
            <Wrench size={15} className="text-slate-400 shrink-0" />
            <span className="font-medium">Compressor C-101</span>
          </div>
        </div>

        <button
          onClick={() => onNext('chat')}
          className="w-full py-3 rounded-xl bg-[#1a2235] text-white font-semibold text-sm hover:bg-[#243049] transition-colors flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight size={16} />
        </button>

        <p className="text-center text-[11px] text-slate-400">Your report is encrypted and submitted securely.</p>
      </main>
    </div>
  );
}

// ── Screen 2: Voice Reporting ─────────────────────────────────────────────────
function VoiceReporting({ onNext, onBack }: { onNext: (s: WorkerScreen) => void; onBack: () => void }) {
  const [phase, setPhase] = useState<'recording' | 'done'>('recording');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const full = 'Compressor se unusual vibration aa rahi hai. Pichle 30 minute se badh rahi hai.';
    let i = 0;
    const interval = setInterval(() => {
      if (i <= full.length) {
        setTranscript(full.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('done'), 600);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-[#1a2235]">
      <header className="px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-xs text-white/50">Voice Input</p>
          <p className="text-sm font-semibold text-white">Safety Report</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8">
        {/* Mic button */}
        <div className="relative">
          {phase === 'recording' && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="absolute -inset-4 rounded-full bg-red-500/10 animate-ping" style={{ animationDelay: '0.5s' }} />
            </>
          )}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl relative z-10 transition-all duration-500 ${phase === 'recording' ? 'bg-red-500' : 'bg-green-600'}`}>
            {phase === 'recording' ? <Mic size={36} className="text-white" /> : <CheckCircle2 size={36} className="text-white" />}
          </div>
        </div>

        <div className="text-center space-y-2">
          {phase === 'recording' ? (
            <>
              <div className="flex items-center justify-center gap-1.5">
                {[0, 0.15, 0.3].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
                <span className="text-white/80 text-sm ml-1">Listening…</span>
              </div>
              <p className="text-xs text-white/40 font-mono">Hinglish detected</p>
            </>
          ) : (
            <>
              <p className="text-white font-medium">Recording complete</p>
              <p className="text-xs text-white/40 font-mono">Hinglish detected</p>
            </>
          )}
        </div>

        {/* Transcript */}
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 min-h-[72px]">
          <p className="text-xs text-white/50 font-mono mb-2 uppercase tracking-wider">Transcription</p>
          <p className="text-white text-sm leading-relaxed font-medium">
            {transcript}
            {phase === 'recording' && <span className="inline-block w-0.5 h-4 bg-white/60 ml-0.5 animate-pulse" />}
          </p>
        </div>

        {phase === 'recording' ? (
          <button
            onClick={() => setPhase('done')}
            className="px-6 py-3 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
          >
            <MicOff size={15} className="inline mr-2" />
            Stop Recording
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button
              onClick={() => { setPhase('recording'); setTranscript(''); }}
              className="flex-1 py-3 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              Record Again
            </button>
            <button
              onClick={() => onNext('chat')}
              className="flex-1 py-3 rounded-xl bg-white text-[#1a2235] text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Use Report
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Screen 3: Conversational Reporting ────────────────────────────────────────
interface ChatMsg { role: 'system' | 'worker' | 'ai'; text: string; }

function ConversationalChat({ onNext, onBack, reportText, onReportText }: { onNext: (s: WorkerScreen) => void; onBack: () => void; reportText: string; onReportText: (text: string) => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    { role: 'system', text: 'Tell me what happened, where it happened, and whether the condition is getting worse.' },
    ...(reportText.trim() ? [{ role: 'worker' as const, text: reportText.trim() }] : []),
    { role: 'ai', text: 'Thanks. What did you notice after that, and is the equipment still operating?' },
  ]);
  const [input, setInput] = useState('');
  const workerMessages = messages.filter(message => message.role === 'worker');
  const completeness = Math.min(100, 40 + workerMessages.length * 20);

  function sendMessage() {
    if (!input.trim()) return;
    const nextMessage = input.trim();
    const nextMessages: ChatMsg[] = [
      ...messages,
      { role: 'worker', text: nextMessage },
      { role: 'ai', text: workerMessages.length === 0 ? 'What happened next, and is the condition getting worse?' : 'Got it. Add any other sound, heat, leak, or immediate safety concern before continuing.' },
    ];
    setMessages(nextMessages);
    onReportText(nextMessages.filter(message => message.role === 'worker').map(message => message.text).join('\n'));
    setInput('');
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <p className="text-xs text-slate-500">AI Safety Assistant</p>
          <p className="text-sm font-semibold text-[#1a2235]">Complete your safety report</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Completeness</p>
          <p className="text-sm font-bold text-[#1a2235] font-mono">{completeness}%</p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-2">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1a2235] rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      <main className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => {
          if (msg.role === 'system') {
            return (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium flex gap-2 items-start">
                <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" />
                {msg.text}
              </div>
            );
          }
          if (msg.role === 'worker') {
            return (
              <div key={i} className="flex justify-end fade-in">
                <div className="bg-[#1a2235] text-white text-sm rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                  {msg.text}
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="flex gap-2 fade-in">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <Activity size={13} className="text-slate-500" />
              </div>
              <div className="bg-white border border-slate-200 text-sm rounded-2xl rounded-bl-md px-4 py-2.5 text-[#1a2235] max-w-[80%] shadow-sm">
                {msg.text}
              </div>
            </div>
          );
        })}
      </main>

      <div className="bg-white border-t border-slate-200 px-4 py-3 space-y-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your answer…"
            className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none text-[#1a2235] placeholder-slate-400 focus:border-[#1a2235] transition-colors"
          />
          <button onClick={sendMessage} className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            <Mic size={16} />
          </button>
          <button onClick={sendMessage} className="p-2.5 rounded-xl bg-[#1a2235] text-white hover:bg-[#243049] transition-colors">
            <Send size={16} />
          </button>
        </div>
        {workerMessages.length > 0 && (
          <button
            onClick={() => onNext('analysis')}
            className="w-full py-3 rounded-xl bg-[#1a2235] text-white font-semibold text-sm hover:bg-[#243049] transition-colors fade-in"
          >
            Analyze Report
          </button>
        )}
      </div>
    </div>
  );
}

// ── Screen 4: Analysis Processing ─────────────────────────────────────────────
const processingSteps = [
  { label: 'Report received', done: true },
  { label: 'Language detected: Hinglish → EN', done: true },
  { label: 'Equipment & observation extracted', done: true },
  { label: 'Checking sensor data for C-101', active: true },
  { label: 'Comparing historical patterns', done: false },
  { label: 'Identifying common patterns', done: false },
  { label: 'Building predictive risk picture', done: false },
];

function AnalysisProcessing({ onNext }: { onNext: (s: WorkerScreen) => void }) {
  const [step, setStep] = useState(3);

  useEffect(() => {
    const t = setInterval(() => {
      setStep(p => {
        if (p >= processingSteps.length) {
          clearInterval(t);
          return p;
        }
        return p + 1;
      });
    }, 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (step >= processingSteps.length) {
      setTimeout(() => onNext('result'), 600);
    }
  }, [step]);

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb] items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#1a2235] border-t-transparent animate-spin" />
          <h2 className="text-lg font-bold text-[#1a2235] mt-4">Analyzing Safety Report</h2>
          <p className="text-sm text-slate-500">AI/NLP engine processing your submission</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-3">
          {processingSteps.map((s, i) => {
            const isDone = i < step;
            const isActive = i === step;
            const isPending = i > step;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {isDone && <CheckCircle2 size={18} className="text-green-600" />}
                  {isActive && <Loader2 size={18} className="text-[#1a2235] animate-spin" />}
                  {isPending && <Circle size={18} className="text-slate-300" />}
                </div>
                <span className={`text-sm ${isDone ? 'text-[#1a2235] font-medium' : isActive ? 'text-[#1a2235] font-semibold' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {isDone && <span className="ml-auto text-[10px] font-mono text-green-600 uppercase tracking-wide">Done</span>}
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-slate-400">Cross-referencing sensor data and 1,284 historical reports…</p>
      </div>
    </div>
  );
}

// ── Screen 5: SIF Result ──────────────────────────────────────────────────────
function SIFResult({ onNext, onBack, onSubmit, reportId, reportText, submitError, submitting }: { onNext: (s: WorkerScreen) => void; onBack: () => void; onSubmit: () => void; reportId: string; reportText: string; submitError: string; submitting: boolean }) {
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-xs text-slate-500">AI Analysis Complete</p>
          <p className="text-sm font-semibold text-[#1a2235]">Safety Report Analysis</p>
        </div>
        <span className="ml-auto font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{reportId || 'Pending'}</span>
      </header>
      <main className="flex-1 px-4 py-5 space-y-4 overflow-y-auto max-w-sm mx-auto w-full">
        {/* Prediction signal banner */}
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <TrendingUp size={13} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-relaxed font-medium">Your observation has been added as a signal to RiskRadar's predictive analysis for Compressor C-101.</p>
        </div>

        {/* Original report */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Original Report</p>
          <p className="text-sm text-[#1a2235] leading-relaxed italic">
            {reportText || 'No report text entered yet.'}
          </p>
        </div>

        {/* Extracted info */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Detected Information</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { l: 'Observation', v: 'Unusual vibration', red: true },
              { l: 'Equipment', v: 'Compressor C-101' },
              { l: 'Location', v: 'Zone B' },
              { l: 'Trend', v: 'Vibration increasing', red: true },
              { l: 'Equipment state', v: 'Running', red: true },
            ].map(({ l, v, red }) => (
              <div key={l} className="space-y-0.5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{l}</p>
                <p className={`text-xs font-semibold ${red ? 'text-red-600' : 'text-[#1a2235]'}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SIF Risk card */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Potential SIF Precursor</p>
              <p className="text-xl font-black text-red-700 font-mono mt-0.5">HIGH RISK</p>
            </div>
            <AlertTriangle size={28} className="text-red-500 shrink-0" />
          </div>
          <div className="space-y-1.5">
            {[
              'Escalating vibration anomaly detected',
              'Equipment running — mechanical stress possible',
              'Sensor data corroborates observation',
              'Historical recurrence — similar pattern seen before',
            ].map(r => (
              <div key={r} className="flex items-center gap-2 text-xs text-red-700">
                <CheckCircle2 size={13} className="text-red-500 shrink-0" />
                {r}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowExplainer(p => !p)}
            className="text-xs text-red-600 font-medium flex items-center gap-1 hover:underline"
          >
            <SquareArrowOutUpRight size={11} />
            Why was this flagged?
          </button>
          {showExplainer && (
            <div className="bg-white border border-red-100 rounded-lg p-3 text-xs text-red-800 space-y-1 fade-in">
              <p className="font-semibold mb-1.5">Detected safety indicators:</p>
              <p>• Electrical shock hazard: energized conductor exposed</p>
              <p>• Proximity: within 2m of energized rotating equipment</p>
              <p>• No isolation confirmed: equipment still running</p>
              <p>• Historical pattern: similar events in same zone</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNext('related')}
            className="flex-1 py-2.5 rounded-xl bg-[#1a2235] text-white text-sm font-semibold hover:bg-[#243049] transition-colors"
          >
            View Related Reports
          </button>
          <button onClick={onSubmit} disabled={submitting || Boolean(reportId)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[#1a2235] text-sm font-medium bg-white hover:bg-slate-50 transition-colors disabled:opacity-60">
            {submitting ? 'Submitting…' : reportId ? 'Report Submitted' : 'Submit Report'}
          </button>
        </div>
        {submitError && <p className="text-xs text-red-600 text-center">{submitError}</p>}
      </main>
    </div>
  );
}

// ── Screen 6: Related Historical Reports ─────────────────────────────────────
const relatedReports = [
  { id: 'R-1024', date: '01 Sep 2026', zone: 'Zone B', equipment: 'Compressor C-101', desc: 'Maintenance delayed', tags: ['Same equipment', 'Earlier event'], strength: 'Strong' },
  { id: 'R-1041', date: '03 Sep 2026', zone: 'Zone B', equipment: 'Compressor C-101', desc: 'Equipment condition unclear', tags: ['Same equipment', 'Same zone'], strength: 'Strong' },
  { id: 'R-1078', date: '05 Sep 2026', zone: 'Zone B', equipment: 'Compressor C-101', desc: 'Unsafe maintenance workaround', tags: ['Same equipment', 'Semantically related'], strength: 'Very strong' },
  { id: 'R-1087', date: '09 Sep 2026', zone: 'Zone B', equipment: 'Compressor C-101', desc: 'Near miss during maintenance', tags: ['Same zone', 'Earlier event'], strength: 'Strong' },
];

function RelatedReports({ onNext, onBack }: { onNext: (s: WorkerScreen) => void; onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-sm font-semibold text-[#1a2235]">Related Historical Reports</p>
          <p className="text-xs text-slate-500">Potentially connected events in the same operational context.</p>
        </div>
      </header>
      <main className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {relatedReports.map(r => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-bold text-[#1a2235]">{r.id}</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock size={10} />
                {r.date}
              </div>
            </div>
            <p className="text-sm font-medium text-[#1a2235]">{r.desc}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin size={11} className="text-slate-400" />
              {r.zone}
              <span className="mx-1 text-slate-300">·</span>
              <Wrench size={11} className="text-slate-400" />
              {r.equipment}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {r.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] text-blue-700 font-medium">{t}</span>
              ))}
              <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-medium ml-auto">
                <Link2 size={9} className="inline mr-0.5" />
                {r.strength}
              </span>
            </div>
          </div>
        ))}
        <button
          onClick={() => onNext('chain')}
          className="w-full py-3 rounded-xl bg-[#1a2235] text-white font-semibold text-sm hover:bg-[#243049] transition-colors mt-2"
        >
          View Potential Causal Chain
          <ChevronRight size={15} className="inline ml-1" />
        </button>
      </main>
    </div>
  );
}

// ── Screen 7: Causal Chain ────────────────────────────────────────────────────
const chainNodes = [
  { date: '01 Sep', label: 'Maintenance Delay', id: 'R-1024', zone: 'Zone B', equip: 'C-204' },
  { date: '03 Sep', label: 'Equipment Condition Unknown', id: 'R-1041', zone: 'Zone B', equip: 'C-204' },
  { date: '05 Sep', label: 'Unsafe Workaround', id: 'R-1078', zone: 'Zone B', equip: 'C-204' },
  { date: '07 Sep', label: 'Near Miss', id: 'R-1087', zone: 'Zone B', equip: 'C-204' },
  { date: 'Current', label: 'Electrical Hazard', id: 'R-1092', zone: 'Zone B', equip: 'C-204', current: true },
];

const connectorFactors = [
  'Same operational area',
  'Same equipment/system',
  'Logical time sequence',
  'Related safety conditions',
  'Similar hazard context',
];

function CausalChain({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-sm font-semibold text-[#1a2235]">Potential Causal-Failure Chain</p>
          <p className="text-xs text-slate-500">Related reports indicate a possible sequence of failures.</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 space-y-5 overflow-y-auto">
        {/* Chain nodes */}
        <div className="space-y-0">
          {chainNodes.map((node, i) => (
            <div key={i}>
              <div className={`bg-white border rounded-xl p-3.5 shadow-sm ${node.current ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5 ${node.current ? 'bg-red-600 text-white' : 'bg-[#1a2235] text-white'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <p className={`text-sm font-semibold ${node.current ? 'text-red-700' : 'text-[#1a2235]'}`}>{node.label}</p>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">{node.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-slate-400">{node.id}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">{node.zone}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">{node.equip}</span>
                    </div>
                  </div>
                </div>
              </div>
              {i < chainNodes.length - 1 && (
                <div className="flex items-center justify-center h-5">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-2 bg-slate-300" />
                    <div className="w-2 h-2 border-b-2 border-r-2 border-slate-400 rotate-45 -mt-1" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Why connected */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Why these reports were connected</p>
          {connectorFactors.map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-[#1a2235]">
              <CheckCircle2 size={12} className="text-green-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">Note:</span> This is an AI-generated potential relationship for safety investigation. It indicates a possible failure pathway, not a proven causal sequence.
          </p>
        </div>

        <button className="w-full py-3 rounded-xl bg-[#1a2235] text-white font-semibold text-sm hover:bg-[#243049] transition-colors">
          View Connected Reports
        </button>
      </main>
    </div>
  );
}

// ── Worker Flow Shell ─────────────────────────────────────────────────────────
export default function WorkerFlow({ onSwitchToDashboard, onLogout, role, token }: WorkerFlowProps) {
  const [screen, setScreen] = useState<WorkerScreen>('home');
  const [reportText, setReportText] = useState('');
  const [reportId, setReportId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function nav(s: WorkerScreen) { setScreen(s); }

  async function submitReport() {
    if (!reportText.trim()) {
      setSubmitError('Add an observation before submitting the report.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const report = await createReport(token, {
        description: reportText.trim(),
        zone: 'Zone B',
        equipment: 'Compressor C-101',
      });
      setReportId(report.id);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the report.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-full bg-white relative">
      {/* Switch to dashboard button */}
      <button
        onClick={onSwitchToDashboard}
        className="absolute top-3 right-3 z-50 text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-500 px-2 py-1 rounded transition-colors"
      >
        Officer Dashboard →
      </button>

      {/* Mobile frame */}
      <div className="h-full flex items-center justify-center bg-slate-100 p-4">
        <div className="w-[390px] h-full max-h-[844px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
          {screen === 'home' && <WorkerHome onNext={nav} onLogout={onLogout} role={role} onReportText={setReportText} />}
          {screen === 'voice' && <VoiceReporting onNext={nav} onBack={() => nav('home')} />}
          {screen === 'chat' && <ConversationalChat onNext={nav} onBack={() => nav('home')} reportText={reportText} onReportText={setReportText} />}
          {screen === 'analysis' && <AnalysisProcessing onNext={nav} />}
          {screen === 'result' && <SIFResult onNext={nav} onBack={() => nav('chat')} onSubmit={submitReport} reportId={reportId} reportText={reportText} submitError={submitError} submitting={submitting} />}
          {screen === 'related' && <RelatedReports onNext={nav} onBack={() => nav('result')} />}
          {screen === 'chain' && <CausalChain onBack={() => nav('related')} />}
        </div>
      </div>
    </div>
  );
}
