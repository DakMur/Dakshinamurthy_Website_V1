import { Quote } from "../../types/types";

interface FooterProps {
  dailyQuote: Quote | null;
  route?: string;
  isLanding?: boolean;
}

export default function Footer({ dailyQuote, route, isLanding = false }: FooterProps) {
  if (!dailyQuote || isLanding || route === "landing" || route === "home") return null;

  return (
    <footer id="site-footer" className="w-full border-t border-white/5 py-8 px-6 text-center bg-black/40 relative z-10 mt-16">
      <p className="font-serif italic text-slate-400 text-xs max-w-2xl mx-auto">
        &ldquo;{dailyQuote.text}&rdquo;{" "}
        <span className="text-gold-vintage font-mono text-[10px] ml-1.5">
          — {dailyQuote.author} ({dailyQuote.category})
        </span>
      </p>
      <div className="mt-4 font-mono text-[9px] uppercase tracking-widest text-slate-600">
        © Dakshinaasya Darshini • Sri Shankara Parampara
      </div>
    </footer>
  );
}

