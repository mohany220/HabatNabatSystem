import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5233/api";

function Reports() {
    const [reportType, setReportType] = useState("sales");

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // جلب الفواتير من قاعدة البيانات
    // =====================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE}/Orders`
            );

            if (!response.ok) {
                throw new Error(
                    "فشل تحميل الفواتير"
                );
            }

            const data = await response.json();

            setOrders(data);
        } catch (err) {
            console.error(err);

            setError(
                "حدث خطأ أثناء تحميل بيانات المبيعات من قاعدة البيانات"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // تشغيل تحميل البيانات عند فتح التقارير
    // =====================================================

    useEffect(() => {
        fetchOrders();
    }, []);

    // =====================================================
    // إجمالي المبيعات
    // =====================================================

    const totalSales = orders.reduce(
        (sum, order) =>
            sum + Number(order.totalAmount || 0),
        0
    );

    // =====================================================
    // عدد الفواتير
    // =====================================================

    const totalInvoices = orders.length;

    // =====================================================
    // المبيعات الجديدة
    // =====================================================

    const newOrders = orders.filter(
        (order) =>
            order.status === "جديد"
    ).length;

    // =====================================================
    // الطلبات قيد التجهيز
    // =====================================================

    const preparingOrders = orders.filter(
        (order) =>
            order.status === "قيد التجهيز"
    ).length;

    // =====================================================
    // الواجهة
    // =====================================================

    return (
        <div
            style={{
                padding: "10px",
                direction: "rtl",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            {/* =====================================================
                العنوان
            ===================================================== */}

            <div
                style={{
                    marginBottom: "25px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: "#0B5D3F",
                        fontSize: "30px",
                    }}
                >
                    📊 التقارير
                </h2>

                <p
                    style={{
                        color: "#777",
                    }}
                >
                    متابعة المبيعات والمشتريات والحركة المالية
                </p>
            </div>

            {/* =====================================================
                الإحصائيات
            ===================================================== */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(200px,1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                {/* إجمالي المبيعات */}

                <div style={cardStyle}>
                    <div
                        style={{
                            fontSize: "35px",
                        }}
                    >
                        💰
                    </div>

                    <h3>
                        إجمالي المبيعات
                    </h3>

                    <strong
                        style={{
                            color: "#198754",
                            fontSize: "25px",
                        }}
                    >
                        {totalSales.toLocaleString()} جنيه
                    </strong>
                </div>

                {/* عدد الفواتير */}

                <div style={cardStyle}>
                    <div
                        style={{
                            fontSize: "35px",
                        }}
                    >
                        🧾
                    </div>

                    <h3>
                        عدد الفواتير
                    </h3>

                    <strong
                        style={{
                            color: "#0d6efd",
                            fontSize: "25px",
                        }}
                    >
                        {totalInvoices}
                    </strong>
                </div>

                {/* طلبات جديدة */}

                <div style={cardStyle}>
                    <div
                        style={{
                            fontSize: "35px",
                        }}
                    >
                        🆕
                    </div>

                    <h3>
                        طلبات جديدة
                    </h3>

                    <strong
                        style={{
                            color: "#fd7e14",
                            fontSize: "25px",
                        }}
                    >
                        {newOrders}
                    </strong>
                </div>

                {/* قيد التجهيز */}

                <div style={cardStyle}>
                    <div
                        style={{
                            fontSize: "35px",
                        }}
                    >
                        ⚙️
                    </div>

                    <h3>
                        قيد التجهيز
                    </h3>

                    <strong
                        style={{
                            color: "#6f42c1",
                            fontSize: "25px",
                        }}
                    >
                        {preparingOrders}
                    </strong>
                </div>
            </div>

            {/* =====================================================
                اختيار نوع التقرير
            ===================================================== */}

            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 3px 15px rgba(0,0,0,.08)",
                    marginBottom: "20px",
                }}
            >
                <h3
                    style={{
                        marginTop: 0,
                        color: "#0B5D3F",
                    }}
                >
                    📋 نوع التقرير
                </h3>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                    }}
                >
                    <button
                        onClick={() =>
                            setReportType("sales")
                        }
                        style={{
                            ...reportButton,
                            background:
                                reportType === "sales"
                                    ? "#0B5D3F"
                                    : "#eee",
                            color:
                                reportType === "sales"
                                    ? "#fff"
                                    : "#333",
                        }}
                    >
                        💰 تقرير المبيعات
                    </button>

                    <button
                        onClick={() =>
                            setReportType("purchases")
                        }
                        style={{
                            ...reportButton,
                            background:
                                reportType === "purchases"
                                    ? "#0B5D3F"
                                    : "#eee",
                            color:
                                reportType === "purchases"
                                    ? "#fff"
                                    : "#333",
                        }}
                    >
                        🛒 تقرير المشتريات
                    </button>
                </div>
            </div>

            {/* =====================================================
                التقرير
            ===================================================== */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow:
                        "0 3px 15px rgba(0,0,0,.08)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        padding: "20px",
                        borderBottom:
                            "1px solid #eee",
                    }}
                >
                    <h3
                        style={{
                            margin: 0,
                            color: "#0B5D3F",
                        }}
                    >
                        {reportType === "sales"
                            ? "💰 تقرير المبيعات"
                            : "🛒 تقرير المشتريات"}
                    </h3>
                </div>

                {/* =================================================
                    تقرير المبيعات
                ================================================= */}

                {reportType === "sales" && (
                    <div
                        style={{
                            overflowX: "auto",
                        }}
                    >
                        {loading ? (
                            <div
                                style={{
                                    textAlign:
                                        "center",
                                    padding: "40px",
                                    color: "#777",
                                }}
                            >
                                ⏳ جاري تحميل بيانات المبيعات...
                            </div>
                        ) : error ? (
                            <div
                                style={{
                                    margin: "20px",
                                    padding: "15px",
                                    background:
                                        "#f8d7da",
                                    color:
                                        "#842029",
                                    borderRadius:
                                        "8px",
                                    textAlign:
                                        "center",
                                }}
                            >
                                {error}
                            </div>
                        ) : orders.length === 0 ? (
                            <div
                                style={{
                                    textAlign:
                                        "center",
                                    padding: "40px",
                                    color: "#777",
                                }}
                            >
                                لا توجد فواتير مبيعات في قاعدة البيانات
                            </div>
                        ) : (
                            <table
                                style={{
                                    width: "100%",
                                    minWidth:
                                        "750px",
                                    borderCollapse:
                                        "collapse",
                                }}
                            >
                                <thead
                                    style={{
                                        background:
                                            "#0B5D3F",
                                        color: "#fff",
                                    }}
                                >
                                    <tr>
                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            رقم الفاتورة
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            التاريخ
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            العميل
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            الإجمالي
                                        </th>

                                        <th
                                            style={
                                                thStyle
                                            }
                                        >
                                            الحالة
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.map(
                                        (
                                            order
                                        ) => (
                                            <tr
                                                key={
                                                    order.orderID
                                                }
                                            >
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    #
                                                    {
                                                        order.orderID
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {order.orderDate
                                                        ? new Date(
                                                            order.orderDate
                                                        ).toLocaleDateString(
                                                            "ar-EG"
                                                        )
                                                        : "-"}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {order
                                                        .customer
                                                        ?.customerName ||
                                                        "عميل نقدي"}
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight:
                                                            "bold",
                                                    }}
                                                >
                                                    {Number(
                                                        order.totalAmount ||
                                                        0
                                                    ).toLocaleString()}{" "}
                                                    جنيه
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
                                                                "6px 12px",
                                                            borderRadius:
                                                                "20px",
                                                            fontSize:
                                                                "13px",
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
                        )}
                    </div>
                )}

                {/* =================================================
                    تقرير المشتريات
                ================================================= */}

                {reportType === "purchases" && (
                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center",
                            color: "#777",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "50px",
                                marginBottom: "15px",
                            }}
                        >
                            🛒
                        </div>

                        <h3>
                            تقرير المشتريات
                        </h3>

                        <p>
                            سيتم ربط تقرير المشتريات بقاعدة البيانات
                            بعد ربط فواتير المشتريات بالـ API.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

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

    if (status === "تم الشحن") {
        return {
            background: "#cfe2ff",
            color: "#084298",
        };
    }

    if (status === "مكتمل") {
        return {
            background: "#d1e7dd",
            color: "#0f5132",
        };
    }

    if (status === "ملغي") {
        return {
            background: "#f8d7da",
            color: "#842029",
        };
    }

    return {
        background: "#e2e3e5",
        color: "#41464b",
    };
};

// =====================================================
// Styles
// =====================================================

const cardStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow:
        "0 3px 15px rgba(0,0,0,.08)",
};

const reportButton = {
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
};

const thStyle = {
    padding: "14px 10px",
    textAlign: "center",
};

const tdStyle = {
    padding: "14px 10px",
    textAlign: "center",
    borderBottom:
        "1px solid #eee",
};

export default Reports;