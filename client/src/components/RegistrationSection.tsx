import React from "react";

export default function RegistrationSection() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4 py-8">
      {/* Category label — matches sibling sections (e.g. Hero accent line) */}
      <div className="mb-3 flex items-center justify-center gap-3 text-xs font-mono">
        <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold-vintage" />
        <span className="text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] uppercase text-gold-vintage whitespace-nowrap">
          PARTICIPATION &amp; ACCESS
        </span>
        <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-gold-vintage" />
      </div>

      {/* Heading — matches RegistrationGate's h3 pattern: font-display tracking-widest */}
      <h2 className="font-display font-medium text-2xl md:text-5xl tracking-widest uppercase text-gold-vintage mb-4">
        TEAM REGISTRATION
      </h2>

      {/* Description — matches RegistrationGate body copy style */}
      <p className="text-neutral-400 text-sm md:text-base max-w-2xl text-center mb-10 leading-relaxed font-sans">
        Build your team, shape your idea, and submit your project for the Vedanta Makeathon.
      </p>

      {/* Solid gold CTA — matches Login button: bg-gold-vintage text-black font-mono font-semibold */}
      <a
        href="https://mastryhub.com/event/vedanta-makeathon"
        target="_blank"
        rel="noopener noreferrer"
        id="registrations-mastryhub-cta"
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gold-vintage hover:bg-gold-bright text-black font-mono font-semibold text-xs tracking-wider uppercase transition-colors duration-200 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_32px_rgba(212,175,55,0.45)]"
      >
        <span>Register Team ↗</span>
      </a>
    </div>
  );
}
