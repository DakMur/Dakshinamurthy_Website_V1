import { memo, useEffect, useState } from "react";
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Compass from 'lucide-react/dist/esm/icons/compass';
import Lightbulb from 'lucide-react/dist/esm/icons/lightbulb';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Target from 'lucide-react/dist/esm/icons/target';
import Award from 'lucide-react/dist/esm/icons/award';
import { motion } from "motion/react";
import { TimelineStep, TimelineItem } from "../../types/types";
import { FALLBACK_TIMELINE } from "../../hooks/useDatabase";

interface TimelineSectionProps {
  timeline?: TimelineStep[];
  loadTimeline?: () => void;
}

const ICON_POOL = [Sparkles, Compass, Lightbulb, GraduationCap, Trophy, Target, Award];

const TimelineSection = memo(function TimelineSection({ timeline, loadTimeline }: TimelineSectionProps) {
  const [activeTimeline, setActiveTimeline] = useState<TimelineStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadTimeline) loadTimeline();
  }, [loadTimeline]);

  useEffect(() => {
    // Self-fetch from the Supabase-backed API (cache-bust to always get fresh data)
    let cancelled = false;
    async function fetchTimeline() {
      try {
        const res = await fetch(`/api/v1/timeline?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          const rawItems: TimelineItem[] = data.timeline || (Array.isArray(data) ? data : []);
          if (rawItems.length > 0) {
            // Sort data strictly by display_order ascending
            const items = [...rawItems].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
            // Map all DB fields: phase_number, phase_tag, title, quote, description, date_text
            setActiveTimeline(items.map((item, idx) => ({
              id: String(item.id),
              order: item.phase_number ?? item.display_order ?? idx + 1,
              stage: item.phase_tag || 'Phase',
              title: item.title,
              subtitle: item.quote || '',
              description: item.description || '',
              quote: item.quote || '',
              quoteAuthor: item.date_text || undefined,
              image: '',
              milestone: item.phase_tag || '',
            })));
          } else if (timeline && timeline.length > 0) {
            const sorted = [...timeline].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setActiveTimeline(sorted);
          } else {
            setActiveTimeline(FALLBACK_TIMELINE);
          }
        }
      } catch (err) {
        console.error('TimelineSection fetch error:', err);
        if (!cancelled) {
          if (timeline && timeline.length > 0) {
            const sorted = [...timeline].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setActiveTimeline(sorted);
          } else {
            setActiveTimeline(FALLBACK_TIMELINE);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTimeline();
    return () => { cancelled = true; };
  }, [timeline]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4">
      {/* 1. Auto-Extending Vertical connecting line that tracks container bounds with pixel-perfect center anchoring */}
      <div className="absolute left-[32px] sm:left-1/2 top-6 bottom-6 -translate-x-1/2 w-[2px] bg-gradient-to-b from-gold-vintage/20 via-gold-vintage/60 to-gold-vintage/20 pointer-events-none z-0" />

      {/* 2. Dynamic Timeline Phase Cards with CSS Grid alignment */}
      <div className="relative z-10 space-y-8 sm:space-y-12">
        {activeTimeline.map((step, idx) => {
          const NodeIcon = ICON_POOL[idx % ICON_POOL.length];
          const isEven = idx % 2 === 0;

          const renderCardContent = (alignRightOnDesktop: boolean) => (
            <div className="space-y-4">
              <div className={`flex flex-col ${alignRightOnDesktop ? 'sm:items-end' : 'sm:items-start'}`}>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold-vintage">
                  {step.order != null ? `PHASE ${String(step.order).padStart(2, '0')} • ${step.stage.toUpperCase()}` : step.stage.toUpperCase()}
                </span>
                <h3 className="font-display font-medium text-lg md:text-xl text-slate-100 tracking-wider mt-1">
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="text-xs font-serif italic text-slate-400 mt-1">
                    &ldquo;{step.subtitle}&rdquo;
                  </p>
                )}
              </div>

              {/* Narrative content */}
              {step.description && (
                <p className={`text-xs text-slate-400 leading-relaxed font-sans max-w-md ${alignRightOnDesktop ? 'sm:ml-auto' : ''}`}>
                  {step.description}
                </p>
              )}

              {/* Date block inside */}
              {step.quoteAuthor && (
                <div className={`p-3 sm:p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col ${
                  alignRightOnDesktop ? "sm:items-end animate-fade-in" : "items-start animate-fade-in"
                }`}>
                  <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                    DATE
                  </div>
                  <span className="text-xs font-sans text-gold-vintage font-medium mt-0.5">
                    {step.quoteAuthor}
                  </span>
                </div>
              )}
            </div>
          );

          const cardBaseClasses = "w-full bg-[#07070a]/80 border border-gold-vintage/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)]";

          return (
            <motion.div
              key={step.id || idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-[32px_1fr] sm:grid-cols-[1fr_48px_1fr] gap-4 sm:gap-8 items-start relative z-10"
            >
              {/* Desktop Left / Card on Left (when isEven) */}
              {isEven ? (
                <div className={`col-start-2 sm:col-start-1 sm:row-start-1 ${cardBaseClasses} sm:text-right`}>
                  {renderCardContent(true)}
                </div>
              ) : (
                <div className="hidden sm:block sm:col-start-1 sm:row-start-1" />
              )}

              {/* Icon Column (Fixed width: 32px on mobile, 48px on desktop) */}
              <div className="col-start-1 sm:col-start-2 sm:row-start-1 relative flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-gold-vintage bg-[#07070a] z-10 mx-auto shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <motion.div
                  className="w-full h-full flex items-center justify-center text-gold-vintage relative"
                  whileHover={{ scale: 1.15, borderColor: "#fbbf24" }}
                  style={{ willChange: "transform" }}
                >
                  <NodeIcon className="w-4 h-4 sm:w-6 sm:h-6 text-gold-vintage" />
                  <span className="absolute -inset-1 sm:-inset-2 rounded-full border border-gold-vintage/20 animate-ping opacity-60 pointer-events-none" />
                </motion.div>
              </div>

              {/* Desktop Right / Card on Right (when !isEven) */}
              {!isEven ? (
                <div className={`col-start-2 sm:col-start-3 sm:row-start-1 ${cardBaseClasses} sm:text-left`}>
                  {renderCardContent(false)}
                </div>
              ) : (
                <div className="hidden sm:block sm:col-start-3 sm:row-start-1" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default TimelineSection;
