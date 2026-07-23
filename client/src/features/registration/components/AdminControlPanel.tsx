import { useState, useEffect } from "react";
import Settings from 'lucide-react/dist/esm/icons/settings';
import Users from 'lucide-react/dist/esm/icons/users';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import QuoteIcon from 'lucide-react/dist/esm/icons/quote';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import BarChart from 'lucide-react/dist/esm/icons/bar-chart';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import Key from 'lucide-react/dist/esm/icons/key';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';
import RefreshCcw from 'lucide-react/dist/esm/icons/refresh-ccw';
import { motion } from "motion/react";
import { User, DomainContent, Article, TimelineStep, Comment, Quote, AnalyticsStats, RegistrationConfig } from "../../../types/types";

interface AdminControlPanelProps {
  domains: DomainContent[];
  articles: Article[];
  timeline: TimelineStep[];
  quotes: Quote[];
  comments: Comment[];
  analytics: AnalyticsStats;
  currentUser: User | null;
  config: RegistrationConfig;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onRefreshData: () => void;
  onConfigUpdate: (config: RegistrationConfig) => void;
}

export default function AdminControlPanel({
  domains,
  articles,
  timeline,
  quotes,
  comments,
  analytics,
  currentUser,
  config,
  onLogin,
  onLogout,
  onRefreshData,
  onConfigUpdate
}: AdminControlPanelProps) {
  // Authentication states
  const [email, setEmail] = useState("falconace81@gmail.com");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Super Tab state
  const [superTab, setSuperTab] = useState<"gateway" | "registration">("registration");

  // Registration Config states
  const [regStatus, setRegStatus] = useState(config?.status || "Registrations Closed");
  const [openDate, setOpenDate] = useState(config?.openDate || "");
  const [closeDate, setCloseDate] = useState(config?.closeDate || "");
  const [minMembers, setMinMembers] = useState(config?.minMembers || 2);
  const [maxMembers, setMaxMembers] = useState(config?.maxMembers || 5);
  const [disableTeamLogin, setDisableTeamLogin] = useState(config?.disableTeamLogin || false);
  const [configSaving, setConfigSaving] = useState(false);
  
  // Teams State
  const [teamsList, setTeamsList] = useState<any[]>([]);

  // Active Admin dashboard menu state
  const [activeTab, setActiveTab] = useState<"analytics" | "teams" | "domains" | "articles" | "timeline" | "quotes" | "comments">("analytics");

  useEffect(() => {
    if (activeTab === "teams") {
      fetchTeams();
    }
  }, [activeTab]);

  const fetchTeams = async () => {
    try {
      console.log("Admin token sent:", localStorage.getItem("admin_token"));
      const res = await fetch("/api/v1/registration/teams", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
      });
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setTeamsList(data.teams);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Domain form states
  const [domainForms, setDomainForms] = useState({
    title: "", slug: "", subtitle: "", summary: "", description: "",
    icon: "Compass", quote: "", quoteAuthor: "", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format",
    practiceTitle: "", energyIndicator: "High Harmonic"
  });

  // Article form states
  const [articleForms, setArticleForms] = useState({
    title: "", subtitle: "", content: "", domainSlug: "meditation",
    author: "Creative Director", readTime: "7 min read", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format"
  });

  // Quote form state
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [quoteCategory, setQuoteCategory] = useState("Meditation");

  // Trigger form submissions dynamically to call the Express API
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        if (data.token) {
          localStorage.setItem("admin_token", data.token);
          console.log("Admin token stored:", localStorage.getItem("admin_token"));
        }
        onLogin(data.user);
      } else {
        setLoginError(data.message || "Credential keys mismatch.");
      }
    } catch (err) {
      setLoginError("Failed to communicate with spiritual clearances server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setConfigSaving(true);
    try {
      const adminToken = localStorage.getItem("admin_token");
      console.log("Admin token sent:", adminToken);
      const payload = { status: regStatus, openDate, closeDate, minMembers, maxMembers, disableTeamLogin };
      
      console.log("Sending commit configuration request with payload:", payload);
      
      const res = await fetch("/api/v1/registration/config", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": adminToken ? `Bearer ${adminToken}` : ""
        },
        body: JSON.stringify(payload)
      });
      
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      
      const data = await res.json();
      
      console.log("Received response for config commit:", data);
      
      if (data.success) {
        onConfigUpdate(data.config);
        alert("Success: Registration configuration updated successfully.");
      } else {
        alert("Error: " + (data.message || "Failed to update configuration."));
      }
    } catch (err) {
      console.error("Error committing config:", err);
      alert("Error: Failed to communicate with server.");
    } finally {
      setConfigSaving(false);
    }
  };

  // 1. Create Domain CRUD
  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainForms.title || !domainForms.slug) return;

    try {
      const res = await fetch("/api/v1/domains", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(domainForms)
      });
      if (res.ok) {
        onRefreshData();
        setDomainForms({
          title: "", slug: "", subtitle: "", summary: "", description: "",
          icon: "Compass", quote: "", quoteAuthor: "", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format",
          practiceTitle: "", energyIndicator: "High Harmonic"
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    if (!confirm("Are you sure you want to extinguish this spiritual domain dimension?")) return;
    try {
      const res = await fetch(`/api/v1/domains/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Create Article CRUD
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForms.title || !articleForms.content) return;

    try {
      const res = await fetch("/api/v1/articles", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(articleForms)
      });
      if (res.ok) {
        onRefreshData();
        setArticleForms({
          title: "", subtitle: "", content: "", domainSlug: "meditation",
          author: "Creative Director", readTime: "7 min read", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format"
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Extinguish this storytelling article permanently?")) return;
    try {
      const res = await fetch(`/api/v1/articles/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Create Quote CRUD
  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText) return;

    try {
      const res = await fetch("/api/v1/quotes", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify({ text: quoteText, author: quoteAuthor || "Unknown Mystic", category: quoteCategory })
      });
      if (res.ok) {
        onRefreshData();
        setQuoteText("");
        setQuoteAuthor("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/quotes/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Comment moderation
  const handleDeleteComment = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/comments/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("admin_token")}` }
      });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Render Login interface if unauthenticated
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl glass-panel border border-gold-vintage/30 flex flex-col gap-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-gold-vintage/30 flex items-center justify-center bg-gold-vintage/5 text-gold-vintage mx-auto">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-display font-medium text-lg tracking-widest uppercase text-gold-vintage">
              Admin Clearance Gate
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Retrieve spiritual access keys to modulate the Dakshinaasya Darshini network.
            </p>
          </div>

          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase block pl-1">
                Sovereign Mailbox
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase block pl-1">
                Temporal Password Lock
              </label>
              <input
                type="password"
                required
                placeholder="Password (dakshinaasya2026)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-mono text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold tracking-wider text-xs transition-colors cursor-pointer"
            >
              {loginLoading ? "Unlocking Portals..." : "VERIFY CLEARANCE"}
            </button>
          </form>

          <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 text-[10.5px] font-mono text-slate-500 leading-relaxed text-center">
            User credentials specified: <br />
            <span className="text-gold-vintage">falconace81@gmail.com</span> / <span className="text-gold-vintage">dakshinaasya2026</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Admin header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="font-display font-medium text-xl md:text-2xl tracking-wider text-gold-vintage uppercase">
            Dakshinaasya Darshini Administration Core
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Signed in as Director: <span className="text-white">{currentUser.email}</span> ({currentUser.role.toUpperCase()})
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefreshData}
            className="p-2 rounded-full border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white cursor-pointer transition-all hover:bg-white/5"
            title="Reload ether database"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 font-mono text-xs cursor-pointer transition-all"
          >
            Dissolve Session
          </button>
        </div>
      </div>

      {/* Super Tab Navigation */}
      <div className="flex gap-4 border-b border-white/10 pb-4 mb-8">
        <button
          onClick={() => setSuperTab("gateway")}
          className={`px-6 py-2.5 font-mono text-xs tracking-wider rounded-xl transition-all cursor-pointer ${superTab === "gateway" ? "bg-gold-vintage/10 text-gold-vintage border border-gold-vintage/30" : "text-slate-400 hover:text-white border border-transparent"}`}
        >
          Gateway Configuration
        </button>
        <button
          onClick={() => setSuperTab("registration")}
          className={`px-6 py-2.5 font-mono text-xs tracking-wider rounded-xl transition-all cursor-pointer ${superTab === "registration" ? "bg-gold-vintage/10 text-gold-vintage border border-gold-vintage/30" : "text-slate-400 hover:text-white border border-transparent"}`}
        >
          Registration Controls
        </button>
      </div>

      {superTab === "registration" && (
        <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-8 max-w-3xl">
          <h3 className="font-display text-xl text-white tracking-widest uppercase border-b border-white/5 pb-3">Event Registration Controls</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Registration Phase</label>
              <select 
                value={regStatus} 
                onChange={(e) => setRegStatus(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950 text-white focus:border-gold-vintage/50 font-mono text-sm"
              >
                <option value="Registration Not Yet Opened">Registration Not Yet Opened</option>
                <option value="Registration Open">Registration Open</option>
                <option value="Registrations Closed">Registrations Closed</option>
              </select>
            </div>

            {regStatus === "Registration Not Yet Opened" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                  <label className="text-xs font-mono text-slate-300">Display Text Banner Only (Hide Timer)</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (openDate) {
                        setOpenDate("");
                      } else {
                        // Set to current local time as a starting point
                        const now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                        setOpenDate(now.toISOString().slice(0, 16));
                      }
                    }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${!openDate ? 'bg-gold-vintage' : 'bg-white/10'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${!openDate ? 'translate-x-4.5' : 'translate-x-1'}`} />
                  </button>
                </div>

                {openDate !== "" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Opening Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={openDate}
                      onChange={(e) => setOpenDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-mono text-sm"
                    />
                  </div>
                )}
                {openDate === "" && (
                  <div className="text-xs font-mono text-slate-500 bg-white/[0.01] p-3 rounded-lg border border-white/5 text-center">
                    A static "Registrations Opening Soon" banner will be displayed instead of a timer.
                    To enable the timer, click the toggle above and set a date.
                  </div>
                )}
              </div>
            )}

            {regStatus === "Registration Open" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Closing Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-mono text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Minimum Team Size</label>
                <input 
                  type="number" 
                  min="1"
                  value={minMembers}
                  onChange={(e) => setMinMembers(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Maximum Team Size</label>
                <input 
                  type="number" 
                  min={minMembers}
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div>
                  <label className="text-sm font-mono text-white flex items-center gap-2">
                    Lock Team Leader Logins
                  </label>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Master kill-switch for team leader accounts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDisableTeamLogin(!disableTeamLogin)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${disableTeamLogin ? 'bg-red-500' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${disableTeamLogin ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSaveConfig}
              disabled={configSaving}
              className="px-6 py-3 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono text-xs tracking-wider font-semibold cursor-pointer disabled:opacity-50"
            >
              {configSaving ? "SAVING..." : "COMMIT CONFIGURATION"}
            </button>
          </div>
        </div>
      )}

      {superTab === "gateway" && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="md:col-span-1 flex flex-col gap-1.5">
          {[
            { id: "analytics", label: "Analytics Hub", icon: BarChart },
            { id: "teams", label: "Teams Directory", icon: Users },
            { id: "domains", label: "Edit Domains", icon: Settings },
            { id: "articles", label: "Edit Articles", icon: BookOpen },
            { id: "quotes", label: "Edit Quotes", icon: QuoteIcon },
            { id: "comments", label: "Board Moderation", icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-4 py-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer font-mono text-xs ${
                  activeTab === tab.id
                    ? "bg-gold-vintage/10 border-gold-vintage/30 text-gold-vintage font-semibold"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab displays */}
        <div className="md:col-span-5 space-y-6">
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Active Connections", value: analytics.activeSessions || 3, change: "+1 current" },
                  { label: "Collective Interactions", value: analytics.totalInteractions || 650, change: "Likes & views" },
                  { label: "Community Echoes", value: analytics.totalComments || 1, change: "Approved feedback" },
                  { label: "Database Seed Size", value: domains.length + articles.length, change: "Fully aligned" }
                ].map((stat, idx) => (
                  <div key={idx} className="p-5 rounded-2xl glass-panel border-white/5 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      {stat.label}
                    </span>
                    <h4 className="font-display font-medium text-2xl text-gold-vintage">
                      {stat.value}
                    </h4>
                    <span className="text-[9px] font-mono text-slate-400 uppercase bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/5 inline-block">
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dynamic SVGs chart rendering */}
              <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-gold-vintage">
                  Direct Channel Traffic Views
                </h4>
                <div className="space-y-3 pt-2">
                  {[
                    { page: "Home Landing Node", count: analytics.pageViews?.home || 10 },
                    { page: "Wisdom Storyteller", count: analytics.pageViews?.storytelling || 10 },
                    { page: "Tattva Darśana", count: analytics.pageViews?.domains || 10 },
                    { page: "Event Chronology Flow", count: analytics.pageViews?.flow || 10 }
                  ].map((p, i) => {
                    const pct = Math.max(10, Math.min(100, (p.count / 300) * 100));
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-300">{p.page}</span>
                          <span className="text-gold-vintage font-semibold">{p.count} views</span>
                        </div>
                        <div className="w-full bg-slate-900/40 rounded-full h-2.5 overflow-hidden border border-white/5">
                          <div
                            style={{ width: `${pct}%` }}
                            className="bg-gradient-to-r from-cosmic-purple to-gold-vintage h-full rounded-full transition-all duration-1000"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-gold-vintage">Registered Teams ({teamsList.length})</h4>
                <button onClick={fetchTeams} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-mono text-white cursor-pointer transition-colors">Refresh Teams</button>
              </div>
              <div className="space-y-3">
                {teamsList.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-slate-600 border border-white/5 bg-[#050505] rounded-xl">No teams registered yet.</div>
                ) : (
                  teamsList.map((t) => (
                    <div key={t.id} className="p-5 rounded-2xl glass-panel border-white/5 space-y-3 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-display text-lg text-white">{t.teamName}</h5>
                          <p className="text-xs font-mono text-slate-400 mt-1">Leader: {t.leaderEmail} | {t.leaderPhone}</p>
                          <p className="text-[10px] font-mono text-slate-500 mt-1">Members: {t.members?.length || 0}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Promote to Round 1</label>
                          <button
                            onClick={async () => {
                              const newRound = t.passed_round === 1 ? 0 : 1;
                              try {
                                const res = await fetch(`/api/v1/registration/team/${t.id}/promotion`, {
                                  method: "PATCH",
                                  headers: { 
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
                                  },
                                  body: JSON.stringify({ passed_round: newRound })
                                });
                                if (res.ok) fetchTeams();
                              } catch(err) { console.error(err); }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${t.passed_round === 1 ? 'bg-emerald-500' : 'bg-white/10'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${t.passed_round === 1 ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "domains" && (
            <div className="space-y-6">
              {/* Form to insert domain */}
              <form onSubmit={handleCreateDomain} className="p-6 rounded-2xl glass-panel border-white/5 space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-gold-vintage flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Spiritual Domain Dimension
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">DOMAIN TITLE</label>
                    <input type="text" required placeholder="e.g., Astral Flight" value={domainForms.title} onChange={(e) => setDomainForms({ ...domainForms, title: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">DIMENSION URL SLUG</label>
                    <input type="text" required placeholder="e.g., astral-flight" value={domainForms.slug} onChange={(e) => setDomainForms({ ...domainForms, slug: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">SUBTITLE TEXT</label>
                    <input type="text" placeholder="e.g., Navigate non-physical space" value={domainForms.subtitle} onChange={(e) => setDomainForms({ ...domainForms, subtitle: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block pl-1">BRIEF SUMMARY (CARD PREVIEW)</label>
                  <textarea rows={2} value={domainForms.summary} onChange={(e) => setDomainForms({ ...domainForms, summary: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block pl-1">DETAILED DEEP DESCRIPTION (CHAMBER SCREEN)</label>
                  <textarea rows={4} value={domainForms.description} onChange={(e) => setDomainForms({ ...domainForms, description: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">MEMORABLE QUOTE</label>
                    <input type="text" value={domainForms.quote} onChange={(e) => setDomainForms({ ...domainForms, quote: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">QUOTE AUTHOR SOURCE</label>
                    <input type="text" value={domainForms.quoteAuthor} onChange={(e) => setDomainForms({ ...domainForms, quoteAuthor: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 rounded-full bg-gold-vintage hover:bg-gold-bright text-black font-mono text-xs tracking-wider font-semibold cursor-pointer">
                    TRANSMIT PORTAL
                  </button>
                </div>
              </form>

              {/* List domains */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono text-slate-500 tracking-wider">Active Dimensions in memory ({domains.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {domains.map((dom) => (
                    <div key={dom.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                      <div>
                        <h5 className="font-display font-medium text-sm text-slate-200">{dom.title}</h5>
                        <p className="text-[10px] font-mono text-gold-vintage">slug: {dom.slug}</p>
                      </div>
                      <button onClick={() => handleDeleteDomain(dom.id)} className="p-1 px-2.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-xs cursor-pointer">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "articles" && (
            <div className="space-y-6">
              <form onSubmit={handleCreateArticle} className="p-6 rounded-2xl glass-panel border-white/5 space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-gold-vintage">Publish Esoteric Storytelling Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">ARTICLE TITLE</label>
                    <input type="text" required placeholder="e.g., The Breath of Life" value={articleForms.title} onChange={(e) => setArticleForms({ ...articleForms, title: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">LOCKED PORTAL SLUG</label>
                    <select value={articleForms.domainSlug} onChange={(e) => setArticleForms({ ...articleForms, domainSlug: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white">
                      {domains.map((d) => (<option key={d.slug} value={d.slug}>{d.title}</option>))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block pl-1">SUBTITLE TEACHING</label>
                  <input type="text" required value={articleForms.subtitle} onChange={(e) => setArticleForms({ ...articleForms, subtitle: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block pl-1">MAIN CHRONICLED SCALING TEXT</label>
                  <textarea rows={6} required value={articleForms.content} onChange={(e) => setArticleForms({ ...articleForms, content: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 rounded-full bg-gold-vintage hover:bg-gold-bright text-black font-mono text-xs tracking-wider font-semibold cursor-pointer">PUBLISH LECTURE</button>
                </div>
              </form>
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono text-slate-500 tracking-wider">Chronicles in physical layer ({articles.length})</h4>
                <div className="space-y-2">
                  {articles.map((art) => (
                    <div key={art.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                      <div>
                        <h5 className="font-display font-medium text-sm text-slate-200">{art.title}</h5>
                        <p className="text-[10px] font-mono text-slate-400">By {art.author} • {art.readTime}</p>
                      </div>
                      <button onClick={() => handleDeleteArticle(art.id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs cursor-pointer transition-all">Extinguish</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "quotes" && (
            <div className="space-y-6">
              <form onSubmit={handleCreateQuote} className="p-6 rounded-2xl glass-panel border-white/5 space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-gold-vintage">Anchor Celestial Quote</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block pl-1">QUOTE WORDINGS</label>
                  <textarea rows={3} required value={quoteText} onChange={(e) => setQuoteText(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">AUTHOR OR SOURCE</label>
                    <input type="text" placeholder="e.g., Rumi" value={quoteAuthor} onChange={(e) => setQuoteAuthor(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block pl-1">CATEGORY</label>
                    <select value={quoteCategory} onChange={(e) => setQuoteCategory(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white">
                      <option value="Meditation">Meditation</option>
                      <option value="Wisdom">Wisdom</option>
                      <option value="Science">Science</option>
                      <option value="Geometry">Geometry</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 rounded-full bg-gold-vintage hover:bg-gold-bright text-black font-mono text-xs tracking-wider font-semibold cursor-pointer">ADD QUOTE</button>
                </div>
              </form>
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono text-slate-500 tracking-wider">Stored Quotations ({quotes.length})</h4>
                <div className="space-y-2">
                  {quotes.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-6">
                      <div className="max-w-xl">
                        <p className="font-serif italic text-xs text-slate-300">&ldquo;{q.text}&rdquo;</p>
                        <span className="text-[10px] font-mono text-gold-vintage/70 block mt-1">— {q.author} ({q.category})</span>
                      </div>
                      <button onClick={() => handleDeleteQuote(q.id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs cursor-pointer tracking-wider font-mono transition-colors shrink-0">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-500">Board Moderation & Feedback Queue ({comments.length})</h4>
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-slate-600 border border-white/5 bg-[#050505] rounded-xl">No active comments in the queue.</div>
                ) : (
                  comments.map((comm) => {
                    const linkedArt = articles.find((a) => a.id === comm.articleId);
                    return (
                      <div key={comm.id} className="p-5 rounded-2xl glass-panel border-white/5 space-y-3 text-left relative flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-white font-semibold">{comm.authorName}</span>
                            <span className="text-[10px] text-slate-400">{comm.authorEmail}</span>
                          </div>
                          {linkedArt && (<span className="text-[9px] font-mono text-gold-vintage/70 uppercase">ON ARTICLE: &ldquo;{linkedArt.title}&rdquo;</span>)}
                          <p className="text-xs text-slate-300 font-sans italic pt-1 leading-relaxed">{comm.content}</p>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-white/5 pt-2">
                          <span className="text-[9px] font-mono text-emerald-400 uppercase border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 rounded-full mr-auto">STATUS: ACTIVE</span>
                          <button onClick={() => handleDeleteComment(comm.id)} className="px-3 py-1 rounded-lg hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono transition-colors cursor-pointer">Block & Extinguish</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
