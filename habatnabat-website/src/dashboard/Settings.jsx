import { useEffect, useState } from "react";

import { apiGet, apiPut, API_ENDPOINTS } from "./api.js";

function Settings() {
    // =====================================================
    // البيانات
    // =====================================================

    const [settingID, setSettingID] = useState(1);

    const [companyName, setCompanyName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [address, setAddress] = useState("");

    const [currency, setCurrency] = useState("جنيه مصري");
    const [tax, setTax] = useState("14");
    const [invoicePrefix, setInvoicePrefix] = useState("INV-");

    const [showTax, setShowTax] = useState(true);
    const [notifications, setNotifications] = useState(true);

    // =====================================================
    // حالة الصفحة
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // تحميل الإعدادات
    // =====================================================

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(`${API_ENDPOINTS.SETTINGS}`);

            if (!response.ok) {
                throw new Error("فشل تحميل إعدادات النظام");
            }

            const data = await response.json();

            // =============================================
            // حفظ البيانات القادمة من API
            // =============================================

            setSettingID(data.SettingID);

            setCompanyName(data.CompanyName || "");
            setPhone(data.Phone || "");
            setEmail(data.Email || "");
            setWebsite(data.Website || "");
            setAddress(data.Address || "");

            setCurrency(
                data.Currency || "جنيه مصري"
            );

            setTax(
                data.Tax !== undefined
                    ? String(data.Tax)
                    : "14"
            );

            setInvoicePrefix(
                data.InvoicePrefix || "INV-"
            );

            setShowTax(
                data.ShowTax !== undefined
                    ? data.ShowTax
                    : true
            );

            setNotifications(
                data.Notifications !== undefined
                    ? data.Notifications
                    : true
            );
        } catch (error) {
            console.error(error);

            setError(
                "حدث خطأ أثناء تحميل إعدادات النظام"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // تشغيل التحميل عند فتح الصفحة
    // =====================================================

    useEffect(() => {
        loadSettings();
    }, []);

    // =====================================================
    // حفظ الإعدادات
    // =====================================================

    const saveSettings = async () => {
        try {
            setSaving(true);
            setError("");

            const response = await apiPut(`${API_ENDPOINTS.SETTINGS}/${settingID}`, {
                settingID: settingID,

                CompanyName: companyName,
                Phone: phone,
                Email: email,
                Website: website,
                Address: address,

                Currency: currency,

                Tax: Number(tax),

                InvoicePrefix:
                    invoicePrefix,

                ShowTax: showTax,

                Notifications:
                    notifications,
            });

            if (!response.ok) {
                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "فشل حفظ الإعدادات"
                );
            }

            alert(
                "✅ تم حفظ إعدادات النظام بنجاح"
            );
        } catch (error) {
            console.error(error);

            alert(
                "❌ حدث خطأ أثناء حفظ الإعدادات\n" +
                error.message
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // شاشة التحميل
    // =====================================================

    if (loading) {
        return (
            <div
                dir="rtl"
                style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#777",
                }}
            >
                ⏳ جاري تحميل إعدادات النظام...
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
                    marginBottom: "25px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: "#12372A",
                        fontSize: "26px",
                    }}
                >
                    ⚙️ إعدادات النظام
                </h2>

                <p
                    style={{
                        color: "#777",
                        marginTop: "8px",
                    }}
                >
                    التحكم في بيانات الشركة وإعدادات النظام والفواتير
                </p>
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
                بيانات الشركة
            ===================================================== */}

            <div style={cardStyle}>
                <h3 style={sectionTitle}>
                    🏢 بيانات الشركة
                </h3>

                <div style={gridStyle}>
                    {/* اسم الشركة */}

                    <div>
                        <label style={labelStyle}>
                            اسم الشركة
                        </label>

                        <input
                            value={companyName}
                            onChange={(e) =>
                                setCompanyName(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />
                    </div>

                    {/* الهاتف */}

                    <div>
                        <label style={labelStyle}>
                            رقم الهاتف
                        </label>

                        <input
                            value={phone}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value
                                )
                            }
                            placeholder="010xxxxxxxx"
                            style={inputStyle}
                        />
                    </div>

                    {/* البريد */}

                    <div>
                        <label style={labelStyle}>
                            البريد الإلكتروني
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />
                    </div>

                    {/* الموقع */}

                    <div>
                        <label style={labelStyle}>
                            الموقع الإلكتروني
                        </label>

                        <input
                            type="text"
                            value={website}
                            onChange={(e) =>
                                setWebsite(
                                    e.target.value
                                )
                            }
                            placeholder="www.habatnabat.com"
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* العنوان */}

                <div
                    style={{
                        marginTop: "18px",
                    }}
                >
                    <label style={labelStyle}>
                        عنوان المصنع
                    </label>

                    <textarea
                        rows="4"
                        value={address}
                        onChange={(e) =>
                            setAddress(
                                e.target.value
                            )
                        }
                        placeholder="اكتب عنوان المصنع بالتفصيل..."
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                        }}
                    />
                </div>
            </div>

            {/* =====================================================
                إعدادات الفواتير
            ===================================================== */}

            <div style={cardStyle}>
                <h3 style={sectionTitle}>
                    🧾 إعدادات الفواتير
                </h3>

                <div style={gridStyle}>
                    {/* بادئة الفاتورة */}

                    <div>
                        <label style={labelStyle}>
                            بادئة رقم الفاتورة
                        </label>

                        <input
                            value={invoicePrefix}
                            onChange={(e) =>
                                setInvoicePrefix(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />
                    </div>

                    {/* العملة */}

                    <div>
                        <label style={labelStyle}>
                            العملة
                        </label>

                        <select
                            value={currency}
                            onChange={(e) =>
                                setCurrency(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        >
                            <option>
                                جنيه مصري
                            </option>

                            <option>
                                دولار أمريكي
                            </option>

                            <option>
                                يورو
                            </option>

                            <option>
                                ريال سعودي
                            </option>
                        </select>
                    </div>

                    {/* الضريبة */}

                    <div>
                        <label style={labelStyle}>
                            نسبة الضريبة %
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={tax}
                            onChange={(e) =>
                                setTax(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* إظهار الضريبة */}

                <div style={checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={showTax}
                        onChange={(e) =>
                            setShowTax(
                                e.target.checked
                            )
                        }
                    />

                    <span>
                        إظهار الضريبة في الفواتير
                    </span>
                </div>
            </div>

            {/* =====================================================
                إعدادات النظام
            ===================================================== */}

            <div style={cardStyle}>
                <h3 style={sectionTitle}>
                    🔐 إعدادات النظام
                </h3>

                <div style={checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) =>
                            setNotifications(
                                e.target.checked
                            )
                        }
                    />

                    <span>
                        تفعيل تنبيهات النظام
                    </span>
                </div>
            </div>

            {/* =====================================================
                زر الحفظ
            ===================================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginTop: "25px",
                }}
            >
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    style={{
                        background: saving
                            ? "#999"
                            : "#198754",
                        color: "#fff",
                        border: "none",
                        padding: "13px 28px",
                        borderRadius: "8px",
                        cursor: saving
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                >
                    {saving
                        ? "⏳ جاري الحفظ..."
                        : "💾 حفظ الإعدادات"}
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
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
};

const sectionTitle = {
    marginTop: 0,
    marginBottom: "20px",
    color: "#198754",
    borderBottom: "1px solid #eee",
    paddingBottom: "12px",
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
};

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#444",
    fontWeight: "bold",
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    outline: "none",
    fontSize: "15px",
    background: "#fff",
};

const checkboxContainer = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "18px",
    color: "#444",
};

export default Settings;