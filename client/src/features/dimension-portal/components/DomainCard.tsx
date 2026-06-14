import { useRef, useState, MouseEvent } from "react";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { DomainContent } from "../../../types/types";

interface DomainCardProps {
  domain: DomainContent;
  onExplore: (domain: DomainContent) => void;
  className?: string;
}

export default function DomainCard({ domain, onExplore, className = "" }: DomainCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic Lucide icon lookup safely
  const IconComponent = (LucideIcons as any)[domain.icon] || LucideIcons.Compass;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Mouse positions relative to element bound
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // Calculate 3D tilt percentages (-15 to 15 degrees max)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -((y - centerY) / centerY) * 12; // tilt on X based on Y
    const rotY = ((x - centerX) / centerX) * 12; // tilt on Y based on X
    setRotate({ x: rotX, y: rotY });

    // Set custom CSS variables for Tailwind spotlight gradient
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onExplore(domain)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      className={`spotlight-card group relative overflow-hidden rounded-2xl border border-white/[0.08] hover:border-gold-vintage/40 bg-[#0a0a0a]/75 backdrop-blur-md p-6 flex flex-col justify-between min-h-[360px] cursor-pointer shadow-xl transition-colors duration-500 hover:shadow-gold-vintage/5 ${className}`}
    >
      {/* Decorative aurora reflection inside */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Top Banner: Spiritual Icon & Animated Glyph */}
      <div className="flex items-start justify-between z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 group-hover:border-gold-vintage/30 group-hover:bg-gold-vintage/5 transition-all duration-500">
          <IconComponent className="w-6 h-6 text-slate-300 group-hover:text-gold-vintage transition-colors duration-500" />
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
      <div className="absolute inset-0 rounded-2xl border border-transparent pointer-events-none group-hover:border-gold-vintage/20 transition-all duration-500" />
    </motion.div>
  );
}
