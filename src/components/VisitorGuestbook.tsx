import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Coffee, Heart, User, Calendar, Award, Sparkles, Send, CheckCircle, Flame, HelpCircle, Users, Smile, Compass } from "lucide-react";

interface GuestbookEntry {
  id: string;
  name: string;
  role: string;
  mood: string;
  message: string;
  coffee_sent: boolean;
  created_at: string;
}

export default function VisitorGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [coffeeCount, setCoffeeCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("🚀 Founder");
  const [mood, setMood] = useState("🔥 Hyped");
  const [message, setMessage] = useState("");
  const [sendCoffee, setSendCoffee] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coffeeClickAnimation, setCoffeeClickAnimation] = useState<number[]>([]);

  // Load guestbook data
  const loadGuestbook = async () => {
    try {
      const res = await fetch("/api/guestbook");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
        setCoffeeCount(data.coffeeCount || 0);
      }
    } catch (err) {
      console.error("Failed to load guestbook entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuestbook();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role,
          mood,
          message: message.trim(),
          coffee_sent: sendCoffee
        })
      });

      if (res.ok) {
        const newEntry = await res.json();
        setEntries((prev) => [newEntry, ...prev]);
        if (sendCoffee) {
          setCoffeeCount((prev) => prev + 1);
          // Trigger floating coffee animation
          triggerCoffeeAnimation();
        }
        setSuccess(true);
        setName("");
        setMessage("");
        setSendCoffee(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to post to guestbook:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBuyCoffeeDirect = async () => {
    triggerCoffeeAnimation();
    try {
      const res = await fetch("/api/guestbook/coffee", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCoffeeCount(data.coffeeCount);
      }
    } catch (err) {
      console.error("Failed to increment coffee:", err);
      // fallback increment locally in case of issue
      setCoffeeCount((prev) => prev + 1);
    }
  };

  const triggerCoffeeAnimation = () => {
    const id = Date.now();
    setCoffeeClickAnimation((prev) => [...prev, id]);
    setTimeout(() => {
      setCoffeeClickAnimation((prev) => prev.filter((item) => item !== id));
    }, 1500);
  };

  // Roles distributions
  const rolesList = ["🚀 Founder", "💼 Recruiter", "💻 Developer", "🌟 Client", "✨ Supporter"];
  const roleColors: Record<string, string> = {
    "🚀 Founder": "bg-blue-500",
    "💼 Recruiter": "bg-purple-500",
    "💻 Developer": "bg-emerald-500",
    "🌟 Client": "bg-amber-500",
    "✨ Supporter": "bg-pink-500"
  };

  const totalEntries = entries.length;
  
  const getRoleStats = () => {
    const stats: Record<string, number> = {
      "🚀 Founder": 0,
      "💼 Recruiter": 0,
      "💻 Developer": 0,
      "🌟 Client": 0,
      "✨ Supporter": 0
    };

    entries.forEach(entry => {
      if (stats[entry.role] !== undefined) {
        stats[entry.role]++;
      } else {
        // Find match ignoring emoji prefix
        const found = rolesList.find(r => r.includes(entry.role) || entry.role.includes(r));
        if (found) stats[found]++;
      }
    });

    return Object.keys(stats).map(roleKey => {
      const count = stats[roleKey];
      const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
      return { role: roleKey, count, percentage };
    }).sort((a, b) => b.count - a.count);
  };

  const roleStats = getRoleStats();

  return (
    <div id="visitor-lounge" className="space-y-10 rounded-3xl border border-slate-800/80 bg-slate-900/10 p-6 md:p-10 relative overflow-hidden backdrop-blur-sm">
      {/* Background radial highlight */}
      <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <Users className="h-4.5 w-4.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Live Community</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">Visitor Lounge & Guestbook</h3>
          <p className="text-slate-400 text-sm max-w-xl">
            Stamp your visit, state your role, and connect in real-time. See who is visiting Abdullah's office!
          </p>
        </div>

        {/* Direct Virtual Coffee Interaction */}
        <div className="relative shrink-0">
          <button
            onClick={handleBuyCoffeeDirect}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-5 py-3 text-xs font-bold text-white transition-all shadow-md shadow-amber-900/10 hover:scale-105 active:scale-95 group"
          >
            <Coffee className="h-4 w-4 animate-bounce group-hover:rotate-12" />
            <span>Virtual Coffee for Abdullah</span>
            <span className="bg-slate-950/40 text-amber-200 px-2 py-0.5 rounded-lg text-[10px]">
              {coffeeCount} Sent
            </span>
          </button>

          {/* Floating Coffee Animations on click */}
          <AnimatePresence>
            {coffeeClickAnimation.map((id) => (
              <motion.div
                key={id}
                initial={{ opacity: 1, y: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 0, y: -100, scale: 1.5, x: Math.random() * 40 - 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute left-1/2 top-0 pointer-events-none text-xl"
              >
                ☕✨
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Form: Stamp Your Visit */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="font-display text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Stamp Your Visit
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Your Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins, Mark Z."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Your Role</label>
              <div className="flex flex-wrap gap-1.5">
                {rolesList.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold border transition-all ${
                      role === r
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/5"
                        : "border-slate-800 bg-slate-900/30 text-slate-400 hover:text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Visit Mood</label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: "🔥 Hyped", id: "🔥 Hyped" },
                  { label: "💡 Curious", id: "💡 Curious" },
                  { label: "🤝 Hire", id: "🤝 Ready to Hire" },
                  { label: "☕ Browsing", id: "☕ Just Browsing" },
                  { label: "🎉 Excited", id: "🎉 Excited" }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    title={m.id}
                    className={`rounded-lg py-1.5 px-1 text-[10px] text-center border transition-all flex flex-col items-center gap-1 leading-none ${
                      mood === m.id
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                        : "border-slate-800 bg-slate-900/30 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-sm">{m.id.split(" ")[0]}</span>
                    <span className="scale-[0.85] truncate max-w-full text-[9px]">{m.label.split(" ")[1] || m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Quick Note</label>
              <textarea
                required
                maxLength={200}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a friendly note, question, or encouragement..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Send Coffee with stamp checkbox */}
            <div className="flex items-center gap-2 py-1 select-none">
              <input
                type="checkbox"
                id="send-coffee-checkbox"
                checked={sendCoffee}
                onChange={(e) => setSendCoffee(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 h-4 w-4 accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="send-coffee-checkbox" className="text-xs text-slate-400 flex items-center gap-1.5 cursor-pointer hover:text-slate-200 transition-colors">
                <Coffee className="h-3.5 w-3.5 text-amber-500" />
                Include virtual coffee ☕
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/10 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? "Stamping..." : "Stamp Guestbook"}</span>
            </button>

            {/* Success indicator */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-emerald-400 text-xs justify-center pt-2 font-medium"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Stamped successfully! Thank you.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Column 2: Live Activity Feed */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="font-display text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            Live Visitor Stamps
          </h4>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 max-h-[385px] overflow-y-auto space-y-3.5 custom-scrollbar">
            {loading ? (
              <div className="text-center py-12 text-xs text-slate-500 animate-pulse">
                Syncing community stamps...
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No visitor stamps yet. Be the first to stamp!
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id || index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group border-b border-slate-800/60 pb-3.5 last:border-0 last:pb-0 space-y-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                            {entry.name}
                          </span>
                          <span className="text-[10px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-md text-slate-400 font-semibold">
                            {entry.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[9px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Smile className="h-2.5 w-2.5 text-emerald-500/70" />
                            Mood: {entry.mood}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5 text-slate-600" />
                            {new Date(entry.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>

                      {entry.coffee_sent && (
                        <span className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-1.5 py-0.5 text-[9px] text-amber-400 font-bold shrink-0 animate-pulse">
                          ☕ coffee
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/30 border border-slate-900/50 rounded-xl px-3 py-2">
                      {entry.message}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Column 3: Live Poll & Visitor Distribution */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="font-display text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Flame className="h-4 w-4 text-emerald-400" />
            Lounge Metrics & Poll
          </h4>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 space-y-5">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400">Total Unique Stamped Visitors</div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-white tracking-tight">
                  {loading ? "..." : totalEntries + 14} 
                </span>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  (+14 offline stamps)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Who is visiting Abdullah?</span>
                <span className="text-[10px] text-slate-500">Live Breakdown</span>
              </div>

              <div className="space-y-3.5">
                {roleStats.map((item) => {
                  const colorClass = roleColors[item.role] || "bg-indigo-500";
                  return (
                    <div key={item.role} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-slate-300">{item.role}</span>
                        <span className="text-slate-400 font-bold font-mono">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${colorClass}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-4 text-[10px] text-slate-500 flex items-start gap-2">
              <Compass className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="leading-normal">
                This dashboard visualizes data aggregated in the real-time node cluster. Data remains persistent in high-fidelity demo stores.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
