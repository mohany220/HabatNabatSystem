function Features() {
    const features = [
        {
            icon: "🧂",
            title: "منتجات نقية",
            text: "نحرص على تقديم منتجات ملح بجودة ونقاء مناسبين لمختلف الاستخدامات.",
        },
        {
            icon: "🏭",
            title: "خطوط إنتاج حديثة",
            text: "نعتمد على تقنيات حديثة في التصنيع والتعبئة للحفاظ على جودة المنتجات.",
        },
        {
            icon: "📋",
            title: "رقابة على الجودة",
            text: "يتم الاهتمام بالجودة ومتابعة مراحل الإنتاج والتعبئة بشكل مستمر.",
        },
        {
            icon: "📦",
            title: "عبوات متعددة",
            text: "نوفر أحجام وعبوات مختلفة لتناسب احتياجات العملاء والموزعين.",
        },
        {
            icon: "🚛",
            title: "توريد مستمر",
            text: "نستهدف توفير المنتجات والطلبات بشكل منتظم حسب احتياجات العملاء.",
        },
        {
            icon: "🌍",
            title: "تغطية واسعة",
            text: "توريد لجميع انحاء المملكة والتصدير خارج المملكة.",
        },
    ];

    return (
        <section
            id="features"
            data-aos="fade-up"
            style={{
                padding: "80px 5%",
                background: "#fff",
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
                        fontSize: "clamp(30px, 5vw, 44px)",
                        marginBottom: "15px",
                    }}
                >
                    مميزاتنا
                </h2>

                <p
                    style={{
                        color: "#666",
                        fontSize: "17px",
                        lineHeight: "1.9",
                        maxWidth: "700px",
                        margin: "auto",
                    }}
                >
                    نهتم بكل تفاصيل المنتج بداية من التصنيع وحتى
                    وصوله إلى العميل.
                </p>
            </div>

            {/* المميزات */}
            <div
                style={{
                    maxWidth: "1400px",
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
                        className="feature-card"
                        data-aos="fade-up"
                        style={{
                            padding: "30px 25px",
                            background: "#f8faf9",
                            borderRadius: "15px",
                            textAlign: "center",
                            border: "1px solid #eee",
                            transition: ".3s",
                        }}
                    >
                        <div
                            style={{
                                width: "75px",
                                height: "75px",
                                margin: "0 auto 20px",
                                borderRadius: "50%",
                                background: "#0B5D3F",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "35px",
                            }}
                        >
                            {item.icon}
                        </div>

                        <h3
                            style={{
                                color: "#0B5D3F",
                                fontSize: "21px",
                                marginBottom: "12px",
                            }}
                        >
                            {item.title}
                        </h3>

                        <p
                            style={{
                                color: "#666",
                                lineHeight: "1.9",
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
                    .feature-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 15px 30px rgba(0,0,0,.10);
                        border-color: #B68B2D;
                    }

                    @media (max-width: 600px) {
                        #features {
                            padding: 60px 18px !important;
                        }

                        #features > div:last-child {
                            grid-template-columns: 1fr !important;
                        }

                        .feature-card {
                            padding: 25px 20px !important;
                        }
                    }

                    @media (min-width: 601px) and (max-width: 900px) {
                        #features > div:last-child {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                    }
                `}
            </style>
        </section>
    );
}

export default Features;