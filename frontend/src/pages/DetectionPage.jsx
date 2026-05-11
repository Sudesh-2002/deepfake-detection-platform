import { useState, useRef } from 'react'

const ACCEPT_MAP = {
  video: 'video/*',
  audio: 'audio/*',
  image: 'image/*',
  text: null,      // text area input
  document: '.pdf,.doc,.docx',
  multimodal: 'video/*,audio/*',
}

const PLACEHOLDER_MAP = {
  text: 'Paste text here to check if it was AI-generated...',
  multimodal: null,
}

export default function DetectionPage({ type, onBack }) {
  const [file, setFile] = useState(null)
  const [textInput, setTextInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef()

  const isTextMode = type.id === 'text'
  const acceptAttr = ACCEPT_MAP[type.id]

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
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
      let response

      if (isTextMode) {
        // Text detection — JSON body
        response = await fetch(`http://localhost:8000/detect/${type.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textInput }),
        })
      } else {
        // File detection — multipart form
        const formData = new FormData()
        formData.append('file', file)
        response = await fetch(`http://localhost:8000/detect/${type.id}`, {
          method: 'POST',
          body: formData,
        })
      }

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Detection failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const canAnalyze = isTextMode ? textInput.trim().length > 20 : !!file

  const confidenceColor = (score) => {
    if (score >= 0.75) return 'text-red-400'
    if (score >= 0.4) return 'text-amber-400'
    return 'text-green-400'
  }

  const confidenceLabel = (score) => {
    if (score >= 0.75) return 'Likely Fake'
    if (score >= 0.4) return 'Uncertain'
    return 'Likely Real'
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
          <div className="w-px h-4 bg-white/10"></div>
          <span className="text-white font-semibold">
            {type.icon} {type.label} Detection
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            {type.label} Analysis
          </h1>
          <p className="text-gray-400">{type.desc}</p>
        </div>

        {/* Upload / Input Area */}
        <div className={`rounded-2xl border ${type.border} bg-white/3 overflow-hidden`}>
          <div className="p-6">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-4">
              {isTextMode ? 'Paste Text' : 'Upload File'}
            </label>

            {isTextMode ? (
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
                rows={8}
                placeholder={PLACEHOLDER_MAP.text}
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
                    : 'border-white/10 hover:border-white/20 hover:bg-white/3'
                  }`}
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

          {/* Analyze Button */}
          <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between bg-white/2">
            <span className="text-gray-600 text-xs">
              {isTextMode
                ? `${textInput.length} characters`
                : file ? `Ready to analyze` : 'No file selected'}
            </span>
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                ${canAnalyze && !loading
                  ? `bg-gradient-to-r ${type.accent} text-white hover:opacity-90 shadow-lg`
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
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

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-2xl border ${type.border} bg-white/3 p-6 space-y-5`}>
            <h2 className="text-white font-bold text-lg">Analysis Result</h2>

            {/* Score */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Fake Probability</span>
              <span className={`text-2xl font-black ${confidenceColor(result.fake_probability)}`}>
                {(result.fake_probability * 100).toFixed(1)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  result.fake_probability >= 0.75
                    ? 'bg-red-500'
                    : result.fake_probability >= 0.4
                    ? 'bg-amber-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${result.fake_probability * 100}%` }}
              />
            </div>

            {/* Verdict */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              ${result.fake_probability >= 0.75
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : result.fake_probability >= 0.4
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-green-500/15 text-green-400 border border-green-500/30'
              }`}>
              {result.fake_probability >= 0.75 ? '🚨' : result.fake_probability >= 0.4 ? '⚠️' : '✅'}
              {confidenceLabel(result.fake_probability)}
            </div>

            {/* Signals */}
            {result.signals && result.signals.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Detected Signals</p>
                <ul className="space-y-2">
                  {result.signals.map((signal, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-gray-600 mt-0.5">▸</span>
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Model used */}
            {result.model && (
              <p className="text-xs text-gray-600">
                Model: <span className="text-gray-500">{result.model}</span>
              </p>
            )}
          </div>
        )}

        {/* Info section */}
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