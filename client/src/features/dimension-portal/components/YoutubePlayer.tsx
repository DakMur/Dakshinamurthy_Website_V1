import { useState, useEffect } from "react";

interface YoutubePlayerProps {
  videoId: string;
  title: string;
}

/**
 * Handles lazy loading of the YouTube iframe, loading state,
 * and automatic fallback for video thumbnails.
 */
export default function YoutubePlayer({ videoId, title }: YoutubePlayerProps) {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState(
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  );

  // Reset states when videoId changes
  useEffect(() => {
    setIsIframeLoaded(false);
    setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
  }, [videoId]);

  const handleThumbnailLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // YouTube returns a 120x90 placeholder when maxresdefault is not available
    if (img.naturalWidth === 120) {
      setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    }
  };

  const handleThumbnailError = () => {
    setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl">
      {/* Thumbnail cover displayed until iframe loads */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none ${
          isIframeLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={thumbnailSrc}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        {/* Subtle loading spinner overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/20 border-t-gold-vintage animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-200 drop-shadow-md">
              Loading Demonstration...
            </span>
          </div>
        </div>
      </div>

      {/* Primary hidden image loader to detect resolution availability */}
      <img
        src={thumbnailSrc}
        alt=""
        onLoad={handleThumbnailLoad}
        onError={handleThumbnailError}
        loading="lazy"
        decoding="async"
        className="hidden"
      />

      {/* Lazy-loaded iframe */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsIframeLoaded(true)}
        className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-500 ${
          isIframeLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
