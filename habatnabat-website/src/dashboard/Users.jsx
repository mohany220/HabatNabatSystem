import { useEffect, useState } from "react";

import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from "./api.js";

function Users() {
    // =====================================================
    // المستخدمين
    // =====================================================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // النموذج
    // =====================================================

    const [showForm, setShowForm] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    // =====================================================
    // البحث
    // =====================================================

    const [search, setSearch] = useState("");

    // =====================================================
    // بيانات المستخدم
    // =====================================================

    const [form, setForm] = useState({
        name: "",
        userName: "",
        password: "",
        role: "Sales",
        status: "نشط",
    });

    // =====================================================
    // تحميل المستخدمين
    // =====================================================

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(API_ENDPOINTS.USERS);

            if (!response.ok) {
                throw new Error("فشل تحميل المستخدمين");
            }

            const data = await response.json();

            setUsers(data);
        } catch (error) {
            console.error(error);
            setError(
                "حدث خطأ أثناء تحميل المستخدمين من قاعدة البيانات"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // =====================================================
    // تغيير بيانات النموذج
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    // =====================================================
    // فتح نموذج الإضافة
    // =====================================================

    const openAddForm = () => {
        setEditingUserId(null);

        setForm({
            name: "",
            userName: "",
            password: "",
            role: "Sales",
            status: "نشط",
        });

        setShowForm(true);
    };

    // =====================================================
    // فتح نموذج التعديل
    // =====================================================

    const editUser = async (id) => {
        try {
            const response = await apiGet(`${API_ENDPOINTS.USERS}/${id}`);

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || "فشل تحميل بيانات المستخدم"
                );
            }

            const user = await response.json();

            setEditingUserId(user.userID);

            setForm({
                name: user.name || "",
                userName: user.userName || "",
                password: "", // لا نظهر الباسورد عند التعديل
                role: user.role || "Sales",
                status: user.status || "نشط",
            });

            setShowForm(true);
        } catch (error) {
            console.error(error);

            alert(
                "حدث خطأ أثناء تحميل بيانات المستخدم\n" +
                error.message
            );
        }
    };

    // =====================================================
    // حفظ المستخدم
    // إضافة أو تعديل
    // =====================================================

    const saveUser = async (e) => {
        e.preventDefault();

        if (!form.name || !form.userName) {
            alert(
                "من فضلك أدخل الاسم واسم الدخول"
            );

            return;
        }

        const userData = {
            name: form.name,
            userName: form.userName,
            password: form.password,
            role: form.role,
            status: form.status,
        };

        // =================================================
        // إضافة مستخدم
        // =================================================

        if (editingUserId === null) {
            if (!form.password) {
                alert("من فضلك أدخل كلمة المرور");
                return;
            }

            try {
                const response = await apiPost(
                    `${API_ENDPOINTS.USERS}`,
                    userData
                );

                if (!response.ok) {
                    const message =
                        await response.text();

                    let errorMessage =
                        "فشل إضافة المستخدم";

                    try {
                        const errorData =
                            JSON.parse(message);

                        if (errorData.message) {
                            errorMessage =
                                errorData.message;
                        }
                    } catch {
                        if (message) {
                            errorMessage = message;
                        }
                    }

                    throw new Error(errorMessage);
                }

                alert(
                    "تم إضافة المستخدم بنجاح ✅"
                );

                resetForm();

                await loadUsers();
            } catch (error) {
                console.error(error);

                alert(
                    "حدث خطأ أثناء إضافة المستخدم\n" +
                    error.message
                );
            }

            return;
        }

        // =================================================
        // تعديل مستخدم
        // =================================================

        try {
            const response = await apiPut(
                `${API_ENDPOINTS.USERS}/${editingUserId}`,
                { ...userData, userID: editingUserId }
            );

            if (!response.ok) {
                const message =
                    await response.text();

                let errorMessage =
                    "فشل تعديل المستخدم";

                try {
                    const errorData =
                        JSON.parse(message);

                    if (errorData.message) {
                        errorMessage =
                            errorData.message;
                    }
                } catch {
                    if (message) {
                        errorMessage = message;
                    }
                }

                throw new Error(errorMessage);
            }

            alert(
                "تم تعديل المستخدم بنجاح ✅"
            );

            resetForm();

            await loadUsers();
        } catch (error) {
            console.error(error);

            alert(
                "حدث خطأ أثناء تعديل المستخدم\n" +
                error.message
            );
        }
    };

    // =====================================================
    // تنظيف النموذج
    // =====================================================

    const resetForm = () => {
        setForm({
            name: "",
            userName: "",
            password: "",
            role: "Sales",
            status: "نشط",
        });

        setEditingUserId(null);
        setShowForm(false);
    };

    // =====================================================
    // حذف مستخدم (إيقاف - Soft Delete)
    // =====================================================

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "هل أنت متأكد من إيقاف هذا المستخدم؟"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await apiDelete(`${API_ENDPOINTS.USERS}/${id}`);

            if (!response.ok) {
                const message =
                    await response.text();

                let errorMessage =
                    "فشل إيقاف المستخدم";

                try {
                    const errorData =
                        JSON.parse(message);

                    if (errorData.message) {
                        errorMessage =
                            errorData.message;
                    }
                } catch {
                    if (message) {
                        errorMessage = message;
                    }
                }

                throw new Error(errorMessage);
            }

            alert(
                "تم إيقاف المستخدم بنجاح ✅"
            );

            await loadUsers();
        } catch (error) {
            console.error(error);

            alert(
                "حدث خطأ أثناء إيقاف المستخدم\n" +
                error.message
            );
        }
    };

    // =====================================================
    // البحث
    // =====================================================

    const filteredUsers = users.filter((user) => {
        const name = user.Name || "";
        const username = user.UserName || "";

        return (
            name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            username
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    });

    // =====================================================
    // تحويل الدور للواجهة
    // =====================================================

    const getRoleLabel = (role) => {
        const roles = {
            "Admin": "مدير النظام",
            "Manager": "مدير",
            "Sales": "موظف مبيعات",
            "Storekeeper": "موظف مخزن",
            "Viewer": "مشاهد"
        };
        return roles[role] || role;
    };

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
                            color: "#0B5D3F",
                            fontSize: "30px",
                        }}
                    >
                        👤 المستخدمين
                    </h2>

                    <p style={{ color: "#777" }}>
                        إدارة مستخدمي النظام والصلاحيات
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    style={{
                        padding: "12px 22px",
                        background: "#198754",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    ➕ إضافة مستخدم
                </button>
            </div>

            {/* =====================================================
                رسالة الخطأ
            ===================================================== */}

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
                    ❌ {error}
                </div>
            )}

            {/* =====================================================
                نموذج الإضافة / التعديل
            ===================================================== */}

            {showForm && (
                <form
                    onSubmit={saveUser}
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 3px 15px rgba(0,0,0,.08)",
                        marginBottom: "25px",
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
                                color: "#0B5D3F",
                            }}
                        >
                            {editingUserId === null
                                ? "➕ إضافة مستخدم جديد"
                                : "✏️ تعديل المستخدم"}
                        </h3>

                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                border: "none",
                                background: "#eee",
                                padding: "8px 14px",
                                borderRadius: "7px",
                                cursor: "pointer",
                            }}
                        >
                            ✖ إغلاق
                        </button>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(200px,1fr))",
                            gap: "15px",
                        }}
                    >
                        {/* الاسم */}

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="اسم المستخدم"
                            style={inputStyle}
                        />

                        {/* اسم الدخول */}

                        <input
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            placeholder="اسم الدخول"
                            style={inputStyle}
                        />

                        {/* كلمة المرور */}

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder={
                                editingUserId === null
                                    ? "كلمة المرور (مطلوبة)"
                                    : "اتركها فارغة لعدم التغيير"
                            }
                            style={inputStyle}
                        />

                        {/* الصلاحية */}

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="Admin">
                                مدير النظام
                            </option>

                            <option value="Manager">
                                مدير
                            </option>

                            <option value="Sales">
                                موظف مبيعات
                            </option>

                            <option value="Storekeeper">
                                موظف مخزن
                            </option>

                            <option value="Viewer">
                                مشاهد
                            </option>
                        </select>

                        {/* الحالة */}

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="نشط">
                                نشط
                            </option>

                            <option value="موقوف">
                                موقوف
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: "20px",
                            padding: "11px 25px",
                            background: "#0B5D3F",
                            color: "#fff",
                            border: "none",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        {editingUserId === null
                            ? "💾 حفظ المستخدم"
                            : "💾 حفظ التعديل"}
                    </button>
                </form>
            )}

            {/* =====================================================
                البحث
            ===================================================== */}

            <div
                style={{
                    background: "#fff",
                    padding: "15px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,.08)",
                }}
            >
                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="🔎 ابحث عن مستخدم..."
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "16px",
                        outline: "none",
                    }}
                />
            </div>

            {/* =====================================================
                جدول المستخدمين
            ===================================================== */}

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
                        minWidth: "750px",
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
                            <th style={thStyle}>
                                الكود
                            </th>

                            <th style={thStyle}>
                                الاسم
                            </th>

                            <th style={thStyle}>
                                اسم الدخول
                            </th>

                            <th style={thStyle}>
                                الصلاحية
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
                        {/* تحميل */}

                        {loading && (
                            <tr>
                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign:
                                            "center",
                                        padding: "35px",
                                        color: "#777",
                                    }}
                                >
                                    ⏳ جاري تحميل
                                    المستخدمين...
                                </td>
                            </tr>
                        )}

                        {/* البيانات */}

                        {!loading &&
                            filteredUsers.map(
                                (user) => (
                                    <tr
                                        key={
                                            user.userID
                                        }
                                    >
                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {
                                                user.userID
                                            }
                                        </td>

                                        <td
                                            style={{
                                                ...tdStyle,
                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            {user.name}
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {user.userName}
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            {getRoleLabel(user.role)}
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            <span
                                                style={{
                                                    color:
                                                        user.status ===
                                                            "نشط"
                                                            ? "#198754"
                                                            : "#dc3545",
                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                {user.status ===
                                                    "نشط"
                                                    ? "🟢 نشط"
                                                    : "🔴 موقوف"}
                                            </span>
                                        </td>

                                        <td
                                            style={
                                                tdStyle
                                            }
                                        >
                                            <button
                                                onClick={() =>
                                                    editUser(
                                                        user.userID
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "7px 12px",
                                                    border:
                                                        "none",
                                                    borderRadius:
                                                        "6px",
                                                    cursor:
                                                        "pointer",
                                                    marginLeft:
                                                        "5px",
                                                    background:
                                                        "#fff3cd",
                                                }}
                                            >
                                                ✏️ تعديل
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteUser(
                                                        user.userID
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "7px 12px",
                                                    border:
                                                        "none",
                                                    borderRadius:
                                                        "6px",
                                                    background:
                                                        "#dc3545",
                                                    color:
                                                        "#fff",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                🔴 إيقاف
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}

                        {/* لا يوجد مستخدمين */}

                        {!loading &&
                            filteredUsers.length ===
                            0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "30px",
                                            color:
                                                "#777",
                                        }}
                                    >
                                        لا يوجد مستخدمين
                                        في قاعدة البيانات
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// =====================================================
// Styles
// =====================================================

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
};

const thStyle = {
    padding: "14px 10px",
    textAlign: "center",
};

const tdStyle = {
    padding: "14px 10px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
};

export default Users;