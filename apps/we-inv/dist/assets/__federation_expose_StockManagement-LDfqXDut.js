import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, B as Button, C as Card, I as Input, S as Select, b as Badge } from './components-B9X8f4qc.js';
import { b as formatNumber, f as formatCurrency } from './index-CjwST_Jq.js';

const {useState} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
function StockManagementPage() {
  const [filters, setFilters] = useState({
    vanCode: "",
    governorate: "",
    category: "",
    lowStock: false,
    page: 1,
    pageSize: 50
  });
  const { data: stockData, isLoading, refetch } = useQuery({
    queryKey: ["stock", filters],
    queryFn: async () => {
      const res = await api.getStock(filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  const stockDataSafe = stockData || [];
  const totalItems = stockDataSafe.length;
  const lowStockCount = stockDataSafe.filter((s) => s.quantity <= s.minQuantity).length;
  const outOfStockCount = stockDataSafe.filter((s) => s.quantity === 0).length;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "إدارة المخزون" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "متابعة مخزون الوحدات، تنبيهات النقص، تحويلات المخزون" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => alert("تصدير المخزون"), icon: "📥", children: "تصدير Excel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي الأصناف" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: formatNumber(totalItems) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-warning-50)", borderColor: "var(--color-warning-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-warning-700)", fontWeight: 600, textTransform: "uppercase" }, children: "منخفض المخزون" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-warning-900)" }, children: formatNumber(lowStockCount) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-error-50)", borderColor: "var(--color-error-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-error-700)", fontWeight: 600, textTransform: "uppercase" }, children: "ناقص المخزون" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-error-900)" }, children: formatNumber(outOfStockCount) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الوحدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: filters.vanCode, onChange: (e) => setFilters((f) => ({ ...f, vanCode: e.target.value, page: 1 })), className: "form-input", placeholder: "كود الوحدة" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "المحافظة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: filters.governorate,
            onChange: (e) => setFilters((f) => ({ ...f, governorate: e.target.value, page: 1 })),
            options: [
              { value: "", label: "الكل" },
              { value: "القاهرة الكبرى", label: "القاهرة الكبرى" },
              { value: "الإسكندرية", label: "الإسكندرية" },
              { value: "الشرقية", label: "الشرقية" },
              { value: "المنوفية", label: "المنوفية" },
              { value: "الشرقية", label: "الشرقية" },
              { value: "البحيرة", label: "البحيرة" },
              { value: "الغربية", label: "الغربية" },
              { value: "الدقهلية", label: "الدقهلية" },
              { value: "كفر الشيخ", label: "كفر الشيخ" },
              { value: "دمياط", label: "دمياط" },
              { value: "الفيوم", label: "الفيوم" },
              { value: "بني سويف", label: "بني سويف" },
              { value: "المنيا", label: "المنيا" },
              { value: "أسيوط", label: "أسيوط" },
              { value: "سوهاج", label: "سوهاج" },
              { value: "قنا", label: "قنا" },
              { value: "الأقصر", label: "الأقصر" },
              { value: "أسوان", label: "أسوان" },
              { value: "المكتب", label: "المكتب" }
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الفئة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: filters.category,
            onChange: (e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 })),
            options: [
              { value: "", label: "الكل" },
              { value: "WE Air", label: "WE Air" },
              { value: "ONT", label: "ONT" },
              { value: "CPE", label: "CPE" },
              { value: "Mi-Fi", label: "Mi-Fi" },
              { value: "Sim Cards", label: "Sim Cards" },
              { value: "Routers", label: "Routers" }
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minWidth: 180 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "form-label", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: filters.lowStock, onChange: (e) => setFilters((f) => ({ ...f, lowStock: e.target.checked, page: 1 })), style: { marginLeft: "var(--space-2)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.875rem", color: "var(--color-neutral-700)" }, children: "منخفض المخزون فقط" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الموقع" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الفئة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المنتج" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الكمية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الحد الأدنى" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "القيمة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الحالة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "آخر تحديث" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        stockDataSafe.map((item, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: item.vanCode }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.location }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.governorate }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.product }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.quantity) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.minQuantity) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.quantity * (item.unitPrice || 0)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: item.quantity === 0 ? "error" : item.quantity <= item.minQuantity ? "warning" : "success", children: item.quantity === 0 ? "ناقص" : item.quantity <= item.minQuantity ? "منخفض" : "متوفر" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString("ar-EG") : "-" })
        ] }, item.id)),
        stockDataSafe.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "📦" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد أصناف" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لا توجد بيانات مخزون للفلاتر المحددة" })
        ] }) }) })
      ] })
    ] }) }) })
  ] });
}

export { StockManagementPage };
