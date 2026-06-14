import { motion, AnimatePresence } from "motion/react";

interface WarpTransitionProps {
  isWarping: boolean;
}

export default function WarpTransition({ isWarping }: WarpTransitionProps) {
  return (
    <AnimatePresence>
      {isWarping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.95, 0.95, 0],
            transition: {
              duration: 1.0,
              times: [0, 0.2, 0.4, 0.2], // Hits peak at 0.2s, holds to 0.8s, vanishes at 1s
              ease: "easeInOut"
            }
          }}
          className="fixed inset-0 z-50 bg-white pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}