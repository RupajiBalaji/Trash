import React, { useState, useEffect, useRef } from "react";
import { Profile, ScanHistoryItem, WasteCategory, Badge, ScanResult } from "./types";
import { ProfileSetup } from "./components/ProfileSetup";
import { SplashScreen } from "./components/SplashScreen";
import { directoryCategories, directoryItems } from "./data/directoryData";
import { REWARD_PRODUCTS } from "./data/rewardsData";
import { RecycleCta, ReuseCta, CompostSuggestion } from "./components/CtaSections";
import { LeaderboardView } from "./components/LeaderboardView";
import {
  Camera,
  Award,
  BookOpen,
  BarChart2,
  Plus,
  Check,
  X,
  Sparkles,
  Info,
  TrendingUp,
  RotateCcw,
  Upload,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Gift,
  Copy,
  Volume2,
  Trophy,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "./assets/images/planet_pals_logo_1782969002866.jpg";

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  unlockedAt: string;
  used: boolean;
}

// Predefined mapping of waste categories to educational YouTube recommendations
const YOUTUBE_RECOMMENDATIONS: Record<WasteCategory, Array<{
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}>> = {
  "Wet/Biodegradable": [
    {
      id: "wet_1",
      title: "Composting for Kids! 🍂🌸",
      description: "Learn how food scraps and leaves turn into vitamin-rich food for plants!",
      thumbnail: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=Q5s4n9YSxc0"
    },
    {
      id: "wet_2",
      title: "Food Waste Management Explained 🍏",
      description: "Why wasting food hurts the planet, and how simple composting helps fix it.",
      thumbnail: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=ishA6kry8nc"
    },
    {
      id: "wet_3",
      title: "What is Organic Recycling? ♻️🌱",
      description: "A fun animated guide to how nature recycles organic materials naturally.",
      thumbnail: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=snS_bE_D37E"
    }
  ],
  "Dry/Recyclable": [
    {
      id: "dry_1",
      title: "The Plastic Recycling Process! 🍼➡️🧸",
      description: "See how plastic bottles are crushed, melted, and transformed into new toys!",
      thumbnail: "https://images.unsplash.com/photo-1526613098299-f558adc485e9?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=I_fUpP-K66s"
    },
    {
      id: "dry_2",
      title: "How Paper is Recycled! 📦🌲",
      description: "Discover the amazing journey of old cardboard boxes becoming clean notebook paper.",
      thumbnail: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=Vl0CgP8Y_2M"
    },
    {
      id: "dry_3",
      title: "Reduce, Reuse, Recycle! 🌍✨",
      description: "The three magical rules of recycling and how kids can lead the charge!",
      thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=OasbYWF4_S8"
    }
  ],
  "Hazardous": [
    {
      id: "hazard_1",
      title: "Biomedical Waste Segregation 😷🧪",
      description: "Learn how doctors and hospitals safely manage medical waste like masks.",
      thumbnail: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=FjIuN_Mcl-Y"
    },
    {
      id: "hazard_2",
      title: "How E-waste & Batteries are Sorted ⚡🔋",
      description: "See why electronics shouldn't go in normal bins and how they are safely dismantled.",
      thumbnail: "https://images.unsplash.com/photo-1548613053-2200863749a0?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=mIDh_p3fQOM"
    },
    {
      id: "hazard_3",
      title: "Safe Waste Disposal Methods ⚠️🗑️",
      description: "An educational cartoon explaining why special waste needs special care to protect nature.",
      thumbnail: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&auto=format&fit=crop&q=60",
      videoUrl: "https://www.youtube.com/watch?v=p79tL1FmX-Q"
    }
  ]
};

// Standard badges template (with achievement badges)
const INITIAL_BADGES: Badge[] = [
  {
    id: "eco_beginner",
    title: "Eco Beginner 🌱",
    description: "Reach 20 adventure points!",
    icon: "🌱",
    unlocked: false,
    type: "first_scan" // will be handled dynamically
  },
  {
    id: "eco_explorer",
    title: "Eco Explorer 🌿",
    description: "Reach 50 adventure points!",
    icon: "🌿",
    unlocked: false,
    type: "wet_count"
  },
  {
    id: "eco_champion",
    title: "Eco Champion 🌍",
    description: "Reach 100 points & unlock a Discount Voucher!",
    icon: "🌍",
    unlocked: false,
    type: "dry_count"
  },
  {
    id: "first_scan",
    title: "First Explorer",
    description: "Scan your very first waste item!",
    icon: "🔍",
    unlocked: false,
    type: "first_scan"
  },
  {
    id: "wet_count",
    title: "Compost Champion",
    description: "Sort 5 Wet/Biodegradable items",
    icon: "🍌",
    unlocked: false,
    type: "wet_count"
  },
  {
    id: "dry_count",
    title: "Recycle Hero",
    description: "Sort 5 Dry/Recyclable items",
    icon: "📦",
    unlocked: false,
    type: "dry_count"
  },
  {
    id: "hazard_count",
    title: "Hazard Spotter",
    description: "Scan any Hazardous waste item safely",
    icon: "⚡",
    unlocked: false,
    type: "hazard_count"
  }
];

// Fun, self-contained particle Confetti component using Framer motion
const Confetti: React.FC = () => {
  const [pieces] = useState(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage width
      y: -10 - Math.random() * 20, // offset top
      size: 6 + Math.random() * 8,
      color: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#14b8a6"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2.5,
      rotation: Math.random() * 360,
    }));
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: p.rotation, opacity: 1 }}
          animate={{ 
            y: "110vh", 
            rotate: p.rotation + 450,
            x: `${p.x + (Math.sin(p.id) * 12)}vw`,
            opacity: [1, 1, 0.8, 0]
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: "easeOut",
            repeat: 0
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.45 ? "50%" : "3px"
          }}
        />
      ))}
    </div>
  );
};

const formatActiveTime = (totalSecs: number) => {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  return `${h}h ${m}m`;
};

/**
 * Compresses a base64 image by resizing it to a max dimension and lowering JPEG quality.
 * This drastically reduces payload size sent to the Gemini API, speeding up analysis.
 */
