import React, { useState, useEffect, useRef } from "react";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Mail from "lucide-react/dist/esm/icons/mail";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import ArrowUp from "lucide-react/dist/esm/icons/arrow-up";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import Youtube from "lucide-react/dist/esm/icons/youtube";
import Compass from "lucide-react/dist/esm/icons/compass";
import Layers from "lucide-react/dist/esm/icons/layers";
import X from "lucide-react/dist/esm/icons/x";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check";
import FileText from "lucide-react/dist/esm/icons/file-text";
import { Quote } from "../../types/types";
import { getSectionPath } from "../../utils/navigation";

interface FooterProps {
  dailyQuote?: Quote | null;
  route?: string;
  isLanding?: boolean;
}

interface QuickLink {
  label: string;
  href: string;
  targetId: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: "Discover", href: "/#hero", targetId: "discover" },
  { label: "Themes", href: "/themes", targetId: "themes" },
  { label: "Technical Workshop", href: "/#technical-workshop", targetId: "technical-workshop" },
  { label: "Tattva Darśana", href: "/#tattva-darshana", targetId: "tattva-darshana" },
  { label: "Innovation Timeline", href: "/#innovation-timeline", targetId: "timeline" },
  { label: "Notice Board", href: "/#notice-board", targetId: "notice-board" },
  { label: "Register", href: "/#registration", targetId: "registration" },
];

function VenueMapEmbed() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="rounded-lg border border-gold-vintage/20 w-full overflow-hidden bg-[#0c0c14]"
      style={{ height: 180 }}
    >
      {loadMap ? (
        <iframe
          title="Jyothy Institute of Technology Location"
          src="https://maps.google.com/maps?q=Jyothy+Institute+of+Technology,+Tataguni,+Bengaluru&t=&z=15&ie=UTF8&iwloc=B&output=embed"
          width="100%"
          height="180"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      ) : null}
    </div>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.77.463 3.498 1.343 5.026L2 22l5.109-1.339a10.005 10.005 0 004.922 1.282h.004c5.532 0 10.027-4.495 10.027-10.031 0-2.678-1.043-5.198-2.936-7.091A10.005 10.005 0 0012.031 2zm0 18.356c-1.503 0-2.975-.404-4.258-1.169l-.305-.181-3.164.83.844-3.084-.199-.317a8.318 8.318 0 01-1.275-4.398c0-4.606 3.747-8.353 8.357-8.353 2.232 0 4.33.869 5.908 2.448a8.307 8.307 0 012.444 5.908c0 4.606-3.748 8.356-8.357 8.356zm4.582-6.257c-.251-.126-1.488-.734-1.718-.818-.231-.084-.399-.126-.566.126-.168.251-.65 1-.796 1.168-.147.168-.293.189-.545.063-.251-.126-1.061-.391-2.022-1.248-.748-.667-1.253-1.492-1.4-1.743-.147-.251-.016-.387.11-.512.113-.113.251-.293.377-.44.126-.147.168-.251.251-.419.084-.168.042-.314-.021-.44-.063-.126-.566-1.364-.775-1.868-.204-.492-.41-.425-.566-.433-.146-.008-.314-.01-.482-.01-.168 0-.44.063-.67.314-.231.251-.88 1.026-.88 2.293 0 1.267.923 2.493 1.052 2.668.129.175 1.815 2.771 4.397 3.886.614.266 1.094.425 1.468.544.617.196 1.179.168 1.623.102.495-.074 1.488-.608 1.698-1.197.209-.589.209-1.094.147-1.197-.063-.105-.231-.168-.482-.294z" />
    </svg>
  );
}

