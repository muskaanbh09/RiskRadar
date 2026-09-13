const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface ApiUser {
  id: number
  name: string
  username: string
  role: 'worker' | 'officer'
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: ApiUser
}

export interface Report {
  id: string
  date: string
  time: string
  zone: string
  equipment: string
  description: string
  hazard: string
  risk: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL'
  status: 'Open' | 'Investigate' | 'Monitoring' | 'Closed'
  isSIF: boolean
  reporterType: string
}

export interface DashboardSummary {
  totalReports: number
  sifReports: number
  highRiskReports: number
  activePredictions: number
  criticalPredictions: number
  openInvestigations: number
  hazardCategories: Array<{ name: string; count: number }>
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail ?? `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function login(username: string, password: string) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function createReport(token: string, payload: {
  description: string
  zone?: string
  equipment?: string
  hazard?: string
  reporter_type?: string
}) {
  return request<Report>('/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token)
}

export function getDashboardSummary(token: string) {
  return request<DashboardSummary>('/dashboard/summary', {}, token)
}

export function getReports(token: string) {
  return request<Report[]>('/reports', {}, token)
}

export { API_BASE_URL }
