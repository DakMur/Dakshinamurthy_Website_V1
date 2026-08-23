import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import { User, DomainContent } from "../../types/types";

interface GlobalHamburgerMenuProps {
  isLanding?: boolean;
  route?: string;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
  onNavigateLanding?: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  setSelectedDomain: (domain: DomainContent | null) => void;
}

export default function GlobalHamburgerMenu({
  isLanding = false,
  route = "landing",
  activeSection,
  onNavigateSection,
  onNavigateLanding,
  currentUser,
  setCurrentUser,
  setSelectedDomain,
}: GlobalHamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentActive = isLanding ? "landing" : (activeSection || route);

  const isLandingActive = isLanding || currentActive === "landing" || currentActive === "home";
  const isDiscoverActive = !isLanding && (currentActive === "discover" || currentActive === "prathama-prakasha" || currentActive === "prathama" || currentActive === "prathama-prakasa" || currentActive === "storytelling");
  const isWorkshopActive = !isLanding && (currentActive === "technical-workshop" || currentActive === "workshop" || currentActive === "param-workshop");
  const isTattvaActive = !isLanding && (currentActive === "tattva-darshana" || currentActive === "tattva" || currentActive === "tattva-darsana" || currentActive === "domains");
  const isTimelineActive = !isLanding && (currentActive === "timeline" || currentActive === "innovation-timeline" || currentActive === "chronology-timeline" || currentActive === "flow" || currentActive === "marga-darshana");
  const isNoticeBoardActive = !isLanding && (currentActive === "notice-board" || currentActive === "notices");
  const isRegistrationActive = !isLanding && (currentActive === "registration" || currentActive === "registrations" || currentActive === "admin" || currentActive === "workspace");

  const navItems = [
    { id: "landing", label: "Home / Darśini", active: isLandingActive, isHome: true },
    { id: "discover", label: "Discover", active: isDiscoverActive },
    { id: "technical-workshop", label: "Technical Workshop", active: isWorkshopActive },
    { id: "tattva-darshana", label: "Tattva Darśana", active: isTattvaActive },
    { id: "timeline", label: "Timeline", active: isTimelineActive },
    { id: "notice-board", label: "Notice Board", active: isNoticeBoardActive },
    { id: "registration", label: "Registration", active: isRegistrationActive }
  ];

  // Close menu on click outside and escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleItemClick = (item: typeof navItems[0]) => {
    setSelectedDomain(null);
    setIsOpen(false);

    if (item.isHome) {
      if (onNavigateLanding) {
        onNavigateLanding();
      }
    } else {
      if (onNavigateSection) {
        onNavigateSection(item.id);
      }
    }
  };

  return (
    <div ref={menuRef} className="fixed top-4 right-4 sm:top-5 sm:right-6 md:top-6 md:right-8 z-50 select-none">
      {/* Global Compact Hamburger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center border shadow-lg ${
          isOpen
            ? "bg-[#09080e]/95 text-gold-vintage border-gold-vintage/50 shadow-[0_0_16px_rgba(212,175,55,0.25)]"
            : "bg-[#09080e]/80 hover:bg-[#09080e]/95 text-slate-300 hover:text-gold-vintage border-white/[0.08] hover:border-gold-vintage/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        }`}
        aria-label="Toggle Global Navigation Menu"
        title="Global Menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gold-vintage" />
        ) : (
          <Menu className="w-5 h-5 text-slate-200 hover:text-gold-vintage" />
        )}
      </button>

      {/* Floating Compact Glass Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2.5 w-60 sm:w-64 bg-[#08070d]/95 backdrop-blur-2xl border border-gold-vintage/30 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_16px_rgba(212,175,55,0.1)] rounded-2xl p-2.5 flex flex-col space-y-1 overflow-hidden"
          >
            {/* Header Brand */}
            <div className="px-3 py-2 border-b border-white/[0.07] flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border border-gold-vintage/50 flex items-center justify-center rotate-45 shrink-0">
                  <div className="w-1 h-1 bg-gold-vintage shadow-[0_0_4px_rgba(212,175,55,0.9)]" />
                </div>
                <span className="font-display font-medium text-[11px] tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-gold-bright via-gold-vintage to-amber-200 uppercase antialiased">
                  Navigation
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase">Sectors</span>
            </div>

            {/* Menu Items List */}
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left text-[11.5px] font-mono tracking-wider uppercase py-2 px-3 rounded-lg flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    item.active
                      ? "bg-gold-vintage/15 text-gold-vintage border border-gold-vintage/35 shadow-[0_0_8px_rgba(212,175,55,0.15)] font-medium"
                      : "text-slate-300 hover:text-slate-100 hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-vintage shadow-[0_0_6px_rgba(212,175,55,0.9)]" />
                  )}
                </button>
              ))}
            </nav>

            {/* Authenticated User Status inside Panel */}
            {currentUser && (
              <div className="border-t border-white/[0.08] mt-1 pt-2 px-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    loading="lazy"
                    decoding="async"
                    className="w-5 h-5 rounded-full border border-gold-vintage/40"
                  />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-gold-vintage/90 uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                    <span className="text-[10.5px] text-slate-300 font-sans leading-tight">
                      {currentUser.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
