import { memo, useEffect, useState } from "react";
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Clipboard from 'lucide-react/dist/esm/icons/clipboard';
import Lightbulb from 'lucide-react/dist/esm/icons/lightbulb';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import { motion } from "motion/react";
import { TimelineStep } from "../../types/types";
import { TimelineItem } from "../../types/types";
import { FALLBACK_TIMELINE } from "../../hooks/useDatabase";

interface TimelineSectionProps {
  timeline?: TimelineStep[];
  loadTimeline?: () => void;
}

/** Map a Supabase TimelineItem to the TimelineStep shape expected by the renderer */
function mapToTimelineStep(item: TimelineItem, idx: number): TimelineStep {
  return {
    id: String(item.id),
    order: item.display_order ?? idx + 1,
    stage: item.phase_tag || 'Phase',
    title: item.title,
    subtitle: item.quote || '',
    description: item.description || '',
    quote: item.quote || '',
    quoteAuthor: item.date_text || undefined,
    image: '',
    milestone: item.phase_tag || '',
  };
}

const TimelineSection = memo(function TimelineSection({ timeline, loadTimeline }: TimelineSectionProps) {
  const [activeTimeline, setActiveTimeline] = useState<TimelineStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadTimeline) loadTimeline();
  }, [loadTimeline]);

  useEffect(() => {
    // If parent supplies a non-empty timeline prop, use it directly (backward compat)
    if (timeline && timeline.length > 0) {
      setActiveTimeline(timeline);
      setLoading(false);
      return;
    }

    // Otherwise self-fetch from the Supabase-backed API
    let cancelled = false;
    async function fetchTimeline() {
      try {
        const res = await fetch('/api/v1/timeline');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          const items: TimelineItem[] = data.timeline || [];
          if (items.length > 0) {
            setActiveTimeline(items.map(mapToTimelineStep));
          } else {
            setActiveTimeline(FALLBACK_TIMELINE);
          }
        }
      } catch (err) {
        console.error('TimelineSection fetch error:', err);
        if (!cancelled) setActiveTimeline(FALLBACK_TIMELINE);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTimeline();
    return () => { cancelled = true; };
  }, [timeline]);

  // Mapping beautiful icon states to different event stages
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "Theme Announcement":
        return Sparkles;
      case "Registrations":
        return Clipboard;
      case "Ideathon":
        return Lightbulb;
      case "Expert Workshops":
        return GraduationCap;
      case "Makeathon Finals":
        return Trophy;
      default:
        return Sparkles;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative py-12 max-w-4xl mx-auto">
      {/* 1. Glowing Vertical Aura line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cosmic-purple via-gold-vintage to-gold-bright transform -translate-x-[1px] opacity-40 shadow-[0_0_8px_rgba(212,175,55,0.2)]" />

      {/* Timeline Steps Loop */}
      <div className="space-y-20 md:space-y-28 relative">
        {activeTimeline.map((step, idx) => {
          const Icon = getStageIcon(step.stage);
          const isRight = idx % 2 === 0;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col md:flex-row items-start md:items-center relative"
            >
              {/* 2. central blinking light node point */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 scale-100 z-10">
                <motion.div
                  className="w-10 h-10 rounded-full bg-[#050505] border-2 border-gold-vintage flex items-center justify-center text-gold-vintage shadow-xl shadow-gold-vintage/15 relative"
                  whileHover={{ scale: 1.15, borderColor: "#fbbf24" }}
                  style={{ willChange: "transform" }}
                >
                  <Icon className="w-5 h-5 animate-pulse" />
                  <span className="absolute -inset-2 rounded-full border border-gold-vintage/20 animate-ping opacity-60" />
                </motion.div>
              </div>

              {/* 3. Story card blocks */}
              <div
                className={`w-full md:w-[45%] pl-20 md:pl-0 ${
                  isRight ? "md:mr-auto md:text-right md:pr-14" : "md:ml-auto md:pl-14"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex flex-col justify-start md:group">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gold-vintage">
                      PHASE 0{step.order} • {step.stage.toUpperCase()}
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
                  <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md">
                    {step.description}
                  </p>

                  {/* Date block inside */}
                  {step.quoteAuthor && (
                    <div className={`p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col ${
                      isRight ? "md:items-end animate-fade-in" : "items-start animate-fade-in"
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default TimelineSection;
