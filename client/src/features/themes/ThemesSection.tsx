import FileText from "lucide-react/dist/esm/icons/file-text";
import { motion } from "motion/react";

const DRIVE_THEMES_PDF_URL =
  "https://drive.google.com/file/d/1SgJnWgoZxUY3RvzcZsU-uS1UrfyvDeUe/preview";

export default function ThemesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-4xl mx-auto w-full"
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
      </div>
    </motion.div>
  );
}
