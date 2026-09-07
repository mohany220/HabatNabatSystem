import { useEffect, useState } from "react";

import { apiGet, API_ENDPOINTS } from "./api.js";

function Reports() {
    const [reportType, setReportType] = useState("summary");
    const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });

    const [summaryData, setSummaryData] = useState(null);
    const [salesByPeriodData, setSalesByPeriodData] = useState(null);
    const [topProductsData, setTopProductsData] = useState([]);
    const [lowStockData, setLowStockData] = useState([]);
    const [outOfStockData, setOutOfStockData] = useState([]);
    const [salesByCustomerData, setSalesByCustomerData] = useState([]);
    const [salesByProductData, setSalesByProductData] = useState([]);
    const [inventoryValueData, setInventoryValueData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // Fetch report data
    // =====================================================
    const fetchReport = async (type) => {
        setLoading(true);
        setError("");

        try {
            const { fromDate, toDate } = dateRange;
            const params = new URLSearchParams();
            if (fromDate) params.append("fromDate", fromDate);
            if (toDate) params.append("toDate", toDate);

            const queryString = params.toString();
            const url = `${API_ENDPOINTS.REPORTS}/${type}${queryString ? `?${queryString}` : ""}`;
            const response = await apiGet(url);

            if (!response.ok) {
                throw new Error("فشل تحميل التقرير");
            }

            const data = await response.json();

            switch (type) {
                case "summary":
                    setSummaryData(data);
                    break;
                case "sales-by-period":
                    setSalesByPeriodData(data);
                    break;
                case "top-products":
                    setTopProductsData(data);
                    break;
                case "low-stock-products":
                    setLowStockData(data);
                    break;
                case "out-of-stock":
                    setOutOfStockData(data);
                    break;
                case "sales-by-customer":
                    setSalesByCustomerData(data);
                    break;
                case "sales-by-product":
                    setSalesByProductData(data);
                    break;
                case "inventory-value":
                    setInventoryValueData(data);
                    break;
            }
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحميل بيانات التقرير");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // Fetch all reports data on load
    // =====================================================
    useEffect(() => {
        fetchReport("summary");
        fetchReport("top-products");
        fetchReport("low-stock-products");
        fetchReport("out-of-stock");
        fetchReport("sales-by-customer");
        fetchReport("sales-by-product");
        fetchReport("inventory-value");
    }, []);

    // =====================================================
    // Handle date range change
    // =====================================================
    const handleDateRangeChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    const applyDateFilter = () => {
        fetchReport("summary");
        fetchReport("sales-by-period");
        fetchReport("top-products");
        fetchReport("low-stock-products");
        fetchReport("out-of-stock");
        fetchReport("sales-by-customer");
        fetchReport("sales-by-product");
        fetchReport("inventory-value");
    };

    // =====================================================
    // Quick date filters
    // =====================================================
    const setQuickDate = (period) => {
        const today = new Date();
        let fromDate, toDate;

        switch (period) {
            case "today":
                fromDate = toDate = today.toISOString().split("T")[0];
                break;
            case "yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                fromDate = toDate = yesterday.toISOString().split("T")[0];
                break;
            case "week":
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                fromDate = weekStart.toISOString().split("T")[0];
                toDate = today.toISOString().split("T")[0];
                break;
            case "month":
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
                toDate = today.toISOString().split("T")[0];
                break;
            case "prevmonth":
                const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                fromDate = prevMonthStart.toISOString().split("T")[0];
                toDate = prevMonthEnd.toISOString().split("T")[0];
                break;
        }

        setDateRange({ fromDate: fromDate || "", toDate: toDate || "" });
        applyDateFilter();
    };

    // =====================================================
    // Format currency
    // =====================================================
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "0 ج.م";
        return Number(value).toLocaleString("ar-EG") + " ج.م";
    };

    // =====================================================
    // Render report content
    // =====================================================
    const renderReportContent = () => {
        switch (reportType) {
            case "summary":
                return renderSummaryReport();
            case "sales-by-period":
                return renderSalesByPeriodReport();
            case "top-products":
                return renderTopProductsReport();
            case "low-stock-products":
                return renderLowStockReport();
            case "out-of-stock":
                return renderOutOfStockReport();
            case "sales-by-customer":
                return renderSalesByCustomerReport();
            case "sales-by-product":
                return renderSalesByProductReport();
            case "inventory-value":
                return renderInventoryValueReport();
            default:
                return renderSummaryReport();
        }
    };

    const getValue = (obj, ...keys) => {
    for (const key of keys) {
        if (obj[key] !== undefined && obj[key] !== null) {
            return obj[key];
        }
    }
    return 0;
};

const renderSummaryReport = () => {
        if (!summaryData) return <div className="loading">⏳ جاري التحميل...</div>;

        return (
            <div style={gridContainerStyle}>
                <StatCard title="💰 إجمالي المبيعات" value={formatCurrency(getValue(summaryData, 'TotalSales', 'totalSales'))} color="#198754" />
                <StatCard title="🧾 عدد الفواتير" value={getValue(summaryData, 'TotalInvoices', 'totalInvoices')} color="#0d6efd" />
                <StatCard title="🏷️ إجمالي الخصومات" value={formatCurrency(getValue(summaryData, 'TotalDiscounts', 'totalDiscounts'))} color="#dc3545" />
                <StatCard title="💵 صافي المبيعات" value={formatCurrency(getValue(summaryData, 'NetSales', 'netSales'))} color="#20c997" />
            </div>
        );
    };

    const renderSalesByPeriodReport = () => {
        if (!salesByPeriodData) return <div className="loading">⏳ جاري التحميل...</div>;

        const { Summary, Sales } = salesByPeriodData;

        return (
            <div>
                <div style={gridContainerStyle}>
                    <StatCard title="💰 إجمالي المبيعات" value={formatCurrency(getValue(Summary, 'TotalSales', 'totalSales'))} color="#198754" />
                    <StatCard title="🧾 عدد الفواتير" value={getValue(Summary, 'TotalInvoices', 'totalInvoices')} color="#0d6efd" />
                    <StatCard title="🏷️ إجمالي الخصومات" value={formatCurrency(getValue(Summary, 'TotalDiscounts', 'totalDiscounts'))} color="#dc3545" />
                    <StatCard title="💵 صافي المبيعات" value={formatCurrency(getValue(Summary, 'NetSales', 'netSales'))} color="#20c997" />
                </div>
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead style={theadStyle}>
                            <tr>
                                <th style={thStyle}>رقم الفاتورة</th>
                                <th style={thStyle}>التاريخ</th>
                                <th style={thStyle}>العميل</th>
                                <th style={thStyle}>الإجمالي</th>
                                <th style={thStyle}>الخصم</th>
                                <th style={thStyle}>الصافي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(Sales || []).map((sale, index) => (
                                <tr key={getValue(sale, 'SaleID', 'saleID')} style={trStyle}>
                                    <td style={tdStyle}>#{getValue(sale, 'SaleID', 'saleID')}</td>
                                    <td style={tdStyle}>{getValue(sale, 'SaleDate', 'saleDate') ? new Date(getValue(sale, 'SaleDate', 'saleDate')).toLocaleDateString("ar-EG") : "-"}</td>
                                    <td style={tdStyle}>{getValue(sale, 'CustomerName', 'customerName')}</td>
                                    <td style={tdStyle}>{formatCurrency(getValue(sale, 'TotalAmount', 'totalAmount'))}</td>
                                    <td style={tdStyle}>{formatCurrency(getValue(sale, 'Discount', 'discount'))}</td>
                                    <td style={tdStyle}><strong>{formatCurrency(getValue(sale, 'NetAmount', 'netAmount'))}</strong></td>
                                </tr>
                            ))}
                            {(!Sales || Sales.length === 0) && (
                                <tr><td colSpan="6" style={tdStyle} style={{textAlign: "center"}}>لا توجد فواتير في هذه الفترة</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderTopProductsReport = () => {
        if (!topProductsData || topProductsData.length === 0) return <div className="loading">⏳ جاري التحميل...</div>;

        return (
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>المنتج</th>
                            <th style={thStyle}>إجمالي الكمية</th>
                            <th style={thStyle}>إجمالي المبلغ</th>
                            <th style={thStyle}>عدد الفواتير</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProductsData.map((product, index) => (
                            <tr key={getValue(product, 'ProductID', 'productID')} style={trStyle}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}><strong>{getValue(product, 'ProductName', 'productName')}</strong></td>
                                <td style={tdStyle}>{Number(getValue(product, 'TotalQuantity', 'totalQuantity')).toLocaleString("ar-EG")}</td>
                                <td style={tdStyle}>{formatCurrency(getValue(product, 'TotalAmount', 'totalAmount'))}</td>
                                <td style={tdStyle}>{getValue(product, 'InvoiceCount', 'invoiceCount')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderLowStockReport = () => {
        if (!lowStockData || lowStockData.length === 0) return <div style={{textAlign: "center", padding: "40px", color: "#777"}}><h3>✅ لا توجد منتجات منخفضة المخزون</h3></div>;

        return (
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>المنتج</th>
                            <th style={thStyle}>الوزن</th>
                            <th style={thStyle}>السعر</th>
                            <th style={thStyle}>الكمية المتاحة</th>
                            <th style={thStyle}>القيمة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockData.map((product, index) => (
                            <tr key={getValue(product, 'ProductID', 'productID')} style={trStyle}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}><strong>{getValue(product, 'ProductName', 'productName')}</strong></td>
                                <td style={tdStyle}>{getValue(product, 'Weight', 'weight') || "-"}</td>
                                <td style={tdStyle}>{formatCurrency(getValue(product, 'Price', 'price'))}</td>
                                <td style={tdStyle} style={{color: "#fd7e14", fontWeight: "bold", fontSize: "18px"}}>{Number(getValue(product, 'StockQuantity', 'stockQuantity')).toLocaleString("ar-EG")}</td>
                                <td style={tdStyle}>{formatCurrency(getValue(product, 'Value', 'value'))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderOutOfStockReport = () => {
        if (!outOfStockData || outOfStockData.length === 0) return <div style={{textAlign: "center", padding: "40px", color: "#777"}}><h3>✅ لا توجد منتجات نافدة</h3></div>;

        return (
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>المنتج</th>
                            <th style={thStyle}>الوزن</th>
                            <th style={thStyle}>السعر</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outOfStockData.map((product, index) => (
                            <tr key={getValue(product, 'ProductID', 'productID')} style={trStyle}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}><strong>{getValue(product, 'ProductName', 'productName')}</strong></td>
                                <td style={tdStyle}>{getValue(product, 'Weight', 'weight') || "-"}</td>
                                <td style={tdStyle}>{formatCurrency(getValue(product, 'Price', 'price'))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderSalesByCustomerReport = () => {
        if (!salesByCustomerData || salesByCustomerData.length === 0) return <div className="loading">⏳ جاري التحميل...</div>;

        return (
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>العميل</th>
                            <th style={thStyle}>إجمالي المبيعات</th>
                            <th style={thStyle}>إجمالي الخصومات</th>
                            <th style={thStyle}>صافي المبيعات</th>
                            <th style={thStyle}>عدد الفواتير</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesByCustomerData.map((customer, index) => (
                            <tr key={getValue(customer, 'CustomerID', 'customerID')} style={trStyle}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}><strong>{getValue(customer, 'CustomerName', 'customerName')}</strong></td>
                                <td style={tdStyle}>{formatCurrency(getValue(customer, 'TotalSales', 'totalSales'))}</td>
                                <td style={tdStyle}>{formatCurrency(getValue(customer, 'TotalDiscounts', 'totalDiscounts'))}</td>
                                <td style={tdStyle}><strong>{formatCurrency(getValue(customer, 'NetSales', 'netSales'))}</strong></td>
                                <td style={tdStyle}>{getValue(customer, 'InvoiceCount', 'invoiceCount')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderSalesByProductReport = () => {
        if (!salesByProductData || salesByProductData.length === 0) return <div className="loading">⏳ جاري التحميل...</div>;

        return (
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>المنتج</th>
                            <th style={thStyle}>إجمالي الكمية</th>
                            <th style={thStyle}>إجمالي المبلغ</th>
                            <th style={thStyle}>عدد الفواتير</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesByProductData.map((product, index) => (
                            <tr key={getValue(product, 'ProductID', 'productID')} style={trStyle}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}><strong>{getValue(product, 'ProductName', 'productName')}</strong></td>
                                <td style={tdStyle}>{Number(getValue(product, 'TotalQuantity', 'totalQuantity')).toLocaleString("ar-EG")}</td>
                                <td style={tdStyle}>{formatCurrency(getValue(product, 'TotalAmount', 'totalAmount'))}</td>
                                <td style={tdStyle}>{getValue(product, 'InvoiceCount', 'invoiceCount')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderInventoryValueReport = () => {
        if (!inventoryValueData) return <div className="loading">⏳ جاري التحميل...</div>;

        return (
            <div>
                <div style={gridContainerStyle}>
                    <StatCard title="📦 إجمالي قيمة المخزون" value={formatCurrency(getValue(inventoryValueData, 'TotalInventoryValue', 'totalInventoryValue'))} color="#198754" />
                    <StatCard title="📊 إجمالي المنتجات" value={getValue(inventoryValueData, 'TotalProducts', 'totalProducts')} color="#0d6efd" />
                    <StatCard title="📈 إجمالي الكمية" value={Number(getValue(inventoryValueData, 'TotalQuantity', 'totalQuantity')).toLocaleString("ar-EG")} color="#fd7e14" />
                </div>
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead style={theadStyle}>
                            <tr>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>المنتج</th>
                                <th style={thStyle}>الوزن</th>
                                <th style={thStyle}>السعر</th>
                                <th style={thStyle}>الكمية</th>
                                <th style={thStyle}>القيمة الإجمالية</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(getValue(inventoryValueData, 'Products', 'products') || []).map((product, index) => (
                                <tr key={getValue(product, 'ProductID', 'productID')} style={trStyle}>
                                    <td style={tdStyle}>{index + 1}</td>
                                    <td style={tdStyle}><strong>{getValue(product, 'ProductName', 'productName')}</strong></td>
                                    <td style={tdStyle}>{getValue(product, 'Weight', 'weight') || "-"}</td>
                                    <td style={tdStyle}>{formatCurrency(getValue(product, 'Price', 'price'))}</td>
                                    <td style={tdStyle}>{Number(getValue(product, 'StockQuantity', 'stockQuantity')).toLocaleString("ar-EG")}</td>
                                    <td style={tdStyle}><strong>{formatCurrency(getValue(product, 'TotalValue', 'totalValue'))}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // =====================================================
    // Render
    // =====================================================
    return (
        <div dir="rtl" style={{ padding: "25px", background: "#f5f7f9", minHeight: "100vh", boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ marginBottom: "25px" }}>
                <h2 style={{ margin: 0, color: "#0B5D3F", fontSize: "28px" }}>📊 التقارير</h2>
                <p style={{ color: "#777", marginTop: "8px" }}>متابعة المبيعات والمخزون والحركة المالية</p>
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: "#f8d7da", color: "#842029", padding: "15px", borderRadius: "10px", marginBottom: "20px", fontWeight: "bold" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Date Filter */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
                <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#0B5D3F" }}>📅 فلترة بالتاريخ</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
                    <button onClick={() => setQuickDate("today")} style={filterButtonStyle}>اليوم</button>
                    <button onClick={() => setQuickDate("yesterday")} style={filterButtonStyle}>أمس</button>
                    <button onClick={() => setQuickDate("week")} style={filterButtonStyle}>هذا الأسبوع</button>
                    <button onClick={() => setQuickDate("month")} style={filterButtonStyle}>هذا الشهر</button>
                    <button onClick={() => setQuickDate("prevmonth")} style={filterButtonStyle}>الشهر السابق</button>
                </div>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "end" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>من تاريخ</label>
                        <input type="date" name="fromDate" value={dateRange.fromDate} onChange={handleDateRangeChange} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>إلى تاريخ</label>
                        <input type="date" name="toDate" value={dateRange.toDate} onChange={handleDateRangeChange} style={inputStyle} />
                    </div>
                    <button onClick={applyDateFilter} disabled={loading} style={{...buttonStyle, padding: "12px 24px"}}>
                        {loading ? "⏳ جاري التطبيق..." : "🔍 تطبيق الفلتر"}
                    </button>
                </div>
            </div>

            {/* Report Type Selection */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
                <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#0B5D3F" }}>📋 نوع التقرير</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={() => setReportType("summary")} style={{...reportTabStyle, background: reportType === "summary" ? "#0B5D3F" : "#eee", color: reportType === "summary" ? "#fff" : "#333"}}>
                        📊 ملخص تنفيذي
                    </button>
                    <button onClick={() => setReportType("sales-by-period")} style={{...reportTabStyle, background: reportType === "sales-by-period" ? "#0B5D3F" : "#eee", color: reportType === "sales-by-period" ? "#fff" : "#333"}}>
                        📅 مبيعات حسب الفترة
                    </button>
                    <button onClick={() => setReportType("top-products")} style={{...reportTabStyle, background: reportType === "top-products" ? "#0B5D3F" : "#eee", color: reportType === "top-products" ? "#fff" : "#333"}}>
                        🏆 أعلى المنتجات مبيعاً
                    </button>
                    <button onClick={() => setReportType("sales-by-customer")} style={{...reportTabStyle, background: reportType === "sales-by-customer" ? "#0B5D3F" : "#eee", color: reportType === "sales-by-customer" ? "#fff" : "#333"}}>
                        👥 مبيعات حسب العميل
                    </button>
                    <button onClick={() => setReportType("sales-by-product")} style={{...reportTabStyle, background: reportType === "sales-by-product" ? "#0B5D3F" : "#eee", color: reportType === "sales-by-product" ? "#fff" : "#333"}}>
                        📦 مبيعات حسب المنتج
                    </button>
                    <button onClick={() => setReportType("low-stock-products")} style={{...reportTabStyle, background: reportType === "low-stock-products" ? "#0B5D3F" : "#eee", color: reportType === "low-stock-products" ? "#fff" : "#333"}}>
                        ⚠️ مخزون منخفض
                    </button>
                    <button onClick={() => setReportType("out-of-stock")} style={{...reportTabStyle, background: reportType === "out-of-stock" ? "#0B5D3F" : "#eee", color: reportType === "out-of-stock" ? "#fff" : "#333"}}>
                        🚫 منتجات نافدة
                    </button>
                    <button onClick={() => setReportType("inventory-value")} style={{...reportTabStyle, background: reportType === "inventory-value" ? "#0B5D3F" : "#eee", color: reportType === "inventory-value" ? "#fff" : "#333"}}>
                        💰 قيمة المخزون
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 3px 15px rgba(0,0,0,.08)", overflow: "hidden" }}>
                <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
                    <h3 style={{ margin: 0, color: "#0B5D3F" }}>
                        {reportType === "summary" && "📊 ملخص تنفيذي"}
                        {reportType === "sales-by-period" && "📅 مبيعات حسب الفترة"}
                        {reportType === "top-products" && "🏆 أعلى المنتجات مبيعاً"}
                        {reportType === "sales-by-customer" && "👥 مبيعات حسب العميل"}
                        {reportType === "sales-by-product" && "📦 مبيعات حسب المنتج"}
                        {reportType === "low-stock-products" && "⚠️ تنبيهات المخزون المنخفض"}
                        {reportType === "out-of-stock" && "🚫 منتجات نافدة المخزون"}
                        {reportType === "inventory-value" && "💰 إجمالي قيمة المخزون"}
                    </h3>
                </div>
                <div style={{ padding: "20px" }}>
                    {renderReportContent()}
                </div>
            </div>
        </div>
    );
}

// =====================================================
// StatCard Component
// =====================================================
function StatCard({ title, value, color }) {
    return (
        <div style={{
            background: "#fff",
            padding: "22px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            borderRight: `5px solid ${color}`,
        }}>
            <p style={{ margin: 0, color: "#777", fontSize: "14px" }}>{title}</p>
            <h2 style={{ margin: "10px 0 0", color, fontSize: "24px" }}>{value}</h2>
        </div>
    );
}

// =====================================================
// Styles
// =====================================================
const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
};

const tableContainerStyle = {
    overflowX: "auto",
};

const tableStyle = {
    width: "100%",
    minWidth: "700px",
    borderCollapse: "collapse",
};

const theadStyle = {
    background: "#0B5D3F",
    color: "#fff",
};

const thStyle = {
    padding: "14px 12px",
    textAlign: "center",
    fontWeight: "bold",
};

const tdStyle = {
    padding: "14px 12px",
    textAlign: "center",
    borderBottom: "1px solid #eee",
};

const trStyle = {
    transition: "background 0.2s",
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
};

const buttonStyle = {
    background: "#0B5D3F",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
};

const filterButtonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    background: "#e8f5e9",
    color: "#0B5D3F",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
};

const reportTabStyle = {
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
};

export default Reports;