import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, X, Compass, Flame, ShieldAlert, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CosmicOracleProps {
  isOpen: boolean;
  onClose: () => void;
  activeDomainSlug?: string;
  activeDomainName?: string;
}

export default function CosmicOracle({ isOpen, onClose, activeDomainSlug, activeDomainName }: CosmicOracleProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [patientIndex, setPatientIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const patienceQuotes = [
    "Tuning to the silence of self-inquiry...",
    "Reflecting on the wisdom of the Advaita tradition...",
    "Resting in the silence of Sri Dakshinamurthy...",
    "Dwell inside inner reflection...",
    "Listening to the voice of silence..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setPatientIndex((prev) => (prev + 1) % patienceQuotes.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response, loading]);

  const defaultPrompts = [
    { text: "How does Sri Dakshinamurthy reveal wisdom through silence?", category: "meditation" },
    { text: "Explain the Advaita perspective on the universe appearing within oneself.", category: "cosmic-philosophy" },
    { text: "How does self-reflection help in discovering the primordial truth?", category: "mindfulness" },
    { text: "What is the role of learning and silence in the Advaita tradition?", category: "ancient-wisdom" }
  ];

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;
    setLoading(true);
    setResponse(null);
    setPrompt(queryText);

    try {
      const res = await fetch("/api/v1/gemini/spiritual-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryText,
          domain: activeDomainSlug || "general"
        })
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (err) {
      console.error(err);
      setResponse("The cosmic grid is temporarily static. Look inside your spiritual center for the answers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/95">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl glass-panel border border-gold-vintage/35 shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold-vintage/10 text-gold-vintage border border-gold-vintage/20">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-display font-medium text-lg tracking-wider text-gold-vintage flex items-center gap-2">
                    Oracle of Dakshinaasya Darshini
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {activeDomainName ? `Tuned to Channel: ${activeDomainName}` : "Inner Wisdom Terminal"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* If no response or prompt active */}
              {!prompt && !response && !loading && (
                <div className="space-y-6 text-center py-4">
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="font-serif text-slate-300 italic text-base leading-relaxed">
                      &ldquo;Inquire, and the timeless wisdom of the Advaita tradition shall reveal itself in silence.&rdquo;
                    </p>
                    <div className="w-12 h-[1px] bg-gold-vintage/40 mx-auto" />
                  </div>

                  <div className="space-y-3 text-left">
                    <h4 className="text-xs text-gold-vintage uppercase font-mono tracking-widest pl-1">
                      Suggested Contemplative Inquiries
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {defaultPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuery(p.text)}
                          className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-gold-vintage/[0.04] hover:border-gold-vintage/30 text-left text-slate-300 hover:text-white transition-all duration-300 text-xs leading-relaxed flex items-start gap-2.5 cursor-pointer group"
                        >
                          <Star className="w-3.5 h-3.5 text-gold-vintage/60 group-hover:text-gold-vintage mt-0.5 shrink-0" />
                          <span>{p.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Thread */}
              {(prompt || response || loading) && (
                <div className="space-y-4 font-sans text-sm">
                  {prompt && (
                    <div className="flex justify-end">
                      <div className="p-4 rounded-2xl bg-gold-vintage/10 border border-gold-vintage/20 text-slate-200 max-w-[85%] font-serif">
                        <span className="text-xs font-mono text-gold-vintage/60 block mb-1">THE INQUIRY</span>
                        {prompt}
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 max-w-[85%] flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-gold-vintage border-t-transparent rounded-full animate-spin shrink-0" />
                        <span className="font-mono text-xs text-gold-vintage/80 animate-pulse">
                          {patienceQuotes[patientIndex]}
                        </span>
                      </div>
                    </div>
                  )}

                  {response && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 text-slate-200 max-w-[95%] leading-relaxed space-y-3 font-sans">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-gold-vintage">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          <span>THE COGNITIVE TRANSMISSION</span>
                        </div>
                        <div className="whitespace-pre-line text-sm text-slate-200 font-serif leading-relaxed italic md:not-italic">
                          {response}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-white/5 bg-black/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleQuery(prompt);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Inquire of the teacher (e.g., Explain the teaching of silence)..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-white placeholder-slate-500 focus:outline-none focus:border-gold-vintage/50 text-sm font-sans"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="p-3 rounded-xl bg-gold-vintage text-black hover:bg-gold-bright transition-all disabled:opacity-30 disabled:hover:bg-gold-vintage cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
