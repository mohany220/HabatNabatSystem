function Footer() {
    return (
        <footer
            style={{
                background: "#073D2A",
                color: "#fff",
                direction: "rtl",
            }}
        >
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "auto",
                    padding: "60px 5%",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "40px",
                }}
            >
                {/* الشركة */}
                <div>
                    <h2
                        style={{
                            color: "#fff",
                            marginBottom: "15px",
                        }}
                    >
                        🏭 حبة نبات
                    </h2>

                    <p
                        style={{
                            color: "#ddd",
                            lineHeight: "2",
                            margin: 0,
                        }}
                    >
                        جودة الطبيعة في كل منتج.
                        <br />
                        نسعى لتقديم منتجات ملح عالية الجودة
                        وخدمة متميزة لعملائنا.
                    </p>
                </div>

                {/* روابط سريعة */}
                <div>
                    <h3
                        style={{
                            color: "#D4AF37",
                            marginBottom: "20px",
                        }}
                    >
                        روابط سريعة
                    </h3>

                    <a href="#hero" className="footer-link">
                        الرئيسية
                    </a>

                    <a href="#about" className="footer-link">
                        من نحن
                    </a>

                    <a href="#products" className="footer-link">
                        منتجاتنا
                    </a>

                    <a
                        href="#certificates"
                        className="footer-link"
                    >
                        شهادات الجودة
                    </a>

                    <a href="#contact" className="footer-link">
                        تواصل معنا
                    </a>
                </div>

                {/* المنتجات */}
                <div>
                    <h3
                        style={{
                            color: "#D4AF37",
                            marginBottom: "20px",
                        }}
                    >
                        منتجاتنا
                    </h3>

                    <p className="footer-text">
                        ملح نقاء جامبو 1000 كيلو
                    </p>

                    <p className="footer-text">
                        ملح نقاء 50 كيلو
                    </p>

                    <p className="footer-text">
                        ملح نقاء 25 كيلو
                    </p>

                    <p className="footer-text">
                        ملح نقاء 4 كيلو
                    </p>

                    <p className="footer-text">
                        ملح نقاء 1 كيلو
                    </p>
                </div>

                {/* التواصل */}
                <div>
                    <h3
                        style={{
                            color: "#D4AF37",
                            marginBottom: "20px",
                        }}
                    >
                        تواصل معنا
                    </h3>

                    <p className="footer-text">
                        📍 السعودية
                    </p>

                    <p className="footer-text">
                        📞 00966547373896
                    </p>

                    <p className="footer-text">
                        📧 info@example.com
                    </p>

                    <p className="footer-text">
                        💬 واتساب
                    </p>
                </div>
            </div>

            {/* الحقوق */}
            <div
                style={{
                    borderTop:
                        "1px solid rgba(255,255,255,.15)",
                    textAlign: "center",
                    padding: "20px",
                    color: "#ccc",
                    fontSize: "14px",
                }}
            >
                © {new Date().getFullYear()} حبة نبات - جميع
                الحقوق محفوظة
            </div>

            <style>
                {`
                    .footer-link {
                        display: block;
                        color: #ddd;
                        text-decoration: none;
                        margin-bottom: 12px;
                        transition: .3s;
                    }

                    .footer-link:hover {
                        color: #D4AF37;
                        transform: translateX(-5px);
                    }

                    .footer-text {
                        color: #ddd;
                        line-height: 1.8;
                        margin: 0 0 10px;
                    }

                    @media (max-width: 600px) {
                        footer > div:first-child {
                            padding: 45px 20px !important;
                            grid-template-columns: 1fr !important;
                            gap: 30px !important;
                        }

                        footer {
                            text-align: center;
                        }
                    }
                `}
            </style>
        </footer>
    );
}

export default Footer;