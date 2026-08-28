import { useState } from "react";

function QuoteForm() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        product: "",
        quantity: "",
        message: "",
    });

    const products = [
        "ملح نقاء جامبو 1000 كيلو (طن)",
        "ملح نقاء 50 كيلو",
        "ملح نقاء 25 كيلو",
        "ملح نقاء 4 كيلو",
        "ملح نقاء 1 كيلو",
        "ملح نقاء عبوة 700 جرام",
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        alert(
            "تم إرسال طلب عرض السعر بنجاح، وسنتواصل معك قريبًا."
        );

        setFormData({
            name: "",
            phone: "",
            email: "",
            product: "",
            quantity: "",
            message: "",
        });
    };

    return (
        <section
            id="quote"
            data-aos="fade-up"
            style={{
                padding: "80px 5%",
                background: "#0B5D3F",
                direction: "rtl",
            }}
        >
            <div
                style={{
                    maxWidth: "850px",
                    margin: "auto",
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "40px",
                    boxSizing: "border-box",
                    boxShadow:
                        "0 15px 40px rgba(0,0,0,.2)",
                }}
            >
                {/* العنوان */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "35px",
                    }}
                >
                    <h2
                        style={{
                            color: "#0B5D3F",
                            fontSize: "clamp(30px, 5vw, 44px)",
                            marginBottom: "15px",
                        }}
                    >
                        طلب عرض سعر
                    </h2>

                    <p
                        style={{
                            color: "#666",
                            fontSize: "17px",
                            lineHeight: "1.8",
                        }}
                    >
                        املأ البيانات التالية وسيتواصل معك فريق
                        المبيعات في أقرب وقت.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* الاسم + الهاتف */}
                    <div
                        className="quote-row"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                        }}
                    >
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="الاسم بالكامل"
                            required
                            style={inputStyle}
                        />

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="رقم الهاتف"
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* البريد + المنتج */}
                    <div
                        className="quote-row"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                        }}
                    >
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="البريد الإلكتروني"
                            style={inputStyle}
                        />

                        <select
                            name="product"
                            value={formData.product}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        >
                            <option value="">
                                اختر المنتج
                            </option>

                            {products.map((product, index) => (
                                <option
                                    key={index}
                                    value={product}
                                >
                                    {product}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* الكمية */}
                    <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="الكمية المطلوبة"
                        required
                        style={inputStyle}
                    />

                    {/* الرسالة */}
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="أي تفاصيل إضافية عن طلبك..."
                        rows="5"
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                        }}
                    />

                    {/* زر الإرسال */}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "15px",
                            background: "#B68B2D",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        إرسال طلب عرض السعر
                    </button>
                </form>
            </div>

            <style>
                {`
                    @media (max-width: 700px) {
                        #quote {
                            padding: 60px 18px !important;
                        }

                        #quote > div {
                            padding: 25px 20px !important;
                        }

                        .quote-row {
                            grid-template-columns: 1fr !important;
                            gap: 0 !important;
                        }
                    }

                    @media (max-width: 480px) {
                        #quote {
                            padding: 50px 15px !important;
                        }

                        #quote > div {
                            padding: 22px 15px !important;
                            border-radius: 15px !important;
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
    marginBottom: "18px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    direction: "rtl",
    background: "#fff",
};

export default QuoteForm;