import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import shankaracharyaImg from "../../assets/shankaracharya.webp";
import jyothyLogo from "../../assets/jyothy_logo.jpg";
import sringeriLogo from "../../assets/sringeri_logo.jpg";
import vedantaBharatiLogo from "../../assets/vedanta_bharati_logo.jpg";

interface LandingPageProps {
  isWarping: boolean;
  triggerWarpSpeed: () => void;
}

/**
 * Landing page JSX extracted from the monolithic App.tsx.
 * This component renders the hero section of the cosmic landing experience.
 */
export default function LandingPage({ isWarping, triggerWarpSpeed }: LandingPageProps) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center space-y-8 max-w-4xl mx-auto py-12 relative flex flex-col justify-center items-center min-h-[75vh]"
    >
      {/* Institutional Logos (Independent viewport positioning) */}
      <div className="fixed top-6 left-4 md:left-[70px] z-30 pointer-events-none select-none">
        <img 
          src={jyothyLogo} 
          className="h-14 sm:h-18 md:h-24 object-contain pointer-events-auto" 
          style={{ clipPath: "ellipse(50% 38% at 50% 50%)" }}
          alt="Jyothy Institute of Technology" 
        />
      </div>

      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
        <img 
          src={sringeriLogo} 
          className="h-12 sm:h-15 md:h-19 object-contain pointer-events-auto" 
          style={{ clipPath: "circle(50% at 50% 50%)" }}
          alt="Sringeri" 
        />
      </div>

      <div className="fixed top-6 right-4 md:right-[70px] z-30 pointer-events-none select-none">
        <img 
          src={vedantaBharatiLogo} 
          className="h-10 sm:h-13 md:h-17 object-contain pointer-events-auto" 
          alt="Vedanta Bharati" 
        />
      </div>
      {/* Floating Right-Bottom Text (Desktop/Tablet only) */}
      <div className="hidden sm:flex fixed right-10 bottom-10 pointer-events-none select-none z-20">
        <div className="text-right">
          <div className="text-xs font-serif italic text-gold-vintage tracking-wider">Tat Tvam Asi</div>
        </div>
      </div>

      {/* Ambient backdrop glow filter */}
      <div className="absolute inset-0 bg-[#050505]/20 backdrop-blur-xs rounded-3xl -z-10" />

      <div className="space-y-6">
        {/* Accent Line decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4 flex items-center justify-center gap-4 text-xs font-mono"
        >
          <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-gold-vintage"></div>
          <span className="text-[10px] tracking-[0.55em] uppercase text-gold-vintage">ADVAITA VEDANTA</span>
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

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-sm md:text-base font-serif italic text-slate-300 max-w-2xl mx-auto leading-relaxed"
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
    </motion.div>
  );
}
