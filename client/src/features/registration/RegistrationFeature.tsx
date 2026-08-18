import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import RegistrationGate from "./components/RegistrationGate";
import RegistrationForm from "./components/RegistrationForm";
import TeamWorkspace from "../workspace/TeamWorkspace";
// Admin panel is lazy — only fetched when admin bypass is triggered
const AdminControlPanel = lazy(() => import("./components/AdminControlPanel"));
import { Team, RegistrationConfig } from "../../types/types";

interface RegistrationFeatureProps {
  currentUser: any;
  currentTeam?: Team | null;
  onLogin: (user: any) => void;
  onLogout: () => void;
  onTeamLogin?: (team: Team) => void;
  onNavigateWorkspace?: () => void;
  onRefreshData: () => void;
}

export default function RegistrationFeature(props: RegistrationFeatureProps) {
  const [view, setView] = useState<'gate' | 'form' | 'workspace' | 'admin'>(() => {
    return props.currentTeam ? 'workspace' : 'gate';
  });
  const [team, setTeam] = useState<Team | null>(props.currentTeam || null);
  const [config, setConfig] = useState<RegistrationConfig>({
    status: 'Registration Open',
    minMembers: 2,
    maxMembers: 4,
    disableTeamLogin: false,
    allowDocumentUpload: true,
    allowMemberEdits: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.currentTeam) {
      setTeam(props.currentTeam);
      setView('workspace');
    }
  }, [props.currentTeam]);

  // Safety guard: if workspace view is active but team is null, reset back to gate
  useEffect(() => {
    if (view === 'workspace' && !team && !props.currentTeam) {
      setView('gate');
    }
  }, [view, team, props.currentTeam]);

  useEffect(() => {
    // Fetch global registration config
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/v1/registration/config');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const data = raw?.data || raw;
        if (data && typeof data === 'object') {
          setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Using fallback config due to fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleLoginSuccess = (teamData: Team) => {
    setTeam(teamData);
    try {
      localStorage.setItem("dakshina_current_team", JSON.stringify(teamData));
    } catch {}
    if (props.onTeamLogin) {
      props.onTeamLogin(teamData);
    }
    if (props.onNavigateWorkspace) {
      props.onNavigateWorkspace();
    } else {
      setView('workspace');
    }
  };

  const handleAdminBypass = () => {
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
    try {
      localStorage.removeItem('dakshina_current_team');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('token');
      sessionStorage.removeItem('dakshina_current_team');
      sessionStorage.removeItem('token');
    } catch {}
    props.onLogout();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-8 pb-12 px-4 space-y-4 z-10 relative">
      <AnimatePresence mode="wait">
        {view === 'gate' && (
          <motion.div key="gate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
            <RegistrationGate
              config={config}
              onLoginSuccess={handleLoginSuccess}
              onAdminBypass={handleAdminBypass}
              onRegisterClick={handleGoToRegister}
            />
          </motion.div>
        )}

        {view === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
            <RegistrationForm
              config={config}
              onBack={() => setView('gate')}
              onSuccess={(teamData) => handleLoginSuccess(teamData)}
            />
          </motion.div>
        )}

        {view === 'workspace' && (team || props.currentTeam) && (
          <motion.div key="workspace" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
            <TeamWorkspace
              team={team || props.currentTeam!}
              config={config}
              currentUser={props.currentUser}
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
