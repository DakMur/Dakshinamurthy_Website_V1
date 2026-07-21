import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import {
  Sparkles, Compass,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ── Lazy-loaded route-level chunks ─────────────────────────────────────────
// Each lazy() call generates a separate async chunk that is only fetched when
// the corresponding route becomes active for the first time.
const CosmicGalaxy      = lazy(() => import("./features/landing-main/CosmicGalaxy"));
const LandingPage        = lazy(() => import("./features/landing-main/LandingPage"));
const WarpTransition     = lazy(() => import("./features/loading-main/WarpTransition"));
const StorytellingSection = lazy(() => import("./features/timeline/StorytellingSection"));
const PortalPage         = lazy(() => import("./features/dimension-portal/PortalPage"));
const TimelineSection    = lazy(() => import("./features/timeline/TimelineSection"));
const RegistrationFeature = lazy(() => import("./features/registration/RegistrationFeature"));
const CosmicOracle       = lazy(() => import("./features/cosmic-oracle/CosmicOracle"));
const DomainExpandedModal = lazy(() => import("./features/dimension-portal/components/DomainExpandedModal"));
// ──────────────────────────────────────────────────────────────────────────

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { useDatabase } from "./hooks/useDatabase";
import { useWarpEffect } from "./hooks/useWarpEffect";
import { User, DomainContent } from "./types/types";


export default function App() {
  // Navigation Route state
  const [route, setRoute] = useState<"landing" | "storytelling" | "domains" | "flow" | "admin">("landing");

  // Warp transition triggers
  const { isWarping, triggerWarp } = useWarpEffect(false);

  // Expanded detailed modal states
  const [selectedDomain, setSelectedDomain] = useState<DomainContent | null>(null);

  // Oracle AI guide overlay
  const [isOracleOpen, setIsOracleOpen] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Mobile responsive menu active state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Database state from custom hook
  const {
    domains, articles, timeline, quotes, comments, analytics, dailyQuote,
    setArticles, setAnalytics, loadDatabase
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
    triggerWarp(() => setRoute("storytelling"), 2400);
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
      setRoute("domains");
      setSelectedDomain(fitDom);
    }
  }, [domains]);

  // Stable domain selection callback for PortalPage cards
  const handleSelectDomain = useCallback((d: DomainContent) => setSelectedDomain(d), []);

  // Simulate Google Account Auth login
  const handleSimulateGoogleLogin = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "falconace81@gmail.com",
          name: "Sovereign Seeker",
          picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Stable Oracle toggle callbacks
  const handleOpenOracle = useCallback(() => setIsOracleOpen(true), []);
  const handleCloseOracle = useCallback(() => setIsOracleOpen(false), []);
  const handleCloseDomainModal = useCallback(() => setSelectedDomain(null), []);

  return (
    <div className="relative min-h-screen text-white selection:bg-gold-vintage selection:text-black font-sans">

      {/* Fixed Background Gradient Layer */}
      <div className="fixed inset-0 z-[-1] bg-[#000000] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-black to-black pointer-events-none transform-gpu" />

      {/* Absolute Base Layer: Interactive 3D Cosmic Model — lazy, heaviest chunk */}
      <Suspense fallback={null}>
        <CosmicGalaxy isWarping={isWarping} />
      </Suspense>

      {/* ॐ Om Transition Overlay — mounts at z-[999] above everything */}
      <Suspense fallback={null}>
        <WarpTransition isWarping={isWarping} />
      </Suspense>

      {/* 2. Top Navigation Bar (Hidden during full Landing Page 1 layout) */}
      <Navbar
        route={route}
        setRoute={setRoute}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setSelectedDomain={setSelectedDomain}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleSimulateGoogleLogin={handleSimulateGoogleLogin}
        setIsOracleOpen={setIsOracleOpen}
      />

      {/* 3. Primary visual containers and layouts */}
      <main className={`relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 flex flex-col justify-center min-h-[calc(100vh-80px)] transition-all duration-300 ${route !== "landing" ? "pt-28" : "pt-12"}`}>
        {/* Minimal route-level Suspense fallback — invisible while chunks load */}
        <Suspense fallback={<div className="min-h-screen" />}>
        <AnimatePresence mode="wait">

          {/* PAGE 1: COSMIC LANDING EXPERIENCE */}
          {route === "landing" && (
            <LandingPage isWarping={isWarping} triggerWarpSpeed={triggerWarpSpeed} />
          )}

          {/* PAGE 2: STORYTELLING INDEX */}
          {route === "storytelling" && (
            <motion.div
              key="storytelling"
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

              {/* Alternating storytelling content items */}
              <StorytellingSection
                articles={articles}
                onLike={handleLikeArticle}
                onExploreDomain={handleExploreDomain}
              />
            </motion.div>
          )}

          {/* PAGE 3: DOMAINS HUB (PORTALS) */}
          {route === "domains" && (
            <PortalPage
              domains={domains}
              onSelectDomain={handleSelectDomain}
            />
          )}

          {/* PAGE 4: FLOW OF EVENTS (TIMELINE) */}
          {route === "flow" && (
            <motion.div
              key="flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 text-center py-6"
            >
              <div className="space-y-2 max-w-2xl mx-auto">
                <span className="font-mono text-xs uppercase text-gold-vintage tracking-widest block">
                  The Evolutionary Chronology of Spirit
                </span>
                <h2 className="font-display font-medium text-3xl md:text-5xl tracking-widest text-[#ffffff] uppercase">
                  FLOW OF THE JOURNEY
                </h2>
                <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto mt-4" />
              </div>

              {/* Vertical timeline path */}
              <TimelineSection timeline={timeline} />
            </motion.div>
          )}

          {/* PAGE 5: ADMIN CLEARANCES WORKSPACE */}
          {route === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <RegistrationFeature
                domains={domains}
                articles={articles}
                timeline={timeline}
                quotes={quotes}
                comments={comments}
                analytics={analytics}
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

      {/* 4. Daily floating spiritual quote at the bottom page footer bar */}
      <Footer dailyQuote={dailyQuote} route={route} />

      {/* Floating Action Buttons on right rail (Navigating shortcuts) */}
      {route !== "landing" && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
          <button
            onClick={() => setRoute("domains")}
            className="hidden sm:flex p-3 bg-[#0a0a0a]/80 hover:bg-gold-vintage border border-white/10 hover:border-gold-vintage text-slate-400 hover:text-black rounded-full transition-all cursor-pointer shadow-lg tracking-wider"
            title="Jump to Portals"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRoute("flow")}
            className="hidden sm:flex p-3 bg-[#0a0a0a]/80 hover:bg-gold-vintage border border-white/10 hover:border-gold-vintage text-slate-400 hover:text-black rounded-full transition-all cursor-pointer shadow-lg"
            title="Jump to Flow of events"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenOracle}
            className="p-3 bg-gold-vintage hover:bg-gold-bright border border-gold-vintage text-black rounded-full transition-all cursor-pointer shadow-xl animate-bounce"
            title="Consult Oracle"
          >
            <Sparkles className="w-4 h-4 fill-black" />
          </button>
        </div>
      )}

      {/* 5. Detailed Dimensional Modal expansion overlay */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedDomain && (
            <DomainExpandedModal
              domain={selectedDomain}
              allDomains={domains}
              onClose={handleCloseDomainModal}
              onNavigateToDomain={handleSelectDomain}
              onOpenOracle={handleOpenOracle}
            />
          )}
        </AnimatePresence>
      </Suspense>

      {/* 6. Dynamic Cosmic AI Oracle panel portal drawer */}
      <Suspense fallback={null}>
        <CosmicOracle
          isOpen={isOracleOpen}
          onClose={handleCloseOracle}
          activeDomainSlug={selectedDomain?.slug}
          activeDomainName={selectedDomain?.title}
        />
      </Suspense>
    </div>
  );
}
