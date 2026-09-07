import { useEffect, useState } from "react";

import { apiGet, API_ENDPOINTS } from "./api.js";

export default function DashboardHome() {
    const [stats, setStats] = useState({
        TodaySales: 0,
        TodayInvoices: 0,
        MonthSales: 0,
        MonthInvoices: 0,
        TotalCustomers: 0,
        TotalProducts: 0,
        InventoryValue: 0,
        LowStockCount: 0,
        RecentSales: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // تحميل إحصائيات الداشبورد
    // =====================================================

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(`${API_ENDPOINTS.REPORTS}/dashboard-stats`);

            if (!response.ok) {
                throw new Error("فشل تحميل إحصائيات الداشبورد");
            }

            const data = await response.json();

            // Map API response (camelCase) to frontend expected format (PascalCase)
            // Handle both formats for backward compatibility
            const mappedStats = {
                TodaySales: data.TodaySales ?? data.todaySales ?? 0,
                TodayInvoices: data.TodayInvoices ?? data.todayInvoices ?? 0,
                MonthSales: data.MonthSales ?? data.monthSales ?? 0,
                MonthInvoices: data.MonthInvoices ?? data.monthInvoices ?? 0,
                TotalCustomers: data.TotalCustomers ?? data.totalCustomers ?? 0,
                TotalProducts: data.TotalProducts ?? data.totalProducts ?? 0,
                InventoryValue: data.InventoryValue ?? data.inventoryValue ?? 0,
                LowStockCount: data.LowStockCount ?? data.lowStockCount ?? 0,
                RecentSales: data.RecentSales ?? data.recentSales ?? [],
            };

            setStats(mappedStats);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحميل بيانات الداشبورد");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardStats();
    }, []);

    // =====================================================
    // تنسيق العملة
    // =====================================================

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "0 ج.م";
        return Number(value).toLocaleString("ar-EG") + " ج.م";
    };

    // =====================================================
    // تحديد شكل الحالة
    // =====================================================

    const getStatusStyle = (status) => {
        if (status === "جديد") {
            return {
                background: "#cff4fc",
                color: "#055160",
            };
        }

        if (status === "قيد التجهيز") {
            return {
                background: "#fff3cd",
                color: "#856404",
            };
        }

        return {
            background: "#d1e7dd",
            color: "#0f5132",
        };
    };

    // =====================================================
    // بطاقات الإحصائيات
    // =====================================================

    const cards = [
        {
            title: "إجمالي المنتجات",
            value: stats.TotalProducts ?? stats.totalProducts ?? 0,
            icon: "📦",
            color: "#198754",
        },
        {
            title: "إجمالي الطلبات (هذا الشهر)",
            value: stats.MonthInvoices ?? stats.monthInvoices ?? 0,
            icon: "🛒",
            color: "#0d6efd",
        },
        {
            title: "إجمالي العملاء",
            value: stats.TotalCustomers ?? stats.totalCustomers ?? 0,
            icon: "👥",
            color: "#fd7e14",
        },
        {
            title: "مبيعات اليوم",
            value: formatCurrency(stats.TodaySales ?? stats.todaySales ?? 0),
            icon: "💰",
            color: "#dc3545",
        },
        {
            title: "مبيعات هذا الشهر",
            value: formatCurrency(stats.MonthSales ?? stats.monthSales ?? 0),
            icon: "📈",
            color: "#6f42c1",
        },
        {
            title: "قيمة المخزون",
            value: formatCurrency(stats.InventoryValue ?? stats.inventoryValue ?? 0),
            icon: "🏭",
            color: "#20c997",
        },
    ];

    return (
        <div
            dir="rtl"
            style={{
                background: "#f5f7f9",
                minHeight: "100vh",
                padding: "25px",
            }}
        >
            {/* الترحيب */}
            <div style={{ marginBottom: "25px" }}>
                <h2
                    style={{
                        margin: 0,
                        color: "#12372A",
                        fontSize: "28px",
                    }}
                >
                    🏠 لوحة المعلومات
                </h2>

                <p
                    style={{
                        color: "#777",
                        marginTop: "8px",
                    }}
                >
                    مرحباً بك في نظام إدارة مصنع حبة نبات
                </p>
            </div>

            {/* رسالة خطأ */}
            {error && (
                <div
                    style={{
                        background: "#f8d7da",
                        color: "#842029",
                        padding: "15px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        fontWeight: "bold",
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {/* تحميل */}
            {loading ? (
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "12px",
                        padding: "60px 20px",
                        textAlign: "center",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,.08)",
                    }}
                >
                    <div style={{ fontSize: "35px" }}>⏳</div>
                    <div style={{ color: "#777", fontSize: "18px", marginTop: "10px" }}>
                        جاري تحميل بيانات الداشبورد...
                    </div>
                </div>
            ) : (
                <>
                    {/* الكروت */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(200px,1fr))",
                            gap: "18px",
                        }}
                    >
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                style={{
                                    background: "#fff",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    boxShadow:
                                        "0 3px 12px rgba(0,0,0,.07)",
                                    borderRight:
                                        `5px solid ${card.color}`,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                margin: 0,
                                                color: "#777",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {card.title}
                                        </p>

                                        <h2
                                            style={{
                                                margin:
                                                    "10px 0 0",
                                                color:
                                                    card.color,
                                            }}
                                        >
                                            {card.value}
                                        </h2>
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "35px",
                                        }}
                                    >
                                        {card.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* آخر الفواتير + المخزون */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "minmax(0, 2fr) minmax(280px, 1fr)",
                            gap: "20px",
                            marginTop: "25px",
                        }}
                    >
                        {/* آخر الفواتير */}
                        <div
                            style={{
                                background: "#fff",
                                padding: "22px",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 3px 12px rgba(0,0,0,.07)",
                                overflowX: "auto",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    marginBottom: "15px",
                                }}
                            >
                                <h3 style={{ margin: 0 }}>
                                    📋 آخر فواتير البيع
                                </h3>

                                <span
                                    style={{
                                        color: "#198754",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                    }}
                                >
                                    عرض الكل
                                </span>
                            </div>

                            <table
                                style={{
                                    width: "100%",
                                    minWidth: "650px",
                                    borderCollapse:
                                        "collapse",
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            background:
                                                "#f8f9fa",
                                        }}
                                    >
                                        <th
                                            style={thStyle}
                                        >
                                            رقم الفاتورة
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            العميل
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            التاريخ
                                        </th>

                                        <th
                                            style={thStyle}
                                        >
                                            الصافي
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        (stats.RecentSales ?? stats.recentSales ?? []).length > 0 ? (
                                            (stats.RecentSales ?? stats.recentSales ?? []).map(
                                                (sale, index) => {
                                                    const saleId = sale.SaleID ?? sale.saleID;
                                                    const customerName = sale.CustomerName ?? sale.customerName;
                                                    const saleDate = sale.SaleDate ?? sale.saleDate;
                                                    const netAmount = sale.NetAmount ?? sale.netAmount;
                                                    return (
                                                        <tr
                                                            key={saleId ?? index}
                                                        >
                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                #{
                                                                    saleId
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {customerName}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {saleDate
                                                                    ? new Date(
                                                                        saleDate
                                                                    ).toLocaleDateString(
                                                                        "ar-EG"
                                                                    )
                                                                    : "-"}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    ...tdStyle,
                                                                    fontWeight:
                                                                        "bold",
                                                                    color:
                                                                        "#198754",
                                                                }}
                                                            >
                                                                {formatCurrency(netAmount)}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )
                                        ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                style={{
                                                    textAlign:
                                                        "center",
                                                    padding:
                                                        "35px",
                                                    color:
                                                        "#777",
                                                }}
                                            >
                                                لا توجد فواتير مؤخراً
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* تنبيه المخزون */}
                        <div
                            style={{
                                background: "#fff",
                                padding: "22px",
                                borderRadius: "12px",
                                boxShadow:
                                    "0 3px 12px rgba(0,0,0,.07)",
                            }}
                        >
                            <h3
                                style={{
                                    marginTop: 0,
                                    marginBottom: "20px",
                                }}
                            >
                                ⚠️ مخزون منخفض
                            </h3>

                            {(stats.LowStockCount ?? stats.lowStockCount ?? 0) > 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                        color: "#dc3545",
                                    }}
                                >
                                    <div style={{ fontSize: "48px", marginBottom: "10px" }}>⚠️</div>
                                    <h4>يوجد {stats.LowStockCount ?? stats.lowStockCount ?? 0} منتج منخفض المخزون</h4>
                                    <p style={{ color: "#777", marginTop: "10px" }}>
                                        راجع شاشة المخزن أو التقارير للتفاصيل
                                    </p>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                        color: "#198754",
                                    }}
                                >
                                    <div style={{ fontSize: "48px", marginBottom: "10px" }}>✅</div>
                                    <h4>جميع المنتجات بمخزون كافٍ</h4>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ملخص سريع */}
                    <div
                        style={{
                            marginTop: "25px",
                            background: "#fff",
                            padding: "22px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 3px 12px rgba(0,0,0,.07)",
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>
                            📊 ملخص النظام
                        </h3>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(180px,1fr))",
                                gap: "15px",
                            }}
                        >
                            <Summary
                                title="فواتير اليوم"
                                value={stats.TodayInvoices ?? stats.todayInvoices ?? 0}
                            />

                            <Summary
                                title="فواتير هذا الشهر"
                                value={stats.MonthInvoices ?? stats.monthInvoices ?? 0}
                            />

                            <Summary
                                title="إجمالي العملاء"
                                value={stats.TotalCustomers ?? stats.totalCustomers ?? 0}
                            />

                            <Summary
                                title="منتجات منخفضة المخزون"
                                value={stats.LowStockCount ?? stats.lowStockCount ?? 0}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function Summary({ title, value }) {
    return (
        <div
            style={{
                background: "#f8f9fa",
                padding: "18px",
                borderRadius: "10px",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    color: "#777",
                    marginBottom: "8px",
                }}
            >
                {title}
            </div>

            <strong
                style={{
                    fontSize: "24px",
                    color: "#198754",
                }}
            >
                {value}
            </strong>
        </div>
    );
}

const thStyle = {
    padding: "12px 10px",
    textAlign: "center",
    color: "#555",
    fontSize: "14px",
};

const tdStyle = {
    padding: "13px 10px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
};