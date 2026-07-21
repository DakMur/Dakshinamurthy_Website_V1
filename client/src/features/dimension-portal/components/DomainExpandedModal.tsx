import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { DomainContent } from "../../../types/types";
import { INFO_CARD_REGISTRY } from "../info-cards";

interface DomainExpandedModalProps {
  domain: DomainContent;
  allDomains: DomainContent[];
  onClose: () => void;
  onNavigateToDomain: (domain: DomainContent) => void;
  onOpenOracle: () => void;
}

/**
 * Master frame wrapper that manages the expanded domain view.
 * Delegates content rendering to the appropriate page component
 * via the INFO_CARD_REGISTRY slug-based lookup.
 * PageComponent is lazy-loaded; Suspense keeps the modal frame visible during load.
 */
export default function DomainExpandedModal({
  domain,
  allDomains,
  onClose,
  onNavigateToDomain,
  onOpenOracle
}: DomainExpandedModalProps) {
  // Resolve the lazy page component for the current domain slug
  // Falls back to first entry (meditation / PageOne) for unknown slugs
  const PageComponent = INFO_CARD_REGISTRY[domain.slug] ?? INFO_CARD_REGISTRY["meditation"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-[#050505]/98 overflow-y-auto"
    >
      {/* Immersive space nebula background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none" />

      <div className="min-h-screen w-full relative max-w-5xl mx-auto px-4 md:px-8 py-12 flex flex-col">
        {/* Closed Buttons and Top Action Header */}
        <div className="flex items-center justify-between mb-8 z-10 border-b border-white/5 pb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 hover:text-gold-vintage uppercase transition-colors shrink-0 cursor-pointer"
          >
            <span>← Return to Portals</span>
          </button>
          
          <button
            onClick={onOpenOracle}
            className="px-4 py-1.5 rounded-full border border-gold-vintage/30 hover:border-gold-bright bg-gold-vintage/5 hover:bg-gold-vintage/10 text-xs font-mono tracking-wider text-gold-vintage flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult Domain Oracle</span>
          </button>
        </div>

        {/* Delegated Page Content — lazy-loaded from registry, Suspense keeps frame stable */}
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
          </div>
        }>
          <PageComponent
            domain={domain}
            allDomains={allDomains}
            onNavigateToDomain={onNavigateToDomain}
            onReturn={onClose}
          />
        </Suspense>
      </div>
    </motion.div>
  );
}

