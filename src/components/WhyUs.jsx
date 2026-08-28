function WhyUs() {
    const features = [
        {
            icon: "🏆",
            title: "جودة عالية",
            text: "منتجات مطابقة للمواصفات القياسية ومعايير الجودة.",
        },
        {
            icon: "🚚",
            title: "سرعة التوريد",
            text: "توصيل الطلبات في أسرع وقت لجميع المحافظات.",
        },
        {
            icon: "💰",
            title: "أفضل الأسعار",
            text: "أسعار تنافسية تناسب الشركات والموزعين.",
        },
        {
            icon: "🤝",
            title: "خدمة عملاء",
            text: "فريق دعم جاهز للرد على جميع الاستفسارات.",
        },
    ];

    return (
        <section
            id="why-us"
            data-aos="fade-left"
            style={{
                padding: "80px 5%",
                background: "#f8f8f8",
                direction: "rtl",
            }}
        >
            {/* العنوان */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "50px",
                }}
            >
                <h2
                    style={{
                        color: "#0B5D3F",
                        fontSize: "clamp(30px, 5vw, 42px)",
                        marginBottom: "15px",
                    }}
                >
                    لماذا تختار حبة نبات؟
                </h2>

                <p
                    style={{
                        color: "#666",
                        fontSize: "17px",
                        lineHeight: "1.8",
                        maxWidth: "700px",
                        margin: "auto",
                    }}
                >
                    نحرص على تقديم أفضل المنتجات والخدمات لعملائنا
                    بأعلى مستوى من الجودة والالتزام.
                </p>
            </div>

            {/* الكروت */}
            <div
                style={{
                    maxWidth: "1300px",
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "25px",
                }}
            >
                {features.map((item, index) => (
                    <div
                        key={index}
                        className="why-card"
                        data-aos="fade-up"
                        style={{
                            background: "#fff",
                            borderRadius: "15px",
                            padding: "35px 25px",
                            textAlign: "center",
                            boxShadow:
                                "0 5px 15px rgba(0,0,0,.1)",
                            transition: ".3s",
                            borderTop:
                                "4px solid #B68B2D",
                        }}
                    >
                        {/* الأيقونة */}
                        <div
                            style={{
                                fontSize: "50px",
                                marginBottom: "15px",
                            }}
                        >
                            {item.icon}
                        </div>

                        {/* العنوان */}
                        <h3
                            style={{
                                color: "#0B5D3F",
                                fontSize: "22px",
                                marginBottom: "12px",
                            }}
                        >
                            {item.title}
                        </h3>

                        {/* الوصف */}
                        <p
                            style={{
                                color: "#555",
                                lineHeight: "1.9",
                                fontSize: "16px",
                                margin: 0,
                            }}
                        >
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>

            <style>
                {`
                    .why-card:hover {
                        transform: translateY(-8px);
                        box-shadow:
                            0 15px 30px rgba(0,0,0,.15);
                    }

                    @media (max-width: 600px) {
                        #why-us {
                            padding: 60px 18px !important;
                        }

                        #why-us > div:nth-child(2) {
                            grid-template-columns: 1fr !important;
                        }

                        .why-card {
                            padding: 30px 20px !important;
                        }
                    }

                    @media (min-width: 601px) and (max-width: 900px) {
                        #why-us {
                            padding: 70px 30px !important;
                        }

                        #why-us > div:nth-child(2) {
                            grid-template-columns:
                                repeat(2, 1fr) !important;
                        }
                    }
                `}
            </style>
        </section>
    );
}

export default WhyUs;