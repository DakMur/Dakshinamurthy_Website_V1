import { motion } from "motion/react";
import DomainCard from "./components/DomainCard";
import { DomainContent } from "../../types/types";

interface PortalPageProps {
  domains: DomainContent[];
  onSelectDomain: (domain: DomainContent) => void;
}

/**
 * PAGE 3: DOMAINS HUB (PORTALS)
 * Displays the 12 domain gateway cards in a responsive grid layout.
 * Extracted from App.tsx for modularity.
 */
export default function PortalPage({ domains, onSelectDomain }: PortalPageProps) {
  return (
    <motion.div
      key="domains"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12 text-center py-6"
    >
      <div className="space-y-2 max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase text-gold-vintage tracking-widest block">
          The 12 gateways of consciousness
        </span>
        <h2 className="font-display font-medium text-3xl md:text-5xl tracking-widest text-slate-100 uppercase">
          Tattva Darśana
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans mt-2">
          Hover and step inside the portals to coordinate custom meditation practices, Hermetic scriptures, and atomic science calibrations.
        </p>
        <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto mt-4" />
      </div>

      {/* Spotlight Cards Grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 select-none">
        {domains.map((dom, index) => {
          const gridClass = index === 8 ? "md:col-start-2" : "";
          return (
            <DomainCard
              key={dom.id}
              domain={dom}
              onExplore={(d) => onSelectDomain(d)}
              className={gridClass}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
