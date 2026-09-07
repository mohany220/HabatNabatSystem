import { useEffect, useState } from "react";

import { apiGet, apiPost, apiPut, API_ENDPOINTS } from "./api.js";

function NewSale({ onBack, saleToEdit }) {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [customerID, setCustomerID] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");

    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState("");

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // هل نحن في وضع التعديل؟
    // =========================
    const isEditMode =
        saleToEdit !== null &&
        saleToEdit !== undefined;

    // =========================
    // تحميل العملاء والمنتجات
    // =========================
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                customersResponse,
                productsResponse,
            ] = await Promise.all([
                apiGet(`${API_ENDPOINTS.CUSTOMERS}`),
                apiGet(`${API_ENDPOINTS.PRODUCTS}`),
            ]);

            if (!customersResponse.ok) {
                throw new Error("فشل تحميل العملاء");
            }

            if (!productsResponse.ok) {
                throw new Error("فشل تحميل المنتجات");
            }

            const customersData =
                await customersResponse.json();

            const productsData =
                await productsResponse.json();

            setCustomers(customersData);

            // المنتجات النشطة فقط
            setProducts(
                productsData.filter(
                    (product) => product.isActive
                )
            );

            // =========================
            // تحميل بيانات الفاتورة عند التعديل
            // =========================
            if (saleToEdit) {
                setCustomerID(
                    String(
                        saleToEdit.customerID || ""
                    )
                );

                setCustomerSearch(
                    saleToEdit.customerName || ""
                );

                setDiscount(
                    Number(
                        saleToEdit.discount || 0
                    )
                );

                setNotes(
                    saleToEdit.notes || ""
                );

                const oldItems =
                    Array.isArray(
                        saleToEdit.saleDetails
                    )
                        ? saleToEdit.saleDetails.map(
                            (detail) => ({
                                productID:
                                    Number(
                                        detail.productID
                                    ),

                                quantity:
                                    Number(
                                        detail.quantity
                                    ),

                                unitPrice:
                                    Number(
                                        detail.unitPrice
                                    ),
                            })
                        )
                        : [];

                setItems(oldItems);
            }
        } catch (err) {
            console.error(err);

            setError(
                "حدث خطأ أثناء تحميل العملاء أو المنتجات"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // العملاء النشطين
    // =========================
    const activeCustomers =
        customers.filter(
            (customer) =>
                customer.isActive
        );

    // =========================
    // بحث العميل
    // =========================
    const filteredCustomers =
        activeCustomers.filter(
            (customer) => {
                const searchText =
                    customerSearch
                        .trim()
                        .toLowerCase();

                if (!searchText) {
                    return true;
                }

                const name = String(
                    customer.customerName ||
                    ""
                ).toLowerCase();

                const phone = String(
                    customer.phone || ""
                ).toLowerCase();

                const customerId = String(
                    customer.customerID ||
                    ""
                ).toLowerCase();

                return (
                    name.includes(
                        searchText
                    ) ||
                    phone.includes(
                        searchText
                    ) ||
                    customerId.includes(
                        searchText
                    )
                );
            }
        );

    // =========================
    // اختيار العميل
    // =========================
    const selectCustomer = (id) => {
        setCustomerID(String(id));

        const selectedCustomer =
            customers.find(
                (customer) =>
                    customer.customerID ===
                    Number(id)
            );

        if (selectedCustomer) {
            setCustomerSearch(
                selectedCustomer.customerName
            );
        }
    };

    // =========================
    // إضافة منتج للفاتورة
    // =========================
    const addProduct = () => {
        setItems([
            ...items,
            {
                productID: "",
                quantity: 1,
                unitPrice: 0,
            },
        ]);
    };

    // =========================
    // حذف منتج
    // =========================
    const removeItem = (index) => {
        setItems(
            items.filter(
                (_, i) => i !== index
            )
        );
    };

    // =========================
    // تغيير المنتج
    // =========================
    const changeProduct = (
        index,
        productID
    ) => {
        const selectedProduct =
            products.find(
                (product) =>
                    product.productID ===
                    Number(productID)
            );

        const newItems = [...items];

        newItems[index] = {
            ...newItems[index],

            productID: Number(productID),

            quantity: 1,

            unitPrice: selectedProduct
                ? Number(
                    selectedProduct.price
                )
                : 0,
        };

        setItems(newItems);
    };

    // =========================
    // تغيير الكمية
    // =========================
    const changeQuantity = (
        index,
        quantity
    ) => {
        const newItems = [...items];

        newItems[index].quantity =
            Math.max(
                1,
                Number(quantity) || 1
            );

        setItems(newItems);
    };

    // =========================
    // تغيير السعر
    // =========================
    const changePrice = (
        index,
        price
    ) => {
        const newItems = [...items];

        newItems[index].unitPrice =
            Math.max(
                0,
                Number(price) || 0
            );

        setItems(newItems);
    };

    // =========================
    // إجمالي الفاتورة
    // =========================
    const totalAmount = items.reduce(
        (sum, item) =>
            sum +
            Number(
                item.quantity || 0
            ) *
            Number(
                item.unitPrice || 0
            ),
        0
    );

    const discountValue = Math.max(
        0,
        Number(discount) || 0
    );

    const netAmount = Math.max(
        0,
        totalAmount -
        discountValue
    );

    // =========================
    // حفظ / تعديل الفاتورة
    // =========================
    const saveSale = async () => {
        setError("");

        // =========================
        // التحقق من العميل
        // =========================
        if (!customerID) {
            setError(
                "من فضلك اختر العميل"
            );
            return;
        }

        // =========================
        // التحقق من المنتجات
        // =========================
        if (items.length === 0) {
            setError(
                "من فضلك أضف منتجًا واحدًا على الأقل"
            );
            return;
        }

        // =========================
        // التحقق من كل سطر
        // =========================
        for (const item of items) {
            if (!item.productID) {
                setError(
                    "من فضلك اختر المنتج في جميع السطور"
                );
                return;
            }

            if (
                Number(item.quantity) <= 0
            ) {
                setError(
                    "الكمية يجب أن تكون أكبر من صفر"
                );
                return;
            }

            if (
                Number(item.unitPrice) < 0
            ) {
                setError(
                    "السعر لا يمكن أن يكون سالبًا"
                );
                return;
            }

            const product =
                products.find(
                    (p) =>
                        p.productID ===
                        Number(
                            item.productID
                        )
                );

            // =========================
            // التحقق من المخزون
            // =========================
            if (
                product &&
                Number(
                    product.stockQuantity
                ) <
                Number(
                    item.quantity
                )
            ) {
                setError(
                    `المنتج ${product.productName} لا يوجد منه كمية كافية في المخزن. المتاح: ${product.stockQuantity}`
                );

                return;
            }
        }

        // =========================
        // التحقق من الخصم
        // =========================
        if (
            discountValue >
            totalAmount
        ) {
            setError(
                "الخصم لا يمكن أن يكون أكبر من إجمالي الفاتورة"
            );

            return;
        }

        // =========================
        // بيانات الفاتورة
        // =========================
        const saleData = {
            customerID:
                Number(customerID),

            saleDate:
                isEditMode && saleToEdit?.saleDate
                    ? saleToEdit.saleDate
                    : new Date().toISOString(),

            discount:
                discountValue,

            notes: notes,

            saleDetails:
                items.map((item) => ({
                    productID:
                        Number(
                            item.productID
                        ),

                    quantity:
                        Number(
                            item.quantity
                        ),

                    unitPrice:
                        Number(
                            item.unitPrice
                        ),
                })),
        };

        try {
            setSaving(true);

            // =========================
            // تحديد POST أو PUT
            // =========================
            const url = isEditMode
                ? `${API_ENDPOINTS.SALES}/${saleToEdit.saleID}`
                : `${API_ENDPOINTS.SALES}`;

            const response = isEditMode
                ? await apiPut(url, saleData)
                : await apiPost(url, saleData);

            let data;

            try {
                data =
                    await response.json();
            } catch {
                data = null;
            }

            if (!response.ok) {
                throw new Error(
                    typeof data ===
                        "string"
                        ? data
                        : data?.message ||
                        data?.title ||
                        "فشل حفظ الفاتورة"
                );
            }

            // =========================
            // رسالة النجاح
            // =========================
            if (isEditMode) {
                alert(
                    `تم تعديل الفاتورة بنجاح ✅

رقم الفاتورة: #${data?.saleID ||
                    saleToEdit.saleID
                    }

الإجمالي: ${Number(
                        data?.totalAmount ??
                        totalAmount
                    ).toLocaleString()} ج.م

الخصم: ${Number(
                        data?.discount ??
                        discountValue
                    ).toLocaleString()} ج.م

الصافي: ${Number(
                        data?.netAmount ??
                        netAmount
                    ).toLocaleString()} ج.م`
                );
            } else {
                alert(
                    `تم حفظ الفاتورة بنجاح ✅

رقم الفاتورة: #${data?.saleID || ""
                    }

الإجمالي: ${Number(
                        data?.totalAmount ??
                        totalAmount
                    ).toLocaleString()} ج.م

الخصم: ${Number(
                        data?.discount ??
                        discountValue
                    ).toLocaleString()} ج.م

الصافي: ${Number(
                        data?.netAmount ??
                        netAmount
                    ).toLocaleString()} ج.م`
                );
            }

            // =========================
            // الرجوع للمبيعات
            // =========================
            await onBack();
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "حدث خطأ أثناء حفظ الفاتورة"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // شاشة التحميل
    // =========================
    if (loading) {
        return (
            <div
                dir="rtl"
                style={{
                    padding: "40px",
                    textAlign:
                        "center",
                    background:
                        "#f5f7f9",
                    minHeight:
                        "100vh",
                    boxSizing:
                        "border-box",
                    color: "#555",
                    fontSize:
                        "18px",
                }}
            >
                ⏳ جاري تحميل البيانات...
            </div>
        );
    }

    return (
        <div
            dir="rtl"
            style={{
                padding: "25px",
                background:
                    "#f5f7f9",
                minHeight:
                    "100vh",
                boxSizing:
                    "border-box",
            }}
        >
            {/* =========================
                العنوان
            ========================= */}
            <div
                style={{
                    display:
                        "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    flexWrap:
                        "wrap",
                    gap: "15px",
                    marginBottom:
                        "25px",
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            color:
                                "#0B5D3F",
                            fontSize:
                                "28px",
                        }}
                    >
                        {isEditMode
                            ? `✏️ تعديل فاتورة #${saleToEdit.saleID}`
                            : "🧾 فاتورة بيع جديدة"}
                    </h2>

                    <p
                        style={{
                            marginTop:
                                "8px",
                            color:
                                "#777",
                        }}
                    >
                        {isEditMode
                            ? "تعديل بيانات الفاتورة وتحديث المخزون تلقائيًا"
                            : "إنشاء فاتورة بيع جديدة وتحديث المخزون تلقائيًا"}
                    </p>
                </div>

                <button
                    onClick={
                        onBack
                    }
                    disabled={
                        saving
                    }
                    style={{
                        padding:
                            "11px 20px",
                        background:
                            "#6c757d",
                        color:
                            "#fff",
                        border:
                            "none",
                        borderRadius:
                            "8px",
                        cursor:
                            saving
                                ? "not-allowed"
                                : "pointer",
                        fontSize:
                            "15px",
                        fontWeight:
                            "bold",
                    }}
                >
                    ↩️ رجوع للمبيعات
                </button>
            </div>

            {/* =========================
                رسالة الخطأ
            ========================= */}
            {error && (
                <div
                    style={{
                        background:
                            "#f8d7da",
                        color:
                            "#842029",
                        padding:
                            "15px",
                        borderRadius:
                            "10px",
                        marginBottom:
                            "20px",
                        fontWeight:
                            "bold",
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {/* =========================
                بيانات العميل
            ========================= */}
            <div
                style={
                    sectionStyle
                }
            >
                <h3
                    style={
                        sectionTitle
                    }
                >
                    👤 بيانات العميل
                </h3>

                <label
                    style={
                        labelStyle
                    }
                >
                    البحث عن العميل
                </label>

                <input
                    type="text"
                    value={
                        customerSearch
                    }
                    onChange={(e) => {
                        setCustomerSearch(
                            e.target
                                .value
                        );

                        if (
                            customerID &&
                            e.target
                                .value !==
                            customers.find(
                                (
                                    customer
                                ) =>
                                    customer.customerID ===
                                    Number(
                                        customerID
                                    )
                            )
                                ?.customerName
                        ) {
                            setCustomerID(
                                ""
                            );
                        }
                    }}
                    placeholder="🔎 اكتب اسم العميل أو رقم الهاتف أو رقم العميل..."
                    style={
                        inputStyle
                    }
                />

                {/* نتائج العملاء */}
                {customerSearch.trim() !==
                    "" &&
                    !customerID && (
                        <div
                            style={{
                                marginTop:
                                    "8px",
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "8px",
                                background:
                                    "#fff",
                                maxHeight:
                                    "220px",
                                overflowY:
                                    "auto",
                                boxShadow:
                                    "0 3px 10px rgba(0,0,0,.08)",
                            }}
                        >
                            {filteredCustomers.length >
                                0 ? (
                                filteredCustomers.map(
                                    (
                                        customer
                                    ) => (
                                        <button
                                            key={
                                                customer.customerID
                                            }
                                            type="button"
                                            onClick={() =>
                                                selectCustomer(
                                                    customer.customerID
                                                )
                                            }
                                            style={{
                                                display:
                                                    "block",
                                                width:
                                                    "100%",
                                                textAlign:
                                                    "right",
                                                padding:
                                                    "12px 15px",
                                                background:
                                                    "#fff",
                                                border:
                                                    "none",
                                                borderBottom:
                                                    "1px solid #eee",
                                                cursor:
                                                    "pointer",
                                                fontSize:
                                                    "15px",
                                            }}
                                            onMouseEnter={(
                                                e
                                            ) => {
                                                e.currentTarget.style.background =
                                                    "#f5f7f9";
                                            }}
                                            onMouseLeave={(
                                                e
                                            ) => {
                                                e.currentTarget.style.background =
                                                    "#fff";
                                            }}
                                        >
                                            <strong>
                                                {
                                                    customer.customerName
                                                }
                                            </strong>

                                            {customer.phone && (
                                                <span
                                                    style={{
                                                        marginRight:
                                                            "10px",
                                                        color:
                                                            "#777",
                                                        fontSize:
                                                            "13px",
                                                    }}
                                                >
                                                    📱{" "}
                                                    {
                                                        customer.phone
                                                    }
                                                </span>
                                            )}

                                            <span
                                                style={{
                                                    marginRight:
                                                        "10px",
                                                    color:
                                                        "#999",
                                                    fontSize:
                                                        "12px",
                                                }}
                                            >
                                                #
                                                {
                                                    customer.customerID
                                                }
                                            </span>
                                        </button>
                                    )
                                )
                            ) : (
                                <div
                                    style={{
                                        padding:
                                            "15px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#777",
                                    }}
                                >
                                    لا يوجد عميل مطابق للبحث
                                </div>
                            )}
                        </div>
                    )}

                {/* العميل المختار */}
                {customerID && (
                    <div
                        style={{
                            marginTop:
                                "12px",
                            padding:
                                "12px 15px",
                            background:
                                "#e8f5e9",
                            borderRadius:
                                "8px",
                            color:
                                "#0B5D3F",
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            gap: "10px",
                        }}
                    >
                        <strong>
                            ✅ العميل المختار:{" "}
                            {
                                customers.find(
                                    (
                                        customer
                                    ) =>
                                        customer.customerID ===
                                        Number(
                                            customerID
                                        )
                                )
                                    ?.customerName
                            }
                        </strong>

                        <button
                            type="button"
                            onClick={() => {
                                setCustomerID(
                                    ""
                                );
                                setCustomerSearch(
                                    ""
                                );
                            }}
                            style={{
                                border:
                                    "none",
                                background:
                                    "#f8d7da",
                                color:
                                    "#842029",
                                padding:
                                    "6px 10px",
                                borderRadius:
                                    "6px",
                                cursor:
                                    "pointer",
                            }}
                        >
                            تغيير
                        </button>
                    </div>
                )}
            </div>

            {/* =========================
                منتجات الفاتورة
            ========================= */}
            <div
                style={
                    sectionStyle
                }
            >
                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        marginBottom:
                            "15px",
                        gap: "10px",
                        flexWrap:
                            "wrap",
                    }}
                >
                    <h3
                        style={{
                            ...sectionTitle,
                            marginBottom:
                                0,
                        }}
                    >
                        📦 منتجات الفاتورة
                    </h3>

                    <button
                        onClick={
                            addProduct
                        }
                        style={
                            addButton
                        }
                    >
                        ➕ إضافة منتج
                    </button>
                </div>

                <div
                    style={{
                        overflowX:
                            "auto",
                    }}
                >
                    <table
                        style={{
                            width:
                                "100%",
                            minWidth:
                                "850px",
                            borderCollapse:
                                "collapse",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background:
                                        "#0B5D3F",
                                    color:
                                        "#fff",
                                }}
                            >
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
                                    المتاح
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
                                    السعر
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    الإجمالي
                                </th>

                                <th
                                    style={
                                        thStyle
                                    }
                                >
                                    حذف
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.length ===
                                0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "35px",
                                            color:
                                                "#777",
                                        }}
                                    >
                                        لم يتم إضافة
                                        منتجات
                                    </td>
                                </tr>
                            ) : (
                                items.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const selectedProduct =
                                            products.find(
                                                (
                                                    product
                                                ) =>
                                                    product.productID ===
                                                    Number(
                                                        item.productID
                                                    )
                                            );

                                        const lineTotal =
                                            Number(
                                                item.quantity ||
                                                0
                                            ) *
                                            Number(
                                                item.unitPrice ||
                                                0
                                            );

                                        return (
                                            <tr
                                                key={
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

                                                {/* المنتج */}
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <select
                                                        value={
                                                            item.productID
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            changeProduct(
                                                                index,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        style={{
                                                            ...inputStyle,
                                                            minWidth:
                                                                "220px",
                                                        }}
                                                    >
                                                        <option value="">
                                                            اختر
                                                            المنتج
                                                        </option>

                                                        {products.map(
                                                            (
                                                                product
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        product.productID
                                                                    }
                                                                    value={
                                                                        product.productID
                                                                    }
                                                                >
                                                                    {
                                                                        product.productName
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>

                                                {/* المتاح */}
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {selectedProduct
                                                        ? selectedProduct.stockQuantity
                                                        : "-"}
                                                </td>

                                                {/* الكمية */}
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            selectedProduct
                                                                ? selectedProduct.stockQuantity
                                                                : undefined
                                                        }
                                                        value={
                                                            item.quantity
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            changeQuantity(
                                                                index,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        style={{
                                                            ...smallInput,
                                                            width:
                                                                "80px",
                                                        }}
                                                    />
                                                </td>

                                                {/* السعر */}
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={
                                                            item.unitPrice
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            changePrice(
                                                                index,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        style={{
                                                            ...smallInput,
                                                            width:
                                                                "100px",
                                                        }}
                                                    />
                                                </td>

                                                {/* الإجمالي */}
                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight:
                                                            "bold",
                                                        color:
                                                            "#198754",
                                                    }}
                                                >
                                                    {lineTotal.toLocaleString()}{" "}
                                                    ج.م
                                                </td>

                                                {/* حذف */}
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    <button
                                                        onClick={() =>
                                                            removeItem(
                                                                index
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
                                        );
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =========================
                الملاحظات والحسابات
            ========================= */}
            <div
                style={{
                    display:
                        "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                }}
            >
                {/* الملاحظات */}
                <div
                    style={
                        sectionStyle
                    }
                >
                    <h3
                        style={
                            sectionTitle
                        }
                    >
                        📝 ملاحظات
                    </h3>

                    <textarea
                        value={
                            notes
                        }
                        onChange={(
                            e
                        ) =>
                            setNotes(
                                e.target
                                    .value
                            )
                        }
                        placeholder="اكتب ملاحظات الفاتورة..."
                        rows="5"
                        style={{
                            ...inputStyle,
                            resize:
                                "vertical",
                        }}
                    />
                </div>

                {/* الحسابات */}
                <div
                    style={
                        sectionStyle
                    }
                >
                    <h3
                        style={
                            sectionTitle
                        }
                    >
                        💰 حساب الفاتورة
                    </h3>

                    <div
                        style={
                            summaryRow
                        }
                    >
                        <span>
                            الإجمالي:
                        </span>

                        <strong>
                            {totalAmount.toLocaleString()}{" "}
                            ج.م
                        </strong>
                    </div>

                    <div
                        style={
                            summaryRow
                        }
                    >
                        <span>
                            الخصم:
                        </span>

                        <input
                            type="number"
                            min="0"
                            value={
                                discount
                            }
                            onChange={(
                                e
                            ) =>
                                setDiscount(
                                    e.target
                                        .value
                                )
                            }
                            style={{
                                ...smallInput,
                                width:
                                    "120px",
                            }}
                        />
                    </div>

                    <hr />

                    <div
                        style={{
                            ...summaryRow,
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
                            {netAmount.toLocaleString()}{" "}
                            ج.م
                        </strong>
                    </div>
                </div>
            </div>

            {/* =========================
                أزرار الحفظ
            ========================= */}
            <div
                style={{
                    marginTop:
                        "25px",
                    display:
                        "flex",
                    justifyContent:
                        "flex-start",
                    gap: "10px",
                    flexWrap:
                        "wrap",
                }}
            >
                <button
                    onClick={
                        saveSale
                    }
                    disabled={
                        saving
                    }
                    style={{
                        padding:
                            "14px 35px",
                        background:
                            saving
                                ? "#999"
                                : "#0B5D3F",
                        color:
                            "#fff",
                        border:
                            "none",
                        borderRadius:
                            "9px",
                        cursor:
                            saving
                                ? "not-allowed"
                                : "pointer",
                        fontSize:
                            "17px",
                        fontWeight:
                            "bold",
                    }}
                >
                    {saving
                        ? "⏳ جاري الحفظ..."
                        : isEditMode
                            ? "💾 حفظ التعديل"
                            : "💾 حفظ الفاتورة"}
                </button>

                <button
                    onClick={
                        onBack
                    }
                    disabled={
                        saving
                    }
                    style={{
                        padding:
                            "14px 25px",
                        background:
                            "#6c757d",
                        color:
                            "#fff",
                        border:
                            "none",
                        borderRadius:
                            "9px",
                        cursor:
                            saving
                                ? "not-allowed"
                                : "pointer",
                        fontSize:
                            "16px",
                        fontWeight:
                            "bold",
                    }}
                >
                    ↩️ إلغاء والعودة
                </button>
            </div>
        </div>
    );
}

/* =========================
   Styles
========================= */

const sectionStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow:
        "0 2px 8px rgba(0,0,0,.08)",
};

const sectionTitle = {
    marginTop: 0,
    color: "#0B5D3F",
};

const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#444",
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
    background: "#fff",
};

const smallInput = {
    padding: "9px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
};

const addButton = {
    padding: "10px 18px",
    background: "#198754",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
};

const deleteButton = {
    border: "none",
    background: "#f8d7da",
    color: "#842029",
    padding: "8px 11px",
    borderRadius: "6px",
    cursor: "pointer",
};

const thStyle = {
    padding: "13px 10px",
    textAlign: "center",
};

const tdStyle = {
    padding: "12px 10px",
    textAlign: "center",
    borderBottom:
        "1px solid #eee",
};

const summaryRow = {
    display: "flex",
    justifyContent:
        "space-between",
    alignItems: "center",
    padding: "10px 0",
};

export default NewSale;
