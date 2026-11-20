import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, C as Card, B as Button, S as Select, f as formatNumber, b as formatCurrency, c as Badge } from './index-Cuw773HR.js';

const {useState} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
const initialFilters = {
  month: "2026-11",
  vanCode: "",
  governorate: "",
  agentId: "",
  page: 1,
  pageSize: 50
};
function MonthlyReportsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ["monthlyReports", filters],
    queryFn: async () => {
      const res = await api.getMonthlyReport({
        month: filters.month,
        vanCode: filters.vanCode || void 0,
        governorate: filters.governorate || void 0,
        agentId: filters.agentId || void 0,
        page: filters.page,
        pageSize: filters.pageSize
      });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  const reports = response?.data || [];
  const meta = response?.meta || { total: 0, totalPages: 1 };
  const totalLines = reports.reduce((s, r) => s + r.totalLines, 0);
  const totalADSL = reports.reduce((s, r) => s + r.totalADSL, 0);
  const totalAmount = reports.reduce((s, r) => s + r.totalAmount, 0);
  const totalDawry = reports.reduce((s, r) => s + r.dawryCount, 0);
  const totalDevices = reports.reduce((s, r) => s + r.devices, 0);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { maxWidth: 600, margin: "var(--space-6) auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "تعذر تحميل التقرير الشهري" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: () => refetch(), children: "إعادة المحاولة" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "تقرير مبيعات مسئولي المبيعات (شهري)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "تفصيل مبيعات كل مسؤول مبيعات للشهر المحدد" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => alert("تصدير التقرير"), icon: "📥", children: "تصدير Excel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 200 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الشهر" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: filters.month,
            onChange: (e) => setFilters((f) => ({ ...f, month: e.target.value, page: 1 })),
            options: [
              { value: "2026-11", label: "نوفمبر 2026" },
              { value: "2026-10", label: "أكتوبر 2026" },
              { value: "2026-09", label: "سبتمبر 2026" },
              { value: "2026-08", label: "أغسطس 2026" },
              { value: "2026-07", label: "يوليو 2026" }
            ]
          }
        )
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "المسؤول" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: filters.agentId, onChange: (e) => setFilters((f) => ({ ...f, agentId: e.target.value, page: 1 })), className: "form-input", placeholder: "كود أو اسم المسؤول" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي الخطوط" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: formatNumber(totalLines) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-secondary-50)", borderColor: "var(--color-secondary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-secondary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي ADSL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-secondary-900)" }, children: formatNumber(totalADSL) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-success-50)", borderColor: "var(--color-success-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-success-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي المبلغ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-success-900)" }, children: formatCurrency(totalAmount).replace(" ج.م", "") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-warning-50)", borderColor: "var(--color-warning-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-warning-700)", fontWeight: 600, textTransform: "uppercase" }, children: "الدوري" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-warning-900)" }, children: formatNumber(totalDawry) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-error-50)", borderColor: "var(--color-error-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-error-700)", fontWeight: 600, textTransform: "uppercase" }, children: "الأجهزة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-error-900)" }, children: formatNumber(totalDevices) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-neutral-100)", borderColor: "var(--color-neutral-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-neutral-600)", fontWeight: 600, textTransform: "uppercase" }, children: "السجلات" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-neutral-700)" }, children: formatNumber(meta.total) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "التاريخ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الموقع" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المسؤول" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الخطوط" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "ADSL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "المبلغ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "كاش" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "فيزا" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "معفي" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الدوري" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الأجهزة" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          reports.map((report, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: report.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: report.vanCode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: report.location }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", style: { fontSize: "0.625rem" }, children: report.governorate }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: report.agentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(report.totalLines) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(report.totalADSL) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(report.totalAmount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(report.mobileCash) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(report.mobileVisa) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(report.mobileExempt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(report.dawryCount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(report.devices) })
          ] }, report.id)),
          reports.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 14, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "📋" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد بيانات" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لا توجد سجلات لهذا الشهر مع الفلاتر المحددة" })
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

export { MonthlyReportsPage as M };
