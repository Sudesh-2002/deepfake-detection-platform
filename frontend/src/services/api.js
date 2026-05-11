import config from '../config'

const BASE = config.API_BASE_URL

// ─── Health Check ────────────────────────────────────────────────────────────

export async function checkHealth() {
  const res = await fetch(`${BASE}/health`)
  if (!res.ok) throw new Error('Backend is not reachable')
  return res.json()
}

// ─── File-based detections (video, audio, image, document, multimodal) ───────

async function detectWithFile(type, file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE}/detect/${type}`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.detail || `Detection failed (${res.status})`)
  }

  return data
}

// ─── Text detection (JSON body) ───────────────────────────────────────────────

async function detectText(text) {
  const res = await fetch(`${BASE}/detect/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.detail || `Text detection failed (${res.status})`)
  }

  return data
}

// ─── Exported detection functions ────────────────────────────────────────────

export const api = {
  detectVideo:      (file) => detectWithFile('video', file),
  detectAudio:      (file) => detectWithFile('audio', file),
  detectImage:      (file) => detectWithFile('image', file),
  detectDocument:   (file) => detectWithFile('document', file),
  detectMultimodal: (file) => detectWithFile('multimodal', file),
  detectText:       (text) => detectText(text),
}