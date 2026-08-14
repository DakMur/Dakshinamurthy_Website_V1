import { useState, useRef, useCallback } from "react";
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import UploadCloud from 'lucide-react/dist/esm/icons/upload-cloud';
import File from 'lucide-react/dist/esm/icons/file';
import X from 'lucide-react/dist/esm/icons/x';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import { RegistrationConfig, Team, TeamMember } from "../../../types/types";

interface RegistrationFormProps {
  config: RegistrationConfig;
  onBack: () => void;
  onSuccess: (team: Team) => void;
}

const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function RegistrationForm({ config, onBack, onSuccess }: RegistrationFormProps) {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<TeamMember[]>(
    Array.from({ length: config.maxMembers }).map(() => ({
      name: "", email: "", phone: "", college_name: "", semester: 1
    }))
  );
  const [documentUrl, setDocumentUrl] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [loading, setLoading] = useState(false);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkSingleDuplicate = async (email: string, phone: string) => {
    if (!email && !phone) return;
    try {
      const res = await fetch("/api/v1/registration/check-duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone })
      });
      const data = await res.json();
      if (data.isDuplicate) {
        setDuplicateError(`The email or phone (${email || phone}) is already registered in the system.`);
      } else {
        setDuplicateError("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string | number) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  // When team leader changes college_name — autofill all subsequent members unless manually set
  const handleLeaderCollegeChange = useCallback((value: string) => {
    setMembers(prev => prev.map((m, i) => {
      if (i === 0) return { ...m, college_name: value };
      // Only autofill if not manually overridden (i.e. still matches leader or is empty)
      if (i > 0 && (m.college_name === "" || m.college_name === prev[0].college_name)) {
        return { ...m, college_name: value };
      }
      return m;
    }));
  }, []);

  // When team leader changes semester — autofill all subsequent members unless manually set
  const handleLeaderSemesterChange = useCallback((value: number) => {
    setMembers(prev => prev.map((m, i) => {
      if (i === 0) return { ...m, semester: value };
      if (i > 0 && (m.semester === 1 || m.semester === prev[0].semester)) {
        return { ...m, semester: value };
      }
      return m;
    }));
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelection(file);
  };

  const handleFileSelection = async (file?: globalThis.File) => {
    if (!file) return;
    const validTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
      setLoading(true);
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
        setLoading(false);
      }
    } else {
      alert("Please upload a .pdf, .ppt, or .pptx file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicateError) return;

    // Filter out empty optional members
    const activeMembers = members.filter((m, i) => i < config.minMembers || m.name);

    if (activeMembers.length < config.minMembers) {
      alert(`Minimum ${config.minMembers} members required.`);
      return;
    }

    // Pre-submit: check for cross-member duplicate emails/phones within the form
    const emails = activeMembers.map(m => m.email.toLowerCase());
    const phones = activeMembers.map(m => m.phone);
    const emailSet = new Set(emails);
    const phoneSet = new Set(phones);
    if (emailSet.size !== emails.length) {
      setDuplicateError("Duplicate email addresses found within your team members.");
      return;
    }
    if (phoneSet.size !== phones.length) {
      setDuplicateError("Duplicate phone numbers found within your team members.");
      return;
    }

    // Pre-submit: check each member email/phone against DB
    setLoading(true);
    for (const member of activeMembers) {
      try {
        const res = await fetch("/api/v1/registration/check-duplicates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: member.email, phone: member.phone })
        });
        const data = await res.json();
        if (data.isDuplicate) {
          setDuplicateError(`Email or phone for "${member.name}" is already registered in the system.`);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    const teamData = {
      teamName,
      leaderEmail: activeMembers[0].email,
      leaderPhone: activeMembers[0].phone,
      members: activeMembers,
      documentUrl
    };

    try {
      const res = await fetch("/api/v1/registration/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData)
      });
      const data = await res.json();
      if (data.success) {
        window.alert("Registered Successfully!");
        onSuccess(data.team);
      } else {
        setDuplicateError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setDuplicateError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (config.status !== 'Registration Open') {
    return (
      <div className="text-center py-24 space-y-4 max-w-lg mx-auto">
        <ShieldCheck className="w-16 h-16 text-slate-500 mx-auto" />
        <h2 className="font-display text-2xl text-white uppercase tracking-widest">{config.status}</h2>
        <p className="text-slate-400 font-mono text-sm">Registrations are currently closed. Please check back later.</p>
        <button onClick={onBack} className="mt-8 text-gold-vintage border-b border-gold-vintage/30 pb-1 font-mono text-xs hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Gate
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full">
      <button onClick={onBack} className="mb-6 text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2 font-mono text-xs">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Warning Box */}
        <div className="p-4 rounded-xl border border-gold-vintage/50 bg-gold-vintage/10 flex gap-4 items-start">
          <AlertCircle className="w-6 h-6 text-gold-vintage shrink-0 mt-0.5" />
          <div>
            <h4 className="text-gold-vintage font-mono font-semibold text-sm mb-1 uppercase tracking-wider">Attention Team Leader</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Your entered Email and Phone Number in Row 1 will serve permanently as your account login credentials. Please double-check them carefully before submitting.
            </p>
          </div>
        </div>

        {duplicateError && (
          <div className="p-4 rounded-xl border border-red-500/50 bg-red-500/10 text-red-400 text-sm font-mono text-center">
            {duplicateError}
          </div>
        )}

        {/* Team Details */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <h3 className="font-display text-lg text-white tracking-widest uppercase border-b border-white/5 pb-3">Team Identity</h3>
          <div className="space-y-1 max-w-md">
            <label className="text-[10px] font-mono text-slate-400 uppercase pl-1">Team Name</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
              placeholder="Enter your unique team name"
            />
          </div>
        </div>

        {/* Member Rows */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <div className="flex justify-between items-end border-b border-white/5 pb-3">
            <h3 className="font-display text-lg text-white tracking-widest uppercase">Team Members</h3>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/10">
              Min: {config.minMembers} / Max: {config.maxMembers}
            </span>
          </div>

          <div className="space-y-5">
            {members.map((member, idx) => {
              const isLeader = idx === 0;
              const isCompulsory = idx < config.minMembers;
              
              return (
                <div key={idx} className={`p-4 rounded-xl border ${isLeader ? 'border-gold-vintage/30 bg-gold-vintage/5' : 'border-white/5 bg-white/[0.01]'} space-y-3`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${isLeader ? 'text-gold-vintage' : 'text-slate-300'}`}>
                      {isLeader ? 'Team Leader (Row 1)' : `Member ${idx + 1}`}
                    </h4>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${isCompulsory ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 'border-slate-500/30 text-slate-400 bg-slate-500/10'}`}>
                      {isCompulsory ? 'COMPULSORY' : 'OPTIONAL'}
                    </span>
                  </div>

                  {/* Name / Email / Phone row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required={isCompulsory}
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required={isCompulsory}
                      value={member.email}
                      onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      onBlur={() => checkSingleDuplicate(member.email, "")}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required={isCompulsory}
                      value={member.phone}
                      onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                      onBlur={() => checkSingleDuplicate("", member.phone)}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
                    />
                  </div>

                  {/* College Name / Semester row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase pl-1">
                        College / Institution Name
                        {isLeader && <span className="ml-2 text-gold-vintage/60">(autofills members)</span>}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Sri Venkateswara College"
                        value={member.college_name || ""}
                        onChange={(e) => {
                          if (isLeader) handleLeaderCollegeChange(e.target.value);
                          else handleMemberChange(idx, 'college_name', e.target.value);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase pl-1">
                        Current Semester
                        {isLeader && <span className="ml-2 text-gold-vintage/60">(autofills members)</span>}
                      </label>
                      <select
                        value={member.semester || 1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (isLeader) handleLeaderSemesterChange(val);
                          else handleMemberChange(idx, 'semester', val);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-950 text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
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

        {/* File Upload — only shown if allowDocumentUpload is true (default) */}
        {config.allowDocumentUpload !== false && (
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="font-display text-lg text-white tracking-widest uppercase border-b border-white/5 pb-3">Project Document</h3>
            
            {!documentUrl ? (
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${
                  isDragging ? 'border-gold-vintage bg-gold-vintage/10' : 'border-white/20 bg-white/[0.02] hover:border-gold-vintage/50 hover:bg-white/[0.04]'
                }`}
              >
                <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-gold-vintage' : 'text-slate-400'}`} />
                <div>
                  <p className="text-sm text-white font-medium">Click to upload or drag and drop</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">PDF, PPT, or PPTX (Max 10MB)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={(e) => handleFileSelection(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-white font-medium truncate max-w-xs">{documentUrl}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setDocumentUrl("")}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading || !!duplicateError}
            className="px-8 py-3.5 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold tracking-widest text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "VERIFYING & SUBMITTING..." : "REGISTER TEAM"}
          </button>
        </div>
      </form>
    </div>
  );
}
