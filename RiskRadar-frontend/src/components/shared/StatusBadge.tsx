const configs: Record<string, string> = {
  Open: 'bg-blue-50 text-blue-700 border border-blue-200',
  Investigate: 'bg-red-50 text-red-700 border border-red-200',
  Monitoring: 'bg-amber-50 text-amber-700 border border-amber-200',
  Closed: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${configs[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
