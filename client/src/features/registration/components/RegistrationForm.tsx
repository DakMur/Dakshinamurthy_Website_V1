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

/**
 * Returns true if a member is "partially filled":
 * at least one of Name / Email / Phone has a value, but NOT all three are filled.
 */
function isMemberPartiallyFilled(member: TeamMember): boolean {
  const hasName = member.name.trim().length > 0;
  const hasEmail = member.email.trim().length > 0;
  const hasPhone = member.phone.trim().length > 0;
  const anyFilled = hasName || hasEmail || hasPhone;
  const allFilled = hasName && hasEmail && hasPhone;
  return anyFilled && !allFilled;
}

export default function RegistrationForm({ config, onBack, onSuccess }: RegistrationFormProps) {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<TeamMember[]>(
    Array.from({ length: config.maxMembers }).map(() => ({
      name: "", email: "", phone: "", college_name: "", semester: undefined
    }))
  );
  const [documentUrl, setDocumentUrl] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [phoneErrors, setPhoneErrors] = useState<string[]>(Array(config.maxMembers).fill(""));
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

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string | number | undefined) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  /** Validate phone for a specific member index and update phoneErrors state */
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
    // Strip non-digit characters
    const digits = value.replace(/[^0-9]/g, "");
    handleMemberChange(index, 'phone', digits);
    validatePhone(index, digits);
  };

  // When team leader changes college_name ��� autofill all subsequent members unless manually set
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

  // When team leader changes semester ��� autofill all subsequent members unless manually set
  const handleLeaderSemesterChange = useCallback((value: number | undefined) => {
    setMembers(prev => prev.map((m, i) => {
      if (i === 0) return { ...m, semester: value };
      if (i > 0 && (m.semester === undefined || m.semester === prev[0].semester)) {
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
      setUploadError("");
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
          setUploadError(data.error || "File upload failed. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setUploadError("An error occurred during file upload. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setUploadError("Invalid file type. Please upload a .pdf, .ppt, or .pptx file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicateError) return;

    // Check if any phone errors exist
    if (phoneErrors.some(err => err !== "")) return;

    // Check for partial member fill on optional members
    for (let i = config.minMembers; i < members.length; i++) {
      if (isMemberPartiallyFilled(members[i])) {
        setDuplicateError(`Please complete all fields for Member ${i + 1} or leave all fields blank to skip.`);
        return;
      }
    }

    // Filter out completely empty optional members (Name, Email, Phone all blank)
    const activeMembers = members.filter((m, i) => {
      if (i < config.minMembers) return true; // always include compulsory members
      return m.name.trim() || m.email.trim() || m.phone.trim();
    });

    if (activeMembers.length < config.minMembers) {
      setDuplicateError(`Minimum ${config.minMembers} members required.`);
      return;
    }

    // Normalize optional fields to null for DB cleanliness
    const normalizedMembers = activeMembers.map(m => ({
      ...m,
      college_name: m.college_name?.trim() || null,
      semester: (m.semester !== undefined && m.semester !== null) ? m.semester : null,
    }));

    // Pre-submit: check for cross-member duplicate emails/phones within the form
    const emails = normalizedMembers.map(m => m.email.toLowerCase());
    const phones = normalizedMembers.map(m => m.phone);
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

    // Validate all active member phones
    for (const member of normalizedMembers) {
      if (!/^\d{10}$/.test(member.phone)) {
        setDuplicateError(`Phone number for "${member.name}" must be exactly 10 digits.`);
        return;
      }
    }

    // Pre-submit: check each member email/phone against DB
    setLoading(true);
    for (const member of normalizedMembers) {
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
      leaderEmail: normalizedMembers[0].email,
      leaderPhone: normalizedMembers[0].phone,
      members: normalizedMembers,
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
              const isPartial = !isCompulsory && isMemberPartiallyFilled(member);
              
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-3 transition-colors ${
                    isPartial
                      ? 'border-rose-500/50 bg-rose-500/5'
                      : isLeader
                        ? 'border-gold-vintage/30 bg-gold-vintage/5'
                        : 'border-white/5 bg-white/[0.01]'
                  }`}
                >
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
                    <div className="space-y-1">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required={isCompulsory}
                        value={member.phone}
                        maxLength={10}
                        onChange={(e) => handlePhoneChange(idx, e.target.value)}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, arrow keys
                          const allowedKeys = ['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
                          if (allowedKeys.includes(e.key)) return;
                          // Block non-digit keys
                          if (!/^\d$/.test(e.key)) e.preventDefault();
                        }}
                        onBlur={() => checkSingleDuplicate("", member.phone)}
                        className={`w-full px-3 py-2 rounded-lg border bg-white/[0.02] text-white focus:outline-none text-sm transition-colors ${
                          phoneErrors[idx] ? 'border-rose-500/60 focus:border-rose-500' : 'border-white/10 focus:border-gold-vintage/50'
                        }`}
                      />
                      {phoneErrors[idx] && (
                        <p className="text-[10px] font-mono text-rose-400 pl-1">{phoneErrors[idx]}</p>
                      )}
                    </div>
                  </div>

                  {/* College Name / Semester row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase pl-1">
                        College Name
                        {isLeader && <span className="ml-2 text-gold-vintage/60">(autofills members)</span>}
                      </label>
                      <input
                        type="text"
                        placeholder="College Name"
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
                        value={member.semester ?? ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                          if (isLeader) handleLeaderSemesterChange(val);
                          else handleMemberChange(idx, 'semester', val);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-950 text-white focus:outline-none focus:border-gold-vintage/50 text-sm transition-colors"
                      >
                        <option value="">��� Not Selected ���</option>
                        {SEMESTER_OPTIONS.map(s => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Partial fill warning */}
                  {isPartial && (
                    <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1.5 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Please complete all fields for Member {idx + 1} or leave all fields blank to skip.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* File Upload ��� only shown if allowDocumentUpload is true (default) */}
        {config.allowDocumentUpload !== false && (
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="font-display text-lg text-white tracking-widest uppercase border-b border-white/5 pb-3">Project Document</h3>
            
            {/* Inline upload error */}
            {uploadError && (
              <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}
            
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
                  onClick={() => { setDocumentUrl(""); setUploadError(""); }}
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
            disabled={loading || !!duplicateError || phoneErrors.some(e => e !== "")}
            className="px-8 py-3.5 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold tracking-widest text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "VERIFYING & SUBMITTING..." : "REGISTER TEAM"}
          </button>
        </div>
      </form>
    </div>
  );
}
