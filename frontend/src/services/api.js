const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchConcalls = async (page = 1, limit = 12) => {
  const url = `${API_BASE_URL}/list_concalls?page=${page}&limit=${limit}`;
  const response = await fetch(url);
  return handleResponse(response);
};

export const searchConcalls = async (name, page = 1, limit = 12) => {
  const encodedName = encodeURIComponent(name);
  const url = `${API_BASE_URL}/find_concalls?name=${encodedName}&page=${page}&limit=${limit}`;
  const response = await fetch(url);
  return handleResponse(response);
};

// Prevent duplicate analytics requests within a short time window
let lastAnalyticsCall = null;
const ANALYTICS_CALL_COOLDOWN = 5000; // 5 seconds

export const getAnalytics = async () => {
  const now = Date.now();
  
  // If a call was made recently, return the cached promise
  if (lastAnalyticsCall && (now - lastAnalyticsCall.timestamp) < ANALYTICS_CALL_COOLDOWN) {
    return lastAnalyticsCall.promise;
  }

  const url = `${API_BASE_URL}/analytics`;
  const promise = fetch(url).then(response => handleResponse(response));
  
  // Cache the promise and timestamp
  lastAnalyticsCall = {
    promise,
    timestamp: now
  };
  
  return promise;
};

