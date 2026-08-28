function Contact() {
    return (
        <section
            id="contact"
            data-aos="fade-up"
            style={{
                padding: "80px 5%",
                background: "#f8f8f8",
                direction: "rtl",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "40px",
                    alignItems: "stretch",
                }}
            >
                {/* بيانات التواصل */}
                <div
                    style={{
                        background: "#0B5D3F",
                        color: "#fff",
                        padding: "40px",
                        borderRadius: "20px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "clamp(30px, 5vw, 42px)",
                            marginBottom: "20px",
                        }}
                    >
                        تواصل معنا
                    </h2>

                    <p
                        style={{
                            fontSize: "17px",
                            lineHeight: "2",
                            opacity: ".9",
                        }}
                    >
                        يسعدنا التواصل معكم والإجابة على جميع
                        استفساراتكم وطلباتكم.
                    </p>

                    <div
                        style={{
                            marginTop: "30px",
                            display: "grid",
                            gap: "20px",
                        }}
                    >
                        <div>
                            <strong>📍 العنوان</strong>
                            <p>السعودية الرياض</p>
                        </div>

                        <div>
                            <strong>📞 الهاتف</strong>
                            <p>00966547373896</p>
                        </div>

                        <div>
                            <strong>📧 البريد الإلكتروني</strong>
                            <p>info@example.com</p>
                        </div>

                        <div>
                            <strong>💬 واتساب</strong>
                            <p>00966547373896</p>
                        </div>
                    </div>
                </div>

                {/* نموذج التواصل */}
                <div
                    style={{
                        background: "#fff",
                        padding: "40px",
                        borderRadius: "20px",
                        boxShadow:
                            "0 8px 25px rgba(0,0,0,.08)",
                    }}
                >
                    <h3
                        style={{
                            color: "#0B5D3F",
                            fontSize: "28px",
                            marginBottom: "25px",
                        }}
                    >
                        أرسل لنا رسالة
                    </h3>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert(
                                "تم استلام رسالتك، سنتواصل معك قريبًا."
                            );
                        }}
                    >
                        <input
                            type="text"
                            placeholder="الاسم"
                            required
                            style={inputStyle}
                        />

                        <input
                            type="tel"
                            placeholder="رقم الهاتف"
                            required
                            style={inputStyle}
                        />

                        <input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            style={inputStyle}
                        />

                        <textarea
                            placeholder="اكتب رسالتك..."
                            rows="5"
                            required
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                            }}
                        />

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "14px",
                                background: "#B68B2D",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "17px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            إرسال الرسالة
                        </button>
                    </form>
                </div>
            </div>

            <style>
                {`
                    @media (max-width: 800px) {
                        #contact {
                            padding: 60px 20px !important;
                        }

                        #contact > div {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    @media (max-width: 480px) {
                        #contact {
                            padding: 50px 15px !important;
                        }

                        #contact > div > div {
                            padding: 25px !important;
                        }
                    }
                `}
            </style>
        </section>
    );
}

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    direction: "rtl",
};

export default Contact;