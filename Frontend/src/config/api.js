// API Configuration for MVP Platform Project
// This file centralizes all API-related configuration

const API_CONFIG = {
  // Environment detection - Vite uses import.meta.env
  environment:
    import.meta.env.VITE_API_ENV ||
    (import.meta.env.DEV ? "local" : "production"),

  endpoints: {
    local: "http://localhost:8000",
    production:
      import.meta.env.VITE_API_BASE_URL ||
      "https://mvp-platform-project.onrender.com",
  },
};

// Get the base URL based on current environment
export const API_BASE_URL = API_CONFIG.endpoints[API_CONFIG.environment];

// API Endpoints
export const API_ENDPOINTS = {
  // Code Generation
  generate: `${API_BASE_URL}/generate`,

  // File Operations
  files: `${API_BASE_URL}/files`,
  file: `${API_BASE_URL}/file`,
  updateFile: `${API_BASE_URL}/update_file`,

  // Preview
  preview: (filename) => `${API_BASE_URL}/preview/${filename}`,

  // Auto-fix
  autoFixError: `${API_BASE_URL}/auto-fix-error`,

  // Download
  download: `${API_BASE_URL}/download`,
};

// Helper function to check if we're in development mode
export const isDevelopment = () => API_CONFIG.environment === "local";

// Helper function to get current environment
export const getEnvironment = () => API_CONFIG.environment;

export default API_CONFIG;
