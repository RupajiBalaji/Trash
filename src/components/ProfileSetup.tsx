import React, { useState } from "react";
import { Profile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChevronRight, HelpCircle } from "lucide-react";
import logoImg from "../assets/images/planet_pals_logo_1782969002866.jpg";

interface ProfileSetupProps {
  onSave: (profile: Profile) => void;
}

const AVATARS = [
  { emoji: "🦊", label: "Playful Fox", color: "bg-orange-100 border-orange-300 text-orange-500" },
  { emoji: "🐼", label: "Cuddly Panda", color: "bg-gray-100 border-gray-300 text-gray-700" },
  { emoji: "🦁", label: "Brave Lion", color: "bg-yellow-100 border-yellow-300 text-yellow-600" },
  { emoji: "🐸", label: "Jolly Frog", color: "bg-green-100 border-green-300 text-green-600" },
  { emoji: "🦄", label: "Magic Unicorn", color: "bg-pink-100 border-pink-300 text-pink-500" },
  { emoji: "🦖", label: "Tiny Dino", color: "bg-teal-100 border-teal-300 text-teal-600" },
];

const COACH_TIPS = [
  {
    icon: "🍼",
    text: "Plastic bottles go in the 🔵 Blue Bin! Always empty and flatten them first to save space!",
    title: "Plastic Bottles → Blue Bin"
  },
  {
    icon: "🍌",
    text: "Food waste & banana peels go in the 🟢 Green Bin! They turn into rich food for soil & plants!",
    title: "Food Waste → Green Bin"
  },
  {
    icon: "😷",
    text: "Used masks and bandages go in the 🔴 Red Bin (or Yellow Bin)! Let's keep dangerous germs safely contained!",
    title: "Biomedical Waste → Hazard Bin"
  },
  {
    icon: "🍾",
    text: "Glass bottles go in the 🟢 Green/White Bin! They can be melted and remade forever!",
    title: "Glass Bottles → Glass Bin"
  },
  {
    icon: "🔋",
    text: "Batteries have special chemicals. Recycle them separately in E-waste Collection boxes!",
    title: "Batteries → E-waste"
  },
  {
    icon: "📦",
    text: "Cardboard boxes go in the 🔵 Blue Bin! Flatten them first so the truck can carry more!",
    title: "Cardboard → Blue Bin"
  },
  {
    icon: "🧃",
    text: "Rinse juice boxes and drop them in the 🔵 Blue Bin! They turn into cool notebooks!",
    title: "Juice Boxes → Blue Bin"
  },
  {
    icon: "🥫",
    text: "Metal cans are recyclable forever! Give them a quick rinse and put them in the 🔵 Blue Bin!",
    title: "Metal Cans → Blue Bin"
  }
];

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSave }) => {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].emoji);
  const [error, setError] = useState("");

  // Coach Tip index
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * COACH_TIPS.length));

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % COACH_TIPS.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please type your name! 😊");
      return;
    }
    if (name.length > 15) {
      setError("Let's pick a nickname shorter than 15 letters! ⭐");
      return;
    }
    setError("");
    onSave({
      name: name.trim(),
      avatar: selectedAvatar,
    });
  };

  const currentTip = COACH_TIPS[tipIndex];

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 min-h-[85vh] px-4 py-6 max-w-5xl mx-auto">
      
      {/* LEFT COLUMN: WASTE SEGREGATION COACH */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-3 border-emerald-400 p-6 shadow-md flex flex-col justify-between"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Re:Play Logo" 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-300 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-display font-black text-2xl text-emerald-700 leading-tight">Re:Play</h1>
              <p className="text-xs font-semibold text-emerald-600 italic">"Little Hands, Big Impact."</p>
            </div>
          </div>

          <hr className="border-emerald-200" />

          {/* AI Coach Card */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-xs relative">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3.5xl">🦉</span>
              <div>
                <h3 className="font-display font-bold text-gray-800 text-sm">Professor Ollie</h3>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Your Segregation Coach</p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-xs text-gray-700 leading-relaxed mt-1 relative">
              <div className="absolute -top-2 left-4 w-3 h-3 bg-emerald-50 border-t border-l border-emerald-100 rotate-45"></div>
              <h4 className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                <span>{currentTip.icon}</span> {currentTip.title}
              </h4>
              <p className="font-medium">"{currentTip.text}"</p>
            </div>

            <button
              onClick={handleNextTip}
              type="button"
              className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold py-2 px-3 rounded-xl shadow-xs text-xs transition-transform flex items-center justify-center gap-1"
            >
              <span>Next Tip! 💡</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Info banner for children */}
        <div className="mt-4 bg-emerald-500/10 border border-emerald-200 rounded-2xl p-3 text-[11px] text-emerald-800 font-medium">
          🌈 <span className="font-bold">Did you know?</span> Sorting our waste keeps oceans clean, saves sweet animals, and earns you super cool discount vouchers here! Let's build a clean planet! 🌍✨
        </div>
      </motion.div>

      {/* RIGHT COLUMN: LOGIN / PROFILE CREATION */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full lg:w-1/2 bg-white rounded-3xl border-3 border-emerald-500 p-6 shadow-[0_8px_0_0_#10b981] flex flex-col justify-between"
      >
        <div>
          <div className="text-center mb-5">
            <span className="inline-block text-4xl mb-1 animate-bounce">👋</span>
            <h2 className="font-display font-extrabold text-2xl text-gray-800">Create Your Profile</h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Enter your name and pick a fun companion to join the adventure!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Selector */}
            <div>
              <label className="block text-center font-display font-bold text-sm text-gray-700 mb-2">
                Choose your Pals Companion! 🐾
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.emoji;
                  return (
                    <button
                      key={avatar.emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.emoji)}
                      className={`flex flex-col items-center p-2 rounded-2xl border-2.5 transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 scale-105 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-3xl mb-0.5">{avatar.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-600">{avatar.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div className="pt-2">
              <label htmlFor="kid-name" className="block font-display font-bold text-sm text-gray-700 mb-1">
                What is your name, Eco Hero? ✏s
              </label>
              <input
                id="kid-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setError("");
                }}
                placeholder="e.g. Leo"
                className="w-full px-3 py-2 text-sm rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 font-semibold text-gray-800 placeholder-gray-300 transition-colors"
              />
              {error && <p className="text-rose-500 font-semibold text-xs mt-1">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 active:shadow-none text-white font-display font-bold text-sm py-3 px-4 rounded-xl border-b-4 border-emerald-700 shadow-xs transition-all flex items-center justify-center gap-1"
            >
              Let's Start! 🚀
            </button>
          </form>
        </div>

        <div className="text-center text-[10px] text-gray-400 mt-4 font-semibold">
          Re:Play © 2026 • Eco-Sorting For Kids & Parents
        </div>
      </motion.div>
      
    </div>
  );
};
