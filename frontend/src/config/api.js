// API base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for API calls
export const apiCall = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

export const resolveImageUrl = (url) => {
  if (!url) return url;

  const value = String(url);

  if (value.startsWith('http://') || value.startsWith('https://')) {
    const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1):5000/;
    return localhostPattern.test(value) ? value.replace(localhostPattern, API_BASE_URL) : value;
  }

  if (value.startsWith('/uploads/')) {
    return `${API_BASE_URL}${value}`;
  }

  return value;
};
