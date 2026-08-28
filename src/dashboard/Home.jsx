import StatCard from "../components/StatCard";

function Home() {
    return (
        <div
            dir="rtl"
            style={{
                background: "#f5f7f9",
                minHeight: "100vh",
                padding: "25px",
            }}
        >
            {/* العنوان */}
            <div style={{ marginBottom: "25px" }}>
                <h1
                    style={{
                        margin: 0,
                        color: "#12372A",
                        fontSize: "28px",
                    }}
                >
                    🏠 مرحباً بك في لوحة التحكم
                </h1>

                <p
                    style={{
                        color: "#777",
                        marginTop: "8px",
                    }}
                >
                    إدارة ومتابعة مصنع حبة نبات من مكان واحد
                </p>
            </div>

            {/* الإحصائيات */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                }}
            >
                <StatCard
                    title="المنتجات"
                    value="6"
                    color="#198754"
                />

                <StatCard
                    title="العملاء"
                    value="48"
                    color="#0d6efd"
                />

                <StatCard
                    title="الطلبات"
                    value="12"
                    color="#fd7e14"
                />

                <StatCard
                    title="المستخدمون"
                    value="1"
                    color="#6f42c1"
                />
            </div>

            {/* ملخص سريع */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "25px",
                }}
            >
                <div style={boxStyle}>
                    <h3>💰 المبيعات</h3>

                    <h2 style={{ color: "#198754" }}>
                        850,000 ج.م
                    </h2>

                    <p style={{ color: "#777" }}>
                        إجمالي المبيعات الحالية
                    </p>
                </div>

                <div style={boxStyle}>
                    <h3>📥 المشتريات</h3>

                    <h2 style={{ color: "#6f42c1" }}>
                        420,000 ج.م
                    </h2>

                    <p style={{ color: "#777" }}>
                        إجمالي المشتريات الحالية
                    </p>
                </div>

                <div style={boxStyle}>
                    <h3>📈 صافي الأرباح</h3>

                    <h2 style={{ color: "#0d6efd" }}>
                        430,000 ج.م
                    </h2>

                    <p style={{ color: "#777" }}>
                        صافي الأرباح التقديرية
                    </p>
                </div>
            </div>

            {/* آخر الطلبات */}
            <div
                style={{
                    ...boxStyle,
                    marginTop: "25px",
                    overflowX: "auto",
                }}
            >
                <h3 style={{ marginTop: 0 }}>
                    📋 آخر الطلبات
                </h3>

                <table
                    style={{
                        width: "100%",
                        minWidth: "650px",
                        borderCollapse: "collapse",
                        marginTop: "15px",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                background: "#f8f9fa",
                            }}
                        >
                            <th style={thStyle}>
                                رقم الطلب
                            </th>

                            <th style={thStyle}>
                                العميل
                            </th>

                            <th style={thStyle}>
                                المنتج
                            </th>

                            <th style={thStyle}>
                                الحالة
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td style={tdStyle}>
                                #1001
                            </td>

                            <td style={tdStyle}>
                                شركة النور
                            </td>

                            <td style={tdStyle}>
                                ملح نقاء 50 كيلو
                            </td>

                            <td style={tdStyle}>
                                <span style={statusNew}>
                                    جديد
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td style={tdStyle}>
                                #1002
                            </td>

                            <td style={tdStyle}>
                                شركة السلام
                            </td>

                            <td style={tdStyle}>
                                ملح نقاء طن
                            </td>

                            <td style={tdStyle}>
                                <span style={statusPending}>
                                    جاري التنفيذ
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td style={tdStyle}>
                                #1003
                            </td>

                            <td style={tdStyle}>
                                شركة الإيمان
                            </td>

                            <td style={tdStyle}>
                                ملح نقاء 25 كيلو
                            </td>

                            <td style={tdStyle}>
                                <span style={statusDone}>
                                    تم التسليم
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const boxStyle = {
    background: "#fff",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,.07)",
};

const thStyle = {
    padding: "12px",
    textAlign: "center",
    color: "#555",
};

const tdStyle = {
    padding: "13px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
};

const statusNew = {
    background: "#cff4fc",
    color: "#055160",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
};

const statusPending = {
    background: "#fff3cd",
    color: "#856404",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
};

const statusDone = {
    background: "#d1e7dd",
    color: "#0f5132",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
};

export default Home;