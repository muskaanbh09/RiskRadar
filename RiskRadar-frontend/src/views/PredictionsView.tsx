import { useState } from 'react';
import {
  TrendingUp, AlertTriangle, ChevronRight, Clock, MapPin,
  Wrench, Activity, Zap, FileText, BarChart3, Shield, CheckCircle2,
  ArrowRight, Info
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { predictions, sensorTimeSeries } from '../data/mockData';
import RiskBadge from '../components/shared/RiskBadge';
import type { RiskLevel } from '../types';

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, risk }: { score: number; risk: RiskLevel }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const isHighOrCrit = risk === 'HIGH' || risk === 'CRITICAL';
  const color = isHighOrCrit ? '#dc2626' : risk === 'MEDIUM' ? '#d97706' : '#16a34a';

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke={color}
          strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm font-black text-[#1a2235] font-mono leading-none">{score}</p>
      </div>
    </div>
  );
}

// ── Evidence bar ──────────────────────────────────────────────────────────────
function EvidenceBar({ label, points, max = 25 }: { label: string; points: number; max?: number }) {
  const pct = (points / max) * 100;
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-slate-600 w-44 shrink-0">{label}</p>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#1a2235] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold font-mono text-[#1a2235] w-8 text-right">+{points}</span>
    </div>
  );
}

