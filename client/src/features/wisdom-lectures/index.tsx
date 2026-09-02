import { useState, useEffect } from "react";
import Heart from 'lucide-react/dist/esm/icons/heart';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import Clock from 'lucide-react/dist/esm/icons/clock';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import { motion, AnimatePresence } from "motion/react";
import { Article, Comment } from "../../types/types";
import { FALLBACK_ARTICLES } from "../../hooks/useDatabase";

const DRIVE_THEMES_PDF_URL = "https://drive.google.com/file/d/1SgJnWgoZxUY3RvzcZsU-uS1UrfyvDeUe/preview";

interface StorytellingSectionProps {
  articles: Article[];
  onLike: (articleId: string) => void;
  onExploreDomain: (slug: string) => void;
}

export default function WisdomLectures({ articles, onLike, onExploreDomain }: StorytellingSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Filter out any "Upcoming Event" items so the section is completely removed
  const safeArticles = (articles && articles.length > 0 ? articles : FALLBACK_ARTICLES).filter(
    (a) => a.id !== "whats-next" && a.tag !== "UPCOMING EVENT" && a.domainSlug !== "upcoming-events"
  );

  const hasWhySection = safeArticles.some(
    (article) =>
      article.id === "a4" ||
      article.id === "why-are-we-doing-this" ||
      (article.title && article.title.toLowerCase().includes("why are we doing this"))
  );

  const renderThemesCard = () => (
    <motion.div
      key="themes-section-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-4xl mx-auto w-full"
    >
      <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-gold-vintage/25 transition-all flex flex-col">
        {/* Compact Heading / Tag */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-gold-vintage uppercase tracking-widest">
          <FileText className="w-3.5 h-3.5 text-gold-vintage" />
          <span>MAKEATHON THEMES</span>
        </div>

        {/* Title */}
        <h3 className="font-display font-medium text-2xl md:text-3.5xl text-slate-100 tracking-wider leading-snug uppercase">
          THEMES
        </h3>

        <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto" />

        {/* Direct Embedded Google Drive PDF Viewer */}
        <div className="w-full h-[500px] sm:h-[600px] md:h-[680px] rounded-xl overflow-hidden border border-white/10 bg-[#0e0e12] mt-2">
          <iframe
            src={DRIVE_THEMES_PDF_URL}
            title="Vedanta Makeathon Themes"
            loading="lazy"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-20 md:space-y-24 pt-6 pb-2">
      {safeArticles.map((article, idx) => {
        const isLeftImage = idx % 2 === 0;

        /* ── Special layout: "Why are we doing this?" — no image, premium glass card ── */
        const isWhySection = article.id === "a4" || article.id === "why-are-we-doing-this" || (article.title && article.title.toLowerCase().includes("why are we doing this"));
        if (isWhySection) {
          return (
            <div key={article.id} className="space-y-20 md:space-y-24">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl mx-auto w-full"
              >
                <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 space-y-5 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-gold-vintage/25 transition-all">
                  {/* Tag */}
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-gold-vintage uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 text-gold-vintage" />
                    <span>{article.tag || article.headerLabel || "WHY DO THIS?"}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-medium text-2xl md:text-3.5xl text-slate-100 tracking-wider leading-snug uppercase">
                    {article.title}
                  </h3>

                  {/* Subtitle */}
                  <h4 className="font-serif italic text-base md:text-lg text-gold-vintage/90">
                    {article.subtitle}
                  </h4>

                  <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto" />

                  {/* Excerpt (clamped to 3 lines with ellipsis, full content in modal) */}
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto line-clamp-3">
                    {article.excerpt || article.content}
                  </p>

                  {/* Step Inside button */}
                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setSelectedArticle(article);
                        fetch(`/api/v1/articles/${article.id}/view`, { method: "POST" });
                      }}
                      className="px-7 py-3 rounded-full border border-gold-vintage/35 hover:border-gold-bright bg-gold-vintage/5 hover:bg-gold-vintage/15 text-xs font-mono font-semibold tracking-widest text-gold-vintage hover:text-gold-bright transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                      {article.buttonText || article.actionText || "Step Inside"}
                    </button>
                  </div>
                </div>
              </motion.div>

              {renderThemesCard()}
            </div>
          );
        }

        return (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
          >
            {/* Image Columns (Alternating layout) */}
            <div className={`col-span-1 lg:col-span-6 ${isLeftImage ? "" : "lg:order-2"}`}>
              {article.id === "a3" ? (
                <ArticleImageSlideshow
                  images={EXHIBITION_IMAGES}
                  altPrefix="The 3-Day Exhibition"
                />
              ) : article.id === "a2" ? (
                <ArticleImageSlideshow
                  images={DAAKSHINAASYA_IMAGES}
                  altPrefix="What is Daakshinaasya Darshini"
                />
              ) : (
                <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl h-[300px] md:h-[400px]">
                  {/* Aurora nebula lighting inside frame */}
                  <div className="absolute inset-0 bg-[#050505]/25 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full filter brightness-85 transition-transform duration-[1.2s] ease-out ${
                      article.id === "a1" ? "object-contain bg-black/40" : "object-cover group-hover:scale-105"
                    }`}
                  />

                  {/* Golden/Purple ambient glow ring behind */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold-vintage/30 transition-all duration-700 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Content columns */}
            <div className={`col-span-1 lg:col-span-6 text-left ${isLeftImage ? "" : "lg:order-1"}`}>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-mono text-gold-vintage tracking-wider">
                  {article.id === "a1" ? (
                    <span>BEGIN HERE</span>
                  ) : article.id === "a2" ? (
                    <span>SEEK WISDOM</span>
                  ) : article.id === "a3" ? (
                    <span>3-DAY MAKEATHON</span>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-mono text-gold-400 uppercase tracking-widest mb-2">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{article.category || article.tag}</span>
                    </div>
                  )}
                </div>

                <div className="w-12 h-[1px] bg-gold-vintage/40" />

                <h3 className="font-display font-medium text-2xl md:text-3.5xl text-slate-100 tracking-wider leading-snug">
                  {article.title}
                </h3>

                <h4 className="font-serif italic text-base text-slate-300">
                  {article.subtitle}
                </h4>

                <p className="text-sm text-slate-400 leading-relaxed font-sans line-clamp-3">
                  {article.excerpt || article.content}
                </p>

                {/* Inline Action block */}
                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedArticle(article);
                      // Record page-view statistics
                      fetch(`/api/v1/articles/${article.id}/view`, { method: "POST" });
                    }}
                    className="px-6 py-2.5 rounded-full border border-gold-vintage/35 hover:border-gold-bright bg-gold-vintage/5 hover:bg-gold-vintage/10 text-xs font-mono font-semibold tracking-widest text-gold-vintage transition-all cursor-pointer"
                  >
                    {article.buttonText || article.actionText || "READ LECTURE"}
                  </button>

                  {!article.hideMeta && (
                    <button
                      onClick={() => onExploreDomain(article.domainSlug)}
                      className="flex items-center gap-1.5 text-xs font-mono hover:text-gold-vintage text-slate-400 transition-colors uppercase cursor-pointer"
                    >
                      <span>Domain Dimension</span>
                      <span className="text-sm font-sans">→</span>
                    </button>
                  )}

                  {!article.hideMeta && (
                    <div className="ml-auto flex items-center gap-4 text-xs text-slate-500 mr-2">
                      <button
                        onClick={() => onLike(article.id)}
                        className="flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer group"
                      >
                        <Heart className="w-4 h-4 group-hover:scale-125 transition-transform" />
                        <span>{article.likes || 0}</span>
                      </button>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{article.views || 0} views</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Fallback if safeArticles did not contain why-are-we-doing-this */}
      {!hasWhySection && renderThemesCard()}

      {/* Structured Reading Modal Layer */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/95">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-3xl rounded-2xl glass-panel border border-white/10 p-6 md:p-8 flex flex-col max-h-[85vh] overflow-y-auto space-y-6 scrollbar"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono text-gold-vintage tracking-widest uppercase">
                  {selectedArticle.category || selectedArticle.tag || "Wisdom Lecture"}
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-slate-400 hover:text-white transition-colors text-sm font-mono cursor-pointer"
                >
                  ✕ CLOSE
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-display font-medium text-3xl text-white">
                  {selectedArticle.title}
                </h3>
                <h4 className="font-serif italic text-lg text-gold-vintage">
                  {selectedArticle.subtitle}
                </h4>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-sans space-y-4">
                {selectedArticle.paragraphs ? (
                  selectedArticle.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-300">
                      {p}
                    </p>
                  ))
                ) : (
                  (selectedArticle.content || "").split("\n\n").map((p, idx) => (
                    <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-300">
                      {p}
                    </p>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const EXHIBITION_IMAGES = [
  "/3dayexhibition/image1.webp",
  "/3dayexhibition/image2.webp",
  "/3dayexhibition/image3.webp",
  "/3dayexhibition/image4.webp",
  "/3dayexhibition/image5.webp",
  "/3dayexhibition/image6.webp",
  "/3dayexhibition/image7.webp",
  "/3dayexhibition/image8.webp",
  "/3dayexhibition/image9.webp",
  "/3dayexhibition/image10.webp",
  "/3dayexhibition/image11.webp",
];

const DAAKSHINAASYA_IMAGES = [
  "/What%20is%20Daakshinaasya/image1.webp",
  "/What%20is%20Daakshinaasya/image3.webp",
  "/What%20is%20Daakshinaasya/image4.webp",
  "/What%20is%20Daakshinaasya/image5.webp",
  "/What%20is%20Daakshinaasya/image6.webp",
];

interface ArticleImageSlideshowProps {
  images: string[];
  altPrefix: string;
}

function ArticleImageSlideshow({ images, altPrefix }: ArticleImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const totalImages = images.length;

  // Auto-advance slideshow every 4.5 seconds; pause on hover
  useEffect(() => {
    if (isHovered || totalImages <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, totalImages]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group overflow-hidden rounded-2xl h-[300px] md:h-[400px] w-full bg-black flex items-center justify-center shadow-2xl border border-white/10"
    >
      {/* Aurora nebula lighting inside frame */}
      <div className="absolute inset-0 bg-[#050505]/25 z-10 pointer-events-none" />

      {/* Slider Image Container with Cinematic Fade Transition */}
      <div className="w-full h-full relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${altPrefix} Image ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter brightness-85"
          />
        </AnimatePresence>
      </div>

      {/* Visual blending vignette and edge masks to melt into the dark page background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.65)_0%,transparent_10%,transparent_90%,rgba(0,0,0,0.65)_100%)] z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.65)_0%,transparent_10%,transparent_90%,rgba(0,0,0,0.65)_100%)] z-20 pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] z-20 pointer-events-none" />

      {/* Minimal Navigation Arrows (Subtle, visible on hover) */}
      <button
        onClick={prevSlide}
        className="absolute left-3 z-30 p-2 rounded-full bg-black/50 hover:bg-gold-vintage/20 border border-white/10 text-white hover:text-gold-vintage transition-all cursor-pointer opacity-0 group-hover:opacity-80 hover:!opacity-100"
        aria-label={`Previous ${altPrefix} image`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 z-30 p-2 rounded-full bg-black/50 hover:bg-gold-vintage/20 border border-white/10 text-white hover:text-gold-vintage transition-all cursor-pointer opacity-0 group-hover:opacity-80 hover:!opacity-100"
        aria-label={`Next ${altPrefix} image`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots / Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === index
                ? "bg-gold-vintage w-3.5 h-1.5 shadow-[0_0_6px_rgba(212,175,55,0.8)]"
                : "bg-white/30 hover:bg-white/60 w-1.5 h-1.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Golden ambient glow ring */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold-vintage/30 transition-all duration-700 pointer-events-none z-10" />
    </div>
  );
}
