import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5138/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userName: "",
        password: "",
    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.userName || !form.password) {
            setError("من فضلك أدخل اسم المستخدم وكلمة المرور");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE}/Auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: form.userName,
                    password: form.password,
                }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || "فشل تسجيل الدخول");
            }

            if (!response.ok) {
                throw new Error(data?.message || "فشل تسجيل الدخول");
            }

            // Save token and user info
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");
        } catch (err) {
            console.error(err);

            setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #0B5D3F 0%, #083d2b 100%)",
                padding: "20px",
                direction: "rtl",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "40px",
                    boxShadow: "0 15px 40px rgba(0,0,0,.25)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: "#0B5D3F",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 15px",
                            fontSize: "35px",
                        }}
                    >
                        🏭
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            color: "#0B5D3F",
                            fontSize: "30px",
                        }}
                    >
                        حبة نبات
                    </h1>

                    <p style={{ color: "#777" }}>
                        تسجيل الدخول إلى لوحة التحكم
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold",
                        }}
                    >
                        اسم المستخدم
                    </label>

                    <input
                        type="text"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        placeholder="أدخل اسم المستخدم"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "14px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            fontSize: "16px",
                            outline: "none",
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold",
                        }}
                    >
                        كلمة المرور
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="أدخل كلمة المرور"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "14px",
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            marginBottom: "15px",
                            fontSize: "16px",
                            outline: "none",
                        }}
                    />

                    {error && (
                        <div
                            style={{
                                background: "#ffe5e5",
                                color: "#c62828",
                                padding: "12px",
                                borderRadius: "8px",
                                marginBottom: "15px",
                                textAlign: "center",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: loading ? "#999" : "#0B5D3F",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "⏳ جاري تسجيل الدخول..." : "تسجيل الدخول"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
                    <Link
                        to="/"
                        style={{
                            color: "#777",
                            textDecoration: "none",
                        }}
                    >
                        ← العودة إلى الموقع
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;