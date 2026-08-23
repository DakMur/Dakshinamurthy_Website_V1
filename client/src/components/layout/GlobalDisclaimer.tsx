import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';

export default function GlobalDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close disclaimer on click outside and escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed top-4 left-4 sm:top-5 sm:left-6 md:top-6 md:left-8 z-50 select-none">
      {/* Global Compact Warning Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center border shadow-lg ${
          isOpen
            ? "bg-[#09080e]/95 text-gold-vintage border-gold-vintage/50 shadow-[0_0_16px_rgba(212,175,55,0.25)]"
            : "bg-[#09080e]/80 hover:bg-[#09080e]/95 text-slate-300 hover:text-gold-vintage border-white/[0.08] hover:border-gold-vintage/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        }`}
        aria-label="Open disclaimer"
        title="Open disclaimer"
      >
        <AlertTriangle className={`w-5 h-5 transition-colors ${isOpen ? "text-gold-vintage" : "text-slate-200 hover:text-gold-vintage"}`} />
      </button>

      {/* Floating Compact Glass Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2.5 w-[calc(100vw-24px)] sm:w-[420px] max-w-[440px] bg-[#08070d]/95 backdrop-blur-2xl border border-gold-vintage/30 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_16px_rgba(212,175,55,0.1)] rounded-2xl p-4 sm:p-5 flex flex-col space-y-3 overflow-hidden"
          >
            {/* Header Title */}
            <div className="px-1 py-1 border-b border-white/[0.07] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border border-gold-vintage/50 flex items-center justify-center rotate-45 shrink-0">
                  <div className="w-1 h-1 bg-gold-vintage shadow-[0_0_4px_rgba(212,175,55,0.9)]" />
                </div>
                <span className="font-display font-medium text-[11.5px] sm:text-[12.5px] tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-gold-bright via-gold-vintage to-amber-200 antialiased">
                  A Note for the Curious — Disclaimer
                </span>
              </div>
            </div>

            {/* Disclaimer Text */}
            <div className="px-1 py-0.5 select-text">
              <p className="text-[12px] sm:text-[13px] leading-relaxed text-slate-300 font-sans tracking-normal text-left">
                The Vedanta Makeathon is not a religious event, and no prior knowledge of Sanskrit, Vedanta, or the Dakshinamurthy Stotram is required. The eight verses of the Dakshinamurthy Ashtakam contain methods of Self-inquiry founded on logic and direct experience, and are used respectfully as inspiration for creative technical projects. Every concept is explained in simple terms, and students from all backgrounds are welcome. Projects are evaluated on creativity and meaningful connection to the underlying ideas.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
