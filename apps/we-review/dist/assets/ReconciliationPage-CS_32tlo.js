import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, C as Card, B as Button, f as formatNumber, b as formatCurrency, T as Tabs, c as Badge, g as getStatusColor } from './index-Cuw773HR.js';

const {useState,useMemo} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
const initialFilters = {
  dateFrom: "2026-11-01",
  dateTo: "2026-11-10",
  vanCode: "",
  governorate: "",
  basis: "AUTO_BSS",
  mode: "CUMULATIVE_10D"
};
function ReconciliationPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ["reconciliation", filters],
    queryFn: async () => {
      const res = await api.getReconciliation({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || void 0,
        governorate: filters.governorate || void 0,
        basis: filters.basis,
        mode: filters.mode
      });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  const entries = response || [];
  const totalPages = Math.ceil(entries.length / pageSize);
  const paginatedEntries = useMemo(
    () => entries.slice((page - 1) * pageSize, page * pageSize),
    [entries, page]
  );
  const summary = useMemo(() => {
    const totalEntries = entries.length;
    const matched = entries.filter((e) => e.status === "matched").length;
    const excess = entries.filter((e) => e.status === "excess").length;
    const shortage = entries.filter((e) => e.status === "shortage").length;
    const pending = entries.filter((e) => e.status === "pending").length;
    const totalEntered = entries.reduce((s, e) => s + e.enteredAmount, 0);
    const totalBSS = entries.reduce((s, e) => s + e.bssAmount, 0);
    const totalDiff = totalBSS - totalEntered;
    const matchRate = totalEntries > 0 ? (matched / totalEntries * 100).toFixed(1) : 0;
    return { totalEntries, matched, excess, shortage, pending, totalEntered, totalBSS, totalDiff, matchRate };
  }, [entries]);
  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };
  const handleExport = async () => {
    alert("تصدير البيانات - سيتم التنفيذ");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { maxWidth: 600, margin: "var(--space-6) auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "تعذر تحميل بيانات التسوية" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: () => refetch(), children: "إعادة المحاولة" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "محرك التسوية والمراجعة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "مراجعة شاملة للبيانات المدخلة مقابل BSS مع دعم التراكمي 10 أيام" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: handleExport, icon: "📥", children: "تصدير" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي السجلات" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: formatNumber(summary.totalEntries) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { background: "var(--color-success-50)", borderColor: "var(--color-success-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-success-700)", fontWeight: 600, textTransform: "uppercase" }, children: "مطابق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-success-900)" }, children: formatNumber(summary.matched) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "0.75rem", color: "var(--color-success-600)" }, children: [
          summary.matchRate,
          "%"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { background: "var(--color-warning-50)", borderColor: "var(--color-warning-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-warning-700)", fontWeight: 600, textTransform: "uppercase" }, children: "زيادة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-warning-900)" }, children: formatNumber(summary.excess) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { background: "var(--color-error-50)", borderColor: "var(--color-error-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-error-700)", fontWeight: 600, textTransform: "uppercase" }, children: "نقص" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-error-900)" }, children: formatNumber(summary.shortage) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { background: "var(--color-neutral-100)", borderColor: "var(--color-neutral-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-neutral-600)", fontWeight: 600, textTransform: "uppercase" }, children: "معلق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-neutral-700)" }, children: formatNumber(summary.pending) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { background: "var(--color-secondary-50)", borderColor: "var(--color-secondary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-secondary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "مبلغ مدخول" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-secondary-900)" }, children: formatCurrency(summary.totalEntered).replace(" ج.م", "") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "مبلغ BSS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: formatCurrency(summary.totalBSS).replace(" ج.م", "") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { background: `${summary.totalDiff >= 0 ? "var(--color-warning-50)" : "var(--color-error-50)"}`, borderColor: `${summary.totalDiff >= 0 ? "var(--color-warning-200)" : "var(--color-error-200)"}` }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: `${summary.totalDiff >= 0 ? "var(--color-warning-700)" : "var(--color-error-700)"}`, fontWeight: 600, textTransform: "uppercase" }, children: "الفرق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: `${summary.totalDiff >= 0 ? "var(--color-warning-900)" : "var(--color-error-900)"}` }, children: [
          summary.totalDiff >= 0 ? "+" : "",
          formatCurrency(summary.totalDiff).replace(" ج.م", "")
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "من تاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "date",
            value: filters.dateFrom,
            onChange: (e) => handleFilterChange("dateFrom", e.target.value),
            className: "form-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "إلى تاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "date",
            value: filters.dateTo,
            onChange: (e) => handleFilterChange("dateTo", e.target.value),
            className: "form-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "كود الوحدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: filters.vanCode,
            onChange: (e) => handleFilterChange("vanCode", e.target.value),
            className: "form-input",
            placeholder: "مثال: 231"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "المحافظة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: filters.governorate,
            onChange: (e) => handleFilterChange("governorate", e.target.value),
            className: "form-input form-select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "الكل" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "القاهرة الكبرى", children: "القاهرة الكبرى" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "الإسكندرية", children: "الإسكندرية" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "المنوفية", children: "المنوفية" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "الشرقية", children: "الشرقية" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "البحيرة", children: "البحيرة" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "الغربية", children: "الغربية" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "الدقهلية", children: "الدقهلية" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "كفر الشيخ", children: "كفر الشيخ" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "دمياط", children: "دمياط" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "الفيوم", children: "الفيوم" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "بني سويف", children: "بني سويف" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "المنيا", children: "المنيا" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "أسيوط", children: "أسيوط" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "سوهاج", children: "سوهاج" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "قنا", children: "قنا" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "الأقصر", children: "الأقصر" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "أسوان", children: "أسوان" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "المكتب", children: "المكتب" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الأساس" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: filters.basis,
            onChange: (e) => handleFilterChange("basis", e.target.value),
            className: "form-input form-select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "AUTO_BSS", children: "تلقائي (BSS)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MANUAL", children: "يدوي" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "VOICE", children: "صوتي" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        tabs: [
          { id: "DAILY", label: "يومي" },
          { id: "CUMULATIVE_10D", label: "تراكمي 10 أيام" }
        ],
        activeTab: filters.mode,
        onChange: (mode) => {
          handleFilterChange("mode", mode);
          setPage(1);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "التاريخ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الموقع" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "مسؤول المبيعات" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الخطوط" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "ADSL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "المدخول" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "BSS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "الفرق" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الحالة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الأساس" }),
          filters.mode === "CUMULATIVE_10D" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الجلسات" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "فترة" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          paginatedEntries.map((entry, _index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: entry.vanCode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry.location }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", style: { fontSize: "0.625rem" }, children: entry.governorate }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: entry.agentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(entry.totalLines) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(entry.totalADSL) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(entry.enteredAmount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(entry.bssAmount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
              color: getStatusColor(entry.status),
              fontWeight: 600,
              fontSize: "0.8125rem"
            }, children: [
              entry.difference >= 0 ? "+" : "",
              formatCurrency(entry.difference)
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: entry.status === "matched" ? "success" : entry.status === "excess" ? "warning" : entry.status === "shortage" ? "error" : "neutral",
                children: entry.status === "matched" ? "مطابق" : entry.status === "excess" ? "زيادة" : entry.status === "shortage" ? "نقص" : "معلق"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", style: { fontSize: "0.625rem" }, children: entry.source === "BSS" ? "BSS" : entry.source === "MANUAL" ? "يدوي" : "صوتي" }) }),
            filters.mode === "CUMULATIVE_10D" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: entry.bssSessionsCount || 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontSize: "0.75rem" }, children: entry.minDate && entry.maxDate && entry.minDate !== entry.maxDate ? `${entry.minDate} → ${entry.maxDate}` : entry.minDate || "-" })
            ] })
          ] }, entry.id)),
          paginatedEntries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: filters.mode === "CUMULATIVE_10D" ? 15 : 13, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "🔍" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد بيانات" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "جرب تغيير الفلاتر أو نطاق التاريخ" })
          ] }) }) })
        ] })
      ] }) }),
      entries.length > pageSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-footer", style: { justifyContent: "center", flexWrap: "wrap", gap: "var(--space-2)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setPage((p) => Math.max(1, p - 1)),
            disabled: page === 1,
            children: "السابق"
          }
        ),
        Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum = i + 1;
          if (totalPages > 5) {
            if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: page === pageNum ? "primary" : "outline",
              size: "sm",
              onClick: () => setPage(pageNum),
              children: pageNum
            },
            pageNum
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
            disabled: page === totalPages,
            children: "التالي"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", color: "var(--color-neutral-500)", fontSize: "0.8125rem" }, children: [
          "الصفحة ",
          page,
          " من ",
          totalPages,
          " (إجمالي ",
          entries.length,
          " سجل)"
        ] })
      ] })
    ] })
  ] });
}

export { ReconciliationPage as R };
