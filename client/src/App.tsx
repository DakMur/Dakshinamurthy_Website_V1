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
const NoticeBoard = lazy(() => import("./features/notices/NoticeBoard"));
const DomainExpandedModal = lazy(() => import("./features/dimension-portal/components/DomainExpandedModal"));
const TeamWorkspace = lazy(() => import("./features/workspace/TeamWorkspace"));
const RegistrationGate = lazy(() => import("./features/registration/components/RegistrationGate"));
const RegistrationForm = lazy(() => import("./features/registration/components/RegistrationForm"));
const AdminControlPanel = lazy(() => import("./features/registration/components/AdminControlPanel"));

import Navbar from "./components/layout/Navbar";
import GlobalHamburgerMenu from "./components/layout/GlobalHamburgerMenu";
import { WebGLErrorBoundary } from "./components/error/WebGLErrorBoundary";
import Footer from "./components/layout/Footer";
import { useDatabase } from "./hooks/useDatabase";
import { useWarpEffect } from "./hooks/useWarpEffect";
import { User, DomainContent, Team, RegistrationConfig } from "./types/types";
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

  // Authenticated team state (hydrated from localStorage)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(() => {
    try {
      const saved = localStorage.getItem("dakshina_current_team");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Global registration config state
  const [registrationConfig, setRegistrationConfig] = useState<RegistrationConfig>({
    status: 'Registration Open',
    minMembers: 2,
    maxMembers: 4,
    disableTeamLogin: false,
    allowDocumentUpload: true,
    allowMemberEdits: true,
  });

  // Isolated Full-Viewport Overlay State: 'workspace' | 'register' | 'admin' | null
  const [overlayView, setOverlayView] = useState<'workspace' | 'register' | 'admin' | null>(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#workspace") return "workspace";
      if (window.location.hash === "#register") return "register";
      if (window.location.hash === "#admin") return "admin";
    }
    return null;
  });

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

  // Fetch registration configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/v1/registration/config');
        if (!res.ok) return;
        const raw = await res.json();
        const data = raw?.data || raw;
        if (data && typeof data === 'object') {
          setRegistrationConfig((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn("Using fallback registration config:", err);
      }
    };
    fetchConfig();
  }, []);

  // Lock background scroll whenever overlay is open
  useEffect(() => {
    if (overlayView) {
      document.body.style.overflow = "hidden";
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.stop === "function") {
        lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    }

    return () => {
      document.body.style.overflow = "";
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    };
  }, [overlayView]);

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

  // Open full-viewport isolated overlay with hash and history entry
  const openOverlay = useCallback((view: 'workspace' | 'register' | 'admin') => {
    setOverlayView(view);
    const hash = `#${view}`;
    if (window.location.hash !== hash) {
      window.history.pushState({ overlay: view }, '', hash);
    }
  }, []);

  // Close overlay and return focus to inline registration section
  const closeOverlayAndReturnToRegistration = useCallback(() => {
    setOverlayView(null);
    document.body.style.overflow = "";
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.start === "function") {
      lenis.start();
    }

    const regPath = getSectionPath("registration");
    if (window.location.hash) {
      window.history.replaceState({ sectionId: "registration" }, "", regPath);
    }

    setIsLanding(false);
    setActiveSection("registration");
    activeSectionRef.current = "registration";

    setTimeout(() => {
      const el = document.getElementById("registration");
      if (el) {
        const lenisInstance = (window as any).lenis;
        if (lenisInstance && typeof lenisInstance.scrollTo === "function") {
          lenisInstance.scrollTo(el, { offset: -24, immediate: true });
        } else {
          const targetY = el.getBoundingClientRect().top + window.scrollY - 24;
          window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        }
      }
    }, 60);
  }, []);

  // Close overlay, purge team session credentials, and return focus to registration
  const closeOverlayAndLogout = useCallback(() => {
    setCurrentTeam(null);
    try {
      localStorage.removeItem("dakshina_current_team");
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");
      sessionStorage.removeItem("dakshina_current_team");
      sessionStorage.removeItem("token");
    } catch {}
    closeOverlayAndReturnToRegistration();
  }, [closeOverlayAndReturnToRegistration]);

  // Team login success handler
  const handleTeamLogin = useCallback((teamData: Team) => {
    setCurrentTeam(teamData);
    try {
      localStorage.setItem("dakshina_current_team", JSON.stringify(teamData));
    } catch {}
    openOverlay('workspace');
  }, [openOverlay]);

  // Admin bypass / login handler
  const handleAdminBypass = useCallback(() => {
    setCurrentUser({
      id: "bypass",
      role: "admin",
      name: "Sovereign Admin",
      email: "admin@dakshina.org",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    });
    openOverlay('admin');
  }, [openOverlay]);

  // Open full registration wizard
  const handleOpenRegisterOverlay = useCallback(() => {
    openOverlay('register');
  }, [openOverlay]);

  // Scroll to target section smoothly with history & state update
  const scrollToSection = useCallback((sectionId: string, pushHistory = true) => {
    if (overlayView) {
      setOverlayView(null);
      document.body.style.overflow = "";
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    }

    if (isLanding) {
      setIsLanding(false);
    }

    // If sectionId is workspace and team is authenticated, open workspace overlay
    if (sectionId === "workspace") {
      if (currentTeam) {
        openOverlay('workspace');
        return;
      }
      sectionId = "registration";
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
  }, [isLanding, currentTeam, overlayView, openOverlay]);

  // Return to landing page
  const navigateToLanding = useCallback(() => {
    if (overlayView) {
      setOverlayView(null);
      document.body.style.overflow = "";
    }
    setIsLanding(true);
    setActiveSection("landing");
    activeSectionRef.current = "landing";
    setSelectedDomain(null);
    setIsMobileMenuOpen(false);
    if (window.location.pathname !== LANDING_PATH && window.location.pathname !== "/") {
      window.history.pushState({ sectionId: "landing" }, "", LANDING_PATH);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [overlayView]);

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
    const handlePopState = (event: PopStateEvent) => {
      // If overlay was open, close overlay and logout / return to continuous page
      if (overlayView) {
        closeOverlayAndLogout();
        return;
      }

      // Check if navigating into an overlay via state or hash
      if (event.state?.overlay || window.location.hash === '#workspace' || window.location.hash === '#register' || window.location.hash === '#admin') {
        const hashView = (event.state?.overlay || window.location.hash.replace('#', '')) as 'workspace' | 'register' | 'admin';
        if (hashView === 'workspace' && currentTeam) {
          setOverlayView('workspace');
          return;
        } else if (hashView === 'register') {
          setOverlayView('register');
          return;
        } else if (hashView === 'admin') {
          setOverlayView('admin');
          return;
        }
      }

      const parsed = parsePath(window.location.pathname);
      const sectionFromState = event.state?.sectionId || event.state?.section;

      if (parsed.isLanding || sectionFromState === "landing") {
        setIsLanding(true);
        setActiveSection("landing");
        activeSectionRef.current = "landing";
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetSection = sectionFromState || parsed.activeSectionId;
        setIsLanding(false);
        setActiveSection(targetSection);
        activeSectionRef.current = targetSection;

        // Position viewport at section without creating additional history entries
        setTimeout(() => {
          const el = document.getElementById(targetSection);
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
  }, [overlayView, currentTeam, closeOverlayAndLogout]);

  // Direct URL access initialization on first mount
  useEffect(() => {
    if (window.location.hash === '#workspace' && currentTeam) {
      setIsLanding(false);
      setOverlayView('workspace');
      return;
    }
    if (window.location.hash === '#register') {
      setIsLanding(false);
      setOverlayView('register');
      return;
    }
    if (window.location.hash === '#admin') {
      setIsLanding(false);
      setOverlayView('admin');
      return;
    }
    if (initialRoute.activeSectionId === 'workspace' && currentTeam) {
      setIsLanding(false);
      setOverlayView('workspace');
      return;
    }

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
    if (isLanding || overlayView || activeSection === "admin") return;

    let ticking = false;

    const checkActiveSection = () => {
      if (isProgrammaticScrollRef.current) {
        ticking = false;
        return;
      }

      const sectionElements = NAV_SECTIONS
        .filter((sec) => sec.id !== "workspace")
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
  }, [isLanding, activeSection, overlayView]);

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
      <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <WebGLErrorBoundary>
            <CosmicGalaxy
              activeTab={activeSection}
              route={isLanding ? "landing" : activeSection}
              isWarping={isWarping}
              isExplore={!isLanding}
              isModalOpen={selectedDomain !== null || isMobileMenuOpen || overlayView !== null}
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
        /* 2. CONTINUOUS SHOWCASE LANDING PAGE WITH INLINE REGISTRATION */
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 flex flex-col space-y-20 md:space-y-28 pt-6">
          <Suspense fallback={<div className="min-h-screen" />}>

            {/* SECTION 1: PRATHAMA PRAKASHA / WISDOM LECTURES */}
            <section id="prathama-prakasha" className="scroll-mt-8 space-y-12 text-center py-4">
              <div className="space-y-3 max-w-3xl mx-auto px-2">
                <span className="font-mono text-[11px] md:text-xs uppercase text-gold-vintage/90 tracking-[0.28em] block">
                  VEDANTA MAKEATHON
                </span>
                <h2 className="font-display font-semibold sm:font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-[0.16em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#D4AF37] to-[#8C6B1C] uppercase drop-shadow-[0_2px_14px_rgba(212,175,55,0.3)] filter antialiased py-1">
                  VEDANTA × SCIENCE
                </h2>
                <p className="text-xs md:text-sm text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-sans mt-2">
                  Based on the concepts of Dakshinamurthy Ashtakam, the Vedanta Makeathon explores ideas of consciousness, the mind–body relationship, and sense perception through immersive technology experiences.
                </p>
                <div className="w-16 h-[1.5px] bg-gold-vintage/40 mx-auto mt-4" />
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

            {/* SECTION 4: INNOVATION TIMELINE & CHRONOLOGY */}
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

            {/* SECTION 5: NOTICE BOARD */}
            <section id="notice-board" className="scroll-mt-8 py-4">
              <NoticeBoard setRoute={scrollToSection} />
            </section>

            {/* SECTION 6: REGISTRATION & ACCESS */}
            <section id="registration" className="scroll-mt-8 space-y-8 text-center py-4">
              <div className="space-y-3 max-w-3xl mx-auto px-2">
                <span className="font-mono text-[11px] md:text-xs uppercase text-gold-vintage/90 tracking-[0.28em] block">
                  PARTICIPATION & ACCESS
                </span>
                <h2 className="font-display font-semibold sm:font-bold text-3xl sm:text-4xl md:text-5xl tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#D4AF37] to-[#8C6B1C] uppercase drop-shadow-[0_2px_14px_rgba(212,175,55,0.3)] filter antialiased py-1">
                  Team Registration
                </h2>
                <p className="text-xs md:text-sm text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-sans mt-2">
                  Access your team workspace, manage team members, and submit your project documents and demo video for Dakshinamurthy Hackathon.
                </p>
                <div className="w-16 h-[1.5px] bg-gold-vintage/40 mx-auto mt-4" />
              </div>

              <RegistrationGate
                config={registrationConfig}
                onLoginSuccess={handleTeamLogin}
                onAdminBypass={handleAdminBypass}
                onRegisterClick={handleOpenRegisterOverlay}
              />
            </section>

          </Suspense>
        </main>
      )}

      {/* Footer */}
      <Footer dailyQuote={dailyQuote} isLanding={isLanding} route={isLanding ? "landing" : activeSection} />

      {/* Modal domain overlay */}
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

      {/* Isolated Full-Viewport Overlay for Active Workspace or Full Registration Wizard / Admin Panel */}
      <AnimatePresence>
        {overlayView && (
          <motion.div
            key="workspace-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] h-screen w-screen bg-[#07070a] overflow-y-auto overscroll-contain"
          >
            {overlayView === 'workspace' && currentTeam && (
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
                </div>
              }>
                <TeamWorkspace
                  team={currentTeam}
                  config={registrationConfig}
                  currentUser={currentUser}
                  onUpdateTeam={(updated) => {
                    setCurrentTeam(updated);
                    try {
                      localStorage.setItem("dakshina_current_team", JSON.stringify(updated));
                    } catch {}
                  }}
                  onLogout={closeOverlayAndLogout}
                  onNavigateHome={closeOverlayAndReturnToRegistration}
                  onBack={closeOverlayAndReturnToRegistration}
                />
              </Suspense>
            )}

            {overlayView === 'register' && (
              <div className="min-h-screen w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
                  </div>
                }>
                  <RegistrationForm
                    config={registrationConfig}
                    onBack={closeOverlayAndReturnToRegistration}
                    onSuccess={(teamData) => {
                      setCurrentTeam(teamData);
                      try {
                        localStorage.setItem("dakshina_current_team", JSON.stringify(teamData));
                      } catch {}
                      setOverlayView('workspace');
                      if (window.location.hash !== '#workspace') {
                        window.history.pushState({ overlay: 'workspace' }, '', '#workspace');
                      }
                    }}
                  />
                </Suspense>
              </div>
            )}

            {overlayView === 'admin' && (
              <div className="min-h-screen w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/30 border-t-gold-vintage animate-spin" />
                  </div>
                }>
                  <AdminControlPanel
                    currentUser={currentUser}
                    config={registrationConfig}
                    onLogin={(usr) => setCurrentUser(usr)}
                    onLogout={closeOverlayAndLogout}
                    onRefreshData={loadDatabase}
                    onConfigUpdate={(updatedConfig) => setRegistrationConfig(updatedConfig)}
                  />
                </Suspense>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
