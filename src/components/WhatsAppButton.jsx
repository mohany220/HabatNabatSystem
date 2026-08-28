function WhatsAppButton() {
    const phoneNumber = "009665473738996";

    const message = encodeURIComponent(
        "مرحباً، أريد الاستفسار عن منتجات حبة نبات."
    );

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل معنا عبر واتساب"
            style={{
                position: "fixed",
                left: "20px",
                bottom: "20px",
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                background: "#25D366",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "30px",
                boxShadow: "0 5px 20px rgba(0,0,0,.25)",
                zIndex: 9999,
                transition: ".3s",
            }}
            className="whatsapp-button"
        >
            💬
        </a>
    );
}

export default WhatsAppButton;