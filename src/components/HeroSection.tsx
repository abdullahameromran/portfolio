import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Award, Zap, Database, Bot, DollarSign, Clock, ArrowRight, MapPin, Sparkles, Code, Layers, ShieldCheck, Mail, Calendar } from "lucide-react";
import VisitorGuestbook from "./VisitorGuestbook";

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const statsRef = useRef(null);
  const specialtiesRef = useRef(null);
  const methodologyRef = useRef(null);
  const guestbookRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const specialtiesInView = useInView(specialtiesRef, { once: true, margin: "-100px" });
  const methodologyInView = useInView(methodologyRef, { once: true, margin: "-100px" });
  const guestbookInView = useInView(guestbookRef, { once: true, margin: "-100px" });

  const stats = [
    { label: "Job Success", value: "100%", icon: Award, color: "text-emerald-400" },
    { label: "Upwork Status", value: "Top Rated Plus", icon: ShieldCheck, color: "text-blue-400" },
    { label: "Projects Completed", value: "25+", icon: Code, color: "text-amber-400" },
    { label: "Response Time", value: "< 4 Hours", icon: Mail, color: "text-purple-400" },
  ];

  const specialties = [
    {
      title: "No-Code MVPs (Bubble.io)",
      description: "Launch fully responsive apps with complex database schemas and user management in as little as 5 days. Absolute best path for rapid validation and SaaS ideation.",
      icon: Layers,
      color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30",
      tagColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      tags: ["Speed Build", "Rich Database", "Custom Workflows", "API Integrations"]
    },
    {
      title: "Traditional Full-Stack (Next.js + Supabase)",
      description: "High-performance codebases with robust type-safety, absolute control, and extreme scalability. Perfect for complex SaaS, client portals, and bespoke SaaS architectures.",
      icon: Code,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
      tagColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      tags: ["TypeScript", "Tailwind CSS", "Supabase DB", "Serverless API"]
    },
    {
      title: "AI Automation & Workflows (n8n / Make / OpenAI)",
      description: "Power your business with autonomous agents, LLM chains, custom assistants, and workflow optimization. Seamlessly connecting legacy APIs to Gemini and GPT models.",
      icon: Bot,
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
      tagColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      tags: ["n8n Nodes", "Make.com", "Vector Databases", "Prompt Engineering"]
    },
    {
      title: "Payments & Advanced Integrations",
      description: "Configure absolute security around billing. Fully integrated Stripe checkout, multi-tier subscription models, customer portals, billing synchronizations, and secure webhooks.",
      icon: Database,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
      tagColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      tags: ["Stripe Subscriptions", "Webhooks", "Customer Portals", "OAuth Login"]
    }
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Intro Hero banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 md:p-12 lg:p-16">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-12 items-center">
          {/* Left Column: Intro */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300"
            >
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span>Open for New MVP & SaaS Projects</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              I build functional <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">MVPs & SaaS Products</span> fast.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg leading-relaxed text-slate-300 max-w-2xl"
            >
              Hi, I'm <strong className="text-white">Abdullah O.</strong>, a Top Rated Plus developer. I help founders, startups, and businesses validate fast and scale towards serious revenue using <strong className="text-blue-300">Bubble.io</strong>, <strong className="text-indigo-300">Next.js</strong>, <strong className="text-emerald-300">Supabase</strong>, and <strong className="text-purple-300">AI automation</strong>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              <button
                onClick={() => onNavigate("chat")}
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/35"
              >
                Consult My AI Twin
                <Bot className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate("estimator")}
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
              >
                Estimate Budget & Scope
                <Zap className="text-amber-400 h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate("projects")}
                className="group inline-flex items-center gap-2 rounded-xl bg-transparent px-5 py-3.5 text-sm font-medium text-slate-400 transition-all hover:text-white"
              >
                Explore Portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            {/* Location status badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 text-xs text-slate-400 border-t border-slate-800/80 mt-8"
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>Cairo, Egypt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Available for New Projects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>Response time: &lt; 4 hrs</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Abdullah Avatar image */}
          <div className="lg:col-span-4 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950/80 shadow-2xl group">
                <img
                  src="/images/abdullah_avatar.png"
                  alt="Abdullah Omran Profile Portrait"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 text-center rounded-xl bg-slate-950/70 border border-slate-800/50 backdrop-blur-sm px-3 py-1.5">
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Abdullah Omran — Active Now
                  </span>
                </div>
              </div>
              {/* Backglow element */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-15 blur-xl -z-10 group-hover:opacity-25 transition-opacity duration-500" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Upwork metrics showcase */}
      <div ref={statsRef} className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</span>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Core Specialties section */}
      <div ref={specialtiesRef} className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={specialtiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 text-center md:text-left"
        >
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">Core Technical Ecosystem</h2>
          <p className="text-slate-400 max-w-xl">
            Optimized, high-speed architectures built for modern founders who need to validate SaaS products with clean, maintainable logic.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {specialties.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={specialtiesInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${spec.color} p-6 md:p-8 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-between rounded-xl bg-slate-950/40 p-3 border border-slate-800">
                    <Icon className="h-6 w-6 text-slate-300" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{spec.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{spec.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-6 mt-4 border-t border-slate-800/40">
                  {spec.tags.map((tag) => (
                    <span key={tag} className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${spec.tagColor}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Speed & Deliverability philosophy banner */}
      <motion.div 
        ref={methodologyRef}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={methodologyInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.7 }}
        className="rounded-3xl border border-slate-800/80 bg-slate-950/40 p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl" />
        <Zap className="h-10 w-10 text-amber-400 mx-auto" />
        <h3 className="font-display text-2xl font-bold text-white">The 5-Day MVP Methodology</h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          "My goal is not just to build screens—I help you build a product foundation that can validate fast, support real users, and scale toward serious revenue goals. For simple to medium MVPs, we can deploy a fully functional first version in as little as 5 days."
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={methodologyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-white font-bold font-display text-lg">Day 1</span>
            <span className="text-slate-500 text-xs">User Flow & DB Design</span>
          </motion.div>
          <div className="h-8 w-[1px] bg-slate-800 self-center" />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={methodologyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <span className="text-white font-bold font-display text-lg">Day 2-3</span>
            <span className="text-slate-500 text-xs">Core UI & Logic</span>
          </motion.div>
          <div className="h-8 w-[1px] bg-slate-800 self-center" />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={methodologyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <span className="text-white font-bold font-display text-lg">Day 4</span>
            <span className="text-slate-500 text-xs">Auth, Stripe & APIs</span>
          </motion.div>
          <div className="h-8 w-[1px] bg-slate-800 self-center" />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={methodologyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <span className="text-white font-bold font-display text-lg">Day 5</span>
            <span className="text-slate-500 text-xs">Test, Optimize & Launch</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Interactive Visitor Lounge Guestbook */}
      <motion.div 
        ref={guestbookRef}
        initial={{ opacity: 0, y: 30 }}
        animate={guestbookInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        <VisitorGuestbook />
      </motion.div>
    </div>
  );
}
