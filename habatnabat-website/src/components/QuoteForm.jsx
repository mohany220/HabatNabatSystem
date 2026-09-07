import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5138/api";

function QuoteForm() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        productId: "",
        quantity: "",
        message: "",
    });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // تحميل المنتجات من الـ API
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoadingProducts(true);
                const response = await fetch(`${API_BASE}/Products`);
                if (response.ok) {
                    const data = await response.json();
                    // تصفية المنتجات النشطة فقط
                    const activeProducts = data.filter(p => p.isActive);
                    setProducts(activeProducts);
                }
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setLoadingProducts(false);
            }
        };
        loadProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.productId || !formData.quantity) {
            setError("من فضلك املأ جميع الحقول المطلوبة");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch(`${API_BASE}/Orders/quote-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Name: formData.name,
                    Phone: formData.phone,
                    Email: formData.email,
                    ProductId: Number(formData.productId),
                    Quantity: formData.quantity,
                    Message: formData.message,
                }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || "فشل إرسال الطلب");
            }

            if (!response.ok) {
                throw new Error(data?.message || "فشل إرسال طلب عرض السعر");
            }

            setSuccess(true);
            setFormData({
                name: "",
                phone: "",
                email: "",
                productId: "",
                quantity: "",
                message: "",
            });
        } catch (err) {
            console.error(err);
            setError(err.message || "حدث خطأ أثناء إرسال الطلب");
        } finally {
            setLoading(false);
        }
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
                    {/* رسالة النجاح */}
                    {success && (
                        <div
                            style={{
                                background: "#d1e7dd",
                                color: "#0f5132",
                                padding: "15px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                        >
                            ✅ تم إرسال طلب عرض السعر بنجاح، وسنتواصل معك قريبًا.
                        </div>
                    )}

                    {/* رسالة الخطأ */}
                    {error && (
                        <div
                            style={{
                                background: "#f8d7da",
                                color: "#842029",
                                padding: "15px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                                textAlign: "center",
                            }}
                        >
                            ❌ {error}
                        </div>
                    )}

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

                        {loadingProducts ? (
                            <select
                                name="productId"
                                value={formData.productId}
                                onChange={handleChange}
                                required
                                disabled
                                style={inputStyle}
                            >
                                <option value="">جاري تحميل المنتجات...</option>
                            </select>
                        ) : (
                            <select
                                name="productId"
                                value={formData.productId}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">
                                    اختر المنتج
                                </option>

                                {products.map((product) => (
                                    <option
                                        key={product.productID}
                                        value={product.productID}
                                    >
                                        {product.productName} - {product.weight} - {Number(product.price).toLocaleString()} ج.م
                                    </option>
                                ))}
                            </select>
                        )}
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
                        disabled={loading || loadingProducts}
                        style={{
                            width: "100%",
                            padding: "15px",
                            background: loading || loadingProducts ? "#999" : "#B68B2D",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            cursor: loading || loadingProducts ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "⏳ جاري الإرسال..." : "إرسال طلب عرض السعر"}
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