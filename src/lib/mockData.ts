export const currentUser = {
  id: "1",
  name: "Arjun Sharma",
  username: "arjun_codes",
  email: "arjun@galgotias.edu",
  avatar: "",
  college: "Galgotias University",
  rank: 12,
  globalRank: 347,
  xp: 4850,
  nextLevelXp: 5500,
  level: 15,
  streak: 23,
  maxStreak: 45,
  leetcode: { handle: "arjun_codes", solved: 312, rating: 1847, contests: 28 },
  codeforces: { handle: "arjun_cf", rating: 1523, solved: 189, contests: 34 },
  github: { username: "arjunsharma", repos: 23, contributions: 847, stars: 156 },
  joinedAt: "2024-08-15",
  badges: ["🔥 Streak Master", "⚡ Speed Solver", "🏆 Top 20", "💎 Diamond Rank"],
};

export const leaderboardUsers = [
  { id: "r1", name: "Priya Patel", username: "priya_dev", rank: 9, xp: 5200, streak: 31, avatar: "", college: "Galgotias University", change: 2 },
  { id: "r2", name: "Vikram Singh", username: "vikram_code", rank: 10, xp: 5100, streak: 18, avatar: "", college: "Galgotias University", change: -1 },
  { id: "r3", name: "Neha Gupta", username: "neha_g", rank: 11, xp: 4950, streak: 25, avatar: "", college: "Galgotias University", change: 1 },
  { id: "1", name: "Arjun Sharma", username: "arjun_codes", rank: 12, xp: 4850, streak: 23, avatar: "", college: "Galgotias University", change: 0 },
  { id: "r4", name: "Rahul Verma", username: "rahul_v", rank: 13, xp: 4780, streak: 15, avatar: "", college: "Galgotias University", change: -2 },
  { id: "r5", name: "Ananya Roy", username: "ananya_r", rank: 14, xp: 4650, streak: 20, avatar: "", college: "Galgotias University", change: 3 },
  { id: "r6", name: "Karan Mehta", username: "karan_m", rank: 15, xp: 4500, streak: 12, avatar: "", college: "Galgotias University", change: -1 },
];

export const topLeaderboard = [
  { id: "t1", name: "Aditya Kumar", username: "aditya_k", rank: 1, xp: 8900, streak: 67, avatar: "", college: "Galgotias University", change: 0 },
  { id: "t2", name: "Sanya Mishra", username: "sanya_m", rank: 2, xp: 8450, streak: 52, avatar: "", college: "Galgotias University", change: 1 },
  { id: "t3", name: "Dev Rathi", username: "dev_r", rank: 3, xp: 7800, streak: 44, avatar: "", college: "Galgotias University", change: -1 },
  { id: "t4", name: "Ishita Jain", username: "ishita_j", rank: 4, xp: 7200, streak: 38, avatar: "", college: "Galgotias University", change: 2 },
  { id: "t5", name: "Rohan Das", username: "rohan_d", rank: 5, xp: 6900, streak: 41, avatar: "", college: "Galgotias University", change: 0 },
];

export const activityFeed = [
  { id: "a1", type: "solve" as const, message: "Solved 'Two Sum' on LeetCode", xp: 25, time: "2 min ago", platform: "leetcode" },
  { id: "a2", type: "streak" as const, message: "23-day streak! Keep it up! 🔥", xp: 50, time: "1 hour ago", platform: "system" },
  { id: "a3", type: "solve" as const, message: "Solved 'Binary Search' on Codeforces", xp: 35, time: "3 hours ago", platform: "codeforces" },
  { id: "a4", type: "github" as const, message: "Pushed 5 commits to algorithm-viz", xp: 15, time: "5 hours ago", platform: "github" },
  { id: "a5", type: "rank" as const, message: "Rank improved from #14 to #12!", xp: 100, time: "1 day ago", platform: "system" },
  { id: "a6", type: "solve" as const, message: "Solved 'DP on Trees' on LeetCode", xp: 45, time: "1 day ago", platform: "leetcode" },
];

export const aiInsights = [
  { id: "i1", type: "weakness" as const, title: "Graph Algorithms", description: "You've only solved 12% of graph problems. Try BFS/DFS practice sets.", severity: "high" as const },
  { id: "i2", type: "suggestion" as const, title: "Contest Participation", description: "Joining weekly contests can boost your rating by ~200 points.", severity: "medium" as const },
  { id: "i3", type: "alert" as const, title: "Streak at Risk!", description: "You haven't solved any problem today. Solve one to keep your 23-day streak!", severity: "high" as const },
  { id: "i4", type: "strength" as const, title: "Dynamic Programming", description: "Your DP success rate is 78%. You're in the top 10% for this category.", severity: "low" as const },
];

export const xpHistory = [
  { day: "Mon", xp: 120 }, { day: "Tue", xp: 85 }, { day: "Wed", xp: 200 },
  { day: "Thu", xp: 150 }, { day: "Fri", xp: 75 }, { day: "Sat", xp: 250 },
  { day: "Sun", xp: 180 },
];

export const monthlyXp = [
  { month: "Sep", xp: 1200 }, { month: "Oct", xp: 1800 }, { month: "Nov", xp: 2100 },
  { month: "Dec", xp: 1600 }, { month: "Jan", xp: 2400 }, { month: "Feb", xp: 2800 },
  { month: "Mar", xp: 3200 }, { month: "Apr", xp: 4850 },
];

export const problemCategories = [
  { name: "Arrays", solved: 85, total: 100 },
  { name: "DP", solved: 42, total: 60 },
  { name: "Graphs", solved: 12, total: 50 },
  { name: "Trees", solved: 38, total: 45 },
  { name: "Strings", solved: 55, total: 70 },
  { name: "Math", solved: 30, total: 40 },
];
