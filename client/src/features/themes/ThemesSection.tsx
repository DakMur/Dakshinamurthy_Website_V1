import { useState } from "react";
import FileText from "lucide-react/dist/esm/icons/file-text";
import Presentation from "lucide-react/dist/esm/icons/presentation";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import { motion } from "motion/react";

const DRIVE_THEMES_PDF_URL =
  "https://drive.google.com/file/d/1SgJnWgoZxUY3RvzcZsU-uS1UrfyvDeUe/preview";
const DRIVE_THEMES_PDF_DIRECT_URL =
  "https://drive.google.com/file/d/1SgJnWgoZxUY3RvzcZsU-uS1UrfyvDeUe/view?usp=sharing";

// Google Drive preview endpoint provides a continuous vertical scrolling document layout (identical to the Themes PDF)
const DRIVE_PPT_SCROLLING_URL =
  "https://drive.google.com/file/d/1XLG0K0ECIQujtGya68QJmC721kauy6Ll/preview";
const DRIVE_PPT_DIRECT_URL =
  "https://docs.google.com/presentation/d/1XLG0K0ECIQujtGya68QJmC721kauy6Ll/edit?usp=drive_link&ouid=114820680613807477074&rtpof=true&sd=true";

export default function ThemesSection() {
  const [isPptLoaded, setIsPptLoaded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-12">
      {/* 1. MAKEATHON THEMES PDF */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-gold-vintage/25 transition-all flex flex-col">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-gold-vintage uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5 text-gold-vintage" />
            <span>MAKEATHON THEMES</span>
          </div>

          <h3 className="font-display font-medium text-2xl md:text-3.5xl text-slate-100 tracking-wider leading-snug uppercase">
            THEMES
          </h3>

          <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto" />

          <div className="w-full h-[500px] sm:h-[600px] md:h-[680px] rounded-xl overflow-hidden border border-white/10 bg-[#0e0e12] mt-2">
            <iframe
              src={DRIVE_THEMES_PDF_URL}
              title="Vedanta Makeathon Themes"
              loading="lazy"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <div className="pt-2 flex justify-center">
            <a
              href={DRIVE_THEMES_PDF_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-vintage/10 hover:bg-gold-vintage/20 text-gold-vintage border border-gold-vintage/30 hover:border-gold-vintage/60 transition-all text-xs font-mono uppercase tracking-wider shadow-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Themes PDF</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* 2. MAKEATHON PPT TEMPLATE */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
      >
        <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-gold-vintage/25 transition-all flex flex-col">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-gold-vintage uppercase tracking-widest">
            <Presentation className="w-3.5 h-3.5 text-gold-vintage" />
            <span>MAKEATHON TEMPLATE</span>
          </div>

          <h3 className="font-display font-medium text-2xl md:text-3.5xl text-slate-100 tracking-wider leading-snug uppercase">
            PPT TEMPLATE
          </h3>

          <div className="w-16 h-[1.5px] bg-gold-vintage/50 mx-auto" />

          <div className="w-full h-[500px] sm:h-[600px] md:h-[680px] rounded-xl overflow-hidden border border-white/10 bg-[#0e0e12] mt-2 relative">
            {!isPptLoaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0e0e12] gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-gold-vintage/20 border-t-gold-vintage animate-spin" />
                <span className="font-mono text-xs uppercase tracking-widest text-gold-vintage/80">
                  Loading PPT Template...
                </span>
              </div>
            )}
            <iframe
              src={DRIVE_PPT_SCROLLING_URL}
              title="Vedanta Makeathon PPT Template"
              loading="lazy"
              allowFullScreen
              onLoad={() => setIsPptLoaded(true)}
              className="w-full h-full border-0"
            />
          </div>

          <div className="pt-2 flex justify-center">
            <a
              href={DRIVE_PPT_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-vintage/10 hover:bg-gold-vintage/20 text-gold-vintage border border-gold-vintage/30 hover:border-gold-vintage/60 transition-all text-xs font-mono uppercase tracking-wider shadow-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PPT Template</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
