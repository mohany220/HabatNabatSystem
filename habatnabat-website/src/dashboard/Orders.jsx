import { useEffect, useState } from "react";
import NewOrder from "./NewOrder";

import { apiGet, apiDelete, API_ENDPOINTS } from "./api.js";

function Orders() {
    // =====================================================
    // الطلبات القادمة من قاعدة البيانات
    // =====================================================

    const [orders, setOrders] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // شاشة إنشاء طلب جديد / تعديل
    // =====================================================

    const [showNewOrder, setShowNewOrder] = useState(false);

    // الفاتورة التي يتم تعديلها
    const [orderToEdit, setOrderToEdit] = useState(null);

    // =====================================================
    // الفاتورة التي يتم عرضها
    // =====================================================

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [loadingOrder, setLoadingOrder] = useState(false);

    // =====================================================
    // جلب الفواتير من قاعدة البيانات
    // GET /api/Orders
    // =====================================================

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(API_ENDPOINTS.ORDERS);

            if (!response.ok) {
                throw new Error("فشل تحميل الطلبات");
            }

            const data = await response.json();

            setOrders(data);
        } catch (err) {
            console.error(err);

            setError(
                "حدث خطأ أثناء تحميل الطلبات من قاعدة البيانات"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // تحميل الطلبات عند فتح الشاشة
    // =====================================================

    useEffect(() => {
        loadOrders();
    }, []);

    // =====================================================
    // فتح شاشة طلب جديد
    // =====================================================

    const openNewOrder = () => {
        setOrderToEdit(null);
        setShowNewOrder(true);
    };

    // =====================================================
    // الرجوع من شاشة الطلب الجديد
    // =====================================================

    const handleBack = () => {
        setShowNewOrder(false);
        setOrderToEdit(null);

        // إعادة تحميل الطلبات من قاعدة البيانات
        loadOrders();
    };

    // =====================================================
    // عرض فاتورة واحدة
    // GET /api/Orders/{id}
    // =====================================================

    const viewOrder = async (id) => {
        try {
            setLoadingOrder(true);

            const response = await apiGet(`${API_ENDPOINTS.ORDERS}/${id}`);

            if (!response.ok) {
                throw new Error("الفاتورة غير موجودة");
            }

            const data = await response.json();

            setSelectedOrder(data);
        } catch (err) {
            console.error(err);

            alert("حدث خطأ أثناء تحميل بيانات الفاتورة");
        } finally {
            setLoadingOrder(false);
        }
    };

    // =====================================================
    // تعديل طلب
    // =====================================================

    const editOrder = async (id) => {
        try {
            setError("");

            const response = await apiGet(`${API_ENDPOINTS.ORDERS}/${id}`);

            if (!response.ok) {
                throw new Error("فشل تحميل بيانات الطلب");
            }

            const data = await response.json();

            // فتح نموذج التعديل مع بيانات الطلب
            setShowNewOrder(true);
            
            // تحميل البيانات في نموذج NewOrder
            // سنستخدم state لتخزين بيانات الطلب للتعديل
            setOrderToEdit(data);
        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء تحميل بيانات الفاتورة للتعديل");
        }
    };

    // =====================================================
    // حذف فاتورة من قاعدة البيانات
    // DELETE /api/Orders/{id}
    // =====================================================

    const deleteOrder = async (id) => {
        const confirmDelete = window.confirm(
            "هل أنت متأكد من حذف هذه الفاتورة؟"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await apiDelete(`${API_ENDPOINTS.ORDERS}/${id}`);

            if (!response.ok) {
                throw new Error("فشل حذف الفاتورة");
            }

            // إعادة تحميل البيانات من قاعدة البيانات
            await loadOrders();

            alert("تم حذف الفاتورة بنجاح");
        } catch (err) {
            console.error(err);

            alert("حدث خطأ أثناء حذف الفاتورة");
        }
    };

    // =====================================================
    // البحث
    // =====================================================

    const filteredOrders = orders.filter((order) => {
        const customerName =
            order.customer?.customerName || "";

        const orderID =
            order.orderID?.toString() || "";

        return (
            customerName.includes(search) ||
            orderID.includes(search)
        );
    });

    // =====================================================
    // إجمالي قيمة الطلبات
    // =====================================================

    const totalOrdersAmount = orders.reduce(
        (sum, order) =>
            sum + Number(order.totalAmount || 0),
        0
    );

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
    // لو شاشة طلب جديد / تعديل مفتوحة
    // =====================================================

    if (showNewOrder) {
        return (
            <NewOrder
                onBack={handleBack}
                orderToEdit={orderToEdit}
            />
        );
    }

    // =====================================================
    // الواجهة
    // =====================================================

    return (
        <div
            dir="rtl"
            style={{
                padding: "25px",
                background: "#f5f7f9",
                minHeight: "100vh",
            }}
        >
            {/* =====================================================
                العنوان
            ===================================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginBottom: "25px",
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            color: "#12372A",
                            fontSize: "26px",
                        }}
                    >
                        📋 إدارة الطلبات
                    </h2>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#777",
                        }}
                    >
                        متابعة طلبات العملاء والفواتير المسجلة
                    </p>
                </div>

                {/* =====================================================
                    زر طلب جديد
                ===================================================== */}

                <button
                    onClick={openNewOrder}
                    style={{
                        padding: "12px 22px",
                        background: "#198754",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "15px",
                        fontWeight: "bold",
                    }}
                >
                    ➕ طلب جديد
                </button>
            </div>

            {/* =====================================================
                الإحصائيات
            ===================================================== */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: "18px",
                    marginBottom: "25px",
                }}
            >
                <StatCard
                    title="📋 إجمالي الطلبات"
                    value={orders.length}
                    color="#198754"
                />

                <StatCard
                    title="🆕 طلبات جديدة"
                    value={
                        orders.filter(
                            (order) =>
                                order.status === "جديد"
                        ).length
                    }
                    color="#0d6efd"
                />

                <StatCard
                    title="⚙️ قيد التجهيز"
                    value={
                        orders.filter(
                            (order) =>
                                order.status ===
                                "قيد التجهيز"
                        ).length
                    }
                    color="#fd7e14"
                />

                <StatCard
                    title="💰 إجمالي قيمة الطلبات"
                    value={`${totalOrdersAmount.toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }
                    )} ج.م`}
                    color="#6f42c1"
                />
            </div>

            {/* =====================================================
                البحث
            ===================================================== */}

            <div
                style={{
                    background: "#fff",
                    padding: "18px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,.08)",
                }}
            >
                <input
                    type="text"
                    placeholder="🔎 ابحث برقم الفاتورة أو اسم العميل..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "12px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        outline: "none",
                        fontSize: "15px",
                    }}
                />
            </div>

            {/* =====================================================
                حالة التحميل
            ===================================================== */}

            {loading && (
                <div
                    style={{
                        background: "#fff",
                        padding: "40px",
                        borderRadius: "12px",
                        textAlign: "center",
                        color: "#777",
                    }}
                >
                    ⏳ جاري تحميل الطلبات...
                </div>
            )}

            {/* =====================================================
                رسالة الخطأ
            ===================================================== */}

            {!loading && error && (
                <div
                    style={{
                        background: "#f8d7da",
                        color: "#842029",
                        padding: "18px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        textAlign: "center",
                    }}
                >
                    {error}

                    <br />

                    <button
                        onClick={loadOrders}
                        style={{
                            marginTop: "12px",
                            padding: "8px 18px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#842029",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        🔄 إعادة المحاولة
                    </button>
                </div>
            )}

            {/* =====================================================
                جدول الطلبات
            ===================================================== */}

            {!loading && !error && (
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "12px",
                        overflowX: "auto",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,.08)",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            minWidth: "900px",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead
                            style={{
                                background: "#198754",
                                color: "#fff",
                            }}
                        >
                            <tr>
                                <th style={thStyle}>
                                    رقم الفاتورة
                                </th>

                                <th style={thStyle}>
                                    العميل
                                </th>

                                <th style={thStyle}>
                                    التاريخ
                                </th>

                                <th style={thStyle}>
                                    الإجمالي
                                </th>

                                <th style={thStyle}>
                                    الحالة
                                </th>

                                <th style={thStyle}>
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(
                                    (order) => (
                                        <tr
                                            key={
                                                order.orderID
                                            }
                                        >
                                            {/* رقم الفاتورة */}

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

                                            {/* العميل */}

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                {order.customer
                                                    ?.customerName ||
                                                    "عميل نقدي"}
                                            </td>

                                            {/* التاريخ */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {new Date(
                                                    order.orderDate
                                                ).toLocaleDateString(
                                                    "ar-EG"
                                                )}
                                            </td>

                                            {/* الإجمالي */}

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
                                                ).toLocaleString(
                                                    "en-US",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}{" "}
                                                ج.م
                                            </td>

                                            {/* الحالة */}

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

                                            {/* الإجراءات */}

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                <button
                                                    style={
                                                        viewButton
                                                    }
                                                    onClick={() =>
                                                        viewOrder(
                                                            order.orderID
                                                        )
                                                    }
                                                >
                                                    👁️ عرض
                                                </button>

                                                <button
                                                    style={
                                                        editButton
                                                    }
                                                    onClick={() =>
                                                        editOrder(
                                                            order.orderID
                                                        )
                                                    }
                                                >
                                                    ✏️
                                                </button>

                                                <button
                                                    style={
                                                        deleteButton
                                                    }
                                                    onClick={() =>
                                                        deleteOrder(
                                                            order.orderID
                                                        )
                                                    }
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "35px",
                                            color:
                                                "#777",
                                        }}
                                    >
                                        لا توجد فواتير في قاعدة البيانات 🔍
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* =====================================================
                نافذة عرض الفاتورة
            ===================================================== */}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() =>
                        setSelectedOrder(null)
                    }
                />
            )}

            {/* =====================================================
                تحميل الفاتورة
            ===================================================== */}

            {loadingOrder && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,.35)",
                        display: "flex",
                        justifyContent:
                            "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "30px 45px",
                            borderRadius: "12px",
                            fontSize: "18px",
                            fontWeight: "bold",
                        }}
                    >
                        ⏳ جاري تحميل الفاتورة...
                    </div>
                </div>
            )}
        </div>
    );
}

