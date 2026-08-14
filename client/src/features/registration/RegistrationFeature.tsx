import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import RegistrationGate from "./components/RegistrationGate";
import RegistrationForm from "./components/RegistrationForm";
import TeamDashboard from "./components/TeamDashboard";
// Admin panel is lazy — only fetched when admin bypass is triggered
const AdminControlPanel = lazy(() => import("./components/AdminControlPanel"));
import { Team, RegistrationConfig } from "../../types/types";

interface RegistrationFeatureProps {
  currentUser: any;
  onLogin: (user: any) => void;
  onLogout: () => void;
  onRefreshData: () => void;
}

export default function RegistrationFeature(props: RegistrationFeatureProps) {
  const [view, setView] = useState<'gate' | 'form' | 'dashboard' | 'admin'>('gate');
  const [team, setTeam] = useState<Team | null>(null);
  const [config, setConfig] = useState<RegistrationConfig>({
    status: 'Registration Open',
    minMembers: 2,
    maxMembers: 4,
    disableTeamLogin: false,
    allowDocumentUpload: true,
    allowMemberEdits: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Safety guard: if dashboard view is active but team is null (e.g. from a
  // payload mismatch during login), reset back to gate to avoid blank screen.
  useEffect(() => {
    if (view === 'dashboard' && !team) {
      setView('gate');
    }
  }, [view, team]);

  useEffect(() => {
    // Fetch global registration config
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/v1/registration/config');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        // Safely unwrap nested or flat response shapes
        const data = raw?.data || raw;
        if (data && typeof data === 'object') {
          setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Using fallback config due to fetch error:', err);
        // Keep the default state — component will still render
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleLoginSuccess = (teamData: Team) => {
    setTeam(teamData);
    setView('dashboard');
  };

  const handleAdminBypass = () => {
    // Admin bypass sets the current view to admin and auto-authenticates the parent session
    props.onLogin({
      id: "bypass",
      role: "admin",
      name: "Sovereign Admin",
      email: "admin@dakshina.org",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    });
    setView('admin');
  };

  const handleGoToRegister = () => {
    setView('form');
  };

  const handleLogout = () => {
    setTeam(null);
    setView('gate');
    // Clear stored admin tokens so stale credentials don't persist
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token');
    props.onLogout();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-16 md:pt-20 pb-12 px-4 space-y-4 z-10 relative">
      <AnimatePresence mode="wait">
        {view === 'gate' && (
          <motion.div key="gate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <RegistrationGate
              config={config}
              onLoginSuccess={handleLoginSuccess}
              onAdminBypass={handleAdminBypass}
              onRegisterClick={handleGoToRegister}
            />
          </motion.div>
        )}

        {view === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <RegistrationForm
              config={config}
              onBack={() => setView('gate')}
              onSuccess={(teamData) => handleLoginSuccess(teamData)}
            />
          </motion.div>
        )}

        {view === 'dashboard' && team && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <TeamDashboard
              team={team}
              config={config}
              onUpdateTeam={(updated) => setTeam(updated)}
              onLogout={handleLogout}
            />
          </motion.div>
        )}

        {view === 'admin' && (
          <motion.div key="admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
              </div>
            }>
              <AdminControlPanel
                currentUser={props.currentUser}
                config={config}
                onLogin={(usr) => props.onLogin(usr)}
                onLogout={handleLogout}
                onRefreshData={props.onRefreshData}
                onConfigUpdate={(updatedConfig) => setConfig(updatedConfig)}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
