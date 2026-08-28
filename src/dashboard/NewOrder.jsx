import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5233/api";

function NewOrder({ onBack }) {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [customerID, setCustomerID] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");

    const [productID, setProductID] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unitPrice, setUnitPrice] = useState("");

    const [orderDetails, setOrderDetails] = useState([]);

    const [status, setStatus] = useState("جديد");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // تحميل العملاء والمنتجات
    // =====================================================

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoadingData(true);
            setError("");

            const [customersResponse, productsResponse] =
                await Promise.all([
                    fetch(`${API_BASE}/Customers`),
                    fetch(`${API_BASE}/Products`),
                ]);

            if (!customersResponse.ok) {
                throw new Error(
                    "فشل تحميل العملاء"
                );
            }

            if (!productsResponse.ok) {
                throw new Error(
                    "فشل تحميل المنتجات"
                );
            }

            const customersData =
                await customersResponse.json();

            const productsData =
                await productsResponse.json();

            setCustomers(customersData);
            setProducts(productsData);
        } catch (err) {
            console.error(err);

            setError(
                "حدث خطأ أثناء تحميل العملاء أو المنتجات"
            );
        } finally {
            setLoadingData(false);
        }
    };

    // =====================================================
    // العملاء بعد البحث
    // =====================================================

    const filteredCustomers = customers.filter(
        (customer) =>
            String(
                customer.customerName || ""
            )
                .toLowerCase()
                .includes(
                    customerSearch.toLowerCase()
                ) ||
            String(
                customer.phone || ""
            ).includes(customerSearch)
    );

    // =====================================================
    // عند اختيار منتج
    // =====================================================

    const handleProductChange = (e) => {
        const id = e.target.value;

        setProductID(id);

        if (!id) {
            setUnitPrice("");
            return;
        }

        const product = products.find(
            (p) =>
                String(p.productID) === String(id)
        );

        if (product) {
            setUnitPrice(
                product.price ?? ""
            );
        }
    };

    // =====================================================
    // إضافة صنف
    // =====================================================

    const addProduct = () => {
        setError("");

        if (!productID) {
            setError(
                "من فضلك اختر المنتج"
            );
            return;
        }

        if (
            !quantity ||
            Number(quantity) <= 0
        ) {
            setError(
                "من فضلك أدخل كمية صحيحة"
            );
            return;
        }

        if (
            unitPrice === "" ||
            Number(unitPrice) < 0
        ) {
            setError(
                "من فضلك أدخل سعر الوحدة"
            );
            return;
        }

        const product = products.find(
            (p) =>
                String(p.productID) ===
                String(productID)
        );

        if (!product) {
            setError(
                "المنتج غير موجود"
            );
            return;
        }

        const existingIndex =
            orderDetails.findIndex(
                (detail) =>
                    detail.productID ===
                    Number(productID)
            );

        const total =
            Number(quantity) *
            Number(unitPrice);

        if (existingIndex !== -1) {
            const updatedDetails = [
                ...orderDetails,
            ];

            updatedDetails[
                existingIndex
            ] = {
                ...updatedDetails[
                existingIndex
                ],
                quantity:
                    Number(quantity),
                unitPrice:
                    Number(unitPrice),
                total,
            };

            setOrderDetails(
                updatedDetails
            );
        } else {
            setOrderDetails([
                ...orderDetails,
                {
                    productID:
                        Number(productID),

                    productName:
                        product.productName ||
                        product.name ||
                        `منتج رقم ${productID}`,

                    quantity:
                        Number(quantity),

                    unitPrice:
                        Number(unitPrice),

                    total,
                },
            ]);
        }

        setProductID("");
        setQuantity("");
        setUnitPrice("");
    };

    // =====================================================
    // حذف صنف
    // =====================================================

    const removeProduct = (index) => {
        const updatedDetails =
            orderDetails.filter(
                (_, i) => i !== index
            );

        setOrderDetails(
            updatedDetails
        );
    };

    // =====================================================
    // تعديل الكمية
    // =====================================================

    const updateQuantity = (
        index,
        value
    ) => {
        const newQuantity =
            Number(value);

        if (
            !value ||
            newQuantity <= 0
        ) {
            return;
        }

        const updatedDetails =
            [...orderDetails];

        updatedDetails[index] = {
            ...updatedDetails[index],

            quantity:
                newQuantity,

            total:
                newQuantity *
                Number(
                    updatedDetails[
                        index
                    ].unitPrice
                ),
        };

        setOrderDetails(
            updatedDetails
        );
    };

    // =====================================================
    // إجمالي الطلب
    // =====================================================

    const totalAmount =
        orderDetails.reduce(
            (sum, detail) =>
                sum +
                Number(
                    detail.total || 0
                ),
            0
        );

    // =====================================================
    // حفظ الطلب
    // =====================================================

    const saveOrder = async () => {
        setError("");

        if (
            !orderDetails.length
        ) {
            setError(
                "يجب إضافة صنف واحد على الأقل للطلب"
            );
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                customerID:
                    customerID
                        ? Number(
                            customerID
                        )
                        : null,

                orderDate:
                    new Date().toISOString(),

                totalAmount:
                    totalAmount,

                status:
                    status,

                notes:
                    notes || null,

                orderDetails:
                    orderDetails.map(
                        (detail) => ({
                            productID:
                                detail.productID,

                            quantity:
                                Number(
                                    detail.quantity
                                ),

                            unitPrice:
                                Number(
                                    detail.unitPrice
                                ),

                            total:
                                Number(
                                    detail.total
                                ),
                        })
                    ),
            };

            const response =
                await fetch(
                    `${API_BASE}/Orders`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            orderData
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "فشل حفظ الطلب"
                );
            }

            alert(
                `تم حفظ الطلب بنجاح\nرقم الطلب: #${data.orderID}`
            );

            onBack();
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "حدث خطأ أثناء حفظ الطلب"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // التحميل
    // =====================================================

    if (loadingData) {
        return (
            <div
                dir="rtl"
                style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#777",
                }}
            >
                ⏳ جاري تحميل البيانات...
            </div>
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
                boxSizing: "border-box",
            }}
        >
            {/* =====================================================
                العنوان
            ===================================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
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
                            color: "#0B5D3F",
                            fontSize: "28px",
                        }}
                    >
                        📋 إنشاء طلب جديد
                    </h2>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#777",
                        }}
                    >
                        إنشاء طلب جديد للعميل
                    </p>
                </div>

                <button
                    onClick={onBack}
                    style={backButton}
                >
                    ↩️ رجوع
                </button>
            </div>

            {/* =====================================================
                الخطأ
            ===================================================== */}

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

            {/* =====================================================
                بيانات الطلب
            ===================================================== */}

            <div
                style={cardStyle}
            >
                <h3
                    style={sectionTitle}
                >
                    👤 بيانات الطلب
                </h3>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "18px",
                    }}
                >
                    {/* العميل */}

                    <div>
                        <label
                            style={labelStyle}
                        >
                            العميل
                        </label>

                        <input
                            type="text"
                            placeholder="🔎 ابحث عن العميل..."
                            value={
                                customerSearch
                            }
                            onChange={(e) =>
                                setCustomerSearch(
                                    e.target
                                        .value
                                )
                            }
                            style={
                                inputStyle
                            }
                        />

                        <select
                            value={
                                customerID
                            }
                            onChange={(e) =>
                                setCustomerID(
                                    e.target
                                        .value
                                )
                            }
                            style={{
                                ...inputStyle,
                                marginTop:
                                    "8px",
                            }}
                        >
                            <option value="">
                                بدون عميل
                            </option>

                            {filteredCustomers.map(
                                (
                                    customer
                                ) => (
                                    <option
                                        key={
                                            customer.customerID
                                        }
                                        value={
                                            customer.customerID
                                        }
                                    >
                                        {
                                            customer.customerName
                                        }
                                        {customer.phone
                                            ? ` - ${customer.phone}`
                                            : ""}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* الحالة */}

                    <div>
                        <label
                            style={labelStyle}
                        >
                            حالة الطلب
                        </label>

                        <select
                            value={
                                status
                            }
                            onChange={(e) =>
                                setStatus(
                                    e.target
                                        .value
                                )
                            }
                            style={
                                inputStyle
                            }
                        >
                            <option value="جديد">
                                جديد
                            </option>

                            <option value="قيد التجهيز">
                                قيد التجهيز
                            </option>

                            <option value="تم الشحن">
                                تم الشحن
                            </option>

                            <option value="مكتمل">
                                مكتمل
                            </option>

                            <option value="ملغي">
                                ملغي
                            </option>
                        </select>
                    </div>
                </div>

                {/* الملاحظات */}

                <div
                    style={{
                        marginTop: "18px",
                    }}
                >
                    <label
                        style={labelStyle}
                    >
                        الملاحظات
                    </label>

                    <textarea
                        value={notes}
                        onChange={(e) =>
                            setNotes(
                                e.target.value
                            )
                        }
                        placeholder="اكتب ملاحظات الطلب..."
                        rows="3"
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                        }}
                    />
                </div>
            </div>

            {/* =====================================================
                إضافة منتج
            ===================================================== */}

            <div
                style={cardStyle}
            >
                <h3
                    style={sectionTitle}
                >
                    📦 إضافة المنتجات
                </h3>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "2fr 1fr 1fr auto",
                        gap: "12px",
                        alignItems:
                            "end",
                    }}
                >
                    {/* المنتج */}

                    <div>
                        <label
                            style={labelStyle}
                        >
                            المنتج
                        </label>

                        <select
                            value={
                                productID
                            }
                            onChange={
                                handleProductChange
                            }
                            style={
                                inputStyle
                            }
                        >
                            <option value="">
                                اختر المنتج
                            </option>

                            {products.map(
                                (
                                    product
                                ) => (
                                    <option
                                        key={
                                            product.productID
                                        }
                                        value={
                                            product.productID
                                        }
                                    >
                                        {
                                            product.productName
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* الكمية */}

                    <div>
                        <label
                            style={labelStyle}
                        >
                            الكمية
                        </label>

                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={
                                quantity
                            }
                            onChange={(e) =>
                                setQuantity(
                                    e.target
                                        .value
                                )
                            }
                            placeholder="الكمية"
                            style={
                                inputStyle
                            }
                        />
                    </div>

                    {/* السعر */}

                    <div>
                        <label
                            style={labelStyle}
                        >
                            سعر الوحدة
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                unitPrice
                            }
                            onChange={(e) =>
                                setUnitPrice(
                                    e.target
                                        .value
                                )
                            }
                            placeholder="السعر"
                            style={
                                inputStyle
                            }
                        />
                    </div>

                    {/* إضافة */}

                    <button
                        onClick={
                            addProduct
                        }
                        style={
                            addButton
                        }
                    >
                        ➕ إضافة
                    </button>
                </div>
            </div>

            {/* =====================================================
                جدول المنتجات
            ===================================================== */}

            <div
                style={cardStyle}
            >
                <h3
                    style={sectionTitle}
                >
                    🛒 أصناف الطلب
                </h3>

                <div
                    style={{
                        overflowX:
                            "auto",
                    }}
                >
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
                                    #
                                </th>

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

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    حذف
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orderDetails.length >
                                0 ? (
                                orderDetails.map(
                                    (
                                        detail,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                index
                                            }
                                        >
                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {index +
                                                    1}
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                {
                                                    detail.productName
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                <input
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    value={
                                                        detail.quantity
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateQuantity(
                                                            index,
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    style={{
                                                        width:
                                                            "90px",
                                                        padding:
                                                            "7px",
                                                        textAlign:
                                                            "center",
                                                        border:
                                                            "1px solid #ddd",
                                                        borderRadius:
                                                            "6px",
                                                    }}
                                                />
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {Number(
                                                    detail.unitPrice
                                                ).toLocaleString()}{" "}
                                                ج.م
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
                                                {Number(
                                                    detail.total
                                                ).toLocaleString()}{" "}
                                                ج.م
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                <button
                                                    onClick={() =>
                                                        removeProduct(
                                                            index
                                                        )
                                                    }
                                                    style={
                                                        deleteButton
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
                                        لم يتم إضافة أي
                                        منتجات للطلب
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* الإجمالي */}

                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "flex-end",
                        marginTop:
                            "25px",
                    }}
                >
                    <div
                        style={{
                            width:
                                "100%",
                            maxWidth:
                                "350px",
                            background:
                                "#f8f9fa",
                            padding:
                                "20px",
                            borderRadius:
                                "10px",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                fontSize:
                                    "20px",
                                color:
                                    "#0B5D3F",
                            }}
                        >
                            <strong>
                                إجمالي الطلب:
                            </strong>

                            <strong>
                                {totalAmount.toLocaleString()}{" "}
                                ج.م
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                الأزرار
            ===================================================== */}

            <div
                style={{
                    display:
                        "flex",
                    justifyContent:
                        "flex-end",
                    gap: "12px",
                    marginTop:
                        "20px",
                }}
            >
                <button
                    onClick={onBack}
                    style={
                        cancelButton
                    }
                >
                    ❌ إلغاء
                </button>

                <button
                    onClick={
                        saveOrder
                    }
                    disabled={loading}
                    style={{
                        ...saveButton,
                        opacity:
                            loading
                                ? 0.7
                                : 1,
                    }}
                >
                    {loading
                        ? "⏳ جاري الحفظ..."
                        : "💾 حفظ الطلب"}
                </button>
            </div>
        </div>
    );
}

// =====================================================
// Styles
// =====================================================

const cardStyle = {
    background: "#fff",
    padding: "22px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow:
        "0 2px 8px rgba(0,0,0,.08)",
};

const sectionTitle = {
    marginTop: 0,
    marginBottom: "18px",
    color: "#0B5D3F",
};

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: "bold",
    color: "#444",
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
};

const thStyle = {
    padding: "13px 10px",
    textAlign: "center",
};

const tdStyle = {
    padding: "13px 10px",
    textAlign: "center",
    borderBottom:
        "1px solid #eee",
};

const backButton = {
    padding: "11px 20px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
};

const addButton = {
    padding: "11px 18px",
    background: "#198754",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
};

const saveButton = {
    padding: "12px 25px",
    background: "#0B5D3F",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
};

const cancelButton = {
    padding: "12px 25px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
};

const deleteButton = {
    border: "none",
    background: "#f8d7da",
    color: "#842029",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
};

export default NewOrder;