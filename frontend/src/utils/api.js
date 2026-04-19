// frontend/src/utils/api.js

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Handle API calls with centralized error handling
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.msg || "Something went wrong");
    }
    
    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const authApi = {
  login: (credentials) => apiCall("/auth/login", { 
    method: "POST", 
    body: JSON.stringify(credentials) 
  }),
  signup: (userData) => apiCall("/auth/register", { 
    method: "POST", 
    body: JSON.stringify(userData) 
  }),
};

export const activityApi = {
  save: (userId, moduleName, moduleData) => apiCall("/activity/save", {
    method: "POST",
    body: JSON.stringify({ userId, moduleName, moduleData })
  }),
  fetch: (userId) => apiCall(`/activity/${userId}`),
  clearHistory: (userId) => apiCall(`/activity/clear/${userId}`, {
    method: "DELETE"
  }),
};
