import type { RiskLevel } from '../../types';

const configs: Record<RiskLevel, { bg: string; text: string; dot: string }> = {
  CRITICAL: { bg: 'bg-red-100 border border-red-200', text: 'text-red-800', dot: 'bg-red-600' },
  HIGH: { bg: 'bg-red-50 border border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
  MEDIUM: { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  LOW: { bg: 'bg-green-50 border border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
};

export default function RiskBadge({ level, size = 'sm' }: { level: RiskLevel; size?: 'xs' | 'sm' | 'md' }) {
  const c = configs[level];
  const padding = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded font-mono font-semibold tracking-wide ${padding} ${c.bg} ${c.text}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {level}
    </span>
  );
}
