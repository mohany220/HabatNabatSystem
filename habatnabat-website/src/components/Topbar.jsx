import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

    return (
        <div
            style={{
                height: "70px",
                background: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 30px",
                borderBottom: "1px solid #ddd",
                marginBottom: "25px",
            }}
        >
            <div>
                <h2 style={{ color: "#0B5D3F", margin: 0 }}>
                    لوحة التحكم
                </h2>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <span style={{ fontSize: "20px", cursor: "pointer" }}>🔔</span>

                <span>👤 {userData?.name || "مستخدم"}</span>

                <button
                    onClick={handleLogout}
                    style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    تسجيل الخروج
                </button>
            </div>
        </div>
    );
}