import { useEffect, useState } from "react";
import { apiGet, apiPost, API_ENDPOINTS } from "./api.js";

function Inventory() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // جلب المنتجات
    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(API_ENDPOINTS.PRODUCTS);

            if (!response.ok) {
                throw new Error("فشل تحميل المنتجات");
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحميل بيانات المخزون");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

// زيادة المخزون
    const increaseStock = async (id) => {
        const input = window.prompt(
            "أدخل الكمية المراد إضافتها:"
        );

        if (input === null) return;

        const quantity = Number(input);

        if (!quantity || quantity <= 0) {
            alert("من فضلك أدخل كمية صحيحة أكبر من صفر");
            return;
        }

        try {
            const response = await apiPost(`${API_ENDPOINTS.PRODUCTS}/${id}/increase-stock`, { quantity });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || "حدث خطأ أثناء زيادة المخزون");
            }

            if (!response.ok) {
                alert(data.message || "حدث خطأ أثناء زيادة المخزون");
                return;
            }

            // تحديث المنتج على الشاشة
            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.productID === id
                        ? data
                        : product
                )
            );

            alert("✅ تم زيادة المخزون بنجاح");
        } catch (err) {
            console.error(err);
            if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
                alert("تعذر الاتصال بالخادم");
            } else {
                alert(err.message || "حدث خطأ غير متوقع");
            }
        }
    };

