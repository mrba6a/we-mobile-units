import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, B as Button, C as Card, I as Input, S as Select, b as Badge } from './components-B9X8f4qc.js';

const {useState} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
function VanManagementPage() {
  const [filters, setFilters] = useState({
    vanCode: "",
    governorate: "",
    status: "",
    page: 1,
    pageSize: 50
  });
  const { data: vans, isLoading, refetch } = useQuery({
    queryKey: ["vans", filters],
    queryFn: async () => {
      const res = await api.getVans(filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  const vansData = vans || [];
  const meta = { total: vansData.length, page: filters.page, pageSize: filters.pageSize, totalPages: 1 };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "إدارة الوحدات المتنقلة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "إدارة بيانات الوحدات، المواقع، والمحافظات" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => alert("تصدير الوحدات"), icon: "📥", children: "تصدير" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => alert("إضافة وحدة - سيتم تطويرها لاحقاً"), icon: "➕", children: "إضافة وحدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "كود الوحدة" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الحالة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: filters.status,
            onChange: (e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 })),
            options: [
              { value: "", label: "الكل" },
              { value: "ACTIVE", label: "نشط" },
              { value: "MAINTENANCE", label: "صيانة" },
              { value: "INACTIVE", label: "غير نشط" }
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), style: { height: "fit-content" }, icon: "🔄", children: "بحث" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "كود الوحدة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "اللوحة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الاسم" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "رمز الوحدة (OU)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الحالة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "مكتب افتراضي" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الإجراءات" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          vansData.map((van, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: van.code }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: van.plate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: van.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: van.gov }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: van.ouCode }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: van.status === "ACTIVE" ? "success" : van.status === "MAINTENANCE" ? "warning" : "neutral", children: van.status === "ACTIVE" ? "نشط" : van.status === "MAINTENANCE" ? "صيانة" : "غير نشط" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: van.isOfficeDefault ? "✅ نعم" : "❌ لا" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            }, children: "تعديل" }) })
          ] }, van.id)),
          vansData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "🚐" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد وحدات" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لا توجد وحدات للفلاتر المحددة" })
          ] }) }) })
        ] })
      ] }) }),
      meta.totalPages > 1
    ] })
  ] });
}

export { VanManagementPage };
