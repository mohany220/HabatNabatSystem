import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    const [page, setPage] = useState("home");
    const cards = [
        { title: "المنتجات", value: 125, icon: "📦" },
        { title: "الطلبات", value: 18, icon: "🛒" },
        { title: "العملاء", value: 96, icon: "👥" },
        { title: "الموردين", value: 23, icon: "🚚" },
        { title: "المبيعات", value: "850,000 ج", icon: "💰" },
        { title: "الأرباح", value: "125,000 ج", icon: "📈" },
        { title: "المخزون", value: 210, icon: "🏭" },
        { title: "التنبيهات", value: 5, icon: "⚠️" },
    ];

    return (
        <>
            <Sidebar />

            <div
                style={{
                    marginRight: "280px",
                    padding: "40px",
                    background: "#f4f6f9",
                    minHeight: "100vh",
                    direction: "rtl",
                }}
            >
                <h1 style={{ color: "#0B5D3F" }}>لوحة التحكم</h1>

                <p>مرحبًا بك في نظام إدارة مصنع حبة نبات</p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                        gap: "20px",
                        marginTop: "30px",
                    }}
                >
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            style={{
                                background: "#fff",
                                padding: "25px",
                                borderRadius: "15px",
                                boxShadow: "0 5px 15px rgba(0,0,0,.1)",
                            }}
                        >
                            <h2>{card.icon}</h2>

                            <h3>{card.title}</h3>

                            <h1>{card.value}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}