export default function Footer({ route, isLanding = false }: FooterProps) {
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  // Do not render full footer on 3D intro landing screen
  if (isLanding || route === "landing") {
    return null;
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: QuickLink) => {
    e.preventDefault();

    if (link.targetId === "discover" || link.targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      return;
    }

    const targetEl =
      document.getElementById(link.targetId) ||
      document.getElementById(link.targetId.replace("innovation-", "")) ||
      document.getElementById(link.href.replace("/#", ""));

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
      window.history.pushState({ sectionId: link.targetId }, "", getSectionPath(link.targetId));
    } else {
      window.location.assign(getSectionPath(link.targetId));
    }
  };

  return (
    <>
      <footer
        id="site-footer"
        className="w-full bg-[#08080c] border-t border-gold-vintage/20 text-slate-300 relative z-20 overflow-hidden"
      >
        {/* Subtle top ambient glow in cyan theme */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-gold-vintage/40 to-transparent pointer-events-none" />

        {/* Main 3-Column Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* COLUMN 1: Event Venue Map (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-gold-vintage" />
                <h3 className="text-gold-vintage font-mono text-sm tracking-wider uppercase font-semibold">
                  LOCATION / VENUE
                </h3>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-slate-200 font-medium tracking-wide">
                  Jyothy Institute of Technology
                </p>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Bengaluru, Karnataka, India
                </p>
              </div>

              <VenueMapEmbed />

              <a
                href="https://maps.google.com/?q=Jyothy+Institute+of+Technology+Tataguni+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-gold-vintage hover:text-gold-vintage transition-colors w-fit group"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* COLUMN 2: Quick Access Links (lg:col-span-3) */}
            <div className="lg:col-span-3 flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold-vintage" />
                <h3 className="text-gold-vintage font-mono text-sm tracking-wider uppercase font-semibold">
                  QUICK ACCESS
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Jump directly to sections across the Vedanta Makeathon portal:
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 pt-1">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className="group inline-flex items-center gap-2 text-xs text-slate-300 hover:text-gold-vintage transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-vintage/40 group-hover:bg-gold-vintage group-hover:scale-125 transition-all" />
                      <span className="font-sans group-hover:translate-x-0.5 transition-transform">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: Contact & Social Media + WhatsApp QR (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-vintage" />
                <h3 className="text-gold-vintage font-mono text-sm tracking-wider uppercase font-semibold">
                  CONTACT
                </h3>
              </div>

              {/* Email link */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block">
                  Official Inquiries
                </span>
                <a
                  href="mailto:dakshinaasyadarshini@jyothyit.ac.in"
                  className="inline-flex items-center gap-2 text-xs font-mono text-gold-vintage hover:text-gold-vintage break-all transition-colors p-2 rounded-md bg-gold-vintage/5 border border-gold-vintage/20 hover:border-gold-vintage/40"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0 text-gold-vintage" />
                  <span>dakshinaasyadarshini@jyothyit.ac.in</span>
                </a>
              </div>

              {/* Address */}
              <div className="space-y-1.5 pt-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block">
                  Location Address
                </span>
                <div className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed font-sans">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-gold-vintage mt-0.5" />
                  <span>
                    Jyothy Institute of Technology, Tataguni, Off Kanakapura Road, Bengaluru – 560082, Karnataka, India
                  </span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-2 pt-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block">
                  Connect With Us
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://www.instagram.com/dakshinaasyadarshini?igsh=MWhtbTZ2c3h5bzJ6Yg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Page"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-gold-vintage/50 hover:bg-neutral-800 text-slate-300 hover:text-gold-vintage text-xs font-mono transition-all group"
                  >
                    <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span>Instagram</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>

                  <a
                    href="https://www.youtube.com/playlist?list=PLIZb7NwR7V4uWDmuxUotrpTEa6gfb4vUg"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube Playlist"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-gold-vintage/50 hover:bg-neutral-800 text-slate-300 hover:text-gold-vintage text-xs font-mono transition-all group"
                  >
                    <Youtube className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                    <span>YouTube</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>

                  <a
                    href="https://chat.whatsapp.com/CQl9gndiTJeCzKRgkTanlP"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp Community"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-[#25D366]/50 hover:bg-neutral-800 text-slate-300 hover:text-[#25D366] text-xs font-mono transition-all group"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                    <span>WhatsApp</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* WhatsApp Community QR Code Card */}
              <div className="pt-2">
                <div className="p-3.5 sm:p-4 rounded-xl border border-gold-vintage/25 bg-[#0c0c16]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-gold-vintage/45 transition-all">
                  {/* Subtle decorative ambient glow */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#25D366]/10 rounded-full blur-xl pointer-events-none" />

                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#25D366]/15 flex items-center justify-center border border-[#25D366]/40">
                        <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                      </div>
                      <span className="text-[11px] font-mono tracking-wider uppercase text-[#25D366] font-semibold">
                        WhatsApp Community
                      </span>
                    </div>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[9px] text-[#25D366] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                      Official
                    </span>
                  </div>

                  {/* Group Name */}
                  <p className="text-xs text-slate-200 font-medium tracking-wide mb-2.5">
                    Vedanta Makeathon Participants - 2026
                  </p>

                  {/* QR Image + Instruction & CTA */}
                  <div className="flex items-center gap-3">
                    {/* QR Code */}
                    <a
                      href="https://chat.whatsapp.com/CQl9gndiTJeCzKRgkTanlP"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white rounded-lg shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.2)] hover:scale-105 transition-transform cursor-pointer block"
                      title="Scan or click to open WhatsApp group"
                    >
                      <img
                        src="/whatsapp_qr_code.png"
                        alt="WhatsApp Group QR Code"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded"
                        loading="lazy"
                      />
                    </a>

                    {/* Instruction & Action button */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 gap-2">
                      <p className="text-[11px] text-slate-400 font-sans leading-snug">
                        Scan QR with phone camera or tap below to join.
                      </p>
                      <a
                        href="https://chat.whatsapp.com/CQl9gndiTJeCzKRgkTanlP"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(37,211,102,0.25)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] active:scale-[0.98]"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                        <span>Join Group</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-neutral-950" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright, Terms & Privacy Modals, Scroll to Top */}
        <div className="border-t border-neutral-800/80 bg-[#060609] py-5 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            
            {/* Copyright & Legal Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500 tracking-wider">
                © 2026 DAKSHINAASYA DARSHINI
              </span>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <button
                type="button"
                onClick={() => setActiveModal("privacy")}
                className="text-slate-400 hover:text-gold-vintage transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-neutral-700">•</span>
              <button
                type="button"
                onClick={() => setActiveModal("terms")}
                className="text-slate-400 hover:text-gold-vintage transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Terms &amp; Conditions
              </button>
            </div>

            {/* Scroll To Top Button */}
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                onClick={handleScrollToTop}
                aria-label="Scroll to top"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:border-gold-vintage/60 hover:bg-gold-vintage/10 text-slate-300 hover:text-gold-vintage text-xs font-mono transition-all duration-200 cursor-pointer shadow-sm group"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5 text-gold-vintage group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {activeModal === "privacy" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-policy-title"
        >
          <div
            className="bg-[#0c0c14] border border-gold-vintage/30 rounded-xl p-6 sm:p-8 max-w-lg w-full text-slate-300 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-gold-vintage" />
                <h3
                  id="privacy-policy-title"
                  className="font-mono text-base sm:text-lg font-semibold text-white tracking-wide uppercase"
                >
                  Privacy Policy
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-slate-300">
              <div className="space-y-1">
                <h4 className="text-gold-vintage font-mono font-medium text-xs uppercase tracking-wider">
                  1. Data Collection
                </h4>
                <p className="text-slate-300">
                  Information provided during registration and retrieved via Google Sign-In / Autocomplete (e.g., name, email, college details) is stored securely in our database.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-gold-vintage font-mono font-medium text-xs uppercase tracking-wider">
                  2. Data Usage
                </h4>
                <p className="text-slate-300">
                  Collected contact information will strictly be used by event organizers to communicate official updates, schedule notifications, team status, and makeathon logistics.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-gold-vintage font-mono font-medium text-xs uppercase tracking-wider">
                  3. Data Protection
                </h4>
                <p className="text-slate-300">
                  Personal data will not be sold or shared with unauthorized third parties.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-gold-vintage/10 border border-gold-vintage/30 hover:bg-gold-vintage/20 text-gold-vintage text-xs font-mono transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {activeModal === "terms" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-conditions-title"
        >
          <div
            className="bg-[#0c0c14] border border-gold-vintage/30 rounded-xl p-6 sm:p-8 max-w-lg w-full text-slate-300 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-gold-vintage" />
                <h3
                  id="terms-conditions-title"
                  className="font-mono text-base sm:text-lg font-semibold text-white tracking-wide uppercase"
                >
                  Terms &amp; Conditions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-slate-300">
              <div className="space-y-1">
                <h4 className="text-gold-vintage font-mono font-medium text-xs uppercase tracking-wider">
                  1. Judging &amp; Results
                </h4>
                <p className="text-slate-300">
                  All evaluations and winner selections made by the panel of judges are final and binding.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-gold-vintage font-mono font-medium text-xs uppercase tracking-wider">
                  2. Food, Lodging &amp; Training
                </h4>
                <p className="text-slate-300">
                  Lodging and catering are managed and provided by the organizer, and training is provided by Param Foundation and the organizer.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-gold-vintage font-mono font-medium text-xs uppercase tracking-wider">
                  3. Code of Conduct &amp; Prohibited Items
                </h4>
                <p className="text-slate-300">
                  Zero tolerance for contraband, illicit substances, or alcohol on campus or event premises. Violators will face immediate disqualification and removal from the event.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-gold-vintage/10 border border-gold-vintage/30 hover:bg-gold-vintage/20 text-gold-vintage text-xs font-mono transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
