import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from "./api.js";

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        email: "",
        address: "",
        isActive: true,
    });

    // ==========================================
    // جلب العملاء من قاعدة البيانات
    // ==========================================
    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(API_ENDPOINTS.CUSTOMERS);

            if (!response.ok) {
                throw new Error("فشل تحميل العملاء");
            }

            const data = await response.json();

            setCustomers(data);
        } catch (err) {
            console.error(err);
            setError(
                "حدث خطأ أثناء تحميل العملاء من قاعدة البيانات"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
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
            customerName: "",
            phone: "",
            email: "",
            address: "",
            isActive: true,
        });

        setShowForm(true);
    };

    // ==========================================
    // فتح فورم التعديل
    // ==========================================
    const openEditForm = (customer) => {
        setEditingId(customer.customerID);

        setFormData({
            customerName: customer.customerName || "",
            phone: customer.phone || "",
            email: customer.email || "",
            address: customer.address || "",
            isActive: customer.isActive ?? true,
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
            customerName: "",
            phone: "",
            email: "",
            address: "",
            isActive: true,
        });
    };

    // ==========================================
    // حفظ العميل
    // إضافة أو تعديل
    // ==========================================
    const saveCustomer = async (e) => {
        e.preventDefault();

        if (!formData.customerName.trim()) {
            alert("من فضلك اكتب اسم العميل");
            return;
        }

        try {
            setSaving(true);

            const customerData = {
                customerID: editingId || 0,
                customerName: formData.customerName.trim(),
                phone: formData.phone.trim() || null,
                email: formData.email.trim() || null,
                address: formData.address.trim() || null,
                isActive: formData.isActive,
            };

            // ======================================
            // تعديل
            // ======================================
            if (editingId !== null) {
                const response = await apiPut(`${API_ENDPOINTS.CUSTOMERS}/${editingId}`, customerData);

                if (!response.ok) {
                    const errorText = await response.text();

                    console.error(
                        "Update Customer Error:",
                        response.status,
                        errorText
                    );

                    throw new Error("فشل تعديل العميل");
                }

                alert("✅ تم تعديل بيانات العميل بنجاح");
            }

            // ======================================
            // إضافة
            // ======================================
            else {
                const response = await apiPost(`${API_ENDPOINTS.CUSTOMERS}`, customerData);

                if (!response.ok) {
                    const errorText = await response.text();

                    console.error(
                        "Add Customer Error:",
                        response.status,
                        errorText
                    );

                    throw new Error("فشل إضافة العميل");
                }

                alert("✅ تم إضافة العميل بنجاح");
            }

            await loadCustomers();

            closeForm();
        } catch (err) {
            console.error(err);

            alert(
                editingId !== null
                    ? "❌ حدث خطأ أثناء تعديل العميل"
                    : "❌ حدث خطأ أثناء إضافة العميل"
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // حذف العميل
    // ==========================================
    const deleteCustomer = async (id) => {
        const customer = customers.find(
            (item) => item.customerID === id
        );

        const confirmDelete = window.confirm(
            `هل أنت متأكد من حذف هذا العميل؟\n\n${customer?.customerName || ""
            }`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await apiDelete(`${API_ENDPOINTS.CUSTOMERS}/${id}`);

            if (!response.ok) {
                throw new Error("فشل حذف العميل");
            }

            await loadCustomers();

            alert("✅ تم حذف العميل بنجاح");
        } catch (err) {
            console.error(err);

            alert("❌ حدث خطأ أثناء حذف العميل");
        }
    };

    // ==========================================
    // عرض بيانات العميل
    // ==========================================
    const viewCustomer = (customer) => {
        alert(
            `بيانات العميل\n\n` +
            `الاسم: ${customer.customerName}\n` +
            `الهاتف: ${customer.phone || "-"}\n` +
            `البريد الإلكتروني: ${customer.email || "-"
            }\n` +
            `العنوان: ${customer.address || "-"}\n` +
            `الحالة: ${customer.isActive
                ? "نشط"
                : "غير نشط"
            }`
        );
    };

    // ==========================================
    // البحث
    // ==========================================
    const filteredCustomers = customers.filter(
        (customer) => {
            const searchText =
                search.toLowerCase();

            return (
                (customer.customerName || "")
                    .toLowerCase()
                    .includes(searchText) ||
                (customer.phone || "")
                    .toLowerCase()
                    .includes(searchText) ||
                (customer.address || "")
                    .toLowerCase()
                    .includes(searchText) ||
                (customer.email || "")
                    .toLowerCase()
                    .includes(searchText)
            );
        }
    );

    // ==========================================
    // الإحصائيات
    // ==========================================
    const activeCustomers = customers.filter(
        (customer) => customer.isActive
    );

    const inactiveCustomers = customers.filter(
        (customer) => !customer.isActive
    );

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
                        👥 إدارة العملاء
                    </h2>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#777",
                        }}
                    >
                        إدارة بيانات العملاء ومتابعة الحسابات
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
                    ➕ إضافة عميل
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
                    }}
                >
                    {error}

                    <button
                        type="button"
                        onClick={loadCustomers}
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
                فورم الإضافة والتعديل
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
                            justifyContent: "space-between",
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
                                ? "✏️ تعديل بيانات العميل"
                                : "➕ إضافة عميل جديد"}
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

                    <form onSubmit={saveCustomer}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "18px",
                            }}
                        >
                            {/* اسم العميل */}
                            <div>
                                <label
                                    style={labelStyle}
                                >
                                    اسم العميل *
                                </label>

                                <input
                                    type="text"
                                    name="customerName"
                                    value={
                                        formData.customerName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="اسم العميل أو الشركة"
                                    style={inputStyle}
                                />
                            </div>

                            {/* الهاتف */}
                            <div>
                                <label
                                    style={labelStyle}
                                >
                                    رقم الهاتف
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="01012345678"
                                    style={inputStyle}
                                />
                            </div>

                            {/* البريد */}
                            <div>
                                <label
                                    style={labelStyle}
                                >
                                    البريد الإلكتروني
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="example@email.com"
                                    style={inputStyle}
                                />
                            </div>

                            {/* العنوان */}
                            <div>
                                <label
                                    style={labelStyle}
                                >
                                    العنوان
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="عنوان العميل"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* الحالة */}
                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <input
                                type="checkbox"
                                id="customerIsActive"
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
                                htmlFor="customerIsActive"
                                style={{
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                العميل نشط
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
                                    padding: "12px 25px",
                                    background: saving
                                        ? "#999"
                                        : "#198754",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: saving
                                        ? "not-allowed"
                                        : "pointer",
                                    fontSize: "15px",
                                    fontWeight: "bold",
                                }}
                            >
                                {saving
                                    ? "⏳ جاري الحفظ..."
                                    : editingId !== null
                                        ? "💾 حفظ التعديل"
                                        : "💾 حفظ العميل"}
                            </button>

                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                style={{
                                    padding: "12px 25px",
                                    background: "#6c757d",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "15px",
                                    fontWeight: "bold",
                                }}
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ==================================
                التحميل
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
                            marginTop: "10px",
                        }}
                    >
                        جاري تحميل العملاء...
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
                            title="👥 إجمالي العملاء"
                            value={customers.length}
                            color="#198754"
                        />

                        <StatCard
                            title="✅ العملاء النشطون"
                            value={
                                activeCustomers.length
                            }
                            color="#0d6efd"
                        />

                        <StatCard
                            title="⚠️ العملاء غير النشطين"
                            value={
                                inactiveCustomers.length
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
                            placeholder="🔎 ابحث باسم العميل أو الهاتف أو العنوان..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
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

                    {/* ==================================
                        جدول العملاء
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
                                        #
                                    </th>

                                    <th style={thStyle}>
                                        اسم العميل
                                    </th>

                                    <th style={thStyle}>
                                        الهاتف
                                    </th>

                                    <th style={thStyle}>
                                        البريد الإلكتروني
                                    </th>

                                    <th style={thStyle}>
                                        العنوان
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
                                {filteredCustomers.length >
                                    0 ? (
                                    filteredCustomers.map(
                                        (customer) => (
                                            <tr
                                                key={
                                                    customer.customerID
                                                }
                                            >
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        customer.customerID
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
                                                        customer.customerName
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {customer.phone ||
                                                        "-"}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {customer.email ||
                                                        "-"}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {customer.address ||
                                                        "-"}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <span
                                                        style={{
                                                            background:
                                                                customer.isActive
                                                                    ? "#d1e7dd"
                                                                    : "#f8d7da",
                                                            color:
                                                                customer.isActive
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
                                                        {customer.isActive
                                                            ? "نشط"
                                                            : "غير نشط"}
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
                                                            viewButton
                                                        }
                                                        onClick={() =>
                                                            viewCustomer(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        👁️ عرض
                                                    </button>

                                                    <button
                                                        type="button"
                                                        style={
                                                            editButton
                                                        }
                                                        onClick={() =>
                                                            openEditForm(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        type="button"
                                                        style={
                                                            deleteButton
                                                        }
                                                        onClick={() =>
                                                            deleteCustomer(
                                                                customer.customerID
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
                                            colSpan="7"
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding: "35px",
                                                color: "#777",
                                            }}
                                        >
                                            {search
                                                ? "لا يوجد عملاء مطابقون للبحث 🔍"
                                                : "لا يوجد عملاء في قاعدة البيانات"}
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
            <div style={{ color: "#777" }}>
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

export default Customers;
