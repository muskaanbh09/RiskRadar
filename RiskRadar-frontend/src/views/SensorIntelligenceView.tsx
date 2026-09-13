import {
  Activity, Thermometer, Zap, AlertTriangle, CheckCircle2,
  TrendingUp, Info
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { sensorTimeSeries } from '../data/mockData';

// Equipment sensors
const equipment = [
  {
    id: 'C-101',
    name: 'Compressor C-101',
    zone: 'Zone B',
    status: 'Critical',
    sensors: [
      { name: 'Temperature',  value: 85,   unit: '°C',    baseline: 68,  status: 'Critical', delta: '+25%' },
      { name: 'Vibration',    value: 2.6,  unit: 'mm/s',  baseline: 2.1, status: 'High',     delta: '+23%' },
      { name: 'Current Draw', value: 46.7, unit: 'A',     baseline: 42,  status: 'Elevated', delta: '+11%' },
      { name: 'Motor RPM',    value: 2891, unit: 'rpm',   baseline: 2950,status: 'Watch',    delta: '-2%'  },
    ],
  },
  {
    id: 'P-312',
    name: 'Pump P-312',
    zone: 'Zone D',
    status: 'Elevated',
    sensors: [
      { name: 'Pressure Delta',  value: 3.8, unit: 'bar', baseline: 4.2, status: 'Elevated', delta: '-10%' },
      { name: 'Flow Rate',       value: 109, unit: 'm³/h',baseline: 120, status: 'Watch',    delta: '-9%'  },
      { name: 'Temperature',     value: 61,  unit: '°C',  baseline: 55,  status: 'Elevated', delta: '+11%' },
    ],
  },
  {
    id: 'H-07',
    name: 'Heat Exchanger H-07',
    zone: 'Zone E',
    status: 'Watch',
    sensors: [
      { name: 'Outlet Temp',     value: 87,  unit: '°C',  baseline: 95,  status: 'Elevated', delta: '-8%' },
      { name: 'Pressure Drop',   value: 1.2, unit: 'bar', baseline: 0.8, status: 'High',     delta: '+50%'},
      { name: 'Flow Efficiency', value: 91,  unit: '%',   baseline: 100, status: 'Watch',    delta: '-9%' },
    ],
  },
  {
    id: 'V-331',
    name: 'Valve V-331',
    zone: 'Zone C',
    status: 'Normal',
    sensors: [
      { name: 'Actuator Pressure', value: 5.1, unit: 'bar', baseline: 5.0, status: 'Normal', delta: '+2%' },
      { name: 'Position Feedback', value: 98,  unit: '%',   baseline: 100, status: 'Normal', delta: '-2%' },
    ],
  },
];

const statusConfig: Record<string, { bg: string; border: string; text: string; dot: string; badge: string }> = {
  Critical: { bg: 'bg-red-50',    border: 'border-red-300',   text: 'text-red-700',   dot: 'bg-red-500',   badge: 'bg-red-100 text-red-700'   },
  High:     { bg: 'bg-orange-50', border: 'border-orange-200',text: 'text-orange-700',dot: 'bg-orange-400',badge: 'bg-orange-100 text-orange-700'},
  Elevated: { bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700' },
  Watch:    { bg: 'bg-yellow-50', border: 'border-yellow-200',text: 'text-yellow-700',dot: 'bg-yellow-400',badge: 'bg-yellow-100 text-yellow-700'},
  Normal:   { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-400', badge: 'bg-green-100 text-green-700' },
};

function SensorChip({ s }: { s: typeof equipment[0]['sensors'][0] }) {
  const c = statusConfig[s.status];
  const isDelta = s.delta.startsWith('+') ? 'text-red-500' : s.delta.startsWith('-') && ['°C', 'A', 'mm/s'].some(u => s.unit.includes(u)) ? 'text-red-500' : 'text-amber-500';
  return (
    <div className={`rounded-xl border ${c.bg} ${c.border} p-3`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{s.name}</p>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${c.badge}`}>{s.status}</span>
      </div>
      <p className="text-xl font-black font-mono text-[#1a2235]">{s.value}<span className="text-xs text-slate-400 ml-0.5">{s.unit}</span></p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[9px] text-slate-400">Baseline: {s.baseline}{s.unit}</p>
        <span className={`text-[10px] font-bold ${isDelta}`}>{s.delta}</span>
      </div>
    </div>
  );
}

// Combined escalation chart
const combinedData = sensorTimeSeries.vibration.map((d, i) => ({
  t: d.t,
  vibration: d.v,
  temperature: sensorTimeSeries.temperature[i]?.v ?? 0,
  label: d.label ?? sensorTimeSeries.temperature[i]?.label,
}));

export default function SensorIntelligenceView() {
  return (
    <div className="space-y-5">
      {/* Notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          <span className="font-bold">DEMO · SYNTHETIC SENSOR DATA</span> — All sensor readings below are illustrative demo data generated for the SIH 2026 presentation. They demonstrate how RiskRadar detects escalating patterns from Normal → Anomaly → Escalation → Predicted Failure.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'Total Sensors Monitored', v: '47',  c: 'text-[#1a2235]' },
          { l: 'Anomalies Active',         v: '8',   c: 'text-red-600'   },
          { l: 'Escalating Trends',        v: '3',   c: 'text-amber-600' },
          { l: 'Normal State',             v: '36',  c: 'text-green-600' },
        ].map(({ l, v, c }) => (
          <div key={l} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider">{l}</p>
            <p className={`text-3xl font-black font-mono mt-1 ${c}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* Combined escalation chart */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-red-500" />
          <p className="text-sm font-bold text-[#1a2235]">Compressor C-101 — Multi-Sensor Escalation Pattern</p>
        </div>
        <p className="text-xs text-slate-400 mb-5">Demonstrates how RiskRadar detects correlated sensor escalation over time</p>

        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
          {[
            { label: 'Normal state', color: 'bg-green-400' },
            { label: 'First anomaly', color: 'bg-yellow-400' },
            { label: 'Repeated anomaly', color: 'bg-orange-400' },
            { label: 'Escalating', color: 'bg-red-400' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              {label}
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="vib" domain={[1.8, 3.0]} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={32} />
            <YAxis yAxisId="temp" orientation="right" domain={[60, 92]} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="vib" y={2.1} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1} label={{ value: 'Vib baseline', position: 'left', fontSize: 9, fill: '#94a3b8' }} />
            <ReferenceLine yAxisId="temp" y={68} stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={1} />
            <Line yAxisId="vib"  type="monotone" dataKey="vibration"    stroke="#f97316" strokeWidth={2.5} dot={{ r: 3, fill: '#f97316' }} name="Vibration (mm/s)" />
            <Line yAxisId="temp" type="monotone" dataKey="temperature"  stroke="#dc2626" strokeWidth={2.5} dot={{ r: 3, fill: '#dc2626' }} name="Temperature (°C)" />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[
            { label: '01–05 Sep', desc: 'Normal operation', color: 'bg-green-50 border-green-200 text-green-700' },
            { label: '06 Sep',    desc: 'First anomaly detected', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
            { label: '07–09 Sep', desc: 'Repeated anomalies', color: 'bg-orange-50 border-orange-200 text-orange-700' },
            { label: '10–11 Sep', desc: 'Escalating — prediction triggered', color: 'bg-red-50 border-red-200 text-red-700' },
          ].map(({ label, desc, color }) => (
            <div key={label} className={`rounded-lg border px-2 py-2 text-center ${color}`}>
              <p className="text-[10px] font-bold">{label}</p>
              <p className="text-[9px] mt-0.5 opacity-80">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment sensor grid */}
      <div className="space-y-4">
        {equipment.map(eq => {
          const c = statusConfig[eq.status];
          return (
            <div key={eq.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className={`px-5 py-3 flex items-center gap-3 border-b ${c.bg} ${c.border}`}>
                <Activity size={15} className={c.text} />
                <p className="text-sm font-bold text-[#1a2235]">{eq.name}</p>
                <span className="text-xs text-slate-400">{eq.zone}</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-xs font-bold ${c.text}`}>{eq.status}</span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-4 gap-3">
                {eq.sensors.map(s => (
                  <SensorChip key={s.name} s={s} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