// تقليل المخزون
    const decreaseStock = async (id) => {
        const input = window.prompt(
            "أدخل الكمية المراد خصمها:"
        );

        if (input === null) return;

        const quantity = Number(input);

        if (!quantity || quantity <= 0) {
            alert("من فضلك أدخل كمية صحيحة أكبر من صفر");
            return;
        }

        try {
            const response = await apiPost(`${API_ENDPOINTS.PRODUCTS}/${id}/decrease-stock`, { quantity });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || "حدث خطأ أثناء تقليل المخزون");
            }

            if (!response.ok) {
                alert(
                    data.message ||
                    "حدث خطأ أثناء تقليل المخزون"
                );
                return;
            }

            // تحديث المنتج على الشاشة
            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.productID === id
                        ? data
                        : product
                )
            );

            alert("✅ تم تقليل المخزون بنجاح");
        } catch (err) {
            console.error(err);
            if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
                alert("تعذر الاتصال بالخادم");
            } else {
                alert(err.message || "حدث خطأ غير متوقع");
            }
        }
    };

    // البحث
    const filteredProducts = products.filter((product) => {
        const name = product.productName || "";
        const weight = product.weight || "";

        return (
            name.toLowerCase().includes(
                search.toLowerCase()
            ) ||
            weight.toLowerCase().includes(
                search.toLowerCase()
            )
        );
    });

    // الإحصائيات
    const totalProducts = products.length;

    const totalQuantity = products.reduce(
        (total, product) =>
            total + Number(product.stockQuantity || 0),
        0
    );

    const lowStock = products.filter(
        (product) =>
            Number(product.stockQuantity || 0) > 0 &&
            Number(product.stockQuantity || 0) <= 15
    ).length;

    const outOfStock = products.filter(
        (product) =>
            Number(product.stockQuantity || 0) <= 0
    ).length;

    return (
        <div
            dir="rtl"
            style={{
                padding: "25px",
                background: "#f5f7f9",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >
            {/* العنوان */}
            <div style={{ marginBottom: "25px" }}>
                <h2
                    style={{
                        margin: 0,
                        color: "#0B5D3F",
                        fontSize: "30px",
                    }}
                >
                    🏭 إدارة المخزن
                </h2>

                <p style={{ color: "#777" }}>
                    متابعة كميات المنتجات وحالة المخزون
                </p>
            </div>

            {/* الخطأ */}
            {error && (
                <div
                    style={{
                        background: "#f8d7da",
                        color: "#842029",
                        padding: "15px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    {error}
                </div>
            )}

            {/* الإحصائيات */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(200px,1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                <StatCard
                    icon="📦"
                    title="عدد المنتجات"
                    value={totalProducts}
                    color="#0B5D3F"
                />

                <StatCard
                    icon="📊"
                    title="إجمالي الكمية"
                    value={totalQuantity}
                    color="#0d6efd"
                />

                <StatCard
                    icon="⚠️"
                    title="مخزون منخفض"
                    value={lowStock}
                    color="#dc3545"
                />

                <StatCard
                    icon="🚫"
                    title="منتجات نافدة"
                    value={outOfStock}
                    color="#842029"
                />
            </div>

            {/* البحث */}
            <div
                style={{
                    background: "#fff",
                    padding: "18px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 2px 10px rgba(0,0,0,.08)",
                    marginBottom: "20px",
                }}
            >
                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="🔎 ابحث باسم المنتج أو الوزن..."
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px 15px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "16px",
                        outline: "none",
                    }}
                />
            </div>

            {/* الجدول */}
            {loading ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "50px",
                        borderRadius: "12px",
                        textAlign: "center",
                        color: "#777",
                    }}
                >
                    ⏳ جاري تحميل المخزون...
                </div>
            ) : (
                <div
                    style={{
                        width: "100%",
                        overflowX: "auto",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow:
                            "0 3px 15px rgba(0,0,0,.1)",
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
                                background: "#0B5D3F",
                                color: "#fff",
                            }}
                        >
                            <tr>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>
                                    المنتج
                                </th>
                                <th style={thStyle}>
                                    الوزن
                                </th>
                                <th style={thStyle}>
                                    السعر
                                </th>
                                <th style={thStyle}>
                                    الكمية
                                </th>
                                <th style={thStyle}>
                                    الحالة
                                </th>
                                <th style={thStyle}>
                                    حركة المخزون
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(
                                    (product) => {
                                        const quantity =
                                            Number(
                                                product.stockQuantity ||
                                                0
                                            );

                                        const isOut =
                                            quantity <= 0;

                                        const isLow =
                                            quantity > 0 &&
                                            quantity <= 15;

                                        return (
                                            <tr
                                                key={
                                                    product.productID
                                                }
                                            >
                                                <td style={tdStyle}>
                                                    {
                                                        product.productID
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight:
                                                            "bold",
                                                    }}
                                                >
                                                    {
                                                        product.productName
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    {product.weight ||
                                                        "-"}
                                                </td>

                                                <td style={tdStyle}>
                                                    {Number(
                                                        product.price ||
                                                        0
                                                    ).toLocaleString(
                                                        "ar-EG"
                                                    )}{" "}
                                                    ج.م
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontSize:
                                                            "20px",
                                                        fontWeight:
                                                            "bold",
                                                        color:
                                                            isOut
                                                                ? "#dc3545"
                                                                : isLow
                                                                    ? "#fd7e14"
                                                                    : "#198754",
                                                    }}
                                                >
                                                    {quantity}
                                                </td>

                                                <td style={tdStyle}>
                                                    <span
                                                        style={{
                                                            padding:
                                                                "6px 12px",
                                                            borderRadius:
                                                                "20px",
                                                            fontWeight:
                                                                "bold",
                                                            background:
                                                                isOut
                                                                    ? "#f8d7da"
                                                                    : isLow
                                                                        ? "#fff3cd"
                                                                        : "#d1e7dd",
                                                            color:
                                                                isOut
                                                                    ? "#842029"
                                                                    : isLow
                                                                        ? "#856404"
                                                                        : "#0f5132",
                                                        }}
                                                    >
                                                        {isOut
                                                            ? "🚫 نافد"
                                                            : isLow
                                                                ? "⚠️ منخفض"
                                                                : "✅ متوفر"}
                                                    </span>
                                                </td>

                                                <td style={tdStyle}>
                                                    <button
                                                        onClick={() =>
                                                            increaseStock(
                                                                product.productID
                                                            )
                                                        }
                                                        style={{
                                                            ...actionButton,
                                                            background:
                                                                "#198754",
                                                        }}
                                                    >
                                                        ➕ زيادة
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            decreaseStock(
                                                                product.productID
                                                            )
                                                        }
                                                        style={{
                                                            ...actionButton,
                                                            background:
                                                                "#dc3545",
                                                        }}
                                                    >
                                                        ➖ خصم
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding: "40px",
                                            color: "#777",
                                        }}
                                    >
                                        لا توجد منتجات
                                        مطابقة للبحث 🔍
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function StatCard({
    icon,
    title,
    value,
    color,
}) {
    return (
        <div
            style={{
                background: "#fff",
                padding: "22px",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow:
                    "0 3px 15px rgba(0,0,0,.08)",
            }}
        >
            <div
                style={{
                    fontSize: "38px",
                    marginBottom: "8px",
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "16px",
                }}
            >
                {title}
            </h3>

            <strong
                style={{
                    fontSize: "28px",
                    color,
                }}
            >
                {value}
            </strong>
        </div>
    );
}

const thStyle = {
    padding: "14px 10px",
    textAlign: "center",
    fontWeight: "bold",
};

const tdStyle = {
    padding: "14px 10px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
};

const actionButton = {
    border: "none",
    color: "#fff",
    padding: "9px 13px",
    borderRadius: "7px",
    cursor: "pointer",
    margin: "3px",
    fontSize: "14px",
    fontWeight: "bold",
};

export default Inventory;
