import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Headphones, AlertCircle } from "lucide-react";

interface TattvaAudioPlayerProps {
  audioSrc?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function TattvaAudioPlayer({
  audioSrc,
  title,
  subtitle,
  className = ""
}: TattvaAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset states when audio source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
    setIsLoading(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [audioSrc]);

  // Sync volume changes to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio event listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setHasError(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsPlaying(false);
    setIsLoading(false);
  };

  const togglePlay = useCallback(async () => {
    if (!audioRef.current || hasError || !audioSrc) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.warn("Audio playback interrupted or failed:", err);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [isPlaying, hasError, audioSrc]);

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        togglePlay();
      }
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioSrc) {
    return null;
  }

  return (
    <div
      className={`relative p-5 md:p-6 rounded-2xl glass-panel-gold border border-gold-vintage/30 shadow-xl overflow-hidden ${className}`}
    >
      {/* Background radial gold glow */}
      <div className="absolute inset-0 bg-radial-gradient from-gold-vintage/5 via-transparent to-transparent pointer-events-none" />

      {/* Hidden native HTML5 audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
      />

      {/* Player Header */}
      <div className="relative z-10 flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-vintage/10 border border-gold-vintage/30 flex items-center justify-center text-gold-vintage shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.15)]">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold-vintage/70 flex items-center gap-1.5">
              <span>Śravaṇa Dhvani</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-vintage/60 animate-pulse" />
            </div>
            <h4 className="font-display font-medium text-sm md:text-base text-white tracking-wide">
              {title ? `${title} — Audio Contemplation` : "Sacred Tattva Audio"}
            </h4>
          </div>
        </div>

        {subtitle && (
          <span className="hidden sm:inline-block text-xs font-serif italic text-slate-400 max-w-[200px] truncate text-right">
            &ldquo;{subtitle}&rdquo;
          </span>
        )}
      </div>

      {/* Error state alert */}
      {hasError ? (
        <div className="relative z-10 p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center gap-3 text-red-200 text-xs font-sans">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>Audio recording is preparing for launch. Place {audioSrc.replace("/audio/", "")} in audio assets.</span>
        </div>
      ) : (
        <div className="relative z-10 space-y-3">
          {/* Progress / Seek Slider */}
          <div className="space-y-1.5">
            <div className="relative flex items-center group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                disabled={duration === 0}
                aria-label="Seek audio time"
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none disabled:cursor-not-allowed accent-gold-vintage [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-vintage [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(212,175,55,0.8)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
                style={{
                  background: `linear-gradient(to right, #d4af37 ${progressPercent}%, rgba(255, 255, 255, 0.1) ${progressPercent}%)`
                }}
              />
            </div>

            {/* Time Stamps */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-gold-vintage/80">{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            {/* Left Controls: Restart */}
            <button
              onClick={handleRestart}
              aria-label="Restart audio from beginning"
              title="Restart from beginning"
              className="p-2 rounded-lg text-slate-400 hover:text-gold-vintage hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Center: Main Play / Pause Action Button */}
            <button
              onClick={togglePlay}
              disabled={hasError}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
              className="px-6 py-2 rounded-full bg-gold-vintage hover:bg-gold-bright text-black font-mono text-xs tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-black" />
                  <span>PAUSE CHANT</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                  <span>{isLoading ? "LOADING..." : "LISTEN TO TATTVA"}</span>
                </>
              )}
            </button>

            {/* Right: Volume & Mute Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                title={isMuted ? "Unmute" : "Mute"}
                className="p-2 rounded-lg text-slate-400 hover:text-gold-vintage hover:bg-white/5 transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Audio volume"
                className="w-14 sm:w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none accent-gold-vintage [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-vintage"
                style={{
                  background: `linear-gradient(to right, #d4af37 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.1) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
