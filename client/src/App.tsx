import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import Lenis from "lenis";

import { motion, AnimatePresence } from "motion/react";

// ── Lazy-loaded route-level chunks ─────────────────────────────────────────
const CosmicGalaxy = lazy(() => import("./features/landing-main/CosmicGalaxy"));
const LandingPage = lazy(() => import("./features/landing-main/LandingPage"));
const WarpTransition = lazy(() => import("./features/loading-main/WarpTransition"));
const WisdomLectures = lazy(() => import("./features/wisdom-lectures"));
const TechnicalWorkshopSection = lazy(() => import("./features/technical-workshop/TechnicalWorkshopSection"));
const PortalPage = lazy(() => import("./features/dimension-portal/PortalPage"));
const TimelineSection = lazy(() => import("./features/timeline/TimelineSection"));
const RegistrationFeature = lazy(() => import("./features/registration/RegistrationFeature"));
const NoticeBoard = lazy(() => import("./features/notices/NoticeBoard"));
const DomainExpandedModal = lazy(() => import("./features/dimension-portal/components/DomainExpandedModal"));

import Navbar from "./components/layout/Navbar";
import GlobalHamburgerMenu from "./components/layout/GlobalHamburgerMenu";
import { WebGLErrorBoundary } from "./components/error/WebGLErrorBoundary";
import Footer from "./components/layout/Footer";
import { useDatabase } from "./hooks/useDatabase";
import { useWarpEffect } from "./hooks/useWarpEffect";
import { User, DomainContent } from "./types/types";
import { NAV_SECTIONS, LANDING_PATH, parsePath, getSectionPath } from "./utils/navigation";