// =====================================================
// نافذة تفاصيل الفاتورة
// =====================================================

function OrderDetailsModal({
    order,
    onClose,
}) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                zIndex: 9998,
            }}
        >
            <div
                dir="rtl"
                style={{
                    background: "#fff",
                    width: "100%",
                    maxWidth: "900px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    borderRadius: "14px",
                    padding: "25px",
                    boxSizing: "border-box",
                }}
            >
                {/* العنوان */}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                color: "#12372A",
                            }}
                        >
                            🧾 فاتورة رقم #
                            {order.orderID}
                        </h2>

                        <p
                            style={{
                                margin:
                                    "8px 0 0",
                                color: "#777",
                            }}
                        >
                            {new Date(
                                order.orderDate
                            ).toLocaleString(
                                "ar-EG"
                            )}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background:
                                "#f8d7da",
                            color: "#842029",
                            width: "38px",
                            height: "38px",
                            borderRadius:
                                "50%",
                            cursor: "pointer",
                            fontSize: "18px",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* بيانات العميل */}

                <div
                    style={{
                        background: "#f5f7f9",
                        padding: "18px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <h3
                        style={{
                            marginTop: 0,
                            color: "#12372A",
                        }}
                    >
                        👤 بيانات العميل
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "10px",
                        }}
                    >
                        <div>
                            <strong>
                                العميل:
                            </strong>{" "}
                            {order.customer
                                ?.customerName ||
                                "عميل نقدي"}
                        </div>

                        <div>
                            <strong>
                                الهاتف:
                            </strong>{" "}
                            {order.customer
                                ?.phone ||
                                "-"}
                        </div>

                        <div>
                            <strong>
                                العنوان:
                            </strong>{" "}
                            {order.customer
                                ?.address ||
                                "-"}
                        </div>
                    </div>
                </div>

                {/* المنتجات */}

                <h3
                    style={{
                        color: "#12372A",
                    }}
                >
                    📦 تفاصيل الطلب
                </h3>

                <div
                    style={{
                        overflowX: "auto",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                            minWidth:
                                "650px",
                        }}
                    >
                        <thead
                            style={{
                                background:
                                    "#198754",
                                color: "#fff",
                            }}
                        >
                            <tr>
                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    المنتج
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    الوزن
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    الكمية
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    سعر الوحدة
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    الإجمالي
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.orderDetails?.map(
                                (detail) => (
                                    <tr
                                        key={
                                            detail.orderDetailID
                                        }
                                    >
                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {detail
                                                .product
                                                ?.productName ||
                                                "-"}
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {detail
                                                .product
                                                ?.weight ||
                                                "-"}
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                detail.quantity
                                            }
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {Number(
                                                detail.unitPrice
                                            ).toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                }
                                            )}{" "}
                                            ج.م
                                        </td>

                                        <td
                                            style={{
                                                ...tdStyle,
                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            {Number(
                                                detail.total
                                            ).toLocaleString(
                                                "en-US",
                                                {
                                                    minimumFractionDigits: 2,
                                                }
                                            )}{" "}
                                            ج.م
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* الملاحظات */}

                {order.notes && (
                    <div
                        style={{
                            marginTop: "20px",
                            background:
                                "#fff3cd",
                            color: "#856404",
                            padding: "15px",
                            borderRadius: "8px",
                        }}
                    >
                        <strong>
                            📝 الملاحظات:
                        </strong>

                        <div
                            style={{
                                marginTop:
                                    "8px",
                            }}
                        >
                            {order.notes}
                        </div>
                    </div>
                )}

                {/* الإجمالي */}

                <div
                    style={{
                        marginTop: "20px",
                        padding: "18px",
                        background: "#e9f7ef",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    <span>
                        إجمالي الفاتورة
                    </span>

                    <span
                        style={{
                            color: "#198754",
                        }}
                    >
                        {Number(
                            order.totalAmount ||
                            0
                        ).toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                            }
                        )}{" "}
                        ج.م
                    </span>
                </div>

                {/* زر الإغلاق */}

                <button
                    onClick={onClose}
                    style={{
                        width: "100%",
                        marginTop: "20px",
                        padding: "12px",
                        border: "none",
                        borderRadius: "8px",
                        background:
                            "#198754",
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    إغلاق
                </button>
            </div>
        </div>
    );
}

// =====================================================
// كارت الإحصائيات
// =====================================================

function StatCard({
    title,
    value,
    color,
}) {
    return (
        <div
            style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,.08)",
            }}
        >
            <div
                style={{
                    color: "#777",
                }}
            >
                {title}
            </div>

            <h2
                style={{
                    margin: "10px 0 0",
                    color,
                }}
            >
                {value}
            </h2>
        </div>
    );
}

// =====================================================
// Styles
// =====================================================

const thStyle = {
    padding: "14px 12px",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
};

const tdStyle = {
    padding: "14px 12px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
    color: "#212529",
    fontSize: "14px",
};

const viewButton = {
    border: "none",
    background: "#cff4fc",
    color: "#055160",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "5px",
};

const editButton = {
    border: "none",
    background: "#fff3cd",
    color: "#856404",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "5px",
};

const deleteButton = {
    border: "none",
    background: "#f8d7da",
    color: "#842029",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
};

export default Orders;
