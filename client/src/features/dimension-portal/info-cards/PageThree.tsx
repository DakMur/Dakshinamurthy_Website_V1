import { useState } from "react";
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import Compass from 'lucide-react/dist/esm/icons/compass';
import { motion, AnimatePresence } from "motion/react";
import { DomainContent } from "../../../types/types";
import ProjectSpotlight from "../components/ProjectSpotlight";
import TattvaAudioPlayer from "../components/TattvaAudioPlayer";

interface InfoCardProps {
  domain: DomainContent;
  allDomains?: DomainContent[];
  onNavigateToDomain?: (domain: DomainContent) => void;
  onReturn?: () => void;
}

export default function PageThree({ domain, allDomains = [], onNavigateToDomain }: InfoCardProps) {
  const [activeTab, setActiveTab] = useState<"teachings" | "practice">("teachings");

  return (
    <>
      {/* 1. Hero Section Layout */}
      <div className="relative rounded-2xl overflow-hidden min-h-[300px] flex flex-col justify-end p-6 md:p-10 border border-white/10 mb-8 shadow-2xl">
        <div className="absolute inset-0">
          <img
            src={domain.image}
            alt={domain.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter brightness-45 scale-105"
          />
          {/* Dark glass overlays and energy rings */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="text-[10px] uppercase tracking-widest font-mono text-gold-vintage bg-gold-vintage/10 px-3 py-1 rounded-full w-max border border-gold-vintage/20 mb-3 ml-0.5">{domain.energyIndicator || "Tattva Level"}</div>
          <h1 className="font-display font-bold text-3xl md:text-5xl text-white tracking-widest uppercase mb-2">
            {domain.title}
          </h1>
          <p className="font-serif italic text-slate-300 text-lg md:text-xl max-w-2xl pl-1">
            &ldquo;{domain.subtitle}&rdquo;
          </p>
        </div>
      </div>

      {/* 2. Content Tabs & Dynamic Section panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Tab navigation bar */}
          <div className="flex border-b border-white/10 space-x-6">
            {[
              { id: "teachings", label: "Tattva Darśanam", icon: BookOpen },
              { id: "practice", label: "Tattva Śravaṇam", icon: Compass }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-sm font-mono tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "border-gold-vintage text-gold-vintage"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Panel contents */}
          <div className="py-4">
            <AnimatePresence mode="wait">
              {activeTab === "teachings" && (
                <motion.div
                  key="teachings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="prose prose-invert max-w-none space-y-4">
                    <p className="text-slate-300 leading-relaxed font-sans text-base">
                      {domain.description}
                    </p>
                  </div>

                  {/* Divine Quote Box */}
                  <div className="p-6 rounded-xl border border-gold-vintage/15 bg-gold-vintage/[0.02] flex flex-col gap-2 relative">
                    <div className="absolute top-3 left-4 text-6xl font-display text-gold-vintage/10 leading-none select-none">
                      &ldquo;
                    </div>
                    <p className="font-serif text-slate-200 italic text-base leading-relaxed pl-4 z-10">
                      {domain.quote}
                    </p>
                    {domain.quoteAuthor && (
                      <p className="text-right text-xs font-mono text-gold-vintage pr-4 z-10">
                        — {domain.quoteAuthor}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "practice" && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <TattvaAudioPlayer
                    audioSrc={domain.audioSrc}
                    title={domain.title}
                    subtitle={domain.subtitle}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right rail columns: Gallery & Portals */}
        <div className="space-y-6">
          {/* Scientific Demonstration Spotlight */}
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