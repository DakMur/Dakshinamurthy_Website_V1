import { useState, useRef } from "react";
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import UploadCloud from 'lucide-react/dist/esm/icons/upload-cloud';
import File from 'lucide-react/dist/esm/icons/file';
import X from 'lucide-react/dist/esm/icons/x';
import Save from 'lucide-react/dist/esm/icons/save';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Lock from 'lucide-react/dist/esm/icons/lock';
import { Team, RegistrationConfig, TeamMember } from "../../../types/types";

interface TeamDashboardProps {
  team: Team;
  config: RegistrationConfig;
  onUpdateTeam: (team: Team) => void;
  onLogout: () => void;
}

const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function TeamDashboard({ team, config, onUpdateTeam, onLogout }: TeamDashboardProps) {
  const [teamName, setTeamName] = useState(team.teamName);
  const [members, setMembers] = useState<TeamMember[]>([...team.members]);
  const [documentUrl, setDocumentUrl] = useState(team.documentUrl || "");
  const [demoVideoUrl, setDemoVideoUrl] = useState(team.demoVideoUrl || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const isClosed = config.status === "Registrations Closed";
  // Lock member edits if registration is closed OR if admin has disabled member edits
  const isMemberEditLocked = isClosed || config.allowMemberEdits === false;
  const isDocumentUploadEnabled = config.allowDocumentUpload !== false;

  // Fill up to maxMembers with empty objects if they don't exist
  while (members.length < config.maxMembers) {
    members.push({ name: "", email: "", phone: "", college_name: "", semester: 1 });
  }

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string | number) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleFileSelection = async (file?: globalThis.File) => {
    if (!file) return;
    const validTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
      setSaving(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/v1/registration/upload", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          setDocumentUrl(data.url);
        } else {
          alert(data.error || "File upload failed.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred during file upload.");
      } finally {
        setSaving(false);
      }
    } else {
      alert("Please upload a .pdf, .ppt, or .pptx file.");
    }
  };

  const handleVideoSelection = async (file?: globalThis.File) => {
    if (!file) return;
    if (file.type.startsWith('video/')) {
      setSaving(true);
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
          // Save immediately
          await fetch(`/api/v1/registration/team/${team.id}/demo-video`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ demoVideoUrl: videoUrl })
          });
          setMessage("Video uploaded successfully.");
        } else {
          alert(data.error || "Video upload failed.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred during video upload.");
      } finally {
        setSaving(false);
      }
    } else {
      alert("Please upload a valid video file.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const activeMembers = members.filter((m, i) => i < config.minMembers || m.name);

    if (activeMembers.length < config.minMembers) {
      setMessage(`Minimum ${config.minMembers} members required.`);
      setSaving(false);
      return;
    }

    const updates = {
      teamName,
      members: activeMembers,
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
        onUpdateTeam(data.team);
        setMessage("Team details updated successfully.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Failed to update team.");
      }
    } catch (err) {
      setMessage("Failed to update team.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-display font-medium text-2xl tracking-widest text-gold-vintage uppercase">
            Team Workspace
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Authenticated as Team Leader
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            disabled={saving || isClosed}
            className={`px-4 py-2 rounded-xl border font-mono text-xs transition-all flex items-center gap-2 ${
              isClosed ? 'bg-slate-900 border-white/5 text-slate-500 cursor-not-allowed' : 'bg-gold-vintage/10 text-gold-vintage border-gold-vintage/30 hover:bg-gold-vintage hover:text-black cursor-pointer'
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : isClosed ? "Locked" : "Save Changes"}
          </button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-xs cursor-pointer transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Admin-set member edit lock notice */}
      {config.allowMemberEdits === false && !isClosed && (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center gap-3 text-amber-400">
          <Lock className="w-4 h-4 shrink-0" />
          <p className="text-xs font-mono">Member details editing has been temporarily locked by the administrator.</p>
        </div>
      )}

      {message && (
        <div className={`p-4 mb-6 rounded-xl border text-sm font-mono text-center ${message.includes('successfully') ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Team Name</label>
              <input
                type="text"
                value={teamName}
                disabled={isClosed}
                onChange={(e) => setTeamName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                  isClosed ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed' : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                }`}
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-display text-lg text-white tracking-widest uppercase">Members Directory</h3>
              {isMemberEditLocked && (
                <span className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase bg-slate-800/60 border border-white/5 px-2 py-1 rounded-full">
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
                  <div key={idx} className={`p-4 rounded-xl border ${isLeader ? 'border-gold-vintage/30 bg-gold-vintage/5' : 'border-white/5 bg-white/[0.01]'} space-y-3`}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${isLeader ? 'text-gold-vintage' : 'text-slate-300'}`}>
                        {isLeader ? 'Team Leader' : `Member ${idx + 1}`}
                      </h4>
                      {!isLeader && !isCompulsory && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-slate-500/30 text-slate-400 bg-slate-500/10">OPTIONAL</span>
                      )}
                    </div>

                    {/* Name / Email / Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={member.name}
                        disabled={isMemberEditLocked}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isMemberEditLocked ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed' : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                        }`}
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        disabled={isEmailPhoneLocked}
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isEmailPhoneLocked ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed' : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                        }`}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        disabled={isEmailPhoneLocked}
                        value={member.phone}
                        onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isEmailPhoneLocked ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed' : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                        }`}
                      />
                    </div>

                    {/* College Name / Semester */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase pl-1">College / Institution</label>
                        <input
                          type="text"
                          placeholder="e.g., Sri Venkateswara College"
                          value={member.college_name || ""}
                          disabled={isMemberEditLocked}
                          onChange={(e) => handleMemberChange(idx, 'college_name', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isMemberEditLocked ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed' : 'border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50'
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase pl-1">Semester</label>
                        <select
                          value={member.semester || 1}
                          disabled={isMemberEditLocked}
                          onChange={(e) => handleMemberChange(idx, 'semester', parseInt(e.target.value, 10))}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            isMemberEditLocked ? 'border-white/5 bg-black/40 text-slate-500 cursor-not-allowed' : 'border-white/10 bg-slate-950 text-white focus:outline-none focus:border-gold-vintage/50'
                          }`}
                        >
                          {SEMESTER_OPTIONS.map(s => (
                            <option key={s} value={s}>Semester {s}</option>
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

        <div className="lg:col-span-1 space-y-6">
          {/* Document Upload — conditional on allowDocumentUpload */}
          {isDocumentUploadEnabled && (
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 sticky top-24">
              <h3 className="font-display text-lg text-white tracking-widest uppercase border-b border-white/5 pb-3">Project Document</h3>
              
              {!documentUrl ? (
                <div 
                  onClick={() => !isClosed && fileInputRef.current?.click()}
                  className={`w-full p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 text-center ${
                    isClosed ? 'border-white/5 bg-black/40 cursor-not-allowed' : 'border-white/20 bg-white/[0.02] hover:border-gold-vintage/50 hover:bg-white/[0.04] transition-all cursor-pointer'
                  }`}
                >
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                  <div>
                    <p className="text-sm text-white font-medium">Click to upload document</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">PDF, PPT, or PPTX</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    disabled={isClosed}
                    className="hidden" 
                    accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={(e) => handleFileSelection(e.target.files?.[0])}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-sm text-white font-medium truncate">{documentUrl}</span>
                    </div>
                    <button 
                      onClick={() => !isClosed && setDocumentUrl("")}
                      disabled={isClosed}
                      className={`w-full py-2 rounded-lg border text-xs font-mono transition-colors flex items-center justify-center gap-2 ${
                        isClosed ? 'border-white/5 text-slate-500 cursor-not-allowed' : 'border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      Delete Document
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono text-center px-2 leading-relaxed">
                    Note: Delete the current document first to upload a new one.
                  </p>
                </div>
              )}
            </div>
          )}

          {team.passed_round === 1 && (
            <div className="p-6 rounded-2xl border border-gold-vintage/30 space-y-4 bg-gradient-to-b from-gold-vintage/10 to-transparent sticky top-72">
              <h3 className="font-display text-lg text-gold-vintage tracking-widest uppercase border-b border-gold-vintage/20 pb-3">Demo Video Submission</h3>
              <p className="text-[10px] text-slate-300 font-mono leading-relaxed">
                Congratulations on advancing. Please submit your demonstration video. This module remains active even during registration closures.
              </p>
              
              {!demoVideoUrl ? (
                <div 
                  onClick={() => !saving && videoInputRef.current?.click()}
                  className="w-full p-6 rounded-xl border-2 border-dashed border-gold-vintage/30 bg-black/40 hover:border-gold-vintage hover:bg-gold-vintage/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center"
                >
                  <UploadCloud className="w-8 h-8 text-gold-vintage/60" />
                  <div>
                    <p className="text-sm text-gold-vintage font-medium">Upload Demo Video</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">MP4, WEBM</p>
                  </div>
                  <input 
                    type="file" 
                    ref={videoInputRef}
                    className="hidden" 
                    accept="video/*"
                    onChange={(e) => handleVideoSelection(e.target.files?.[0])}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="w-5 h-5 text-emerald-400 shrink-0" />
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
        </div>
      </div>
    </div>
  );
}
