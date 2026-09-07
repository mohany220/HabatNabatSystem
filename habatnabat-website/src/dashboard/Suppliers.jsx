import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from "./api.js";

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // نافذة الإضافة والتعديل
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // بيانات المورد
    const [form, setForm] = useState({
        supplierName: "",
        phone: "",
        email: "",
        address: "",
        isActive: true,
    });

    // تحميل الموردين
    const loadSuppliers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(API_ENDPOINTS.SUPPLIERS);

            if (!response.ok) {
                throw new Error("فشل تحميل الموردين");
            }

            const data = await response.json();
            setSuppliers(data);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحميل الموردين من قاعدة البيانات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);

    // تغيير بيانات الفورم
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // فتح نافذة إضافة
    const openAddModal = () => {
        setEditingId(null);

        setForm({
            supplierName: "",
            phone: "",
            email: "",
            address: "",
            isActive: true,
        });

        setShowModal(true);
    };

    // فتح نافذة تعديل
    const openEditModal = (supplier) => {
        setEditingId(supplier.supplierID);

        setForm({
            supplierName: supplier.supplierName || "",
            phone: supplier.phone || "",
            email: supplier.email || "",
            address: supplier.address || "",
            isActive: supplier.isActive,
        });

        setShowModal(true);
    };

    // إغلاق النافذة
    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    // حفظ المورد
    const saveSupplier = async (e) => {
        e.preventDefault();

        if (!form.supplierName.trim()) {
            alert("من فضلك اكتب اسم المورد");
            return;
        }

        try {
            const body = editingId
                ? {
                    supplierID: editingId,
                    supplierName: form.supplierName,
                    phone: form.phone,
                    email: form.email,
                    address: form.address,
                    isActive: form.isActive,
                }
                : {
                    supplierName: form.supplierName,
                    phone: form.phone,
                    email: form.email,
                    address: form.address,
                    isActive: form.isActive,
                };

            const response = editingId
                ? await apiPut(`${API_ENDPOINTS.SUPPLIERS}/${editingId}`, body)
                : await apiPost(`${API_ENDPOINTS.SUPPLIERS}`, body);

            if (!response.ok) {
                const message = await response.text();
                console.error(message);

                throw new Error("فشل حفظ المورد");
            }

            alert(
                editingId
                    ? "تم تعديل المورد بنجاح ✅"
                    : "تم إضافة المورد بنجاح ✅"
            );

            closeModal();

            await loadSuppliers();
        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء حفظ المورد");
        }
    };

    // حذف المورد
    const deleteSupplier = async (id) => {
        const supplier = suppliers.find(
            (item) => item.supplierID === id
        );

        const confirmDelete = window.confirm(
            `هل أنت متأكد من حذف المورد "${supplier?.supplierName}"؟`
        );

        if (!confirmDelete) return;

        try {
            const response = await apiDelete(`${API_ENDPOINTS.SUPPLIERS}/${id}`);

            if (!response.ok) {
                throw new Error("فشل حذف المورد");
            }

            alert("تم حذف المورد بنجاح ✅");

            await loadSuppliers();
        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء حذف المورد");
        }
    };

    // البحث
    const filteredSuppliers = suppliers.filter((supplier) => {
        const searchText = search.toLowerCase();

        return (
            supplier.supplierName
                ?.toLowerCase()
                .includes(searchText) ||
            supplier.phone
                ?.toLowerCase()
                .includes(searchText) ||
            supplier.email
                ?.toLowerCase()
                .includes(searchText) ||
            supplier.address
                ?.toLowerCase()
                .includes(searchText)
        );
    });

    // الإحصائيات
    const totalSuppliers = suppliers.length;

    const activeSuppliers = suppliers.filter(
        (supplier) => supplier.isActive
    ).length;

    const inactiveSuppliers =
        totalSuppliers - activeSuppliers;

    return (
        <div
            dir="rtl"
            style={{
                padding: "25px",
                background: "#f5f7f9",
                minHeight: "100vh",
            }}
        >
            {/* العنوان */}
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
                        🚚 إدارة الموردين
                    </h2>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#777",
                        }}
                    >
                        إدارة بيانات الموردين ومتابعة التعاملات
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    style={addButton}
                >
                    ➕ إضافة مورد
                </button>
            </div>

            {/* الخطأ */}
            {error && (
                <div
                    style={{
                        background: "#f8d7da",
                        color: "#842029",
                        padding: "15px",
                        borderRadius: "8px",
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
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "18px",
                    marginBottom: "25px",
                }}
            >
                <StatCard
                    title="🚚 إجمالي الموردين"
                    value={totalSuppliers}
                    color="#198754"
                />

                <StatCard
                    title="✅ الموردين النشطين"
                    value={activeSuppliers}
                    color="#0d6efd"
                />

                <StatCard
                    title="⚠️ الموردين غير النشطين"
                    value={inactiveSuppliers}
                    color="#dc3545"
                />
            </div>

            {/* البحث */}
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
                    placeholder="🔎 ابحث باسم المورد أو الهاتف أو البريد أو العنوان..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={inputStyle}
                />
            </div>

            {/* الجدول */}
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
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>
                                اسم المورد
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
                        {!loading &&
                            filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map(
                                (supplier) => (
                                    <tr
                                        key={
                                            supplier.supplierID
                                        }
                                    >
                                        <td style={tdStyle}>
                                            {
                                                supplier.supplierID
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
                                                supplier.supplierName
                                            }
                                        </td>

                                        <td style={tdStyle}>
                                            {supplier.phone ||
                                                "-"}
                                        </td>

                                        <td style={tdStyle}>
                                            {supplier.email ||
                                                "-"}
                                        </td>

                                        <td style={tdStyle}>
                                            {supplier.address ||
                                                "-"}
                                        </td>

                                        <td style={tdStyle}>
                                            <span
                                                style={{
                                                    background:
                                                        supplier.isActive
                                                            ? "#d1e7dd"
                                                            : "#f8d7da",
                                                    color:
                                                        supplier.isActive
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
                                                {supplier.isActive
                                                    ? "نشط"
                                                    : "غير نشط"}
                                            </span>
                                        </td>

                                        <td style={tdStyle}>
                                            <button
                                                style={
                                                    editButton
                                                }
                                                onClick={() =>
                                                    openEditModal(
                                                        supplier
                                                    )
                                                }
                                            >
                                                ✏️ تعديل
                                            </button>

                                            <button
                                                style={
                                                    deleteButton
                                                }
                                                onClick={() =>
                                                    deleteSupplier(
                                                        supplier.supplierID
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
                            !loading && (
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
                                        لا يوجد موردين
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* نافذة الإضافة والتعديل */}
            {showModal && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    color: "#12372A",
                                }}
                            >
                                {editingId
                                    ? "✏️ تعديل المورد"
                                    : "➕ إضافة مورد جديد"}
                            </h2>

                            <button
                                onClick={closeModal}
                                style={closeButton}
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={saveSupplier}
                        >
                            {/* اسم المورد */}
                            <label style={labelStyle}>
                                اسم المورد *
                            </label>

                            <input
                                name="supplierName"
                                value={
                                    form.supplierName
                                }
                                onChange={handleChange}
                                placeholder="اكتب اسم المورد"
                                style={inputStyle}
                            />

                            {/* الهاتف */}
                            <label style={labelStyle}>
                                رقم الهاتف
                            </label>

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="01012345678"
                                style={inputStyle}
                            />

                            {/* البريد */}
                            <label style={labelStyle}>
                                البريد الإلكتروني
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                style={inputStyle}
                            />

                            {/* العنوان */}
                            <label style={labelStyle}>
                                العنوان
                            </label>

                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="عنوان المورد"
                                rows="3"
                                style={{
                                    ...inputStyle,
                                    resize: "vertical",
                                }}
                            />

                            {/* الحالة */}
                            <label
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: "10px",
                                    marginTop: "15px",
                                    marginBottom:
                                        "20px",
                                    cursor: "pointer",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={
                                        form.isActive
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={{
                                        width: "18px",
                                        height: "18px",
                                    }}
                                />

                                المورد نشط
                            </label>

                            {/* الأزرار */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                }}
                            >
                                <button
                                    type="submit"
                                    style={
                                        saveButton
                                    }
                                >
                                    {editingId
                                        ? "💾 حفظ التعديل"
                                        : "💾 حفظ المورد"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    style={
                                        cancelButton
                                    }
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

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

const addButton = {
    padding: "12px 22px",
    background: "#198754",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
};

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    marginTop: "15px",
    fontWeight: "bold",
    color: "#444",
};

const thStyle = {
    padding: "14px 12px",
    textAlign: "center",
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

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
};

const modalStyle = {
    background: "#fff",
    width: "100%",
    maxWidth: "550px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "15px",
    padding: "25px",
    boxSizing: "border-box",
    boxShadow: "0 10px 40px rgba(0,0,0,.25)",
};

const closeButton = {
    border: "none",
    background: "#f8d7da",
    color: "#842029",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
};

const saveButton = {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#198754",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
};

const cancelButton = {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#6c757d",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
};

export default Suppliers;
