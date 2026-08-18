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

const DesktopCard = ({ step, alignRight }: { step: TimelineStep; alignRight: boolean }) => (
  <div className="w-full bg-[#07070a]/80 border border-gold-vintage/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
    <div className="space-y-4">
      <div className={`flex flex-col ${alignRight ? 'sm:items-end' : 'sm:items-start'}`}>
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
        <p className={`text-xs text-slate-400 leading-relaxed font-sans max-w-md ${alignRight ? 'sm:ml-auto' : ''}`}>
          {step.description}
        </p>
      )}

      {/* Date block inside */}
      {step.quoteAuthor && (
        <div className={`p-3 sm:p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col ${
          alignRight ? "sm:items-end animate-fade-in" : "items-start animate-fade-in"
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
  </div>
);

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
      {/* Global Golden Connecting Line */}
      <div className="absolute left-[36px] sm:left-1/2 top-6 bottom-6 -translate-x-1/2 w-[2px] bg-gradient-to-b from-gold-vintage/20 via-gold-vintage/60 to-gold-vintage/20 pointer-events-none z-0" />

      <div className="relative w-full max-w-5xl mx-auto space-y-8 sm:space-y-12 z-10">
        {activeTimeline.map((item, index) => {
          const NodeIcon = ICON_POOL[index % ICON_POOL.length];

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full"
            >
              {/* ---------------------------------------------------- */}
              {/* 1. MOBILE VIEW ONLY (< sm)                           */}
              {/* ---------------------------------------------------- */}
              <div className="flex sm:hidden items-start gap-4 w-full text-left">
                {/* Icon Node (Anchored to top left) */}
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-gold-vintage bg-[#07070a] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.25)] mt-1">
                  <NodeIcon className="w-5 h-5 text-gold-vintage" />
                </div>

                {/* Timeline Content Card */}
                <div className="flex-1 min-w-0 bg-[#07070a]/80 border border-gold-vintage/20 rounded-xl p-4 shadow-lg">
                  <div className="text-xs font-semibold tracking-wider text-gold-vintage uppercase mb-1">
                    {item.order != null ? `PHASE ${String(item.order).padStart(2, '0')}` : 'PHASE'} • {item.stage}
                  </div>
                  <div className="text-base font-serif text-white mb-2">
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs font-serif italic text-slate-400 mb-2">
                      &ldquo;{item.subtitle}&rdquo;
                    </p>
                  )}
                  <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  {item.quoteAuthor && (
                    <div className="text-xs text-gold-vintage/80 font-mono border-t border-gold-vintage/10 pt-2">
                      {item.quoteAuthor}
                    </div>
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* 2. DESKTOP VIEW ONLY (>= sm)                         */}
              {/* ---------------------------------------------------- */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_48px_1fr] sm:gap-8 items-start w-full">
                {/* Left Column */}
                <div className="text-right">
                  {index % 2 === 0 && <DesktopCard step={item} alignRight={true} />}
                </div>

                {/* Center Icon */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-gold-vintage bg-[#07070a] mx-auto mt-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <NodeIcon className="w-6 h-6 text-gold-vintage" />
                </div>

                {/* Right Column */}
                <div className="text-left">
                  {index % 2 !== 0 && <DesktopCard step={item} alignRight={false} />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default TimelineSection;
