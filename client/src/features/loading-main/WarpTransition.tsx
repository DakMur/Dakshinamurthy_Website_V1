import { motion, AnimatePresence } from "motion/react";

interface WarpTransitionProps {
  isWarping: boolean;
}

export default function WarpTransition({ isWarping }: WarpTransitionProps) {
  return (
    <AnimatePresence>
      {isWarping && (
        <div className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden pointer-events-none">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2 }}
            className="absolute w-[700px] h-[700px] rounded-full bg-gold-vintage/20 blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8] }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_70%)]"
          />

          <motion.div
            initial={{
              scale: 0.1,
              opacity: 0,
              rotateY: 90
            }}
            animate={{
              scale: [0.1, 1.25, 1],
              opacity: [0, 1, 1],
              rotateY: [90, 0]
            }}
            transition={{
              duration: 2,
              ease: "easeInOut"
            }}
            className="relative text-[9rem] md:text-[14rem] text-gold-vintage drop-shadow-[0_0_40px_rgba(212,175,55,0.8)]"
          >
            ॐ
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
