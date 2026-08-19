import { motion, AnimatePresence } from "motion/react";
import LogOut from 'lucide-react/dist/esm/icons/log-out';
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
}: NavbarProps) {
  const currentActive = activeSection || route;

  const isPrathamaActive = currentActive === "prathama-prakasha" || currentActive === "prathama" || currentActive === "prathama-prakasa" || currentActive === "storytelling";
  const isWorkshopActive = currentActive === "technical-workshop" || currentActive === "workshop" || currentActive === "param-workshop";
  const isTattvaActive = currentActive === "tattva-darshana" || currentActive === "tattva" || currentActive === "tattva-darsana" || currentActive === "domains";
  const isTimelineActive = currentActive === "innovation-timeline" || currentActive === "timeline" || currentActive === "chronology-timeline" || currentActive === "flow";
  const isNoticeBoardActive = currentActive === "notice-board" || currentActive === "notices";
  const isRegistrationActive = currentActive === "registration" || currentActive === "admin" || currentActive === "workspace";

  const navItems = [
    { id: "prathama-prakasha", label: "Discover", active: isPrathamaActive },
    { id: "technical-workshop", label: "Technical Workshop", active: isWorkshopActive },
    { id: "tattva-darshana", label: "Tattva Darśana", active: isTattvaActive },
    { id: "innovation-timeline", label: "Innovation Timeline", active: isTimelineActive },
    { id: "notice-board", label: "Notice Board", active: isNoticeBoardActive },
    { id: "registration", label: "Registration", active: isRegistrationActive }
  ];

  const handleNavClick = (sectionId: string) => {
    setSelectedDomain(null);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else if (setRoute) {
      setRoute(sectionId);
    }
  };

  const handleLogoClick = () => {
    setSelectedDomain(null);
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
          {/* Centered Compact Navigation Pill Bar */}
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
          </motion.header>
        </div>
      )}
    </AnimatePresence>
  );
}
