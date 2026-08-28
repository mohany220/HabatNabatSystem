export default function Topbar() {
    return (
        <div
            style={{
                height: "70px",
                background: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 30px",
                borderBottom: "1px solid #ddd",
                marginBottom: "25px",
            }}
        >
            <div>
                <h2 style={{ color: "#0B5D3F", margin: 0 }}>
                    لوحة التحكم
                </h2>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <span style={{ fontSize: "20px", cursor: "pointer" }}>🔔</span>

                <span>👤 Mohamed</span>

                <button
                    style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    تسجيل الخروج
                </button>
            </div>
        </div>
    );
}