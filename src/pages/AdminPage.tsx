import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, Shield, AlertCircle, CheckCircle, RefreshCw, 
  Terminal, Code2, Plus, Edit, Trash2, Mail, ExternalLink, 
  Layers, Copy, ChevronDown, ChevronUp, FileText, User, DollarSign, Clock, HelpCircle, Eye,
  LayoutDashboard, Settings, LogOut, Lock, Briefcase
} from "lucide-react";
import { Project } from "../types";
import TagInput from "../components/TagInput";
import ImageUploader from "../components/ImageUploader";

const projectCategories = [
  "SaaS",
  "MVP",
  "Client Portal",
  "AI Automation",
  "Automation",
  "Dashboard",
  "Admin Panel",
  "Marketplace",
  "E-commerce",
  "Booking Platform",
  "CRM",
  "Real Estate",
  "Education",
  "Healthcare",
  "FinTech",
  "Internal Tool",
  "Landing Page",
  "Mobile App",
  "Bubble.io",
  "Next.js",
];

async function readApiJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(text.slice(0, 140) || `Expected JSON but received ${contentType || "an empty response"}.`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text.slice(0, 140) || "The API returned invalid JSON.");
  }
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeSection, setActiveSection] = useState<"dashboard" | "projects" | "inquiries" | "settings">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Supabase status
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    url: string;
    message: string;
    tablesExist?: { projects: boolean; inquiries: boolean };
    error?: string;
  } | null>(null);

  // Projects states
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectLoadError, setProjectLoadError] = useState<string | null>(null);
  const [projectFormError, setProjectFormError] = useState("");
  const [isSavingProject, setIsSavingProject] = useState(false);

  const handleSaveProject = async (e: any) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.category) {
      setProjectFormError("Title and Category are required.");
      return;
    }

    setIsSavingProject(true);
    setProjectFormError("");

    try {
      const isEdit = !!editingProject.id && !editingProject.id.toString().startsWith("temp-");
      const url = isEdit ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";
      const payload = { ...editingProject } as any;
      payload.images = Array.isArray(payload.images) ? payload.images : [];
      payload.imageUrl = payload.images[0] || payload.imageUrl || "";

      if (!isEdit) {
        delete payload.id;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedProject = await readApiJson(res);
        if (isEdit) {
          setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
        } else {
          setProjects([savedProject, ...projects]);
        }
        setEditingProject(null);
      } else {
        const errData = await readApiJson(res).catch((err) => ({ error: err.message }));
        setProjectFormError(errData.error || "Failed to save project.");
      }
    } catch (err) {
      console.error("Error saving project:", err);
      setProjectFormError("Network error saving project.");
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Inquiries states
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (password === "FREEPASS") {
      setIsAuthenticated(true);
      setPasswordError("");
      loadInitialData();
    } else {
      setPasswordError("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const loadInitialData = async () => {
    try {
      const [statusRes, projectsRes, inquiriesRes] = await Promise.all([
        fetch("/api/supabase-status"),
        fetch("/api/projects"),
        fetch("/api/inquiries")
      ]);
      
      if (statusRes.ok) {
        setSupabaseStatus(await readApiJson(statusRes));
      }

      if (projectsRes.ok) {
        setProjects(await readApiJson(projectsRes));
        setProjectLoadError(null);
      } else {
        const errData = await readApiJson(projectsRes).catch((err) => ({ error: err.message }));
        setProjectLoadError(errData.error || "Failed to load projects from Supabase.");
      }

      if (inquiriesRes.ok) {
        setInquiries(await readApiJson(inquiriesRes));
      }
    } catch (err: any) {
      console.error("Failed to load initial data:", err);
      setProjectLoadError(err?.message || "Failed to load initial data.");
    }
  };

  // Password Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070913] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <Lock className="h-8 w-8 text-blue-400" />
              </div>
              
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
                <p className="text-sm text-slate-400">Enter password to access admin panel</p>
              </div>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div className="space-y-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {passwordError && (
                    <p className="text-xs text-red-400">{passwordError}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500"
                >
                  Access Admin Panel
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard with Sidebar
  return (
    <div className="min-h-screen bg-[#070913] text-slate-200">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-50 w-64 border-r border-slate-800 bg-slate-950/80 backdrop-blur-md transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="font-display font-bold text-white">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeSection === "dashboard"
                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveSection("projects")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeSection === "projects"
                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Projects
              <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[10px]">{projects.length}</span>
            </button>
            
            <button
              onClick={() => setActiveSection("inquiries")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeSection === "inquiries"
                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <Mail className="h-4 w-4" />
              Inquiries
              <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[10px]">{inquiries.length}</span>
            </button>
            
            <button
              onClick={() => setActiveSection("settings")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeSection === "settings"
                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-800 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              {sidebarOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">Admin Mode</span>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeSection === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
                
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                    <div className="flex items-center gap-3 text-blue-400 mb-2">
                      <Briefcase className="h-5 w-5" />
                      <span className="text-sm font-semibold">Total Projects</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{projects.length}</p>
                  </div>
                  
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                      <Mail className="h-5 w-5" />
                      <span className="text-sm font-semibold">Client Inquiries</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{inquiries.length}</p>
                  </div>
                  
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                    <div className="flex items-center gap-3 text-purple-400 mb-2">
                      <Database className="h-5 w-5" />
                      <span className="text-sm font-semibold">Database Status</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {supabaseStatus?.configured ? "Connected" : "Local Mode"}
                    </p>
                  </div>
                </div>

                {/* System Status */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <h2 className="font-display text-lg font-bold text-white mb-4">System Status</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Supabase Connection</span>
                      <span className={`text-sm font-semibold ${supabaseStatus?.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {supabaseStatus?.configured ? 'Active' : 'Not Configured'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Projects Table</span>
                      <span className={`text-sm font-semibold ${supabaseStatus?.tablesExist?.projects ? 'text-emerald-400' : 'text-red-400'}`}>
                        {supabaseStatus?.tablesExist?.projects ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-400">Inquiries Table</span>
                      <span className={`text-sm font-semibold ${supabaseStatus?.tablesExist?.inquiries ? 'text-emerald-400' : 'text-red-400'}`}>
                        {supabaseStatus?.tablesExist?.inquiries ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h1 className="font-display text-3xl font-bold text-white">Projects</h1>
                    <button
                      onClick={() => setEditingProject({
                        id: `temp-${Date.now()}`,
                        title: "",
                        description: "",
                        longDescription: "",
                        category: "SaaS",
                        techStack: [],
                        metrics: [],
                        features: [],
                        dbStructure: [],
                        imageUrl: "",
                        images: [],
                        websiteUrl: ""
                      })}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500"
                    >
                      <Plus className="h-4 w-4" />
                      Add Project
                    </button>
                  </div>
                  {(supabaseStatus?.configured === false || supabaseStatus?.error || supabaseStatus?.tablesExist?.projects === false || projectLoadError) && (
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                      <strong>Warning:</strong> Supabase is not fully connected or there is a projects load error. Changes will not be saved until Supabase tables and storage policies are configured.
                      {supabaseStatus?.error && <div className="text-xs text-amber-300 mt-2">{supabaseStatus.error}</div>}
                      {projectLoadError && <div className="text-xs text-amber-300 mt-2">{projectLoadError}</div>}
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  {editingProject ? (
                    <motion.form
                      onSubmit={handleSaveProject}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-6"
                    >
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <h3 className="font-bold text-white text-base">
                          {editingProject.id ? `Edit: ${editingProject.title}` : "Create New Project"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="text-slate-500 hover:text-white text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>

                      {projectFormError && (
                        <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span>{projectFormError}</span>
                        </div>
                      )}

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Project Title *</label>
                          <input
                            type="text"
                            required
                            value={editingProject.title || ""}
                            onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                            placeholder="e.g. My Saas Dashboard Platform"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Category *</label>
                          <select
                            value={editingProject.category || "SaaS"}
                            onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                          >
                            {projectCategories.map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-semibold text-slate-400">Short Summary *</label>
                          <input
                            type="text"
                            required
                            value={editingProject.description || ""}
                            onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                            placeholder="e.g. An AI-powered assessment builder which instantly drafts examinations."
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-semibold text-slate-400">Long Case Study Description</label>
                          <textarea
                            rows={4}
                            value={editingProject.longDescription || ""}
                            onChange={e => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                            placeholder="Describe the product goals, engineering role, complex scheduling mechanisms, and client impacts..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-semibold text-slate-400">Images</label>
                          <ImageUploader
                            projectId={editingProject.id || `temp-${Date.now()}`}
                            images={editingProject.images?.length ? editingProject.images : (editingProject.imageUrl ? [editingProject.imageUrl] : [])}
                            onChange={(imgs) => setEditingProject({ ...editingProject, images: imgs })}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Website URL</label>
                          <input
                            type="text"
                            value={editingProject.websiteUrl || ""}
                            onChange={e => setEditingProject({ ...editingProject, websiteUrl: e.target.value })}
                            placeholder="e.g. https://example.com"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Tech Stack</label>
                          <TagInput
                            value={editingProject.techStack || []}
                            onChange={(items) => setEditingProject({ ...editingProject, techStack: items })}
                            placeholder="e.g. Next.js"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Metrics</label>
                          <TagInput
                            value={editingProject.metrics || []}
                            onChange={(items) => setEditingProject({ ...editingProject, metrics: items })}
                            placeholder="e.g. Processed $45K+"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-400">Key Features</label>
                          <TagInput
                            value={editingProject.features || []}
                            onChange={(items) => setEditingProject({ ...editingProject, features: items })}
                            placeholder="e.g. Multi-tier billing"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="rounded-xl border border-slate-800 hover:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-all"
                        >
                          Discard
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProject}
                          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50"
                        >
                          {isSavingProject && <RefreshCw className="h-3 w-3 animate-spin" />}
                          Save Project
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-white">{project.title}</h3>
                            <p className="text-sm text-slate-400 mt-1">{project.description}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs bg-slate-800 px-2 py-1 rounded">{project.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingProject(project)}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeSection === "inquiries" && (
              <motion.div
                key="inquiries"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h1 className="font-display text-3xl font-bold text-white">Client Inquiries</h1>
                
                <div className="grid gap-4">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:border-slate-700 transition-all cursor-pointer"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{inquiry.client_name}</h3>
                          <p className="text-sm text-slate-400 mt-1">{inquiry.client_email}</p>
                          <p className="text-sm text-slate-300 mt-2">{inquiry.project_idea}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-emerald-400">
                            ${Number(inquiry.estimated_cost).toLocaleString()}
                          </span>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
                
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <h2 className="font-display text-lg font-bold text-white mb-4">Database Configuration</h2>
                  <p className="text-slate-400 text-sm mb-4">
                    Configure your Supabase connection in the environment variables.
                  </p>
                  <div className="space-y-2 font-mono text-xs bg-slate-900 p-4 rounded-xl">
                    <div className="text-slate-500"># Required environment variables:</div>
                    <div>SUPABASE_URL=your-project-url</div>
                    <div>SUPABASE_ANON_KEY=your-anon-key</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
