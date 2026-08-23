import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Bell from 'lucide-react/dist/esm/icons/bell';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import { Notice } from "../../types/types";

interface NoticeBoardProps {
  setRoute?: (route: string) => void;
}

export default function NoticeBoard({ setRoute }: NoticeBoardProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/v1/notices");
        const data = await res.json();
        if (data.success) {
          setNotices(data.notices || []);
        }
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Pause lenis scroll when modal is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (selectedNotice) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => lenis?.start();
  }, [selectedNotice]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  const featuredNotice = notices[0] ?? null;
  const restNotices = notices.slice(1);

  return (
    <motion.div
      key="noticeboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full space-y-12 py-6"
    >
      {/* Page Header */}
      <div className="space-y-3 max-w-2xl mx-auto text-center">
        <h2 className="font-display font-medium text-3xl md:text-5xl tracking-widest text-white uppercase">
          Notice Board
        </h2>
        <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto mt-4" />
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans mt-3">
          Official announcements, updates, and important information for all participants of Dakshinaasya Darshini.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-24 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center mx-auto">
            <Bell className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="font-display text-xl text-white uppercase tracking-widest">No Notices Yet</h3>
          <p className="text-slate-400 font-mono text-xs">Check back soon for official announcements and updates.</p>
        </div>
      ) : (
        <div className="space-y-10">

          {/* ── Featured Notice (Hero Card) ───────────────────────────────── */}
          {featuredNotice && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-gold-vintage/25 bg-gradient-to-br from-gold-vintage/10 via-[#0c0a1a] to-[#080810] p-[1px]"
            >
              <div className="rounded-2xl bg-gradient-to-br from-[#0f0c1d] via-[#0a0812] to-[#06050e] p-8 md:p-10 relative overflow-hidden">
                {/* Decorative radial glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-gold-vintage/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                  {/* Left: Badge */}
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gold-vintage/10 border border-gold-vintage/30 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-gold-vintage" />
                    </div>
                  </div>

                  {/* Center: Content */}
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[9px] font-mono tracking-widest text-gold-vintage uppercase bg-gold-vintage/10 border border-gold-vintage/20 px-3 py-1 rounded-full">
                        Latest Notice
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(featuredNotice.created_at)}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl text-white tracking-wide leading-tight">
                      {featuredNotice.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed font-sans line-clamp-4">
                      {featuredNotice.short_description}
                    </p>
                  </div>

                  {/* Right: CTA */}
                  <div className="shrink-0">
                    <button
                      onClick={() => setSelectedNotice(featuredNotice)}
                      className="group px-6 py-3 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold text-xs tracking-widest cursor-pointer transition-all flex items-center gap-2"
                    >
                      Read More
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Subsequent Notices Grid ───────────────────────────────────── */}
          {restNotices.length > 0 && (
            <div>
              <h4 className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-5 pl-1">
                Previous Notices
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restNotices.map((notice, idx) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * (idx + 1) }}
                    className="group relative p-6 rounded-2xl glass-panel border border-white/8 hover:border-white/15 transition-all duration-300 cursor-pointer flex flex-col gap-4"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/8 flex items-center justify-center shrink-0 group-hover:border-gold-vintage/30 group-hover:bg-gold-vintage/5 transition-all">
                        <Bell className="w-4 h-4 text-slate-400 group-hover:text-gold-vintage transition-colors" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-600 flex items-center gap-1 mt-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(notice.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-display text-lg text-white group-hover:text-gold-vintage/90 transition-colors leading-snug line-clamp-2">
                      {notice.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3 flex-1">
                      {notice.short_description}
                    </p>

                    {/* Read More link */}
                    <div className="flex items-center gap-1 text-[10px] font-mono text-gold-vintage/70 group-hover:text-gold-vintage transition-colors">
                      Read full notice <ChevronRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Read More Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedNotice(null); }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#0a0812] shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 p-6 border-b border-white/8 shrink-0">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono tracking-widest text-gold-vintage uppercase bg-gold-vintage/10 border border-gold-vintage/20 px-2 py-0.5 rounded-full">
                      Official Notice
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatDate(selectedNotice.created_at)}
                    </span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-white tracking-wide leading-tight">
                    {selectedNotice.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="shrink-0 p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 space-y-4 flex-1">
                {/* Short description (highlighted) */}
                <div className="p-4 rounded-xl bg-gold-vintage/5 border border-gold-vintage/15">
                  <p className="text-sm text-slate-200 leading-relaxed font-sans italic">
                    {selectedNotice.short_description}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-white/5" />

                {/* Full content */}
                <div className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedNotice.full_content}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-4 border-t border-white/8 shrink-0">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 font-mono text-xs tracking-widest cursor-pointer transition-all"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
