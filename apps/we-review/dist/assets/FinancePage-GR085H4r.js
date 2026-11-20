import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, B as Button, C as Card, b as formatCurrency, T as Tabs, c as Badge, g as getStatusColor, f as formatNumber } from './index-Cuw773HR.js';

const vans = ["231", "582", "825", "832", "2348", "2349"];
const agents = [
  { id: "113985", name: "ابانوب سليمان صافي مسعود" },
  { id: "113978", name: "احمد عبد المحسن عبد الحميد" },
  { id: "113975", name: "اشرف محمد حمدى حبشى حسين" }
];
const vanLocations = {
  "231": "شنشور - أشمون",
  "582": "وصال / الحصري",
  "825": "دجلة بالمز / كفر بطا",
  "832": "المكتب",
  "2348": "الرابعة الناصرية - ثان الرمل",
  "2349": "سنطيس - دمنهور"
};
const vanGovernorates = {
  "231": "المنوفية",
  "582": "القاهرة الكبرى",
  "825": "القاهرة الكبرى",
  "832": "القاهرة الكبرى",
  "2348": "الإسكندرية",
  "2349": "البحيرة"
};

const generateMockEnteredData = (_dateFrom, _dateTo) => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const day = Math.floor(Math.random() * 10) + 1;
    data.push({
      id: `ent_${i}`,
      date: `2026-11-${String(day).padStart(2, "0")}`,
      vanCode,
      location: vanLocations[vanCode] || "غير محدد",
      governorate: vanGovernorates[vanCode] || "القاهرة الكبرى",
      agentId: agent.id,
      agentName: agent.name,
      totalLines: Math.floor(Math.random() * 100) + 20,
      totalADSL: Math.floor(Math.random() * 10) + 2,
      amount: Math.floor(Math.random() * 2e5) + 5e4,
      mobileCash: Math.floor(Math.random() * 12e4) + 2e4,
      mobileVisa: Math.floor(Math.random() * 5e4) + 1e4,
      mobileExempt: Math.floor(Math.random() * 2e4) + 5e3
    });
  }
  return data;
};

