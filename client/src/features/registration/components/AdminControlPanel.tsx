import { useState, useEffect } from "react";
import Settings from 'lucide-react/dist/esm/icons/settings';
import Users from 'lucide-react/dist/esm/icons/users';
import Bell from 'lucide-react/dist/esm/icons/bell';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import Key from 'lucide-react/dist/esm/icons/key';
import RefreshCcw from 'lucide-react/dist/esm/icons/refresh-ccw';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import Eye from 'lucide-react/dist/esm/icons/eye';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off';
import { motion } from "motion/react";
import { User, RegistrationConfig, Notice } from "../../../types/types";

interface AdminControlPanelProps {
  currentUser: User | null;
  config: RegistrationConfig;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onRefreshData: () => void;
  onConfigUpdate: (config: RegistrationConfig) => void;
}

type AdminTab = "teams" | "registration" | "notices";

export default function AdminControlPanel({
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

  // Active admin tab — Team Directory is the primary default view
  const [activeTab, setActiveTab] = useState<AdminTab>("teams");

  // Registration Config states
  const [regStatus, setRegStatus] = useState(config?.status || "Registrations Closed");
  const [openDate, setOpenDate] = useState(config?.openDate || "");
  const [closeDate, setCloseDate] = useState(config?.closeDate || "");
  const [minMembers, setMinMembers] = useState(config?.minMembers || 2);
  const [maxMembers, setMaxMembers] = useState(config?.maxMembers || 5);
  const [disableTeamLogin, setDisableTeamLogin] = useState(config?.disableTeamLogin || false);
  const [allowDocumentUpload, setAllowDocumentUpload] = useState(config?.allowDocumentUpload !== false);
  const [allowMemberEdits, setAllowMemberEdits] = useState(config?.allowMemberEdits !== false);
  const [configSaving, setConfigSaving] = useState(false);
  const [configFeedback, setConfigFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [noticeFeedback, setNoticeFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showConfigFeedback = (type: 'success' | 'error', text: string) => {
    setConfigFeedback({ type, text });
    setTimeout(() => setConfigFeedback(null), 4000);
  };

  const showNoticeFeedback = (type: 'success' | 'error', text: string) => {
    setNoticeFeedback({ type, text });
    setTimeout(() => setNoticeFeedback(null), 4000);
  };

  // Teams state
  const [teamsList, setTeamsList] = useState<any[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  // Notice management state
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    short_description: "",
    full_content: "",
    is_published: false
  });
  const [noticeSaving, setNoticeSaving] = useState(false);

  // On login — immediately fetch teams
  useEffect(() => {
    if (currentUser && activeTab === "teams") {
      fetchTeams();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (activeTab === "teams") fetchTeams();
    if (activeTab === "notices") fetchNotices();
  }, [activeTab]);

  // Sync config props → local state when parent config updates
  useEffect(() => {
    setRegStatus(config?.status || "Registrations Closed");
    setOpenDate(config?.openDate || "");
    setCloseDate(config?.closeDate || "");
    setMinMembers(config?.minMembers || 2);
    setMaxMembers(config?.maxMembers || 5);
    setDisableTeamLogin(config?.disableTeamLogin || false);
    setAllowDocumentUpload(config?.allowDocumentUpload !== false);
    setAllowMemberEdits(config?.allowMemberEdits !== false);
  }, [config]);

  const getAdminToken = () => {
    return localStorage.getItem("admin_token") || localStorage.getItem("token") || localStorage.getItem("jwt");
  };

  const fetchTeams = async () => {
    setTeamsLoading(true);
    try {
      const token = getAdminToken();
      if (!token || token === "null" || token === "undefined") {
        onLogout();
        return;
      }
      const res = await fetch("/api/v1/registration/teams", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setTeamsList(data.teams || []);
      } else {
        setTeamsList([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTeamsLoading(false);
    }
  };

  const fetchNotices = async () => {
    setNoticesLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch("/api/v1/notices/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setNotices(data.notices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setNoticesLoading(false);
    }
  };

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
        const token = data.token || data.accessToken || data.data?.token;
        if (!token) throw new Error("Missing auth token from server response");
        // TODO(security): Migrate to HttpOnly cookie strategy when backend session support is added.
        localStorage.setItem("admin_token", token);
        localStorage.setItem("token", token);
        onLogin(data.user);
      } else {
        setLoginError(data.message || "Credential keys mismatch.");
      }
    } catch (err) {
      setLoginError("Failed to communicate with server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setConfigSaving(true);
    try {
      const adminToken = getAdminToken();
      if (!adminToken || adminToken === "null" || adminToken === "undefined") {
        onLogout();
        return;
      }
      
      const payload = {
        status: regStatus, openDate, closeDate,
        minMembers, maxMembers, disableTeamLogin,
        allowDocumentUpload, allowMemberEdits
      };
      
      const res = await fetch("/api/v1/registration/config", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        onLogout();
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        onConfigUpdate(data.config);
        showConfigFeedback('success', 'Configuration updated successfully.');
      } else {
        showConfigFeedback('error', data.message || 'Failed to update configuration.');
      }
    } catch (err) {
      console.error("Error committing config:", err);
      alert("Error: Failed to communicate with server.");
    } finally {
      setConfigSaving(false);
    }
  };

  // Notice CRUD
  const openCreateNotice = () => {
    setEditingNotice(null);
    setNoticeForm({ title: "", short_description: "", full_content: "", is_published: false });
    setShowNoticeForm(true);
  };

  const openEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      short_description: notice.short_description,
      full_content: notice.full_content,
      is_published: notice.is_published
    });
    setShowNoticeForm(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.short_description.trim() || !noticeForm.full_content.trim()) {
      alert("All fields are required.");
      return;
    }
    setNoticeSaving(true);
    try {
      const token = getAdminToken();
      const url = editingNotice
        ? `/api/v1/notices/${editingNotice.id}`
        : "/api/v1/notices";
      const method = editingNotice ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noticeForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowNoticeForm(false);
        setEditingNotice(null);
        fetchNotices();
        showNoticeFeedback('success', editingNotice ? 'Notice updated successfully.' : 'Notice created successfully.');
      } else {
        showNoticeFeedback('error', data.message || 'Failed to save notice.');
      }
    } catch (err) {
      console.error(err);
      showNoticeFeedback('error', 'Network error. Please try again.');
    } finally {
      setNoticeSaving(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Delete this notice permanently?")) return;
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/v1/notices/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (notice: Notice) => {
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/v1/notices/${notice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ is_published: !notice.is_published })
      });
      if (res.ok) fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Toggle component ──────────────────────────────────────────────────────
  const Toggle = ({
    checked, onChange, colorClass = "bg-emerald-500"
  }: { checked: boolean; onChange: () => void; colorClass?: string }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${checked ? colorClass : 'bg-white/10'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
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
              Retrieve access keys to manage the Dakshinaasya Darshini platform.
            </p>
          </div>

          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase block pl-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase block pl-1">Password</label>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm"
              />
            </div>

            {loginError && (
              <p className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono py-2 px-3 rounded-lg text-center my-2">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold tracking-wider text-xs transition-colors cursor-pointer"
            >
              {loginLoading ? "Verifying..." : "VERIFY CLEARANCE"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── ADMIN PANEL ───────────────────────────────────────────────────────────
  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "teams", label: "Team Directory", icon: Users },
    { id: "registration", label: "Registration Controls", icon: Settings },
    { id: "notices", label: "Notice Management", icon: Bell },
  ];

  return (
    <div className="space-y-8 py-4 w-full">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="font-display font-medium text-xl md:text-2xl tracking-wider text-gold-vintage uppercase">
            Dakshinaasya Darshini Administration
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Director: <span className="text-white">{currentUser.email}</span> ({currentUser.role?.toUpperCase()})
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefreshData}
            className="p-2 rounded-full border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white cursor-pointer transition-all hover:bg-white/5"
            title="Refresh data"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 font-mono text-xs cursor-pointer transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 font-mono text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gold-vintage/10 text-gold-vintage border border-gold-vintage/30"
                  : "text-slate-400 hover:text-white border border-transparent hover:border-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB: TEAM DIRECTORY ─────────────────────────────────────────────── */}
      {activeTab === "teams" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-mono tracking-wider text-gold-vintage">
              Registered Teams ({teamsList.length})
            </h4>
            <button
              onClick={fetchTeams}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-mono text-white cursor-pointer transition-colors flex items-center gap-2"
            >
              <RefreshCcw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {teamsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
            </div>
          ) : teamsList.length === 0 ? (
            <div className="p-8 text-center border border-white/5 bg-white/[0.01] rounded-2xl space-y-2">
              <Users className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-mono text-slate-500">No teams registered yet.</p>
              <p className="text-xs font-mono text-slate-700">Teams appear here once participants complete registration.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teamsList.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h5 className="font-display text-lg text-white truncate">{t.teamName}</h5>
                      <p className="text-xs font-mono text-slate-400">
                        Leader: {t.members?.find((m: any) => m.role === 'leader')?.email || t.leaderEmail}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        Members: {t.members?.length || 0}
                        {t.members?.length > 0 && (
                          <span className="ml-2 text-slate-600">
                            ({t.members.map((m: any) => m.college_name || '—').filter((v: string, i: number, a: string[]) => a.indexOf(v) === i).join(', ')})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <label className="text-[9px] font-mono text-slate-400 uppercase">Round 1</label>
                      <button
                        onClick={async () => {
                          const newRound = t.passed_round === 1 ? 0 : 1;
                          try {
                            const res = await fetch(`/api/v1/registration/team/${t.id}/promotion`, {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${getAdminToken()}`
                              },
                              body: JSON.stringify({ passed_round: newRound })
                            });
                            if (res.ok) fetchTeams();
                          } catch (err) { console.error(err); }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${t.passed_round === 1 ? 'bg-emerald-500' : 'bg-white/10'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${t.passed_round === 1 ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable member list */}
                  {t.members?.length > 0 && (
                    <div className="pt-2 border-t border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {t.members.map((m: any, i: number) => (
                          <div key={i} className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.role === 'leader' ? 'bg-gold-vintage' : 'bg-slate-600'}`} />
                            <span className="text-slate-300 truncate">{m.name}</span>
                            <span className="text-slate-600">·</span>
                            <span className="truncate">{m.email}</span>
                            {m.college_name && <span className="text-slate-600 truncate hidden lg:block">· {m.college_name}</span>}
                            {m.semester && <span className="text-slate-600 hidden lg:block">Sem {m.semester}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: REGISTRATION CONTROLS ──────────────────────────────────────── */}
      {activeTab === "registration" && (
        <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-8 max-w-3xl">
          <h3 className="font-display text-xl text-white tracking-widest uppercase border-b border-white/5 pb-3">
            Event Registration Controls
          </h3>
          
          <div className="space-y-6">
            {/* Phase */}
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                  <label className="text-xs font-mono text-slate-300">Display Text Banner Only (Hide Timer)</label>
                  <Toggle
                    checked={!openDate}
                    onChange={() => {
                      if (openDate) {
                        setOpenDate("");
                      } else {
                        const now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                        setOpenDate(now.toISOString().slice(0, 16));
                      }
                    }}
                  />
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
                    A static "Registrations Opening Soon" banner will display instead of a timer.
                  </div>
                )}
              </div>
            )}

            {regStatus === "Registration Open" && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Closing Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-mono text-sm"
                />
              </div>
            )}

            {/* Team size */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Min Team Size</label>
                <input 
                  type="number" min="1"
                  value={minMembers}
                  onChange={(e) => setMinMembers(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Max Team Size</label>
                <input 
                  type="number" min={minMembers}
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Toggles section */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              {/* Lock Team Logins */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div>
                  <label className="text-sm font-mono text-white">Lock Team Leader Logins</label>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Master kill-switch for team leader accounts.</p>
                </div>
                <Toggle
                  checked={disableTeamLogin}
                  onChange={() => setDisableTeamLogin(!disableTeamLogin)}
                  colorClass="bg-red-500"
                />
              </div>

              {/* Allow Document Upload */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div>
                  <label className="text-sm font-mono text-white">Allow Project Document Upload</label>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Shows the PPT/PDF upload zone in registration & team dashboard.</p>
                </div>
                <Toggle
                  checked={allowDocumentUpload}
                  onChange={() => setAllowDocumentUpload(!allowDocumentUpload)}
                  colorClass="bg-emerald-500"
                />
              </div>

              {/* Allow Member Edits */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div>
                  <label className="text-sm font-mono text-white">Allow Member Detail Edits</label>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Lets registered teams edit their member details in the dashboard.</p>
                </div>
                <Toggle
                  checked={allowMemberEdits}
                  onChange={() => setAllowMemberEdits(!allowMemberEdits)}
                  colorClass="bg-emerald-500"
                />
              </div>
            </div>
          </div>

          {configFeedback && (
            <div className={`px-4 py-3 rounded-xl border text-xs font-mono text-center transition-all ${
              configFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {configFeedback.text}
            </div>
          )}

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

      {/* ── TAB: NOTICE MANAGEMENT ─────────────────────────────────────────── */}
      {activeTab === "notices" && (
        <div className="space-y-6">
          {noticeFeedback && (
            <div className={`px-4 py-3 rounded-xl border text-xs font-mono text-center transition-all ${
              noticeFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {noticeFeedback.text}
            </div>
          )}

          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-mono tracking-wider text-gold-vintage">
              Notices ({notices.length})
            </h4>
            <button
              onClick={openCreateNotice}
              className="px-4 py-2 rounded-xl bg-gold-vintage/10 border border-gold-vintage/30 text-gold-vintage hover:bg-gold-vintage hover:text-black font-mono text-xs cursor-pointer transition-all flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" /> Create Notice
            </button>
          </div>

          {/* Create / Edit Form */}
          {showNoticeForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl glass-panel border border-gold-vintage/20 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-mono tracking-widest text-gold-vintage uppercase">
                  {editingNotice ? "Edit Notice" : "Create New Notice"}
                </h5>
                <button onClick={() => setShowNoticeForm(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNotice} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    placeholder="Notice heading / title"
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Short Description * (~4 lines summary)</label>
                  <textarea
                    required
                    rows={4}
                    value={noticeForm.short_description}
                    onChange={(e) => setNoticeForm({ ...noticeForm, short_description: e.target.value })}
                    placeholder="Brief summary shown on the Notice Board card..."
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Full Content * (shown in Read More modal)</label>
                  <textarea
                    required
                    rows={8}
                    value={noticeForm.full_content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, full_content: e.target.value })}
                    placeholder="Complete notice content displayed in the detail modal..."
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Toggle
                      checked={noticeForm.is_published}
                      onChange={() => setNoticeForm({ ...noticeForm, is_published: !noticeForm.is_published })}
                      colorClass="bg-emerald-500"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {noticeForm.is_published ? "Published (visible to public)" : "Draft (hidden from public)"}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNoticeForm(false)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white font-mono text-xs cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={noticeSaving}
                      className="px-5 py-2 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {noticeSaving ? "Saving..." : editingNotice ? "Update Notice" : "Publish Notice"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* Notices List */}
          {noticesLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
            </div>
          ) : notices.length === 0 ? (
            <div className="p-8 text-center border border-white/5 bg-white/[0.01] rounded-2xl space-y-2">
              <Bell className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-mono text-slate-500">No notices yet.</p>
              <p className="text-xs font-mono text-slate-700">Create a notice to display it on the Notice Board page.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice.id} className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-display text-base text-white truncate">{notice.title}</h5>
                        <span className={`shrink-0 text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          notice.is_published
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                            : 'border-slate-500/30 text-slate-500 bg-slate-500/10'
                        }`}>
                          {notice.is_published ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400 line-clamp-2 leading-relaxed">{notice.short_description}</p>
                      <p className="text-[10px] font-mono text-slate-600 mt-1">
                        {new Date(notice.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Toggle publish */}
                      <button
                        onClick={() => handleTogglePublish(notice)}
                        title={notice.is_published ? "Unpublish" : "Publish"}
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          notice.is_published
                            ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {notice.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => openEditNotice(notice)}
                        className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
