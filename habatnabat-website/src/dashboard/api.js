// API Configuration
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5138/api";

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/Auth/login",
        ME: "/Auth/me",
        VALIDATE_LOGIN: "/Users/validate-login",
    },
    USERS: "/Users",
    PRODUCTS: "/Products",
    ORDERS: "/Orders",
    CUSTOMERS: "/Customers",
    SUPPLIERS: "/Suppliers",
    SALES: "/Sales",
    REPORTS: "/Reports",
    SETTINGS: "/Settings",
    INVENTORY: "/Products", // Uses Products API
};

// Get auth token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

// Get auth headers
export const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

// Generic fetch wrapper with auth
export const apiFetch = async (url, options = {}) => {
    const authHeaders = getAuthHeaders();
    const defaultHeaders = {
        "Content-Type": "application/json",
        ...authHeaders,
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE}${url}`, config);

    // Handle 401 - clear token and redirect to login
    if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("انتهت الجلسة، يرجى تسجيل الدخول مجدداً");
    }

    return response;
};

// Helper methods
export const apiGet = (url, options = {}) => apiFetch(url, { ...options, method: "GET" });
export const apiPost = (url, data, options = {}) => apiFetch(url, { ...options, method: "POST", body: JSON.stringify(data) });
export const apiPut = (url, data, options = {}) => apiFetch(url, { ...options, method: "PUT", body: JSON.stringify(data) });
export const apiDelete = (url, options = {}) => apiFetch(url, { ...options, method: "DELETE" });