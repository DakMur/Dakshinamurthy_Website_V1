import { motion, AnimatePresence } from "motion/react";
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import { User, DomainContent } from "../../types/types";

interface NavbarProps {
  route: string;
  setRoute: (route: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  setSelectedDomain: (domain: DomainContent | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({
  route,
  setRoute,
  currentUser,
  setCurrentUser,
  setSelectedDomain,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavbarProps) {
  const isPrathamaActive = route === "prathama" || route === "prathama-prakasa" || route === "storytelling";
  const isTattvaActive = route === "tattva" || route === "tattva-darsana" || route === "domains";
  const isTimelineActive = route === "timeline" || route === "chronology-timeline" || route === "flow";
  const isNoticeBoardActive = route === "notices";
  const isRegistrationActive = route === "registration" || route === "admin";

  const navItems = [
    { id: "prathama", label: "Prathama Prakasa", active: isPrathamaActive },
    { id: "tattva", label: "Tattva Darśana", active: isTattvaActive },
    { id: "timeline", label: "Innovation Timeline", active: isTimelineActive },
    { id: "notices", label: "Notice Board", active: isNoticeBoardActive },
    { id: "registration", label: "Registration", active: isRegistrationActive }
  ];

  return (
    <AnimatePresence>
      {route !== "landing" && route !== "home" && (
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-30 w-full bg-black/40 backdrop-blur-sm border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between relative transform-gpu will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          <div
            className="flex items-center gap-3.5 cursor-pointer selection:bg-none"
            onClick={() => {
              setRoute("landing");
              setSelectedDomain(null);
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="w-6 h-6 border border-gold-vintage/50 flex items-center justify-center rotate-45 transition-transform hover:rotate-135 duration-700 shrink-0 select-none">
              <div className="w-1.5 h-1.5 bg-gold-vintage"></div>
            </div>
            <h1 className="font-display font-medium text-lg tracking-[0.25em] text-gold-vintage uppercase antialiased">
              Dakshinaasya Darshini
            </h1>
          </div>

          {/* Nav stack links (Desktop Only) */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-widest uppercase">
            {navItems.map((navItem) => (
              <button
                key={navItem.id}
                onClick={() => {
                  setRoute(navItem.id);
                  setSelectedDomain(null);
                }}
                className={`hover:text-gold-vintage transition-all text-slate-300 relative py-1 cursor-pointer ${
                  navItem.active ? "text-gold-vintage font-semibold" : ""
                }`}
              >
                <span>{navItem.label}</span>
                {navItem.active && (
                  <motion.div
                    layoutId="nav-line"
                    className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gold-vintage"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Profile status / Google Sync integrations (Desktop Only) */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono text-gold-vintage block uppercase font-medium">
                    {currentUser.role} Clearances
                  </span>
                  <span className="text-xs text-slate-300 block font-sans">{currentUser.name}</span>
                </div>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  loading="lazy"
                  decoding="async"
                  className="w-8 h-8 rounded-full border border-gold-vintage/30 shadow-lg"
                  title="User Session Active"
                />
                <button
                  onClick={() => setCurrentUser(null)}
                  className="p-1 px-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-xs font-mono cursor-pointer border border-white/10"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Header action block: Hamburger icon toggle + current user avatar (Mobile Only) */}
          <div className="md:hidden flex items-center gap-3">
            {currentUser && (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                loading="lazy"
                decoding="async"
                className="w-7 h-7 rounded-full border border-gold-vintage/30 shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-white/10 text-slate-300 hover:text-gold-vintage focus:outline-none transition-colors duration-300 cursor-pointer"
              aria-label="Toggle celestial menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gold-vintage" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>

          {/* Mobile Expandable Nav Overlay container */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="md:hidden absolute top-[100%] left-0 right-0 bg-[#08080a]/95 border-b border-white/10 shadow-2xl z-40 overflow-hidden flex flex-col px-6 py-6 space-y-5"
              >
                <div className="flex flex-col space-y-2.5">
                  <span className="text-[9px] font-mono tracking-[0.4em] text-slate-500 uppercase ml-2 mb-1">Navigation Sectors</span>
                  {navItems.map((navItem) => (
                    <button
                      key={navItem.id}
                      onClick={() => {
                        setRoute(navItem.id);
                        setSelectedDomain(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left text-xs font-mono tracking-widest uppercase transition-colors py-2.5 px-3 rounded-lg block ${
                        navItem.active 
                          ? "text-gold-vintage bg-white/5 border-l-2 border-gold-vintage font-semibold" 
                          : "text-slate-300 hover:text-gold-vintage hover:bg-white/[0.02]"
                      }`}
                    >
                      {navItem.label}
                    </button>
                  ))}
                </div>

                {/* Profile section or Sync button duplication for mobile inside menu */}
                <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                  {currentUser ? (
                    <div className="flex items-center justify-between bg-white/[0.01] border border-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          loading="lazy"
                          decoding="async"
                          className="w-8 h-8 rounded-full border border-gold-vintage/30"
                        />
                        <div>
                          <span className="text-[9px] font-mono text-gold-vintage block uppercase">
                            {currentUser.role} Clearances
                          </span>
                          <span className="text-xs text-slate-300 block font-sans">{currentUser.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-1.5 p-1.5 px-3 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-xs font-mono border border-white/10 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Exit</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
