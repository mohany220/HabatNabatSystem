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
    ORDERS: "/Orders",
};