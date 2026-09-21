import { lazy, Suspense } from "react";
import { Globe, Instagram, Youtube, Mail, BookOpen, ExternalLink } from "lucide-react";
import { WebGLErrorBoundary } from "../components/error/WebGLErrorBoundary";

const CosmicGalaxy = lazy(() => import("../features/landing-main/CosmicGalaxy"));

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
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

interface LinkItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  id: string;
}

const links: LinkItem[] = [
  {
    id: "contact-website",
    icon: <Globe className="text-[#d4af37] w-5 h-5 absolute left-4" />,
    label: "Website",
    href: "https://vedanta-makeathon.vercel.app/",
  },
  {
    id: "contact-whatsapp",
    icon: <WhatsAppIcon className="text-[#25D366] w-5 h-5 absolute left-4" />,
    label: "WhatsApp Community",
    href: "https://chat.whatsapp.com/CQl9gndiTJeCzKRgkTanlP",
  },
  {
    id: "contact-instagram",
    icon: <Instagram className="text-[#d4af37] w-5 h-5 absolute left-4" />,
    label: "Instagram",
    href: "https://www.instagram.com/dakshinaasyadarshini?igsh=MWhtbTZ2c3h5bzJ6Yg==",
  },
  {
    id: "contact-youtube",
    icon: <Youtube className="text-[#d4af37] w-5 h-5 absolute left-4" />,
    label: "YouTube",
    href: "https://www.youtube.com/playlist?list=PLIZb7NwR7V4uWDmuxUotrpTEa6gfb4vUg",
  },
  {
    id: "contact-email",
    icon: <Mail className="text-[#d4af37] w-5 h-5 absolute left-4" />,
    label: "Email",
    href: "mailto:dakshinaasyadarshini@jyothyit.ac.in",
  },
  {
    id: "contact-brochure",
    icon: <BookOpen className="text-[#d4af37] w-5 h-5 absolute left-4" />,
    label: "Brochure",
    href: "https://heyzine.com/flip-book/3846397c63.html",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-transparent min-h-screen w-full text-white relative flex flex-col items-center justify-center px-4 py-12 overflow-x-hidden">
      {/* Animated Galaxy/Particle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <WebGLErrorBoundary>
            <CosmicGalaxy route="contact" hideTechDecorations={true} />
          </WebGLErrorBoundary>
        </Suspense>
      </div>

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
        {/* Om symbol accent */}
        <span className="font-mono text-[#d4af37]/40 text-2xl tracking-widest mb-4 select-none">
          &#x950;
        </span>

        {/* Heading */}
        <h1
          className="font-mono uppercase tracking-[0.28em] text-[#d4af37] text-3xl md:text-4xl font-bold text-center"
          style={{ textShadow: "0 0 40px rgba(212,175,55,0.35)" }}
        >
          CONTACT
        </h1>

        {/* Subheading */}
        <p className="text-neutral-400 text-sm md:text-base text-center mt-2 mb-8 max-w-md">
          Discover our work, connect with organizers, and join the official community
        </p>

        {/* Divider */}
        <div className="w-12 h-[1px] bg-[#d4af37]/30 mb-8" />

        {/* Main Content Area: Links Stack + WhatsApp Community QR Card */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 w-full max-w-4xl">
          {/* Linktree Button Stack */}
          <div className="max-w-md w-full flex flex-col justify-between gap-3.5">
            {links.map((link) => (
              <a
                key={link.id}
                id={link.id}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group relative flex items-center justify-center w-full p-4 rounded-xl border border-[#d4af37]/30 bg-[#0d0d14]/60 hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all duration-300 backdrop-blur-md"
              >
                {/* Icon - left-anchored */}
                {link.icon}

                {/* Label - strictly centered */}
                <span className="font-medium text-neutral-200 group-hover:text-white transition-colors duration-200 tracking-wide text-sm sm:text-base">
                  {link.label}
                </span>

                {/* Hover shimmer ring */}
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-[#d4af37]/20" />
              </a>
            ))}
          </div>

          {/* WhatsApp Community QR Card */}
          <div className="max-w-md w-full flex flex-col items-center justify-between p-6 rounded-2xl border border-[#d4af37]/30 bg-[#0d0d14]/75 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            {/* Ambient background glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#25D366]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header badge */}
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#25D366]/15 flex items-center justify-center border border-[#25D366]/40">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                </div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#25D366] font-semibold">
                  WhatsApp Community
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[10px] text-[#25D366] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                <span>Official Group</span>
              </div>
            </div>

            {/* Community Title */}
            <h2 className="text-base sm:text-lg font-semibold text-neutral-100 text-center tracking-wide mb-1">
              Vedanta Makeathon Participants - 2026
            </h2>
            <p className="text-neutral-400 text-xs text-center mb-4 max-w-xs leading-relaxed">
              Scan with your phone or tap below to join the official discussions and live announcements
            </p>

            {/* QR Code Frame */}
            <div className="relative p-3.5 bg-white rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.25)] border border-[#d4af37]/40 mb-4 group-hover:shadow-[0_0_35px_rgba(37,211,102,0.3)] transition-shadow duration-300">
              <img
                src="/whatsapp_qr_code.png"
                alt="WhatsApp Community QR Code - Vedanta Makeathon Participants 2026"
                className="w-40 h-40 sm:w-44 sm:h-44 object-contain rounded-lg block"
                loading="lazy"
              />
            </div>

            {/* Direct Join Button */}
            <a
              id="contact-join-whatsapp"
              href="https://chat.whatsapp.com/CQl9gndiTJeCzKRgkTanlP"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-bold text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 shadow-[0_0_20px_rgba(37,211,102,0.35)] hover:shadow-[0_0_25px_rgba(37,211,102,0.55)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4 text-neutral-950" />
              <span>Join WhatsApp Group</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-950" />
            </a>

            {/* Subtle hint */}
            <span className="text-[11px] text-neutral-400 text-center mt-2.5 tracking-wide">
              Tap to join directly from mobile or scan above from desktop
            </span>
          </div>
        </div>

        {/* Back navigation footer */}
        <a
          id="contact-return-home"
          href="/"
          className="text-xs text-neutral-500 hover:text-amber-400 transition-colors mt-10 tracking-wide"
        >
          &#x2190; Return to Main Portal
        </a>
      </div>
    </div>
  );
}

