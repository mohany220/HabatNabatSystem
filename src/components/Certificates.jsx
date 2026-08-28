function Certificates() {
    const certificates = [
        {
            name: "ISO 9001",
            title: "نظام إدارة الجودة",
            text: "نلتزم بتطبيق معايير إدارة الجودة وتحسين جودة المنتجات والخدمات.",
            image: "/iso9001.jpg",
        },
        {
            name: "ISO 22000",
            title: "سلامة الغذاء",
            text: "الاهتمام بسلامة الغذاء ومتابعة مراحل التصنيع والتعبئة.",
            image: "/iso22000.jpg",
        },
        {
            name: "HACCP",
            title: "سلامة وجودة الغذاء",
            text: "تطبيق مبادئ التحكم في المخاطر لضمان سلامة المنتجات.",
            image: "/haccp.jpg",
        },
    ];

    return (
        <section
            id="certificates"
            data-aos="fade-up"
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
                        fontSize: "clamp(30px, 5vw, 44px)",
                        marginBottom: "15px",
                    }}
                >
                    شهادات الجودة
                </h2>

                <p
                    style={{
                        color: "#666",
                        fontSize: "17px",
                        lineHeight: "1.9",
                        maxWidth: "750px",
                        margin: "auto",
                    }}
                >
                    نحرص على الالتزام بمعايير الجودة وسلامة الغذاء
                    وتطبيق أفضل الممارسات في عمليات التصنيع.
                </p>
            </div>

            {/* الشهادات */}
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "30px",
                }}
            >
                {certificates.map((certificate, index) => (
                    <div
                        key={index}
                        className="certificate-card"
                        data-aos="zoom-in"
                        style={{
                            background: "#fff",
                            borderRadius: "15px",
                            overflow: "hidden",
                            boxShadow:
                                "0 8px 25px rgba(0,0,0,.10)",
                            transition: ".3s",
                        }}
                    >
                        {/* صورة الشهادة */}
                        <div
                            style={{
                                width: "100%",
                                height: "280px",
                                background: "#eee",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={certificate.image}
                                alt={certificate.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    transition: ".4s",
                                }}
                            />
                        </div>

                        {/* البيانات */}
                        <div
                            style={{
                                padding: "25px",
                                textAlign: "center",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#B68B2D",
                                    fontSize: "26px",
                                    marginBottom: "8px",
                                }}
                            >
                                {certificate.name}
                            </h3>

                            <h4
                                style={{
                                    color: "#0B5D3F",
                                    fontSize: "20px",
                                    marginBottom: "12px",
                                }}
                            >
                                {certificate.title}
                            </h4>

                            <p
                                style={{
                                    color: "#666",
                                    lineHeight: "1.8",
                                    margin: 0,
                                }}
                            >
                                {certificate.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <style>
                {`
                    .certificate-card:hover {
                        transform: translateY(-8px);
                        box-shadow:
                            0 15px 35px rgba(0,0,0,.15);
                    }

                    .certificate-card:hover img {
                        transform: scale(1.04);
                    }

                    @media (max-width: 600px) {
                        #certificates {
                            padding: 60px 18px !important;
                        }

                        #certificates > div:nth-child(2) {
                            grid-template-columns: 1fr !important;
                        }

                        .certificate-card > div:first-child {
                            height: 240px !important;
                        }
                    }

                    @media (min-width: 601px) and (max-width: 900px) {
                        #certificates > div:nth-child(2) {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                    }
                `}
            </style>
        </section>
    );
}

export default Certificates;