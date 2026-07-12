import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Zap, Briefcase, User, Info, MapPin, Award, ExternalLink, Menu, X, ArrowUpRight, Settings } from "lucide-react";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import AIAssistantSection from "./components/AIAssistantSection";
import EstimatorSection from "./components/EstimatorSection";
import AboutSection from "./components/AboutSection";
import AdminSection from "./components/AdminSection";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [cairoTime, setCairoTime] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync Cairo local time dynamically
  useEffect(() => {
    const updateTime = () => {
      // Cairo is UTC+2 (or UTC+3 if DST, in Egypt local time)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Cairo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setCairoTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "projects", label: "Case Studies", icon: Briefcase },
    { id: "chat", label: "AI Twin", icon: Bot },
    { id: "estimator", label: "Scope Estimator", icon: Zap },
    { id: "about", label: "About", icon: User },
    { id: "admin", label: "Admin Control", icon: Settings },
  ];


  const handleTabChange = (tabId: string) => {
    // Change active tab or navigate to admin route.
    if (tabId === "admin") {
      navigate("/admin");
      // Allow route change to occur then ensure main content is visible
      setTimeout(() => scrollToContentTop(), 40);
    } else {
      setActiveTab(tabId);
      // Scroll main content into view after tab switch to avoid header overlap
      setTimeout(() => scrollToContentTop(), 40);
    }
  };

  const scrollToContentTop = () => {
    try {
      const main = document.querySelector("main");
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      if (main) {
        const top = window.scrollY + (main.getBoundingClientRect().top || 0) - headerHeight - 8;
        window.scrollTo({ top: Math.max(0, Math.round(top)), left: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    } catch (e) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  // Ensure clicks on any header nav control also scroll content into view
  // This covers clicks that don't change the route (tab state toggles, mobile menu, etc.)
  useEffect(() => {
    const headerEl = document.querySelector("header");
    if (!headerEl) return;
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Only respond to interactive controls inside header
      if (target.closest("button") || target.closest("a")) {
        // small timeout so any state changes from the click can apply first
        setTimeout(() => scrollToContentTop(), 30);
      }
    };
    headerEl.addEventListener("click", handler);
    return () => headerEl.removeEventListener("click", handler);
  }, []);

  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={
        <div className="min-h-screen relative bg-[#070913] text-slate-200 selection:bg-blue-600/30 selection:text-white">
          {/* Edge vertical light animations */}
          <div className="fixed left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-800/60 to-transparent pointer-events-none hidden md:block z-20">
            <motion.div
              animate={{
                y: ["-40vh", "100vh"],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-full h-48 bg-gradient-to-b from-transparent via-blue-500/70 to-transparent"
            />
          </div>
          <div className="fixed right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-800/60 to-transparent pointer-events-none hidden md:block z-20">
            <motion.div
              animate={{
                y: ["100vh", "-40vh"],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-full h-48 bg-gradient-to-b from-transparent via-emerald-500/70 to-transparent"
            />
          </div>

          {/* Animated Background Accents (Floating Orbs) */}
          <motion.div
            animate={{
              x: [-40, 40, -40],
              y: [-20, 50, -20],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fixed top-[-100px] left-[-100px] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0"
          />
          <motion.div
            animate={{
              x: [40, -40, 40],
              y: [50, -20, 50],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fixed top-[200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[130px] pointer-events-none z-0"
          />
          <motion.div
            animate={{
              x: [-30, 30, -30],
              y: [-50, 40, -50],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fixed top-[1000px] left-[-200px] h-[550px] w-[550px] rounded-full bg-indigo-600/6 blur-[130px] pointer-events-none z-0"
          />
          <motion.div
            animate={{
              x: [30, -30, 30],
              y: [40, -50, 40],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fixed top-[1800px] right-[-200px] h-[600px] w-[600px] rounded-full bg-purple-500/8 blur-[130px] pointer-events-none z-0"
          />

          {/* Floating Header bar */}
          <div className="fixed top-4 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8">
            <header className="mx-auto max-w-7xl rounded-2xl border border-slate-800/80 bg-[#070913]/75 backdrop-blur-md shadow-2xl shadow-blue-500/5 overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 min-w-0">
                
                {/* Brand/Logo */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-bold tracking-tight text-white whitespace-nowrap">Abdullah O.</span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase whitespace-nowrap">
                      Expert MVP Developer
                    </span>
                  </div>

                  {/* Quick Cairo local time indicator (Rounded Badge) */}
                  <div className="hidden 2xl:flex items-center gap-1.5 border border-slate-800/80 bg-slate-900/40 rounded-full px-2 py-1 ml-1 text-[10px] text-slate-300 whitespace-nowrap">
                    <MapPin className="h-3 w-3 text-rose-500" />
                    <span className="font-medium">Cairo • {cairoTime || "Online"}</span>
                  </div>
                </div>

                {/* Nav Tabs (Desktop) */}
                <nav className="hidden lg:flex items-center gap-0.5 bg-slate-950/80 border border-slate-800/60 rounded-xl p-0.5 mx-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold tracking-wide transition-all whitespace-nowrap flex-shrink-0 ${
                          isActive
                             ? "bg-slate-900 text-white"
                             : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/45"
                        }`}
                      >
                        <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>

                {/* CTA/Actions (Desktop) */}
                <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                  <a
                    href="https://www.upwork.com/freelancers/~017c66cb1e8f2bc5a6"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-blue-500 shadow-md shadow-blue-500/10 group whitespace-nowrap flex-shrink-0"
                  >
                    Hire
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                  </a>
                </div>

                {/* Mobile hamburger trigger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-2 text-slate-400 lg:hidden transition-all hover:bg-slate-800 hover:text-white"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>

              {/* Mobile Navigation Drawer */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden border-t border-slate-800/80 bg-[#070913] rounded-b-2xl overflow-hidden"
                  >
                    <div className="space-y-2 px-6 py-4">
                      {/* Cairo Time widget (Mobile) */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 pb-3 border-b border-slate-800/50">
                        <MapPin className="h-4 w-4 text-rose-500" />
                        <span>Cairo local time: {cairoTime}</span>
                      </div>

                      <div className="grid gap-1.5 pt-2">
                        {tabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                handleTabChange(tab.id);
                                setMobileMenuOpen(false);
                              }}
                              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide text-left ${
                                isActive
                                  ? "bg-slate-900 text-white border-l-2 border-blue-500"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                              }`}
                            >
                              <Icon className={`h-5 w-5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Mobile Hire CTA */}
                      <div className="pt-4 border-t border-slate-800/50">
                        <a
                          href="https://www.upwork.com/freelancers/~017c66cb1e8f2bc5a6"
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 shadow-md shadow-blue-500/10"
                        >
                          Hire on Upwork
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>
          </div>

          {/* Main Body viewport */}
          <main className="mx-auto max-w-7xl px-6 py-8 pt-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === "overview" && (
                  <HeroSection onNavigate={handleTabChange} />
                )}
                {activeTab === "projects" && (
                  <ProjectsSection />
                )}
                {activeTab === "chat" && (
                  <AIAssistantSection />
                )}
                {activeTab === "estimator" && (
                  <EstimatorSection />
                )}
                {activeTab === "about" && (
                  <AboutSection />
                )}
              </motion.div>

            </AnimatePresence>
          </main>

          {/* Footer bar */}
          <footer className="border-t border-slate-800/80 bg-slate-950/20 py-10 mt-16 text-center text-xs text-slate-500">
            <div className="mx-auto max-w-7xl px-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="font-display font-medium text-slate-400">© 2026 Abdullah Omran. All Rights Reserved.</span>
                
                {/* Quick footer indicators */}
                <div className="flex gap-6">
                  <a
                    href="https://www.upwork.com/freelancers/~017c66cb1e8f2bc5a6"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Upwork Profile
                  </a>
                  <a
                    href="https://github.com/abdullah-omran"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    GitHub Profile
                  </a>
                </div>
              </div>
              <p className="text-slate-600 text-[10px] leading-relaxed max-w-lg mx-auto">
                This portfolio and virtual assistant twin were generated to showcase Abdullah's exceptional product engineering ecosystem. All metrics are verified via Upwork contract histories.
              </p>
            </div>
          </footer>
        </div>
      } />
    </Routes>
  );
}
