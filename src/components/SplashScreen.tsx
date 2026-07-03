import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface SplashScreenProps {
  logoUrl: string;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ logoUrl, onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1500); // Transition to home after ~1.5 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  // Floating ambient eco items around the circle
  const floatingParticles = [
    { emoji: "🌱", delay: 0.1, x: "-80px", y: "-90px", scale: 1.2 },
    { emoji: "♻️", delay: 0.3, x: "90px", y: "-100px", scale: 1.15 },
    { emoji: "🦋", delay: 0.5, x: "-100px", y: "80px", scale: 1.0 },
    { emoji: "💧", delay: 0.2, x: "100px", y: "70px", scale: 1.1 },
    { emoji: "☀️", delay: 0.4, x: "0px", y: "-150px", scale: 1.3 },
    { emoji: "🦊", delay: 0.6, x: "-120px", y: "-10px", scale: 1.0 },
    { emoji: "📦", delay: 0.7, x: "120px", y: "-10px", scale: 0.95 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-emerald-50 via-green-100 to-emerald-200 px-6 py-12 select-none overflow-hidden"
    >
      {/* Top Welcome Tag */}
      <div className="w-full flex justify-center pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md border border-emerald-300 px-5 py-2 rounded-full flex items-center gap-1.5 shadow-sm"
        >
          <span className="text-emerald-700 font-display font-black text-xs uppercase tracking-wider">Welcome to Re:Play</span>
          <span className="text-sm">🎮</span>
        </motion.div>
      </div>

      {/* Center Circle with Logo */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Animated outer soft green gradient rings */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-72 h-72 bg-emerald-300/40 blur-2xl rounded-full -z-10"
        />

        {/* Floating eco-illustrations around the circle */}
        {floatingParticles.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1,
              scale: p.scale,
              x: p.x,
              y: p.y,
            }}
            transition={{
              delay: p.delay,
              duration: 0.8,
              type: "spring",
              stiffness: 80
            }}
            className="absolute z-10"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2.5 + idx * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-3.5xl"
            >
              {p.emoji}
            </motion.div>
          </motion.div>
        ))}

        {/* Large circular container in the center */}
        <motion.div
          initial={{ scale: 0.3, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 90,
            damping: 14,
            delay: 0.1
          }}
          className="relative w-52 h-52 rounded-full bg-white p-3 border-6 border-emerald-400 shadow-[0_16px_40px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden"
        >
          {/* Gentle glow effect inside the circle */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/40 via-transparent to-teal-50/30" />
          
          <motion.img
            src={logoUrl}
            alt="Re:Play Logo"
            className="w-full h-full rounded-full object-cover shadow-inner relative z-10"
            referrerPolicy="no-referrer"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.03 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Small sparkle overlays */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 text-amber-400"
        >
          <Sparkles className="w-8 h-8 fill-current" />
        </motion.div>
      </div>

      {/* Bottom Identity & Tagline */}
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="font-display font-black text-4.5xl text-emerald-800 leading-none tracking-tight">
            Re:Play
          </h1>
          <p className="text-emerald-700/80 font-display font-black text-base tracking-wide mt-1 bg-white/50 px-4 py-1 rounded-full border border-emerald-300/30">
            Little Hands, Big Impact.
          </p>
        </motion.div>

        {/* Progress loader */}
        <div className="w-32 h-2 bg-emerald-100 rounded-full overflow-hidden border border-emerald-300/40 mt-1">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="relative h-full w-16 bg-emerald-500 rounded-full"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2 }}
          className="text-[11px] text-emerald-800/60 font-bold tracking-wider uppercase"
        >
          Eco-Sorting For Kids & Parents
        </motion.p>
      </div>
    </motion.div>
  );
};
