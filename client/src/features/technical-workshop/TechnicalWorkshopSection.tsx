import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import X from 'lucide-react/dist/esm/icons/x';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import "./TechnicalWorkshopSection.css";

/* ─── Workshop Chapter Data ─────────────────────────────────────────────── */

interface WorkshopChapter {
  number: string;
  title: string;
  tagline: string;
  points: string[];
  closing: string;
}

const WORKSHOP_CHAPTERS: WorkshopChapter[] = [
  {
    number: "01",
    title: "Interactive AR / VR",
    tagline: "Create Experiences Beyond the Screen.",
    points: [
      "Explore the fundamentals of Augmented Reality and Virtual Reality.",
      "Understand how digital content can interact with physical spaces and real-world environments.",
      "Explore immersive experiences for learning, visualization, interaction, and creative installations.",
      "Understand how AR/VR can change the way people experience information and digital environments.",
      "Move from simply consuming digital experiences to creating interactive realities.",
    ],
    closing: "Explore virtual worlds. Build interactive realities.",
  },
  {
    number: "02",
    title: "Generative AI",
    tagline: "Reshaping Creativity with AI.",
    points: [
      "Explore how Generative AI can create and transform visual content.",
      "Experiment with AI-generated images, videos, concepts, and creative experiences.",
      "Understand how AI can become part of a modern creative workflow.",
      "Learn how ideas can be directed, refined, combined, and transformed using generative tools.",
      "Discover how AI can accelerate experimentation from idea → visual → refined creation.",
    ],
    closing: "Imagine it. Generate it. Create with it.",
  },
  {
    number: "03",
    title: "Brain-Computer Interface",
    tagline: "When Human Signals Become Control.",
    points: [
      "Explore the intersection of human biology, electronics, and intelligent machines.",
      "Understand the fundamentals of EEG and EOG-based sensing.",
      "Explore how biological signals can be captured and converted into control inputs.",
      "Discover applications involving embedded systems and robotic control.",
      "Explore possibilities such as hands-free interaction, assistive technologies, emotion-aware systems, human-machine interaction, and experimental robotic interfaces.",
    ],
    closing: "Sense the signal. Interpret it. Make machines respond.",
  },
  {
    number: "04",
    title: "Robotics & IoT",
    tagline: "Build Systems That Can Sense and Act.",
    points: [
      "Explore the combination of robotics, IoT, AI, and autonomous systems.",
      "Understand the role of sensors and embedded systems.",
      "Explore autonomous feedback control.",
      "Discover how robotic vision helps machines perceive their environment.",
      "Understand how AI can connect perception with decision-making and action.",
      "Explore the foundations of systems that can sense, think, respond, and act.",
    ],
    closing: "Sense. Think. Act. Build.",
  },
  {
    number: "05",
    title: "Param Open Blocks",
    tagline: "Build Functionality Block by Block.",
    points: [
      "Explore a modular approach to IoT and hardware experimentation.",
      "Understand how different building blocks can be combined to create desired input-output functionality.",
      "Experiment with modules, sensors, connections, and system behaviour.",
      "Explore how complex systems can emerge from simple reusable components.",
      "Learn how modular systems can make technology easier to assemble, modify, experiment with, and reimagine.",
    ],
    closing: "Connect. Experiment. Create.",
  },
];

/* ─── Gallery images (all 12 from public/gallery/) ──────────────────────── */

const GALLERY_IMAGES = [
  "/gallery/p1.jpg",
  "/gallery/p2.webp",
  "/gallery/p3.jpg",
  "/gallery/p4.webp",
  "/gallery/p5.jpeg",
  "/gallery/p6.jpeg",
  "/gallery/p7.jpeg",
  "/gallery/p8.jpeg",
  "/gallery/p9.jpeg",
  "/gallery/p10.jpeg",
  "/gallery/p11.jpeg",
  "/gallery/p12.jpeg",
];

/* ─── Chapter Modal Component ───────────────────────────────────────────── */