const {useState} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
const initialFilters = {
  dateFrom: "2026-11-01",
  dateTo: "2026-11-10",
  vanCode: "",
  governorate: "",
  groupBy: "van"
};
function FinancePage() {
  const [filters, setFilters] = useState(initialFilters);
  const [activeTab, setActiveTab] = useState("comparison");
  const { data: bssData, isLoading: bssLoading } = useQuery({
    queryKey: ["financeBSS", filters.dateFrom, filters.dateTo, filters.vanCode, filters.governorate],
    queryFn: async () => {
      const res = await api.getBSSData({ dateFrom: filters.dateFrom, dateTo: filters.dateTo, vanCode: filters.vanCode || "", governorate: filters.governorate || "" });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  const { data: enteredData, isLoading: enteredLoading } = useQuery({
    queryKey: ["financeEntered", filters.dateFrom, filters.dateTo, filters.vanCode, filters.governorate],
    queryFn: async () => {
      return generateMockEnteredData(filters.dateFrom || "", filters.dateTo || "");
    },
    staleTime: 5 * 60 * 1e3
  });
  const { data: comparisonData } = useQuery({
    queryKey: ["financeComparison", filters],
    queryFn: async () => {
      const res = await api.getFinanceComparison({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || "",
        governorate: filters.governorate || "",
        groupBy: filters.groupBy
      });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3,
    enabled: !!filters.dateFrom && !!filters.dateTo
  });
  const { data: discrepanciesData } = useQuery({
    queryKey: ["financeDiscrepancies", filters],
    queryFn: async () => {
      const res = await api.getFinanceDiscrepancies({ dateFrom: filters.dateFrom, dateTo: filters.dateTo, vanCode: filters.vanCode || "", governorate: filters.governorate || "" });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3,
    enabled: !!filters.dateFrom && !!filters.dateTo
  });
  const isLoading = bssLoading || enteredLoading;
  const bss = bssData || [];
  const entered = enteredData || [];
  const comparison = comparisonData?.details || [];
  const summary = comparisonData?.summary || { matched: 0, excess: 0, shortage: 0, totalEnteredAmount: 0, totalBSSAmount: 0, totalDifference: 0 };
  const discrepancies = discrepanciesData || [];
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "المالية ومقارنة BSS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "مقارنة البيانات المدخلة يدوياً مع بيانات BSS الرسمية" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => alert("تصدير المقارنة"), icon: "📥", children: "تصدير" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => {
        }, icon: "🔄", children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "المدخول" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: formatCurrency(summary.totalEnteredAmount) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-secondary-50)", borderColor: "var(--color-secondary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-secondary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "BSS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-secondary-900)" }, children: formatCurrency(summary.totalBSSAmount) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: `${summary.totalDifference >= 0 ? "var(--color-warning-50)" : "var(--color-error-50)"}`, borderColor: `${summary.totalDifference >= 0 ? "var(--color-warning-200)" : "var(--color-error-200)"}` }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: `${summary.totalDifference >= 0 ? "var(--color-warning-700)" : "var(--color-error-700)"}`, fontWeight: 600, textTransform: "uppercase" }, children: "الفرق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: `${summary.totalDifference >= 0 ? "var(--color-warning-900)" : "var(--color-error-900)"}` }, children: [
          summary.totalDifference >= 0 ? "+" : "",
          formatCurrency(summary.totalDifference)
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-success-50)", borderColor: "var(--color-success-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-success-700)", fontWeight: 600, textTransform: "uppercase" }, children: "مطابق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-success-900)" }, children: summary.matched })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-warning-50)", borderColor: "var(--color-warning-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-warning-700)", fontWeight: 600, textTransform: "uppercase" }, children: "زيادة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-warning-900)" }, children: summary.excess })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-error-50)", borderColor: "var(--color-error-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-error-700)", fontWeight: 600, textTransform: "uppercase" }, children: "نقص" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-error-900)" }, children: summary.shortage })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "من تاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.dateFrom, onChange: (e) => setFilters((f) => ({ ...f, dateFrom: e.target.value })), className: "form-input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "إلى تاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.dateTo, onChange: (e) => setFilters((f) => ({ ...f, dateTo: e.target.value })), className: "form-input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "كود الوحدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: filters.vanCode, onChange: (e) => setFilters((f) => ({ ...f, vanCode: e.target.value })), className: "form-input", placeholder: "مثال: 231" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "المحافظة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filters.governorate, onChange: (e) => setFilters((f) => ({ ...f, governorate: e.target.value })), className: "form-input form-select", children: [
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
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "تجميع حسب" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filters.groupBy, onChange: (e) => setFilters((f) => ({ ...f, groupBy: e.target.value })), className: "form-input form-select", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "van", children: "حسب الوحدة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "agent", children: "حسب المسؤول" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "governorate", children: "حسب المحافظة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "date", children: "حسب التاريخ" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        tabs: [
          { id: "comparison", label: "مقارنة مفصلة" },
          { id: "discrepancies", label: "الفروقات", badge: discrepancies.length },
          { id: "bss", label: "بيانات BSS" },
          { id: "entered", label: "البيانات المدخلة" }
        ],
        activeTab,
        onChange: (tabId) => setActiveTab(tabId)
      }
    ),
    activeTab === "comparison" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: filters.groupBy === "van" ? "الوحدة" : filters.groupBy === "agent" ? "المسؤول" : filters.groupBy === "governorate" ? "المحافظة" : "التاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "المدخول" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "BSS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "الفرق" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الحالة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "خطوط مدخلة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "خطوط BSS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "ADSL مدخل" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "ADSL BSS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المسؤول" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: comparison.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: item.key }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.enteredAmount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.bssAmount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: getStatusColor(item.status), fontWeight: 600 }, children: [
          item.difference >= 0 ? "+" : "",
          formatCurrency(item.difference)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: item.status === "matched" ? "success" : item.status === "excess" ? "warning" : "error",
            children: item.status === "matched" ? "مطابق" : item.status === "excess" ? "زيادة" : "نقص"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.enteredLines) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.bssLines) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.enteredADSL) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.bssADSL) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.governorate }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.agentName })
      ] }, i)) })
    ] }) }) }),
    activeTab === "discrepancies" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { fontSize: "1rem", fontWeight: 600 }, children: [
        "إجمالي الفروقات: ",
        discrepancies.length
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "النوع" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "التاريخ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المسؤول" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "المبلغ المدخل" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "مبلغ BSS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "الفرق" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الشدة" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: discrepancies.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: d.type === "missing_in_bss" ? "error" : d.type === "missing_in_entered" ? "warning" : d.type === "excess_in_bss" ? "warning" : "error", children: d.type === "missing_in_bss" ? "مفقود في BSS" : d.type === "missing_in_entered" ? "مفقود في المدخلات" : d.type === "excess_in_bss" ? "زيادة في BSS" : "نقص في BSS" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: d.entered?.vanCode || d.bss?.vanCode }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: d.entered?.date || d.bss?.date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: d.entered?.agentName || d.bss?.agentName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(d.entered?.amount || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(d.bss?.amount || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: getStatusColor(d.difference ? d.difference >= 0 ? "excess" : "shortage" : "pending"), fontWeight: 600 }, children: d.difference !== void 0 ? (d.difference >= 0 ? "+" : "") + formatCurrency(Math.abs(d.difference)) : "-" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: d.severity === "high" ? "error" : d.severity === "medium" ? "warning" : "success", children: d.severity === "high" ? "عالي" : d.severity === "medium" ? "متوسط" : "منخفض" }) })
        ] }, i)) })
      ] }) })
    ] }),
    activeTab === "bss" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "التاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الموقع" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المسؤول" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الخطوط" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "ADSL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "المبلغ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "كاش" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "فيزا" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "معفي" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: bss.slice(0, 100).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: item.vanCode }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.location }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.agentName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.lines) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.adsl) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.amount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.cash) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.visa) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.exempt) })
      ] }, i)) })
    ] }) }) }),
    activeTab === "entered" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "التاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الموقع" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المسؤول" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الخطوط" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "ADSL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "المبلغ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "كاش" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "فيزا" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "معفي" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entered.slice(0, 100).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: item.vanCode }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.location }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.agentName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.totalLines) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(item.totalADSL) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.amount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.mobileCash) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.mobileVisa) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(item.mobileExempt) })
      ] }, i)) })
    ] }) }) })
  ] });
}

export { FinancePage as F };
