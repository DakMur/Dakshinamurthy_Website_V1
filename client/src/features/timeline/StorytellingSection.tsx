import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Heart, MessageSquare, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Article, Comment } from "../../types/types";

interface StorytellingSectionProps {
  articles: Article[];
  onLike: (articleId: string) => void;
  onExploreDomain: (slug: string) => void;
}

export default function StorytellingSection({ articles, onLike, onExploreDomain }: StorytellingSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (selectedArticle) {
      fetch(`/api/v1/comments`)
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((c: Comment) => c.articleId === selectedArticle.id);
          setComments(filtered);
        })
        .catch((err) => console.error("Error loading comments:", err));
    }
  }, [selectedArticle]);

  const handleSubmitComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/v1/articles/${selectedArticle.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: authorName.trim() || "Universal Seeker",
          authorEmail: authorEmail.trim() || "seeker@cosmos.org",
          content: newComment.trim()
        })
      });
      if (res.ok) {
        const freshComment = await res.json();
        setComments((prev) => [...prev, freshComment]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  }, [selectedArticle, newComment, authorName, authorEmail]);

  // Memoized visible articles list — only recomputes when articles prop changes
  const visibleArticles = useMemo(
    () => articles.filter((a) => !a.hidden),
    [articles]
  );

  return (
    <div className="space-y-24 py-12">
      {visibleArticles.map((article, idx) => {
        const isLeftImage = idx % 2 === 0;
        return (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
          >
            <div className={`col-span-1 lg:col-span-6 ${isLeftImage ? "" : "lg:order-2"}`}>
              {article.images && article.images.length > 0 ? (
                <ArticleImageSlideshow images={article.images} />
              ) : (
                <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl h-[300px] md:h-[400px]">
                  <div className="absolute inset-0 bg-[#050505]/25 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={article.image}
                    alt={article.title}
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    decoding="async"
                    width={800}
                    height={400}
                    className={`w-full h-full filter brightness-85 transition-transform duration-[1.2s] ease-out ${article.id === "a1" ? "object-contain bg-black/40" : "object-cover group-hover:scale-105"
                      }`}
                  />
                  <div className="absolute inset-0 rounded-2xl border border-gold-vintage/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              )}
            </div>

            <div className={`col-span-1 lg:col-span-6 text-left ${isLeftImage ? "" : "lg:order-1"}`}>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-mono text-gold-vintage tracking-wider">
                  {article.headerLabel ? (
                    <span>{article.headerLabel}</span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                      </span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </>
                  )}
                </div>
                <div className="w-12 h-[1px] bg-gold-vintage/40" />
                <h3 className="font-display font-medium text-2xl md:text-3.5xl text-slate-100 tracking-wider leading-snug">
                  {article.title}
                </h3>
                <h4 className="font-serif italic text-base text-slate-300">{article.subtitle}</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-sans line-clamp-3">{article.content}</p>
                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedArticle(article);
                      fetch(`/api/v1/articles/${article.id}/view`, { method: "POST" });
                    }}
                    className="px-6 py-2.5 rounded-full border border-gold-vintage/35 hover:border-gold-bright bg-gold-vintage/5 hover:bg-gold-vintage/10 text-xs font-mono font-semibold tracking-widest text-gold-vintage transition-all cursor-pointer"
                  >
                    {article.actionText || "READ LECTURE"}
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

      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/95">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-3xl rounded-2xl glass-panel border border-white/10 p-6 md:p-8 flex flex-col max-h-[85vh] overflow-y-auto space-y-6 scrollbar"
            >
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display font-medium text-xl text-slate-100 tracking-wider">{selectedArticle.title}</h3>
                  {!selectedArticle.hideMeta && selectedArticle.author && (
                    <p className="text-xs text-gold-vintage font-mono tracking-widest mt-1">
                      BY {selectedArticle.author.toUpperCase()} • {selectedArticle.readTime}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 px-3 rounded-full hover:bg-white/5 text-xs text-slate-400 hover:text-white font-mono cursor-pointer border border-white/10"
                >
                  Close
                </button>
              </div>
              {selectedArticle.id === "a1" && selectedArticle.quote && (
                <div className="p-6 rounded-xl border border-gold-vintage/20 bg-gold-vintage/[0.02] text-center my-4 space-y-2">
                  <p className="font-serif text-lg text-gold-vintage font-semibold tracking-wide">{selectedArticle.quote}</p>
                  {selectedArticle.translation && (
                    <p className="font-serif italic text-sm text-slate-300">&ldquo;{selectedArticle.translation}&rdquo;</p>
                  )}
                </div>
              )}
              <div className="prose prose-invert max-w-none text-slate-300 space-y-4 font-serif italic md:not-italic leading-relaxed text-sm md:text-base">
                {selectedArticle.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {!selectedArticle.hideMeta && (
                <div className="border-t border-white/5 pt-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm tracking-widest uppercase text-gold-vintage">Darshini Echoes</h4>
                    <span className="text-xs font-mono text-slate-500">({comments.length} current echoes)</span>
                  </div>
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" placeholder="My spiritual alias..." value={authorName} onChange={(e) => setAuthorName(e.target.value)} required className="px-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 font-sans" />
                      <input type="email" placeholder="My celestial mailbox (optional)..." value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} className="px-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 font-sans" />
                    </div>
                    <textarea rows={3} placeholder="Contribute your vibration to this sacred teaching..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required className="w-full px-4 py-3 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-white focus:outline-none focus:border-gold-vintage/50 font-sans resize-none" />
                    <div className="flex justify-end">
                      <button type="submit" disabled={commentLoading || !newComment.trim()} className="px-6 py-2 rounded-full bg-gold-vintage hover:bg-gold-bright text-black font-mono text-xs tracking-wider transition-all cursor-pointer font-semibold">
                        {commentLoading ? "Transmitting..." : "Animate Comment"}
                      </button>
                    </div>
                  </form>
                  <div className="space-y-4 max-h-[250px] overflow-y-auto scrollbar select-none pr-1">
                    {comments.length === 0 ? (
                      <p className="text-xs text-slate-500 font-mono text-center py-4">Silence reigns here. Be the first to vibrate.</p>
                    ) : (
                      comments.map((c) => (
                        <div key={c.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs text-gold-vintage font-semibold">{c.authorName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans italic">{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ArticleImageSlideshowProps {
  images: string[];
}

const ArticleImageSlideshow = memo(function ArticleImageSlideshow({ images }: ArticleImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;
  const nextSlide = () => setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));

  return (
    <div className="relative group overflow-hidden rounded-2xl h-[300px] md:h-[400px] w-full bg-black flex items-center justify-center">
      <div className="absolute inset-0 bg-[#050505]/25 z-10 pointer-events-none" />
      <div className="w-full h-full relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Exhibition Image ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter brightness-85"
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.65)_0%,transparent_10%,transparent_90%,rgba(0,0,0,0.65)_100%)] z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.65)_0%,transparent_10%,transparent_90%,rgba(0,0,0,0.65)_100%)] z-20 pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] z-20 pointer-events-none" />
      <button onClick={prevSlide} className="absolute left-4 z-30 p-2 rounded-full bg-black/60 hover:bg-gold-vintage/20 border border-white/10 text-white hover:text-gold-vintage transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Previous image">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-gold-vintage/20 border border-white/10 text-white hover:text-gold-vintage transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Next image">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {Array.from({ length: totalImages }).map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} className={`h-2 rounded-full transition-all cursor-pointer ${currentIndex === i ? "bg-gold-vintage w-4" : "w-2 bg-white/30 hover:bg-white/60"}`} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
      <div className="absolute inset-0 rounded-2xl border border-gold-vintage/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
    </div>
  );
});
