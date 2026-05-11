// Central API configuration
// In development: points to local FastAPI backend
// In production: points to your deployed backend (Render / Hugging Face)

const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
}

export default config