import { useEffect, useState } from "react";
import NewSale from "./NewSale";
import { apiGet, apiDelete, API_ENDPOINTS } from "./api.js";

function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    // شاشة فاتورة جديدة
    const [showNewSale, setShowNewSale] = useState(false);

    // الفاتورة التي سيتم تعديلها
    const [saleToEdit, setSaleToEdit] = useState(null);

    // الفاتورة التي سيتم عرض تفاصيلها
    const [saleToView, setSaleToView] = useState(null);

    // =====================================================
    // تحميل الفواتير
    // =====================================================

    const loadSales = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiGet(API_ENDPOINTS.SALES);

            if (!response.ok) {
                throw new Error(
                    "حدث خطأ أثناء تحميل الفواتير"
                );
            }

            const data = await response.json();

            setSales(data);
        } catch (err) {
            console.error(err);

            setError(
                "حدث خطأ أثناء تحميل الفواتير من قاعدة البيانات"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSales();
    }, []);

    // =====================================================
    // فتح فاتورة جديدة
    // =====================================================

    const openNewSale = () => {
        setSaleToEdit(null);
        setShowNewSale(true);
    };

    // =====================================================
    // فتح فاتورة للتعديل
    // =====================================================

    const openEditSale = async (id) => {
        try {
            setError("");

            const response = await apiGet(`${API_ENDPOINTS.SALES}/${id}`);

            if (!response.ok) {
                throw new Error(
                    "فشل تحميل بيانات الفاتورة"
                );
            }

            const data = await response.json();

            setSaleToEdit(data);
            setShowNewSale(true);
        } catch (err) {
            console.error(err);

            alert(
                "حدث خطأ أثناء تحميل بيانات الفاتورة للتعديل"
            );
        }
    };

    // =====================================================
    // الرجوع من شاشة الفاتورة
    // =====================================================

    const handleBack = async () => {
        setShowNewSale(false);
        setSaleToEdit(null);

        await loadSales();
    };

    // =====================================================
    // عرض تفاصيل الفاتورة
    // =====================================================

    const viewSale = async (sale) => {
        try {
            setError("");

            // لو تفاصيل الفاتورة موجودة بالفعل
            if (
                sale.saleDetails &&
                sale.saleDetails.length > 0
            ) {
                setSaleToView(sale);
                return;
            }

            // تحميل تفاصيل الفاتورة من الـ API
            const response = await apiGet(`${API_ENDPOINTS.SALES}/${sale.saleID}`);

            if (!response.ok) {
                throw new Error(
                    "فشل تحميل تفاصيل الفاتورة"
                );
            }

            const data = await response.json();

            setSaleToView(data);
        } catch (err) {
            console.error(err);

            alert(
                "حدث خطأ أثناء تحميل تفاصيل الفاتورة"
            );
        }
    };

    // =====================================================
    // حذف فاتورة
    // =====================================================

    const deleteSale = async (id) => {
        const confirmDelete = window.confirm(
            "هل أنت متأكد من حذف هذه الفاتورة؟ سيتم إعادة الكمية إلى المخزن."
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await apiDelete(`${API_ENDPOINTS.SALES}/${id}`);

            if (!response.ok) {
                throw new Error(
                    "فشل حذف الفاتورة"
                );
            }

            alert(
                "تم حذف الفاتورة وإعادة الكمية إلى المخزن"
            );

            await loadSales();
        } catch (err) {
            console.error(err);

            alert(
                "حدث خطأ أثناء حذف الفاتورة"
            );
        }
    };

    // =====================================================
    // لو شاشة فاتورة جديدة / تعديل
    // =====================================================

    if (showNewSale) {
        return (
            <NewSale
                onBack={handleBack}
                saleToEdit={saleToEdit}
            />
        );
    }

    // =====================================================
    // البحث
    // =====================================================

    const filteredSales = sales.filter((sale) => {
        const searchText = search.toLowerCase();

        return (
            String(sale.saleID).includes(searchText) ||
            String(sale.customerName || "")
                .toLowerCase()
                .includes(searchText)
        );
    });

    // =====================================================
    // إجمالي المبيعات
    // =====================================================

    const totalSales = sales.reduce(
        (sum, sale) =>
            sum + Number(sale.netAmount || 0),
        0
    );

    // =====================================================
    // عدد الفواتير
    // =====================================================

    const totalInvoices = sales.length;

    // =====================================================
    // إجمالي الخصومات
    // =====================================================

    const totalDiscount = sales.reduce(
        (sum, sale) =>
            sum + Number(sale.discount || 0),
        0
    );

    // =====================================================
    // واجهة المبيعات
    // =====================================================

    return (
        <div
            dir="rtl"
            style={{
                padding: "25px",
                background: "#f5f7f9",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >

            {/* =====================================================
                نافذة عرض الفاتورة
            ===================================================== */}

            {saleToView && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,0.55)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        padding: "20px",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            width: "100%",
                            maxWidth: "900px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            borderRadius: "15px",
                            boxShadow:
                                "0 10px 40px rgba(0,0,0,.25)",
                        }}
                    >

                        {/* رأس الفاتورة */}

                        <div
                            style={{
                                padding:
                                    "20px 25px",
                                background:
                                    "#0B5D3F",
                                color: "#fff",
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                gap: "15px",
                            }}
                        >
                            <div>
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize:
                                            "24px",
                                    }}
                                >
                                    🧾 فاتورة بيع
                                </h2>

                                <div
                                    style={{
                                        marginTop:
                                            "6px",
                                        opacity:
                                            0.9,
                                    }}
                                >
                                    رقم الفاتورة: #
                                    {
                                        saleToView.saleID
                                    }
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setSaleToView(
                                        null
                                    )
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "rgba(255,255,255,.15)",
                                    color: "#fff",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius:
                                        "50%",
                                    fontSize:
                                        "22px",
                                    cursor: "pointer",
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* بيانات الفاتورة */}

                        <div
                            style={{
                                padding: "25px",
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "15px",
                                    marginBottom:
                                        "25px",
                                }}
                            >

                                {/* العميل */}

                                <div
                                    style={{
                                        background:
                                            "#f8f9fa",
                                        padding:
                                            "15px",
                                        borderRadius:
                                            "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            color:
                                                "#777",
                                            marginBottom:
                                                "5px",
                                        }}
                                    >
                                        👤 العميل
                                    </div>

                                    <strong>
                                        {saleToView.customerName ||
                                            "غير محدد"}
                                    </strong>
                                </div>

                                {/* التاريخ */}

                                <div
                                    style={{
                                        background:
                                            "#f8f9fa",
                                        padding:
                                            "15px",
                                        borderRadius:
                                            "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            color:
                                                "#777",
                                            marginBottom:
                                                "5px",
                                        }}
                                    >
                                        📅 تاريخ
                                        الفاتورة
                                    </div>

                                    <strong>
                                        {saleToView.saleDate
                                            ? new Date(
                                                saleToView.saleDate
                                            ).toLocaleString(
                                                "ar-EG"
                                            )
                                            : "غير محدد"}
                                    </strong>
                                </div>

                            </div>

                            {/* =====================================================
                                الأصناف
                            ===================================================== */}

                            <h3
                                style={{
                                    color:
                                        "#0B5D3F",
                                    marginBottom:
                                        "12px",
                                }}
                            >
                                📦 أصناف الفاتورة
                            </h3>

                            <div
                                style={{
                                    overflowX:
                                        "auto",
                                    border:
                                        "1px solid #eee",
                                    borderRadius:
                                        "10px",
                                }}
                            >
                                <table
                                    style={{
                                        width: "100%",
                                        minWidth:
                                            "650px",
                                        borderCollapse:
                                            "collapse",
                                    }}
                                >
                                    <thead
                                        style={{
                                            background:
                                                "#f5f7f9",
                                        }}
                                    >
                                        <tr>
                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                #
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                المنتج
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                الكمية
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                سعر الوحدة
                                            </th>

                                            <th
                                                style={
                                                    thStyle
                                                }
                                            >
                                                الإجمالي
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {saleToView.saleDetails &&
                                            saleToView.saleDetails.length >
                                            0 ? (
                                            saleToView.saleDetails.map(
                                                (
                                                    detail,
                                                    index
                                                ) => {

                                                    const detailTotal =
                                                        detail.total ??
                                                        (
                                                            Number(
                                                                detail.quantity ||
                                                                0
                                                            ) *
                                                            Number(
                                                                detail.unitPrice ||
                                                                0
                                                            )
                                                        );

                                                    return (
                                                        <tr
                                                            key={
                                                                detail.saleDetailID ||
                                                                index
                                                            }
                                                        >

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {index +
                                                                    1}
                                                            </td>

                                                            <td
                                                                style={{
                                                                    ...tdStyle,
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {detail.productName ||
                                                                    `منتج رقم ${detail.productID}`}
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {
                                                                    detail.quantity
                                                                }
                                                            </td>

                                                            <td
                                                                style={
                                                                    tdStyle
                                                                }
                                                            >
                                                                {Number(
                                                                    detail.unitPrice ||
                                                                    0
                                                                ).toLocaleString(
                                                                    "ar-EG"
                                                                )}{" "}
                                                                ج.م
                                                            </td>

                                                            <td
                                                                style={{
                                                                    ...tdStyle,
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {Number(
                                                                    detailTotal
                                                                ).toLocaleString(
                                                                    "ar-EG"
                                                                )}{" "}
                                                                ج.م
                                                            </td>

                                                        </tr>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        padding:
                                                            "30px",
                                                        color:
                                                            "#777",
                                                    }}
                                                >
                                                    لا توجد أصناف
                                                    مسجلة في
                                                    الفاتورة
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </div>

                            {/* =====================================================
                                الإجماليات
                            ===================================================== */}

                            <div
                                style={{
                                    marginTop:
                                        "25px",
                                    display:
                                        "flex",
                                    justifyContent:
                                        "flex-end",
                                }}
                            >
                                <div
                                    style={{
                                        width:
                                            "100%",
                                        maxWidth:
                                            "350px",
                                    }}
                                >

                                    {/* الإجمالي */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            padding:
                                                "10px 0",
                                        }}
                                    >
                                        <span>
                                            الإجمالي:
                                        </span>

                                        <strong>
                                            {Number(
                                                saleToView.totalAmount ||
                                                0
                                            ).toLocaleString(
                                                "ar-EG"
                                            )}{" "}
                                            ج.م
                                        </strong>
                                    </div>

                                    {/* الخصم */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            padding:
                                                "10px 0",
                                            color:
                                                "#dc3545",
                                        }}
                                    >
                                        <span>
                                            الخصم:
                                        </span>

                                        <strong>
                                            {Number(
                                                saleToView.discount ||
                                                0
                                            ).toLocaleString(
                                                "ar-EG"
                                            )}{" "}
                                            ج.م
                                        </strong>
                                    </div>

                                    {/* الصافي */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            padding:
                                                "15px 0",
                                            marginTop:
                                                "5px",
                                            borderTop:
                                                "2px solid #0B5D3F",
                                            fontSize:
                                                "20px",
                                            color:
                                                "#198754",
                                        }}
                                    >
                                        <strong>
                                            الصافي:
                                        </strong>

                                        <strong>
                                            {Number(
                                                saleToView.netAmount ||
                                                0
                                            ).toLocaleString(
                                                "ar-EG"
                                            )}{" "}
                                            ج.م
                                        </strong>
                                    </div>

                                </div>
                            </div>

                            {/* =====================================================
                                الملاحظات
                            ===================================================== */}

                            {saleToView.notes && (
                                <div
                                    style={{
                                        marginTop:
                                            "15px",
                                        background:
                                            "#fff3cd",
                                        padding:
                                            "15px",
                                        borderRadius:
                                            "8px",
                                        color:
                                            "#664d03",
                                    }}
                                >
                                    <strong>
                                        📝 ملاحظات:
                                    </strong>

                                    <div
                                        style={{
                                            marginTop:
                                                "5px",
                                        }}
                                    >
                                        {
                                            saleToView.notes
                                        }
                                    </div>
                                </div>
                            )}

                            {/* =====================================================
                                أزرار النافذة
                            ===================================================== */}

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: "10px",
                                    marginTop:
                                        "25px",
                                }}
                            >

                                <button
                                    onClick={() =>
                                        setSaleToView(
                                            null
                                        )
                                    }
                                    style={{
                                        padding:
                                            "11px 22px",
                                        border:
                                            "none",
                                        borderRadius:
                                            "8px",
                                        background:
                                            "#6c757d",
                                        color:
                                            "#fff",
                                        cursor:
                                            "pointer",
                                        fontWeight:
                                            "bold",
                                    }}
                                >
                                    إغلاق
                                </button>

                                <button
                                    onClick={() =>
                                        window.print()
                                    }
                                    style={{
                                        padding:
                                            "11px 22px",
                                        border:
                                            "none",
                                        borderRadius:
                                            "8px",
                                        background:
                                            "#0B5D3F",
                                        color:
                                            "#fff",
                                        cursor:
                                            "pointer",
                                        fontWeight:
                                            "bold",
                                    }}
                                >
                                    🖨️ طباعة
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                العنوان
            ===================================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginBottom: "25px",
                }}
            >

                <div>
                    <h2
                        style={{
                            margin: 0,
                            color: "#0B5D3F",
                            fontSize: "28px",
                        }}
                    >
                        🛒 إدارة المبيعات
                    </h2>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#777",
                        }}
                    >
                        إدارة فواتير البيع
                        ومتابعة حركة المبيعات
                    </p>
                </div>

                <button
                    onClick={openNewSale}
                    style={{
                        padding: "12px 22px",
                        background: "#198754",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "15px",
                        fontWeight: "bold",
                    }}
                >
                    ➕ فاتورة بيع جديدة
                </button>

            </div>

            {/* =====================================================
                رسالة الخطأ
            ===================================================== */}

            {error && (
                <div
                    style={{
                        background: "#f8d7da",
                        color: "#842029",
                        padding: "15px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        fontWeight: "bold",
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {/* =====================================================
                الإحصائيات
            ===================================================== */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "18px",
                    marginBottom: "25px",
                }}
            >

                <StatCard
                    title="🧾 إجمالي الفواتير"
                    value={totalInvoices}
                    color="#0B5D3F"
                />

                <StatCard
                    title="💰 إجمالي المبيعات"
                    value={`${totalSales.toLocaleString()} ج.م`}
                    color="#0d6efd"
                />

                <StatCard
                    title="🏷️ إجمالي الخصومات"
                    value={`${totalDiscount.toLocaleString()} ج.م`}
                    color="#dc3545"
                />

            </div>

            {/* =====================================================
                البحث
            ===================================================== */}

            <div
                style={{
                    background: "#fff",
                    padding: "18px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,.08)",
                }}
            >
                <input
                    type="text"
                    placeholder="🔎 ابحث برقم الفاتورة أو اسم العميل..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px 15px",
                        border:
                            "1px solid #ddd",
                        borderRadius: "8px",
                        outline: "none",
                        fontSize: "15px",
                    }}
                />
            </div>

            {/* =====================================================
                التحميل / جدول الفواتير
            ===================================================== */}

            {loading ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "40px",
                        textAlign: "center",
                        borderRadius: "12px",
                        color: "#777",
                    }}
                >
                    ⏳ جاري تحميل الفواتير...
                </div>
            ) : (
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "12px",
                        overflowX: "auto",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,.08)",
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            minWidth: "980px",
                            borderCollapse:
                                "collapse",
                        }}
                    >

                        <thead
                            style={{
                                background:
                                    "#0B5D3F",
                                color: "#fff",
                            }}
                        >
                            <tr>

                                <th style={thStyle}>
                                    #
                                </th>

                                <th style={thStyle}>
                                    رقم الفاتورة
                                </th>

                                <th style={thStyle}>
                                    العميل
                                </th>

                                <th style={thStyle}>
                                    التاريخ
                                </th>

                                <th style={thStyle}>
                                    الإجمالي
                                </th>

                                <th style={thStyle}>
                                    الخصم
                                </th>

                                <th style={thStyle}>
                                    الصافي
                                </th>

                                <th style={thStyle}>
                                    الإجراءات
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {filteredSales.length > 0 ? (
                                filteredSales.map(
                                    (
                                        sale,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                sale.saleID
                                            }
                                        >

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {index +
                                                    1}
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold",
                                                    color:
                                                        "#0B5D3F",
                                                }}
                                            >
                                                #
                                                {
                                                    sale.saleID
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                {
                                                    sale.customerName ||
                                                    "غير محدد"
                                                }
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {sale.saleDate
                                                    ? new Date(
                                                        sale.saleDate
                                                    ).toLocaleString(
                                                        "ar-EG"
                                                    )
                                                    : "غير محدد"}
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >
                                                {Number(
                                                    sale.totalAmount ||
                                                    0
                                                ).toLocaleString()}{" "}
                                                ج.م
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    color:
                                                        Number(
                                                            sale.discount ||
                                                            0
                                                        ) >
                                                            0
                                                            ? "#dc3545"
                                                            : "#777",
                                                }}
                                            >
                                                {Number(
                                                    sale.discount ||
                                                    0
                                                ).toLocaleString()}{" "}
                                                ج.م
                                            </td>

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "bold",
                                                    color:
                                                        "#198754",
                                                }}
                                            >
                                                {Number(
                                                    sale.netAmount ||
                                                    0
                                                ).toLocaleString()}{" "}
                                                ج.م
                                            </td>

                                            <td
                                                style={
                                                    tdStyle
                                                }
                                            >

                                                {/* عرض */}

                                                <button
                                                    onClick={() =>
                                                        viewSale(
                                                            sale
                                                        )
                                                    }
                                                    style={
                                                        viewButton
                                                    }
                                                >
                                                    👁️ عرض
                                                </button>

                                                {/* تعديل */}

                                                <button
                                                    onClick={() =>
                                                        openEditSale(
                                                            sale.saleID
                                                        )
                                                    }
                                                    style={
                                                        editButton
                                                    }
                                                >
                                                    ✏️ تعديل
                                                </button>

                                                {/* حذف */}

                                                <button
                                                    onClick={() =>
                                                        deleteSale(
                                                            sale.saleID
                                                        )
                                                    }
                                                    style={
                                                        deleteButton
                                                    }
                                                >
                                                    🗑️
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "40px",
                                            color:
                                                "#777",
                                        }}
                                    >
                                        لا توجد فواتير
                                        مبيعات
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}

// =====================================================
// كارت الإحصائيات
// =====================================================

function StatCard({
    title,
    value,
    color,
}) {
    return (
        <div
            style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,.08)",
            }}
        >
            <div
                style={{
                    color: "#777",
                    fontSize: "15px",
                }}
            >
                {title}
            </div>

            <h2
                style={{
                    margin: "10px 0 0",
                    color,
                    fontSize: "25px",
                }}
            >
                {value}
            </h2>
        </div>
    );
}

// =====================================================
// Styles
// =====================================================

const thStyle = {
    padding: "14px 12px",
    textAlign: "center",
};

const tdStyle = {
    padding: "14px 12px",
    textAlign: "center",
    borderBottom:
        "1px solid #eee",
};

const viewButton = {
    border: "none",
    background: "#cff4fc",
    color: "#055160",
    padding: "7px 11px",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "5px",
};

const editButton = {
    border: "none",
    background: "#fff3cd",
    color: "#664d03",
    padding: "7px 11px",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "5px",
};

const deleteButton = {
    border: "none",
    background: "#f8d7da",
    color: "#842029",
    padding: "7px 11px",
    borderRadius: "6px",
    cursor: "pointer",
};

export default Sales;
