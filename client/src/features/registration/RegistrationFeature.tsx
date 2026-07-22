import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import RegistrationGate from "./components/RegistrationGate";
import RegistrationForm from "./components/RegistrationForm";
import TeamDashboard from "./components/TeamDashboard";
// Admin panel is lazy — only fetched when admin bypass is triggered
const AdminControlPanel = lazy(() => import("./components/AdminControlPanel"));
import { Team, RegistrationConfig } from "../../types/types";

interface RegistrationFeatureProps {
  // Existing props from AdminPanel
  domains: any[];
  articles: any[];
  timeline: any[];
  quotes: any[];
  comments: any[];
  analytics: any;
  currentUser: any;
  onLogin: (user: any) => void;
  onLogout: () => void;
  onRefreshData: () => void;
}

export default function RegistrationFeature(props: RegistrationFeatureProps) {
  const [view, setView] = useState<'gate' | 'form' | 'dashboard' | 'admin'>('gate');
  const [team, setTeam] = useState<Team | null>(null);
  const [config, setConfig] = useState<RegistrationConfig | null>(null);

  useEffect(() => {
    // Fetch global registration config
    fetch('/api/v1/registration/config')
      .then(r => r.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Error loading registration config:", err));
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
    props.onLogout(); // If needed to sync with main app state
  };

  if (!config) {
    return <div className="text-white text-center py-12 font-mono">Loading Registration Core...</div>;
  }

  return (
    <div className="w-full min-h-screen pt-20 pb-12 px-4 flex flex-col items-center justify-start gap-4">
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
          <motion.div key="admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
              </div>
            }>
              <AdminControlPanel 
                {...props}
                config={config}
                onConfigUpdate={(updatedConfig) => setConfig(updatedConfig)}
                onLogout={handleLogout}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
