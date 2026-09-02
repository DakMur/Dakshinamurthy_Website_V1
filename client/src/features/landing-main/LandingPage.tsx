import { useEffect } from "react";
import { motion } from "motion/react";
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import shankaracharyaImg from "../../assets/shankaracharya.webp";
import jyothyLogo from "../../assets/jyothy_logo.webp";
import sringeriLogo from "../../assets/sringeri_logo.webp";
import vedantaBharatiLogo from "../../assets/vedanta_bharati_logo (2).png";
import paramLogo from "../../assets/Param_logo.webp";
import techClubLogo from "../../assets/tclogo.png";
import mastryhubLogo from "../../assets/mastryhub_logo.png";
import LandingTechnologyLayer from "./LandingTechnologyLayer";
import "./LandingPage.css";

interface LandingPageProps {
  isWarping: boolean;
  triggerWarpSpeed: () => void;
}

function HoistLetters({
  text,
  letterClassName,
  nowrap = false,
}: {
  text: string;
  letterClassName: string;
  nowrap?: boolean;
}) {
  const words = text.split(" ");
  let letterCursor = 0;

  return (
    <span
      className={`hero-hoist${nowrap ? " hero-hoist-nowrap" : ""}`}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="hero-hoist-word">
          {Array.from(word).map((ch, letterIndex) => {
            const i = letterCursor;
            letterCursor += 1;
            return (
              <span
                key={`${ch}-${letterIndex}`}
                className={`hero-hoist-letter ${letterClassName}`}
                style={{ ["--i" as string]: i }}
                aria-hidden="true"
              >
                {ch}
              </span>
            );
          })}
          {wordIndex < words.length - 1 ? (
            <span className="hero-hoist-space" aria-hidden="true">
              {"\u00A0"}
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

/**
 * Landing page component architecture matching Target Reference (Image 2).
 * Shallow top logo layer integrated inside single hero container,
 * positioned directly above the central hero content.
 */
export default function LandingPage({ isWarping, triggerWarpSpeed }: LandingPageProps) {
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
      <div
        className="w-full relative select-none z-10 pointer-events-auto shrink-0 pt-14 sm:pt-3 md:pt-4"
      >
        {/* Desktop / Tablet Layout: 6-Column Grid — single-line labels, full width */}
        <div className="hidden sm:grid grid-cols-6 w-full pl-14 sm:pl-16 md:pl-20 pr-12 sm:pr-14 md:pr-16 gap-x-1 sm:gap-x-2 md:gap-x-3 items-start">
          {/* 1. Param */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[8.5px] sm:text-[10px] md:text-[11.5px] font-mono font-medium tracking-[0.05em] sm:tracking-[0.1em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              TECHNICAL COLLABORATOR
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={paramLogo}
                className="h-7 sm:h-9 md:h-11 max-w-full object-contain"
                alt="Param Technical Collaborator"
                width={938}
                height={222}
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>

          {/* 2. Tech Club */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[8.5px] sm:text-[10px] md:text-[11.5px] font-mono font-medium tracking-[0.05em] sm:tracking-[0.1em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              TECH CLUB
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={techClubLogo}
                className="h-14 sm:h-17 md:h-20 max-w-full object-contain"
                alt="Tech Club"
                width={640}
                height={445}
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>

          {/* 3. Jyothy */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[8.5px] sm:text-[10px] md:text-[11.5px] font-mono font-medium tracking-[0.05em] sm:tracking-[0.1em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              JYOTHY INSTITUTE OF TECHNOLOGY
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={jyothyLogo}
                className="h-[74px] sm:h-[92px] md:h-[110px] max-w-full object-contain"
                style={{ clipPath: "ellipse(50% 38% at 50% 50%)" }}
                alt="Jyothy Institute of Technology"
                width={1080}
                height={1080}
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>

          {/* 4. Sringeri */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[8.5px] sm:text-[10px] md:text-[11.5px] font-mono font-medium tracking-[0.05em] sm:tracking-[0.1em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              SRINGERI SHARADA PEETHAM
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={sringeriLogo}
                className="h-14 sm:h-17 md:h-20 max-w-full object-contain"
                alt="Sringeri"
                width={400}
                height={400}
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>

          {/* 5. MastryHub */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[8.5px] sm:text-[10px] md:text-[11.5px] font-mono font-medium tracking-[0.05em] sm:tracking-[0.1em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              POWERED BY
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={mastryhubLogo}
                className="h-7 sm:h-9 md:h-11 max-w-full object-contain"
                alt="MastryHub"
                width={780}
                height={194}
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>

          {/* 6. Vedanta Bharati */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[8.5px] sm:text-[10px] md:text-[11.5px] font-mono font-medium tracking-[0.05em] sm:tracking-[0.1em] text-gold-vintage uppercase mb-1.5 whitespace-nowrap">
              SUPPORTED BY
            </span>
            <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
              <img
                src={vedantaBharatiLogo}
                className="h-8 sm:h-10 md:h-12 max-w-full object-contain"
                alt="Vedanta Bharati"
                width={350}
                height={134}
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout: Responsive Single 6-Column Horizontal Row */}
        <div className="sm:hidden grid grid-cols-6 w-full px-1 pt-1 pb-1 gap-0.5 items-start">
          {/* 1. Param */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[4.5px] font-mono tracking-[0.02em] text-gold-vintage uppercase mb-1 leading-[1.1] block">
              TECHNICAL<br />COLLABORATOR
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={paramLogo} className="h-[16px] max-w-full object-contain" alt="Param Technical Collaborator" width={938} height={222} decoding="async" fetchPriority="low" />
            </div>
          </div>

          {/* 2. Tech Club */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[4.5px] font-mono tracking-[0.02em] text-gold-vintage uppercase mb-1 leading-[1.1] block">
              TECH<br />CLUB
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={techClubLogo} className="h-[20px] max-w-full object-contain" alt="Tech Club" width={640} height={445} decoding="async" fetchPriority="low" />
            </div>
          </div>

          {/* 3. Jyothy */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[4.5px] font-mono tracking-[0.02em] text-gold-vintage uppercase mb-1 leading-[1.1] block">
              JYOTHY<br />INSTITUTE
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={jyothyLogo} className="h-[23px] max-w-full object-contain" style={{ clipPath: "ellipse(50% 38% at 50% 50%)" }} alt="Jyothy Institute of Technology" width={1080} height={1080} decoding="async" fetchPriority="low" />
            </div>
          </div>

          {/* 4. Sringeri */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[4.5px] font-mono tracking-[0.02em] text-gold-vintage uppercase mb-1 leading-[1.1] block">
              SRINGERI<br />PEETHAM
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={sringeriLogo} className="h-[20px] max-w-full object-contain" alt="Sringeri" width={400} height={400} decoding="async" fetchPriority="low" />
            </div>
          </div>

          {/* 5. MastryHub */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[4.5px] font-mono tracking-[0.02em] text-gold-vintage uppercase mb-1 leading-[1.1] block">
              POWERED<br />BY
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={mastryhubLogo} className="h-[16px] max-w-full object-contain" alt="MastryHub" width={780} height={194} decoding="async" fetchPriority="low" />
            </div>
          </div>

          {/* 6. Vedanta Bharati */}
          <div className="flex flex-col items-center justify-start text-center">
            <span className="text-[4.5px] font-mono tracking-[0.02em] text-gold-vintage uppercase mb-1 leading-[1.1] block">
              SUPPORTED<br />BY
            </span>
            <div className="h-7 flex items-center justify-center">
              <img src={vedantaBharatiLogo} className="h-[18px] max-w-full object-contain" alt="Vedanta Bharati" width={350} height={134} decoding="async" fetchPriority="low" />
            </div>
          </div>
        </div>
      </div>

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
              width={194}
              height={259}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[center_38%] scale-[1.12] filter grayscale-[5%] sepia-[10%] brightness-[92%] contrast-[105%] transition-all duration-700"
            />
          </div>
        </motion.div>

        {/* Main Title Stack — Connected upward closer to figure */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col items-center justify-center max-w-4xl mx-auto -mt-6 sm:-mt-8 md:-mt-11"
        >
          {/* Main Title */}
          <h1 className="font-serif font-normal sm:font-medium text-[clamp(34px,4.2vw,60px)] text-white tracking-[0.03em] leading-[1.06] text-center">
            <HoistLetters
              text="Dakshinaasya Darshini"
              letterClassName="hero-hoist-title italic antialiased"
            />
          </h1>

          {/* National Level with Quote-Card Glass Material Tightly Fitted */}
          <div className="mt-1.5 sm:mt-2 flex items-center justify-center gap-2.5 sm:gap-3.5 select-none">
            {/* Left Gold Accent Line */}
            <div className="h-[1.5px] w-7 sm:w-12 bg-gradient-to-r from-transparent via-[#F7CA45] to-[#FFF5D0] rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]"></div>

            {/* Tightly Fitted Glass Frame using Quote-Card Material */}
            <div className="hero-hoist-badge-wrap px-3.5 py-1 sm:px-4 sm:py-1 rounded-lg bg-black/40 backdrop-blur-md border border-gold-vintage/30 flex items-center justify-center">
              <HoistLetters
                text="NATIONAL LEVEL"
                nowrap
                letterClassName="hero-hoist-badge font-serif font-bold text-[12px] sm:text-[13.5px] md:text-[14.5px] tracking-[0.26em] sm:tracking-[0.32em] uppercase antialiased"
              />
            </div>

            {/* Right Gold Accent Line */}
            <div className="h-[1.5px] w-7 sm:w-12 bg-gradient-to-l from-transparent via-[#F7CA45] to-[#FFF5D0] rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]"></div>
          </div>

          {/* Vedanta Makeathon Secondary Title */}
          <div className="mt-1.5 sm:mt-2 font-serif font-medium sm:font-semibold text-[clamp(20px,2.8vw,40px)] tracking-[0.05em] leading-[1.12] uppercase text-center">
            <HoistLetters
              text="VEDANTA MAKEATHON"
              nowrap
              letterClassName="hero-hoist-makeathon italic antialiased"
            />
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
          className="pt-1.5 sm:pt-4 relative z-30 pointer-events-auto flex flex-col items-center mt-3"
        >
          <div className="inline-flex flex-col items-stretch gap-[52px]">
          <button
            type="button"
            onClick={triggerWarpSpeed}
            disabled={isWarping}
            className="explore-cta group relative w-full px-8 py-2.5 md:py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:cursor-wait"
          >
            <span className="explore-cta-sheen" aria-hidden="true" />
            <span className="explore-cta-bottom" aria-hidden="true" />

            <span className="explore-cta-label relative text-xs md:text-sm tracking-widest font-mono font-medium uppercase">
              {isWarping ? "Exploring..." : "Explore"}
            </span>

            <ArrowRight className="explore-cta-arrow w-4 h-4 relative" />
          </button>

          {/* Solid Gold REGISTER NOW CTA */}
          <a
            className="inline-flex items-center justify-center gap-2 px-8 py-2.5 md:py-3 rounded-full bg-[#d4af37] hover:bg-amber-300 text-neutral-950 font-bold text-xs md:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.55)] hover:shadow-[0_0_20px_6px_rgba(212,175,55,0.75),0_0_55px_18px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
            href="https://mastryhub.com/event/vedanta-makeathon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>REGISTER NOW</span>
            <svg className="w-4 h-4 stroke-neutral-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