// ── Prediction Card ───────────────────────────────────────────────────────────
function PredictionCard({ pred, onInvestigate }: { pred: typeof predictions[0]; onInvestigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const isCritical = (['HIGH', 'CRITICAL'] as string[]).includes(pred.risk);

  return (
    <div className={`bg-white border-2 rounded-2xl shadow-sm overflow-hidden transition-all ${isCritical ? 'border-red-200' : 'border-amber-200'}`}>
      {/* Header band */}
      <div className={`px-5 py-3 flex items-center gap-3 ${isCritical ? 'bg-red-50' : 'bg-amber-50'}`}>
        <TrendingUp size={15} className={isCritical ? 'text-red-500' : 'text-amber-500'} />
        <p className={`text-xs font-bold uppercase tracking-wide ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>
          Predicted Future Failure
        </p>
        <RiskBadge level={pred.risk} size="xs" />
        <span className="ml-auto font-mono text-[10px] text-slate-400">{pred.id}</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Title row */}
        <div className="flex items-start gap-4">
          <ScoreRing score={pred.score} risk={pred.risk} />
          <div className="flex-1 min-w-0">
            <p className="text-base font-black text-[#1a2235] leading-snug">{pred.title}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-slate-400"><Wrench size={11} />{pred.equipment}</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={11} />{pred.zone} · {pred.facility}</span>
              <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold"><Clock size={11} />{pred.horizon}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Score</p>
            <p className="text-2xl font-black font-mono text-[#1a2235]">{pred.score}<span className="text-sm text-slate-400">/100</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">Confidence: <span className="text-[#1a2235] font-semibold">{pred.confidence}</span></p>
          </div>
        </div>

        {/* Evidence summary */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Why is RiskRadar predicting this?</p>
          {pred.evidence.slice(0, expanded ? pred.evidence.length : 3).map(ev => (
            <EvidenceBar key={ev.type} label={ev.type} points={ev.points} />
          ))}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200 mt-2">
            <button onClick={() => setExpanded(p => !p)} className="text-xs text-slate-400 hover:text-[#1a2235] flex items-center gap-1 transition-colors">
              <Info size={11} />
              {expanded ? 'Show less' : `Show all ${pred.evidence.length} signals`}
            </button>
            <p className="text-xs font-black font-mono text-[#1a2235]">Total: {pred.score}/100</p>
          </div>
        </div>

        {/* Key sensors */}
        <div className="grid grid-cols-3 gap-2">
          {pred.sensorReadings.slice(0, 3).map(s => (
            <div key={s.sensor} className={`rounded-lg p-2.5 border ${s.status === 'Critical' ? 'bg-red-50 border-red-200' : s.status === 'High' ? 'bg-orange-50 border-orange-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">{s.sensor}</p>
              <p className="text-sm font-black text-[#1a2235] font-mono mt-0.5">{s.current}{s.unit}</p>
              <p className={`text-[10px] font-semibold ${s.delta.startsWith('+') ? 'text-red-500' : 'text-amber-500'}`}>{s.delta} vs baseline</p>
            </div>
          ))}
        </div>

        {/* Observations pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Evidence:</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] text-blue-700 font-medium">
            <Activity size={9} className="inline mr-0.5" />
            {pred.sensorReadings.length} sensor anomalies
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-medium">
            <FileText size={9} className="inline mr-0.5" />
            {pred.workerObservations.length} worker reports
          </span>
          <span className="px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] text-green-700 font-medium">
            <BarChart3 size={9} className="inline mr-0.5" />
            {pred.historicalMatches.length} historical matches
          </span>
        </div>

        {/* Recommended action */}
        <div className="bg-[#0f1824] rounded-xl px-4 py-3 flex items-start gap-3">
          <Shield size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Recommended Action</p>
            <p className="text-xs text-white/80 mt-0.5 leading-relaxed">{pred.recommendedAction}</p>
          </div>
        </div>

        <button
          onClick={onInvestigate}
          className="w-full py-2.5 rounded-xl bg-[#1a2235] text-white text-sm font-bold hover:bg-[#243049] transition-colors flex items-center justify-center gap-2"
        >
          Investigate Prediction <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Prediction Timeline ───────────────────────────────────────────────────────
const timelineSteps = [
  { label: 'Normal State',              sub: '01 Sep', color: 'bg-green-500',  done: true },
  { label: 'First Sensor Anomaly',      sub: '06 Sep', color: 'bg-yellow-500', done: true },
  { label: 'Worker Observation Filed',  sub: '08 Sep', color: 'bg-amber-500',  done: true },
  { label: 'Repeated Anomaly',          sub: '09 Sep', color: 'bg-orange-500', done: true },
  { label: 'Escalating Sensor Trend',   sub: '10 Sep', color: 'bg-red-400',    done: true },
  { label: 'CURRENT STATE',             sub: '11 Sep', color: 'bg-red-600',    current: true },
  { label: 'POTENTIAL FUTURE FAILURE',  sub: 'Next 24h', color: 'bg-red-800', future: true },
];

function PredictionTimeline() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={16} className="text-amber-500" />
        <p className="text-sm font-bold text-[#1a2235]">Prediction Timeline — Compressor C-101</p>
        <span className="ml-auto text-[10px] font-mono text-slate-400 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">DEMO · SYNTHETIC DATA</span>
      </div>
      <div className="flex items-stretch gap-0">
        {timelineSteps.map((step, i) => (
          <div key={i} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {i < timelineSteps.length - 1 && (
              <div className={`absolute top-3 left-1/2 right-0 h-0.5 ${step.done ? 'bg-slate-300' : 'bg-slate-200'}`} style={{ zIndex: 0 }} />
            )}
            {/* Node */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center z-10 relative shrink-0 ${step.color} ${step.future ? 'ring-2 ring-red-300 ring-offset-2 opacity-80' : ''} ${step.current ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
            >
              {step.done && !step.current && !step.future && <CheckCircle2 size={12} className="text-white" strokeWidth={3} />}
              {step.current && <span className="w-2 h-2 bg-white rounded-full" />}
              {step.future && <AlertTriangle size={10} className="text-white" />}
            </div>
            {/* Label */}
            <div className="text-center mt-2 px-1">
              <p className={`text-[9px] font-bold leading-tight ${step.future ? 'text-red-600' : step.current ? 'text-red-600' : 'text-[#1a2235]'}`}>{step.label}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <AlertTriangle size={13} className="text-red-500 shrink-0" />
        <p className="text-xs text-red-700 font-semibold">RiskRadar identifies developing risk BEFORE the failure occurs.</p>
      </div>
    </div>
  );
}

// ── Sensor Mini Chart ─────────────────────────────────────────────────────────
function SensorMiniChart({ data, label, unit, baseline }: { data: typeof sensorTimeSeries.vibration; label: string; unit: string; baseline: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-[#1a2235]">{label}</p>
        <span className="text-[10px] font-mono text-red-500 font-bold">{data[data.length - 1].v}{unit} ↑</span>
      </div>
      <p className="text-[10px] text-slate-400 mb-3">Baseline: {baseline}{unit} · Compressor C-101</p>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
          <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={2} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} />
          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
          <ReferenceLine y={baseline} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
          <Line type="monotone" dataKey="v" stroke="#dc2626" strokeWidth={2} dot={false} name={label} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Predictions List View ─────────────────────────────────────────────────────
export function PredictionsView({ onInvestigate }: { onInvestigate: (id: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'Active Predictions', v: '6',  c: 'text-[#1a2235]' },
          { l: 'Critical',           v: '1',  c: 'text-red-600'   },
          { l: 'High Risk',          v: '2',  c: 'text-amber-600' },
          { l: 'Monitoring',         v: '3',  c: 'text-slate-600' },
        ].map(({ l, v, c }) => (
          <div key={l} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{l}</p>
            <p className={`text-3xl font-black font-mono mt-1 ${c}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Prediction timeline */}
      <PredictionTimeline />

      {/* Sensor trend preview */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-[#1a2235]">Escalating Sensor Signals — Compressor C-101</p>
            <p className="text-xs text-slate-400 mt-0.5">Normal → Slight deviation → Repeated anomaly → Current escalation</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">DEMO · SYNTHETIC SENSOR DATA</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SensorMiniChart data={sensorTimeSeries.vibration}   label="Vibration"    unit=" mm/s" baseline={2.1} />
          <SensorMiniChart data={sensorTimeSeries.temperature} label="Temperature"   unit="°C"   baseline={68}  />
          <SensorMiniChart data={sensorTimeSeries.current}     label="Current Draw"  unit=" A"   baseline={42}  />
        </div>
      </div>

      {/* Prediction cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-amber-500" />
          <p className="text-sm font-bold text-[#1a2235]">Active Predictions — All Facilities</p>
        </div>
        {predictions.map(pred => (
          <PredictionCard key={pred.id} pred={pred} onInvestigate={() => onInvestigate(pred.id)} />
        ))}
      </div>
    </div>
  );
}

// ── Prediction Detail / Investigation Page ────────────────────────────────────
export function PredictionDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const pred = predictions.find(p => p.id === id) ?? predictions[0];

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#1a2235] transition-colors">
        <ArrowRight size={14} className="rotate-180" /> Back to Predictions
      </button>

      {/* Header card */}
      <div className={`bg-white border-2 rounded-2xl shadow-sm p-6 ${pred.risk === 'HIGH' ? 'border-red-200' : 'border-amber-200'}`}>
        <div className="flex items-start gap-5">
          <ScoreRing score={pred.score} risk={pred.risk} />
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Predicted Future Failure</span>
                  <RiskBadge level={pred.risk} />
                  <span className="font-mono text-[10px] text-slate-400">{pred.id}</span>
                </div>
                <h2 className="text-xl font-black text-[#1a2235]">{pred.title}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {[
                    { l: 'Equipment',         v: pred.equipment },
                    { l: 'Facility',          v: pred.facility  },
                    { l: 'Zone',              v: pred.zone      },
                    { l: 'Failure Mode',      v: pred.failureMode },
                    { l: 'Horizon',           v: pred.horizon   },
                    { l: 'Confidence',        v: pred.confidence},
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{l}: </span>
                      <span className="text-xs font-semibold text-[#1a2235]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left 2 cols */}
        <div className="col-span-2 space-y-5">

          {/* Evidence breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-bold text-[#1a2235] mb-4">Why is RiskRadar predicting this?</p>
            <div className="space-y-3">
              {pred.evidence.map(ev => (
                <div key={ev.type} className="space-y-1">
                  <EvidenceBar label={ev.type} points={ev.points} />
                  <p className="text-[10px] text-slate-400 pl-[188px] leading-relaxed">{ev.desc}</p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-semibold">Prediction Score</p>
                <p className="text-lg font-black font-mono text-[#1a2235]">{pred.score}<span className="text-sm text-slate-400">/100</span></p>
              </div>
            </div>
          </div>

          {/* Sensor evidence */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-bold text-[#1a2235] mb-1">Sensor Evidence</p>
            <p className="text-[10px] text-slate-400 mb-4 uppercase tracking-wider font-mono">DEMO · SYNTHETIC SENSOR DATA</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {pred.sensorReadings.map(s => (
                <div key={s.sensor} className={`rounded-xl p-3 border ${s.status === 'Critical' ? 'bg-red-50 border-red-200' : s.status === 'High' ? 'bg-orange-50 border-orange-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#1a2235]">{s.sensor}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${s.status === 'Critical' ? 'bg-red-100 text-red-600' : s.status === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'}`}>{s.status}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-black font-mono text-[#1a2235]">{s.current}</span>
                    <span className="text-xs text-slate-400">{s.unit}</span>
                    <span className={`text-xs font-bold ml-auto ${s.delta.startsWith('+') ? 'text-red-500' : 'text-amber-500'}`}>{s.delta}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">Baseline: {s.baseline}{s.unit}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <SensorMiniChart data={sensorTimeSeries.vibration}   label="Vibration"   unit=" mm/s" baseline={2.1} />
              <SensorMiniChart data={sensorTimeSeries.temperature} label="Temperature"  unit="°C"   baseline={68} />
              <SensorMiniChart data={sensorTimeSeries.current}     label="Current"      unit=" A"   baseline={42} />
            </div>
          </div>

          {/* Worker evidence */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-bold text-[#1a2235] mb-4">Worker Observation Evidence</p>
            <div className="space-y-3">
              {pred.workerObservations.map(obs => (
                <div key={obs.id} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0 mt-0.5">{obs.id}</span>
                  <p className="text-sm text-[#1a2235] flex-1 italic">"{obs.text}"</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{obs.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical evidence */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-bold text-[#1a2235] mb-4">Historical Pattern Evidence</p>
            <div className="space-y-2">
              {pred.historicalMatches.map((h, i) => (
                <div key={i} className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                  <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                  <p className="text-xs text-[#1a2235] flex-1">{h.desc}</p>
                  <span className="text-[10px] text-slate-400">{h.date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-[10px] text-green-700 font-medium">{h.similarity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Potential failure pathway */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-sm font-bold text-[#1a2235] mb-4">Potential Failure Pathway</p>
            <div className="flex items-start gap-0">
              {pred.pathway.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className={`w-full rounded-xl border px-2 py-2.5 text-center mx-1 ${i === pred.pathway.length - 1 ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`}>
                    <p className={`text-[10px] font-semibold leading-tight ${i === pred.pathway.length - 1 ? 'text-red-600' : 'text-[#1a2235]'}`}>{step}</p>
                  </div>
                  {i < pred.pathway.length - 1 && (
                    <div className="flex items-center justify-center w-full mt-2">
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-800"><span className="font-bold">Note:</span> This is an AI-generated potential failure pathway for safety investigation. It represents possible sequences, not confirmed causality.</p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-[#0f1824] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-amber-400" />
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Recommended Action</p>
            </div>
            <p className="text-sm text-white/85 leading-relaxed">{pred.recommendedAction}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prediction Details</p>
            {[
              { l: 'Created',    v: pred.createdAt },
              { l: 'Status',     v: pred.status   },
              { l: 'Horizon',    v: pred.horizon  },
              { l: 'Confidence', v: pred.confidence },
            ].map(({ l, v }) => (
              <div key={l} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{l}</span>
                <span className="text-xs font-semibold text-[#1a2235]">{v}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors">
            Initiate Preventive Inspection
          </button>
          <button className="w-full py-3 rounded-xl border border-slate-200 text-[#1a2235] text-sm font-medium hover:bg-slate-50 transition-colors">
            Assign to Safety Team
          </button>
          <button className="w-full py-3 rounded-xl border border-slate-200 text-[#1a2235] text-sm font-medium hover:bg-slate-50 transition-colors">
            View Related Reports
          </button>
        </div>
      </div>
    </div>
  );
}
