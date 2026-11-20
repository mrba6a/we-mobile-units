import { importShared } from './__federation_fn_import-Cr-sgxHt.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CyoIsdjr.js';
import { u as useAuth, L as LoginPage, D as DailyEntryPage, M as MySalesPage, a as MyLeavesPage, V as VanSchedulePage, C as ChangePinPage, P as ProtectedRoute, b as Layout } from './ProtectedRoute-DZK2UJp1.js';

const {Routes,Route,Navigate} = await importShared('react-router-dom');
function EmpRoutes() {
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["AGENT", "SELLER", "SUPERVISOR", "ADMIN"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/daily-entry", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "daily-entry", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DailyEntryPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "my-sales", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MySalesPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "my-leaves", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MyLeavesPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "van-schedule", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VanSchedulePage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "change-pin", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePinPage, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/daily-entry", replace: true }) })
  ] });
}

export { EmpRoutes, EmpRoutes as default };
