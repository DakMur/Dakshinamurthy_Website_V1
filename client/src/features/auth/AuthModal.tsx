import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Key from 'lucide-react/dist/esm/icons/key';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import LogIn from 'lucide-react/dist/esm/icons/log-in';
import X from 'lucide-react/dist/esm/icons/x';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import { Team, RegistrationConfig } from "../../types/types";
import RegistrationForm from "../registration/components/RegistrationForm";

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialTab?: 'login' | 'register';
  currentTeam?: Team | null;
  config?: RegistrationConfig;
  onLoginSuccess: (team: Team) => void;
  onAdminBypass?: () => void;
  onNavigateWorkspace: () => void;
  onLogout?: () => void;
}

export default function AuthModal({
  isOpen = true,
  onClose,
  initialTab = 'login',
  currentTeam,
  config: initialConfig,
  onLoginSuccess,
  onAdminBypass,
  onNavigateWorkspace,
  onLogout
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [config, setConfig] = useState<RegistrationConfig>(
    initialConfig || {
      status: 'Registration Open',
      minMembers: 2,
      maxMembers: 4,
      disableTeamLogin: false,
      allowDocumentUpload: true,
      allowMemberEdits: true,
    }
  );

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      return;
    }
    fetch('/api/v1/registration/config')
      .then(res => res.json())
      .then(raw => {
        const data = raw?.data || raw;
        if (data && typeof data === 'object') {
          setConfig(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, [initialConfig]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/registration/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        const isAdmin = data.admin === true || data.user?.role === 'ADMIN';

        if (isAdmin && data.token) {
          localStorage.setItem("admin_token", data.token);
          localStorage.setItem("token", data.token);
          if (onAdminBypass) {
            onAdminBypass();
          }
        } else if (isAdmin && onAdminBypass) {
          onAdminBypass();
        } else {
          // Store team session
          try {
            localStorage.setItem("dakshina_current_team", JSON.stringify(data.team));
            if (data.token) {
              localStorage.setItem("token", data.token);
            }
          } catch {}
          onLoginSuccess(data.team);
          onNavigateWorkspace();
          if (onClose) onClose();
        }
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSuccess = (newTeam: Team) => {
    try {
      localStorage.setItem("dakshina_current_team", JSON.stringify(newTeam));
    } catch {}
    onLoginSuccess(newTeam);
    onNavigateWorkspace();
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 select-none">
      <div className="p-6 sm:p-8 rounded-3xl border border-gold-vintage/30 bg-[#08070e]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.12)] relative overflow-hidden">
        
        {/* Header Close button if modal wrapper */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ── Case 1: If user is ALREADY authenticated as a team ── */}
        {currentTeam ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-14 h-14 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-gold-vintage uppercase block">
                Active Session Detected
              </span>
              <h3 className="font-display font-medium text-2xl text-white tracking-wider">
                {currentTeam.teamName || "Your Team"}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Authenticated Leader: {currentTeam.leaderEmail}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  onNavigateWorkspace();
                  if (onClose) onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold tracking-wider text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              >
                <span>Go To Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onLogout && (
                <button
                  onClick={() => {
                    localStorage.removeItem("dakshina_current_team");
                    localStorage.removeItem("token");
                    localStorage.removeItem("admin_token");
                    onLogout();
                  }}
                  className="py-3 px-4 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-400 font-mono text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Switch Team</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── Case 2: Unauthenticated — Login & Register Tabs ── */
          <div className="space-y-6">
            
            {/* Tab Switches */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                onClick={() => { setTab('login'); setError(""); }}
                className={`flex-1 py-2 rounded-lg font-mono text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tab === 'login'
                    ? 'bg-gold-vintage text-black font-semibold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Team Login</span>
              </button>

              <button
                onClick={() => { setTab('register'); setError(""); }}
                className={`flex-1 py-2 rounded-lg font-mono text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tab === 'register'
                    ? 'bg-gold-vintage text-black font-semibold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Registration</span>
              </button>
            </div>

            {/* TAB CONTENT: LOGIN */}
            {tab === 'login' && (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div className="text-center space-y-1 pb-1">
                  <h3 className="font-display font-medium text-xl tracking-widest uppercase text-gold-vintage">
                    Team Leader Access
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Enter your registered email and password to enter your workspace.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block pl-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
                    placeholder="leader@college.edu"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block pl-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-400 font-mono text-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-4 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold tracking-wider text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? "Authenticating..." : "LOGIN TO WORKSPACE"}
                </button>
              </motion.form>
            )}

            {/* TAB CONTENT: REGISTRATION */}
            {tab === 'register' && (
              <motion.div
                key="register-content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <RegistrationForm
                  config={config}
                  onBack={() => setTab('login')}
                  onSuccess={handleRegisterSuccess}
                />
              </motion.div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
