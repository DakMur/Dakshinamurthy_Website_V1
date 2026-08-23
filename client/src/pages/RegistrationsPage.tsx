import { lazy, Suspense } from "react";
import { WebGLErrorBoundary } from "../components/error/WebGLErrorBoundary";
import RegistrationSection from "../components/RegistrationSection";

const CosmicGalaxy = lazy(() => import("../features/landing-main/CosmicGalaxy"));

export default function RegistrationsPage() {
  return (
    <div className="bg-transparent min-h-screen w-full text-white relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated Galaxy/Particle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <WebGLErrorBoundary>
            <CosmicGalaxy route="registration" hideTechDecorations={true} />
          </WebGLErrorBoundary>
        </Suspense>
      </div>

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl">
        {/* Om symbol accent */}
        <span className="font-mono text-[#d4af37]/40 text-2xl tracking-widest mb-4 select-none">
          ॐ
        </span>

        {/* Render the public registration section */}
        <RegistrationSection />

        {/* Back navigation footer */}
        <a
          id="registrations-return-home"
          href="/"
          className="text-xs text-neutral-500 hover:text-amber-400 transition-colors mt-8 tracking-wide font-mono inline-flex items-center gap-1.5"
        >
          ← Return to Main Portal
        </a>
      </div>
    </div>
  );
}
