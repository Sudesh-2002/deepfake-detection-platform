import { useState, useRef } from 'react'
import { api } from '../services/api'

const ACCEPT_MAP = {
  video:      'video/*',
  audio:      'audio/*',
  image:      'image/*',
  text:       null,
  document:   '.pdf,.doc,.docx',
  multimodal: 'video/*',
}

// Map detection type id → api function
const API_FN_MAP = {
  video:      (file) => api.detectVideo(file),
  audio:      (file) => api.detectAudio(file),
  image:      (file) => api.detectImage(file),
  document:   (file) => api.detectDocument(file),
  multimodal: (file) => api.detectMultimodal(file),
  text:       null, // handled separately
}

export default function DetectionPage({ type, onBack }) {
  const [file, setFile]           = useState(null)
  const [textInput, setTextInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const fileInputRef              = useRef()

  const isTextMode = type.id === 'text'
  const acceptAttr = ACCEPT_MAP[type.id]

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) { setFile(dropped); setResult(null); setError(null) }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      let data
      if (isTextMode) {
        data = await api.detectText(textInput)
      } else {
        data = await API_FN_MAP[type.id](file)
      }
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const canAnalyze = isTextMode
    ? textInput.trim().length > 20
    : !!file

  // Colour helpers
  const barColor = (score) => {
    if (score >= 0.75) return 'bg-red-500'
    if (score >= 0.4)  return 'bg-amber-500'
    return 'bg-green-500'
  }
  const textColor = (score) => {
    if (score >= 0.75) return 'text-red-400'
    if (score >= 0.4)  return 'text-amber-400'
    return 'text-green-400'
  }
  const verdictStyle = (score) => {
    if (score >= 0.75) return 'bg-red-500/15 text-red-400 border-red-500/30'
    if (score >= 0.4)  return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    return 'bg-green-500/15 text-green-400 border-green-500/30'
  }
  const verdictLabel = (score) => {
    if (score >= 0.75) return '🚨 Likely Fake'
    if (score >= 0.4)  return '⚠️ Uncertain'
    return '✅ Likely Real'
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white font-semibold">
            {type.icon} {type.label} Detection
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black text-white mb-2">{type.label} Analysis</h1>
          <p className="text-gray-400 text-sm">{type.desc}</p>
        </div>

        {/* Upload / Input card */}
        <div className={`rounded-2xl border ${type.border} bg-white/3 overflow-hidden`}>
          <div className="p-6">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-4">
              {isTextMode ? 'Paste Text' : 'Upload File'}
            </label>

            {isTextMode ? (
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
                rows={8}
                placeholder="Paste text here to check if it was AI-generated…"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
                  ${isDragging
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/3'}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptAttr}
                  className="hidden"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="space-y-2">
                    <div className="text-3xl">📎</div>
                    <div className="text-white font-medium">{file.name}</div>
                    <div className="text-gray-500 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl opacity-40">{type.icon}</div>
                    <div className="text-gray-300 font-medium">Drop file here or click to browse</div>
                    <div className="text-gray-600 text-xs">Accepts: {acceptAttr}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between bg-white/2">
            <span className="text-gray-600 text-xs">
              {isTextMode
                ? `${textInput.length} characters`
                : file ? 'Ready to analyze' : 'No file selected'}
            </span>
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                ${canAnalyze && !loading
                  ? `bg-gradient-to-r ${type.accent} text-white hover:opacity-90 shadow-lg`
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Run Detection
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold mb-1">Detection failed</p>
              <p className="text-red-300/80">{error}</p>
              {error.includes('fetch') || error.includes('network') || error.includes('Failed') ? (
                <p className="text-red-300/60 text-xs mt-2">
                  Make sure the backend is running: <code className="bg-white/10 px-1 rounded">uvicorn main:app --reload</code>
                </p>
              ) : null}
            </div>
          </div>
        )}

        {/* Result card */}
        {result && (
          <div className={`rounded-2xl border ${type.border} bg-white/3 p-6 space-y-5`}>
            <h2 className="text-white font-bold text-lg">Analysis Result</h2>

            {/* Score + bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Fake Probability</span>
                <span className={`text-2xl font-black ${textColor(result.fake_probability)}`}>
                  {(result.fake_probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor(result.fake_probability)}`}
                  style={{ width: `${result.fake_probability * 100}%` }}
                />
              </div>
            </div>

            {/* Verdict badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${verdictStyle(result.fake_probability)}`}>
              {verdictLabel(result.fake_probability)}
            </div>

            {/* Signals */}
            {result.signals?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Detected Signals</p>
                <ul className="space-y-2">
                  {result.signals.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-gray-600 mt-0.5 shrink-0">▸</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Multimodal breakdown */}
            {result.breakdown && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Score Breakdown</p>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(result.breakdown).map(([key, val]) => (
                    <div key={key} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className={`text-lg font-bold ${textColor(val)}`}>
                        {(val * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500 capitalize mt-1">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text stats */}
            {result.stats && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Text Statistics</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(result.stats)
                    .filter(([k]) => !['repeated_bigrams', 'ai_phrase_hits'].includes(k))
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between bg-white/3 rounded-lg px-3 py-2">
                        <span className="text-gray-500 capitalize">{k.replace(/_/g, ' ')}</span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Model info */}
            {result.model && (
              <p className="text-xs text-gray-600 pt-2 border-t border-white/5">
                Model: <span className="text-gray-500">{result.model}</span>
              </p>
            )}
          </div>
        )}

        {/* Tags info */}
        <div className="rounded-xl bg-white/2 border border-white/6 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">What this checks</p>
          <div className="flex flex-wrap gap-2">
            {type.tags.map((tag) => (
              <span key={tag} className={`text-xs px-3 py-1 rounded-full border border-white/8 ${type.badge}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}