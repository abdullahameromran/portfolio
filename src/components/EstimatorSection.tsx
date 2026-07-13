import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Calculator, Zap, Clock, DollarSign, Sparkles, Code, CheckCircle, HelpCircle, FileText, ChevronRight, BookmarkCheck } from "lucide-react";
import { EstimatorItem } from "../types";

export default function EstimatorSection() {
  const features: EstimatorItem[] = [
    { id: "auth", name: "User Auth & Roles", description: "Secure emails, passwords, social logins (Google/GitHub), and role-based permissions.", category: "core", hours: 4, complexity: "Low" },
    { id: "db", name: "Supabase DB & Security", description: "Relational database tables, relationships, and secure Row-Level Security (RLS) rules.", category: "database", hours: 6, complexity: "Medium" },
    { id: "stripe_sub", name: "Stripe Recurring Billing", description: "Subscription tier management, customer billing portal, secure checkout, and invoice webhooks.", category: "integration", hours: 8, complexity: "Medium" },
    { id: "stripe_connect", name: "Stripe Connect Split Payments", description: "Multi-vendor onboarding, commission splits, payout accounts, and seller admin views.", category: "integration", hours: 16, complexity: "High" },
    { id: "admin_panel", name: "SaaS Admin & Analytics Dashboard", description: "Performance trackers, user metric visualizers, and raw database record management consoles.", category: "core", hours: 8, complexity: "Medium" },
    { id: "ai_generation", name: "Gemini / OpenAI API pipelines", description: "Structured AI prompts, context injection, semantic translations, and auto-categorizations.", category: "integration", hours: 12, complexity: "High" },
    { id: "n8n_workflows", name: "n8n / Make Automation Pipelines", description: "Integrates external APIs, scheduling cron jobs, automated email triggers, and chat links.", category: "integration", hours: 10, complexity: "Medium" },
    { id: "pdf_renderer", name: "Automated PDF Dossier Generator", description: "Generates custom formatted reports, invoices, or business dossiers downloadable in browser.", category: "core", hours: 8, complexity: "Medium" },
    { id: "realtime_chat", name: "Real-Time Chat & Notifications", description: "Live collaboration tickers, direct messaging threads, and interactive activity alerts.", category: "core", hours: 12, complexity: "High" },
    { id: "custom_domain", name: "Deployment & Custom Domain Setup", description: "Hosting setups, DNS parameters, SSL lock configurations, and environment variables.", category: "database", hours: 4, complexity: "Low" }
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>(["auth", "db", "stripe_sub", "admin_panel"]);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  // Inquiry Submission States
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const hourlyRate = 22.22;

  const handleToggleFeature = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmitInquiry = async (e: FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientEmail.trim()) {
      setSubmitStatus("error");
      setSubmitMessage("Please provide your name and email.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          projectIdea: `Custom scoped blueprint with modules: ${selectedFeatures.map(f => f.name).join(", ")}.`,
          techStackRecommendation: techStackRecommendation.stack,
          estimatedHours: totalHours,
          estimatedCost: finalCost
        })
      });

      if (res.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Inquiry proposal logged instantly! You can view this lead in the 'Admin Control' panel.");
        setClientName("");
        setClientEmail("");
      } else {
        const data = await res.json();
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Failed to submit inquiry.");
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setSubmitStatus("error");
      setSubmitMessage("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const selectedFeatures = features.filter((f) => selectedIds.includes(f.id));
  const totalHours = selectedFeatures.reduce((acc, curr) => acc + curr.hours, 0);
  
  // Apply a 10% volume discount if hours exceed 60
  const isVolumeDiscountEligible = totalHours >= 60;
  const rawCost = totalHours * hourlyRate;
  const finalCost = discountApplied && isVolumeDiscountEligible ? rawCost * 0.9 : rawCost;

  // Estimate Days based on standard 8-hour coding days
  const estimatedDays = Math.max(2, Math.ceil(totalHours / 8));

  // Determine Tech Stack recommendation
  const hasHighComplexity = selectedFeatures.some((f) => f.complexity === "High");
  const hasMultipleIntegrations = selectedFeatures.filter((f) => f.category === "integration").length >= 2;
  
  const techStackRecommendation = hasHighComplexity || hasMultipleIntegrations
    ? {
        stack: "Next.js + Supabase + Tailwind (Traditional Full-Stack)",
        reason: "Due to high complexity modules, custom AI pipelines, or multi-seller split transactions. A custom typed React codebase guarantees extreme scalability and code freedom."
      }
    : {
        stack: "Bubble.io (No-Code MVP Engine)",
        reason: "Your requirements are highly structured. Bubble.io can assemble your databases, workflows, and checkout gates inside 5-8 days with negligible hosting fees!"
      };

  const handleCopyQuote = () => {
    const quoteText = `
=== Abdullah Omran — MVP Project Estimate ===
Selected Modules:
${selectedFeatures.map((f) => `- ${f.name} (${f.hours} hours)`).join("\n")}

Total Estimated Work: ${totalHours} hours
Hourly Rate: $${hourlyRate}/hr
Estimated Timeline: ${estimatedDays} business days (~${Math.ceil(estimatedDays / 5)} weeks)
Volume Discount: ${discountApplied && isVolumeDiscountEligible ? "10% Applied" : "None"}
Final Estimated Budget: $${finalCost.toFixed(2)}

Recommended Architecture:
${techStackRecommendation.stack}
Reason: ${techStackRecommendation.reason}
============================================
`;
    navigator.clipboard.writeText(quoteText);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  return (
    <div className="space-y-10 py-4">
      {/* Intro block */}
      <div className="border-b border-slate-800 pb-8 space-y-2">
        <div className="flex items-center gap-2 text-blue-400">
          <Calculator className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Dynamic Project Estimator</span>
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">Interactive MVP Scoping Engine</h2>
        <p className="text-slate-400 max-w-xl">
          Build a custom cost estimate by checking the components your SaaS or mobile product requires. Estimates are calculated transparently using Abdullah's standard rate of <strong className="text-white">$22.22/hr</strong>.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Features Selection Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display text-lg font-bold text-white mb-2">Configure MVP Functional Modules</h3>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const isSelected = selectedIds.includes(feature.id);
              return (
                <div
                  key={feature.id}
                  onClick={() => handleToggleFeature(feature.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-500/50 bg-blue-500/5 shadow-md shadow-blue-500/5"
                      : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/10"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase border ${
                        feature.category === "core" ? "bg-purple-500/10 text-purple-300 border-purple-500/20" :
                        feature.category === "database" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" :
                        "bg-amber-500/10 text-amber-300 border-amber-500/20"
                      }`}>
                        {feature.category}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        feature.complexity === "High" ? "text-rose-400" :
                        feature.complexity === "Medium" ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        Complexity: {feature.complexity}
                      </span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                        isSelected ? "border-blue-500 bg-blue-600 text-white" : "border-slate-700 bg-slate-900"
                      }`}>
                        {isSelected && <span className="text-[10px]">✓</span>}
                      </span>
                      {feature.name}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {feature.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-slate-800/40 pt-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {feature.hours} hours
                    </span>
                    <span className="text-slate-300 font-semibold">
                      ${(feature.hours * hourlyRate).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quote Summary Block */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl" />
            
            <h3 className="font-display text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-400" />
              Dynamic Quote Summary
            </h3>

            {/* Calculations metrics lists */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Selected Modules</span>
                <span className="font-mono text-white font-bold">{selectedFeatures.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Estimated Effort</span>
                <span className="font-mono text-white font-bold">{totalHours} hours</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Timeline Scope</span>
                <span className="font-mono text-emerald-400 font-bold">{estimatedDays} Business Days</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Upwork Hourly Rate</span>
                <span className="font-mono text-white font-bold">${hourlyRate}/hr</span>
              </div>
            </div>

            {/* Special volume discount deal */}
            {isVolumeDiscountEligible && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Volume Discount Eligible!</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your project scope exceeds **60 hours**. Abdullah offers a **10% volume discount** for medium to large MVP contracts!
                </p>
                <button
                  onClick={() => setDiscountApplied(!discountApplied)}
                  className={`w-full rounded-lg py-2 text-xs font-semibold transition-all ${
                    discountApplied
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                      : "border border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                  }`}
                >
                  {discountApplied ? "✓ 10% Discount Active" : "Apply 10% Volume Discount"}
                </button>
              </div>
            )}

            {/* Estimated Total Price */}
            <div className="border-t border-slate-800 pt-4 space-y-1.5 text-center">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Estimated Budget</span>
              <div className="flex items-baseline justify-center gap-1 text-white">
                <span className="text-sm font-bold text-slate-400">$</span>
                <span className="font-display text-4xl font-black tracking-tight text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text">
                  {finalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {discountApplied && isVolumeDiscountEligible && (
                <span className="block text-[10px] text-emerald-400 font-mono">
                  Saved ${(rawCost * 0.1).toFixed(2)} on hourly volume discount!
                </span>
              )}
            </div>

            {/* Blueprint advice stack */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Code className="h-4 w-4 text-indigo-400" />
                <span>Architect's Architecture recommendation</span>
              </div>
              <strong className="block text-xs text-indigo-300">{techStackRecommendation.stack}</strong>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {techStackRecommendation.reason}
              </p>
            </div>

            {/* Direct lead generation form */}
            <form onSubmit={handleSubmitInquiry} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Lock in Blueprint Quote</span>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {submitStatus !== "idle" && (
                <p className={`text-[11px] leading-relaxed p-2 rounded-lg border ${
                  submitStatus === "success" 
                    ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400" 
                    : "bg-red-950/20 border-red-500/20 text-red-400"
                }`}>
                  {submitMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Logging Inquiry..." : "Submit Inquiry Lead"}
              </button>
            </form>

            {/* Utility buttons */}

            <div className="space-y-2 pt-2">
              <button
                onClick={handleCopyQuote}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
              >
                <FileText className="h-4 w-4 text-slate-400" />
                {copiedInvoice ? "Quote Copied to Clipboard!" : "Copy Technical Quote"}
              </button>
              <a
                href="https://wa.me/201554670453"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white transition-all hover:bg-blue-500 shadow-md shadow-blue-500/10 group"
              >
                Chat with Abdullah on WhatsApp
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
