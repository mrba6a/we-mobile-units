import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { r as reactDomExports } from './index-BDy7Zqw8.js';
import { u as useAuth, L as LoginPage, D as DashboardPage, P as ProtectedRoute, a as Layout, A as AuthProvider } from './ProtectedRoute-DnsGDfHA.js';
import { C as Card, I as Input, B as Button, a as api } from './index-Cuw773HR.js';
import { R as ReconciliationPage } from './ReconciliationPage-CS_32tlo.js';
import { F as FinancePage } from './FinancePage-GR085H4r.js';
import { M as MonthlyReportsPage } from './MonthlyReportsPage-BfihVEt0.js';
import { H as HistoricalPage } from './HistoricalPage-DfDFZLFW.js';
import { M as MasterPreviewPage } from './MasterPreviewPage-C0E1W1Pu.js';

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

const {useState} = await importShared('react');

const {useNavigate} = await importShared('react-router-dom');
function ChangePinPage() {
  const navigate = useNavigate();
  useAuth();
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!oldPin.trim()) {
      setError("PIN الحالي مطلوب");
      return;
    }
    if (!newPin.trim()) {
      setError("PIN الجديد مطلوب");
      return;
    }
    if (newPin.length < 4) {
      setError("PIN الجديد يجب أن يكون 4 أرقام على الأقل");
      return;
    }
    if (newPin !== confirmPin) {
      setError("تأكيد PIN غير متطابق");
      return;
    }
    if (newPin === oldPin) {
      setError("PIN الجديد يجب أن يكون مختلف عن PIN الحالي");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.changePin(oldPin, newPin);
      if (response.success) {
        alert("تم تغيير PIN بنجاح");
        navigate("/dashboard");
      } else {
        setError(response.error || "فشل في تغيير PIN");
      }
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--space-6)",
    background: "linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-neutral-50) 100%)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { style: { maxWidth: 420, width: "100%", boxShadow: "var(--shadow-xl)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderBottom: "none", background: "transparent", paddingBottom: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: 80,
        height: 80,
        borderRadius: "var(--radius-2xl)",
        background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto var(--space-4)",
        boxShadow: "var(--shadow-lg)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "2rem", fontWeight: 800, color: "white" }, children: "WE" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "var(--space-1)" }, children: "تغيير PIN الإجباري" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", fontSize: "0.875rem", margin: 0 }, children: "يجب تغيير PIN الخاص بك قبل المتابعة" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "card-body", style: { paddingTop: "var(--space-4)" }, children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "var(--color-error-50)",
        border: "1px solid var(--color-error-200)",
        color: "var(--color-error-600)",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-lg)",
        marginBottom: "var(--space-4)",
        fontSize: "0.8125rem",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)"
      }, children: [
        "⚠️ ",
        error
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "1. PIN الحالي *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: showOldPin ? "text" : "password",
              value: oldPin,
              onChange: (e) => setOldPin(e.target.value),
              placeholder: "أدخل PIN الحالي",
              autoComplete: "current-password",
              required: true,
              disabled: isLoading,
              style: { paddingLeft: "48px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowOldPin(!showOldPin),
              style: {
                position: "absolute",
                left: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--color-neutral-400)",
                cursor: "pointer",
                padding: "var(--space-1)",
                fontSize: "1rem"
              },
              children: showOldPin ? "🙈" : "👁️"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "2. PIN الجديد *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: showNewPin ? "text" : "password",
              value: newPin,
              onChange: (e) => setNewPin(e.target.value),
              placeholder: "أدخل PIN الجديد (4 أرقام على الأقل)",
              autoComplete: "new-password",
              required: true,
              disabled: isLoading,
              style: { paddingLeft: "48px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowNewPin(!showNewPin),
              style: {
                position: "absolute",
                left: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--color-neutral-400)",
                cursor: "pointer",
                padding: "var(--space-1)",
                fontSize: "1rem"
              },
              children: showNewPin ? "🙈" : "👁️"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "يجب أن يكون 4 أرقام على الأقل، مختلف عن PIN الحالي" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "3. تأكيد PIN الجديد *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: showConfirmPin ? "text" : "password",
              value: confirmPin,
              onChange: (e) => setConfirmPin(e.target.value),
              placeholder: "أعد كتابة PIN الجديد للتأكيد",
              autoComplete: "new-password",
              required: true,
              disabled: isLoading,
              style: { paddingLeft: "48px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowConfirmPin(!showConfirmPin),
              style: {
                position: "absolute",
                left: "var(--space-3)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--color-neutral-400)",
                cursor: "pointer",
                padding: "var(--space-1)",
                fontSize: "1rem"
              },
              children: showConfirmPin ? "🙈" : "👁️"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          fullWidth: true,
          size: "lg",
          loading: isLoading,
          style: { marginBottom: "var(--space-4)" },
          children: "تغيير PIN"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-footer", style: { borderTop: "1px solid var(--color-neutral-200)", paddingTop: "var(--space-4)", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", margin: 0 }, children: "إصدار 1.0.0 | نظام آمن ومشفر" }) })
  ] }) });
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "reconciliation", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ReconciliationPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "finance", element: /* @__PURE__ */ jsxRuntimeExports.jsx(FinancePage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "monthly", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyReportsPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "historical", element: /* @__PURE__ */ jsxRuntimeExports.jsx(HistoricalPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "master-preview", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MasterPreviewPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "change-pin", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePinPage, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) })
  ] });
}

const React = await importShared('react');
const {BrowserRouter} = await importShared('react-router-dom');

const {QueryClient,QueryClientProvider} = await importShared('@tanstack/react-query');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1e3,
      // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
api.setBaseUrl("/api");
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) }) }) })
);