function ChapterModal({
  chapter,
  onClose,
}: {
  chapter: WorkshopChapter;
  onClose: () => void;
}) {
  // Pause Lenis smooth scrolling while modal is open (same pattern as DomainExpandedModal)
  useEffect(() => {
    const lenis = (window as any).lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 w-screen h-screen bg-black/92 backdrop-blur-xl overflow-y-auto overscroll-contain flex items-start justify-center p-4 md:p-12"
      style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
      onClick={onClose}
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06),transparent_50%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative max-w-3xl w-full my-auto glass-panel-gold rounded-2xl p-6 md:p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-gold-vintage transition-colors cursor-pointer z-10"
          aria-label="Close chapter"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className="font-display font-medium text-2xl md:text-4xl tracking-wider text-white uppercase mb-2">
          {chapter.title}
        </h3>

        {/* Tagline */}
        <p className="text-sm md:text-base text-gold-vintage/80 italic mb-8 font-serif">
          {chapter.tagline}
        </p>

        {/* Divider */}
        <div className="w-12 h-[1px] bg-gold-vintage/30 mb-8" />

        {/* Content points */}
        <ul className="space-y-4 mb-10">
          {chapter.points.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-vintage/50 flex-shrink-0" />
              <span className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* Closing statement */}
        <div className="border-t border-white/[0.06] pt-6">
          <p className="font-display text-base md:text-lg text-gold-vintage tracking-wide italic text-center">
            {chapter.closing}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Workshop Chapter Card ─────────────────────────────────────────────── */

function ChapterCard({
  chapter,
  onClick,
}: {
  chapter: WorkshopChapter;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      className="group w-full h-full text-left glass-panel-gold rounded-xl p-5 md:p-6 cursor-pointer transition-all duration-300 hover:border-gold-vintage/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] flex flex-col"
    >
      <div className="flex items-start justify-between gap-4 flex-1">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-display font-medium text-lg md:text-xl tracking-wider text-white uppercase mb-1.5 group-hover:text-gold-vintage transition-colors duration-300">
            {chapter.title}
          </h3>

          {/* Tagline */}
          <p className="text-xs md:text-sm text-slate-400 italic font-serif leading-relaxed">
            {chapter.tagline}
          </p>
        </div>

        {/* Arrow indicator */}
        <div className="flex-shrink-0 mt-1 p-2 rounded-full border border-white/10 group-hover:border-gold-vintage/40 group-hover:bg-gold-vintage/10 transition-all duration-300">
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-gold-vintage transition-colors duration-300" />
        </div>
      </div>

      {/* Read Chapter indicator */}
      <div className="mt-4 pt-3 border-t border-white/[0.04]">
        <span className="font-mono text-[9px] tracking-[0.2em] text-slate-500 group-hover:text-gold-vintage/70 uppercase transition-colors duration-300">
          Explore →
        </span>
      </div>
    </motion.button>
  );
}

/* ─── Gallery Section ───────────────────────────────────────────────────── */

function GallerySection() {
  // Duplicate images for seamless infinite loop
  const doubledImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

  return (
    <div className="space-y-8 mt-10 md:mt-14">
      {/* Section header */}
      <div className="text-center space-y-2">
        <h2 className="font-display font-medium text-2xl md:text-4xl tracking-widest text-white uppercase">
          Gallery
        </h2>
        <div className="w-12 h-[1.5px] bg-gold-vintage/50 mx-auto mt-3" />
      </div>

      {/* Scrolling image strip */}
      <div className="tw-gallery-container">
        <div className="tw-gallery-track">
          {doubledImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Workshop gallery ${(i % GALLERY_IMAGES.length) + 1}`}
              loading="lazy"
              decoding="async"
              className="tw-gallery-img mx-2 md:mx-3 border border-white/[0.06] shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Param Foundation Section ──────────────────────────────────────────── */

function ParamFoundationSection() {
  return (
    <div className="space-y-8 md:space-y-10 mt-8 md:mt-12">
      {/* Transition heading — inside a subtle panel */}
      <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-6 md:p-8 text-center space-y-3">
        <span className="font-mono text-[11px] tracking-[0.3em] text-gold-vintage/70 uppercase block">
          Beyond the Workshop
        </span>
        <h2 className="font-display font-medium text-3xl md:text-5xl tracking-widest text-white uppercase">
          Param Foundation
        </h2>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans max-w-xl mx-auto">
          Where science, culture, technology and imagination meet.
        </p>
        <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto mt-2" />
      </div>

      {/* About intro — inside a subtle panel */}
      <div className="max-w-3xl mx-auto glass-panel rounded-xl p-5 md:p-7 text-center space-y-2">
        <h3 className="font-display text-xl md:text-2xl tracking-wider text-gold-vintage/90 uppercase">
          Reimagining Learning, Culture & Innovation
        </h3>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
          A Bengaluru-based ecosystem connecting science, history, culture, art, technology, and innovation — creating meaningful experiences that inspire curiosity and discovery.
        </p>
      </div>

      {/* Foundation sections — concise cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-4 md:gap-5 max-w-4xl mx-auto">
        {/* Science, Experienced */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between h-full">
          <div className="space-y-2.5">
            <h4 className="font-display text-lg md:text-xl tracking-wider text-white uppercase">
              Science, Experienced
            </h4>
            <p className="text-sm text-slate-400 italic font-serif">Science that moves beyond the textbook.</p>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Experiential science centres where science becomes something to see, touch, question, and explore through interactive exhibits, immersive galleries, demonstrations, and hands-on exploration.
            </p>
          </div>
          <p className="text-sm text-gold-vintage/70 italic font-display mt-4">Don't just learn science. Experience it.</p>
        </div>

        {/* A Culture of Making */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between h-full">
          <div className="space-y-2.5">
            <h4 className="font-display text-lg md:text-xl tracking-wider text-white uppercase">
              A Culture of Making
            </h4>
            <p className="text-sm text-slate-400 italic font-serif">Where ideas become things you can build.</p>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Param encourages a culture of making where students, creators, and innovators can turn ideas into real, working projects through hands-on experimentation and rapid prototyping. Its makerspaces bring together robotics, AI, AR/VR, IoT, electronics, and emerging technologies, creating an environment to build, test, learn, and improve.
            </p>
          </div>
          <p className="text-sm text-gold-vintage/70 italic font-display mt-4">Build. Test. Learn. Improve.</p>
        </div>

        {/* Where Disciplines Collide */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between h-full">
          <div className="space-y-2.5">
            <h4 className="font-display text-lg md:text-xl tracking-wider text-white uppercase">
              Where Disciplines Collide
            </h4>
            <p className="text-sm text-slate-400 italic font-serif">Science meets history, art, culture and technology.</p>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Bringing different disciplines together through experience centres, workshops, events, research, digital content, and innovation programs to create new ways of experiencing knowledge.
            </p>
          </div>
          <p className="text-sm text-gold-vintage/70 italic font-display mt-4">Different disciplines. One space for discovery.</p>
        </div>

        {/* ParSEC */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between h-full">
          <div className="space-y-2.5">
            <h4 className="font-display text-lg md:text-xl tracking-wider text-white uppercase">
              ParSEC
            </h4>
            <p className="text-sm text-slate-400 italic font-serif">Where science becomes participation.</p>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Interactive science experiences, immersive galleries, live demonstrations, workshops, makerspaces, and hands-on exploration. Visitors are encouraged to participate rather than simply observe.
            </p>
          </div>
          <p className="text-sm text-gold-vintage/70 italic font-display mt-4">Question. Explore. Experiment. Discover.</p>
        </div>
      </div>


      {/* Final CTA */}
      <div className="text-center space-y-2 pt-2 pb-4">
        <h3 className="font-display font-medium text-2xl md:text-3xl tracking-widest text-white uppercase">
          Come Curious.
        </h3>
        <p className="text-sm md:text-base text-slate-400 font-sans">
          Explore the workshops. Experience Param. Create what comes next.
        </p>
      </div>
    </div>
  );
}

/* ─── Main Section Export ────────────────────────────────────────────────── */

export default function TechnicalWorkshopSection() {
  const [selectedChapter, setSelectedChapter] = useState<WorkshopChapter | null>(null);

  const handleCloseModal = useCallback(() => setSelectedChapter(null), []);

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Section header */}
      <div className="space-y-2 max-w-3xl mx-auto text-center">
        <span className="font-mono text-xs uppercase text-gold-vintage tracking-widest block">
          Param Foundation
        </span>
        <h2 className="font-display font-medium text-4xl md:text-[3.5rem] tracking-widest text-[#ffffff] uppercase leading-tight">
          Technical Workshops
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-sans mt-3">
          Where emerging technology becomes something you can experience, experiment with, and build. Learn. Experiment. Build.
        </p>
        <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto mt-4" />
        <div className="glass-panel rounded-xl p-5 md:p-6 max-w-2xl mx-auto mt-5">
          <h3 className="font-display text-lg md:text-xl tracking-wider text-white uppercase mb-4 text-center">
            About the Workshops
          </h3>
          <ul className="text-left space-y-3 text-sm md:text-[0.94rem] text-slate-300 leading-relaxed font-sans">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-vintage/50 flex-shrink-0" />
            <span>Learn how to code interactive AR/VR graphics with various devices.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-vintage/50 flex-shrink-0" />
            <span>Explore Generative AI and its applications in generating images, videos, and more.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-vintage/50 flex-shrink-0" />
            <span>Discover Brain-Computer Interfaces using EEG/EOG-based embedded control, robotic systems, and emotion control and synthesis.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-vintage/50 flex-shrink-0" />
            <span>Explore Robotics and IoT through autonomous feedback control, robotic vision, and AI-powered IoT systems.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-vintage/50 flex-shrink-0" />
            <span>Experience Param Open Blocks — IoT building blocks designed to achieve diverse input-output functionalities, and unlock exciting opportunities at Param's Makerspace.</span>
          </li>
          </ul>
        </div>
      </div>

      {/* Param Makerspace card */}
      <div className="max-w-3xl mx-auto text-center space-y-3 glass-panel-gold rounded-xl p-6 md:p-8">
        <h4 className="font-display text-xl md:text-2xl tracking-wider text-white uppercase">
          Param Makerspace
        </h4>
        <p className="text-sm md:text-base text-gold-vintage/80 italic font-serif">Building ideas. Supporting innovation.</p>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
          During the <strong className="text-white">Makeathon</strong>, Param Makerspace will provide hands-on support to help participants <strong className="text-white">build, prototype, troubleshoot, and develop their projects</strong>.
        </p>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
          The Makerspace will also provide <strong className="text-white">live support throughout the hackathon</strong>, giving participants access to guidance, tools, and practical assistance as they turn their ideas into working prototypes.
        </p>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
          From experimentation to execution, the Makerspace helps bridge the gap between <strong className="text-white">an idea and a real project</strong>.
        </p>
        <div className="w-12 h-[1px] bg-gold-vintage/30 mx-auto my-3" />
        <p className="font-display text-base md:text-lg text-gold-vintage tracking-wide italic">
          Build. Experiment. Create.
        </p>
      </div>

      {/* Workshop philosophy — compact, inside a subtle panel */}
      <div className="max-w-2xl mx-auto text-center glass-panel rounded-xl p-5 md:p-6 space-y-2">
        <h3 className="font-display text-xl md:text-2xl tracking-wider text-white/90 uppercase">
          More Than a Workshop
        </h3>
        <p className="text-sm md:text-base text-gold-vintage/70 italic font-serif">
          Don't just learn about technology. Experience it.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
          Whether the interest is immersive technology, AI, human-machine interaction, robotics, or IoT — the objective remains the same: move from curiosity to experimentation.
        </p>
      </div>

      {/* Param Foundation (~60%) */}
      <ParamFoundationSection />

      {/* Gallery */}
      <GallerySection />

      {/* Chapter Detail Modal */}
      <AnimatePresence>
        {selectedChapter && (
          <ChapterModal chapter={selectedChapter} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
}
