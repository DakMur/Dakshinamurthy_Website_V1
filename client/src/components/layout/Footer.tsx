import React from "react";
import {
  MapPin,
  Mail,
  ExternalLink,
  ArrowUp,
  Instagram,
  Youtube,
  Compass,
  Layers,
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

export default function Footer({ dailyQuote, route, isLanding = false }: FooterProps) {
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

  const defaultQuoteText = "The Atman is the light of all lights.";
  const defaultQuoteAuthor = "Brihadaranyaka Upanishad";

  const quoteText = dailyQuote?.text || defaultQuoteText;
  const quoteAuthor = dailyQuote?.author
    ? `${dailyQuote.author}${dailyQuote.category ? ` (${dailyQuote.category})` : ""}`
    : defaultQuoteAuthor;

  return (
    <footer
      id="site-footer"
      className="w-full bg-[#08080c] border-t border-amber-500/20 text-slate-300 relative z-20 overflow-hidden"
    >
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

      {/* Main 3-Column Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* COLUMN 1: Event Venue Map (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-500" />
              <h3 className="text-amber-500 font-mono text-sm tracking-wider uppercase font-semibold">
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

            {/* Embedded Google Map iframe */}
            <div className="w-full rounded-lg overflow-hidden border border-neutral-800 bg-[#0c0c14] shadow-lg group relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.967838531535!2d77.5147517!3d12.8453444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae40f1a30a84e3%3A0xb36712b7a942a781!2sJyothy%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-44 border-0 filter grayscale-[15%] contrast-[1.08] group-hover:grayscale-0 transition-all duration-500"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jyothy Institute of Technology Venue Map"
              />
            </div>

            <a
              href="https://maps.google.com/?q=Jyothy+Institute+of+Technology+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-500/90 hover:text-amber-400 transition-colors w-fit group"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* COLUMN 2: Quick Access Links (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <h3 className="text-amber-500 font-mono text-sm tracking-wider uppercase font-semibold">
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
                    className="group inline-flex items-center gap-2 text-xs text-slate-300 hover:text-amber-400 transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40 group-hover:bg-amber-400 group-hover:scale-125 transition-all" />
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
              <Mail className="w-4 h-4 text-amber-500" />
              <h3 className="text-amber-500 font-mono text-sm tracking-wider uppercase font-semibold">
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
                className="inline-flex items-center gap-2 text-xs font-mono text-amber-400/90 hover:text-amber-300 break-all transition-colors p-2 rounded-md bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30"
              >
                <Mail className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span>dakshinaasyadarshini.jit@gmail.com</span>
              </a>
            </div>

            {/* Address */}
            <div className="space-y-1.5 pt-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block">
                Location Address
              </span>
              <div className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed font-sans">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-500/80 mt-0.5" />
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800 text-slate-300 hover:text-amber-400 text-xs font-mono transition-all group"
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800 text-slate-300 hover:text-amber-400 text-xs font-mono transition-all group"
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

      {/* Bottom Bar: Quote, Copyright & Scroll to Top */}
      <div className="border-t border-neutral-800/80 bg-[#060609] py-5 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Quote & Copyright */}
          <div className="flex flex-col space-y-1.5 max-w-3xl">
            <p className="font-serif italic text-slate-300/90 text-xs sm:text-sm tracking-wide">
              &ldquo;{quoteText}&rdquo;{" "}
              <span className="text-amber-500 font-mono text-[11px] not-italic ml-1.5 inline-block">
                – {quoteAuthor}
              </span>
            </p>
            <div className="font-mono text-[10px] sm:text-[11px] tracking-widest text-slate-500 uppercase">
              © 2026 DAKSHINAASYA DARSHINI • SRI SHANKARA PARAMPARA
            </div>
          </div>

          {/* Scroll To Top Button */}
          <div className="shrink-0 flex items-center">
            <button
              onClick={handleScrollToTop}
              aria-label="Scroll to top"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/60 hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 text-xs font-mono transition-all duration-200 cursor-pointer shadow-sm group"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-amber-500 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
