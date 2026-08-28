function Stats() {
    const stats = [
        {
            number: "20+",
            title: "سنوات خبرة",
            icon: "🏆",
        },
        {
            number: "50+",
            title: "منتج",
            icon: "📦",
        },
        {
            number: "1000+",
            title: "عميل",
            icon: "🤝",
        },
        {
            number: "1000+",
            title: "توريد لجميع انحاء المملكة والتصدير خارج المملكة",
            icon: "🌍",
        },
    ];

    return (
        <section
            id="stats"
            data-aos="zoom-in"
            style={{
                padding: "70px 5%",
                background: "#0B5D3F",
                direction: "rtl",
            }}
        >
            <div
                style={{
                    maxWidth: "1300px",
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "25px",
                }}
            >
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="stat-card"
                        style={{
                            textAlign: "center",
                            color: "#fff",
                            padding: "25px 15px",
                            borderRadius: "15px",
                            transition: ".3s",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "40px",
                                marginBottom: "10px",
                            }}
                        >
                            {item.icon}
                        </div>

                        <div
                            style={{
                                color: "#D4AF37",
                                fontSize: "clamp(35px, 5vw, 50px)",
                                fontWeight: "bold",
                                marginBottom: "8px",
                            }}
                        >
                            {item.number}
                        </div>

                        <h3
                            style={{
                                margin: 0,
                                fontSize: "19px",
                                fontWeight: "500",
                            }}
                        >
                            {item.title}
                        </h3>
                    </div>
                ))}
            </div>

            <style>
                {`
                    .stat-card:hover {
                        transform: translateY(-7px);
                        background: rgba(255,255,255,.08);
                    }

                    @media (max-width: 600px) {
                        #stats {
                            padding: 55px 18px !important;
                        }

                        #stats > div {
                            grid-template-columns: repeat(2, 1fr) !important;
                            gap: 15px !important;
                        }

                        .stat-card {
                            padding: 20px 10px !important;
                        }

                        .stat-card h3 {
                            font-size: 15px !important;
                        }
                    }

                    @media (max-width: 380px) {
                        #stats > div {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>
        </section>
    );
}

export default Stats;