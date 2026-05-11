import BackendStatus from '../components/BackendStatus'

const DETECTION_TYPES = [
  {
    id: 'video',
    label: 'Video',
    icon: '🎥',
    desc: 'Detect face swaps, lip-sync mismatch, and frame inconsistencies in video files.',
    accent: 'from-violet-600 to-indigo-600',
    border: 'border-violet-500/30',
    glow: 'hover:shadow-violet-500/20',
    badge: 'bg-violet-500/10 text-violet-300',
    tags: ['Face Swap', 'Lip Sync', 'Temporal'],
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: '🎧',
    desc: 'Identify AI-cloned voices, unnatural speech patterns, and spectrogram artifacts.',
    accent: 'from-cyan-600 to-teal-600',
    border: 'border-cyan-500/30',
    glow: 'hover:shadow-cyan-500/20',
    badge: 'bg-cyan-500/10 text-cyan-300',
    tags: ['Voice Clone', 'Spectrogram', 'MFCC'],
  },
  {
    id: 'image',
    label: 'Image',
    icon: '🖼️',
    desc: 'Spot GAN-generated faces, texture anomalies, and frequency domain artifacts.',
    accent: 'from-rose-600 to-pink-600',
    border: 'border-rose-500/30',
    glow: 'hover:shadow-rose-500/20',
    badge: 'bg-rose-500/10 text-rose-300',
    tags: ['GAN Detection', 'FFT Analysis', 'CNN'],
  },
  {
    id: 'text',
    label: 'Text',
    icon: '📝',
    desc: 'Detect AI-written content using perplexity scoring and stylometric analysis.',
    accent: 'from-amber-600 to-orange-600',
    border: 'border-amber-500/30',
    glow: 'hover:shadow-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-300',
    tags: ['Perplexity', 'Stylometry', 'LLM'],
  },
  {
    id: 'document',
    label: 'Document',
    icon: '📄',
    desc: 'Verify PDFs and documents for signature forgery and metadata tampering.',
    accent: 'from-emerald-600 to-green-600',
    border: 'border-emerald-500/30',
    glow: 'hover:shadow-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-300',
    tags: ['Metadata', 'OCR', 'Layout'],
  },
  {
    id: 'multimodal',
    label: 'Multi-Modal',
    icon: '🌐',
    desc: 'Cross-check video, audio, and text together for semantic and lip-sync alignment.',
    accent: 'from-fuchsia-600 to-purple-600',
    border: 'border-fuchsia-500/30',
    glow: 'hover:shadow-fuchsia-500/20',
    badge: 'bg-fuchsia-500/10 text-fuchsia-300',
    tags: ['Cross-Modal', 'Semantic', 'Alignment'],
  },
]

export default function Dashboard({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm">
              🛡️
            </div>
            <span className="font-bold text-lg tracking-tight text-white">DeepGuard</span>
            <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-6">
            <BackendStatus />
            <nav className="flex items-center gap-6 text-sm text-gray-400">
              <span className="text-white font-medium">Dashboard</span>
              <span className="hover:text-white cursor-pointer transition-colors">History</span>
              <span className="hover:text-white cursor-pointer transition-colors">Docs</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          AI-Powered Detection Engine · 6 Media Types Supported
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          Detect Deepfakes<br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Across Every Medium
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Upload video, audio, images, text, or documents — our multi-modal AI engine reveals manipulation.
        </p>
      </section>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-3 gap-4 bg-white/3 border border-white/8 rounded-2xl p-6">
          {[
            { label: 'Detection Types', value: '6' },
            { label: 'Avg Accuracy', value: '94.2%' },
            { label: 'Avg Analysis Time', value: '< 8s' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Cards */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-6">Choose Detection Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DETECTION_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onNavigate('detect', type)}
              className={`group text-left p-6 rounded-2xl border bg-white/3 ${type.border} hover:bg-white/6 hover:shadow-2xl ${type.glow} transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.accent} flex items-center justify-center text-xl shadow-lg`}>
                  {type.icon}
                </div>
                <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{type.label} Detection</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{type.desc}</p>
              <div className="flex flex-wrap gap-2">
                {type.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2.5 py-1 rounded-full border border-white/8 ${type.badge}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        DeepGuard · Built with React + FastAPI · Hosted on Vercel + Render
      </footer>
    </div>
  )
}