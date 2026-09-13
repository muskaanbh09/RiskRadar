import { useState } from 'react';
import LoginPage from './views/LoginPage';
import WorkerFlow from './views/WorkerFlow';
import OfficerDashboard from './views/OfficerDashboard';
import { login } from './api';

export type Role = 'worker' | 'officer';
type AppScreen = 'login' | 'worker' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('login');
  const [role, setRole] = useState<Role>('worker');
  const [token, setToken] = useState(() => localStorage.getItem('riskradar_token') ?? '');

  async function authenticate(username: string, password: string, requestedRole: Role) {
    const response = await login(username, password);
    const nextRole = response.user.role === requestedRole ? requestedRole : response.user.role;
    localStorage.setItem('riskradar_token', response.access_token);
    setToken(response.access_token);
    setRole(nextRole);
    setScreen(nextRole === 'officer' ? 'dashboard' : 'worker');
  }

  function logout() {
    localStorage.removeItem('riskradar_token');
    setToken('');
    setScreen('login');
  }

  return (
    <div className="h-full">
      {screen === 'login' && (
        <LoginPage onAuthenticate={authenticate} />
      )}
      {screen === 'worker' && (
        <WorkerFlow token={token} onSwitchToDashboard={() => { setRole('officer'); setScreen('dashboard'); }} onLogout={logout} role={role} />
      )}
      {screen === 'dashboard' && (
        <OfficerDashboard token={token} onSwitchToWorker={() => { setRole('worker'); setScreen('worker'); }} onLogout={logout} role={role} />
      )}
    </div>
  );
}