export default function App() {
  // Parse initial route and active section directly from browser URL
  const initialRoute = parsePath(window.location.pathname);
  const [isLanding, setIsLanding] = useState<boolean>(initialRoute.isLanding);
  const [activeSection, setActiveSection] = useState<string>(initialRoute.activeSectionId);

  // Smooth scrolling engine
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

  // Warp transition triggers
  const { isWarping, triggerWarp } = useWarpEffect(false);

  // Expanded detailed modal states
  const [selectedDomain, setSelectedDomain] = useState<DomainContent | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Mobile responsive menu active state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for scroll synchronization and programmatic locking
  const isProgrammaticScrollRef = useRef(false);
  const scrollLockTimeoutRef = useRef<number | null>(null);
  const activeSectionRef = useRef(activeSection);
  const lastTrackedSectionRef = useRef<string | null>(null);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Database state from custom hook
  const {
    domains, articles, timeline, quotes, comments, analytics, dailyQuote,
    setArticles, setAnalytics, loadDatabase, loadDomains, loadArticles, loadTimeline
  } = useDatabase();

  // Close mobile navigation drawer whenever active section changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection, isLanding]);

  // Record page views in Express server analytics tables without duplicate continuous fires
  useEffect(() => {
    const pageToTrack = isLanding ? "home" : activeSection;
    if (lastTrackedSectionRef.current === pageToTrack) return;
    lastTrackedSectionRef.current = pageToTrack;

    fetch("/api/v1/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pageToTrack })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && analytics.pageViews) {
          setAnalytics((prev) => ({
            ...prev,
            pageViews: {
              ...prev.pageViews,
              [pageToTrack]: data.count
            }
          }));
        }
      })
      .catch((err) => console.error("Error incrementing analytics metrics:", err));
  }, [isLanding, activeSection, analytics.pageViews, setAnalytics]);

  // Scroll to target section smoothly with history & state update
  const scrollToSection = useCallback((sectionId: string, pushHistory = true) => {
    if (isLanding) {
      setIsLanding(false);
    }

    isProgrammaticScrollRef.current = true;
    if (scrollLockTimeoutRef.current) {
      clearTimeout(scrollLockTimeoutRef.current);
    }

    setActiveSection(sectionId);
    activeSectionRef.current = sectionId;

    const targetPath = getSectionPath(sectionId);
    if (pushHistory) {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ sectionId }, "", targetPath);
      }
    } else {
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({ sectionId }, "", targetPath);
      }
    }

    // Smooth scroll to element in normal document flow
    const performScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(el, { offset: -24, duration: 1.2 });
        } else {
          const targetY = el.getBoundingClientRect().top + window.scrollY - 24;
          window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        }
      }
    };

    if (isLanding) {
      setTimeout(performScroll, 80);
    } else {
      performScroll();
    }

    scrollLockTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1200);
  }, [isLanding]);

  // Return to landing page
  const navigateToLanding = useCallback(() => {
    setIsLanding(true);
    setSelectedDomain(null);
    setIsMobileMenuOpen(false);
    if (window.location.pathname !== LANDING_PATH && window.location.pathname !== "/") {
      window.history.pushState(null, "", LANDING_PATH);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Warp Speed Sequence triggers on Landing explore click
  const triggerWarpSpeed = useCallback(() => {
    triggerWarp(() => {
      setIsLanding(false);
      setActiveSection("prathama-prakasha");
      activeSectionRef.current = "prathama-prakasha";
      const targetPath = getSectionPath("prathama-prakasha");
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ sectionId: "prathama-prakasha" }, "", targetPath);
      }
      setTimeout(() => {
        const el = document.getElementById("prathama-prakasha");
        if (el) {
          const lenis = (window as any).lenis;
          if (lenis && typeof lenis.scrollTo === "function") {
            lenis.scrollTo(el, { offset: -90, immediate: true });
          } else {
            window.scrollTo({ top: 0, behavior: "auto" });
          }
        }
      }, 50);
    }, 2400);
  }, [triggerWarp]);

  // Handle browser Back and Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePath(window.location.pathname);
      if (parsed.isLanding) {
        setIsLanding(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setIsLanding(false);
        setActiveSection(parsed.activeSectionId);
        activeSectionRef.current = parsed.activeSectionId;

        // Position viewport at section without creating additional history entries
        setTimeout(() => {
          const el = document.getElementById(parsed.activeSectionId);
          if (el) {
            isProgrammaticScrollRef.current = true;
            const lenis = (window as any).lenis;
            if (lenis && typeof lenis.scrollTo === "function") {
              lenis.scrollTo(el, { offset: -24, duration: 1.0 });
            } else {
              const targetY = el.getBoundingClientRect().top + window.scrollY - 24;
              window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
            }
            setTimeout(() => {
              isProgrammaticScrollRef.current = false;
            }, 1100);
          }
        }, 50);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Direct URL access initialization on first mount
  useEffect(() => {
    if (!initialRoute.isLanding && initialRoute.activeSectionId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(initialRoute.activeSectionId);
        if (el) {
          const lenis = (window as any).lenis;
          if (lenis && typeof lenis.scrollTo === "function") {
            lenis.scrollTo(el, { offset: -24, immediate: true });
          } else {
            const targetY = el.getBoundingClientRect().top + window.scrollY - 24;
            window.scrollTo({ top: Math.max(0, targetY), behavior: "auto" });
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  // ScrollSpy: observe viewport scroll and passively synchronize active navbar item and URL
  useEffect(() => {
    if (isLanding) return;

    let ticking = false;

    const checkActiveSection = () => {
      if (isProgrammaticScrollRef.current) {
        ticking = false;
        return;
      }

      const sectionElements = NAV_SECTIONS
        .map((sec) => document.getElementById(sec.id))
        .filter((el): el is HTMLElement => el !== null);

      if (sectionElements.length === 0) {
        ticking = false;
        return;
      }

      const viewportThreshold = window.innerHeight * 0.35;
      let bestSectionId: string | null = null;

      // Find which section crosses the primary reading threshold
      for (const el of sectionElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportThreshold && rect.bottom > viewportThreshold) {
          bestSectionId = el.id;
          break;
        }
      }

      // Top boundary fallback
      if (!bestSectionId && window.scrollY < 150) {
        bestSectionId = sectionElements[0].id;
      }

      // Bottom boundary fallback
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        bestSectionId = sectionElements[sectionElements.length - 1].id;
      }

      if (bestSectionId && bestSectionId !== activeSectionRef.current) {
        setActiveSection(bestSectionId);
        activeSectionRef.current = bestSectionId;

        // Passive scroll URL update via replaceState
        const targetPath = getSectionPath(bestSectionId);
        if (window.location.pathname !== targetPath) {
          window.history.replaceState({ sectionId: bestSectionId }, "", targetPath);
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkActiveSection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    checkActiveSection();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isLanding]);

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

  // Stable navigation callback: scroll to tattva-darshana and open domain modal
  const handleExploreDomain = useCallback((slug: string) => {
    const fitDom = domains.find((d) => d.slug === slug);
    if (fitDom) {
      setSelectedDomain(fitDom);
      scrollToSection("tattva-darshana");
    }
  }, [domains, scrollToSection]);

  // Stable domain selection callback for PortalPage cards
  const handleSelectDomain = useCallback((d: DomainContent) => setSelectedDomain(d), []);

  const handleCloseDomainModal = useCallback(() => setSelectedDomain(null), []);

  return (
    <div className="relative w-full min-h-screen text-white selection:bg-gold-vintage selection:text-black font-sans">

      {/* Fixed Subtle Ambient Gradient Layer behind canvas */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-black/40 to-transparent pointer-events-none transform-gpu" />

      {/* Persistent WebGL Background Container */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <WebGLErrorBoundary>
            <CosmicGalaxy
              activeTab={activeSection}
              route={isLanding ? "landing" : activeSection}
              isWarping={isWarping}
              isExplore={!isLanding}
              isModalOpen={selectedDomain !== null || isMobileMenuOpen}
            />
          </WebGLErrorBoundary>
        </Suspense>
      </div>

      {/* ॐ Om Transition Overlay */}
      <Suspense fallback={null}>
        <WarpTransition isWarping={isWarping} />
      </Suspense>

      {/* 1. Global Fixed Top-Right Hamburger Menu */}
      <GlobalHamburgerMenu
        isLanding={isLanding}
        route={isLanding ? "landing" : activeSection}
        activeSection={activeSection}
        onNavigateSection={(id) => scrollToSection(id, true)}
        onNavigateLanding={navigateToLanding}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setSelectedDomain={setSelectedDomain}
      />

      {/* 2. Top Section Pill Navigation Bar */}
      <Navbar
        isLanding={isLanding}
        route={isLanding ? "landing" : activeSection}
        activeSection={activeSection}
        onNavigateSection={(id) => scrollToSection(id, true)}
        onNavigateLanding={navigateToLanding}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setSelectedDomain={setSelectedDomain}
      />

      {/* Main Content View */}
      {isLanding ? (
        /* 1. COSMIC LANDING EXPERIENCE */
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 flex flex-col justify-center min-h-[calc(100vh-80px)] pt-12">
          <Suspense fallback={<div className="min-h-screen" />}>
            <LandingPage isWarping={isWarping} triggerWarpSpeed={triggerWarpSpeed} />
          </Suspense>
        </main>
      ) : (
        /* 2. CONTINUOUS FINITE SINGLE-PAGE SECTION EXPERIENCE */
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 flex flex-col space-y-20 md:space-y-28 pt-6">
          <Suspense fallback={<div className="min-h-screen" />}>

            {/* SECTION 1: PRATHAMA PRAKASHA / WISDOM LECTURES */}
            <section id="prathama-prakasha" className="scroll-mt-8 space-y-16 text-center py-4">
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
            </section>

            {/* SECTION 2: TECHNICAL WORKSHOP / PARAM FOUNDATION */}
            <section id="technical-workshop" className="scroll-mt-8 py-4">
              <TechnicalWorkshopSection />
            </section>

            {/* SECTION 3: TATTVA DARSHANA / DOMAINS HUB */}
            <section id="tattva-darshana" className="scroll-mt-8 py-4">
              <PortalPage
                domains={domains}
                onSelectDomain={handleSelectDomain}
                loadDomains={loadDomains}
              />
            </section>

            {/* SECTION 3: INNOVATION TIMELINE & CHRONOLOGY */}
            <section id="innovation-timeline" className="scroll-mt-8 space-y-12 text-center py-4">
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
            </section>

            {/* SECTION 4: NOTICE BOARD */}
            <section id="notice-board" className="scroll-mt-8 py-4">
              <NoticeBoard setRoute={scrollToSection} />
            </section>

            {/* SECTION 5: REGISTRATION / ADMIN WORKSPACE */}
            <section id="registration" className="scroll-mt-8 py-4 w-full">
              <RegistrationFeature
                currentUser={currentUser}
                onLogin={(usr) => setCurrentUser(usr)}
                onLogout={() => setCurrentUser(null)}
                onRefreshData={loadDatabase}
              />
            </section>

          </Suspense>
        </main>
      )}

      {/* Footer */}
      <Footer dailyQuote={dailyQuote} isLanding={isLanding} route={isLanding ? "landing" : activeSection} />

      {/* Modal overlays */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedDomain && (
            <DomainExpandedModal
              domain={selectedDomain}
              allDomains={domains}
              onClose={handleCloseDomainModal}
              onNavigateToDomain={handleSelectDomain}
              onOpenOracle={() => scrollToSection("tattva-darshana")}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
