import { lazy, Suspense } from "react";
import { Globe, Instagram, Youtube, Mail } from "lucide-react";
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
    id: "contact-website",
    icon: <Globe className="text-[#d4af37] w-5 h-5 absolute left-4" />,
    label: "Website",
    href: "https://vedanta-makeathon.vercel.app/",
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
    href: "mailto:dakshinaasyadarshini.jit@gmail.com",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-transparent min-h-screen w-full text-white relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated Galaxy/Particle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <WebGLErrorBoundary>
            <CosmicGalaxy route="contact" hideTechDecorations={true} />
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
              className="group relative flex items-center justify-center w-full p-4 rounded-xl border border-[#d4af37]/30 bg-[#0d0d14]/60 hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all duration-300 backdrop-blur-md"
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

        {/* Brochure CTA */}
        <div className="mt-6">
          <a
            id="contact-brochure"
            href="https://heyzine.com/flip-book/3846397c63.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 font-mono text-xs md:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] backdrop-blur-md"
          >
            <svg
              className="w-4 h-4 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Brochure</span>
          </a>
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
