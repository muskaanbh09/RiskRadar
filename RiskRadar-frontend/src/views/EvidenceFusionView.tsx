import { Activity, FileText, BarChart3, ArrowDown, AlertTriangle, CheckCircle2, Zap, TrendingUp } from 'lucide-react';

const workerReports = [
  { id: 'R-1092', text: 'Compressor se unusual vibration aa rahi hai.', time: '08:30 AM', match: true },
  { id: 'R-1089', text: 'Compressor making unusual grinding noise.',     time: '07:45 AM', match: true },
  { id: 'R-1085', text: 'Compressor body feels unusually hot.',          time: '06:20 AM', match: true },
];

const sensorSignals = [
  { label: 'Vibration',    delta: '+23%', val: '2.6 mm/s', baseline: '2.1 mm/s', escalating: true },
  { label: 'Temperature',  delta: '+25%', val: '85°C',     baseline: '68°C',     escalating: true },
  { label: 'Current Draw', delta: '+11%', val: '46.7 A',   baseline: '42 A',     escalating: true },
];

const historicalMatches = [
  { desc: 'Similar vibration pattern preceded bearing failure',  date: '12 Jun 2026', weight: 'Strong'      },
  { desc: 'Abnormal current + temperature → motor winding fault', date: '28 Jul 2026', weight: 'Relevant'   },
  { desc: 'Compressor maintenance issue — same zone',            date: '01 Sep 2026', weight: 'Contextual'  },
];

const patternReports = [
  { id: '1', text: 'Pump vibration increased.', worker: 'Worker A' },
  { id: '2', text: 'Pump making unusual noise.', worker: 'Worker B' },
  { id: '3', text: 'Pump temperature feels high.', worker: 'Worker C' },
];

