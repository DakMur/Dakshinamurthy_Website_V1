import { motion, useScroll, useTransform } from "motion/react";
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import shankaracharyaImg from "../../assets/shankaracharya.webp";
import jyothyLogo from "../../assets/jyothy_logo.jpg";
import sringeriLogo from "../../assets/sringeri_logo.jpg";
import vedantaBharatiLogo from "../../assets/vedanta_bharati_logo (2).png";
import paramLogo from "../../assets/Param_logo.webp";

interface LandingPageProps {
  isWarping: boolean;
  triggerWarpSpeed: () => void;
}

/**
 * Landing page component architecture matching Target Reference (Image 2).
 * Shallow top logo layer integrated inside single hero container,
 * positioned directly above the central hero content.
 */
export default function LandingPage({ isWarping, triggerWarpSpeed }: LandingPageProps) {
  const { scrollY } = useScroll();
  const logoOpacity = useTransform(scrollY, [0, 200], [1, 0.4]);
  const logoTranslateY = useTransform(scrollY, [0, 200], [0, -12]);

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full relative flex flex-col items-center min-h-[75vh]"
    >
      {/* 1. FULL-WIDTH INSTITUTIONAL LOGO LAYER */}
      <motion.div
        style={{ opacity: logoOpacity, y: logoTranslateY }}
        className="w-full relative select-none z-10 pointer-events-auto"
      >
        {/* Desktop / Tablet Layout: Responsive 4-Column Grid bounded by container */}
        <div className="hidden sm:grid grid-cols-4 w-full h-22 md:h-26 items-start">
          {/* Param — Far Left */}
          <div className="relative top-[-15px] flex flex-col items-center justify-start text-center">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              TECHNICAL COLLABORATOR
            </span>
            <div className="h-11 sm:h-13 md:h-16 flex items-center justify-center">
              <img
                src={paramLogo}
                className="h-7 sm:h-9 md:h-12 object-contain"
                alt="Param Technical Collaborator"
              />
            </div>
          </div>

          {/* Jyothy — Inner Left */}
          <div className="relative top-[-27px] flex flex-col items-center justify-start text-center">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              JYOTHY INSTITUTE OF TECHNOLOGY
            </span>
            <div className="h-14 sm:h-19 md:h-25 flex items-center justify-center">
              <img
                src={jyothyLogo}
                className="h-14 sm:h-19 md:h-25 object-contain"
                style={{ clipPath: "ellipse(50% 38% at 50% 50%)" }}
                alt="Jyothy Institute of Technology"
              />
            </div>
          </div>

          {/* Sringeri — Inner Right */}
          <div className="relative top-[-27px] flex flex-col items-center justify-start text-center">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              SRINGERI SHARADA PEETHAM
            </span>
            <div className="h-12 sm:h-16 md:h-21 flex items-center justify-center">
              <img
                src={sringeriLogo}
                className="h-12 sm:h-16 md:h-20 object-contain"
                style={{ clipPath: "circle(50% at 50% 50%)" }}
                alt="Sringeri"
              />
            </div>
          </div>

          {/* Vedanta Bharati — Far Right */}
          <div className="relative top-[-15px] flex flex-col items-center justify-start text-center">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              SUPPORTED BY
            </span>
            <div className="h-11 sm:h-13 md:h-16 flex items-center justify-center">
              <img
                src={vedantaBharatiLogo}
                className="h-8 sm:h-11 md:h-14 object-contain"
                alt="Vedanta Bharati"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout: Responsive 2x2 Grid */}
        <div className="sm:hidden grid grid-cols-2 gap-3 w-full px-4 pt-2 pb-1">
          <div className="flex flex-col items-start justify-center">
            <span className="text-[8px] font-mono tracking-[0.2em] text-gold-vintage uppercase mb-0.5 whitespace-nowrap">
              TECHNICAL COLLABORATOR
            </span>
            <img src={paramLogo} className="h-6 object-contain" alt="Param Technical Collaborator" />
          </div>
          <div className="flex flex-col items-end justify-center">
            <span className="text-[8px] font-mono tracking-[0.2em] text-gold-vintage uppercase mb-0.5 whitespace-nowrap">
              JYOTHY INSTITUTE OF TECHNOLOGY
            </span>
            <img src={jyothyLogo} className="h-9 object-contain" style={{ clipPath: "ellipse(50% 38% at 50% 50%)" }} alt="Jyothy Institute of Technology" />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="text-[8px] font-mono tracking-[0.2em] text-gold-vintage uppercase mb-0.5 whitespace-nowrap">
              SRINGERI SHARADA PEETHAM
            </span>
            <img src={sringeriLogo} className="h-9 object-contain" style={{ clipPath: "circle(50% at 50% 50%)" }} alt="Sringeri" />
          </div>
          <div className="flex flex-col items-end justify-center">
            <span className="text-[8px] font-mono tracking-[0.2em] text-gold-vintage uppercase mb-0.5 whitespace-nowrap">
              SUPPORTED BY
            </span>
            <img src={vedantaBharatiLogo} className="h-10 object-contain" alt="Vedanta Bharati" />
          </div>
        </div>
      </motion.div>

      {/* 2. CENTERED HERO CONTENT (Constrained by max-w-7xl) */}
      <div className="text-center space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto pt-0 pb-12 relative flex flex-col justify-center items-center">
        {/* Floating Right-Bottom Text (Desktop/Tablet only) */}
        <div className="hidden sm:flex fixed right-10 bottom-10 pointer-events-none select-none z-20">
          <div className="text-right">
            <div className="text-xs font-serif italic text-gold-vintage tracking-wider">Tat Tvam Asi</div>
          </div>
        </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Accent Line decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4 flex items-center justify-center gap-4 text-xs font-mono"
        >
          <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-gold-vintage"></div>
          <span className="text-[10px] tracking-[0.55em] uppercase text-gold-vintage">VEDANTA AND SCIENCE</span>
          <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-gold-vintage"></div>
        </motion.div>

        {/* Main Heading layout */}
        {/* Centered, respectful portrait image container of Sree Adi Shankaracharya */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -6, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut"
            },
            opacity: {
              duration: 1,
              delay: 0.3
            },
            scale: {
              duration: 1,
              delay: 0.3
            }
          }}
          className="relative flex items-center justify-center mx-auto w-48 h-48 md:w-64 md:h-64 -mb-10 md:-mb-14 group z-20 pointer-events-none select-none"
        >
          {/* Ambient Glow matching existing cosmic background theme */}
          <div className="absolute inset-0 rounded-full bg-gold-vintage/10 blur-xl w-3/4 h-3/4 mx-auto animate-pulse pointer-events-none"></div>

          {/* Radially faded borderless container to blend all edges smoothly into the dark background */}
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              maskImage: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 65%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 65%)'
            }}
          >
            <img
              src={shankaracharyaImg}
              alt="Sree Adi Shankaracharya"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[center_38%] scale-[1.12] filter grayscale-[5%] sepia-[10%] brightness-[92%] contrast-[105%] transition-all duration-700"
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ filter: "blur(12px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-serif font-medium text-4xl md:text-7xl text-white tracking-[0.04em] leading-[1.1] max-w-3xl mx-auto pb-4"
        >
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-vintage to-gold-bright drop-shadow-2xl antialiased">
            Dakshinaasya Darshini
          </span>
        </motion.h2>

        {/* Subtitle description with rectangular glassmorphism border */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-sm md:text-base font-serif italic text-slate-300 max-w-2xl mx-auto leading-relaxed p-5 md:p-6 rounded-xl bg-black/40 backdrop-blur-md border border-gold-vintage/30 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          &ldquo;To Him who sees the universe mirroring within Himself like a city reflected in a glass, yet appearing outside as if by a dream; to Him who reveals the absolute Non-Dual Self upon awakening; salutations to that ultimate Guru, Sri Dakshinamurthy.&rdquo;
        </motion.p>
      </div>

      {/* Unique Tactile Cosmic Button (With pulse shadows and golden bottom limits) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="pt-6"
      >
        <button
          onClick={triggerWarpSpeed}
          disabled={isWarping}
          className="group relative px-12 py-5 bg-white/[0.03] hover:bg-gold-vintage/10 backdrop-blur-xl border border-gold-vintage/35 rounded-full overflow-hidden transition-all duration-500 hover:border-gold-vintage hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center gap-3.5 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold-vintage/10 via-transparent to-gold-vintage/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <span className="relative text-[10.5px] tracking-[0.45em] font-mono font-medium text-white group-hover:text-gold-vintage uppercase transition-colors">
            {isWarping ? "Exploring..." : "Explore"}
          </span>

          <ArrowRight className="w-4 h-4 text-gold-vintage transform group-hover:translate-x-2 transition-transform relative" />

          {/* Neon bottom accent line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-[1.5px] bg-gold-vintage shadow-[0_0_12px_#D4AF37] group-hover:w-4/5 transition-all duration-500"></div>
        </button>
      </motion.div>

      {/* Bottom Decorative Footer Status limits (Desktop only) */}
      <div className="hidden lg:flex fixed bottom-6 left-10 right-10 justify-between items-center z-20 pointer-events-none select-none font-mono">
        <span className="text-[8px] tracking-[0.4em] uppercase text-white/30">© Sri Shankara Parampara</span>
      </div>
      </div>
    </motion.div>
  );
}
