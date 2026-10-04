export default function Products() {
  const products = [
    { name: "ملح نقاء جامبو 1000 كيلو (طن)", image: "/products/ملح نقاء 1 طن.jpeg" },
    { name: "ملح نقاء 50 كيلو", image: "/products/ملح نقاء 50 كيلو.jpeg" },
    { name: "ملح نقاء 25 كيلو", image: "/products/ملح نقاء 25 كيلو.jpeg" },
    { name: "ملح نقاء 4 كيلو", image: "/products/ملح نقاء 4 كيلو.jpeg" },
    { name: "ملح نقاء 1 كيلو", image: "/products/ملح نقاء 1 كيلو.jpeg" },
    { name: "ملح نقاء عبوة 700 جرام", image: "/products/ملح نقاء 700 جرام.jpeg" },
  ];
  return (
    <section id="products" data-aos="fade-up" style={{ padding: "80px 5%", background: "#fff", direction: "rtl" }}>
      <h2 className="section-title" style={{ textAlign: "center", color: "#00695c", fontSize: "clamp(30px, 5vw, 42px)", marginBottom: "50px" }}>منتجاتنا</h2>
      <div style={{ maxWidth: "1400px", margin: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "30px" }}>
        {products.map((item) => <article key={item.name} className="card" data-aos="fade-up" style={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,.15)", background: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ width: "100%", height: "300px", background: "#f7f7f7" }}><img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} /></div>
          <div style={{ padding: "20px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column" }}><h3 style={{ color: "#00695c", marginBottom: "15px", fontSize: "21px", lineHeight: "1.6" }}>{item.name}</h3><p style={{ color: "#666", lineHeight: "1.8", flex: 1 }}>منتج عالي الجودة وفق أعلى معايير التصنيع والتعبئة.</p><button className="main-btn" onClick={() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })} style={{ marginTop: "20px", width: "100%", padding: "12px", background: "#b8860b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "17px", fontWeight: "bold" }}>استفسر الآن</button></div>
        </article>)}
      </div>
    </section>
  );
}
