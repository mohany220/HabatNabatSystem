function Gallery() {
    const images = [
        {
            image: "/factory.jpg",
            title: "مصنع حبة نبات",
        },
        {
            image: "/factory.jpg",
            title: "خطوط الإنتاج",
        },
        {
            image: "/factory.jpg",
            title: "تجهيز وتعبئة المنتجات",
        },
        {
            image: "/factory.jpg",
            title: "منتجات حبة نبات",
        },
        {
            image: "/factory.jpg",
            title: "جودة التصنيع",
        },
        {
            image: "/factory.jpg",
            title: "التعبئة والتغليف",
        },
    ];

    return (
        <section
            id="gallery"
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
                    معرض الصور
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
                    تعرف على مصنع حبة نبات ومنتجاتنا ومراحل
                    التصنيع والتعبئة.
                </p>
            </div>

            {/* الصور */}
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                }}
            >
                {images.map((item, index) => (
                    <div
                        key={index}
                        className="gallery-card"
                        data-aos="zoom-in"
                        style={{
                            position: "relative",
                            height: "260px",
                            borderRadius: "15px",
                            overflow: "hidden",
                            cursor: "pointer",
                            boxShadow:
                                "0 8px 20px rgba(0,0,0,.12)",
                        }}
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                                transition: ".5s",
                            }}
                        />

                        {/* اسم الصورة */}
                        <div
                            className="gallery-overlay"
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                left: 0,
                                padding: "20px",
                                background:
                                    "linear-gradient(transparent, rgba(0,0,0,.8))",
                                color: "#fff",
                                fontSize: "19px",
                                fontWeight: "bold",
                            }}
                        >
                            {item.title}
                        </div>
                    </div>
                ))}
            </div>

            <style>
                {`
                    .gallery-card img {
                        transition: transform .5s ease;
                    }

                    .gallery-card:hover img {
                        transform: scale(1.08);
                    }

                    .gallery-card {
                        transition: .3s ease;
                    }

                    .gallery-card:hover {
                        transform: translateY(-5px);
                    }

                    @media (max-width: 600px) {
                        #gallery {
                            padding: 60px 18px !important;
                        }

                        #gallery > div:nth-child(2) {
                            grid-template-columns: 1fr !important;
                        }

                        .gallery-card {
                            height: 230px !important;
                        }
                    }

                    @media (min-width: 601px) and (max-width: 900px) {
                        #gallery > div:nth-child(2) {
                            grid-template-columns:
                                repeat(2, 1fr) !important;
                        }
                    }
                `}
            </style>
        </section>
    );
}

export default Gallery;