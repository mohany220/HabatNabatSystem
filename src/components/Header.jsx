import { useEffect, useState } from "react";

function Header() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 900);

            if (window.innerWidth > 900) {
                setMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const scrollToSection = (id) => {
        document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth" });

        setMenuOpen(false);
    };

    return (
        <header
            style={{
                background: "#ffffff",
                boxShadow: "0 2px 10px rgba(0,0,0,.08)",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
            }}
        >
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: isMobile ? "12px 18px" : "15px 40px",
                    direction: "rtl",
                    position: "relative",
                }}
            >

                {/* ================= اللوجو ================= */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <img
                        src="/logo.png"
                        alt="حبة نبات"
                        style={{
                            width: isMobile ? "45px" : "55px",
                            height: isMobile ? "45px" : "55px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />

                    <div>
                        <h2
                            style={{
                                margin: 0,
                                color: "#0B5D3F",
                                fontSize: isMobile ? "20px" : "24px",
                            }}
                        >
                            حبة نبات
                        </h2>

                        <small
                            style={{
                                color: "#B68B2D",
                                fontSize: isMobile ? "11px" : "13px",
                            }}
                        >
                            جودة الطبيعة
                        </small>
                    </div>
                </div>

                {/* ================= القائمة للكمبيوتر ================= */}
                {!isMobile && (
                    <nav
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "30px",
                        }}
                    >
                        <a
                            href="#hero"
                            style={linkStyle}
                        >
                            الرئيسية
                        </a>

                        <a
                            href="#about"
                            style={linkStyle}
                        >
                            من نحن
                        </a>

                        <a
                            href="#products"
                            style={linkStyle}
                        >
                            المنتجات
                        </a>

                        <a
                            href="#certificates"
                            style={linkStyle}
                        >
                            شهادات الجودة
                        </a>

                        <a
                            href="#contact"
                            style={linkStyle}
                        >
                            تواصل معنا
                        </a>
                    </nav>
                )}

                {/* ================= زر عرض السعر للكمبيوتر ================= */}
                {!isMobile && (
                    <button
                        onClick={() => scrollToSection("quote")}
                        style={{
                            background: "#B68B2D",
                            color: "#fff",
                            border: "none",
                            padding: "11px 20px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "bold",
                        }}
                    >
                        طلب عرض سعر
                    </button>
                )}

                {/* ================= زر الموبايل ================= */}
                {isMobile && (
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: "#0B5D3F",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            width: "45px",
                            height: "45px",
                            fontSize: "25px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                )}

                {/* ================= قائمة الموبايل ================= */}
                {isMobile && menuOpen && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            left: 0,
                            background: "#ffffff",
                            boxShadow: "0 5px 15px rgba(0,0,0,.12)",
                            padding: "15px 20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                        }}
                    >

                        <button
                            onClick={() => scrollToSection("hero")}
                            style={mobileLinkStyle}
                        >
                            🏠 الرئيسية
                        </button>

                        <button
                            onClick={() => scrollToSection("about")}
                            style={mobileLinkStyle}
                        >
                            👤 من نحن
                        </button>

                        <button
                            onClick={() => scrollToSection("products")}
                            style={mobileLinkStyle}
                        >
                            📦 المنتجات
                        </button>

                        <button
                            onClick={() => scrollToSection("certificates")}
                            style={mobileLinkStyle}
                        >
                            📜 شهادات الجودة
                        </button>

                        <button
                            onClick={() => scrollToSection("contact")}
                            style={mobileLinkStyle}
                        >
                            📞 تواصل معنا
                        </button>

                        <button
                            onClick={() => scrollToSection("quote")}
                            style={{
                                background: "#B68B2D",
                                color: "#fff",
                                border: "none",
                                padding: "12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "15px",
                                fontWeight: "bold",
                                marginTop: "8px",
                            }}
                        >
                            طلب عرض سعر
                        </button>

                    </div>
                )}

            </div>
        </header>
    );
}


/* شكل روابط الكمبيوتر */
const linkStyle = {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
};


/* شكل روابط الموبايل */
const mobileLinkStyle = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #eee",
    padding: "14px 8px",
    textAlign: "right",
    cursor: "pointer",
    fontSize: "16px",
    color: "#333",
    width: "100%",
};


export default Header;