import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, B as Button, C as Card, I as Input, S as Select, b as Badge } from './components-B9X8f4qc.js';
import { a as formatDate, b as formatNumber } from './index-CjwST_Jq.js';

const {useState} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
function LeavesManagementPage() {
  const [filters, setFilters] = useState({
    agentId: "",
    vanCode: "",
    governorate: "",
    leaveType: "",
    status: "",
    dateFrom: "2026-01-01",
    dateTo: "2026-12-31",
    page: 1,
    pageSize: 50
  });
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["leaves", filters],
    queryFn: async () => {
      const res = await api.getLeaves(filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  const leaves = response || [];
  const meta = { total: leaves.length, page: filters.page, pageSize: filters.pageSize, totalPages: 1 };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "إدارة الإجازات الشاملة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "مراجعة واعتماد طلبات الإجازات لجميع الموظفين" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => alert("تصدير الإجازات"), icon: "📥", children: "تصدير" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الموظف" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: filters.agentId, onChange: (e) => setFilters((f) => ({ ...f, agentId: e.target.value, page: 1 })), className: "form-input", placeholder: "كود أو اسم الموظف" })
      ] }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "نوع الإجازة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: filters.leaveType,
            onChange: (e) => setFilters((f) => ({ ...f, leaveType: e.target.value, page: 1 })),
            options: [
              { value: "", label: "الكل" },
              { value: "annual", label: "سنوية" },
              { value: "sick", label: "مرضية" },
              { value: "casual", label: "عارضة" },
              { value: "emergency", label: "طارئة" },
              { value: "maternity", label: "ولادة" },
              { value: "paternity", label: "أبوة" },
              { value: "unpaid", label: "بدون راتب" }
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
              { value: "pending", label: "قيد الانتظار" },
              { value: "approved", label: "مقبولة" },
              { value: "rejected", label: "مرفوضة" },
              { value: "cancelled", label: "ملغية" }
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "من تاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.dateFrom, onChange: (e) => setFilters((f) => ({ ...f, dateFrom: e.target.value, page: 1 })), className: "form-input" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "إلى تاريخ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.dateTo, onChange: (e) => setFilters((f) => ({ ...f, dateTo: e.target.value, page: 1 })), className: "form-input" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الموظف" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "نوع الإجازة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "من" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "إلى" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الأيام" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الحالة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "تاريخ الطلب" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الإجراءات" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          leaves.map((leave, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: leave.agentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: leave.vanCode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: leave.governorate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: leaveTypeLabels[leave.leaveType] || leave.leaveType }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatDate(leave.startDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatDate(leave.endDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(leave.daysCount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: leave.status === "approved" ? "success" : leave.status === "rejected" ? "error" : leave.status === "cancelled" ? "neutral" : "warning", children: leave.status === "approved" ? "مقبولة" : leave.status === "rejected" ? "مرفوضة" : leave.status === "cancelled" ? "ملغية" : "قيد الانتظار" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatDate(leave.requestedAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: leave.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-2)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "success", onClick: () => approveLeave(leave.id), children: "اعتماد" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "error", onClick: () => rejectLeave(leave.id), children: "رفض" })
            ] }) })
          ] }, leave.id)),
          leaves.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "🏖️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد طلبات إجازة" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لا توجد طلبات إجازة للفلاتر المحددة" })
          ] }) }) })
        ] })
      ] }) }),
      meta.totalPages > 1
    ] })
  ] });
}
const leaveTypeLabels = {
  annual: "سنوية",
  sick: "مرضية",
  casual: "عارضة",
  emergency: "طارئة",
  maternity: "ولادة",
  paternity: "أبوة",
  unpaid: "بدون راتب"
};
const approveLeave = (id) => {
  alert(`اعتماد الإجازة ${id} - سيتم تنفيذ API`);
};
const rejectLeave = (id) => {
  alert(`رفض الإجازة ${id} - سيتم تنفيذ API`);
};

export { LeavesManagementPage };
