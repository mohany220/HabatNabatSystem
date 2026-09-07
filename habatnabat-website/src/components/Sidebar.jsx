import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const menu = [
        { name: "🏠 لوحة التحكم", path: "/dashboard" },
        { name: "📦 المنتجات", path: "/dashboard/products" },
        { name: "🛒 الطلبات", path: "/dashboard/orders" },
        { name: "👥 العملاء", path: "/dashboard/customers" },
        { name: "🚚 الموردين", path: "/dashboard/suppliers" },
        { name: "🏭 المخزن", path: "/dashboard/inventory" },
        { name: "💰 المبيعات", path: "/dashboard/sales" },
        { name: "📊 التقارير", path: "/dashboard/reports" },
        { name: "👤 المستخدمين", path: "/dashboard/users" },
        { name: "⚙️ الإعدادات", path: "/dashboard/settings" },
    ];

    return (
        <div
            style={{
                width: "260px",
                height: "100vh",
                background: "#0B5D3F",
                position: "fixed",
                right: 0,
                top: 0,

                // مهم جدًا
                overflowY: "auto",
                overflowX: "hidden",

                padding: "20px",
                color: "#fff",
                boxSizing: "border-box",

                // يخلي الـ Sidebar فوق باقي العناصر
                zIndex: 1000,

                // شكل الـ Scrollbar
                scrollbarWidth: "thin",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    marginBottom: "30px",
                    marginTop: "5px",
                }}
            >
                🏭 حبة نبات
            </h2>

            {menu.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    style={({ isActive }) => ({
                        display: "block",
                        padding: "12px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#fff",
                        background: isActive
                            ? "#198754"
                            : "transparent",

                        // تمنع النص من الخروج
                        whiteSpace: "nowrap",

                        transition: "0.2s",
                    })}
                >
                    {item.name}
                </NavLink>
            ))}
        </div>
    );
}
