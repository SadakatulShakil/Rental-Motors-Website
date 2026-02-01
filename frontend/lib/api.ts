export const apiRequest = async (endpoint: string, options: any = {}) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  
    // 1. Setup headers automatically
    const headers = {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }), // Only add if token exists
      ...options.headers,
    };
  
    // 2. Perform the fetch
    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
    });
  
    // 3. Centralized 401 Check (The "Auto Logout" Logic)
    if (response.status === 401) {
      console.warn("Session expired or invalid. Logging out...");
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        // Use window.location for a hard reset to the login page
        window.location.href = "/login?reason=expired"; 
      }
    }
  
    return response;
  };