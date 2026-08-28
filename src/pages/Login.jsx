import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError("من فضلك أدخل البريد الإلكتروني وكلمة المرور");
            return;
        }

        // مؤقتًا هنعتبر تسجيل الدخول ناجح
        localStorage.setItem("customerLoggedIn", "true");
        localStorage.setItem("customerEmail", form.email);

        navigate("/dashboard");
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
                        تسجيل الدخول إلى حسابك
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
                        البريد الإلكتروني
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="أدخل البريد الإلكتروني"
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
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "#B68B2D",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        تسجيل الدخول
                    </button>
                </form>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "25px",
                        color: "#666",
                    }}
                >
                    ليس لديك حساب؟
                    <Link
                        to="/register"
                        style={{
                            color: "#0B5D3F",
                            fontWeight: "bold",
                            textDecoration: "none",
                            marginRight: "5px",
                        }}
                    >
                        إنشاء حساب
                    </Link>
                </div>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
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