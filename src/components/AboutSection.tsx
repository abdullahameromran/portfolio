import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { GraduationCap, Globe, ShieldCheck, Mail, Cpu, CheckCircle2, Award, FileSpreadsheet, Users } from "lucide-react";

export default function AboutSection() {
  const bioRef = useRef(null);
  const commitmentsRef = useRef(null);
  
  const bioInView = useInView(bioRef, { once: true, margin: "-100px" });
  const commitmentsInView = useInView(commitmentsRef, { once: true, margin: "-100px" });

  const commitments = [
    {
      title: "Daily Updates & Full Visibility",
      description: "You'll never wonder what's being built. Abdullah maintains real-time Loom videos, staging environments, and active communication via WhatsApp/Slack.",
      icon: Users
    },
    {
      title: "Clean Databases & Scale Security",
      description: "Many Bubble/Next.js apps are built like spaghetti. Abdullah architectures databases properly from day one, setting up exact types, relations, indexes, and privacy rules.",
      icon: Cpu
    },
    {
      title: "No-Code Velocity, Code Quality",
      description: "Get the blistering speed of no-code without losing the technical standard. Fully commented custom JavaScript plugins and standard modular tables ensure easy hand-offs.",
      icon: FileSpreadsheet
    }
  ];

  const languages = [
    { name: "Arabic", level: "Native or Bilingual" },
    { name: "English", level: "Fluent (Professional)" },
    { name: "French", level: "Conversational" }
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Bio and Headline */}
      <motion.div 
        ref={bioRef}
        initial={{ opacity: 0, y: 30 }}
        animate={bioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="grid gap-8 md:grid-cols-3"
      >
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">Behind the Code</h2>
          
          <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              Hey there! I’m <strong className="text-white">Abdullah Omran</strong>. I am a Top Rated Plus software developer based in Cairo, Egypt. I specialize in launching fully-functional, custom MVPs and scalable SaaS dashboards in record times using high-speed engines like <strong className="text-blue-300">Bubble.io</strong> and robust traditional structures like <strong className="text-indigo-300">Next.js + Supabase</strong>.
            </p>
            <p>
              I graduated with a <strong className="text-white">Bachelor of Science in Computer Science (2020 - 2024)</strong>. This academic backing gives me a major advantage over pure self-taught builders—I understand algorithms, system architecture, database performance indexes, and network request life-cycles. When I build a Bubble.io or Next.js app, I structure the underlying schema to protect your data, secure user roles, and scale effortlessly as your users grow.
            </p>
            <p>
              My philosophy is simple: <strong className="text-emerald-300">Build fast, but build right.</strong> I help founders and startups skip the months of expensive trial-and-error, delivering fully optimized products in as little as 5 days.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 pt-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-4">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Education</span>
              <div className="flex gap-2 items-start">
                <GraduationCap className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 font-medium">B.Sc. in Computer Science (2020-2024)</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-4">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Response Time</span>
              <div className="flex gap-2 items-start">
                <Award className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 font-medium">Top Rated Plus (&lt; 4 hr responses)</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/10 p-4">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Availability</span>
              <div className="flex gap-2 items-start">
                <Globe className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 font-medium">Open for New Ventures</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side widgets: Avatar, Languages, GitHub details */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-800/60">
              <img
                src="/src/assets/images/abdullah_avatar.png"
                alt="Abdullah Omran Portrait"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-950/70 border border-slate-800/60 backdrop-blur-sm px-2.5 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-duration-1000"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-semibold text-slate-200">Cairo, Egypt</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Languages
            </h4>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-200">{lang.name}</span>
                  <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-400 font-mono">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Verified Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {["Bubble.io", "Next.js", "Supabase", "TypeScript", "n8n", "Make.com", "Stripe Connect", "OpenAI API", "PostgreSQL", "Firebase"].map((skill) => (
                <span key={skill} className="rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Operational commitments banner */}
      <motion.div 
        ref={commitmentsRef}
        initial={{ opacity: 0, y: 30 }}
        animate={commitmentsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 pt-6 border-t border-slate-800/60"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={commitmentsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2 text-center md:text-left"
        >
          <h3 className="font-display text-2xl font-bold text-white">How We Work Together</h3>
          <p className="text-sm text-slate-400 max-w-lg">
            Abdullah brings professional development workflows to every contract, delivering structured codebases on schedule.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {commitments.map((c, idx) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={commitmentsInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/10 p-6 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-display text-base font-bold text-white">{c.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
