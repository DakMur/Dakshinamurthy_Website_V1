import { useState, useRef, useEffect, useCallback } from "react";
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import UploadCloud from 'lucide-react/dist/esm/icons/upload-cloud';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import X from 'lucide-react/dist/esm/icons/x';
import Save from 'lucide-react/dist/esm/icons/save';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Lock from 'lucide-react/dist/esm/icons/lock';
import Video from 'lucide-react/dist/esm/icons/video';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Users from 'lucide-react/dist/esm/icons/users';
import { Team, RegistrationConfig, TeamMember, User } from "../../types/types";

interface TeamWorkspaceProps {
  team: Team;
  config?: RegistrationConfig;
  currentUser?: User | null;
  onUpdateTeam?: (team: Team) => void;
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onBack?: () => void;
}

const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
const MAX_DOC_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export default function TeamWorkspace({
  team,
  config: initialConfig,
  currentUser,
  onUpdateTeam,
  onLogout,
  onNavigateHome,
  onBack,
}: TeamWorkspaceProps) {
  const handleBack = onBack || onNavigateHome;
  // Global config fallback / fetch
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
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/v1/registration/config');
        if (!res.ok) return;
        const raw = await res.json();
        const data = raw?.data || raw;
        if (data && typeof data === 'object') {
          setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        // Fallback remains active
      }
    };
    fetchConfig();
  }, [initialConfig]);

  // Form states
  const [teamName, setTeamName] = useState(team.teamName || "");
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const mems = [...(team.members || [])];
    const max = config.maxMembers || 4;
    while (mems.length < max) {
      mems.push({ name: "", email: "", phone: "", college_name: "", semester: undefined });
    }
    return mems;
  });

  const [documentUrl, setDocumentUrl] = useState(team.documentUrl || "");
  const [demoVideoUrl, setDemoVideoUrl] = useState(team.demoVideoUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [phoneErrors, setPhoneErrors] = useState<string[]>(Array(config.maxMembers || 4).fill(""));

  const fileInputRefMobile = useRef<HTMLInputElement>(null);
  const fileInputRefDesktop = useRef<HTMLInputElement>(null);
  const videoInputRefMobile = useRef<HTMLInputElement>(null);
  const videoInputRefDesktop = useRef<HTMLInputElement>(null);

  const isClosed = config.status === "Registrations Closed";
  const isMemberEditLocked = isClosed || config.allowMemberEdits === false;
  const isDocumentUploadEnabled = config.allowDocumentUpload !== false;

  // Sync state when incoming team prop changes
  useEffect(() => {
    setTeamName(team.teamName || "");
    const mems = [...(team.members || [])];
    const max = config.maxMembers || 4;
    while (mems.length < max) {
      mems.push({ name: "", email: "", phone: "", college_name: "", semester: undefined });
    }
    setMembers(mems);
    setDocumentUrl(team.documentUrl || "");
    setDemoVideoUrl(team.demoVideoUrl || "");
  }, [team, config.maxMembers]);

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string | number | undefined) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const validatePhone = (index: number, value: string) => {
    const newErrors = [...phoneErrors];
    if (value.length > 0 && !/^\d{10}$/.test(value)) {
      newErrors[index] = "Phone number must be exactly 10 digits.";
    } else {
      newErrors[index] = "";
    }
    setPhoneErrors(newErrors);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const digits = value.replace(/[^0-9]/g, "");
    handleMemberChange(index, 'phone', digits);
    validatePhone(index, digits);
  };

  // Leader autofill propagation
  const handleLeaderCollegeChange = (value: string) => {
    setMembers(prev => prev.map((m, i) => {
      if (i === 0) return { ...m, college_name: value };
      if (i > 0 && (m.college_name === "" || m.college_name === prev[0].college_name)) {
        return { ...m, college_name: value };
      }
      return m;
    }));
  };

  const handleLeaderSemesterChange = (value: number | undefined) => {
    setMembers(prev => prev.map((m, i) => {
      if (i === 0) return { ...m, semester: value };
      if (i > 0 && (m.semester === undefined || m.semester === prev[0].semester)) {
        return { ...m, semester: value };
      }
      return m;
    }));
  };

  // Document Upload with Pre-flight limits & XHR Progress
  const handleFileSelection = async (file?: globalThis.File) => {
    if (!file) return;

    // 1. File size check (pre-flight validation)
    if (file.size > MAX_DOC_SIZE_BYTES) {
      setStatusMessage({ text: "File size exceeds the 15MB limit. Please upload a smaller document.", isError: true });
      return;
    }

    // 2. File type check
    const validTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    const isDocExtension = file.name.endsWith('.pdf') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx');

    if (!validTypes.includes(file.type) && !isDocExtension) {
      setStatusMessage({ text: "Invalid file format. Only PDF, PPT, and PPTX documents are accepted.", isError: true });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFileName(file.name);
    setStatusMessage(null);

    try {
      await new Promise<void>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/v1/registration/upload");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success) {
              setDocumentUrl(data.url);
              setUploadProgress(100);
              setStatusMessage({ text: "Document uploaded successfully.", isError: false });
              resolve();
            } else {
              setStatusMessage({ text: data.error || "File upload failed. Please try again.", isError: true });
              setUploadProgress(0);
              setUploadedFileName("");
              reject();
            }
          } catch {
            setStatusMessage({ text: "Unexpected server response during upload.", isError: true });
            setUploadProgress(0);
            setUploadedFileName("");
            reject();
          }
        };

        xhr.onerror = () => {
          setStatusMessage({ text: "Network connection error during upload. Please check your network.", isError: true });
          setUploadProgress(0);
          setUploadedFileName("");
          reject();
        };

        xhr.send(formData);
      });
    } catch {
      // Error handled in callbacks
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocumentDelete = async () => {
    if (!documentUrl || isClosed) return;
    const urlToDelete = documentUrl;
    setDocumentUrl("");
    setUploadProgress(0);
    setUploadedFileName("");
    try {
      await fetch("/api/v1/registration/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: urlToDelete })
      });
      setStatusMessage({ text: "Document removed.", isError: false });
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  };

  // Demo Video Upload
  const handleVideoSelection = async (file?: globalThis.File) => {
    if (!file) return;

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      setStatusMessage({ text: "Video file size exceeds 100MB limit.", isError: true });
      return;
    }

    if (!file.type.startsWith('video/')) {
      setStatusMessage({ text: "Please select a valid video format (MP4, WEBM).", isError: true });
      return;
    }

    setIsVideoUploading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/v1/registration/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        const videoUrl = data.url;
        setDemoVideoUrl(videoUrl);
        await fetch(`/api/v1/registration/team/${team.id}/demo-video`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ demoVideoUrl: videoUrl })
        });
        setStatusMessage({ text: "Demo video uploaded successfully.", isError: false });
      } else {
        setStatusMessage({ text: data.error || "Video upload failed.", isError: true });
      }
    } catch (err) {
      setStatusMessage({ text: "An error occurred during video upload.", isError: true });
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);

    if (phoneErrors.some(err => err !== "")) {
      setStatusMessage({ text: "Please resolve phone number validation errors before saving.", isError: true });
      setSaving(false);
      return;
    }

    const activeMembers = members.filter((m, i) => i < config.minMembers || m.name.trim() !== "");

    if (activeMembers.length < config.minMembers) {
      setStatusMessage({ text: `At least ${config.minMembers} team members are required.`, isError: true });
      setSaving(false);
      return;
    }

    const normalizedMembers = activeMembers.map(m => ({
      ...m,
      name: m.name.trim(),
      email: m.email.trim(),
      phone: m.phone.trim(),
      college_name: m.college_name?.trim() || null,
      semester: (m.semester !== undefined && m.semester !== null) ? m.semester : null,
    }));

    const updates = {
      teamName: teamName.trim(),
      members: normalizedMembers,
      documentUrl
    };

    try {
      const res = await fetch(`/api/v1/registration/team/${team.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        if (onUpdateTeam) {
          onUpdateTeam(data.team);
        }
        // Update local session storage
        localStorage.setItem("dakshina_current_team", JSON.stringify(data.team));
        setStatusMessage({ text: "Team workspace details saved successfully.", isError: false });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({ text: data.message || "Failed to update team workspace.", isError: true });
      }
    } catch (err) {
      setStatusMessage({ text: "Failed to update team workspace. Please check your connection.", isError: true });
    } finally {
      setSaving(false);
    }
  };

  // Secure Session Cleanup on Logout
  const handleLogoutAction = useCallback(() => {
    // Purge all stored credentials and team states to avoid persistent leaks on shared devices
    try {
      localStorage.removeItem("dakshina_current_team");
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");
      sessionStorage.removeItem("dakshina_current_team");
      sessionStorage.removeItem("token");
    } catch {
      // Safe cleanup
    }

    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);

  return (
    <div className="relative z-10 min-h-screen w-full bg-[#07070a]/70 backdrop-blur-sm text-white pt-16 sm:pt-20 pb-16 selection:bg-gold-vintage selection:text-black">
      
      {/* ── Top Header Bar (Unified) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              {handleBack && (
                <button
                  onClick={handleBack}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-gold-vintage/40 text-slate-400 hover:text-white transition-colors cursor-pointer mr-1"
                  title="Return to Darśini Home"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h1 className="font-display font-medium text-2xl sm:text-3xl tracking-widest text-gold-vintage uppercase">
                Team Workspace
              </h1>
              {team.serial_number != null && (
                <span className="inline-flex items-center px-3 py-1 rounded-full border border-gold-vintage/40 bg-gold-vintage/10 text-gold-vintage font-mono text-xs tracking-widest select-none shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                  SERIAL NO: #{String(team.serial_number).padStart(3, '0')}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Authenticated Leader: <span className="text-slate-200">{team.leaderEmail}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || isClosed}
              className={`px-4 py-2 rounded-xl border font-mono text-xs transition-all flex items-center gap-2 shadow-lg ${
                isClosed
                  ? 'bg-slate-900 border-white/5 text-slate-500 cursor-not-allowed'
                  : 'bg-gold-vintage hover:bg-gold-bright text-black font-semibold border-gold-vintage shadow-[0_0_15px_rgba(212,175,55,0.25)] cursor-pointer'
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : isClosed ? "Locked" : "Save Changes"}
            </button>
            <button
              onClick={handleLogoutAction}
              className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-xs cursor-pointer transition-all flex items-center gap-2"
              title="Sign Out of Team Session"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Notifications & Lock Alert */}
        <div className="mt-4 space-y-3">
          {config.allowMemberEdits === false && !isClosed && (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-3 text-amber-300">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <p className="text-xs font-mono">Member directory edits have been temporarily locked by the administrator.</p>
            </div>
          )}

          {isClosed && (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center gap-3 text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <p className="text-xs font-mono">Registrations are closed. Edits to team details and document submissions are locked.</p>
            </div>
          )}

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 transition-all ${
                statusMessage.isError
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              {statusMessage.isError ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. MOBILE STRUCTURE (Dedicated Isolated Single-Column Layout Tree) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:hidden w-full px-4 py-6 space-y-6 pb-28">
        
        {/* Mobile Card 1: Team Details */}
        <div className="p-5 rounded-2xl border border-gold-vintage/25 bg-[#09080e]/85 backdrop-blur-xl shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-gold-vintage font-semibold">
              Team Identity
            </span>
            <Users className="w-4 h-4 text-gold-vintage" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase block">Team Name</label>
            <input
              type="text"
              value={teamName}
              disabled={isClosed}
              onChange={(e) => setTeamName(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
                isClosed
                  ? 'border-white/5 bg-black/40 text-slate-500'
                  : 'border-white/10 bg-white/[0.03] text-white focus:outline-none focus:border-gold-vintage/60'
              }`}
            />
          </div>
        </div>

        {/* Mobile Card 2: Submission Status & Project Document */}
        {isDocumentUploadEnabled && (
          <div className="p-5 rounded-2xl border border-gold-vintage/25 bg-[#09080e]/85 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-gold-vintage font-semibold">
                Project Document
              </span>
              <FileText className="w-4 h-4 text-gold-vintage" />
            </div>

            {!documentUrl ? (
              isUploading ? (
                <div className="w-full p-4 rounded-xl border border-gold-vintage/40 bg-gold-vintage/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="truncate text-white font-medium">{uploadedFileName}</span>
                    <span className="text-gold-vintage ml-2 shrink-0">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-vintage to-gold-bright transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 text-center">Uploading to Secure Storage...</p>
                </div>
              ) : (
                <div
                  onClick={() => !isClosed && fileInputRefMobile.current?.click()}
                  className={`w-full p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-center transition-all ${
                    isClosed
                      ? 'border-white/5 bg-black/30 text-slate-500'
                      : 'border-white/20 bg-white/[0.02] hover:border-gold-vintage/50 active:bg-white/[0.05] cursor-pointer'
                  }`}
                >
                  <UploadCloud className="w-7 h-7 text-gold-vintage/70" />
                  <p className="text-xs text-white font-medium">Tap to Upload Document</p>
                  <p className="text-[9px] font-mono text-slate-400 uppercase">PDF, PPT, PPTX (Max 15MB)</p>
                  <input
                    type="file"
                    ref={fileInputRefMobile}
                    disabled={isClosed}
                    className="hidden"
                    accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={(e) => handleFileSelection(e.target.files?.[0])}
                  />
                </div>
              )
            ) : (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-white truncate font-medium">{documentUrl}</span>
                </div>
                <button
                  onClick={handleDocumentDelete}
                  disabled={isClosed}
                  className={`w-full py-2 rounded-lg border text-xs font-mono transition-colors flex items-center justify-center gap-1.5 ${
                    isClosed
                      ? 'border-white/5 text-slate-500 cursor-not-allowed'
                      : 'border-red-500/30 text-red-400 hover:bg-red-500/10 active:bg-red-500/20 cursor-pointer'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  Remove Document
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Card 3: Demo Video (Round 1 Qualifiers) */}
        {team.passed_round === 1 && (
          <div className="p-5 rounded-2xl border border-gold-vintage/35 bg-gradient-to-b from-gold-vintage/10 to-[#09080e]/90 backdrop-blur-xl shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-gold-vintage/20 pb-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-gold-vintage font-semibold">
                Demo Video
              </span>
              <Video className="w-4 h-4 text-gold-vintage" />
            </div>

            {!demoVideoUrl ? (
              <div
                onClick={() => !isVideoUploading && videoInputRefMobile.current?.click()}
                className="w-full p-5 rounded-xl border-2 border-dashed border-gold-vintage/30 bg-black/40 hover:border-gold-vintage cursor-pointer flex flex-col items-center justify-center gap-2 text-center"
              >
                <UploadCloud className="w-6 h-6 text-gold-vintage/70" />
                <p className="text-xs text-gold-vintage font-medium">Upload Demo Video</p>
                <p className="text-[9px] font-mono text-slate-400 uppercase">MP4, WEBM (Max 100MB)</p>
                <input
                  type="file"
                  ref={videoInputRefMobile}
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => handleVideoSelection(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2.5">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-white truncate font-medium">{demoVideoUrl}</span>
                </div>
                <button
                  onClick={() => setDemoVideoUrl("")}
                  className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove Video
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Card 4: Member Lists (Single-Column Cards) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-gold-vintage font-semibold">
              Member Directory ({members.length})
            </span>
            {isMemberEditLocked && (
              <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                <Lock className="w-2.5 h-2.5" /> Locked
              </span>
            )}
          </div>

          {members.map((member, idx) => {
            const isLeader = idx === 0;
            const isCompulsory = idx < config.minMembers;
            const isEmailPhoneLocked = isLeader || isMemberEditLocked;

            return (
              <div
                key={`mobile-mem-${idx}`}
                className={`p-4 rounded-2xl border backdrop-blur-xl shadow-lg space-y-3.5 ${
                  isLeader
                    ? 'border-gold-vintage/40 bg-[#0c0a14]/90 shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                    : 'border-white/10 bg-[#09080e]/85'
                }`}
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className={`text-xs font-mono uppercase font-semibold ${isLeader ? 'text-gold-vintage' : 'text-slate-300'}`}>
                    {isLeader ? 'Leader (Primary Contact)' : `Member ${idx + 1}`}
                  </span>
                  {!isLeader && !isCompulsory && (
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded-full border border-slate-500/30 text-slate-400 bg-slate-500/10">
                      OPTIONAL
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase block">Full Name</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={member.name}
                      disabled={isMemberEditLocked}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isMemberEditLocked
                          ? 'border-white/5 bg-black/40 text-slate-500'
                          : 'border-white/10 bg-white/[0.02] text-white focus:border-gold-vintage/50'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase block">Email Address</label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      disabled={isEmailPhoneLocked}
                      value={member.email}
                      onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isEmailPhoneLocked
                          ? 'border-white/5 bg-black/40 text-slate-500'
                          : 'border-white/10 bg-white/[0.02] text-white focus:border-gold-vintage/50'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase block">Phone Number (10 Digits)</label>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      disabled={isEmailPhoneLocked}
                      value={member.phone}
                      maxLength={10}
                      onChange={(e) => handlePhoneChange(idx, e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isEmailPhoneLocked
                          ? 'border-white/5 bg-black/40 text-slate-500'
                          : phoneErrors[idx]
                            ? 'border-rose-500/60 bg-white/[0.02] text-white'
                            : 'border-white/10 bg-white/[0.02] text-white focus:border-gold-vintage/50'
                      }`}
                    />
                    {!isEmailPhoneLocked && phoneErrors[idx] && (
                      <p className="text-[9px] font-mono text-rose-400 pl-1">{phoneErrors[idx]}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 uppercase block">College</label>
                      <input
                        type="text"
                        placeholder="College Name"
                        value={member.college_name || ""}
                        disabled={isMemberEditLocked}
                        onChange={(e) => isLeader ? handleLeaderCollegeChange(e.target.value) : handleMemberChange(idx, 'college_name', e.target.value)}
                        className={`w-full px-2.5 py-2 rounded-lg border text-xs ${
                          isMemberEditLocked
                            ? 'border-white/5 bg-black/40 text-slate-500'
                            : 'border-white/10 bg-white/[0.02] text-white focus:border-gold-vintage/50'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 uppercase block">Semester</label>
                      <select
                        value={member.semester ?? ""}
                        disabled={isMemberEditLocked}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                          if (isLeader) {
                            handleLeaderSemesterChange(val);
                          } else {
                            handleMemberChange(idx, 'semester', val);
                          }
                        }}
                        className={`w-full px-2.5 py-2 rounded-lg border text-xs ${
                          isMemberEditLocked
                            ? 'border-white/5 bg-black/40 text-slate-500'
                            : 'border-white/10 bg-[#09080e] text-white focus:border-gold-vintage/50'
                        }`}
                      >
                        <option value="">— Select —</option>
                        {SEMESTER_OPTIONS.map(s => (
                          <option key={`mob-sem-${s}`} value={s}>Sem {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Floating Action Controls */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saving || isClosed}
            className={`w-full py-3.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              isClosed
                ? 'bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed'
                : 'bg-gold-vintage hover:bg-gold-bright text-black cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]'
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Workspace..." : "Save Workspace Changes"}
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. DESKTOP STRUCTURE (Dedicated Isolated Multi-Column Grid Tree) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-6 max-w-7xl mx-auto px-6 py-8">
        
        {/* Left Column (8 of 12 Cols): Team Details + Member Directory */}
        <div className="sm:col-span-7 lg:col-span-8 space-y-6">
          
          {/* Card 1: Team Name */}
          <div className="p-6 rounded-2xl border border-gold-vintage/25 bg-[#09080e]/85 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-gold-vintage font-semibold">
                Team Details & Configuration
              </span>
              <Users className="w-4 h-4 text-gold-vintage" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase block">Team Name</label>
              <input
                type="text"
                value={teamName}
                disabled={isClosed}
                onChange={(e) => setTeamName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  isClosed
                    ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed'
                    : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                }`}
              />
            </div>
          </div>

          {/* Card 2: Members Directory */}
          <div className="p-6 rounded-2xl border border-gold-vintage/25 bg-[#09080e]/85 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-display text-lg text-white tracking-widest uppercase">
                Members Directory
              </h3>
              {isMemberEditLocked && (
                <span className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase bg-slate-800/60 border border-white/10 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </div>

            <div className="space-y-4">
              {members.map((member, idx) => {
                const isLeader = idx === 0;
                const isCompulsory = idx < config.minMembers;
                const isEmailPhoneLocked = isLeader || isMemberEditLocked;

                return (
                  <div
                    key={`desk-mem-${idx}`}
                    className={`p-4 rounded-xl border transition-all ${
                      isLeader
                        ? 'border-gold-vintage/35 bg-[#0d0b16]/90 shadow-[0_0_15px_rgba(212,175,55,0.06)]'
                        : 'border-white/10 bg-white/[0.01] hover:border-white/20'
                    } space-y-3`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${isLeader ? 'text-gold-vintage' : 'text-slate-300'}`}>
                        {isLeader ? 'Team Leader (Primary Contact)' : `Member ${idx + 1}`}
                      </h4>
                      {!isLeader && !isCompulsory && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-slate-500/30 text-slate-400 bg-slate-500/10">
                          OPTIONAL
                        </span>
                      )}
                    </div>

                    {/* Row 1: 3-column contact fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase block pl-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={member.name}
                          disabled={isMemberEditLocked}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isMemberEditLocked
                              ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed'
                              : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase block pl-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="Email Address"
                          disabled={isEmailPhoneLocked}
                          value={member.email}
                          onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isEmailPhoneLocked
                              ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed'
                              : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase block pl-1">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="10-digit number"
                          disabled={isEmailPhoneLocked}
                          value={member.phone}
                          maxLength={10}
                          onChange={(e) => handlePhoneChange(idx, e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isEmailPhoneLocked
                              ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed'
                              : phoneErrors[idx]
                                ? 'border-rose-500/60 bg-white/[0.02] text-white focus:outline-none focus:border-rose-500'
                                : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                          }`}
                        />
                        {!isEmailPhoneLocked && phoneErrors[idx] && (
                          <p className="text-[9px] font-mono text-rose-400 pl-1">{phoneErrors[idx]}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: 2-column college & semester fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase pl-1">College Name</label>
                        <input
                          type="text"
                          placeholder="College Name"
                          value={member.college_name || ""}
                          disabled={isMemberEditLocked}
                          onChange={(e) => isLeader ? handleLeaderCollegeChange(e.target.value) : handleMemberChange(idx, 'college_name', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isMemberEditLocked
                              ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed'
                              : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase pl-1">Semester</label>
                        <select
                          value={member.semester ?? ""}
                          disabled={isMemberEditLocked}
                          onChange={(e) => {
                            const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                            if (isLeader) {
                              handleLeaderSemesterChange(val);
                            } else {
                              handleMemberChange(idx, 'semester', val);
                            }
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isMemberEditLocked
                              ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed'
                              : 'border-white/10 bg-[#09080e] text-white focus:outline-none focus:border-gold-vintage/50'
                          }`}
                        >
                          <option value="">— Not Selected —</option>
                          {SEMESTER_OPTIONS.map(s => (
                            <option key={`desk-sem-${s}`} value={s}>Semester {s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12 Cols): Submissions, Media & Guidelines */}
        <div className="sm:col-span-5 lg:col-span-4 space-y-6">
          
          {/* Document Upload */}
          {isDocumentUploadEnabled && (
            <div className="p-6 rounded-2xl border border-gold-vintage/25 bg-[#09080e]/85 backdrop-blur-xl shadow-xl space-y-4 sticky top-24">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-display text-lg text-white tracking-widest uppercase">
                  Project Document
                </h3>
                <FileText className="w-4 h-4 text-gold-vintage" />
              </div>

              {!documentUrl ? (
                isUploading ? (
                  <div className="w-full p-5 rounded-xl border border-gold-vintage/40 bg-gold-vintage/10 space-y-3">
                    <div className="flex items-center gap-3">
                      <UploadCloud className="w-5 h-5 text-gold-vintage shrink-0 animate-pulse" />
                      <span className="text-sm text-white font-medium truncate flex-1">{uploadedFileName}</span>
                      <span className="text-xs font-mono text-gold-vintage shrink-0">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-vintage to-gold-bright transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 text-center">
                      {uploadProgress < 100 ? 'Uploading to Google Drive…' : 'Processing document…'}
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={() => !isClosed && fileInputRefDesktop.current?.click()}
                    className={`w-full p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 text-center transition-all ${
                      isClosed
                        ? 'border-white/5 bg-black/40 cursor-not-allowed'
                        : 'border-white/20 bg-white/[0.02] hover:border-gold-vintage/50 hover:bg-white/[0.04] cursor-pointer'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-gold-vintage/80" />
                    <div>
                      <p className="text-sm text-white font-medium">Click to upload document</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">PDF, PPT, or PPTX (Max 15MB)</p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRefDesktop}
                      disabled={isClosed}
                      className="hidden"
                      accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      onChange={(e) => handleFileSelection(e.target.files?.[0])}
                    />
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-sm text-white font-medium truncate">{documentUrl}</span>
                    </div>
                    <button
                      onClick={handleDocumentDelete}
                      disabled={isClosed}
                      className={`w-full py-2 rounded-lg border text-xs font-mono transition-colors flex items-center justify-center gap-2 ${
                        isClosed
                          ? 'border-white/5 text-slate-500 cursor-not-allowed'
                          : 'border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      Delete Document
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono text-center px-2 leading-relaxed">
                    Delete the current document first to upload a new one.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Demo Video Module (Round 1 Qualifiers) */}
          {team.passed_round === 1 && (
            <div className="p-6 rounded-2xl border border-gold-vintage/35 space-y-4 bg-gradient-to-b from-gold-vintage/10 to-[#09080e]/90 backdrop-blur-xl shadow-xl">
              <h3 className="font-display text-lg text-gold-vintage tracking-widest uppercase border-b border-gold-vintage/20 pb-3">
                Demo Video Submission
              </h3>
              <p className="text-[10px] text-slate-300 font-mono leading-relaxed">
                Congratulations on advancing to Round 2. Please upload your demonstration video (Max 100MB).
              </p>

              {!demoVideoUrl ? (
                <div
                  onClick={() => !isVideoUploading && videoInputRefDesktop.current?.click()}
                  className="w-full p-6 rounded-xl border-2 border-dashed border-gold-vintage/30 bg-black/40 hover:border-gold-vintage hover:bg-gold-vintage/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center"
                >
                  <UploadCloud className="w-8 h-8 text-gold-vintage/70" />
                  <div>
                    <p className="text-sm text-gold-vintage font-medium">Upload Demo Video</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">MP4, WEBM (Max 100MB)</p>
                  </div>
                  <input
                    type="file"
                    ref={videoInputRefDesktop}
                    className="hidden"
                    accept="video/*"
                    onChange={(e) => handleVideoSelection(e.target.files?.[0])}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Video className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-sm text-white font-medium truncate">{demoVideoUrl}</span>
                    </div>
                    <button
                      onClick={() => setDemoVideoUrl("")}
                      className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <X className="w-3.5 h-3.5" />
                      Delete Video
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Guidelines Card */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#09080e]/80 backdrop-blur-xl shadow-lg space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block border-b border-white/5 pb-2">
              Workspace Guidelines
            </span>
            <ul className="text-[11px] text-slate-400 space-y-2 font-mono list-disc list-inside leading-relaxed">
              <li>Ensure all {config.minMembers} to {config.maxMembers} members have valid 10-digit phone numbers.</li>
              <li>College name and semester will autofill from the team leader.</li>
              <li>Save changes before navigating away or logging out.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
