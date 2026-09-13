export type Screen =
  | 'worker-home'
  | 'worker-voice'
  | 'worker-chat'
  | 'worker-analysis'
  | 'worker-result'
  | 'worker-related'
  | 'worker-chain'
  | 'dashboard-overview'
  | 'dashboard-reports'
  | 'dashboard-sif'
  | 'dashboard-chains'
  | 'dashboard-heatmap'
  | 'dashboard-analytics'
  | 'report-detail'
  | 'chain-detail'
  | 'report-explorer';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';

export interface Report {
  id: string;
  date: string;
  time: string;
  zone: string;
  equipment: string;
  description: string;
  hazard: string;
  risk: RiskLevel;
  status: 'Open' | 'Investigate' | 'Monitoring' | 'Closed';
  isSIF: boolean;
  reporterType: 'Frontline Worker' | 'Supervisor' | 'Contractor';
}
