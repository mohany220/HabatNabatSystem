export default function Products() {
    const products = [
        {
            name: "ملح نقاء جامبو 1000 كيلو (طن)",
            image: "/factory.jpg",
        },
        {
            name: "ملح نقاء 50 كيلو",
            image: "/factory.jpg",
        },
        {
            name: "ملح نقاء 25 كيلو",
            image: "/factory.jpg",
        },
        {
            name: "ملح نقاء 4 كيلو",
            image: "/factory.jpg",
        },
        {
            name: "ملح نقاء 1 كيلو",
            image: "/factory.jpg",
        },
        {
            name: "ملح نقاء عبوة 700 جرام",
            image: "/factory.jpg",
        },
    ];

    return (
        <section
            id="products"
            data-aos="fade-up"
            style={{
                padding: "80px 5%",
                background: "#fff",
                direction: "rtl",
            }}
        >
            {/* العنوان */}
            <h2
                className="section-title"
                style={{
                    textAlign: "center",
                    color: "#00695c",
                    fontSize: "clamp(30px, 5vw, 42px)",
                    marginBottom: "50px",
                }}
            >
                منتجاتنا
            </h2>

            {/* المنتجات */}
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "30px",
                }}
            >
                {products.map((item, index) => (
                    <div
                        key={index}
                        className="card"
                        data-aos="fade-up"
                        style={{
                            borderRadius: "15px",
                            overflow: "hidden",
                            boxShadow:
                                "0 10px 25px rgba(0,0,0,.15)",
                            background: "#fff",
                            transition: ".3s",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* الصورة */}
                        <div
                            style={{
                                width: "100%",
                                height: "250px",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: ".5s",
                                }}
                            />
                        </div>

                        {/* البيانات */}
                        <div
                            style={{
                                padding: "20px",
                                textAlign: "center",
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#00695c",
                                    marginBottom: "15px",
                                    fontSize: "21px",
                                    lineHeight: "1.6",
                                }}
                            >
                                {item.name}
                            </h3>

                            <p
                                style={{
                                    color: "#666",
                                    lineHeight: "1.8",
                                    flex: 1,
                                }}
                            >
                                منتج عالي الجودة وفق أعلى معايير
                                التصنيع والتعبئة.
                            </p>

                            <button
                                className="main-btn"
                                onClick={() =>
                                    document
                                        .getElementById("quote")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                                style={{
                                    marginTop: "20px",
                                    width: "100%",
                                    padding: "12px",
                                    background: "#b8860b",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "17px",
                                    fontWeight: "bold",
                                }}
                            >
                                استفسر الآن
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Responsive */}
            <style>
                {`
                    .card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 18px 35px rgba(0,0,0,.18);
                    }

                    .card:hover img {
                        transform: scale(1.08);
                    }

                    @media (max-width: 600px) {
                        #products {
                            padding: 60px 18px !important;
                        }

                        #products > div {
                            grid-template-columns: 1fr !important;
                        }

                        #products img {
                            height: 220px !important;
                        }
                    }

                    @media (min-width: 601px) and (max-width: 900px) {
                        #products {
                            padding: 70px 30px !important;
                        }

                        #products > div {
                            grid-template-columns:
                                repeat(2, 1fr) !important;
                        }
                    }
                `}
            </style>
        </section>
    );
}