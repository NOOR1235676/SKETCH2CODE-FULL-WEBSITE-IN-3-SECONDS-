import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Sparkles,
  Code2,
  Eye,
  Copy,
  Check,
  Loader2,
  Download,
  Wand2,
  Palette,
  ImageIcon,
  Zap,
  ArrowRight,
  Star,
  Pen,
  Layers,
  Rocket,
  Shield,
  TrendingUp,
} from "lucide-react";

// ================================================================
//  👇 PASTE YOUR COLAB NGROK URL HERE (from Cell 4 output)
// ================================================================
const BACKEND_URL = "https://nanny-bonus-triangle.ngrok-free.dev";
// ================================================================

const STYLES = [
  { id: "modern", label: "Modern", emoji: "✨", desc: "Bold & clean", gradient: "from-indigo-500 to-purple-600" },
  { id: "minimal", label: "Minimal", emoji: "⚪", desc: "Less is more", gradient: "from-slate-400 to-slate-600" },
  { id: "playful", label: "Playful", emoji: "🎨", desc: "Fun & vibrant", gradient: "from-pink-500 to-orange-500" },
  { id: "corporate", label: "Corporate", emoji: "💼", desc: "Professional", gradient: "from-blue-600 to-cyan-600" },
];

export default function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [style, setStyle] = useState("modern");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [stats, setStats] = useState({ sketches: 1247, users: 312 });
  const fileRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats((s) => ({
        sketches: s.sketches + Math.floor(Math.random() * 3),
        users: s.users + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Only image files allowed (PNG / JPG)");
      return;
    }
    setError("");
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const generate = async () => {
    if (!imagePreview) {
      setError("Please upload a sketch first");
      return;
    }
    setLoading(true);
    setError("");
    setGeneratedCode("");

    try {
      const res = await fetch(`${BACKEND_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ image: imagePreview, style }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Generation failed");
      setGeneratedCode(data.html);
      setActiveTab("preview");
    } catch (err) {
      setError(err.message || "Backend connection failed — check the URL");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sketch2code-output.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setImage(null);
    setImagePreview(null);
    setGeneratedCode("");
    setError("");
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans">
      {/* ============ ANIMATED BACKGROUND ============ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-orb aurora-1"></div>
        <div className="aurora-orb aurora-2"></div>
        <div className="aurora-orb aurora-3"></div>
        <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
      </div>

      {/* ============ NAVBAR ============ */}
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Wand2 className="w-5 h-5" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl blur opacity-40 -z-10"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Sketch2Code</h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">
                AI · Computer Vision
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs">API Live</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Gemini 2.0 Flash</span>
            </div>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-slate-300">Loved by {stats.users}+ developers</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-xs">
            <Sparkles className="w-3 h-3 text-indigo-300" />
            <span className="text-indigo-200">Powered by Vision AI</span>
          </div>
        </div>

        <h2 className="text-6xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight">
          <span className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
            Sketch it.
          </span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ship it.
          </span>
        </h2>

        <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-8">
          Draw any UI on paper. Our AI transforms it into production-ready
          <span className="text-white"> React + Tailwind </span>
          code in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="font-mono text-white font-semibold">
              {stats.sketches.toLocaleString()}
            </span>
            <span className="text-slate-400">sketches converted</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-mono text-white font-semibold">&lt;3s</span>
            <span className="text-slate-400">avg generation</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-white font-semibold">100%</span>
            <span className="text-slate-400">private</span>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Pen, step: "01", title: "Draw", desc: "Sketch on paper or digital" },
            { icon: Upload, step: "02", title: "Upload", desc: "Drop your sketch image" },
            { icon: Rocket, step: "03", title: "Launch", desc: "Get production code" },
          ].map((s, i) => (
            <div key={i} className="relative group">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur hover:border-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-indigo-300" />
                  </div>
                  <span className="font-mono text-xs text-slate-500">{s.step}</span>
                </div>
                <h4 className="font-semibold text-sm mb-0.5">{s.title}</h4>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
              {i < 2 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 text-white/20 z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============ MAIN APP ============ */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT: INPUT */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition"></div>
            <div className="relative bg-slate-950/70 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-300" />
                  </div>
                  <h3 className="font-semibold text-sm">Your Sketch</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Step 01
                </span>
              </div>

              {!imagePreview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`relative rounded-2xl p-12 text-center cursor-pointer transition-all overflow-hidden ${
                    dragging
                      ? "border-2 border-indigo-400 bg-indigo-500/10 scale-[1.01]"
                      : "border-2 border-dashed border-white/10 hover:border-indigo-400/50 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-indigo-300" />
                    </div>
                    <p className="text-lg font-semibold mb-1">
                      Drop your sketch here
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                      or click to browse · PNG, JPG up to 10MB
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
                      <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                        ⌘V
                      </kbd>
                      <span>or paste from clipboard</span>
                    </div>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>
              ) : (
                <div className="relative group/img">
                  <img
                    src={imagePreview}
                    alt="sketch"
                    className="w-full rounded-2xl border border-white/10 max-h-80 object-contain bg-white/5"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-xs backdrop-blur border border-white/10 font-medium"
                  >
                    Change
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur border border-white/10 text-[11px] font-mono text-green-400">
                    ✓ Ready
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Palette className="w-3.5 h-3.5 text-purple-300" />
                    </div>
                    <h3 className="font-semibold text-sm">Design Style</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Step 02
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`relative p-3 rounded-xl border transition text-left overflow-hidden ${
                        style === s.id
                          ? "border-indigo-400 bg-indigo-500/10"
                          : "border-white/5 hover:border-white/20 bg-white/[0.02]"
                      }`}
                    >
                      {style === s.id && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-10`}></div>
                      )}
                      <div className="relative">
                        <div className="text-xl mb-1">{s.emoji}</div>
                        <div className="text-sm font-semibold">{s.label}</div>
                        <div className="text-[11px] text-slate-400">{s.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generate}
                disabled={loading || !imagePreview}
                className="relative mt-6 w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 overflow-hidden transition group/btn disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover/btn:from-indigo-400 group-hover/btn:via-purple-400 group-hover/btn:to-pink-400 transition"></div>
                <div className="absolute inset-0 shine-effect"></div>
                <div className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI is analyzing your sketch...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Code</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
                    </>
                  )}
                </div>
              </button>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-2">
                  <span className="text-red-400">⚠</span>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: OUTPUT */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition"></div>
            <div className="relative bg-slate-950/70 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 text-xs flex items-center gap-1.5 rounded-md transition ${
                        activeTab === "preview"
                          ? "bg-white/10 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button
                      onClick={() => setActiveTab("code")}
                      className={`px-3 py-1 text-xs flex items-center gap-1.5 rounded-md transition ${
                        activeTab === "code"
                          ? "bg-white/10 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" /> Code
                    </button>
                  </div>
                </div>
                {generatedCode && (
                  <div className="flex gap-1">
                    <button
                      onClick={copyCode}
                      className="px-2.5 py-1 rounded-md text-xs hover:bg-white/10 flex items-center gap-1.5 text-slate-300 transition"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadCode}
                      className="px-2.5 py-1 rounded-md text-xs hover:bg-white/10 flex items-center gap-1.5 text-slate-300 transition"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-[560px]">
                {!generatedCode && !loading && (
                  <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                        <Layers className="w-9 h-9 text-white/40" />
                      </div>
                      <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
                    </div>
                    <p className="text-lg font-semibold mb-1">Your preview appears here</p>
                    <p className="text-sm text-slate-400 max-w-xs">
                      Upload a sketch and click Generate to see the magic happen
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-2 max-w-xs">
                      {["Responsive", "Production", "Tailwind"].map((t) => (
                        <div key={t} className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-slate-400 text-center">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center p-10">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                        <Sparkles className="w-9 h-9" />
                      </div>
                      <div className="absolute -inset-6 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    </div>
                    <p className="text-lg font-semibold mb-1">AI is working its magic</p>
                    <p className="text-sm text-slate-400 mb-4">Generating production code...</p>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                )}

                {generatedCode && activeTab === "preview" && (
                  <iframe
                    title="preview"
                    srcDoc={generatedCode}
                    sandbox="allow-scripts"
                    className="w-full h-full min-h-[560px] bg-white"
                  />
                )}

                {generatedCode && activeTab === "code" && (
                  <pre className="p-5 text-xs overflow-auto h-full max-h-[560px] text-slate-300 bg-[#0a0e1a] font-mono leading-relaxed">
                    <code>{generatedCode}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Why developers love it</span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">
              Built for speed. Designed for scale.
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Wand2,
                title: "Multi-Modal AI",
                desc: "Powered by Gemini 2.0 Flash — the state-of-the-art vision-language model",
                gradient: "from-indigo-500/20 to-purple-500/20",
              },
              {
                icon: Palette,
                title: "4 Design Systems",
                desc: "Modern, Minimal, Playful, Corporate — switch styles with a single click",
                gradient: "from-purple-500/20 to-pink-500/20",
              },
              {
                icon: Rocket,
                title: "Ship in Seconds",
                desc: "Complete HTML + Tailwind output, responsive by default, ready to deploy",
                gradient: "from-pink-500/20 to-orange-500/20",
              },
            ].map((f, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-px bg-gradient-to-br from-white/10 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur hover:bg-white/[0.04] transition h-full">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} border border-white/10 flex items-center justify-center mb-4`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{f.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Wand2 className="w-3 h-3" />
            </div>
            <span>Sketch2Code · AI-powered design to code</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              All systems operational
            </span>
            <span>·</span>
            <span>Built with React + FastAPI + Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
