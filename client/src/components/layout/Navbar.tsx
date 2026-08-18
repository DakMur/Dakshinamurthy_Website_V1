import { motion, AnimatePresence } from "motion/react";
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import { User, DomainContent } from "../../types/types";

interface NavbarProps {
  isLanding?: boolean;
  route?: string;
  activeSection?: string;
  setRoute?: (route: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  onNavigateLanding?: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  setSelectedDomain: (domain: DomainContent | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({
  isLanding = false,
  route = "landing",
  activeSection,
  setRoute,
  onNavigateSection,
  onNavigateLanding,
  currentUser,
  setCurrentUser,
  setSelectedDomain,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavbarProps) {
  const currentActive = activeSection || route;

  const isPrathamaActive = currentActive === "prathama-prakasha" || currentActive === "prathama" || currentActive === "prathama-prakasa" || currentActive === "storytelling";
  const isTattvaActive = currentActive === "tattva-darshana" || currentActive === "tattva" || currentActive === "tattva-darsana" || currentActive === "domains";
  const isTimelineActive = currentActive === "innovation-timeline" || currentActive === "timeline" || currentActive === "chronology-timeline" || currentActive === "flow";
  const isNoticeBoardActive = currentActive === "notice-board" || currentActive === "notices";
  const isRegistrationActive = currentActive === "registration" || currentActive === "admin";

  const navItems = [
    { id: "prathama-prakasha", label: "Prathama Prakasa", active: isPrathamaActive },
    { id: "tattva-darshana", label: "Tattva Darśana", active: isTattvaActive },
    { id: "innovation-timeline", label: "Innovation Timeline", active: isTimelineActive },
    { id: "notice-board", label: "Notice Board", active: isNoticeBoardActive },
    { id: "registration", label: "Registration", active: isRegistrationActive }
  ];

  const handleNavClick = (sectionId: string) => {
    setSelectedDomain(null);
    setIsMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else if (setRoute) {
      setRoute(sectionId);
    }
  };

  const handleLogoClick = () => {
    setSelectedDomain(null);
    setIsMobileMenuOpen(false);
    if (onNavigateLanding) {
      onNavigateLanding();
    } else if (setRoute) {
      setRoute("landing");
    }
  };

  const showNavbar = !isLanding && route !== "landing" && route !== "home";

  return (
    <AnimatePresence>
      {showNavbar && (
        <div className="relative z-30 w-full flex flex-col items-center justify-center pt-3 pb-1 px-4 pointer-events-none">
          {/* Centered Compact Navigation Pill */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pointer-events-auto w-fit max-w-[94vw] md:max-w-max flex items-center justify-between gap-3 sm:gap-4 md:gap-5 bg-[#07060b]/90 backdrop-blur-xl border border-gold-vintage/30 shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_12px_rgba(212,175,55,0.08)] rounded-full py-1.5 px-3.5 sm:px-4 md:px-5 select-none"
          >
            {/* Left: Compact Brand Identifier */}
            <div
              className="flex items-center gap-2 cursor-pointer group shrink-0"
              onClick={handleLogoClick}
            >
              <div className="w-4 h-4 border border-gold-vintage/50 group-hover:border-gold-vintage flex items-center justify-center rotate-45 transition-transform duration-500 group-hover:rotate-135 shrink-0">
                <div className="w-1 h-1 bg-gold-vintage shadow-[0_0_4px_rgba(212,175,55,0.9)]"></div>
              </div>
              <h1 className="font-display font-medium text-[11px] sm:text-xs tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-gold-bright via-gold-vintage to-amber-200 uppercase antialiased">
                Dakshinaasya Darshini
              </h1>
            </div>

            {/* Subtle Vertical Separator (Desktop) */}
            <div className="hidden md:block w-[1px] h-3.5 bg-white/10 shrink-0" />

            {/* Right: Desktop Navigation Items with Active Capsule */}
            <nav className="hidden md:flex items-center gap-1 text-[10.5px] font-mono tracking-[0.14em] uppercase">
              {navItems.map((navItem) => (
                <button
                  key={navItem.id}
                  onClick={() => handleNavClick(navItem.id)}
                  className={`relative py-1 px-3 rounded-full transition-all duration-200 cursor-pointer ${
                    navItem.active
                      ? "bg-gold-vintage/15 text-gold-vintage font-semibold border border-gold-vintage/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{navItem.label}</span>
                </button>
              ))}
            </nav>

            {/* User Session Clearances (Desktop) */}
            {currentUser && (
              <div className="hidden md:flex items-center gap-2 pl-1 border-l border-white/10 shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  loading="lazy"
                  decoding="async"
                  className="w-5 h-5 rounded-full border border-gold-vintage/40"
                  title={currentUser.name}
                />
                <button
                  onClick={() => setCurrentUser(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle (Mobile Only) */}
            <div className="md:hidden flex items-center gap-1.5 shrink-0">
              {currentUser && (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  loading="lazy"
                  decoding="async"
                  className="w-5 h-5 rounded-full border border-gold-vintage/40"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 rounded-full text-slate-300 hover:text-gold-vintage focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 text-gold-vintage" />
                ) : (
                  <Menu className="w-4 h-4 text-slate-300" />
                )}
              </button>
            </div>
          </motion.header>

          {/* Mobile Navigation Dropdown Card */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="pointer-events-auto md:hidden w-[calc(100vw-2rem)] max-w-xs mt-2 bg-[#07060b]/98 backdrop-blur-2xl border border-gold-vintage/25 shadow-2xl rounded-2xl p-3 flex flex-col space-y-2 z-40"
              >
                <div className="flex flex-col space-y-1">
                  <span className="text-[8px] font-mono tracking-[0.28em] text-slate-500 uppercase ml-2 mb-0.5">Sectors</span>
                  {navItems.map((navItem) => (
                    <button
                      key={navItem.id}
                      onClick={() => handleNavClick(navItem.id)}
                      className={`text-left text-[11px] font-mono tracking-wider uppercase transition-colors py-1.5 px-3 rounded-lg block ${
                        navItem.active
                          ? "text-gold-vintage bg-gold-vintage/15 border border-gold-vintage/35 font-medium"
                          : "text-slate-300 hover:text-gold-vintage hover:bg-white/[0.04]"
                      }`}
                    >
                      {navItem.label}
                    </button>
                  ))}
                </div>

                {/* Profile row inside mobile menu */}
                {currentUser && (
                  <div className="border-t border-white/[0.08] pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        loading="lazy"
                        decoding="async"
                        className="w-5 h-5 rounded-full border border-gold-vintage/40"
                      />
                      <span className="text-[10px] text-slate-300 font-sans">{currentUser.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentUser(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-1 p-1 px-2 rounded hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Exit</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
