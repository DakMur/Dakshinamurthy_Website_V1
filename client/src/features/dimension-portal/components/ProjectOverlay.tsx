import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Atom, BookOpen, Sparkles, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TattvaProject } from "../../../data/tattvaProjects";
import YoutubePlayer from "./YoutubePlayer";

interface ProjectOverlayProps {
  project: TattvaProject | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Premium glassmorphic fullscreen overlay modal rendering the YouTube
 * demonstration and education contents. Uses React Portals to render at body root,
 * escaping transformed parent stacking contexts.
 */
export default function ProjectOverlay({
  project,
  isOpen,
  onClose
}: ProjectOverlayProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Manage focus, body scroll lock, parent scroll lock, and ESC key listener
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Disable scrolling behind the modal (on document.body)
      document.body.style.overflow = "hidden";

      // Disable scrolling on parent expanded modal container (fixed inset with overflow-y-auto)
      const parentModal = document.querySelector(".fixed.overflow-y-auto") as HTMLElement;
      if (parentModal) {
        parentModal.style.overflowY = "hidden";
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // Focus modal container for screen readers / keyboard controls
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        // Restore scrolling on close
        document.body.style.overflow = "";
        if (parentModal) {
          parentModal.style.overflowY = "auto";
        }
        window.removeEventListener("keydown", handleKeyDown);
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;
  if (!project) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-overlay-title"
        >
          {/* Backdrop: Fades from 0 to 1, darkens background (rgba(0,0,0,0.75)), applies 18px blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-[18px] cursor-pointer"
          />

          {/* Centered Modal: Fades, scales 0.95 -> 1, floats above page */}
          {/* Style dimensions: 70vw width, 80vh height, max-width 1200px, max-height 900px, bg rgba(15,15,18,0.65), rounded corners 24px */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
            style={{
              backgroundColor: "rgba(15, 15, 18, 0.65)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)"
            }}
            className="relative w-full md:w-[70vw] max-w-[1200px] h-[80vh] max-h-[900px] flex flex-col rounded-[24px] border border-gold-vintage/18 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-10 focus:outline-none"
          >
            {/* Modal Header Row: Left-aligned title, right-aligned close X button */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold-vintage animate-pulse" />
                <h3
                  id="project-overlay-title"
                  className="font-display font-semibold text-xs md:text-sm text-gold-vintage tracking-widest uppercase"
                >
                  Scientific Demonstration
                </h3>
              </div>

              {/* Close Button: Circular Glass layout, scaling 1.05, slight rotation, soft gold glow */}
              <button
                onClick={onClose}
                aria-label="Close project overlay"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-vintage/10 border border-white/10 hover:border-gold-vintage/30 flex items-center justify-center text-slate-400 hover:text-gold-vintage transition-all duration-300 hover:rotate-6 hover:scale-105 hover:shadow-[0_0_12px_rgba(212,175,55,0.45)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Body: only the modal body scrolls when content exceeds overlay height */}
            <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
              {/* Project Title and Subtitle */}
              <div className="space-y-2">
                <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-wide leading-tight">
                  {project.projectTitle}
                </h2>
                <p className="font-serif italic text-slate-300 text-sm md:text-base max-w-4xl leading-relaxed pl-1">
                  &ldquo;{project.subtitle}&rdquo;
                </p>
              </div>

              {/* Embedded YouTube Player (lazy-loaded iframe inside) */}
              <div className="w-full">
                <YoutubePlayer
                  videoId={project.videoId}
                  title={project.projectTitle}
                />
              </div>

              {/* Educational Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 pb-8">
                {/* 1. PROJECT OVERVIEW */}
                <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 hover:border-gold-vintage/15 transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-gold-vintage">
                    <BookOpen className="w-4.5 h-4.5" />
                    <h4 className="font-mono text-[11px] uppercase tracking-widest font-semibold">
                      Project Overview
                    </h4>
                  </div>
                  <p className="text-slate-300 text-sm font-sans leading-relaxed">
                    {project.projectOverview}
                  </p>
                </div>

                {/* 2. CONNECTION TO THIS TATTVA */}
                <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 hover:border-gold-vintage/15 transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-gold-vintage">
                    <Sparkles className="w-4.5 h-4.5" />
                    <h4 className="font-mono text-[11px] uppercase tracking-widest font-semibold">
                      Connection to this Tattva
                    </h4>
                  </div>
                  <p className="text-slate-300 text-sm font-sans leading-relaxed">
                    {project.tattvaConnection}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
