import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';
import { a as api, d as StatCard, f as formatNumber, b as formatCurrency, C as Card, c as Badge, I as Input, B as Button } from './index-Cuw773HR.js';

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

const {Outlet,NavLink,useNavigate: useNavigate$1} = await importShared('react-router-dom');

const {useState: useState$2} = await importShared('react');
const navigation = [
  { path: "/dashboard", label: "لوحة التحكم", icon: "📊" },
  { path: "/reconciliation", label: "التسوية والمراجعة", icon: "⚖️" },
  { path: "/finance", label: "المالية و BSS", icon: "💰" },
  { path: "/monthly", label: "التقارير الشهرية", icon: "📅" },
  { path: "/historical", label: "التحليل التاريخي", icon: "📈" },
  { path: "/master-preview", label: "معاينة الشيت الرئيسي", icon: "📋" }
];
function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate$1();
  const [sidebarOpen, setSidebarOpen] = useState$2(false);
  const [userMenuOpen, setUserMenuOpen] = useState$2(false);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const getRoleLabel = (role) => {
    const labels = {
      ADMIN: "مدير النظام",
      SUPERVISOR: "مشرف",
      FINANCE: "مالية",
      STOCK_MANAGER: "مدير مخزون",
      HR: "شؤون موظفين",
      AGENT: "مسؤول مبيعات",
      SELLER: "بائع"
    };
    return labels[role] || role;
  };
  const getRoleColor = (role) => {
    const colors = {
      ADMIN: "var(--color-primary-600)",
      SUPERVISOR: "var(--color-secondary-500)",
      FINANCE: "var(--color-success-500)",
      STOCK_MANAGER: "var(--color-warning-500)",
      HR: "#EC4899",
      AGENT: "var(--color-primary-600)",
      SELLER: "#6366F1"
    };
    return colors[role] || "var(--color-neutral-500)";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-layout", dir: "rtl", children: [
    sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "sidebar-overlay",
        onClick: () => setSidebarOpen(false),
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: "var(--z-modal)",
          display: "block"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: "app-sidebar",
        style: {
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform var(--transition-normal)",
          display: "flex",
          flexDirection: "column"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", style: { borderBottom: "1px solid var(--color-neutral-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3)" }, children: [
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: "1rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "الإدارة العامة للوحدات المتنقلة" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-neutral-500)", margin: 0 }, children: "تطبيق المراجعة والتقارير" })
            ] })
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
                transition: "all var(--transition-fast)",
                ...item.path === "/dashboard" ? {} : {}
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.125rem" }, children: item.icon }),
                item.label
              ]
            }
          ) }, item.path)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-footer", style: { borderTop: "1px solid var(--color-neutral-200)", padding: "var(--space-4)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 36,
              height: 36,
              borderRadius: "var(--radius-full)",
              background: getRoleColor(user?.role || "AGENT"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "0.875rem"
            }, children: user?.name?.charAt(0) || "م" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "right" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-neutral-900)", margin: 0 }, children: user?.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", margin: 0 }, children: getRoleLabel(user?.role || "AGENT") })
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "app-header", style: {
      position: "sticky",
      top: 0,
      zIndex: "var(--z-sticky)",
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "تطبيق المراجعة والتقارير" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-ghost btn-sm", style: { position: "relative" }, children: [
          "🔔",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            position: "absolute",
            top: 4,
            left: 4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--color-error-500)"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setUserMenuOpen(!userMenuOpen),
              className: "btn btn-ghost",
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
                  background: getRoleColor(user?.role || "AGENT"),
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
          ),
          userMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "var(--space-2)",
            minWidth: 200,
            background: "white",
            border: "1px solid var(--color-neutral-200)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-xl)",
            zIndex: "var(--z-dropdown)",
            overflow: "hidden"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-header", style: { padding: "var(--space-3)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "0.75rem", color: "var(--color-neutral-500)", margin: 0 }, children: [
                "رقم العامل: ",
                user?.id
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "0.75rem", color: "var(--color-neutral-500)", margin: 0 }, children: [
                "الدور: ",
                getRoleLabel(user?.role || "AGENT")
              ] }),
              user?.vanCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "0.75rem", color: "var(--color-neutral-500)", margin: 0 }, children: [
                "الوحدة: ",
                user.vanCode
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleLogout,
                style: {
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3)",
                  background: "none",
                  border: "none",
                  color: "var(--color-error-500)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "right"
                },
                children: "🚪 تسجيل الخروج"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "app-main", style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}

const {useQuery} = await importShared('@tanstack/react-query');
const {useState: useState$1} = await importShared('react');

