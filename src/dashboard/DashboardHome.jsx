export default function DashboardHome() {
    const cards = [
        {
            title: "إجمالي المنتجات",
            value: "6",
            icon: "📦",
            color: "#198754",
        },
        {
            title: "إجمالي الطلبات",
            value: "12",
            icon: "🛒",
            color: "#0d6efd",
        },
        {
            title: "إجمالي العملاء",
            value: "48",
            icon: "👥",
            color: "#fd7e14",
        },
        {
            title: "إجمالي المبيعات",
            value: "850,000 ج.م",
            icon: "💰",
            color: "#dc3545",
        },
        {
            title: "إجمالي المشتريات",
            value: "420,000 ج.م",
            icon: "📥",
            color: "#6f42c1",
        },
        {
            title: "صافي الأرباح",
            value: "430,000 ج.م",
            icon: "📈",
            color: "#20c997",
        },
    ];

    const orders = [
        {
            id: "#1001",
            customer: "شركة النور",
            product: "ملح نقاء 50 كيلو",
            total: "25,000 ج.م",
            status: "جديد",
        },
        {
            id: "#1002",
            customer: "شركة السلام",
            product: "ملح نقاء طن",
            total: "40,000 ج.م",
            status: "جاري التنفيذ",
        },
        {
            id: "#1003",
            customer: "شركة الإيمان",
            product: "ملح نقاء 25 كيلو",
            total: "18,500 ج.م",
            status: "تم التسليم",
        },
        {
            id: "#1004",
            customer: "شركة الأمل",
            product: "ملح نقاء 4 كيلو",
            total: "12,000 ج.م",
            status: "جديد",
        },
    ];

    const lowStock = [
        {
            product: "ملح نقاء 50 كيلو",
            quantity: "8",
        },
        {
            product: "ملح نقاء 25 كيلو",
            quantity: "5",
        },
        {
            product: "ملح نقاء 1 كيلو",
            quantity: "3",
        },
    ];

    const getStatusStyle = (status) => {
        if (status === "جديد") {
            return {
                background: "#cff4fc",
                color: "#055160",
            };
        }

        if (status === "جاري التنفيذ") {
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

            {/* آخر الطلبات + المخزون */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(0, 2fr) minmax(280px, 1fr)",
                    gap: "20px",
                    marginTop: "25px",
                }}
            >
                {/* آخر الطلبات */}
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
                            📋 آخر الطلبات
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
                                    رقم الطلب
                                </th>

                                <th
                                    style={thStyle}
                                >
                                    العميل
                                </th>

                                <th
                                    style={thStyle}
                                >
                                    المنتج
                                </th>

                                <th
                                    style={thStyle}
                                >
                                    الإجمالي
                                </th>

                                <th
                                    style={thStyle}
                                >
                                    الحالة
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(
                                (order, index) => (
                                    <tr
                                        key={index}
                                    >
                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                order.id
                                            }
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                order.customer
                                            }
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                order.product
                                            }
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                order.total
                                            }
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            <span
                                                style={{
                                                    ...getStatusStyle(
                                                        order.status
                                                    ),
                                                    padding:
                                                        "6px 10px",
                                                    borderRadius:
                                                        "20px",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                {
                                                    order.status
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                )
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

                    {lowStock.map(
                        (item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    padding:
                                        "13px 0",
                                    borderBottom:
                                        "1px solid #eee",
                                }}
                            >
                                <div>
                                    <strong>
                                        {
                                            item.product
                                        }
                                    </strong>

                                    <div
                                        style={{
                                            color:
                                                "#dc3545",
                                            fontSize:
                                                "13px",
                                            marginTop:
                                                "5px",
                                        }}
                                    >
                                        الكمية المتبقية:{" "}
                                        {
                                            item.quantity
                                        }
                                    </div>
                                </div>

                                <span
                                    style={{
                                        background:
                                            "#f8d7da",
                                        color:
                                            "#842029",
                                        padding:
                                            "5px 9px",
                                        borderRadius:
                                            "6px",
                                        fontSize:
                                            "12px",
                                    }}
                                >
                                    منخفض
                                </span>
                            </div>
                        )
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
                        title="طلبات جديدة"
                        value="4"
                    />

                    <Summary
                        title="طلبات قيد التنفيذ"
                        value="3"
                    />

                    <Summary
                        title="طلبات تم تسليمها"
                        value="5"
                    />

                    <Summary
                        title="أصناف منخفضة"
                        value="3"
                    />
                </div>
            </div>
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
