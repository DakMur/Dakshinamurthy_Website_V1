import { memo, useEffect } from "react";
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Clipboard from 'lucide-react/dist/esm/icons/clipboard';
import Lightbulb from 'lucide-react/dist/esm/icons/lightbulb';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import { motion } from "motion/react";
import { TimelineStep } from "../../types/types";
import { FALLBACK_TIMELINE } from "../../hooks/useDatabase";

interface TimelineSectionProps {
  timeline: TimelineStep[];
  loadTimeline?: () => void;
}

const TimelineSection = memo(function TimelineSection({ timeline, loadTimeline }: TimelineSectionProps) {
  useEffect(() => {
    if (loadTimeline) loadTimeline();
  }, [loadTimeline]);

  const activeTimeline = timeline && timeline.length > 0 ? timeline : FALLBACK_TIMELINE;

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

                  {/* Status & Date block inside */}
                  <div className={`p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col ${
                    isRight ? "md:items-end animate-fade-in" : "items-start animate-fade-in"
                  }`}>
                    <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                      STATUS
                    </div>
                    <p className="font-sans text-slate-300 text-xs font-semibold mt-0.5">
                      {step.quote}
                    </p>
                    {step.quoteAuthor && (
                      <>
                        <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-2">
                          DATE
                        </div>
                        <span className="text-xs font-sans text-gold-vintage font-medium mt-0.5">
                          {step.quoteAuthor}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Final Milestone highlight */}
                  <div className="text-left">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mb-1">
                      MILESTONE TO BE ACHIEVED
                    </span>
                    <div className="px-3 py-1.5 rounded-lg border border-gold-vintage/25 bg-gold-vintage/[0.03] text-[10.5px] font-mono text-slate-200">
                      {step.milestone}
                    </div>
                  </div>
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
