import { useEffect, useState } from "react";

import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from "./api.js";

function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    // المنتج الذي يتم تعديله
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        productName: "",
        weight: "",
        price: "",
        stockQuantity: "",
        isActive: true,
        description: "",
        imageUrl: "",
    });

    // ==========================================
    // جلب المنتجات
    // ==========================================
    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(API_ENDPOINTS.PRODUCTS);

            if (!response.ok) {
                throw new Error("فشل الاتصال بالـ API");
            }

            const data = await response.json();

            setProducts(data);
        } catch (err) {
            console.error(err);

            setError(
                "حدث خطأ أثناء تحميل المنتجات من قاعدة البيانات"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // ==========================================
    // تغيير بيانات الفورم
    // ==========================================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ==========================================
    // فتح فورم الإضافة
    // ==========================================
    const openAddForm = () => {
        setEditingId(null);

        setFormData({
            productName: "",
            weight: "",
            price: "",
            stockQuantity: "",
            isActive: true,
            description: "",
            imageUrl: "",
        });

        setShowForm(true);
    };

    // ==========================================
    // فتح فورم التعديل
    // ==========================================
    const openEditForm = (product) => {
        setEditingId(product.productID);

        setFormData({
            productName: product.productName || "",
            weight: product.weight || "",
            price: product.price ?? "",
            stockQuantity: product.stockQuantity ?? "",
            isActive: product.isActive ?? true,
            description: product.description || "",
            imageUrl: product.imageUrl || "",
        });

        setShowForm(true);
    };

    // ==========================================
    // إغلاق الفورم
    // ==========================================
    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingId(null);

        setFormData({
            productName: "",
            weight: "",
            price: "",
            stockQuantity: "",
            isActive: true,
            description: "",
            imageUrl: "",
        });
    };

    // ==========================================
    // حفظ المنتج
    // إضافة أو تعديل
    // ==========================================
    const saveProduct = async (e) => {
        e.preventDefault();

        // التحقق
        if (!formData.productName.trim()) {
            alert("من فضلك اكتب اسم المنتج");
            return;
        }

        if (!formData.weight.trim()) {
            alert("من فضلك اكتب الوزن");
            return;
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            alert("من فضلك أدخل سعر صحيح");
            return;
        }

        if (
            formData.stockQuantity === "" ||
            Number(formData.stockQuantity) < 0
        ) {
            alert("من فضلك أدخل كمية صحيحة");
            return;
        }

        try {
            setSaving(true);

            const productData = {
                productID: editingId || 0,
                productName: formData.productName.trim(),
                weight: formData.weight.trim(),
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity),
                isActive: formData.isActive,
                description:
                    formData.description.trim() || null,
                imageUrl:
                    formData.imageUrl.trim() || null,
            };

            // ======================================
            // تعديل
            // ======================================
            if (editingId !== null) {
                const response = await apiPut(`${API_ENDPOINTS.PRODUCTS}/${editingId}`, productData);

                if (!response.ok) {
                    const errorText =
                        await response.text();

                    console.error(
                        "Update Error:",
                        response.status,
                        errorText
                    );

                    throw new Error(
                        "فشل تعديل المنتج"
                    );
                }

                alert("✅ تم تعديل المنتج بنجاح");
            }

            // ======================================
            // إضافة
            // ======================================
            else {
                const response = await apiPost(`${API_ENDPOINTS.PRODUCTS}`, productData);

                if (!response.ok) {
                    const errorText =
                        await response.text();

                    console.error(
                        "Add Error:",
                        response.status,
                        errorText
                    );

                    throw new Error(
                        "فشل إضافة المنتج"
                    );
                }

                alert("✅ تم إضافة المنتج بنجاح");
            }

            // إعادة تحميل البيانات
            await loadProducts();

            // إغلاق الفورم
            closeForm();
        } catch (err) {
            console.error(err);

            alert(
                editingId !== null
                    ? "❌ حدث خطأ أثناء تعديل المنتج"
                    : "❌ حدث خطأ أثناء إضافة المنتج"
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // حذف المنتج
    // ==========================================
    const deleteProduct = async (id) => {
        const product = products.find(
            (item) => item.productID === id
        );

        const confirmDelete = window.confirm(
            `هل أنت متأكد من حذف المنتج؟\n\n${product?.productName || ""
            }`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await apiDelete(`${API_ENDPOINTS.PRODUCTS}/${id}`);

            if (!response.ok) {
                throw new Error("فشل حذف المنتج");
            }

            await loadProducts();

            alert("✅ تم حذف المنتج بنجاح");
        } catch (err) {
            console.error(err);

            alert("❌ حدث خطأ أثناء حذف المنتج");
        }
    };

    // ==========================================
    // البحث
    // ==========================================
    const filteredProducts = products.filter(
        (product) => {
            const searchText =
                search.toLowerCase();

            return (
                (product.productName || "")
                    .toLowerCase()
                    .includes(searchText) ||
                (product.weight || "")
                    .toLowerCase()
                    .includes(searchText)
            );
        }
    );

    // ==========================================
    // الإحصائيات
    // ==========================================
    const availableProducts =
        products.filter(
            (product) => product.isActive
        );

    const unavailableProducts =
        products.filter(
            (product) => !product.isActive
        );

    // ==========================================
    // الواجهة
    // ==========================================
    return (
        <div
            dir="rtl"
            style={{
                padding: "25px",
                background: "#f5f7f9",
                minHeight: "100vh",
            }}
        >
            {/* ==================================
                العنوان
            ================================== */}
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                    flexWrap: "wrap",
                    gap: "15px",
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
                        🧂 إدارة المنتجات
                    </h2>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#777",
                        }}
                    >
                        إدارة منتجات الشركة والأسعار وحالة
                        التوفر
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
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
                    ➕ إضافة منتج
                </button>
            </div>

            {/* ==================================
                رسالة الخطأ
            ================================== */}
            {error && (
                <div
                    style={{
                        background: "#f8d7da",
                        color: "#842029",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        border:
                            "1px solid #f1aeb5",
                    }}
                >
                    {error}

                    <button
                        type="button"
                        onClick={loadProducts}
                        style={{
                            marginRight: "15px",
                            border: "none",
                            background: "#842029",
                            color: "#fff",
                            padding: "7px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        إعادة المحاولة
                    </button>
                </div>
            )}

            {/* ==================================
                فورم الإضافة / التعديل
            ================================== */}
            {showForm && (
                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "12px",
                        marginBottom: "25px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,.10)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                color: "#12372A",
                            }}
                        >
                            {editingId !== null
                                ? "✏️ تعديل المنتج"
                                : "➕ إضافة منتج جديد"}
                        </h3>

                        <button
                            type="button"
                            onClick={closeForm}
                            style={{
                                border: "none",
                                background: "#f8d7da",
                                color: "#842029",
                                width: "35px",
                                height: "35px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                fontSize: "18px",
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={saveProduct}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "18px",
                            }}
                        >
                            {/* اسم المنتج */}
                            <div>
                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    اسم المنتج *
                                </label>

                                <input
                                    type="text"
                                    name="productName"
                                    value={
                                        formData.productName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="مثال: ملح نقاء 50 كيلو"
                                    style={
                                        inputStyle
                                    }
                                />
                            </div>

                            {/* الوزن */}
                            <div>
                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    الوزن *
                                </label>

                                <input
                                    type="text"
                                    name="weight"
                                    value={
                                        formData.weight
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="مثال: 50 كيلو"
                                    style={
                                        inputStyle
                                    }
                                />
                            </div>

                            {/* السعر */}
                            <div>
                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    السعر *
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    style={
                                        inputStyle
                                    }
                                />
                            </div>

                            {/* المخزون */}
                            <div>
                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    الكمية في المخزون *
                                </label>

                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={
                                        formData.stockQuantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    style={
                                        inputStyle
                                    }
                                />
                            </div>
                        </div>

                        {/* الوصف */}
                        <div
                            style={{
                                marginTop: "18px",
                            }}
                        >
                            <label
                                style={labelStyle}
                            >
                                وصف المنتج
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="اكتب وصف المنتج..."
                                rows="4"
                                style={{
                                    ...inputStyle,
                                    resize: "vertical",
                                }}
                            />
                        </div>

                        {/* الصورة */}
                        <div
                            style={{
                                marginTop: "18px",
                            }}
                        >
                            <label
                                style={labelStyle}
                            >
                                رابط صورة المنتج
                            </label>

                            <input
                                type="text"
                                name="imageUrl"
                                value={
                                    formData.imageUrl
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="/factory.jpg"
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        {/* الحالة */}
                        <div
                            style={{
                                marginTop: "18px",
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: "10px",
                            }}
                        >
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={
                                    formData.isActive
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    cursor: "pointer",
                                }}
                            />

                            <label
                                htmlFor="isActive"
                                style={{
                                    cursor:
                                        "pointer",
                                    fontWeight:
                                        "bold",
                                    color: "#333",
                                }}
                            >
                                المنتج متوفر
                            </label>
                        </div>

                        {/* الأزرار */}
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "25px",
                            }}
                        >
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding:
                                        "12px 25px",
                                    background:
                                        saving
                                            ? "#999"
                                            : "#198754",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius:
                                        "8px",
                                    cursor:
                                        saving
                                            ? "not-allowed"
                                            : "pointer",
                                    fontSize: "15px",
                                    fontWeight:
                                        "bold",
                                }}
                            >
                                {saving
                                    ? "⏳ جاري الحفظ..."
                                    : editingId !==
                                        null
                                        ? "💾 حفظ التعديل"
                                        : "💾 حفظ المنتج"}
                            </button>

                            <button
                                type="button"
                                onClick={
                                    closeForm
                                }
                                disabled={saving}
                                style={{
                                    padding:
                                        "12px 25px",
                                    background:
                                        "#6c757d",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius:
                                        "8px",
                                    cursor:
                                        "pointer",
                                    fontSize: "15px",
                                    fontWeight:
                                        "bold",
                                }}
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ==================================
                تحميل
            ================================== */}
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
                    <div
                        style={{
                            fontSize: "35px",
                        }}
                    >
                        ⏳
                    </div>

                    <div
                        style={{
                            color: "#777",
                            fontSize: "18px",
                        }}
                    >
                        جاري تحميل المنتجات...
                    </div>
                </div>
            ) : (
                <>
                    {/* ==================================
                        الإحصائيات
                    ================================== */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "18px",
                            marginBottom: "25px",
                        }}
                    >
                        <StatCard
                            title="📦 إجمالي المنتجات"
                            value={
                                products.length
                            }
                            color="#198754"
                        />

                        <StatCard
                            title="✅ المنتجات المتوفرة"
                            value={
                                availableProducts.length
                            }
                            color="#198754"
                        />

                        <StatCard
                            title="⚠️ منتجات غير متوفرة"
                            value={
                                unavailableProducts.length
                            }
                            color="#dc3545"
                        />
                    </div>

                    {/* ==================================
                        البحث
                    ================================== */}
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
                            placeholder="🔎 ابحث باسم المنتج أو الوزن..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                padding:
                                    "12px 15px",
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "8px",
                                outline: "none",
                                fontSize: "15px",
                            }}
                        />
                    </div>

                    {/* ==================================
                        الجدول
                    ================================== */}
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
                                minWidth: "850px",
                                borderCollapse:
                                    "collapse",
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
                                        #
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        اسم المنتج
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
                                        السعر
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        المخزون
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        الحالة
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.length >
                                    0 ? (
                                    filteredProducts.map(
                                        (product) => (
                                            <tr
                                                key={
                                                    product.productID
                                                }
                                            >
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
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

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {product.weight ||
                                                        "-"}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {Number(
                                                        product.price
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {Number(
                                                        product.stockQuantity
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <span
                                                        style={{
                                                            background:
                                                                product.isActive
                                                                    ? "#d1e7dd"
                                                                    : "#f8d7da",
                                                            color:
                                                                product.isActive
                                                                    ? "#0f5132"
                                                                    : "#842029",
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
                                                        {product.isActive
                                                            ? "متوفر"
                                                            : "غير متوفر"}
                                                    </span>
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        style={
                                                            editButton
                                                        }
                                                        onClick={() =>
                                                            openEditForm(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        ✏️ تعديل
                                                    </button>

                                                    <button
                                                        type="button"
                                                        style={
                                                            deleteButton
                                                        }
                                                        onClick={() =>
                                                            deleteProduct(
                                                                product.productID
                                                            )
                                                        }
                                                    >
                                                        🗑️ حذف
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "35px",
                                                color:
                                                    "#777",
                                            }}
                                        >
                                            {search
                                                ? "لا توجد منتجات مطابقة للبحث 🔍"
                                                : "لا توجد منتجات في قاعدة البيانات"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

// ==========================================
// كارت الإحصائيات
// ==========================================
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

// ==========================================
// Styles
// ==========================================
const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#333",
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
    fontFamily: "inherit",
};

const thStyle = {
    padding: "14px 12px",
    textAlign: "center",
    fontWeight: "bold",
};

const tdStyle = {
    padding: "14px 12px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
};

const editButton = {
    border: "none",
    background: "#fff3cd",
    color: "#856404",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "6px",
};

const deleteButton = {
    border: "none",
    background: "#f8d7da",
    color: "#842029",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
};

export default Products;
