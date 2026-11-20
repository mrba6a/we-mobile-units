import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, C as Card, I as Input, B as Button } from './components-B9X8f4qc.js';
import { StockManagementPage } from './__federation_expose_StockManagement-LDfqXDut.js';
import { LeavesManagementPage } from './__federation_expose_LeavesManagement-BBjSvF02.js';
import { VanManagementPage } from './__federation_expose_VanManagement-C8DQgIIk.js';
import { CategoryMatrixPage } from './__federation_expose_CategoryMatrix-B28UcDuY.js';

const {createContext,useContext,useState: useState$3,useEffect} = await importShared('react');
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState$3(null);
  const [token, setToken] = useState$3(null);
  const [isLoading, setIsLoading] = useState$3(true);
  useEffect(() => {
    const storedToken = localStorage.getItem("we_auth_token");
    const storedUser = localStorage.getItem("we_auth_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.setToken(storedToken);
      } catch {
        localStorage.removeItem("we_auth_token");
        localStorage.removeItem("we_auth_user");
      }
    }
    setIsLoading(false);
  }, []);
  const login = async (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("we_auth_token", userToken);
    localStorage.setItem("we_auth_user", JSON.stringify(userData));
    api.setToken(userToken);
  };
  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("we_auth_token");
    localStorage.removeItem("we_auth_user");
    api.setToken(null);
  };
  const updateUser = (userData) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem("we_auth_user", JSON.stringify(updated));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  }, children });
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}
async function verifyPassword(password, hash) {
  const hashBuffer = await hashPassword(password);
  return hashBuffer === hash;
}
async function localLogin(identifier, pin) {
  await initializeDefaultUsers();
  const users = await getAllUsers();
  const user = users.find(
    (u) => u.id === identifier.toUpperCase() || u.username.toLowerCase() === identifier.toLowerCase()
  ) || null;
  if (!user || !user.isActive) return null;
  const valid = await verifyPassword(pin, user.passwordHash);
  if (!valid) return null;
  const permissions = buildPermissions(user.role, user.vanCode, user.governorate);
  const payload = {
    sub: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    vanCode: user.vanCode,
    governorate: user.governorate,
    iat: Math.floor(Date.now() / 1e3),
    exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60,
    // 24 hours
    mustChangePassword: user.mustChangePassword
  };
  const token = "local_" + btoa(JSON.stringify(payload));
  const authUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    vanCode: user.vanCode,
    governorate: user.governorate,
    email: user.email,
    phone: user.phone,
    permissions,
    defaultPin: user.id.slice(-4),
    skipForcePin: !user.mustChangePassword
  };
  return { user: authUser, token, forcePinChange: user.mustChangePassword };
}
async function initializeDefaultUsers() {
  const existing = localStorage.getItem("we_users_v1");
  if (existing) return;
  const users = [
    {
      id: "admin",
      username: "admin",
      name: "مدير النظام",
      role: "ADMIN",
      passwordHash: await hashPassword("4195"),
      mustChangePassword: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      isActive: true
    },
    {
      id: "113976",
      username: "Ahmed.Refaai",
      name: "أحمد رفاعي",
      role: "AGENT",
      vanCode: "596",
      governorate: "القاهرة",
      email: "ahmed.refaai@te.eg",
      phone: "01555601070",
      passwordHash: await hashPassword("7007"),
      mustChangePassword: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      isActive: true
    },
    {
      id: "113978",
      username: "Ahmad.Abdelmohsen",
      name: "احمد عبد المحسن عبد الحميد",
      role: "AGENT",
      vanCode: "2346",
      governorate: "الدقهلية",
      email: "Ahmad.Abdelmohsen@te.eg",
      phone: "01555701000",
      passwordHash: await hashPassword("3978"),
      mustChangePassword: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      isActive: true
    }
  ];
  localStorage.setItem("we_users_v1", JSON.stringify(users));
}
async function getAllUsers() {
  await initializeDefaultUsers();
  const stored = localStorage.getItem("we_users_v1");
  return stored ? JSON.parse(stored) : [];
}
const DEFAULT_PERMISSIONS = {
  ADMIN: [
    { resource: "reconciliation", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "finance", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "monthly", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "historical", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "dailyEntry", actions: ["read", "write"], scope: "all" },
    { resource: "mySales", actions: ["read"], scope: "all" },
    { resource: "myLeaves", actions: ["read", "write"], scope: "all" },
    { resource: "vanSchedule", actions: ["read"], scope: "all" },
    { resource: "stock", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "allLeaves", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "vans", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "categories", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "users", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "reports", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "whatsapp", actions: ["read", "write", "delete", "export"], scope: "all" }
  ],
  SUPERVISOR: [
    { resource: "reconciliation", actions: ["read", "export"], scope: "governorate" },
    { resource: "finance", actions: ["read", "export"], scope: "governorate" },
    { resource: "monthly", actions: ["read", "export"], scope: "governorate" },
    { resource: "historical", actions: ["read", "export"], scope: "governorate" },
    { resource: "dailyEntry", actions: ["read"], scope: "governorate" },
    { resource: "mySales", actions: ["read"], scope: "governorate" },
    { resource: "myLeaves", actions: ["read", "write"], scope: "governorate" },
    { resource: "vanSchedule", actions: ["read"], scope: "governorate" },
    { resource: "stock", actions: ["read", "write"], scope: "governorate" },
    { resource: "allLeaves", actions: ["read", "write"], scope: "governorate" },
    { resource: "vans", actions: ["read", "write"], scope: "governorate" },
    { resource: "categories", actions: ["read"], scope: "all" },
    { resource: "users", actions: ["read"], scope: "governorate" },
    { resource: "reports", actions: ["read", "export"], scope: "governorate" },
    { resource: "whatsapp", actions: ["read"], scope: "governorate" }
  ],
  FINANCE: [
    { resource: "reconciliation", actions: ["read", "write", "export"], scope: "all" },
    { resource: "finance", actions: ["read", "write", "export"], scope: "all" },
    { resource: "monthly", actions: ["read", "export"], scope: "all" },
    { resource: "historical", actions: ["read", "export"], scope: "all" },
    { resource: "reports", actions: ["read", "export"], scope: "all" }
  ],
  STOCK_MANAGER: [
    { resource: "stock", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "vans", actions: ["read", "write"], scope: "all" },
    { resource: "categories", actions: ["read", "write"], scope: "all" },
    { resource: "reports", actions: ["read", "export"], scope: "all" }
  ],
  HR: [
    { resource: "allLeaves", actions: ["read", "write", "delete", "export"], scope: "all" },
    { resource: "users", actions: ["read", "write"], scope: "all" },
    { resource: "reports", actions: ["read", "export"], scope: "all" }
  ],
  AGENT: [
    { resource: "dailyEntry", actions: ["read", "write"], scope: "own" },
    { resource: "mySales", actions: ["read"], scope: "own" },
    { resource: "myLeaves", actions: ["read", "write"], scope: "own" },
    { resource: "vanSchedule", actions: ["read"], scope: "own" },
    { resource: "reconciliation", actions: ["read"], scope: "own" }
  ],
  SELLER: [
    { resource: "dailyEntry", actions: ["read", "write"], scope: "own" },
    { resource: "mySales", actions: ["read"], scope: "own" },
    { resource: "myLeaves", actions: ["read", "write"], scope: "own" },
    { resource: "vanSchedule", actions: ["read"], scope: "own" }
  ]
};
function buildPermissions(role, _vanCode, _governorate) {
  const basePerms = DEFAULT_PERMISSIONS[role] || [];
  return basePerms.map((p) => ({
    ...p,
    scope: p.scope === "own" ? "own" : p.scope === "van" ? "van" : p.scope === "governorate" ? "governorate" : "all"
  }));
}

