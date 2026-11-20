import { importShared } from './__federation_fn_import-Cr-sgxHt.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CyoIsdjr.js';
import { r as reactDomExports } from './index-D9Af7wOI.js';
import { u as useAuth, L as LoginPage, D as DailyEntryPage, M as MySalesPage, a as MyLeavesPage, V as VanSchedulePage, C as ChangePinPage, P as ProtectedRoute, b as Layout, c as api, A as AuthProvider } from './ProtectedRoute-DZK2UJp1.js';

true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

var client = {};

var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}

const {Routes,Route,Navigate} = await importShared('react-router-dom');
function App() {
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

const __vite_import_meta_env__ = {};
const React = await importShared('react');
const {BrowserRouter} = await importShared('react-router-dom');

const {QueryClient,QueryClientProvider} = await importShared('@tanstack/react-query');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1e3,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
const apiBase = __vite_import_meta_env__?.VITE_API_BASE || "/api";
api.setBaseUrl(apiBase);
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) }) }) })
);