function DashboardPage() {
  const [filters, setFilters] = useState$1({
    dateFrom: "2026-11-01",
    dateTo: "2026-11-10",
    vanCode: "",
    governorate: "",
    groupBy: "van"
  });
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboardStats", filters],
    queryFn: async () => {
      const response = await api.getFinanceComparison({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || void 0,
        governorate: filters.governorate || void 0,
        groupBy: filters.groupBy
      });
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 5 * 60 * 1e3
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { maxWidth: 600, margin: "var(--space-6) auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "تعذر تحميل البيانات" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: () => refetch(), children: "إعادة المحاولة" })
    ] }) }) });
  }
  const s = stats || {
    totalEntries: 0,
    matched: 0,
    excess: 0,
    shortage: 0,
    totalEnteredAmount: 0,
    totalBSSAmount: 0,
    totalDifference: 0,
    matchRate: 0,
    byGovernorate: [],
    topDiscrepancies: []
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "لوحة تحكم المراجعة والتقارير" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "نظرة شاملة على التسويات المالية والتقارير للفترة المحددة" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.875rem", color: "var(--color-neutral-700)" }, children: [
          "من:",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: filters.dateFrom,
              onChange: (e) => setFilters((f) => ({ ...f, dateFrom: e.target.value })),
              className: "form-input",
              style: { width: "auto", minWidth: 160 }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.875rem", color: "var(--color-neutral-700)" }, children: [
          "إلى:",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: filters.dateTo,
              onChange: (e) => setFilters((f) => ({ ...f, dateTo: e.target.value })),
              className: "form-input",
              style: { width: "auto", minWidth: 160 }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: () => refetch(), disabled: !filters.dateFrom || !filters.dateTo, children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "إجمالي السجلات",
          value: formatNumber(s.totalEntries),
          icon: "📋",
          color: "primary",
          trend: "neutral"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "مطابق",
          value: formatNumber(s.matched),
          change: s.totalEntries > 0 ? Number((s.matched / s.totalEntries * 100).toFixed(1)) : 0,
          icon: "✅",
          color: "success",
          trend: "up"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "زيادة",
          value: formatNumber(s.excess),
          change: s.totalEntries > 0 ? Number((s.excess / s.totalEntries * 100).toFixed(1)) : 0,
          icon: "⬆️",
          color: "warning",
          trend: "down"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "نقص",
          value: formatNumber(s.shortage),
          change: s.totalEntries > 0 ? Number((s.shortage / s.totalEntries * 100).toFixed(1)) : 0,
          icon: "⬇️",
          color: "error",
          trend: "down"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "مبلغ مدخول",
          value: formatCurrency(s.totalEnteredAmount),
          icon: "💵",
          color: "secondary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "مبلغ BSS",
          value: formatCurrency(s.totalBSSAmount),
          icon: "🏦",
          color: "primary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "الفرق",
          value: formatCurrency(s.totalDifference),
          icon: "📊",
          color: s.totalDifference > 0 ? "warning" : s.totalDifference < 0 ? "error" : "success"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "معدل المطابقة",
          value: `${s.matchRate}%`,
          icon: "🎯",
          color: s.matchRate >= 95 ? "success" : s.matchRate >= 85 ? "warning" : "error"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title", children: "الأداء حسب المحافظة" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "السجلات" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "المدخول" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "BSS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "الفرق" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: s.byGovernorate.slice(0, 10).map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500 }, children: g.governorate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(g.count) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatCurrency(g.entered) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatCurrency(g.bss) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: g.diff > 0 ? "warning" : g.diff < 0 ? "error" : "success",
                children: [
                  g.diff >= 0 ? "+" : "",
                  formatCurrency(g.diff)
                ]
              }
            ) })
          ] }, i)) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title", children: "أكبر الفروقات" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المسؤول" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "الفرق" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "النوع" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: s.topDiscrepancies.slice(0, 10).map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: d.vanCode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: d.agent }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: d.type === "excess" ? "var(--color-warning-600)" : "var(--color-error-600)", fontWeight: 600 }, children: [
              d.diff >= 0 ? "+" : "",
              formatCurrency(Math.abs(d.diff))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: d.type === "excess" ? "warning" : "error", children: d.type === "excess" ? "زيادة" : "نقص" }) })
          ] }, i)) })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title", children: "إجراءات سريعة" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/reconciliation", className: "btn btn-primary", children: "⚖️ فتح التسوية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/finance", className: "btn btn-secondary", children: "💰 المقارنة المالية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/monthly", className: "btn btn-secondary", children: "📅 التقارير الشهرية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/historical", className: "btn btn-secondary", children: "📈 التحليل التاريخي" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/master-preview", className: "btn btn-secondary", children: "📋 معاينة الشيت الرئيسي" })
      ] })
    ] })
  ] });
}

const {useState} = await importShared('react');

const {useNavigate} = await importShared('react-router-dom');
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [empId, setEmpId] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
          navigate("/dashboard");
        }
        return;
      }
      const localResult = await localLogin(empId.trim(), pin);
      if (localResult) {
        await login(localResult.user, localResult.token);
        if (localResult.forcePinChange) {
          navigate("/change-pin");
        } else {
          navigate("/dashboard");
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
          navigate("/dashboard");
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", style: { borderBottom: "none", background: "transparent", paddingBottom: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", fontSize: "0.875rem", margin: 0 }, children: "تطبيق المراجعة والتقارير" })
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-footer", style: { borderTop: "1px solid var(--color-neutral-200)", paddingTop: "var(--space-4)", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", margin: 0 }, children: "إصدار 1.0.0 | نظام آمن ومشفر" }) })
  ] }) });
}

const {Navigate,useLocation} = await importShared('react-router-dom');
function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
  }
  if (requiredRole && requiredRole.length > 0 && !requiredRole.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "var(--color-neutral-50)",
      padding: "var(--space-6)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { maxWidth: 400, textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "var(--space-4)" }, children: "🔒" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "card-title", style: { marginBottom: "var(--space-3)" }, children: "غير مصرح" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "var(--color-neutral-600)", marginBottom: "var(--space-6)" }, children: [
        "لا تملك الصلاحية للوصول إلى هذه الصفحة. دورك الحالي: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user.role })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "btn btn-primary",
          onClick: () => window.history.back(),
          children: "رجوع"
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}

export { AuthProvider as A, DashboardPage as D, LoginPage as L, ProtectedRoute as P, Layout as a, useAuth as u };
