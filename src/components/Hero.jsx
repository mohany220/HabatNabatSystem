import factory from "../assets/factory.jpg";

function Hero() {
    return (
        <section
            id="hero"
            data-aos="fade-up"
            style={{
                backgroundImage: `linear-gradient(
                    rgba(0, 0, 0, 0.45),
                    rgba(0, 0, 0, 0.45)
                ), url(${factory})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "650px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                direction: "rtl",
                color: "white",
                padding: "80px 5%",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "650px",
                    background: "rgba(0,0,0,.45)",
                    padding: "40px",
                    borderRadius: "15px",
                    boxSizing: "border-box",
                }}
            >
                <h1
                    style={{
                        fontSize: "clamp(38px, 5vw, 64px)",
                        color: "white",
                        lineHeight: "1.4",
                        marginBottom: "25px",
                        fontWeight: "bold",
                    }}
                >
                    جودة الطبيعة{" "}
                    <span style={{ color: "#c99a2e" }}>
                        في حبة نبات
                    </span>
                </h1>

                <p
                    style={{
                        fontSize: "clamp(16px, 2vw, 22px)",
                        lineHeight: "1.9",
                        marginBottom: "30px",
                    }}
                >
                    أعلى معايير الجودة في تصنيع وتعبئة الملح
                    <br />
                    ومنتجات غذائية عالية الجودة.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                    }}
                >
                    <a
                        href="#products"
                        className="main-btn"
                        style={{
                            background: "#B68B2D",
                            color: "#fff",
                            border: "none",
                            padding: "15px 30px",
                            borderRadius: "8px",
                            fontSize: "18px",
                            cursor: "pointer",
                            textDecoration: "none",
                            display: "inline-block",
                        }}
                    >
                        استعرض منتجاتنا
                    </a>

                    <a
                        href="#contact"
                        className="main-btn"
                        style={{
                            background: "#0B5D3F",
                            color: "#fff",
                            border: "none",
                            padding: "15px 30px",
                            borderRadius: "8px",
                            fontSize: "18px",
                            cursor: "pointer",
                            textDecoration: "none",
                            display: "inline-block",
                        }}
                    >
                        تواصل معنا
                    </a>
                </div>
            </div>

            <style>
                {`
                    @media (max-width: 768px) {
                        #hero {
                            min-height: 600px !important;
                            padding: 100px 20px 50px !important;
                            justify-content: center;
                        }

                        #hero > div {
                            padding: 30px 22px !important;
                            text-align: center;
                        }

                        #hero > div > div {
                            justify-content: center;
                        }
                    }

                    @media (max-width: 480px) {
                        #hero {
                            min-height: 580px !important;
                            padding: 90px 15px 40px !important;
                        }

                        #hero > div {
                            padding: 25px 18px !important;
                        }

                        #hero a {
                            width: 100%;
                            text-align: center;
                        }
                    }
                `}
            </style>
        </section>
    );
}

export default Hero;