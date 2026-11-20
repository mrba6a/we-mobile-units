import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, C as Card, B as Button, f as formatNumber, b as formatCurrency, S as Select, c as Badge } from './index-Cuw773HR.js';

const {useState} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
const initialFilters = {
  dateFrom: "2026-11-01",
  dateTo: "2026-11-10",
  vanCode: "",
  governorate: "",
  status: "all",
  page: 1,
  pageSize: 50
};
const COLUMNS = [
  { key: "date", label: "التاريخ" },
  { key: "month", label: "الشهر" },
  { key: "city", label: "المدينة" },
  { key: "location", label: "الموقع" },
  { key: "vanCode", label: "رقم الوحدة" },
  { key: "totalLines", label: "إجمالي الخطوط" },
  { key: "5at_3ady", label: "خطوط عادية" },
  { key: "talabh", label: "الطلبة" },
  { key: "takafol", label: "التكافل" },
  { key: "mnp", label: "MNP" },
  { key: "ghaz", label: "الغاز" },
  { key: "net", label: "النت" },
  { key: "2rdy", label: "أرضي" },
  { key: "mobileAmount", label: "مبلغ المحمول" },
  { key: "voiceBills", label: "فواتير الصوت" },
  { key: "voiceAmount", label: "مبلغ الصوت" },
  { key: "oss", label: "OSS" },
  { key: "wePay", label: "We Pay" },
  { key: "البارز", label: "البارز" },
  { key: "total", label: "الإجمالي" },
  { key: "system", label: "النظام" },
  { key: "supplyStatus", label: "حالة التوريد" },
  { key: "treasurySupply", label: "توريد الخزينة" }
];
function MasterPreviewPage() {
  const [filters, setFilters] = useState(initialFilters);
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ["masterPreview", filters],
    queryFn: async () => {
      const res = await api.getFinalSheet({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || void 0,
        governorate: filters.governorate || void 0,
        status: filters.status,
        page: filters.page,
        pageSize: filters.pageSize
      });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  const entries = response?.data || [];
  const meta = response?.meta || { total: 0, totalPages: 1 };
  const matched = entries.filter((e) => e.supplyStatus === "توريد مطابق").length;
  const excess = entries.filter((e) => e.supplyStatus === "توريد زياده").length;
  const shortage = entries.filter((e) => e.supplyStatus === "توريد ناقص").length;
  const totalAmount = entries.reduce((s, e) => s + e.total, 0);
  const totalSystem = entries.reduce((s, e) => s + e.system, 0);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { maxWidth: 600, margin: "var(--space-6) auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "تعذر تحميل الشيت الرئيسي" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: () => refetch(), children: "إعادة المحاولة" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "معاينة الشيت الرئيسي (22 عمود)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "الشيت النهائي بعد المطابقة والتدقيق اليدوي - جاهز للإدارة المالية" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => alert("تصدير الشيت الرئيسي"), icon: "📥", children: "تصدير Excel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي السجلات" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: formatNumber(meta.total) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-success-50)", borderColor: "var(--color-success-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-success-700)", fontWeight: 600, textTransform: "uppercase" }, children: "مطابق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-success-900)" }, children: formatNumber(matched) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-warning-50)", borderColor: "var(--color-warning-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-warning-700)", fontWeight: 600, textTransform: "uppercase" }, children: "زيادة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-warning-900)" }, children: formatNumber(excess) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-error-50)", borderColor: "var(--color-error-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-error-700)", fontWeight: 600, textTransform: "uppercase" }, children: "ناقص" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-error-900)" }, children: formatNumber(shortage) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-secondary-50)", borderColor: "var(--color-secondary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-secondary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي المبلغ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-secondary-900)" }, children: formatCurrency(totalAmount).replace(" ج.م", "") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "مبلغ النظام" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: formatCurrency(totalSystem).replace(" ج.م", "") })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "من تاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.dateFrom, onChange: (e) => setFilters((f) => ({ ...f, dateFrom: e.target.value, page: 1 })), className: "form-input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "إلى تاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.dateTo, onChange: (e) => setFilters((f) => ({ ...f, dateTo: e.target.value, page: 1 })), className: "form-input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الوحدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: filters.vanCode, onChange: (e) => setFilters((f) => ({ ...f, vanCode: e.target.value, page: 1 })), className: "form-input", placeholder: "كود الوحدة" })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "حالة التوريد" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: filters.status,
            onChange: (e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 })),
            options: [
              { value: "all", label: "الكل" },
              { value: "matched", label: "مطابق" },
              { value: "excess", label: "زيادة" },
              { value: "shortage", label: "ناقص" }
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", style: { fontSize: "0.6875rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: COLUMNS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { whiteSpace: "nowrap", minWidth: "100px" }, children: col.label }, col.key)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          entries.map((entry, _i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { fontSize: "0.6875rem" }, children: COLUMNS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { whiteSpace: "nowrap" }, children: [
            col.key === "supplyStatus" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: entry.supplyStatus === "توريد مطابق" ? "success" : entry.supplyStatus === "توريد زياده" ? "warning" : entry.supplyStatus === "توريد ناقص" ? "error" : "neutral",
                style: { fontSize: "0.5625rem" },
                children: entry.supplyStatus
              }
            ),
            ["mobileAmount", "voiceAmount", "البارز", "total", "system"].includes(col.key) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { textAlign: "right", display: "block" }, children: formatCurrency(entry[col.key]).replace(" ج.م", "") }),
            ["totalLines", "5at_3ady", "talabh", "takafol", "mnp", "ghaz", "net", "2rdy", "voiceBills", "oss", "wePay"].includes(col.key) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { textAlign: "center", display: "block" }, children: formatNumber(entry[col.key]) }),
            col.key === "vanCode" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", style: { fontSize: "0.5625rem" }, children: entry[col.key] }),
            !["supplyStatus", "mobileAmount", "voiceAmount", "البارز", "total", "system", "totalLines", "5at_3ady", "talabh", "takafol", "mnp", "ghaz", "net", "2rdy", "voiceBills", "oss", "wePay", "vanCode"].includes(col.key) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: entry[col.key] })
          ] }, col.key)) }, entry.id)),
          entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: COLUMNS.length, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "📋" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد بيانات" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لا توجد سجلات لهذا النطاق مع الفلاتر المحددة" })
          ] }) }) })
        ] })
      ] }) }),
      meta.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-footer", style: { justifyContent: "center", flexWrap: "wrap", gap: "var(--space-2)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) })), disabled: filters.page === 1, children: "السابق" }),
        Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
          let pageNum = i + 1;
          if (meta.totalPages > 5) {
            if (filters.page <= 3) pageNum = i + 1;
            else if (filters.page >= meta.totalPages - 2) pageNum = meta.totalPages - 4 + i;
            else pageNum = filters.page - 2 + i;
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: filters.page === pageNum ? "primary" : "outline", size: "sm", onClick: () => setFilters((f) => ({ ...f, page: pageNum })), children: pageNum }, pageNum);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setFilters((f) => ({ ...f, page: Math.min(meta.totalPages, f.page + 1) })), disabled: filters.page === meta.totalPages, children: "التالي" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", color: "var(--color-neutral-500)", fontSize: "0.8125rem" }, children: [
          "الصفحة ",
          filters.page,
          " من ",
          meta.totalPages,
          " (إجمالي ",
          meta.total,
          " سجل)"
        ] })
      ] })
    ] })
  ] });
}

export { MasterPreviewPage as M };
