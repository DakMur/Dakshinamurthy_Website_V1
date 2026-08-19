import React, { useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  ExternalLink,
  ArrowUp,
  Instagram,
  Youtube,
  Compass,
  Layers,
  X,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Quote } from "../../types/types";

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
  { label: "Home", href: "/#hero", targetId: "discover" },
  { label: "Technical Workshop", href: "/#technical-workshop", targetId: "technical-workshop" },
  { label: "Tattva Darśana", href: "/#tattva-darshana", targetId: "tattva-darshana" },
  { label: "Innovation Timeline", href: "/#innovation-timeline", targetId: "timeline" },
  { label: "Notice Board", href: "/#notice-board", targetId: "notice-board" },
  { label: "Register", href: "/#registration", targetId: "registration" },
];

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
      window.history.pushState(null, "", link.href);
    } else {
      window.location.hash = link.href.replace("/", "");
    }
  };

  return (
    <>
      <footer
        id="site-footer"
        className="w-full bg-[#08080c] border-t border-cyan-500/20 text-slate-300 relative z-20 overflow-hidden"
      >
        {/* Subtle top ambient glow in cyan theme */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />

        {/* Main 3-Column Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* COLUMN 1: Event Venue Map (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-cyan-400 font-mono text-sm tracking-wider uppercase font-semibold">
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

              {/* Embedded Google Map iframe with explicit pin marker */}
              <div className="w-full rounded-lg overflow-hidden border border-neutral-800 bg-[#0c0c14] shadow-lg group relative">
                <iframe
                  src="https://maps.google.com/maps?q=Jyothy+Institute+of+Technology,+Tataguni,+Bengaluru&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                  className="w-full h-48 border-0 filter grayscale-[10%] contrast-[1.05] group-hover:grayscale-0 transition-all duration-500"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Jyothy Institute of Technology Venue Map Location"
                />
              </div>

              <a
                href="https://maps.google.com/?q=Jyothy+Institute+of+Technology+Tataguni+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors w-fit group"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* COLUMN 2: Quick Access Links (lg:col-span-3) */}
            <div className="lg:col-span-3 flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-cyan-400 font-mono text-sm tracking-wider uppercase font-semibold">
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
                      className="group inline-flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 group-hover:scale-125 transition-all" />
                      <span className="font-sans group-hover:translate-x-0.5 transition-transform">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: Contact & Social Media (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <h3 className="text-cyan-400 font-mono text-sm tracking-wider uppercase font-semibold">
                  CONTACT
                </h3>
              </div>

              {/* Email link */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block">
                  Official Inquiries
                </span>
                <a
                  href="mailto:dakshinaasyadarshini.jit@gmail.com"
                  className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 break-all transition-colors p-2 rounded-md bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span>dakshinaasyadarshini.jit@gmail.com</span>
                </a>
              </div>

              {/* Address */}
              <div className="space-y-1.5 pt-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block">
                  Location Address
                </span>
                <div className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed font-sans">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400 mt-0.5" />
                  <span>
                    Jyothy Institute of Technology, Tataguni, Off Kanakapura Road, Bengaluru – 560082, Karnataka, India
                  </span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-2 pt-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block">
                  Connect With Us
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://www.instagram.com/dakshinasyadarshini/?utm_source=ig_web_button_share_sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Page"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800 text-slate-300 hover:text-cyan-400 text-xs font-mono transition-all group"
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800 text-slate-300 hover:text-cyan-400 text-xs font-mono transition-all group"
                  >
                    <Youtube className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                    <span>YouTube</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
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
                className="text-slate-400 hover:text-cyan-400 transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-neutral-700">•</span>
              <button
                type="button"
                onClick={() => setActiveModal("terms")}
                className="text-slate-400 hover:text-cyan-400 transition-colors underline-offset-4 hover:underline cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:border-cyan-500/60 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 text-xs font-mono transition-all duration-200 cursor-pointer shadow-sm group"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
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
            className="bg-[#0c0c14] border border-cyan-500/30 rounded-xl p-6 sm:p-8 max-w-lg w-full text-slate-300 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
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
                <h4 className="text-cyan-400 font-mono font-medium text-xs uppercase tracking-wider">
                  1. Data Collection
                </h4>
                <p className="text-slate-300">
                  Information provided during registration and retrieved via Google Sign-In / Autocomplete (e.g., name, email, college details) is stored securely in our database.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-cyan-400 font-mono font-medium text-xs uppercase tracking-wider">
                  2. Data Usage
                </h4>
                <p className="text-slate-300">
                  Collected contact information will strictly be used by event organizers to communicate official updates, schedule notifications, team status, and makeathon logistics.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-cyan-400 font-mono font-medium text-xs uppercase tracking-wider">
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
                className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono transition-colors cursor-pointer"
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
            className="bg-[#0c0c14] border border-cyan-500/30 rounded-xl p-6 sm:p-8 max-w-lg w-full text-slate-300 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-cyan-400" />
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
                <h4 className="text-cyan-400 font-mono font-medium text-xs uppercase tracking-wider">
                  1. Judging &amp; Results
                </h4>
                <p className="text-slate-300">
                  All evaluations and winner selections made by the panel of judges are final and binding.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-cyan-400 font-mono font-medium text-xs uppercase tracking-wider">
                  2. Food, Lodging &amp; Training
                </h4>
                <p className="text-slate-300">
                  All training sessions, lodging, and catering are managed and provided directly by Param Foundation. Event organizers and host institutions assume zero liability or responsibility for these arrangements.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-cyan-400 font-mono font-medium text-xs uppercase tracking-wider">
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
                className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono transition-colors cursor-pointer"
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
