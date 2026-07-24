import { useState, useEffect, useRef } from "react";
import Play from 'lucide-react/dist/esm/icons/play';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import { DomainContent } from "../../../types/types";
import { getProjectsForDomain, TattvaProject } from "../../../data/tattvaProjects";
import ProjectOverlay from "./ProjectOverlay";

interface ProjectSpotlightProps {
  domain: DomainContent;
}

export default function ProjectSpotlight({ domain }: ProjectSpotlightProps) {
  const projects = getProjectsForDomain(domain);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState("");
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const prevOverlayOpen = useRef(isOverlayOpen);

  // Reset current index when domain changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsOverlayOpen(false);
  }, [domain]);

  const currentProject: TattvaProject | undefined = projects[currentIndex];

  // Set thumbnail image URL with fallback detection
  useEffect(() => {
    if (currentProject) {
      setThumbnailSrc(`https://img.youtube.com/vi/${currentProject.videoId}/maxresdefault.jpg`);
    }
  }, [currentProject]);

  // Return focus to Explore Project button when overlay closes
  useEffect(() => {
    if (prevOverlayOpen.current && !isOverlayOpen) {
      exploreButtonRef.current?.focus();
    }
    prevOverlayOpen.current = isOverlayOpen;
  }, [isOverlayOpen]);

  const handleThumbnailLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth === 120 && currentProject) {
      setThumbnailSrc(`https://img.youtube.com/vi/${currentProject.videoId}/hqdefault.jpg`);
    }
  };

  const handleThumbnailError = () => {
    if (currentProject) {
      setThumbnailSrc(`https://img.youtube.com/vi/${currentProject.videoId}/hqdefault.jpg`);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // If no projects, render clean "Coming Soon" empty state
  if (projects.length === 0 || !currentProject) {
    return (
      <div className="p-6 rounded-2xl glass-panel border-white/10 space-y-4 min-h-[300px] flex flex-col justify-between">
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase text-gold-vintage tracking-widest pl-1">
            SCIENTIFIC DEMONSTRATION
          </h4>
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-gold-vintage/20 bg-gold-vintage/5 flex items-center justify-center text-gold-vintage/60 mb-2">
              🧪
            </div>
            <h5 className="font-display font-medium text-base text-slate-300">
              Coming Soon
            </h5>
            <p className="font-sans text-xs text-slate-400 max-w-xs leading-relaxed">
              Scientific demonstrations for this Tattva are currently under preparation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const SHOW_DETAILS = false;

  return (
    <div className={`p-5 rounded-2xl glass-panel border-white/10 flex flex-col justify-between ${SHOW_DETAILS ? 'min-h-[380px]' : ''} relative overflow-hidden group`}>
      {/* Header row with capitalized section title & navigation triggers if multiple projects exist */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h4 className="text-xs font-mono uppercase text-gold-vintage tracking-widest pl-1">
          SCIENTIFIC DEMONSTRATION
        </h4>
        {projects.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous project"
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-gold-vintage/20 border border-white/5 hover:border-gold-vintage/50 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next project"
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-gold-vintage/20 border border-white/5 hover:border-gold-vintage/50 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main card body with aspect-video clickable thumbnail */}
      <div className="space-y-4 flex-1 flex flex-col justify-start">
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="relative w-full aspect-video rounded-xl overflow-hidden border border-gold-vintage/20 hover:border-gold-vintage/60 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] group/thumb cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-gold-vintage"
          aria-label={`Open video demonstration for ${currentProject.projectTitle}`}
        >
          {/* Thumbnail image with subtle zoom and glow on hover */}
          <img
            src={thumbnailSrc || undefined}
            alt={currentProject.projectTitle}
            onLoad={handleThumbnailLoad}
            onError={handleThumbnailError}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter brightness-75 group-hover/thumb:scale-105 transition-transform duration-500"
          />

          {/* Golden glass overlay hover effect */}
          <div className="absolute inset-0 bg-gold-vintage/5 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Centered glassmorphic Play Button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 group-hover/thumb:border-gold-vintage/50 group-hover/thumb:bg-gold-vintage/10 group-hover/thumb:scale-110 flex items-center justify-center text-white group-hover/thumb:text-gold-vintage transition-all duration-300 shadow-lg">
              <Play className="w-5 h-5 md:w-6 md:h-6 fill-current translate-x-0.5" />
            </div>
          </div>

          {/* Preloader */}
          <img
            src={`https://img.youtube.com/vi/${currentProject.videoId}/maxresdefault.jpg`}
            alt=""
            onLoad={handleThumbnailLoad}
            onError={handleThumbnailError}
            loading="lazy"
            decoding="async"
            className="hidden"
          />
        </button>

        {/* Project detail texts */}
        {SHOW_DETAILS && (
          <div className="space-y-1.5 px-1 py-1">
            <h5 className="font-display font-semibold text-base text-slate-100 group-hover:text-gold-vintage transition-colors line-clamp-1">
              {currentProject.projectTitle}
            </h5>
            <p className="font-sans text-xs text-slate-400 leading-relaxed line-clamp-2">
              {currentProject.subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Footer controls section containing carousel dots and CTA button */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto shrink-0">
        {/* Navigation Dot Indicators */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {projects.length > 1 ? (
            projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "bg-gold-vintage scale-110 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to project ${idx + 1}`}
              />
            ))
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gold-vintage/40" />
          )}
        </div>

        {/* Explore CTA action */}
        <button
          ref={exploreButtonRef}
          onClick={() => setIsOverlayOpen(true)}
          className="flex items-center gap-1 text-[11px] font-mono tracking-wider font-medium text-gold-vintage hover:text-gold-bright transition-colors uppercase cursor-pointer outline-none focus-visible:text-gold-bright"
        >
          <span>Explore Project</span>
          <ArrowRight className="w-3 h-3 translate-y-[-0.5px]" />
        </button>
      </div>

      {/* Overlay Modal */}
      <ProjectOverlay
        project={currentProject}
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
      />
    </div>
  );
}
