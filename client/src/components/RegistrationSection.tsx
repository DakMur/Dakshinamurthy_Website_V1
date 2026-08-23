import React from "react";

export default function RegistrationSection() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4 py-8">
      {/* Subheader */}
      <span className="text-amber-500/80 font-mono text-xs md:text-sm tracking-widest uppercase mb-2 block">
        PARTICIPATION & ACCESS
      </span>

      {/* Heading */}
      <h2 className="text-2xl md:text-5xl font-serif tracking-wider text-[#d4af37] mb-4 uppercase">
        TEAM REGISTRATION
      </h2>

      {/* Subtitle */}
      <p className="text-neutral-400 text-sm md:text-base max-w-2xl text-center mb-8 leading-relaxed font-sans">
        Access your team workspace, manage team members, and submit your project documents and demo video for Dakshinamurthy Hackathon.
      </p>

      {/* Interactive MastryHub External CTA Button */}
      <div className="flex flex-col items-center justify-center">
        <a
          href="https://mastryhub.com/event/vedanta-makeathon"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-[#d4af37]/50 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] font-mono text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] group"
        >
          <span>Register Team on MastryHub</span>
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </a>
      </div>
    </div>
  );
}
