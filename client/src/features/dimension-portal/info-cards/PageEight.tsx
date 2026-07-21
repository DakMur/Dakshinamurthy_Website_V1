import { useState, useEffect } from "react";
import { BookOpen, Compass, ArrowRight, Play, Square } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DomainContent } from "../../../types/types";
import ProjectSpotlight from "../components/ProjectSpotlight";

interface InfoCardProps { domain: DomainContent; allDomains?: DomainContent[]; onNavigateToDomain?: (domain: DomainContent) => void; onReturn?: () => void; }

export default function PageEight({ domain, allDomains = [], onNavigateToDomain }: InfoCardProps) {
  const [activeTab, setActiveTab] = useState<"teachings" | "practice">("teachings");
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold (Full)" | "Exhale" | "Hold (Empty)">("Inhale");
  const [breathTimer, setBreathTimer] = useState(4);
  

  useEffect(() => { let timerId: NodeJS.Timeout; if (breathingActive) { timerId = setInterval(() => { setBreathTimer((prev) => { if (prev === 1) { setBreathPhase((cp) => { switch (cp) { case "Inhale": return "Hold (Full)"; case "Hold (Full)": return "Exhale"; case "Exhale": return "Hold (Empty)"; case "Hold (Empty)": return "Inhale"; default: return "Inhale"; } }); return 4; } return prev - 1; }); }, 1000); } else { setBreathTimer(4); setBreathPhase("Inhale"); } return () => clearInterval(timerId); }, [breathingActive]);

  const images = ["https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600","https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"];

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden min-h-[300px] flex flex-col justify-end p-6 md:p-10 border border-white/10 mb-8 shadow-2xl">
        <div className="absolute inset-0"><img src={domain.image} alt={domain.title} loading="lazy" decoding="async" className="w-full h-full object-cover filter brightness-45 scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" /><div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" /></div>
        <div className="relative z-10"><div className="text-[10px] uppercase tracking-widest font-mono text-gold-vintage bg-gold-vintage/10 px-3 py-1 rounded-full w-max border border-gold-vintage/20 mb-3 ml-0.5">{domain.energyIndicator || "Tattva Level"}</div><h1 className="font-display font-bold text-3xl md:text-5xl text-white tracking-widest uppercase mb-2">{domain.title}</h1><p className="font-serif italic text-slate-300 text-lg md:text-xl max-w-2xl pl-1">&ldquo;{domain.subtitle}&rdquo;</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-white/10 space-x-6">{[{ id: "teachings", label: "Tattva Darśanam", icon: BookOpen }, { id: "practice", label: "Tattva Śravaṇam", icon: Compass }].map((tab) => { const Icon = tab.icon; return (<button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-3 text-sm font-mono tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === tab.id ? "border-gold-vintage text-gold-vintage" : "border-transparent text-slate-400 hover:text-white"}`}><Icon className="w-4 h-4" /><span>{tab.label}</span></button>); })}</div>
          <div className="py-4"><AnimatePresence mode="wait">
            {activeTab === "teachings" && (<motion.div key="teachings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6"><div className="prose prose-invert max-w-none space-y-4"><p className="text-slate-300 leading-relaxed font-sans text-base">{domain.description}</p></div><div className="p-6 rounded-xl border border-gold-vintage/15 bg-gold-vintage/[0.02] flex flex-col gap-2 relative"><div className="absolute top-3 left-4 text-6xl font-display text-gold-vintage/10 leading-none select-none">&ldquo;</div><p className="font-serif text-slate-200 italic text-base leading-relaxed pl-4 z-10">{domain.quote}</p>{domain.quoteAuthor && (<p className="text-right text-xs font-mono text-gold-vintage pr-4 z-10">— {domain.quoteAuthor}</p>)}</div></motion.div>)}
            {activeTab === "practice" && (<motion.div key="practice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6"><div className="p-6 rounded-2xl glass-panel-gold flex flex-col items-center justify-center p-8 text-center border-gold-vintage/30 relative overflow-hidden"><div className="absolute inset-0 bg-radial-gradient from-gold-vintage/5 to-transparent pointer-events-none" /><h3 className="font-display font-medium text-lg text-gold-vintage tracking-wider mb-2">{domain.practiceTitle || "Box Breathing Simulator"}</h3><div className="relative w-48 h-48 flex items-center justify-center mb-8"><motion.div animate={{ scale: !breathingActive ? 1 : breathPhase === "Inhale" ? 2.1 : breathPhase === "Hold (Full)" ? 2.1 : breathPhase === "Exhale" ? 1 : 1, opacity: !breathingActive ? 0.45 : breathPhase.startsWith("Hold") ? 0.95 : 0.7 }} transition={{ duration: 4, ease: "easeInOut" }} className="absolute w-20 h-20 rounded-full bg-radial-gradient from-gold-vintage/40 to-cosmic-purple/10 filter blur-xs border border-gold-bright shadow-2xl shadow-gold-vintage/20" /><div className="relative z-10 flex flex-col items-center"><span className="font-mono text-xs text-gold-vintage/70 uppercase tracking-widest">{breathingActive ? "ALIGN" : "READY"}</span><span className="font-display font-bold text-2xl text-white my-1">{breathingActive ? breathPhase : "Calm"}</span><span className="font-mono text-xl text-gold-vintage antialiased font-semibold">{breathingActive ? `${breathTimer}s` : "00"}</span></div><div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow pointer-events-none" /><div className="absolute -inset-1 border border-gold-vintage/10 rounded-full animate-pulse pointer-events-none transform rotate-45" /></div><div className="flex gap-4">{!breathingActive ? (<button onClick={() => setBreathingActive(true)} className="px-6 py-2 rounded-full bg-gold-vintage hover:bg-gold-bright text-black font-mono text-xs tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer"><Play className="w-3.5 h-3.5 fill-black" /><span>BEGIN PATH</span></button>) : (<button onClick={() => setBreathingActive(false)} className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer"><Square className="w-3.5 h-3.5 fill-white" /><span>HALT PRACTICE</span></button>)}</div></div><div className="space-y-4"><h4 className="text-xs font-mono uppercase text-gold-vintage tracking-widest">Instructions for alignment</h4><div className="space-y-3">{domain.practiceSteps?.map((step, idx) => (<div key={idx} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-3"><span className="font-mono text-xs text-gold-vintage/60 shrink-0 mt-0.5">0{idx + 1}.</span><p className="text-xs text-slate-300 font-sans leading-relaxed">{step}</p></div>))}</div></div></motion.div>)}
          </AnimatePresence></div>
        </div>
        <div className="space-y-6">
          <ProjectSpotlight domain={domain} />
                    {/* Portal Navigation */}
          {allDomains && allDomains.length > 0 && (() => {
            const currentIndex = allDomains.findIndex(d => d.id === domain.id);
            if (currentIndex === -1) return null;
            const prevDomain = allDomains[(currentIndex - 1 + allDomains.length) % allDomains.length];
            const nextDomain = allDomains[(currentIndex + 1) % allDomains.length];
            return (
              <div className="p-5 rounded-2xl glass-panel border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase text-gold-vintage tracking-widest pl-1">
                  Portal Navigation
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigateToDomain?.(prevDomain)}
                    className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-gold-vintage/[0.04] hover:border-gold-vintage/30 flex items-center justify-between text-left transition-all group cursor-pointer"
                  >
                    <div className="transform group-hover:-translate-x-1.5 transition-all text-slate-500 group-hover:text-gold-vintage">
                      ←
                    </div>
                    <div className="text-right">
                      <h5 className="font-display font-medium text-sm text-slate-200 group-hover:text-gold-vintage transition-colors">
                        Previous: {prevDomain.title}
                      </h5>
                    </div>
                  </button>
                  <button
                    onClick={() => onNavigateToDomain?.(nextDomain)}
                    className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-gold-vintage/[0.04] hover:border-gold-vintage/30 flex items-center justify-between text-left transition-all group cursor-pointer"
                  >
                    <div>
                      <h5 className="font-display font-medium text-sm text-slate-200 group-hover:text-gold-vintage transition-colors">
                        Next: {nextDomain.title}
                      </h5>
                    </div>
                    <div className="transform group-hover:translate-x-1.5 transition-all text-slate-500 group-hover:text-gold-vintage">
                      →
                    </div>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}