import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Database, ExternalLink, CheckCircle, Activity, Info, X, Loader2 } from "lucide-react";
import { Project } from "../types";

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  
  const getProjectImages = (project: Project) => {
    const allImages = [
      ...(Array.isArray(project.images) ? project.images : []),
      project.imageUrl || "",
    ];
    return Array.from(new Set(allImages.filter((img) => img && img.trim().length > 0)));
  };

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/projects?ts=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load projects from Supabase.");
        }
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load projects from Supabase.");
        console.error("Failed to load projects from backend API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filters = ["All", "SaaS", "Client Portal", "MVP", "AI Automation"];


  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const closeProjectModal = () => {
    setSelectedProject(null);
    setSelectedImageIndex(0);
  };

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      const images = getProjectImages(selectedProject);
      if (event.key === "Escape") {
        closeProjectModal();
      }
      if (event.key === "ArrowRight" && images.length > 1) {
        setSelectedImageIndex((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft" && images.length > 1) {
        setSelectedImageIndex((current) => (current - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <div className="space-y-10 py-4">
      {/* Intro block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">Commercial Case Studies</h2>
          <p className="text-slate-400 max-w-lg">
            A selective preview of real SaaS platforms, client portals, and functional MVPs built and deployed for global startups.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                activeFilter === filter
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/15"
                  : "bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span>Loading commercial blueprints...</span>
        </div>
      ) : loadError ? (
        <div className="py-24 text-center border border-dashed border-amber-500/30 rounded-2xl bg-amber-500/5 text-amber-200 text-xs">
          {loadError}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/10 text-slate-500 text-xs">
          No project case studies found in Supabase.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            (() => {
              const projectImages = getProjectImages(project);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/20"
                >
                  <div className="space-y-4">
                    {projectImages.length > 0 ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-800/50 bg-slate-900/60 mb-2">
                    <img
                      src={projectImages[0]}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    {projectImages.length > 1 && (
                      <span className="absolute bottom-2 right-2 rounded-md border border-slate-700 bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-slate-200">
                        {projectImages.length} images
                      </span>
                    )}
                  </div>
                ) : null}

                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-300">
                    {project.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">CASE_0{index + 1}</span>
                </div>

                <h3 className="font-display text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack?.slice(0, 3).map((stack) => (
                    <span key={stack} className="rounded-md bg-slate-900/80 border border-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                      {stack}
                    </span>
                  ))}
                  {project.techStack && project.techStack.length > 3 && (
                    <span className="rounded-md bg-slate-900/80 border border-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics block */}
              <div className="mt-6 border-t border-slate-800/40 pt-4 space-y-3">
                {project.metrics && project.metrics.length > 0 && (
                  <>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      <Activity className="h-3.5 w-3.5" />
                      <span>Impact Metric</span>
                    </div>
                    <p className="text-xs font-medium text-slate-300 italic">
                      "{project.metrics[0]}"
                    </p>
                  </>
                )}

                <button
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setSelectedProject(project);
                  }}
                  className="w-full mt-4 group/btn inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                >
                  Inspect Technical Blueprint
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
                </motion.div>
              );
            })()
          ))}
        </div>
      )}

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          (() => {
            const selectedImages = getProjectImages(selectedProject);
            const activeImage = selectedImages[selectedImageIndex] || selectedImages[0];
            const showImageControls = selectedImages.length > 1;
            return (
          <div
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/85 p-4 py-8 backdrop-blur-md"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeProjectModal();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative my-auto w-full max-w-5xl max-h-[calc(100vh-4rem)] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 p-5 text-left shadow-2xl md:p-8"
            >
              {/* Close Button */}
              <button
                onClick={closeProjectModal}
                className="sticky left-full top-0 z-20 -mb-10 rounded-xl border border-slate-800 bg-slate-900/90 p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                aria-label="Close project details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-300">
                      {selectedProject.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Case Blueprint</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white pr-8">
                    {selectedProject.title}
                  </h2>
                </div>

                {/* Hero Image in Modal */}
                {activeImage ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-xl">
                    <img
                      src={activeImage}
                      alt={`${selectedProject.title} screenshot ${selectedImageIndex + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                    {showImageControls && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedImageIndex((current) => (current - 1 + selectedImages.length) % selectedImages.length)}
                          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-white transition-all hover:bg-blue-600"
                          aria-label="Previous project image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedImageIndex((current) => (current + 1) % selectedImages.length)}
                          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-white transition-all hover:bg-blue-600"
                          aria-label="Next project image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <span className="absolute bottom-3 right-3 rounded-md border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                          {selectedImageIndex + 1} / {selectedImages.length}
                        </span>
                      </>
                    )}
                  </div>
                ) : null}

                {selectedImages.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {selectedImages.map((image, imageIndex) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedImageIndex(imageIndex)}
                        className={`h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl border bg-slate-900 transition-all ${
                          selectedImageIndex === imageIndex
                            ? "border-blue-500 ring-2 ring-blue-500/30"
                            : "border-slate-800 hover:border-blue-500/60"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${selectedProject.title} thumbnail ${imageIndex + 1}`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {selectedProject.websiteUrl && (
                  <a
                    href={selectedProject.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-500"
                  >
                    Visit Live Website
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {/* Grid Content */}
                <div className="grid gap-6 md:grid-cols-3 border-t border-slate-800/80 pt-6">
                  {/* Left Column: longDescription, features */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Project Overview</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {selectedProject.longDescription}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Core Product Features</h4>
                      <div className="grid gap-2.5">
                        {selectedProject.features.map((feature, i) => (
                          <div key={i} className="flex gap-2.5 text-sm text-slate-300">
                            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: metrics, techStack */}
                  <div className="space-y-6 border-t border-slate-800/60 pt-6 md:border-t-0 md:pt-0 md:border-l md:border-slate-800/60 md:pl-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Verified Outcomes</h4>
                      <div className="space-y-3">
                        {selectedProject.metrics.map((metric, i) => (
                          <div key={i} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs font-medium text-emerald-300">
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Engineering Stack</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.techStack.map((stack) => (
                          <span key={stack} className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300">
                            {stack}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database architecture section */}
                {selectedProject.dbStructure && (
                  <div className="border-t border-slate-800/80 pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-4.5 w-4.5 text-blue-400" />
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Relational Database & Data Schema Blueprint</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This represents how Abdullah structured the operational database for this product, establishing high query performance and optimal data referential integrity.
                    </p>
                    
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                      {selectedProject.dbStructure.map((table, tIdx) => (
                        <div key={tIdx} className="rounded-xl border border-slate-800 bg-slate-900/20 p-4">
                          <span className="block text-xs font-bold text-blue-400 border-b border-slate-800 pb-1.5 mb-2 font-mono truncate">
                            🗂️ {table.table}
                          </span>
                          <div className="space-y-1">
                            {table.fields.map((field) => (
                              <span key={field} className="block text-[10px] font-mono text-slate-400">
                                • {field}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
            );
          })()
        )}
      </AnimatePresence>
    </div>
  );
}
