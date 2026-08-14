import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Lenis from "lenis";

import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Compass from 'lucide-react/dist/esm/icons/compass';
import Layers from 'lucide-react/dist/esm/icons/layers';
import { motion, AnimatePresence } from "motion/react";

// ── Lazy-loaded route-level chunks ─────────────────────────────────────────
const CosmicGalaxy = lazy(() => import("./features/landing-main/CosmicGalaxy"));
const LandingPage = lazy(() => import("./features/landing-main/LandingPage"));
const WarpTransition = lazy(() => import("./features/loading-main/WarpTransition"));
const WisdomLectures = lazy(() => import("./features/wisdom-lectures"));
const StorytellingSection = lazy(() => import("./features/timeline/StorytellingSection"));
const PortalPage = lazy(() => import("./features/dimension-portal/PortalPage"));
const TimelineSection = lazy(() => import("./features/timeline/TimelineSection"));
const RegistrationFeature = lazy(() => import("./features/registration/RegistrationFeature"));
const NoticeBoard = lazy(() => import("./features/notices/NoticeBoard"));
const DomainExpandedModal = lazy(() => import("./features/dimension-portal/components/DomainExpandedModal"));

import Navbar from "./components/layout/Navbar";
import { WebGLErrorBoundary } from "./components/error/WebGLErrorBoundary";
import Footer from "./components/layout/Footer";
import { useDatabase } from "./hooks/useDatabase";
import { useWarpEffect } from "./hooks/useWarpEffect";
import { User, DomainContent } from "./types/types";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Expose lenis globally for modals to pause it
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  // Navigation Route state (supporting all route aliases: prathama, tattva, timeline, registration)
  const [route, setRoute] = useState<string>("landing");

  // Warp transition triggers
  const { isWarping, triggerWarp } = useWarpEffect(false);

  // Expanded detailed modal states
  const [selectedDomain, setSelectedDomain] = useState<DomainContent | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Mobile responsive menu active state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Database state from custom hook
  const {
    domains, articles, timeline, quotes, comments, analytics, dailyQuote,
    setArticles, setAnalytics, loadDatabase, loadDomains, loadArticles, loadTimeline
  } = useDatabase();

  // Close mobile navigation drawer whenever route transitions
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [route]);

  // Record page views in Express server analytics tables
  useEffect(() => {
    fetch("/api/v1/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: route === "landing" ? "home" : route })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && analytics.pageViews) {
          setAnalytics((prev) => ({
            ...prev,
            pageViews: {
              ...prev.pageViews,
              [route === "landing" ? "home" : route]: data.count
            }
          }));
        }
      })
      .catch((err) => console.error("Error incrementing analytics metrics:", err));
  }, [route]);

  // Warp Speed Sequence triggers on Landing explore click
  const triggerWarpSpeed = useCallback(() => {
    triggerWarp(() => setRoute("prathama"), 2400);
  }, [triggerWarp]);

  // Like feedback triggers incrementing article likes real-time
  const handleLikeArticle = useCallback(async (articleId: string) => {
    try {
      const res = await fetch(`/api/v1/articles/${articleId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setArticles((prev) =>
          prev.map((a) => (a.id === articleId ? { ...a, likes: data.likes } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, [setArticles]);

  // Stable navigation callback: navigate to domains route and open a domain modal
  const handleExploreDomain = useCallback((slug: string) => {
    const fitDom = domains.find((d) => d.slug === slug);
    if (fitDom) {
      setRoute("tattva");
      setSelectedDomain(fitDom);
    }
  }, [domains]);

  // Stable domain selection callback for PortalPage cards
  const handleSelectDomain = useCallback((d: DomainContent) => setSelectedDomain(d), []);

  const handleCloseDomainModal = useCallback(() => setSelectedDomain(null), []);

  return (
    <div className="relative min-h-screen text-white selection:bg-gold-vintage selection:text-black font-sans">

      {/* Fixed Background Gradient Layer */}
      <div className="fixed inset-0 z-[-20] bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-black to-black pointer-events-none transform-gpu" />

      {/* Task 2: Persistent WebGL Background Container — permanently mounted */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Suspense fallback={null}>
          <WebGLErrorBoundary>
            <CosmicGalaxy
              activeTab={route}
              route={route}
              isWarping={isWarping}
              isExplore={route !== "landing" && route !== "home"}
              isModalOpen={selectedDomain !== null || isMobileMenuOpen}
            />
          </WebGLErrorBoundary>
        </Suspense>
      </div>

      {/* ॐ Om Transition Overlay */}
      <Suspense fallback={null}>
        <WarpTransition isWarping={isWarping} />
      </Suspense>

      {/* Top Navigation Bar */}
      <Navbar
        route={route}
        setRoute={setRoute}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setSelectedDomain={setSelectedDomain}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Task 1: Primary visual containers supporting all tab route aliases */}
      <main className={`relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 flex flex-col justify-center min-h-[calc(100vh-80px)] transition-all duration-300 ${route !== "landing" && route !== "home" ? "pt-28" : "pt-12"}`}>
        <Suspense fallback={<div className="min-h-screen" />}>
          <AnimatePresence mode="wait">

            {/* PAGE 1: COSMIC LANDING EXPERIENCE */}
            {(route === "landing" || route === "home") && (
              <LandingPage isWarping={isWarping} triggerWarpSpeed={triggerWarpSpeed} />
            )}

            {/* PAGE 2: PRATHAMA PRAKASA / WISDOM LECTURES */}
            {(route === "prathama" || route === "prathama-prakasa" || route === "storytelling") && (
              <motion.div
                key="prathama"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-16 text-center py-6"
              >
                <div className="space-y-2 max-w-2xl mx-auto">
                  <span className="font-mono text-xs uppercase text-gold-vintage tracking-widest block">
                    Śāstra Ratnākara
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-5xl tracking-widest text-[#ffffff] uppercase">
                    Ocean of Sacred Knowledge
                  </h2>
                  <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto mt-4" />
                </div>

                <WisdomLectures
                  articles={articles}
                  onLike={handleLikeArticle}
                  onExploreDomain={handleExploreDomain}
                />
              </motion.div>
            )}

            {/* PAGE 3: TATTVA DARSANA / DOMAINS HUB */}
            {(route === "tattva" || route === "tattva-darsana" || route === "domains") && (
              <PortalPage
                domains={domains}
                onSelectDomain={handleSelectDomain}
                loadDomains={loadDomains}
              />
            )}

            {/* PAGE 4: CHRONOLOGY TIMELINE & STORYTELLING */}
            {(route === "timeline" || route === "chronology-timeline" || route === "flow") && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12 text-center py-6"
              >
                <div className="space-y-2 max-w-2xl mx-auto">
                  <span className="font-mono text-xs uppercase text-gold-vintage tracking-widest block">
                    The Innovation Journey
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-5xl tracking-widest text-[#ffffff] uppercase">
                    Mārga Darśana
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans mt-3">
                    From the first announcement to the final prototype, every phase guides participants through learning, collaboration, and innovation. Explore the journey from the theme announcement to the Makeathon Finals.
                  </p>
                  <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto mt-4" />
                </div>

                <TimelineSection timeline={timeline} loadTimeline={loadTimeline} />
              </motion.div>
            )}

            {/* PAGE 5: NOTICE BOARD */}
            {route === "notices" && (
              <NoticeBoard setRoute={setRoute} />
            )}

            {/* PAGE 6: REGISTRATION / ADMIN WORKSPACE */}
            {(route === "registration" || route === "admin") && (
              <motion.div
                key="registration"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-4 w-full"
              >
                <RegistrationFeature
                  currentUser={currentUser}
                  onLogin={(usr) => setCurrentUser(usr)}
                  onLogout={() => setCurrentUser(null)}
                  onRefreshData={loadDatabase}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer dailyQuote={dailyQuote} route={route} />

      {/* Floating Action Buttons */}
      {route !== "landing" && route !== "home" && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
          <button
            onClick={() => setRoute("tattva")}
            className="hidden sm:flex p-3 bg-[#0a0a0a]/80 hover:bg-gold-vintage border border-white/10 hover:border-gold-vintage text-slate-400 hover:text-black rounded-full transition-all cursor-pointer shadow-lg tracking-wider"
            title="Jump to Portals"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRoute("timeline")}
            className="hidden sm:flex p-3 bg-[#0a0a0a]/80 hover:bg-gold-vintage border border-white/10 hover:border-gold-vintage text-slate-400 hover:text-black rounded-full transition-all cursor-pointer shadow-lg"
            title="Jump to Flow of events"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal overlays */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedDomain && (
            <DomainExpandedModal
              domain={selectedDomain}
              allDomains={domains}
              onClose={handleCloseDomainModal}
              onNavigateToDomain={handleSelectDomain}
              onOpenOracle={() => setRoute("oracle")}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