export default function EvidenceFusionView() {
  return (
    <div className="space-y-6">
      {/* Header message */}
      <div className="bg-[#0f1824] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Zap size={18} className="text-amber-400" />
          <p className="text-base font-black text-white">Evidence Fusion — How RiskRadar Builds a Prediction</p>
        </div>
        <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
          Individually, a worker observation or a single sensor reading may seem minor. RiskRadar combines all available signals — sensor anomalies, worker observations, and historical patterns — to detect emerging risk that would otherwise remain invisible.
        </p>
      </div>

      {/* Main fusion diagram */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <p className="text-sm font-bold text-[#1a2235] mb-6">Evidence Fusion — Compressor C-101</p>

        <div className="grid grid-cols-3 gap-5">
          {/* Column 1: Sensor data */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Activity size={14} className="text-blue-600" />
              </div>
              <p className="text-xs font-bold text-[#1a2235] uppercase tracking-wider">Sensor Data</p>
            </div>
            {sensorSignals.map(s => (
              <div key={s.label} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#1a2235]">{s.label}</p>
                  <span className="text-xs font-bold text-red-500">{s.delta}</span>
                </div>
                <p className="text-base font-black font-mono text-blue-700 mt-0.5">{s.val}</p>
                <p className="text-[9px] text-slate-400">Baseline: {s.baseline}</p>
                {s.escalating && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <TrendingUp size={9} className="text-red-400" />
                    <span className="text-[9px] text-red-500 font-semibold">Escalating trend</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Column 2: Worker observations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                <FileText size={14} className="text-amber-600" />
              </div>
              <p className="text-xs font-bold text-[#1a2235] uppercase tracking-wider">Worker Observations</p>
            </div>
            {workerReports.map(r => (
              <div key={r.id} className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[9px] font-bold text-amber-600">{r.id}</span>
                  <span className="text-[9px] text-slate-400">{r.time}</span>
                </div>
                <p className="text-xs text-[#1a2235] italic leading-relaxed">"{r.text}"</p>
                {r.match && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <CheckCircle2 size={9} className="text-amber-500" />
                    <span className="text-[9px] text-amber-600 font-semibold">Matches equipment signal</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Column 3: Historical patterns */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                <BarChart3 size={14} className="text-green-600" />
              </div>
              <p className="text-xs font-bold text-[#1a2235] uppercase tracking-wider">Historical Patterns</p>
            </div>
            {historicalMatches.map((h, i) => (
              <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs text-[#1a2235] leading-relaxed">{h.desc}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[9px] text-slate-400">{h.date}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${h.weight === 'Strong' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{h.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Convergence arrow */}
        <div className="flex items-center justify-center gap-5 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-px h-5 bg-slate-300" />
              <div className="w-3 h-3 border-r-2 border-b-2 border-slate-400 rotate-45 -mt-1.5" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-px h-5 bg-slate-300" />
              <div className="w-3 h-3 border-r-2 border-b-2 border-slate-400 rotate-45 -mt-1.5" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-px h-5 bg-slate-300" />
              <div className="w-3 h-3 border-r-2 border-b-2 border-slate-400 rotate-45 -mt-1.5" />
            </div>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Emerging pattern */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <p className="text-sm font-black text-[#1a2235] uppercase tracking-wide">Emerging Pattern Detected</p>
          </div>
          <p className="text-xs text-slate-500">Multi-sensor anomaly correlating with worker observations and historical recurrence</p>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-red-300" />
            <div className="w-3 h-3 border-r-2 border-b-2 border-red-400 rotate-45 -mt-2" />
          </div>
        </div>

        {/* Prediction output */}
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Prediction Output</p>
              <p className="text-lg font-black text-[#1a2235] mt-1">Potential Compressor Mechanical Failure</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span>Risk: <span className="font-bold text-red-600">HIGH</span></span>
                <span>Score: <span className="font-bold text-[#1a2235] font-mono">84/100</span></span>
                <span>Horizon: <span className="font-bold text-amber-600">Next 24 Hours</span></span>
              </div>
            </div>
            <AlertTriangle size={32} className="text-red-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* Common pattern detection */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={16} className="text-[#1a2235]" />
          <p className="text-sm font-bold text-[#1a2235]">Common Pattern Detection — Multiple Worker Reports</p>
        </div>
        <p className="text-xs text-slate-400 mb-5">Individual reports may seem minor. RiskRadar detects when multiple observations point to the same developing risk.</p>

        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-2">
            {patternReports.map((r, i) => (
              <div key={r.id}>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="w-6 h-6 rounded-full bg-[#1a2235] text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                  <div>
                    <p className="text-xs text-[#1a2235] font-medium italic">"{r.text}"</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{r.worker} · Pump P-312</p>
                  </div>
                </div>
                {i < patternReports.length - 1 && (
                  <div className="flex items-center pl-[18px] h-4">
                    <ArrowDown size={12} className="text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-2 px-4 self-center">
            <div className="w-px h-8 bg-amber-300" />
            <div className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 text-center whitespace-nowrap">Pattern detected</div>
            <div className="w-px h-8 bg-amber-300" />
          </div>

          <div className="w-64 shrink-0 space-y-3">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Common Pattern</p>
              <p className="text-sm font-black text-[#1a2235] mt-1">Possible Pump Mechanical Degradation</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sensor cross-check</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Pressure delta</span>
                <span className="font-mono font-bold text-amber-600">-10% ↓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Flow rate</span>
                <span className="font-mono font-bold text-amber-600">-9% ↓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Temperature</span>
                <span className="font-mono font-bold text-red-500">+11% ↑</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center">Sensor data corroborates worker reports → Prediction PRED-002 generated</p>
          </div>
        </div>
      </div>

      {/* Product philosophy */}
      <div className="bg-[#0f1824] rounded-2xl p-6 grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Traditional Safety</p>
          <div className="space-y-1 text-xs text-white/50">
            <p>Incident occurs</p>
            <p>↓ Workers file report</p>
            <p>↓ Officer reviews</p>
            <p>↓ Investigation starts</p>
            <p className="text-red-400 font-semibold">↓ React — often too late</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-px h-full bg-white/10" />
          <div className="text-center px-4">
            <Zap size={24} className="text-amber-400 mx-auto mb-2" />
            <p className="text-white font-black text-sm">vs</p>
          </div>
          <div className="w-px h-full bg-white/10" />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-amber-400/70 uppercase tracking-widest">RiskRadar</p>
          <div className="space-y-1 text-xs text-white/70">
            <p>Sensors detect anomaly</p>
            <p>↓ Worker observation filed</p>
            <p>↓ Patterns connected</p>
            <p>↓ Failure predicted</p>
            <p className="text-green-400 font-semibold">↓ Prevent before it happens</p>
          </div>
        </div>
      </div>
    </div>
  );
}
