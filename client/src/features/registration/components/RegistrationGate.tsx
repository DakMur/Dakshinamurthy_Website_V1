import { useState, useEffect } from "react";
import Key from 'lucide-react/dist/esm/icons/key';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import LogIn from 'lucide-react/dist/esm/icons/log-in';
import { Team, RegistrationConfig } from "../../../types/types";

interface RegistrationGateProps {
  config: RegistrationConfig;
  onLoginSuccess: (team: Team) => void;
  onAdminBypass: () => void;
  onRegisterClick: () => void;
}

export default function RegistrationGate({ config, onLoginSuccess, onAdminBypass, onRegisterClick }: RegistrationGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        // Detect admin login by explicit flag OR by role claim in user object
        const isAdmin = data.admin === true || data.user?.role === 'ADMIN';

        if (isAdmin && data.token) {
          // TODO(security): Storing tokens in localStorage is vulnerable to XSS.
          // Migrate to HttpOnly cookie strategy when backend session support is added.
          localStorage.setItem("admin_token", data.token);
          localStorage.setItem("token", data.token);
          onAdminBypass();
        } else if (isAdmin) {
          // Admin detected but no token — still bypass (e.g. during testing)
          onAdminBypass();
        } else {
          // Regular team leader login
          onLoginSuccess(data.team);
        }
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Failed to communicate with the server.");
    } finally {
      setLoading(false);
    }
  };

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    let targetDate: Date | null = null;

    if (config.status === 'Registration Not Yet Opened' && config.openDate) {
      targetDate = new Date(config.openDate);
    } else if (config.status === 'Registration Open' && config.closeDate) {
      targetDate = new Date(config.closeDate);
    }

    if (!targetDate) {
      setTimeLeft(null);
      setHasPassed(false);
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const diff = targetDate!.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(null);
        setHasPassed(true);
      } else {
        setHasPassed(false);
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({ d, h, m, s });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [config]);

  const renderBanner = () => {
    if (config.status === 'Registrations Closed' || (config.status === 'Registration Open' && hasPassed)) {
      return (
        <div className="mb-6 p-4 rounded-xl glass-panel border border-white/10 bg-black/40 text-center shadow-lg grayscale opacity-80 backdrop-blur-sm">
          <h4 className="text-sm uppercase font-mono tracking-widest text-slate-400">Registrations Closed</h4>
        </div>
      );
    }

    if (config.status === 'Registration Not Yet Opened') {
      if (config.openDate && timeLeft) {
        return (
          <div className="mb-6 p-4 rounded-xl glass-panel border border-gold-vintage/40 bg-gold-vintage/10 text-center shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-in fade-in zoom-in duration-500">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-gold-vintage mb-1">Registration Opens In</h4>
            <div className="font-display text-2xl text-white font-medium tracking-wider">
              {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
            </div>
          </div>
        );
      } else {
        return (
          <div className="mb-6 p-6 rounded-xl glass-panel border border-gold-vintage/40 bg-gold-vintage/10 text-center shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center min-h-[88px]">
            <h4 className="text-sm md:text-base uppercase font-display tracking-widest text-gold-vintage font-medium">Registrations Opening Soon</h4>
          </div>
        );
      }
    }

    if (config.status === 'Registration Open' && config.closeDate && timeLeft) {
      return (
        <div className="mb-6 p-4 rounded-xl glass-panel border border-gold-vintage/50 bg-gold-vintage/20 text-center shadow-[0_0_25px_rgba(212,175,55,0.25)] animate-in fade-in zoom-in duration-500">
          <h4 className="text-[10px] uppercase font-mono tracking-widest text-gold-vintage mb-1">Registration Closes In</h4>
          <div className="font-display text-2xl text-white font-medium tracking-wider">
            {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-md mx-auto pt-0 pb-12 px-4 w-full">
      {renderBanner()}
      <div className="p-8 rounded-2xl glass-panel border border-gold-vintage/30 flex flex-col gap-6 relative overflow-hidden">
        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-full border border-gold-vintage/30 flex items-center justify-center bg-gold-vintage/5 text-gold-vintage mx-auto mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-display font-medium text-xl tracking-widest uppercase text-gold-vintage">
            Team Leader Login
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Enter your email and password to manage your team.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase block pl-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
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
            className="w-full py-3 mt-4 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold tracking-wider text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Authenticating..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-2 text-center relative z-10 border-t border-white/10 pt-6">
          <p className="text-xs text-slate-400 font-sans mb-3">Don't have an established team yet?</p>
          <button
            onClick={onRegisterClick}
            className="text-gold-vintage hover:text-white transition-colors text-xs font-mono border-b border-gold-vintage/30 pb-0.5 cursor-pointer inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
