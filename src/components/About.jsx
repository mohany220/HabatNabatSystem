export default function About() {
    return (
        <section
            id="about"
            data-aos="fade-right"
            style={{
                padding: "80px 5%",
                background: "#f8f8f8",
                direction: "rtl",
            }}
        >
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "50px",
                    flexWrap: "wrap",
                }}
            >
                {/* النص */}
                <div
                    style={{
                        flex: "1 1 500px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "clamp(30px, 5vw, 42px)",
                            color: "#00695c",
                            marginBottom: "20px",
                        }}
                    >
                        من نحن
                    </h2>

                    <p
                        style={{
                            fontSize: "clamp(16px, 2vw, 20px)",
                            lineHeight: "2",
                            color: "#555",
                            margin: 0,
                        }}
                    >
                        مصنع حبة نبات متخصص في تصنيع وتعبئة الملح
                        الغذائي بأعلى معايير الجودة العالمية، ونلتزم
                        بتقديم منتجات غذائية آمنة باستخدام أحدث خطوط
                        الإنتاج، مع الالتزام الكامل بشهادات الجودة
                        العالمية وخدمة عملائنا داخل السعودية وخارجها.
                    </p>

                    <ul
                        style={{
                            fontSize: "clamp(16px, 2vw, 20px)",
                            lineHeight: "2.2",
                            color: "#444",
                            marginTop: "25px",
                            paddingRight: "25px",
                        }}
                    >
                        <li>✔ جودة عالمية</li>
                        <li>✔ شهادات ISO</li>
                        <li>✔ أحدث خطوط الإنتاج</li>
                        <li>✔ تصدير للأسواق المحلية والعالمية</li>
                    </ul>
                </div>

                {/* الصورة */}
                <div
                    style={{
                        flex: "1 1 500px",
                    }}
                >
                    <img
                        src="/factory.jpg"
                        alt="مصنع حبة نبات"
                        style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "500px",
                            objectFit: "cover",
                            borderRadius: "20px",
                            boxShadow:
                                "0 10px 30px rgba(0,0,0,.2)",
                            display: "block",
                        }}
                    />
                </div>
            </div>

            <style>
                {`
                    @media (max-width: 800px) {
                        #about {
                            padding: 60px 20px !important;
                        }

                        #about > div {
                            flex-direction: column;
                            gap: 35px !important;
                        }

                        #about > div > div {
                            width: 100%;
                            flex: 1 1 100% !important;
                        }
                    }

                    @media (max-width: 480px) {
                        #about {
                            padding: 50px 15px !important;
                        }

                        #about h2 {
                            text-align: center;
                        }

                        #about p,
                        #about ul {
                            font-size: 16px !important;
                        }

                        #about img {
                            border-radius: 15px;
                        }
                    }
                `}
            </style>
        </section>
    );
}