const {useState: useState$2} = await importShared('react');

const {Outlet,NavLink} = await importShared('react-router-dom');
const navigation = [
  { path: "/stock", label: "إدارة المخزون", icon: "📦" },
  { path: "/leaves", label: "إدارة الإجازات", icon: "🏖️" },
  { path: "/vans", label: "إدارة الوحدات", icon: "🚐" },
  { path: "/categories", label: "مصفوفة الفئات", icon: "📊" }
];
function Layout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState$2(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", minHeight: "100vh" }, dir: "rtl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: "app-sidebar",
        style: {
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform var(--transition-normal)",
          display: "flex",
          flexDirection: "column",
          width: 280,
          background: "white",
          borderLeft: "1px solid var(--color-neutral-200)",
          height: "calc(100vh - 64px)",
          position: "sticky",
          top: 64,
          overflowY: "auto",
          zIndex: 50
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--space-4)", borderBottom: "1px solid var(--color-neutral-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 40,
              height: 40,
              borderRadius: "var(--radius-xl)",
              background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: "1.25rem"
            }, children: "WE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: "1rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "المخزون والإجازات" }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { style: { flex: 1, padding: "var(--space-4)", overflowY: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { style: { listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-1)" }, children: navigation.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            NavLink,
            {
              to: item.path,
              className: ({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]"}
                  `,
              style: {
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-xl)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--color-neutral-600)",
                textDecoration: "none",
                transition: "all var(--transition-fast)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.125rem" }, children: item.icon }),
                item.label
              ]
            }
          ) }, item.path)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--space-4)", borderTop: "1px solid var(--color-neutral-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 36,
              height: 36,
              borderRadius: "var(--radius-full)",
              background: "var(--color-primary-600)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "0.875rem"
            }, children: user?.name?.charAt(0) || "م" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "right" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-neutral-900)", margin: 0 }, children: user?.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", margin: 0 }, children: user?.role === "STOCK_MANAGER" ? "مدير مخزون" : user?.role === "HR" ? "شؤون موظفين" : "مشرف" })
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "white",
      borderBottom: "1px solid var(--color-neutral-200)",
      boxShadow: "var(--shadow-sm)",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 var(--space-6)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSidebarOpen(true),
            className: "btn btn-ghost btn-sm",
            style: { display: "none" },
            "aria-label": "فتح القائمة",
            children: "☰"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "المخزون والإجازات" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSidebarOpen(true),
            className: "btn btn-ghost btn-sm",
            style: { display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-1) var(--space-3)" },
            "aria-label": "فتح القائمة",
            children: "☰"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              localStorage.removeItem("we_auth_token");
              localStorage.removeItem("we_auth_user");
              window.location.href = "/login";
            },
            className: "btn btn-ghost btn-sm",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-1) var(--space-3)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                width: 32,
                height: 32,
                borderRadius: "var(--radius-full)",
                background: "var(--color-primary-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "0.75rem"
              }, children: user?.name?.charAt(0) || "م" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-neutral-700)" }, children: user?.name })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "app-main", style: { flex: 1, padding: "var(--space-6)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}

const {useState: useState$1} = await importShared('react');

const {useNavigate: useNavigate$1} = await importShared('react-router-dom');
function LoginPage() {
  const navigate = useNavigate$1();
  const { login } = useAuth();
  const [empId, setEmpId] = useState$1("");
  const [pin, setPin] = useState$1("");
  const [showPin, setShowPin] = useState$1(false);
  const [error, setError] = useState$1("");
  const [isLoading, setIsLoading] = useState$1(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!empId.trim()) {
      setError("اسم المستخدم أو رقم العامل مطلوب");
      return;
    }
    if (!pin.trim()) {
      setError("PIN مطلوب");
      return;
    }
    if (pin.length < 4) {
      setError("PIN يجب أن يكون 4 أرقام على الأقل");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.login(empId.trim(), pin);
      if (response.success && response.data) {
        await login(response.data.user, response.data.token);
        if (response.data.forcePinChange) {
          navigate("/change-pin");
        } else {
          navigate("/stock");
        }
        return;
      }
      const localResult = await localLogin(empId.trim(), pin);
      if (localResult) {
        await login(localResult.user, localResult.token);
        if (localResult.forcePinChange) {
          navigate("/change-pin");
        } else {
          navigate("/stock");
        }
        return;
      }
      setError(response.error || "اسم المستخدم أو رقم العامل أو PIN غير صحيح");
    } catch {
      const localResult = await localLogin(empId.trim(), pin);
      if (localResult) {
        await login(localResult.user, localResult.token);
        if (localResult.forcePinChange) {
          navigate("/change-pin");
        } else {
          navigate("/stock");
        }
        return;
      }
      setError("اسم المستخدم أو رقم العامل أو PIN غير صحيح");
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "var(--space-1)" }, children: "الإدارة العامة للوحدات المتنقلة" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", fontSize: "0.875rem", margin: 0 }, children: "نظام المخزون والإجازات" })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "1. اسم المستخدم أو رقم العامل *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "text",
            value: empId,
            onChange: (e) => setEmpId(e.target.value),
            placeholder: "أدخل رقم العامل أو اسم المستخدم (مثال: 113976 أو admin أو Ahmed.Refaai)",
            autoComplete: "username",
            required: true,
            disabled: isLoading
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "2. الرمز السري (PIN) *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: showPin ? "text" : "password",
              value: pin,
              onChange: (e) => setPin(e.target.value),
              placeholder: "أدخل PIN الخاص بك",
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
              onClick: () => setShowPin(!showPin),
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
              children: showPin ? "🙈" : "👁️"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "المدير: admin / 4195  |  الموظف: رقم العامل / PIN" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          fullWidth: true,
          size: "lg",
          loading: isLoading,
          style: { marginBottom: "var(--space-4)" },
          children: "تسجيل الدخول"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => alert("لإعادة تعيين PIN، يرجى التواصل مع الإدارة"),
            className: "btn btn-ghost btn-sm",
            style: { padding: 0 },
            children: "نسيت PIN؟"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-neutral-400)" }, children: "للإدارة العامة للوحدات المتنقلة - WE" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderTop: "1px solid var(--color-neutral-200)", paddingTop: "var(--space-4)", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", margin: 0 }, children: "إصدار 1.0.0 | نظام آمن ومشفر" }) })
  ] }) });
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
        navigate("/stock");
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

const {Navigate: Navigate$1,useLocation} = await importShared('react-router-dom');
const React = await importShared('react');

function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--color-neutral-50)"
        }
      },
      React.createElement("div", { className: "loading-spinner", style: { width: 40, height: 40 } })
    );
  }
  if (!user) {
    return React.createElement(Navigate$1, { to: "/login", state: { from: location }, replace: true });
  }
  if (requiredRole) {
    const roleHierarchy = {
      ADMIN: 100,
      SUPERVISOR: 80,
      FINANCE: 70,
      STOCK_MANAGER: 60,
      HR: 60,
      AGENT: 40,
      SELLER: 30
    };
    const userRoleLevel = roleHierarchy[user.role] ?? 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] ?? 0;
    if (userRoleLevel < requiredRoleLevel) {
      return React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "var(--color-neutral-50)",
            padding: "var(--space-6)"
          }
        },
        React.createElement(
          "div",
          {
            style: {
              maxWidth: 400,
              textAlign: "center",
              background: "white",
              borderRadius: "var(--radius-2xl)",
              padding: "var(--space-6)",
              boxShadow: "var(--shadow-xl)"
            }
          },
          React.createElement("div", { style: { fontSize: "3rem", marginBottom: "var(--space-4)" } }, "🔒"),
          React.createElement("h2", { style: { fontSize: "1.25rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "var(--space-3)" } }, "غير مصرح"),
          React.createElement("p", { style: { color: "var(--color-neutral-600)", marginBottom: "var(--space-6)" } }, "لا تملك الصلاحية للوصول إلى هذه الصفحة. دورك الحالي: ", React.createElement("strong", null, user.role)),
          React.createElement("button", {
            onClick: () => window.history.back(),
            style: {
              background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
              color: "white",
              border: "none",
              padding: "var(--space-2) var(--space-4)",
              borderRadius: "var(--radius-lg)",
              fontWeight: 600,
              cursor: "pointer"
            }
          }, "رجوع")
        )
      );
    }
  }
  return React.createElement(React.Fragment, null, children);
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { requiredRole: "STOCK_MANAGER", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/stock", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "stock", element: /* @__PURE__ */ jsxRuntimeExports.jsx(StockManagementPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "leaves", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LeavesManagementPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "vans", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VanManagementPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "categories", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryMatrixPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "change-pin", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePinPage, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/stock", replace: true }) })
  ] });
}
function InvRoutes() {
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { requiredRole: "STOCK_MANAGER", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/stock", replace: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "stock", element: /* @__PURE__ */ jsxRuntimeExports.jsx(StockManagementPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "leaves", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LeavesManagementPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "vans", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VanManagementPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "categories", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryMatrixPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "change-pin", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePinPage, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/stock", replace: true }) })
  ] });
}

export { AuthProvider as A, InvRoutes as I, App as a };
