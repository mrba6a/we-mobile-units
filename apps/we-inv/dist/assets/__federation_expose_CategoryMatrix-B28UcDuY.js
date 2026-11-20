import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, B as Button, C as Card, S as Select, b as Badge } from './components-B9X8f4qc.js';
import { f as formatCurrency } from './index-CjwST_Jq.js';

const {useState} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
function CategoryMatrixPage() {
  const [filters, setFilters] = useState({
    category: "",
    governorate: "",
    page: 1,
    pageSize: 50
  });
  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const res = await api.getCategories(filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  const categoriesData = categories || [];
  const meta = { total: categoriesData.length, page: filters.page, pageSize: filters.pageSize, totalPages: 1 };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "مصفوفة الفئات والأسعار" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "أسعار المنتجات والخدمات، باقات الخطوط، أجهزة، وخدمات أخرى" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الفئة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: filters.category,
            onChange: (e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 })),
            options: [
              { value: "", label: "الكل" },
              { value: "WE Life", label: "WE Life" },
              { value: "WE Mix 250", label: "WE Mix 250" },
              { value: "WE Mix 355", label: "WE Mix 355" },
              { value: "WE Gold", label: "WE Gold (Postpaid)" },
              { value: "MNP", label: "MNP (حول رقمك)" },
              { value: "E-SIM", label: "E-SIM" },
              { value: "Wallet", label: "Wallet" },
              { value: "Students", label: "خطوط الطلبة" },
              { value: "Gas", label: "خطوط الغاز" },
              { value: "Initiative", label: "خطوط المبادرة" },
              { value: "ADSL", label: "ADSL" },
              { value: "Fixed Lines", label: "Fixed Lines" },
              { value: "Routers", label: "Routers" },
              { value: "WE Air", label: "WE Air" },
              { value: "ONT", label: "ONT" },
              { value: "CPE", label: "CPE" },
              { value: "Mi-Fi", label: "Mi-Fi" }
            ]
          }
        )
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
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الفئة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المنتج/الباقة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "السعر" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوصف" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "نشط" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "تاريخ التحديث" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          categoriesData.map((cat, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: cat.category }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: cat.product }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(cat.price) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: cat.description || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: cat.governorate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: cat.active ? "success" : "neutral", children: cat.active ? "نشط" : "غير نشط" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: cat.updatedAt ? new Date(cat.updatedAt).toLocaleDateString("ar-EG") : "-" })
          ] }, cat.id)),
          categoriesData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "📊" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد فئات" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لا توجد فئات للفلاتر المحددة" })
          ] }) }) })
        ] })
      ] }) }),
      meta.totalPages > 1
    ] })
  ] });
}

export { CategoryMatrixPage };
