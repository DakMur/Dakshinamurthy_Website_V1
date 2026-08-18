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

const TimelineCard = ({ step, alignRightOnDesktop }: { step: TimelineStep; alignRightOnDesktop: boolean }) => (
  <div className="w-full bg-[#07070a]/80 border border-gold-vintage/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
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
      {/* 1. Continuous Vertical Background Line aligned to mobile icon center (left-[36px]) and desktop center (sm:left-1/2) */}
      <div className="absolute left-[36px] sm:left-1/2 top-8 bottom-8 -translate-x-1/2 w-[2px] bg-gradient-to-b from-gold-vintage/20 via-gold-vintage/60 to-gold-vintage/20 pointer-events-none z-0" />

      {/* 2. Unified Responsive Timeline Items */}
      <div className="relative z-10">
        {activeTimeline.map((step, idx) => {
          const NodeIcon = ICON_POOL[idx % ICON_POOL.length];

          return (
            <motion.div
              key={step.id || idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative flex flex-row items-start sm:grid sm:grid-cols-[1fr_48px_1fr] gap-3 sm:gap-8 z-10 my-6 sm:my-10"
            >
              {/* 1. MOBILE ICON NODE (Visible on mobile only, locked to card top) */}
              <div className="flex sm:hidden flex-shrink-0 w-10 justify-center pt-1 z-10">
                <div className="w-9 h-9 rounded-full border-2 border-gold-vintage bg-[#07070a] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                  <NodeIcon className="w-4 h-4 text-gold-vintage" />
                </div>
              </div>

              {/* 2. DESKTOP LEFT SLOT (Even indices get Left Card; Odd indices get empty space) */}
              <div className="hidden sm:block text-right">
                {idx % 2 === 0 && <TimelineCard step={step} alignRightOnDesktop={true} />}
              </div>

              {/* 3. DESKTOP CENTER ICON NODE (Visible on desktop only) */}
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full border-2 border-gold-vintage bg-[#07070a] z-10 self-start mt-2 mx-auto shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <motion.div
                  className="w-full h-full flex items-center justify-center text-gold-vintage relative"
                  whileHover={{ scale: 1.15, borderColor: "#fbbf24" }}
                  style={{ willChange: "transform" }}
                >
                  <NodeIcon className="w-6 h-6 text-gold-vintage" />
                  <span className="absolute -inset-2 rounded-full border border-gold-vintage/20 animate-ping opacity-60 pointer-events-none" />
                </motion.div>
              </div>

              {/* 4. CARD SLOT (Mobile: Always visible / Desktop: Odd indices get Right Card) */}
              <div className="flex-1 min-w-0">
                {/* Mobile View: Render card always */}
                <div className="block sm:hidden">
                  <TimelineCard step={step} alignRightOnDesktop={false} />
                </div>
                {/* Desktop View: Render card on odd index */}
                <div className="hidden sm:block text-left">
                  {idx % 2 !== 0 && <TimelineCard step={step} alignRightOnDesktop={false} />}
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
