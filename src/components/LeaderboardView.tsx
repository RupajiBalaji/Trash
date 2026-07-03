import React from "react";
import { motion } from "motion/react";
import { Trophy, Flame, Star, Award, TrendingUp, Sparkles, User } from "lucide-react";

interface LeaderboardPlayer {
  name: string;
  avatar: string;
  points: number;
  loginStreak: number;
  scanStreak: number;
  scansCount: number;
  isCurrentUser?: boolean;
}

interface LeaderboardViewProps {
  userPoints: number;
  userName: string;
  userAvatar: string;
  userLoginStreak: number;
  userScanStreak: number;
  userHistoryCount: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  userPoints,
  userName,
  userAvatar,
  userLoginStreak,
  userScanStreak,
  userHistoryCount
}) => {
  // Mock competitors
  const competitors: LeaderboardPlayer[] = [
    { name: "Kiara", avatar: "🦊", points: 155, loginStreak: 5, scanStreak: 4, scansCount: 12 },
    { name: "Advait", avatar: "🐼", points: 120, loginStreak: 4, scanStreak: 3, scansCount: 9 },
    { name: "Dia", avatar: "🦄", points: 95, loginStreak: 3, scanStreak: 2, scansCount: 7 },
    { name: "Reyansh", avatar: "🦁", points: 70, loginStreak: 2, scanStreak: 2, scansCount: 5 },
  ];

  // Current user's stats
  const currentUserPlayer: LeaderboardPlayer = {
    name: userName || "Eco Hero",
    avatar: userAvatar || "🐸",
    points: userPoints,
    loginStreak: userLoginStreak || 1,
    scanStreak: userScanStreak || 0,
    scansCount: userHistoryCount,
    isCurrentUser: true
  };

  // Combine and calculate Consistency Score
  // Formula: points * 1 + loginStreak * 10 + scanStreak * 15 + scansCount * 5
  const calculateScore = (p: LeaderboardPlayer) => {
    return p.points + (p.loginStreak * 10) + (p.scanStreak * 15) + (p.scansCount * 5);
  };

  const allPlayers = [...competitors, currentUserPlayer].map(player => ({
    ...player,
    consistencyScore: calculateScore(player)
  }));

  // Sort descending by consistency score
  const sortedPlayers = allPlayers.sort((a, b) => b.consistencyScore - a.consistencyScore);

  // Map medal or badge for rank
  const getRankBadge = (rankIndex: number) => {
    if (rankIndex === 0) return { emoji: "🥇", label: "Gold", color: "bg-amber-100 text-amber-700 border-amber-300 ring-4 ring-amber-400/20" };
    if (rankIndex === 1) return { emoji: "🥈", label: "Silver", color: "bg-slate-100 text-slate-700 border-slate-300 ring-4 ring-slate-400/20" };
    if (rankIndex === 2) return { emoji: "🥉", label: "Bronze", color: "bg-orange-100 text-orange-700 border-orange-300 ring-4 ring-orange-400/20" };
    return { emoji: `#${rankIndex + 1}`, label: "", color: "bg-gray-50 text-gray-500 border-gray-200" };
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl border-3 border-indigo-600 p-5 shadow-[0_6px_0_0_#4f46e5] text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl" />
        <div className="absolute right-4 top-4 text-3xl animate-bounce">🏆</div>
        
        <div className="space-y-1">
          <h2 className="font-display font-black text-2.5xl leading-tight">Eco Champions Leaderboard</h2>
          <p className="text-xs text-indigo-100 leading-relaxed font-medium">
            Who is sorting consistently? Streaks and Eco Points combined define your score!
          </p>
        </div>

        {/* Scoring logic explain */}
        <div className="mt-4 bg-white/10 rounded-2xl p-2.5 border border-white/20 flex items-center gap-1.5 text-[9.5px] font-semibold text-indigo-50">
          <TrendingUp className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
          <span>Score = Eco Points + Login Streak (x10) + Scan Streak (x15)</span>
        </div>
      </div>

      {/* Podium Showcase for Top 3 */}
      <div className="grid grid-cols-3 gap-3 items-end pt-4 px-2">
        {/* Rank 2 (Silver) */}
        {sortedPlayers[1] && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex flex-col items-center bg-white border-2 border-slate-200 p-3 rounded-2xl text-center space-y-1 relative shadow-sm ${sortedPlayers[1].isCurrentUser ? "ring-2 ring-emerald-400" : ""}`}
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2.5xl">🥈</span>
            <span className="text-3xl filter drop-shadow-sm select-none">{sortedPlayers[1].avatar}</span>
            <h4 className="font-display font-bold text-xs text-gray-800 truncate w-full">{sortedPlayers[1].name}</h4>
            <div className="flex flex-col text-[10px] text-slate-600 font-bold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              <span>{sortedPlayers[1].points} XP</span>
            </div>
          </motion.div>
        )}

        {/* Rank 1 (Gold) */}
        {sortedPlayers[0] && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className={`flex flex-col items-center bg-gradient-to-b from-amber-50 to-white border-3 border-amber-400 p-4 rounded-3xl text-center space-y-1.5 relative shadow-md transform scale-105 z-10 ${sortedPlayers[0].isCurrentUser ? "ring-3 ring-emerald-400" : ""}`}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-4.5xl animate-bounce">🥇</span>
            <span className="text-4.5xl filter drop-shadow-md select-none">{sortedPlayers[0].avatar}</span>
            <h4 className="font-display font-black text-sm text-amber-900 truncate w-full">{sortedPlayers[0].name}</h4>
            <div className="flex flex-col text-[11px] text-amber-800 font-black bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              <span>{sortedPlayers[0].points} XP</span>
            </div>
            {sortedPlayers[0].isCurrentUser && (
              <span className="absolute -bottom-2 bg-emerald-500 text-white font-bold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">YOU</span>
            )}
          </motion.div>
        )}

        {/* Rank 3 (Bronze) */}
        {sortedPlayers[2] && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex flex-col items-center bg-white border-2 border-orange-200 p-3 rounded-2xl text-center space-y-1 relative shadow-sm ${sortedPlayers[2].isCurrentUser ? "ring-2 ring-emerald-400" : ""}`}
          >
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2.5xl">🥉</span>
            <span className="text-3xl filter drop-shadow-sm select-none">{sortedPlayers[2].avatar}</span>
            <h4 className="font-display font-bold text-xs text-gray-800 truncate w-full">{sortedPlayers[2].name}</h4>
            <div className="flex flex-col text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              <span>{sortedPlayers[2].points} XP</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-white rounded-3xl border-3 border-gray-100 p-4 shadow-sm space-y-3">
        <h3 className="font-display font-black text-gray-800 text-base mb-1 px-1 flex items-center gap-1.5">
          <Star className="w-5 h-5 text-indigo-500 fill-current animate-spin" /> Community Standings
        </h3>

        <div className="space-y-2.5">
          {sortedPlayers.map((player, index) => {
            const badge = getRankBadge(index);
            const score = player.consistencyScore;
            
            return (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-2.5xl border-2 flex items-center justify-between gap-3 transition-all ${
                  player.isCurrentUser
                    ? "bg-emerald-50/60 border-emerald-400 shadow-sm"
                    : "bg-white hover:bg-gray-50 border-gray-100"
                }`}
              >
                {/* Rank and Avatar */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center border text-xs select-none ${badge.color}`}>
                    {badge.emoji}
                  </div>

                  <span className="text-2.5xl select-none filter drop-shadow-xs">{player.avatar}</span>
                  
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display font-bold text-xs text-gray-800">{player.name}</h4>
                      {player.isCurrentUser && (
                        <span className="bg-emerald-500 text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase">You</span>
                      )}
                    </div>
                    
                    {/* Streaks row */}
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-semibold text-gray-400">
                      <span className="flex items-center gap-0.5 text-orange-500">
                        <Flame className="w-3.5 h-3.5 fill-current" /> {player.loginStreak}d
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-0.5 text-indigo-500">
                        📸 {player.scanStreak} streak
                      </span>
                    </div>
                  </div>
                </div>

                {/* Point and score */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-gray-800 flex items-center justify-end gap-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span>{player.points} pts</span>
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                    Score: {score}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
