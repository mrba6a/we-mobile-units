import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { u as useAuth, L as LoginPage, D as DashboardPage, P as ProtectedRoute, a as Layout } from './ProtectedRoute-DnsGDfHA.js';
import { R as ReconciliationPage } from './ReconciliationPage-CS_32tlo.js';
import { F as FinancePage } from './FinancePage-GR085H4r.js';
import { M as MonthlyReportsPage } from './MonthlyReportsPage-BfihVEt0.js';
import { H as HistoricalPage } from './HistoricalPage-DfDFZLFW.js';
import { M as MasterPreviewPage } from './MasterPreviewPage-C0E1W1Pu.js';

const {Routes,Route,Navigate} = await importShared('react-router-dom');
function ReviewRoutes() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "var(--color-neutral-50)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "reconciliation", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ReconciliationPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "finance", element: /* @__PURE__ */ jsxRuntimeExports.jsx(FinancePage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "monthly", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyReportsPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "historical", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HistoricalPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "master-preview", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MasterPreviewPage, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) })
  ] });
}

export { ReviewRoutes, ReviewRoutes as default };