const compressImage = (
  dataUrl: string,
  maxDim = 800,
  quality = 0.6
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
};

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Only show the splash screen on the very first visit
    const hasSeen = localStorage.getItem("replay_seen_splash");
    return !hasSeen;
  });

  // Load state from localStorage
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem("planetpals_profile") || localStorage.getItem("ecosprout_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem("planetpals_points") || localStorage.getItem("ecosprout_points");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() => {
    const saved = localStorage.getItem("planetpals_history") || localStorage.getItem("ecosprout_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem("planetpals_badges") || localStorage.getItem("ecosprout_badges");
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem("planetpals_vouchers");
    return saved ? JSON.parse(saved) : [];
  });

  // Current navigation tab
  const [activeTab, setActiveTab] = useState<"scan" | "progress" | "leaderboard" | "directory" | "dashboard">("scan");

  // New gamification states
  const [loginStreak, setLoginStreak] = useState<number>(() => {
    const saved = localStorage.getItem("replay_login_streak");
    return saved ? parseInt(saved, 10) : 1;
  });

  const [scanStreak, setScanStreak] = useState<number>(() => {
    const saved = localStorage.getItem("replay_scan_streak");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Active session tracking states
  const [isTabActive, setIsTabActive] = useState(true);

  const [totalActiveSeconds, setTotalActiveSeconds] = useState<number>(() => {
    const saved = localStorage.getItem("replay_total_active_seconds");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [todayActiveSeconds, setTodayActiveSeconds] = useState<number>(() => {
    const todayStr = new Date().toDateString();
    const savedTodayStr = localStorage.getItem("replay_today_date");
    if (savedTodayStr !== todayStr) {
      localStorage.setItem("replay_today_date", todayStr);
      localStorage.setItem("replay_today_active_seconds", "0");
      return 0;
    }
    const saved = localStorage.getItem("replay_today_active_seconds");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [hoursAwarded, setHoursAwarded] = useState<number>(() => {
    const saved = localStorage.getItem("replay_hours_awarded");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Floating point animation notices
  interface PointNotice {
    id: string;
    text: string;
  }
  const [pointNotices, setPointNotices] = useState<PointNotice[]>([]);

  // Rewards store internal tabs
  const [rewardTab, setRewardTab] = useState<"redeem" | "my">("redeem");
  const [rewardCat, setRewardCat] = useState<"all" | "toys" | "stationery" | "food">("all");

  // Camera & Upload state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [newPointsEarned, setNewPointsEarned] = useState<number | null>(null);
  const [isNewItemType, setIsNewItemType] = useState(false);

  // Live video capture states
  const [useLiveVideo, setUseLiveVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Manual input fallback states
  const [showDemoList, setShowDemoList] = useState(false);
  const [demoItems, setDemoItems] = useState<ScanResult[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualItemName, setManualItemName] = useState("");
  const [manualCategory, setManualCategory] = useState<WasteCategory>("Dry/Recyclable");

  // Correction feedback loop states
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [isEditingClassification, setIsEditingClassification] = useState(false);
  const [correctedCategory, setCorrectedCategory] = useState<WasteCategory>("Dry/Recyclable");
  const [correctedName, setCorrectedName] = useState("");

  // Confetti celebration state
  const [showCelebration, setShowCelebration] = useState(false);

  // Interactive Popup celebration state when a new voucher is unlocked
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [latestVoucher, setLatestVoucher] = useState<Voucher | null>(null);
  const [copiedVoucherId, setCopiedVoucherId] = useState<string | null>(null);

  // Save state on updates
  useEffect(() => {
    if (profile) {
      localStorage.setItem("planetpals_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("planetpals_profile");
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("planetpals_points", points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem("planetpals_history", JSON.stringify(scanHistory));
    // Evaluate badges whenever scan history or points update
    evaluateBadges(scanHistory, points);
  }, [scanHistory, points]);

  useEffect(() => {
    localStorage.setItem("planetpals_badges", JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem("planetpals_vouchers", JSON.stringify(vouchers));
  }, [vouchers]);

  // Points update utility
  const addPoints = (amount: number, reason: string) => {
    if (amount > 0) {
      setPoints((prev) => prev + amount);
    }
    const id = Math.random().toString(36).substring(2, 9);
    setPointNotices((prev) => [...prev, { id, text: `+${amount} Eco Points! ${reason}` }]);
    setTimeout(() => {
      setPointNotices((prev) => prev.filter((item) => item.id !== id));
    }, 2500);
  };

  const handleCompleteActivity = (earnedPoints: number, reason: string) => {
    addPoints(earnedPoints, reason);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  // Daily login streak & Session timer initialization
  useEffect(() => {
    if (!profile) return;
    const lastLoginStr = localStorage.getItem("replay_last_login");
    const todayStr = new Date().toDateString();
    
    if (lastLoginStr !== todayStr) {
      localStorage.setItem("replay_last_login", todayStr);
      const lastLogin = lastLoginStr ? new Date(lastLoginStr) : null;
      let streak = parseInt(localStorage.getItem("replay_login_streak") || "0", 10);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin && lastLogin.toDateString() === yesterday.toDateString()) {
        const newStreak = streak + 1;
        setLoginStreak(newStreak);
        localStorage.setItem("replay_login_streak", newStreak.toString());
        addPoints(20, "Daily Streak! 🔥");
      } else {
        const newStreak = 1;
        setLoginStreak(newStreak);
        localStorage.setItem("replay_login_streak", newStreak.toString());
        addPoints(5, "Daily Login! ☀️");
      }
    }
  }, [profile]);

  // Set up tab visibility and activity listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    const handleFocus = () => setIsTabActive(true);
    const handleBlur = () => setIsTabActive(false);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Initial check
    setIsTabActive(!document.hidden);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Persistent Active Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTabActive) return;

      // Real-time Day change checking inside the timer to reset today's active seconds
      const todayStr = new Date().toDateString();
      const savedTodayStr = localStorage.getItem("replay_today_date");
      if (savedTodayStr !== todayStr) {
        localStorage.setItem("replay_today_date", todayStr);
        localStorage.setItem("replay_today_active_seconds", "0");
        setTodayActiveSeconds(0);
      }

      setTotalActiveSeconds((prevTotal) => {
        const nextTotal = prevTotal + 1;
        localStorage.setItem("replay_total_active_seconds", nextTotal.toString());

        // Check if a new active hour is completed
        const completedHours = Math.floor(nextTotal / 3600);
        
        // Retrieve latest awarded count from localStorage to avoid stale state issues in callback
        const savedAwarded = parseInt(localStorage.getItem("replay_hours_awarded") || "0", 10);
        
        if (completedHours > savedAwarded) {
          const hoursDiff = completedHours - savedAwarded;
          const pointsToEarn = hoursDiff * 20;

          // Award +20 points (per hour)
          setPoints((pts) => {
            const nextPts = pts + pointsToEarn;
            localStorage.setItem("planetpals_points", nextPts.toString());
            return nextPts;
          });

          // Show floating notice
          const id = Math.random().toString(36).substring(2, 9);
          setPointNotices((prev) => [
            ...prev,
            { id, text: `🌱 +${pointsToEarn} Eco Points earned for staying engaged!` }
          ]);
          setTimeout(() => {
            setPointNotices((prev) => prev.filter((item) => item.id !== id));
          }, 3000);

          // Show general confetti celebration
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);

          localStorage.setItem("replay_hours_awarded", completedHours.toString());
          setHoursAwarded(completedHours);
        }

        return nextTotal;
      });

      setTodayActiveSeconds((prevToday) => {
        const nextToday = prevToday + 1;
        localStorage.setItem("replay_today_active_seconds", nextToday.toString());
        return nextToday;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTabActive]);

  // Fetch demo list as a fallback options
  useEffect(() => {
    fetch("/api/demo-items")
      .then((res) => res.json())
      .then((data) => setDemoItems(data))
      .catch((err) => console.error("Error loading demo items:", err));
  }, []);

  // Voucher automatic milestone logic
  useEffect(() => {
    if (points >= 100) {
      // Allow unlocking multiple vouchers if they earned enough points
      const expectedVoucherCount = Math.floor(points / 100);
      if (vouchers.length < expectedVoucherCount) {
        const newVouchersToUnlock = expectedVoucherCount - vouchers.length;
        const updatedVouchers = [...vouchers];
        let lastAdded: Voucher | null = null;

        for (let i = 0; i < newVouchersToUnlock; i++) {
          const milestone = (vouchers.length + i + 1) * 100;
          const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          const voucherCode = `PALS-${milestone}-${randomSuffix}`;

          const discountOptions = [
            { title: "Eco-Toy Depot 🧸", discount: "15% OFF", desc: "Get 15% off any wooden playkit or science project box!" },
            { title: "Earth Explorers Museum 🏛️", discount: "Free Kid Ticket", desc: "One free children entry voucher with adult ticket!" },
            { title: "Happy Sprout Bookshop 📚", discount: "$5 Shopping Cash", desc: "Enjoy $5 off any animal storybook or environment magazine!" },
            { title: "Green Planet Sweets 🍦", discount: "Buy 1 Get 1 Free", desc: "Get BOGO organic plant-based ice creams!" },
            { title: "EcoSprout Garden Center 🌻", discount: "Free Plant Starter", desc: "Redeem a complete sunflower growing kit for your backyard!" }
          ];

          const opt = discountOptions[Math.floor(Math.random() * discountOptions.length)];

          const newVoucher: Voucher = {
            id: `v_${milestone}_${Date.now()}_${i}`,
            code: voucherCode,
            title: opt.title,
            description: opt.desc,
            discount: opt.discount,
            unlockedAt: new Date().toLocaleDateString(),
            used: false
          };

          updatedVouchers.push(newVoucher);
          lastAdded = newVoucher;
        }

        setVouchers(updatedVouchers);
        if (lastAdded) {
          setLatestVoucher(lastAdded);
          setShowVoucherModal(true);
        }
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    }
  }, [points, vouchers.length]);

  // Compute stats
  const totalWet = scanHistory.filter((item) => {
    const finalCat = item.correctedCategory || item.category;
    return finalCat === "Wet/Biodegradable";
  }).length;

  const totalDry = scanHistory.filter((item) => {
    const finalCat = item.correctedCategory || item.category;
    return finalCat === "Dry/Recyclable";
  }).length;

  const totalHazardous = scanHistory.filter((item) => {
    const finalCat = item.correctedCategory || item.category;
    return finalCat === "Hazardous";
  }).length;

  const currentLevel = Math.floor(points / 50) + 1;
  const levelNames = ["Eco Beginner 🌱", "Eco Explorer 🌿", "Eco Champion 🌍", "Super Planet Protector 👑"];
  const levelName = currentLevel <= 4 ? levelNames[currentLevel - 1] : "Super Planet Protector 👑";
  const pointsInCurrentLevel = points % 50;
  const progressPercent = Math.min((pointsInCurrentLevel / 50) * 100, 100);

  // Voucher progress tracking
  const pointsToVoucher = points % 100;
  const progressToVoucherPercent = Math.min((pointsToVoucher / 100) * 100, 100);

  // Evaluate badge unlocking logic
  const evaluateBadges = (history: ScanHistoryItem[], currentPoints: number) => {
    setBadges((prevBadges) => {
      let changed = false;
      const updated = prevBadges.map((badge) => {
        if (badge.unlocked) return badge;

        let shouldUnlock = false;
        
        // Handle milestone points achievement badges
        if (badge.id === "eco_beginner" && currentPoints >= 20) {
          shouldUnlock = true;
        } else if (badge.id === "eco_explorer" && currentPoints >= 50) {
          shouldUnlock = true;
        } else if (badge.id === "eco_champion" && currentPoints >= 100) {
          shouldUnlock = true;
        }
        
        // Handle generic count badges
        else if (badge.type === "first_scan" && history.length >= 1) {
          shouldUnlock = true;
        } else if (badge.type === "wet_count") {
          const wets = history.filter(h => (h.correctedCategory || h.category) === "Wet/Biodegradable").length;
          if (wets >= 5) shouldUnlock = true;
        } else if (badge.type === "dry_count") {
          const drys = history.filter(h => (h.correctedCategory || h.category) === "Dry/Recyclable").length;
          if (drys >= 5) shouldUnlock = true;
        } else if (badge.type === "hazard_count") {
          const hazards = history.filter(h => (h.correctedCategory || h.category) === "Hazardous").length;
          if (hazards >= 1) shouldUnlock = true;
        }

        if (shouldUnlock) {
          changed = true;
          return { ...badge, unlocked: true };
        }
        return badge;
      });

      return changed ? updated : prevBadges;
    });
  };

  // Profile management
  const handleProfileSave = (newProfile: Profile) => {
    setProfile(newProfile);
    // Give 10 initial bonus points
    setPoints(10);
  };

  const handleResetApp = () => {
    if (confirm("Are you sure you want to reset all progress? You will lose all your points, rewards, and history! 😮")) {
      localStorage.clear();
      setProfile(null);
      setPoints(0);
      setScanHistory([]);
      setBadges(INITIAL_BADGES);
      setVouchers([]);
      setActiveTab("scan");
      setScannedImage(null);
      setCurrentResult(null);
      setIsScanning(false);
    }
  };

  // Video capture methods
  const startCamera = async () => {
    setAnalysisError(null);
    setUseLiveVideo(true);
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Could not access environment camera, falling back to file upload mode:", err);
      setUseLiveVideo(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setUseLiveVideo(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const rawDataUrl = canvas.toDataURL("image/jpeg");
        // Compress before preview & analysis to reduce API payload
        const dataUrl = await compressImage(rawDataUrl);
        setScannedImage(dataUrl);
        stopCamera();
        analyzeImage(dataUrl, "image/jpeg");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const rawDataUrl = reader.result as string;
        // Compress image before sending to reduce API payload size & latency
        const dataUrl = await compressImage(rawDataUrl);
        setScannedImage(dataUrl);
        setIsScanning(true);
        analyzeImage(dataUrl, "image/jpeg");
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze image via server proxy
  const analyzeImage = async (base64Image: string, mimeType: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentResult(null);
    setFeedbackSubmitted(false);
    setIsEditingClassification(false);

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image, mimeType })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to analyze image.");
      }

      const result: ScanResult = await response.json();
      processResult(result, base64Image);
    } catch (error: any) {
      console.error(error);
      setAnalysisError(error.message || "Oops! We could not reach the analysis server. Please check your internet connection.");
      setIsAnalyzing(false);
    }
  };

  // Demo scan helper
  const handleDemoScan = (item: ScanResult) => {
    setIsScanning(true);
    setIsAnalyzing(true);
    setAnalysisError(null);
    setFeedbackSubmitted(false);
    setIsEditingClassification(false);

    setTimeout(() => {
      setScannedImage(null); // No photo for demo
      processResult(item, null);
    }, 800);
  };

  const handleManualSort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualItemName.trim()) return;

    setIsScanning(true);
    setIsAnalyzing(true);
    setAnalysisError(null);
    setFeedbackSubmitted(true); // Manually entered, so feedback is pre-validated
    setIsEditingClassification(false);

    const query = manualItemName.trim().toLowerCase();
    const directoryMatch = directoryItems.find((i) => i.name.toLowerCase() === query);

    let kidReason = "";
    let disposalTip = "";

    if (directoryMatch && directoryMatch.category === manualCategory) {
      kidReason = `${directoryMatch.description} It's perfect for sorting! 🎉`;
      disposalTip = directoryMatch.parentTip;
    } else {
      if (manualCategory === "Wet/Biodegradable") {
        kidReason = `Worms and soil love to eat leftovers of ${manualItemName}! 🍏 This turns into super rich compost food for plants!`;
        disposalTip = "Keep food waste free from plastic wraps or labels.";
      } else if (manualCategory === "Dry/Recyclable") {
        kidReason = `We can transform old ${manualItemName} into cool new items like toys or school paper! 📦 Let's keep it dry and clean!`;
        disposalTip = "Give it a quick wipe or rinse, then place it in your dry sorting bin.";
      } else {
        kidReason = `Whoa! ${manualItemName} has special chemicals or batteries inside. ⚡ We must store it carefully to keep nature safe!`;
        disposalTip = "Store safely and drop it at a certified recycling point or retailer box.";
      }
    }

    const manualResult: ScanResult = {
      category: manualCategory,
      item_name: manualItemName.trim(),
      kid_reason: kidReason,
      disposal_tip: disposalTip
    };

    setTimeout(() => {
      setScannedImage(null);
      processResult(manualResult, null);
      setManualItemName("");
      setShowManualForm(false);
    }, 600);
  };

  const processResult = (result: ScanResult, base64Image: string | null) => {
    const lowercaseName = result.item_name.toLowerCase().trim();
    const alreadyScanned = scanHistory.some(
      (h) => h.itemName.toLowerCase().trim() === lowercaseName
    );

    const isNew = !alreadyScanned;
    setIsNewItemType(isNew);

    const basePoints = 10;
    const bonusPoints = isNew ? 5 : 0;
    const earned = basePoints + bonusPoints;

    setNewPointsEarned(earned);
    setCurrentResult(result);
    setIsAnalyzing(false);

    // Save to scan history
    const newHistoryItem: ScanHistoryItem = {
      id: "scan_" + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      itemName: result.item_name,
      category: result.category,
      kidReason: result.kid_reason,
      disposalTip: result.disposal_tip,
      pointsAwarded: earned,
      image: base64Image || undefined,
      feedbackCorrect: null
    };

    setScanHistory((prev) => [newHistoryItem, ...prev]);
    addPoints(earned, "Scan Waste 🔍");
    setScanStreak((prev) => {
      const n = prev + 1;
      localStorage.setItem("replay_scan_streak", n.toString());
      return n;
    });

    // Trigger visual confetti
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 4000);
  };

  // Accuracy Feedback Loop Handlers
  const handleFeedbackCorrect = (isCorrect: boolean) => {
    setFeedbackSubmitted(true);
    setScanHistory((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        feedbackCorrect: isCorrect
      };
      return updated;
    });
  };

  const handleStartCorrection = () => {
    if (!currentResult) return;
    setCorrectedCategory(currentResult.category);
    setCorrectedName(currentResult.item_name);
    setIsEditingClassification(true);
  };

  const handleSaveCorrection = () => {
    if (!correctedName.trim()) return;

    setScanHistory((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        feedbackCorrect: false,
        correctedCategory: correctedCategory,
        correctedItemName: correctedName.trim(),
        itemName: correctedName.trim(),
        category: correctedCategory
      };
      return updated;
    });

    if (currentResult) {
      setCurrentResult({
        ...currentResult,
        category: correctedCategory,
        item_name: correctedName.trim()
      });
    }

    setIsEditingClassification(false);
    setFeedbackSubmitted(true);
  };

  // Voucher Helpers
  const handleCopyCode = (voucher: Voucher) => {
    navigator.clipboard.writeText(voucher.code);
    setCopiedVoucherId(voucher.id);
    setTimeout(() => setCopiedVoucherId(null), 2000);
  };

  const handleToggleVoucherUsed = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, used: !v.used } : v))
    );
  };

  if (showSplash) {
    return (
      <AnimatePresence>
        <SplashScreen logoUrl={logoImg} onFinish={() => {
          localStorage.setItem("replay_seen_splash", "1");
          setShowSplash(false);
        }} />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/40 flex flex-col font-sans text-gray-800 pb-24">
      
      {/* Dynamic Confetti Celebration Overlay */}
      {showCelebration && <Confetti />}

      {/* Floating Eco Points Animations */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {pointNotices.map((notice) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 150, scale: 0.8 }}
              animate={{ opacity: 1, y: -200, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 bottom-20 bg-emerald-600 border-2 border-white text-white font-display font-black text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap z-50"
            >
              <span>🌱</span>
              <span>{notice.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b-3 border-emerald-100 px-4 py-3 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={logoImg} 
              alt="Re:Play Logo" 
              className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-300 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-display font-black text-lg text-emerald-600 tracking-tight leading-none">Re:Play</h1>
              <p className="text-[10px] text-emerald-500 font-bold tracking-wide uppercase mt-0.5">Little Hands, Big Impact.</p>
            </div>
          </div>

          {profile && (
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border-2 border-emerald-200 shadow-2xs">
              <span className="text-xl" title={profile.name}>{profile.avatar}</span>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-emerald-700 leading-none">{profile.name}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-500 leading-none mt-0.5">{points} pts</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Interactive Milestone Reward Modal */}
      <AnimatePresence>
        {showVoucherModal && latestVoucher && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border-3 border-emerald-500 p-6 max-w-sm w-full shadow-2xl text-center space-y-4 relative"
            >
              <button
                onClick={() => setShowVoucherModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors font-bold text-lg"
              >
                ✕
              </button>

              <span className="text-6xl animate-bounce block">🎁</span>
              
              <div>
                <h3 className="font-display font-black text-2xl text-emerald-600">Milestone Reached!</h3>
                <p className="text-xs text-gray-500 mt-1">Awesome sorting job! You've unlocked a special reward!</p>
              </div>

              {/* Colorful Ticket Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-5 border-2 border-dashed border-white/40 shadow-md relative overflow-hidden">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>

                <span className="text-xs font-mono font-bold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full">Discount Voucher</span>
                <h4 className="font-display font-black text-2xl mt-2 leading-tight">{latestVoucher.discount}</h4>
                <p className="font-bold text-sm mt-1">{latestVoucher.title}</p>
                <p className="text-[10px] text-indigo-100 mt-1 leading-relaxed">{latestVoucher.description}</p>
                
                <div className="mt-4 pt-3 border-t border-white/20 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono tracking-wider font-semibold opacity-85">PROMO CODE</span>
                  <div className="bg-white/10 hover:bg-white/15 cursor-pointer font-mono font-bold text-sm select-all tracking-widest px-4 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
                    {latestVoucher.code}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  handleCopyCode(latestVoucher);
                  setShowVoucherModal(false);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-sm py-3 rounded-xl border-b-4 border-emerald-700 shadow-md flex items-center justify-center gap-1"
              >
                Copy Code & Close 🎟️
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-grow w-full max-w-md mx-auto px-4 py-4 relative">
        <AnimatePresence mode="wait">
          {!profile ? (
            <ProfileSetup onSave={handleProfileSave} />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* TAB 1: SCAN & LEARN */}
              {activeTab === "scan" && (
                <div className="space-y-6">
                  {/* Parent Helper Banner */}
                  <div className="bg-sky-50 border-3 border-sky-300 rounded-3xl p-4 shadow-[0_4px_0_0_#bae6fd] flex items-start gap-3">
                    <span className="text-2xl mt-0.5">👩‍👦</span>
                    <div>
                      <h4 className="font-display font-bold text-sky-800 text-sm">Parent & Child Co-play:</h4>
                      <p className="text-xs text-sky-700 mt-0.5 leading-relaxed">
                        Hold an item like an old container or banana peel together, snap a photo below, and let Re:Play classify it with dynamic educational YouTube video clubs!
                      </p>
                    </div>
                  </div>

                  {/* Main Action Stage */}
                  {!isScanning ? (
                    <div className="flex flex-col items-center justify-center bg-white rounded-3xl border-3 border-emerald-500 p-8 shadow-[0_8px_0_0_#10b981] text-center space-y-6">
                      <div className="relative">
                        <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-200 animate-pulse">
                          <Camera className="w-12 h-12 text-emerald-500" />
                        </div>
                        <span className="absolute -bottom-2 -right-2 text-3xl animate-bounce">✨</span>
                      </div>

                      <div>
                        <h2 className="font-display font-bold text-2xl text-gray-800">Ready to Sort Waste?</h2>
                        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                          Take a picture of household recyclables, dry boxes, or organic food scraps to learn how they help save our Earth!
                        </p>
                      </div>

                      {/* Camera / Upload buttons */}
                      <div className="w-full space-y-3">
                        <button
                          id="btn-scan-camera"
                          onClick={startCamera}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-lg py-4 px-6 rounded-2xl border-b-6 border-emerald-700 shadow-[0_6px_0_0_#047857] transition-all flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none"
                        >
                          <Camera className="w-5 h-5" />
                          Use Live Camera 📸
                        </button>

                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-gray-100"></div>
                          </div>
                          <span className="relative px-3 bg-white text-xs font-bold text-gray-400 uppercase tracking-wider">or upload photo</span>
                        </div>

                        <label className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-3 border-emerald-200 border-dashed rounded-2xl py-4 px-6 flex items-center justify-center gap-2 cursor-pointer transition-all">
                          <Upload className="w-5 h-5" />
                          <span className="font-display font-bold">Pick from Photo Gallery</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Manual Form or Trigger Button */}
                      {showManualForm ? (
                        <form onSubmit={handleManualSort} className="w-full bg-emerald-50/75 border-3 border-emerald-200 rounded-3xl p-5 space-y-4 text-left shadow-sm">
                          <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                            <h3 className="font-display font-bold text-gray-800 text-sm flex items-center gap-1">
                              📝 Parent & Kid Sort Guide
                            </h3>
                            <button
                              type="button"
                              onClick={() => setShowManualForm(false)}
                              className="text-gray-400 hover:text-rose-500 text-xs font-bold"
                            >
                              ✕ Close
                            </button>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">What item are you sorting?</label>
                            <input
                              type="text"
                              value={manualItemName}
                              onChange={(e) => setManualItemName(e.target.value)}
                              placeholder="Enter the name of the waste item..."
                              className="w-full px-4 py-2.5 text-sm bg-white border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none rounded-xl"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Which bin does it belong in?</label>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => setManualCategory("Wet/Biodegradable")}
                                className={`p-2 rounded-xl border-2 text-center text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                                  manualCategory === "Wet/Biodegradable"
                                    ? "bg-green-500 text-white border-green-600 shadow-sm scale-105"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                                }`}
                              >
                                <span className="text-xl">🟢</span>
                                <span className="text-[10px]">Wet</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setManualCategory("Dry/Recyclable")}
                                className={`p-2 rounded-xl border-2 text-center text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                                  manualCategory === "Dry/Recyclable"
                                    ? "bg-blue-500 text-white border-blue-600 shadow-sm scale-105"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                                }`}
                              >
                                <span className="text-xl">🔵</span>
                                <span className="text-[10px]">Dry</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setManualCategory("Hazardous")}
                                className={`p-2 rounded-xl border-2 text-center text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                                  manualCategory === "Hazardous"
                                    ? "bg-rose-500 text-white border-rose-600 shadow-sm scale-105"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-rose-300"
                                }`}
                              >
                                <span className="text-xl">🔴</span>
                                <span className="text-[10px]">Hazard</span>
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold py-3 px-4 rounded-xl shadow-md text-xs transition-transform"
                          >
                            Submit & Earn Points! 🌟
                          </button>
                        </form>
                      ) : (
                        <div className="flex flex-col gap-2 w-full pt-1">
                          <button
                            onClick={() => setShowManualForm(true)}
                            className="text-xs font-bold text-emerald-600 hover:underline flex items-center justify-center gap-1 bg-emerald-50 border-2 border-emerald-200 rounded-2xl py-3 px-4 transition-all"
                          >
                            📝 Type the Name of the Object
                          </button>
                        </div>
                      )}

                      {/* Demo Fallback Trigger */}
                      <button
                        onClick={() => setShowDemoList(!showDemoList)}
                        className="text-xs font-bold text-gray-500 hover:text-emerald-600 hover:underline flex items-center gap-1 mt-1 justify-center"
                      >
                        <Info className="w-3.5 h-3.5" />
                        No real items nearby? Try Simulated Demo Items!
                      </button>

                      {showDemoList && (
                        <div className="w-full bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 text-left space-y-2">
                          <p className="text-xs font-bold text-gray-500 mb-2">Select a household waste item to simulate classification:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {demoItems.map((demo, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleDemoScan(demo)}
                                className="p-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:border-emerald-400 rounded-xl text-left transition-colors truncate"
                              >
                                {demo.category === "Wet/Biodegradable" ? "🟢" : demo.category === "Dry/Recyclable" ? "🔵" : "🔴"}{" "}
                                {demo.item_name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* SCANNING ACTIVE VIEW */
                    <div className="space-y-6">
                      {/* Live Viewfinder Modal/Section */}
                      {useLiveVideo && !scannedImage && (
                        <div className="relative bg-black rounded-3xl overflow-hidden border-4 border-emerald-400 aspect-[4/3] shadow-lg">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 border-[24px] border-black/30 pointer-events-none flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-dashed border-white/60 rounded-2xl"></div>
                          </div>
                          
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
                            <button
                              onClick={() => {
                                stopCamera();
                                setIsScanning(false);
                              }}
                              className="bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md"
                            >
                              <X className="w-4 h-4" /> Cancel
                            </button>
                            <button
                              onClick={capturePhoto}
                              className="bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-1 shadow-md animate-pulse"
                            >
                              <Camera className="w-4 h-4" /> Take Picture!
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Analysis Wait State */}
                      {isAnalyzing && (
                        <div className="bg-white rounded-3xl border-3 border-emerald-300 p-8 shadow-md text-center flex flex-col items-center space-y-4">
                          <div className="relative">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-3 border-emerald-200 animate-spin">
                              <img src={logoImg} alt="Re:Play Spinner" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="absolute top-0 right-0 text-2xl animate-bounce">⚡</span>
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-xl text-gray-800">Re:Play AI is Thinking...</h3>
                            <p className="text-sm text-gray-500 mt-1">We are teaching {profile.name} how to sort this item!</p>
                          </div>
                        </div>
                      )}

                      {/* Error Display */}
                      {analysisError && (
                        <div className="bg-rose-50 border-3 border-rose-300 rounded-3xl p-6 shadow-md text-center space-y-4">
                          <span className="text-4xl">⚠️</span>
                          <div>
                            <h3 className="font-display font-bold text-rose-800 text-lg">Whoops! Something went wrong</h3>
                            <p className="text-xs text-rose-600 mt-1">{analysisError}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                            <button
                              onClick={() => {
                                setAnalysisError(null);
                                setIsScanning(false);
                                setScannedImage(null);
                                stopCamera();
                              }}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-bold text-xs"
                            >
                              Go Back
                            </button>
                            <button
                              onClick={() => scannedImage && analyzeImage(scannedImage, "image/jpeg")}
                              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl font-bold text-xs"
                            >
                              Try Again 🔄
                            </button>
                            <button
                              onClick={() => {
                                setAnalysisError(null);
                                setIsScanning(false);
                                setScannedImage(null);
                                stopCamera();
                                setShowManualForm(true);
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl font-bold text-xs"
                            >
                              Type the Name of the Object 📝
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ANALYSIS SUCCESS CARD */}
                      {currentResult && (
                        <div className="relative space-y-6">
                          {/* Celebration overlay */}
                          {showCelebration && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none animate-star-burst">
                              <div className="bg-emerald-500 text-white px-4 py-2 rounded-full font-display font-bold text-sm shadow-lg flex items-center gap-1 whitespace-nowrap">
                                <Sparkles className="w-4 h-4 animate-spin" />
                                {isNewItemType ? "+15 Points! New Item! 🎉" : "+10 Points! Good Job! 🌟"}
                              </div>
                            </div>
                          )}

                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl border-3 border-emerald-500 p-6 shadow-[0_8px_0_0_#10b981] overflow-hidden"
                          >
                            {/* Category Badge Header */}
                            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4 mb-4">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Classified Result</span>
                              <span
                                className={`px-4 py-1.5 rounded-full font-display font-bold text-xs border-2 shadow-sm ${
                                  currentResult.category === "Wet/Biodegradable"
                                    ? "bg-green-100 border-green-300 text-green-700"
                                    : currentResult.category === "Dry/Recyclable"
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : "bg-rose-100 border-rose-300 text-rose-700"
                                }`}
                              >
                                {currentResult.category === "Wet/Biodegradable" ? "🟢 Wet Waste" : currentResult.category === "Dry/Recyclable" ? "🔵 Dry Waste" : "🔴 Hazardous"}
                              </span>
                            </div>

                            {/* Main Waste Photo (if exists) */}
                            {scannedImage && (
                              <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 border border-gray-100 relative">
                                <img src={scannedImage} alt="scanned item" className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold">
                                  Item photo
                                </div>
                              </div>
                            )}

                            {/* Waste Name & Kid explanation */}
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-display font-black text-2xl text-gray-800 capitalize">
                                  {currentResult.item_name}
                                </h3>
                                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mt-1">For {profile.name} (The Kid):</p>
                                <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-3.5 mt-1 text-sm text-gray-700 italic font-bold leading-relaxed">
                                  "{currentResult.kid_reason}"
                                </div>
                              </div>

                              {/* Parent Disposal Tip */}
                              <div className="pt-2 border-t border-dashed border-gray-100">
                                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">For Parent (Practical Tip):</p>
                                <div className="bg-sky-50/50 border-2 border-sky-100 rounded-2xl p-3.5 mt-1 text-xs text-sky-800 font-medium flex gap-2">
                                  <Info className="w-4.5 h-4.5 text-sky-500 shrink-0 mt-0.5" />
                                  <span>{currentResult.disposal_tip}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {/* ACCURACY FEEDBACK LOOP WORKFLOW */}
                          <div className="bg-amber-50 border-3 border-amber-300 rounded-3xl p-5 shadow-[0_4px_0_0_#fde68a] space-y-3">
                            <div className="flex items-start gap-2.5">
                              <span className="text-xl">🛠️</span>
                              <div>
                                <h4 className="font-display font-bold text-amber-900 text-sm">Parent Verification Loop:</h4>
                                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                                  Is this item name and category correct? This teaches our AI and your child correct environmental habits.
                                </p>
                              </div>
                            </div>

                            {!feedbackSubmitted && !isEditingClassification ? (
                              <div className="flex gap-2.5 pt-1">
                                <button
                                  onClick={() => handleFeedbackCorrect(true)}
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 shadow-sm"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" /> Yes, Accurate!
                                </button>
                                <button
                                  onClick={handleStartCorrection}
                                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 shadow-sm"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" /> No, Correct It
                                </button>
                              </div>
                            ) : isEditingClassification ? (
                              <div className="bg-white border-2 border-amber-200 rounded-2xl p-3 space-y-3 mt-1">
                                <p className="text-[10px] font-mono font-bold text-amber-600 uppercase">Correct categorization data:</p>
                                
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Item Name:</label>
                                    <input
                                      type="text"
                                      value={correctedName}
                                      onChange={(e) => setCorrectedName(e.target.value)}
                                      className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-0"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Waste Category:</label>
                                    <select
                                      value={correctedCategory}
                                      onChange={(e) => setCorrectedCategory(e.target.value as WasteCategory)}
                                      className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:border-amber-400 focus:ring-0"
                                    >
                                      <option value="Wet/Biodegradable">Wet/Biodegradable</option>
                                      <option value="Dry/Recyclable">Dry/Recyclable</option>
                                      <option value="Hazardous">Hazardous</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="flex gap-2 justify-end pt-1">
                                  <button
                                    onClick={() => setIsEditingClassification(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveCorrection}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                                  >
                                    Save & Confirm
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-amber-100/50 rounded-xl p-2.5 text-center text-xs font-bold text-amber-800 flex items-center justify-center gap-1">
                                <Check className="w-4 h-4 text-emerald-600" /> Thanks for validating! Feedback saved to database.
                              </div>
                            )}
                          </div>

                          {/* CONTEXTUAL ACTION CARDS (RECYCLE / REUSE / COMPOST) */}
                          {currentResult.category === "Dry/Recyclable" && (
                            <>
                              <RecycleCta onCompleteActivity={handleCompleteActivity} />
                              <ReuseCta onCompleteActivity={handleCompleteActivity} />
                            </>
                          )}

                          {currentResult.category === "Wet/Biodegradable" && (
                            <CompostSuggestion onCompleteActivity={handleCompleteActivity} />
                          )}

                          {/* YOUTUBE LEARNING RECOMMENDATIONS CARD */}
                          <div className="bg-white rounded-3xl border-3 border-rose-400 p-5 shadow-[0_5px_0_0_#f87171] space-y-4">
                            <div className="flex items-center gap-2 border-b-2 border-rose-100 pb-2">
                              <span className="text-2xl">📺</span>
                              <div>
                                <h4 className="font-display font-black text-rose-800 text-sm">Re:Play Video Club</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Learn more about recycling!</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {YOUTUBE_RECOMMENDATIONS[currentResult.category]?.map((video) => (
                                <div key={video.id} className="flex gap-3 items-start bg-rose-50/20 hover:bg-rose-50/50 p-2.5 rounded-2xl border border-rose-100/60 transition-all">
                                  <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-rose-200 relative">
                                    <img 
                                      src={video.thumbnail} 
                                      alt={video.title} 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center">
                                      <span className="bg-red-600 text-white rounded-full p-1 shadow-md scale-75 leading-none">▶️</span>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <h5 className="font-display font-bold text-xs text-gray-800 leading-snug truncate">{video.title}</h5>
                                    <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed font-medium">{video.description}</p>
                                    <a
                                      href={video.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline mt-1.5"
                                    >
                                      Watch on YouTube 📺
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Scan another action button */}
                          <button
                            onClick={() => {
                              setCurrentResult(null);
                              setIsScanning(false);
                              setScannedImage(null);
                              setFeedbackSubmitted(false);
                              setIsEditingClassification(false);
                            }}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold text-lg py-4 px-6 rounded-2xl border-b-6 border-emerald-700 shadow-[0_6px_0_0_#047857] transition-all flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none"
                          >
                            <Plus className="w-5 h-5" /> Scan Another Item!
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MY PROGRESS & REWARDS */}
              {activeTab === "progress" && (
                <div className="space-y-6">
                  {/* Parent level info */}
                  <div className="bg-white rounded-3xl border-3 border-emerald-500 p-6 shadow-[0_8px_0_0_#10b981] text-center space-y-4">
                    <span className="text-5xl animate-pulse block">🏆</span>
                    <div>
                      <h2 className="font-display font-black text-2xl text-gray-800">
                        {profile.name}'s Adventure
                      </h2>
                      <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-200">
                        Rank: {levelName} (Level {currentLevel})
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-gray-400">
                        <span>XP Progress</span>
                        <span>{pointsInCurrentLevel} / 50 XP</span>
                      </div>
                      <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden p-1 border-2 border-gray-200">
                        <div
                          style={{ width: `${progressPercent}%` }}
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        ></div>
                      </div>
                      <p className="text-[10px] font-semibold text-gray-400">
                        Collect {50 - pointsInCurrentLevel} more points to reach Level {currentLevel + 1}!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-emerald-50 p-3 rounded-2xl border-2 border-emerald-100 text-center shadow-2xs">
                        <span className="text-[10px] uppercase font-bold text-emerald-500 font-mono tracking-wider">Total Score</span>
                        <p className="text-2xl font-display font-black text-emerald-700 mt-0.5">{points} XP</p>
                      </div>
                      <div className="bg-sky-50 p-3 rounded-2xl border-2 border-sky-100 text-center shadow-2xs">
                        <span className="text-[10px] uppercase font-bold text-sky-500 font-mono tracking-wider">Items Sorted</span>
                        <p className="text-2xl font-display font-black text-sky-700 mt-0.5">{scanHistory.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* TIME SPENT CARD */}
                  <div className="bg-white rounded-3xl border-3 border-sky-500 p-5 shadow-[0_6px_0_0_#0ea5e9] space-y-4">
                    <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-sky-500 animate-spin-slow">
                          <Clock className="w-5 h-5 text-sky-500" />
                        </span>
                        <div>
                          <h3 className="font-display font-black text-sky-950 text-sm flex items-center gap-1.5">
                            ⏱ Time Spent
                          </h3>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Earn +20 points every active hour!</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-sky-600 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full uppercase">
                        Live ⏱️
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline py-1">
                      <span className="text-xs font-bold text-gray-500">Total Active Exploration:</span>
                      <motion.span
                        key={totalActiveSeconds}
                        initial={{ scale: 1.15, color: "#0ea5e9" }}
                        animate={{ scale: 1, color: "#1e293b" }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl font-display font-black text-gray-800"
                      >
                        {formatActiveTime(totalActiveSeconds)}
                      </motion.span>
                    </div>

                    {/* Progress bar to next reward */}
                    <div className="space-y-2 pt-1">
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-1 border-2 border-sky-100">
                        <div
                          style={{ width: `${((totalActiveSeconds % 3600) / 3600) * 100}%` }}
                          className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        ></div>
                      </div>
                      <div className="text-[10px] font-bold text-sky-700 space-y-1">
                        <p className="flex justify-between">
                          <span>Progress: {Math.floor((totalActiveSeconds % 3600) / 60)} min / 60 min</span>
                        </p>
                        <p className="bg-sky-50 p-2 rounded-xl border border-sky-100 text-center font-black animate-pulse">
                          {Math.ceil((3600 - (totalActiveSeconds % 3600)) / 60)} minutes until +20 Eco Points
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LEARNING PROGRESS SECTION */}
                  <div className="bg-white rounded-3xl border-3 border-amber-400 p-5 shadow-[0_6px_0_0_#fbbf24] space-y-4">
                    <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
                      <span className="text-2.5xl">📈</span>
                      <div>
                        <h3 className="font-display font-black text-amber-900 text-sm">Learning Progress</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Real-Time Adventure Dashboard</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200 flex flex-col justify-between">
                        <span className="text-[9px] uppercase font-bold text-amber-600 font-mono tracking-wider">Total Active Time</span>
                        <p className="text-lg font-display font-black text-amber-900 mt-1">{formatActiveTime(totalActiveSeconds)}</p>
                      </div>

                      <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200 flex flex-col justify-between">
                        <span className="text-[9px] uppercase font-bold text-amber-600 font-mono tracking-wider">Today's Active Time</span>
                        <p className="text-lg font-display font-black text-amber-900 mt-1">{formatActiveTime(todayActiveSeconds)}</p>
                      </div>

                      <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200 flex flex-col justify-between">
                        <span className="text-[9px] uppercase font-bold text-amber-600 font-mono tracking-wider">Points From Time</span>
                        <p className="text-lg font-display font-black text-amber-950 mt-1">⭐ {hoursAwarded * 20} XP</p>
                      </div>

                      <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200 flex flex-col justify-between">
                        <span className="text-[9px] uppercase font-bold text-amber-600 font-mono tracking-wider">Current Streak</span>
                        <p className="text-xs font-bold text-amber-800 mt-1 leading-relaxed">
                          🔥 {loginStreak} Day Streak<br />
                          📸 {scanStreak} Scans
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-center">
                      <span className="text-[10px] uppercase font-bold text-amber-600 font-mono tracking-wider block">Total Eco Points</span>
                      <p className="text-2xl font-display font-black text-amber-800 mt-0.5">{points} XP</p>
                    </div>
                  </div>

                  {/* VOUCHER & REWARDS PANEL */}
                  <div className="bg-white rounded-3xl border-3 border-indigo-500 p-5 shadow-[0_6px_0_0_#6366f1] space-y-4">
                    <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                      <span className="text-2.5xl">🎁</span>
                      <div>
                        <h3 className="font-display font-black text-indigo-900 text-base">Discount Vouchers & Rewards</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unlock a new gift every 100 XP!</p>
                      </div>
                    </div>

                    {/* Progress toward voucher milestone */}
                    <div className="bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                          <Gift className="w-4 h-4 text-indigo-500 animate-bounce" /> Progress to Next Voucher:
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-600">{pointsToVoucher} / 100 XP</span>
                      </div>
                      <div className="w-full h-4 bg-gray-150 rounded-full p-1 border-2 border-indigo-200 overflow-hidden">
                        <div
                          style={{ width: `${progressToVoucherPercent}%` }}
                          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        ></div>
                      </div>
                      <p className="text-[9px] font-medium text-indigo-600 italic">
                        {100 - pointsToVoucher} more XP to automatically receive a real discount voucher code!
                      </p>
                    </div>

                    {/* Store Sub-tabs selector */}
                    <div className="flex bg-indigo-50 p-1 rounded-2xl border-2 border-indigo-100 gap-1.5">
                      <button
                        onClick={() => setRewardTab("redeem")}
                        className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                          rewardTab === "redeem"
                            ? "bg-indigo-500 text-white shadow-sm"
                            : "text-indigo-700 hover:bg-indigo-100/50"
                        }`}
                      >
                        Redeem Rewards 🌟
                      </button>
                      <button
                        onClick={() => setRewardTab("my")}
                        className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                          rewardTab === "my"
                            ? "bg-indigo-500 text-white shadow-sm"
                            : "text-indigo-700 hover:bg-indigo-100/50"
                        }`}
                      >
                        My Rewards 🎟️
                        {vouchers.length > 0 && (
                          <span className="bg-rose-500 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                            {vouchers.length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* REDEEM STORE TAB */}
                    {rewardTab === "redeem" && (
                      <div className="space-y-4 pt-1">
                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-1.5 justify-start">
                          <button
                            onClick={() => setRewardCat("all")}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-2 transition-all ${
                              rewardCat === "all"
                                ? "bg-indigo-500 text-white border-indigo-600 shadow-2xs"
                                : "bg-white text-gray-600 border-gray-100 hover:border-indigo-200"
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setRewardCat("toys")}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-2 transition-all flex items-center gap-1 ${
                              rewardCat === "toys"
                                ? "bg-indigo-500 text-white border-indigo-600 shadow-2xs"
                                : "bg-white text-gray-600 border-gray-100 hover:border-indigo-200"
                            }`}
                          >
                            🧸 Toys
                          </button>
                          <button
                            onClick={() => setRewardCat("stationery")}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-2 transition-all flex items-center gap-1 ${
                              rewardCat === "stationery"
                                ? "bg-indigo-500 text-white border-indigo-600 shadow-2xs"
                                : "bg-white text-gray-600 border-gray-100 hover:border-indigo-200"
                            }`}
                          >
                            📚 Stationery
                          </button>
                          <button
                            onClick={() => setRewardCat("food")}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-2 transition-all flex items-center gap-1 ${
                              rewardCat === "food"
                                ? "bg-indigo-500 text-white border-indigo-600 shadow-2xs"
                                : "bg-white text-gray-600 border-gray-100 hover:border-indigo-200"
                            }`}
                          >
                            🍔 Food
                          </button>
                        </div>

                        {/* Store Cards list */}
                        <div className="space-y-3">
                          {REWARD_PRODUCTS.filter((p) => rewardCat === "all" || p.category === rewardCat).map((prod) => {
                            const isLocked = points < prod.cost;
                            
                            return (
                              <div
                                key={prod.id}
                                className="bg-indigo-50/20 border-2 border-indigo-100 rounded-2.5xl p-3 flex gap-3 items-center relative overflow-hidden text-left"
                              >
                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-indigo-100">
                                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-1">
                                    <h4 className="font-display font-bold text-xs text-indigo-900 truncate">{prod.title}</h4>
                                    <span className="bg-indigo-100 text-indigo-700 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase shrink-0 font-mono">
                                      {prod.discount}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5 font-medium">{prod.description}</p>
                                  
                                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-indigo-100/30">
                                    <span className="text-xs font-black text-amber-500 flex items-center gap-0.5 font-mono">
                                      ⭐ {prod.cost} XP
                                    </span>

                                    <button
                                      disabled={isLocked}
                                      onClick={() => {
                                        // Deduct points
                                        setPoints(prev => prev - prod.cost);
                                        // Add to vouchers
                                        const code = `PLAY-${prod.category.toUpperCase().substring(0,3)}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
                                        const newV: Voucher = {
                                          id: `v_store_${Date.now()}`,
                                          code,
                                          title: prod.title,
                                          description: prod.description,
                                          discount: prod.discount,
                                          unlockedAt: new Date().toLocaleDateString(),
                                          used: false
                                        };
                                        setVouchers(prev => [newV, ...prev]);
                                        setLatestVoucher(newV);
                                        setShowVoucherModal(true);
                                        addPoints(0, `Unlocked ${prod.title}! 🎟️`);
                                      }}
                                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                                        isLocked
                                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                          : "bg-indigo-500 hover:bg-indigo-600 text-white border-b-2 border-indigo-700 shadow-2xs active:scale-95"
                                      }`}
                                    >
                                      {isLocked ? "Locked 🔒" : "Redeem 🎁"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* MY REWARDS TAB */}
                    {rewardTab === "my" && (
                      <div className="space-y-3 pt-1">
                        {vouchers.length === 0 ? (
                          <div className="text-center py-6 bg-indigo-50/10 border border-dashed border-indigo-200 rounded-2xl text-xs text-gray-400 font-semibold">
                            🎟️ No vouchers unlocked yet.<br />Earn or redeem points to get your first reward!
                          </div>
                        ) : (
                          vouchers.map((v) => (
                            <div
                              key={v.id}
                              className={`p-4 rounded-2xl border-2 border-indigo-100 flex flex-col justify-between gap-3 relative overflow-hidden transition-all text-left ${
                                v.used 
                                  ? "bg-gray-50 border-gray-200 opacity-60 scale-98" 
                                  : "bg-gradient-to-r from-indigo-50/60 to-purple-50/60 hover:shadow-xs border-indigo-200"
                              }`}
                            >
                              {/* Watermark/Used stamp */}
                              {v.used && (
                                <div className="absolute top-2 right-4 border-3 border-rose-500 text-rose-500 text-[10px] font-black uppercase tracking-widest py-0.5 px-2 rounded-md rotate-12 select-none">
                                  Used ✅
                                </div>
                              )}

                              <div>
                                <div className="flex justify-between items-start">
                                  <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-mono">
                                    {v.discount}
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-semibold">{v.unlockedAt}</span>
                                </div>
                                <h4 className="font-display font-bold text-sm text-gray-800 mt-2">{v.title}</h4>
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed font-medium">{v.description}</p>
                              </div>

                              <hr className="border-indigo-100/40" />

                              <div className="flex gap-2 items-center justify-between">
                                <div className="bg-white/70 border border-indigo-150 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-indigo-700 tracking-wider flex items-center gap-2 select-all">
                                  <code>{v.code}</code>
                                </div>

                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    onClick={() => handleCopyCode(v)}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1 transition-transform active:scale-95"
                                    title="Copy Code"
                                  >
                                    {copiedVoucherId === v.id ? "Copied! 👍" : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={() => handleToggleVoucherUsed(v.id)}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                                      v.used
                                        ? "bg-gray-200 text-gray-500 border border-gray-300"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white border-b-2 border-emerald-700 shadow-2xs"
                                    }`}
                                  >
                                    {v.used ? "Reset" : "Redeem"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Badges Section */}
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-800 mb-3 flex items-center gap-1.5">
                      <Award className="w-5 h-5 text-emerald-600" /> Locked & Unlocked Badges
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {badges.map((badge) => (
                        <div
                          key={badge.id}
                          className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center transition-all ${
                            badge.unlocked
                              ? "bg-white border-emerald-500 shadow-[0_6px_0_0_#10b981]"
                              : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <span className={`text-4xl mb-2 ${badge.unlocked ? "scale-110" : "grayscale"}`}>
                            {badge.icon}
                          </span>
                          <h4 className="font-display font-bold text-sm text-gray-800 leading-tight">{badge.title}</h4>
                          <p className="text-[11px] text-gray-500 mt-1.5 leading-normal">{badge.description}</p>
                          <div className="mt-3">
                            {badge.unlocked ? (
                              <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-200">
                                Unlocked! 🎉
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-500 font-bold text-[10px] px-2.5 py-1 rounded-full border border-gray-200">
                                Locked 🔒
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings / Reset Option */}
                  <div className="pt-4 text-center">
                    <button
                      onClick={handleResetApp}
                      className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 mx-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset my profile, points & rewards
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: WHERE IT GOES */}
              {activeTab === "directory" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border-3 border-emerald-500 p-5 shadow-[0_6px_0_0_#10b981]">
                    <h2 className="font-display font-black text-xl text-gray-800">Quick Reference Directory</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Check which category waste goes into instantly.
                    </p>
                    <span className="inline-block mt-3 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      ⚠️ Re:Play Guidelines — check what is available in your local area!
                    </span>
                  </div>

                  {/* Categories Folders */}
                  <div className="space-y-4">
                    {directoryCategories.map((cat) => {
                      const itemsInCat = directoryItems.filter(i => i.category === (cat.id === "dry" ? "Dry/Recyclable" : cat.id === "wet" ? "Wet/Biodegradable" : "Hazardous"));
                      return (
                        <div
                          key={cat.id}
                          className={`bg-white rounded-3xl border-3 p-5 shadow-sm space-y-3 ${
                            cat.color === "green"
                              ? "border-green-500"
                              : cat.color === "blue"
                              ? "border-blue-500"
                              : "border-rose-500"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {cat.color === "green" ? "🟢" : cat.color === "blue" ? "🔵" : "🔴"}
                            </span>
                            <h3 className="font-display font-bold text-base text-gray-800">{cat.title}</h3>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed font-semibold bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                            💡 <span className="font-bold text-gray-700">Guide:</span> {cat.note}
                          </p>

                          <div className="space-y-2 pt-1">
                            {itemsInCat.map((item) => (
                              <div
                                key={item.name}
                                className="border-b border-gray-100 last:border-0 pb-2 last:pb-0 pt-1 text-left"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-display font-bold text-sm text-gray-800 capitalize">{item.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                                <p className="text-[11px] font-medium text-emerald-600 mt-1 bg-emerald-50/30 p-1.5 rounded border border-dashed border-emerald-100">
                                  🔧 <span className="font-bold text-emerald-700">Parent tip:</span> {item.parentTip}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: DASHBOARD & HISTORY */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Impact Multiplier Banner */}
                  <div className="bg-white rounded-3xl border-3 border-emerald-500 p-6 shadow-[0_8px_0_0_#10b981] space-y-4 text-center">
                    <span className="text-5xl block animate-bounce">🌍</span>
                    <div>
                      <h2 className="font-display font-black text-2xl text-gray-800">Your Green Footprint!</h2>
                      <p className="text-sm text-gray-500 mt-1">Based on household averages</p>
                    </div>

                    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-4">
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Landfill Diverted</p>
                      <h3 className="font-display font-black text-3xl text-emerald-600 mt-1">
                        ~{(scanHistory.length * 0.2).toFixed(1)} kg
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                        (Estimated as 0.2 kg saved per scanned item)
                      </p>
                    </div>
                  </div>

                  {/* TIME SPENT CARD (DASHBOARD SYNC) */}
                  <div className="bg-white rounded-3xl border-3 border-sky-500 p-5 shadow-[0_6px_0_0_#0ea5e9] space-y-4">
                    <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-sky-500 animate-spin-slow">
                          <Clock className="w-5 h-5 text-sky-500" />
                        </span>
                        <div>
                          <h3 className="font-display font-black text-sky-950 text-sm flex items-center gap-1.5">
                            ⏱ Time Spent
                          </h3>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Earn +20 points every active hour!</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-sky-600 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full uppercase">
                        Live ⏱️
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline py-1">
                      <span className="text-xs font-bold text-gray-500">Total Active Exploration:</span>
                      <motion.span
                        key={totalActiveSeconds}
                        initial={{ scale: 1.15, color: "#0ea5e9" }}
                        animate={{ scale: 1, color: "#1e293b" }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl font-display font-black text-gray-800"
                      >
                        {formatActiveTime(totalActiveSeconds)}
                      </motion.span>
                    </div>

                    {/* Progress bar to next reward */}
                    <div className="space-y-2 pt-1">
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-1 border-2 border-sky-100">
                        <div
                          style={{ width: `${((totalActiveSeconds % 3600) / 3600) * 100}%` }}
                          className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        ></div>
                      </div>
                      <div className="text-[10px] font-bold text-sky-700 space-y-1">
                        <p className="flex justify-between">
                          <span>Progress: {Math.floor((totalActiveSeconds % 3600) / 60)} min / 60 min</span>
                        </p>
                        <p className="bg-sky-50 p-2 rounded-xl border border-sky-100 text-center font-black animate-pulse">
                          {Math.ceil((3600 - (totalActiveSeconds % 3600)) / 60)} minutes until +20 Eco Points
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Custom Rounded Bar Chart of Category Distribution */}
                  <div className="bg-white rounded-3xl border-3 border-emerald-200 p-5 shadow-sm space-y-4">
                    <h3 className="font-display font-bold text-lg text-gray-800 flex items-center gap-1.5">
                      <BarChart2 className="w-5 h-5 text-emerald-600" /> Sort Breakdown
                    </h3>

                    {scanHistory.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-sm font-medium">
                        No items sorted yet! Tap Scan Waste 📸 to start.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Wet Waste Bar */}
                        <div className="space-y-1 text-left">
                          <div className="flex justify-between text-xs font-bold text-gray-600">
                            <span className="flex items-center gap-1">🟢 Wet/Biodegradable</span>
                            <span>{totalWet} items</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.max((totalWet / scanHistory.length) * 100, 3)}%` }}
                              className="h-full bg-green-500 rounded-full"
                            ></div>
                          </div>
                        </div>

                        {/* Dry Waste Bar */}
                        <div className="space-y-1 text-left">
                          <div className="flex justify-between text-xs font-bold text-gray-600">
                            <span className="flex items-center gap-1">🔵 Dry/Recyclable</span>
                            <span>{totalDry} items</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.max((totalDry / scanHistory.length) * 100, 3)}%` }}
                              className="h-full bg-blue-500 rounded-full"
                            ></div>
                          </div>
                        </div>

                        {/* Hazardous Bar */}
                        <div className="space-y-1 text-left">
                          <div className="flex justify-between text-xs font-bold text-gray-600">
                            <span className="flex items-center gap-1">🔴 Hazardous</span>
                            <span>{totalHazardous} items</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.max((totalHazardous / scanHistory.length) * 100, 3)}%` }}
                              className="h-full bg-rose-500 rounded-full"
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scan History list */}
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-lg text-gray-800 flex items-center gap-1.5 justify-start">
                      <TrendingUp className="w-5 h-5 text-emerald-600" /> Learning Log (Session History)
                    </h3>
                    
                    {scanHistory.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-left">History is currently empty.</p>
                    ) : (
                      <div className="space-y-3">
                        {scanHistory.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex gap-3 items-start relative shadow-sm text-left"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.itemName}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                                📦
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-display font-bold text-sm text-gray-800 capitalize truncate">
                                  {item.itemName}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-semibold">{item.timestamp}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-1.5">
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                    item.category === "Wet/Biodegradable"
                                      ? "bg-green-100 border-green-200 text-green-700"
                                      : item.category === "Dry/Recyclable"
                                      ? "bg-blue-100 border-blue-200 text-blue-700"
                                      : "bg-rose-100 border-rose-200 text-rose-700"
                                  }`}
                                >
                                  {item.category}
                                </span>

                                {item.feedbackCorrect === true && (
                                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-1.5 rounded flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" /> Correct
                                  </span>
                                )}

                                {item.feedbackCorrect === false && (
                                  <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-1.5 rounded flex items-center gap-0.5">
                                    <X className="w-2.5 h-2.5" /> Corrected
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: LEADERBOARD */}
              {activeTab === "leaderboard" && (
                <div className="space-y-6">
                  <LeaderboardView
                    points={points}
                    profile={profile}
                    loginStreak={loginStreak}
                    scanStreak={scanStreak}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Tab Bar */}
      {profile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-3 border-emerald-100 py-2.5 px-4 z-40 shadow-lg">
          <div className="max-w-md mx-auto flex justify-between items-center">
            {/* Tab 1: Scan */}
            <button
              onClick={() => setActiveTab("scan")}
              className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                activeTab === "scan" ? "text-emerald-500 scale-110 font-black" : "text-gray-400 font-medium"
              }`}
            >
              <Camera className="w-5 h-5" />
              <span className="text-[10px] leading-none font-bold">Scan</span>
            </button>

            {/* Tab 2: My Progress & Adventure */}
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                activeTab === "progress" ? "text-emerald-500 scale-110 font-black" : "text-gray-400 font-medium"
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="text-[10px] leading-none font-bold">Adventure</span>
            </button>

            {/* Tab: Leaderboard */}
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                activeTab === "leaderboard" ? "text-emerald-500 scale-110 font-black" : "text-gray-400 font-medium"
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-[10px] leading-none font-bold">Leaders</span>
            </button>

            {/* Tab 3: Directory */}
            <button
              onClick={() => setActiveTab("directory")}
              className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                activeTab === "directory" ? "text-emerald-500 scale-110 font-black" : "text-gray-400 font-medium"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] leading-none font-bold">Directory</span>
            </button>

            {/* Tab 4: Impact Dashboard */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                activeTab === "dashboard" ? "text-emerald-500 scale-110 font-black" : "text-gray-400 font-medium"
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-[10px] leading-none font-bold">Impact</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
