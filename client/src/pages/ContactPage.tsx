import { lazy, Suspense } from "react";
import { Instagram, Youtube, Mail } from "lucide-react";
import { WebGLErrorBoundary } from "../components/error/WebGLErrorBoundary";

const CosmicGalaxy = lazy(() => import("../features/landing-main/CosmicGalaxy"));

interface LinkItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  id: string;
}

const links: LinkItem[] = [
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
    href: "mailto:dakshinaasyadarshini.jit@gmail.com",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Galaxy/Particle Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Suspense fallback={null}>
          <WebGLErrorBoundary>
            <CosmicGalaxy route="contact" />
          </WebGLErrorBoundary>
        </Suspense>
      </div>

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Om symbol accent */}
        <span className="font-mono text-[#d4af37]/40 text-2xl tracking-widest mb-4 select-none">
          &#x950;
        </span>

        {/* Heading */}
        <h1
          className="font-mono uppercase tracking-[0.28em] text-[#d4af37] text-3xl md:text-4xl font-bold"
          style={{ textShadow: "0 0 40px rgba(212,175,55,0.35)" }}
        >
          CONTACT
        </h1>

        {/* Subheading */}
        <p className="text-neutral-400 text-sm md:text-base text-center mt-2 mb-8 max-w-xs">
          Discover our work and see where you can find us
        </p>

        {/* Divider */}
        <div className="w-12 h-[1px] bg-[#d4af37]/30 mb-8" />

        {/* Linktree Button Stack */}
        <div className="max-w-md w-full flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              id={link.id}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="group relative flex items-center justify-center w-full p-4 rounded-xl border border-[#d4af37]/30 bg-[#0d0d14]/80 hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all duration-300 backdrop-blur-md"
            >
              {/* Icon - left-anchored */}
              {link.icon}

              {/* Label - strictly centered */}
              <span className="font-medium text-neutral-200 group-hover:text-white transition-colors duration-200 tracking-wide">
                {link.label}
              </span>

              {/* Hover shimmer ring */}
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-[#d4af37]/20" />
            </a>
          ))}
        </div>

        {/* Back navigation footer */}
        <a
          id="contact-return-home"
          href="/"
          className="text-xs text-neutral-500 hover:text-amber-400 transition-colors mt-8 tracking-wide"
        >
          &#x2190; Return to Main Portal
        </a>
      </div>
    </div>
  );
}
