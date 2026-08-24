import { useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import shankaracharyaImg from "../../assets/shankaracharya.webp";
import jyothyLogo from "../../assets/jyothy_logo.jpg";
import sringeriLogo from "../../assets/sringeri_logo.jpg";
import vedantaBharatiLogo from "../../assets/vedanta_bharati_logo (2).png";
import paramLogo from "../../assets/Param_logo.webp";
import techClubLogo from "../../assets/tclogo.png";
import LandingTechnologyLayer from "./LandingTechnologyLayer";
import "./LandingPage.css";

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

  // Toggle body class to hide the CosmicGalaxy gold decorative line-art
  // layer ONLY while the landing page is mounted. On unmount (after Explore
  // transition), the class is removed and the decorations reappear.
  useEffect(() => {
    document.body.classList.add('landing-active');
    return () => {
      document.body.classList.remove('landing-active');
    };
  }, []);

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="landing-page-root w-full h-[100svh] min-h-[100svh] relative flex flex-col items-center justify-start overflow-hidden"
    >
      {/* 0. REALISTIC TECHNOLOGY ECOSYSTEM LAYER */}
      <LandingTechnologyLayer />

      {/* 1. FULL-WIDTH INSTITUTIONAL LOGO LAYER */}
      <motion.div
        style={{ opacity: logoOpacity, y: logoTranslateY }}
        className="w-full relative select-none z-10 pointer-events-auto shrink-0 pt-14 sm:pt-3 md:pt-4"
      >
        {/* Desktop / Tablet Layout: 5-Column Grid — single-line labels, full width */}
        <div className="hidden sm:grid grid-cols-5 w-full pl-14 sm:pl-16 md:pl-20 pr-12 sm:pr-14 md:pr-16 gap-x-1 sm:gap-x-2 md:gap-x-3 items-start">
          {/* Param */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[9.5px] sm:text-[11px] md:text-[12.5px] font-mono font-medium tracking-[0.08em] sm:tracking-[0.12em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              TECHNICAL COLLABORATOR
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={paramLogo}
                className="h-7 sm:h-9 md:h-11 max-w-full object-contain"
                alt="Param Technical Collaborator"
              />
            </div>
          </div>

          {/* Jyothy */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[9.5px] sm:text-[11px] md:text-[12.5px] font-mono font-medium tracking-[0.08em] sm:tracking-[0.12em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              JYOTHY INSTITUTE OF TECHNOLOGY
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={jyothyLogo}
                className="h-16 sm:h-20 md:h-24 max-w-full object-contain"
                style={{ clipPath: "ellipse(50% 38% at 50% 50%)" }}
                alt="Jyothy Institute of Technology"
              />
            </div>
          </div>

          {/* Sringeri */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[9.5px] sm:text-[11px] md:text-[12.5px] font-mono font-medium tracking-[0.08em] sm:tracking-[0.12em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              SRINGERI SHARADA PEETHAM
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={sringeriLogo}
                className="h-14 sm:h-17 md:h-20 max-w-full object-contain"
                style={{ clipPath: "circle(50% at 50% 50%)" }}
                alt="Sringeri"
              />
            </div>
          </div>

          {/* Tech Club */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[9.5px] sm:text-[11px] md:text-[12.5px] font-mono font-medium tracking-[0.08em] sm:tracking-[0.12em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              TECH CLUB
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={techClubLogo}
                className="h-14 sm:h-17 md:h-20 max-w-full object-contain"
                alt="Tech Club"
              />
            </div>
          </div>

          {/* Vedanta Bharati */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[9.5px] sm:text-[11px] md:text-[12.5px] font-mono font-medium tracking-[0.08em] sm:tracking-[0.12em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              SUPPORTED BY
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={vedantaBharatiLogo}
                className="h-8 sm:h-10 md:h-12 max-w-full object-contain"
                alt="Vedanta Bharati"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout: Responsive Single 5-Column Horizontal Row */}
        <div className="sm:hidden grid grid-cols-5 w-full px-1 pt-1 pb-1 gap-0.5 items-start">
          {/* 1. Param */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[5.5px] font-mono tracking-[0.04em] text-gold-vintage uppercase mb-1 leading-[1.15] block">
              TECHNICAL<br />COLLABORATOR
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={paramLogo} className="h-[18px] max-w-full object-contain" alt="Param Technical Collaborator" />
            </div>
          </div>

          {/* 2. Jyothy */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[5.5px] font-mono tracking-[0.04em] text-gold-vintage uppercase mb-1 leading-[1.15] block">
              JYOTHY<br />INSTITUTE
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={jyothyLogo} className="h-[22px] max-w-full object-contain" style={{ clipPath: "ellipse(50% 38% at 50% 50%)" }} alt="Jyothy Institute of Technology" />
            </div>
          </div>

          {/* 3. Sringeri */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[5.5px] font-mono tracking-[0.04em] text-gold-vintage uppercase mb-1 leading-[1.15] block">
              SRINGERI<br />PEETHAM
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={sringeriLogo} className="h-[22px] max-w-full object-contain" style={{ clipPath: "circle(50% at 50% 50%)" }} alt="Sringeri" />
            </div>
          </div>

          {/* 4. Tech Club — NEW */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[5.5px] font-mono tracking-[0.04em] text-gold-vintage uppercase mb-1 leading-[1.15] block">
              TECH<br />CLUB
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={techClubLogo} className="h-[22px] max-w-full object-contain" alt="Tech Club" />
            </div>
          </div>

          {/* 5. Vedanta Bharati */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[5.5px] font-mono tracking-[0.04em] text-gold-vintage uppercase mb-1 leading-[1.15] block">
              SUPPORTED<br />BY
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={vedantaBharatiLogo} className="h-[20px] max-w-full object-contain" alt="Vedanta Bharati" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. CENTERED HERO CONTENT (Constrained by max-w-5xl) */}
      <div className="relative z-20 flex flex-col items-center justify-start text-center w-full max-w-5xl mx-auto px-4 pt-10 sm:pt-2 md:pt-2.5 space-y-1.5 sm:space-y-3 pb-4 sm:pb-0">
        {/* Floating Right-Bottom Text (Desktop/Tablet only) */}
        <div className="hidden sm:flex fixed right-8 bottom-8 pointer-events-none select-none z-20">
          <div className="text-right">
            <div className="text-xs font-serif italic text-gold-vintage tracking-wider">Tat Tvam Asi</div>
          </div>
        </div>

        {/* Accent Line decoration: VEDANTA AND SCIENCE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center justify-center gap-3 sm:gap-4 text-xs font-mono mb-0.5 sm:mb-1"
        >
          <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-gold-vintage"></div>
          <span className="text-[8.5px] sm:text-[9.5px] md:text-[10.5px] tracking-[0.35em] sm:tracking-[0.5em] uppercase text-gold-vintage whitespace-nowrap">
            VEDANTA AND SCIENCE
          </span>
          <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-gold-vintage"></div>
        </motion.div>

        {/* Centered portrait image container of Sree Adi Shankaracharya */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -5, 0],
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
          className="relative flex items-center justify-center mx-auto w-36 h-36 sm:w-44 sm:h-44 md:w-[195px] md:h-[195px] group z-20 pointer-events-none select-none"
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

        {/* Main Title Stack — Connected upward closer to figure */}
        <motion.div
          initial={{ filter: "blur(12px)", opacity: 0, y: 15 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col items-center justify-center max-w-4xl mx-auto -mt-6 sm:-mt-8 md:-mt-11"
        >
          {/* Main Title */}
          <h1 className="font-serif font-normal sm:font-medium text-[clamp(34px,4.2vw,60px)] text-white tracking-[0.03em] leading-[1.06] text-center">
            <span className="italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF8] via-[#E5C98A] to-[#C79C2E] drop-shadow-[0_2px_18px_rgba(212,175,55,0.30)] antialiased">
              Dakshinaasya Darshini
            </span>
          </h1>

          {/* National Level with Quote-Card Glass Material Tightly Fitted */}
          <div className="mt-1.5 sm:mt-2 flex items-center justify-center gap-2.5 sm:gap-3.5 select-none">
            {/* Left Gold Accent Line */}
            <div className="h-[1.5px] w-7 sm:w-12 bg-gradient-to-r from-transparent via-[#F7CA45] to-[#FFF5D0] rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]"></div>

            {/* Tightly Fitted Glass Frame using Quote-Card Material */}
            <div className="px-3.5 py-1 sm:px-4 sm:py-1 rounded-lg bg-black/40 backdrop-blur-md border border-gold-vintage/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <span className="font-serif font-bold text-[12px] sm:text-[13.5px] md:text-[14.5px] tracking-[0.26em] sm:tracking-[0.32em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF2] via-[#FEE58A] to-[#D4AF37] whitespace-nowrap antialiased">
                NATIONAL LEVEL
              </span>
            </div>

            {/* Right Gold Accent Line */}
            <div className="h-[1.5px] w-7 sm:w-12 bg-gradient-to-l from-transparent via-[#F7CA45] to-[#FFF5D0] rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]"></div>
          </div>

          {/* Vedanta Makeathon Secondary Title */}
          <div className="mt-1.5 sm:mt-2 font-serif font-medium sm:font-semibold text-[clamp(20px,2.8vw,40px)] tracking-[0.05em] leading-[1.12] uppercase text-center">
            <span className="italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#EFE8D8] to-[#D4B566] drop-shadow-[0_2px_14px_rgba(212,175,55,0.20)] antialiased">
              VEDANTA MAKEATHON
            </span>
          </div>
        </motion.div>

        {/* Mobile-Only Quote Glass Card to complete the mobile composition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="block sm:hidden text-[11.5px] font-serif italic text-slate-300 w-[calc(100vw-32px)] max-w-sm mx-auto leading-relaxed px-4 py-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-gold-vintage/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] my-1"
        >
          &ldquo;To Him who sees the universe mirroring within Himself like a city reflected in a glass, yet appearing outside as if by a dream; to Him who reveals the absolute Non-Dual Self upon awakening; salutations to that ultimate Guru, Sri Dakshinamurthy.&rdquo;
        </motion.p>

        {/* Unique Tactile Cosmic Button — Positioned naturally below Vedanta Makeathon / Quote */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="pt-1.5 sm:pt-4 relative z-30 pointer-events-auto"
        >
          <button
            onClick={triggerWarpSpeed}
            disabled={isWarping}
            className="group relative px-7 sm:px-10 py-2.5 sm:py-3.5 bg-white/[0.03] hover:bg-gold-vintage/10 backdrop-blur-xl border border-gold-vintage/35 rounded-full overflow-hidden transition-all duration-500 hover:border-gold-vintage hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center gap-2.5 sm:gap-3 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-vintage/10 via-transparent to-gold-vintage/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <span className="relative text-[9px] sm:text-[10px] tracking-[0.35em] sm:tracking-[0.4em] font-mono font-medium text-white group-hover:text-gold-vintage uppercase transition-colors">
              {isWarping ? "Exploring..." : "Explore"}
            </span>

            <ArrowRight className="w-3.5 h-3.5 text-gold-vintage transform group-hover:translate-x-1.5 transition-transform relative" />

            {/* Neon bottom accent line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-[1.5px] bg-gold-vintage shadow-[0_0_12px_#D4AF37] group-hover:w-4/5 transition-all duration-500"></div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
