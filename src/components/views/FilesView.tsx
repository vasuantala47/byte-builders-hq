"use client";

import React, { useState, useRef } from "react";
import { useTeam } from "@/context/TeamContext";
import { ProjectFile } from "@/types";
import {
  FolderArchive,
  Plus,
  FileText,
  FileCode,
  Image as ImageIcon,
  Cpu,
  Download,
  Search,
  ExternalLink,
  UploadCloud,
  Copy,
  Check,
  Link as LinkIcon,
  Loader2,
  Paperclip,
} from "lucide-react";

export const FilesView: React.FC = () => {
  const { files, uploadProjectFile, members, currentMember } = useTeam();

  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload mode: 'file' or 'url'
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Direct URL state
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [category, setCategory] = useState<ProjectFile["category"]>("Circuits");
  const [customSize, setCustomSize] = useState("1.5 MB");

  const categories: (ProjectFile["category"] | "All")[] = [
    "All",
    "Circuits",
    "CAD",
    "Datasheets",
    "Code",
    "Images",
    "Docs",
    "Videos",
    "Slides",
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCustomName(file.name);

    // Auto-detect category from file extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (["kicad_pcb", "kicad_sch", "sch", "brd", "gerber", "gbr"].includes(ext)) {
      setCategory("Circuits");
    } else if (["step", "stp", "stl", "obj", "f3d", "dxf"].includes(ext)) {
      setCategory("CAD");
    } else if (["pdf"].includes(ext)) {
      setCategory("Datasheets");
    } else if (["c", "cpp", "h", "hpp", "ino", "py", "rs", "ts", "js", "json"].includes(ext)) {
      setCategory("Code");
    } else if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) {
      setCategory("Images");
    } else if (["mp4", "mov", "webm"].includes(ext)) {
      setCategory("Videos");
    } else {
      setCategory("Docs");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (uploadMode === "file" && selectedFile) {
        setUploadProgress("Uploading to server and generating URL...");
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Upload failed");
        }

        uploadProjectFile(
          customName.trim() || selectedFile.name,
          category,
          json.size || `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          json.url
        );
      } else if (uploadMode === "url" && customUrl.trim()) {
        uploadProjectFile(
          customName.trim() || "External Resource",
          category,
          customSize.trim() || "Web Link",
          customUrl.trim()
        );
      }

      // Reset
      setIsUploading(false);
      setSelectedFile(null);
      setCustomName("");
      setCustomUrl("");
      setUploadProgress("");
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyFileUrl = (file: ProjectFile) => {
    const fullUrl = file.url.startsWith("http")
      ? file.url
      : file.url.startsWith("/")
      ? `${window.location.origin}${file.url}`
      : file.url;

    navigator.clipboard.writeText(fullUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredFiles = files.filter((f) => {
    const matchesCat = categoryFilter === "All" || f.category === categoryFilter;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getFileIcon = (cat: ProjectFile["category"]) => {
    switch (cat) {
      case "Circuits":
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case "CAD":
        return <FolderArchive className="w-4 h-4 text-amber-400" />;
      case "Code":
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case "Images":
        return <ImageIcon className="w-4 h-4 text-pink-400" />;
      case "Datasheets":
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C273C]">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Project Files & Media Hub
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono font-semibold">
              {files.length} Assets
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload hardware assets, CAD files, schematics, and images. Automatically generates shareable URLs for the entire team.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(!isUploading)}
          className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1.5"
        >
          {isUploading ? (
            <span>Close Uploader</span>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
              <span>Upload & Generate URL</span>
            </>
          )}
        </button>
      </div>

      {/* Upload & Generate URL Form Modal/Card */}
      {isUploading && (
        <form
          onSubmit={handleFileUpload}
          className="p-5 rounded-2xl bg-[#0D1524] border border-cyan-500/40 space-y-4 animate-in fade-in shadow-[0_0_30px_rgba(0,240,255,0.1)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                Upload Asset & Generate URL
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#080D18] p-1 rounded-lg border border-[#1E2B42]">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  uploadMode === "file"
                    ? "bg-cyan-400 text-black font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  uploadMode === "url"
                    ? "bg-cyan-400 text-black font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Link External URL
              </button>
            </div>
          </div>

          {uploadMode === "file" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-cyan-400 bg-cyan-950/20"
                  : selectedFile
                  ? "border-emerald-500/50 bg-emerald-950/10"
                  : "border-[#1E2B42] hover:border-cyan-500/40 bg-[#080D18]"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white font-mono">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload & generate URL
                  </p>
                  <p className="text-[10px] text-cyan-400 font-mono pt-1">Click to choose a different file</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Click to choose or drag & drop any file here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      STEP / STL, KiCad Schematics, Gerber archives, PDFs, C++ firmware, images, videos
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Resource or Cloud URL
                </label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/... or https://github.com/..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Display Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AeroPulse Main PCB Rev 2.1 Gerber"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Asset Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectFile["category"])}
                className="w-full px-3 py-2 rounded-lg bg-[#080D18] border border-[#1E2B42] text-white text-xs font-mono outline-none"
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1C273C]">
            <span className="text-[11px] text-cyan-400 font-mono">
              {uploadProgress || (uploadMode === "file" && selectedFile ? `Ready to upload (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)` : "")}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsUploading(false);
                  setSelectedFile(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#1E2B42] text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (uploadMode === "file" && !selectedFile) || (uploadMode === "url" && !customUrl)}
                className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-bold text-xs font-mono transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload & Generate URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  : "bg-[#0C121F] border border-[#1C273C] text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0E18] border border-[#1E2B42] text-white text-xs outline-none focus:border-cyan-400 font-sans"
          />
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map((file) => {
          const uploader = members.find((m) => m.id === file.uploadedById);
          const isCopied = copiedId === file.id;
          const isUploadedFile = file.url.startsWith("/uploads/") || file.url.startsWith("http");
          const isImage = file.category === "Images" && file.url.startsWith("/");

          return (
            <div
              key={file.id}
              className="hardware-card rounded-xl p-4 border border-[#1C273C] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-lg bg-[#080D18] border border-[#1E2B42] group-hover:border-cyan-500/30 transition-colors">
                    {getFileIcon(file.category)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131C2D] text-cyan-400 border border-cyan-500/20">
                    {file.category}
                  </span>
                </div>

                {/* Optional Image Thumbnail */}
                {isImage && (
                  <div className="h-28 rounded-lg overflow-hidden border border-[#1E2B42] bg-[#050811] flex items-center justify-center">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-white font-mono break-all line-clamp-2">
                    {file.name}
                  </h4>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-2">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>

                  {/* URL badge */}
                  {file.url && file.url !== "#" && (
                    <div className="mt-2 p-1.5 rounded bg-[#080D18] border border-[#1E2B42] flex items-center justify-between text-[10px] font-mono text-cyan-300 overflow-hidden">
                      <span className="truncate pr-1">
                        {file.url.startsWith("/") ? `${window.location.host}${file.url}` : file.url}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyFileUrl(file)}
                        title="Copy direct URL"
                        className="p-1 hover:text-white transition-colors shrink-0"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C273C] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>By {uploader ? uploader.name.split(" ")[0] : "Member"}</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyFileUrl(file)}
                    className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>URL</span>
                      </>
                    )}
                  </button>

                  {file.url && file.url !== "#" && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={file.name}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Get</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
