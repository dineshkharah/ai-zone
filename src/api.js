// src/api.js

const BASE_URL = "http://127.0.0.1:8000";

// ========== TOOL SEARCH ==========
export const searchTools = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/?query=${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
};

// ========== LOGIN ==========
export const loginUser = async (email, password, role) => {
  try {
    const response = await fetch(`${BASE_URL}/login?role=${role}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Login failed");
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
