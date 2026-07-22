import { useRef, useCallback, MouseEvent, memo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Eye from 'lucide-react/dist/esm/icons/eye';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import Sun from 'lucide-react/dist/esm/icons/sun';
import Lightbulb from 'lucide-react/dist/esm/icons/lightbulb';
import Atom from 'lucide-react/dist/esm/icons/atom';
import Heart from 'lucide-react/dist/esm/icons/heart';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Compass from 'lucide-react/dist/esm/icons/compass';
import { LucideIcon } from 'lucide-react';
import { DomainContent } from "../../../types/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Eye,
  Sprout,
  Sun,
  Lightbulb,
  Atom,
  Heart,
  BookOpen,
  Globe,
  Compass,
};

interface DomainCardProps {
  domain: DomainContent;
  onExplore: (domain: DomainContent) => void;
  className?: string;
}

// Spring config: snappy, zero-lag tracking with graceful settle
const SPRING_CONFIG = { stiffness: 400, damping: 25 };

const DomainCard = memo(function DomainCard({ domain, onExplore, className = "" }: DomainCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // ── useMotionValue avoids setState → no React re-render on every mouse pixel ──
  const rawX = useMotionValue(0); // normalized [-0.5, 0.5]
  const rawY = useMotionValue(0);

  // Springs produce smooth, physics-based animation without fighting CSS transitions
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), SPRING_CONFIG);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), SPRING_CONFIG);

  // Dynamic Lucide icon lookup safely
  const IconComponent = ICON_MAP[domain.icon] || Compass;

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Normalize mouse position to [-0.5, 0.5] range relative to card center
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    // Write directly to MotionValues — zero React re-renders
    rawX.set(nx);
    rawY.set(ny);

    // CSS custom properties for spotlight gradient — also zero re-renders
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    // Springs animate back to resting position automatically
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const handleClick = useCallback(() => onExplore(domain), [onExplore, domain]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        // GPU-composited 3D tilt — driven by MotionValues, never triggers React renders
        rotateX,
        rotateY,
        transformPerspective: 1000,
        scale: 1,
        // Layer-promotion hint: active at all times so GPU doesn't repaint on hover entry
        willChange: "transform",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { type: "spring", stiffness: 400, damping: 25 } }}
      className={`spotlight-card group relative overflow-hidden rounded-2xl border border-white/[0.08] hover:border-gold-vintage/40 bg-[#08080a]/90 p-6 flex flex-col justify-between min-h-[360px] cursor-pointer shadow-xl transition-colors duration-500 hover:shadow-gold-vintage/5 ${className}`}
    >
      {/* Decorative aurora reflection inside */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Top Banner: Spiritual Icon & Animated Glyph */}
      <div className="flex items-start justify-between z-10">
        <div className="relative w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5">
          <div className="absolute inset-0 rounded-xl bg-gold-vintage/5 border border-gold-vintage/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <IconComponent className="relative z-10 w-6 h-6 text-slate-300 group-hover:text-gold-vintage transition-colors duration-500" />
        </div>
        <div className="text-[10px] font-mono text-slate-500 group-hover:text-gold-vintage/60 transition-colors duration-500 uppercase tracking-widest">
          {domain.energyIndicator || "Aligned"}
        </div>
      </div>

      {/* Center Group: Title & Mystical Subtitle */}
      <div className="my-6 z-10 flex-grow flex flex-col justify-end">
        <div className="w-8 h-[1px] bg-slate-700 group-hover:bg-gold-vintage/50 mb-3 transition-colors duration-500" />
        <h3 className="font-display font-medium text-lg text-slate-200 tracking-wider group-hover:text-gold-vintage transition-colors duration-500">
          {domain.title}
        </h3>
        <p className="text-xs font-serif italic text-slate-400 group-hover:text-white/80 mt-1 transition-colors duration-500">
          {domain.subtitle}
        </p>
      </div>

      {/* Bottom Row: Description & Explore Button */}
      <div className="z-10 mt-auto pt-4 border-t border-white/[0.05] flex flex-col gap-3">
        <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
          {domain.summary}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors duration-500">
            Tattva Darśana
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-gold-vintage opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
            <span>Explore</span>
            <span className="text-sm font-sans">→</span>
          </div>
        </div>
      </div>

      {/* Outer Glow Overlay */}
      <div className="absolute inset-0 rounded-2xl border border-gold-vintage/20 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
});

export default DomainCard;
