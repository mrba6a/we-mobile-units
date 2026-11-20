import { importShared } from './__federation_fn_import-Cr-sgxHt.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CyoIsdjr.js';

var define_process_env_default = {};
const getApiBase = () => {
  if (typeof importMeta !== "undefined" && importMeta.env?.VITE_API_BASE) {
    return importMeta.env.VITE_API_BASE;
  }
  if (typeof process !== "undefined" && define_process_env_default?.VITE_API_BASE) {
    return define_process_env_default.VITE_API_BASE;
  }
  return "/api";
};
const API_BASE = getApiBase();
class ApiClient {
  baseUrl;
  token = null;
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem("we_auth_token");
  }
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("we_auth_token", token);
    } else {
      localStorage.removeItem("we_auth_token");
    }
  }
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async request(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || "Request failed" };
    }
    return { success: true, data: data.data || data };
  }
  // ==================== AUTH ====================
  async login(empId, pin) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ empId, pin })
    });
  }
  async verifyToken() {
    return this.request("/auth/verify");
  }
  async changePin(oldPin, newPin) {
    return this.request("/auth/change-pin", {
      method: "POST",
      body: JSON.stringify({ oldPin, newPin })
    });
  }
  async changePassword(oldPassword, newPassword) {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword })
    });
  }
  async logout() {
    this.setToken(null);
  }
  // ==================== DATA (Agents, Vans, Plans) ====================
  async getAgents(filters) {
    const params = new URLSearchParams();
    if (filters?.agentId) params.set("agentId", filters.agentId);
    if (filters?.role) params.set("role", filters.role);
    if (filters?.vanCode) params.set("vanCode", filters.vanCode);
    return this.request(`/data/agents?${params}`);
  }
  async getAgentById(id) {
    return this.request(`/data/agents/${id}`);
  }
  async getVans(filters) {
    const params = new URLSearchParams();
    if (filters?.vanCode) params.set("vanCode", filters.vanCode);
    if (filters?.governorate) params.set("governorate", filters.governorate);
    if (filters?.sector) params.set("sector", filters.sector);
    return this.request(`/data/vans?${params}`);
  }
  async getVanByCode(code) {
    return this.request(`/data/vans/${code}`);
  }
  async getDailyMovementPlan(date) {
    const params = date ? `?date=${date}` : "";
    return this.request(`/data/movement-plan${params}`);
  }
  async updateDailyMovementPlan(data) {
    return this.request("/data/movement-plan", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  // ==================== DAILY ENTRY ====================
  async createDailyEntry(entry) {
    return this.request("/entries", {
      method: "POST",
      body: JSON.stringify(entry)
    });
  }
  async getDailyEntries(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.period) params.set("period", filters.period);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
    return this.request(`/entries?${params}`);
  }
  async getDailyEntryById(id) {
    return this.request(`/entries/${id}`);
  }
  async updateDailyEntry(id, entry) {
    return this.request(`/entries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(entry)
    });
  }
  async submitDailyEntry(id) {
    return this.request(`/entries/${id}/submit`, { method: "POST" });
  }
  // ==================== RECONCILIATION ====================
  async getReconciliation(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    if (filters.mode) params.set("mode", filters.mode);
    if (filters.basis) params.set("basis", filters.basis);
    return this.request(`/reconciliation?${params}`);
  }
  async getReconciliationSummary(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    return this.request(`/reconciliation/summary?${params}`);
  }
  // ==================== FINANCE / BSS ====================
  async getBSSData(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    return this.request(`/finance/bss?${params}`);
  }
  async getFinanceComparison(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    if (filters.groupBy) params.set("groupBy", filters.groupBy);
    return this.request(`/finance/comparison?${params}`);
  }
  async getFinanceDiscrepancies(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    return this.request(`/finance/discrepancies?${params}`);
  }
  // ==================== REPORTS ====================
  async getMonthlyReport(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    if (filters.month) params.set("month", filters.month);
    if (filters.year) params.set("year", String(filters.year));
    if (filters.agentId) params.set("agentId", filters.agentId);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
    return this.request(`/reports/monthly?${params}`);
  }
  async getCategories(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    return this.request(`/reports/categories?${params}`);
  }
  async getHistoricalReport(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    if (filters.period) params.set("period", filters.period);
    return this.request(`/reports/historical?${params}`);
  }
  async getFinalSheet(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    if (filters.status) params.set("status", filters.status);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
    return this.request(`/reports/final-sheet?${params}`);
  }
  async exportReport(type, filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== void 0) params.set(key, String(value));
    });
    const response = await fetch(`${this.baseUrl}/reports/export/${type}?${params}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {}
    });
    return response.blob();
  }
  // ==================== STOCK ====================
  async getStock(filters) {
    const params = new URLSearchParams();
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    return this.request(`/stock?${params}`);
  }
  async updateStock(item) {
    return this.request("/stock", {
      method: "POST",
      body: JSON.stringify(item)
    });
  }
  async getStockTransfers(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    return this.request(`/stock/transfers?${params}`);
  }
  async createStockTransfer(transfer) {
    return this.request("/stock/transfers", {
      method: "POST",
      body: JSON.stringify(transfer)
    });
  }
  async approveStockTransfer(id) {
    return this.request(`/stock/transfers/${id}/approve`, { method: "POST" });
  }
  // ==================== LEAVES ====================
  async getLeaves(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    if (filters.status) params.set("status", filters.status);
    if (filters.agentId) params.set("agentId", filters.agentId);
    return this.request(`/leaves?${params}`);
  }
  // ==================== MY SALES (Agent) ====================
  async getMySales(filters) {
    const params = new URLSearchParams();
    if (filters.agentId) params.set("agentId", filters.agentId);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    return this.request(`/sales/my-sales?${params}`);
  }
  // ==================== VAN SCHEDULE ====================
  async getVanSchedule(filters) {
    const params = new URLSearchParams();
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    return this.request(`/schedule/van?${params}`);
  }
  async createLeaveRequest(leave) {
    return this.request("/leaves", {
      method: "POST",
      body: JSON.stringify(leave)
    });
  }
  async approveLeave(id, approved, notes) {
    return this.request(`/leaves/${id}/${approved ? "approve" : "reject"}`, {
      method: "POST",
      body: JSON.stringify({ notes })
    });
  }
  async getLeaveBalances(filters) {
    const params = new URLSearchParams();
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    if (filters.governorate) params.set("governorate", filters.governorate);
    return this.request(`/leaves/balances?${params}`);
  }
  // ==================== WHATSAPP ====================
  async importWhatsAppData(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${this.baseUrl}/whatsapp/import`, {
      method: "POST",
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData
    });
    return response.json();
  }
  async getWhatsAppReports(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    return this.request(`/whatsapp/reports?${params}`);
  }
  // ==================== DAWRY (الدوري) ====================
  async getDawryData(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    return this.request(`/dawry?${params}`);
  }
  async matchDawryWithVoiceAmount(filters) {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.vanCode) params.set("vanCode", filters.vanCode);
    return this.request(`/dawry/match-voice?${params}`);
  }
}
const api = new ApiClient();

const {createContext,useContext,useState: useState$7,useEffect} = await importShared('react');
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState$7(null);
  const [token, setToken] = useState$7(null);
  const [isLoading, setIsLoading] = useState$7(true);
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

const {Outlet,NavLink,useNavigate: useNavigate$2} = await importShared('react-router-dom');

const {useState: useState$6} = await importShared('react');
const navigation = [
  { path: "/daily-entry", label: "البيان اليومي", icon: "📝" },
  { path: "/my-sales", label: "مبيعاتي", icon: "📈" },
  { path: "/my-leaves", label: "إجازاتي", icon: "🏖️" },
  { path: "/van-schedule", label: "جدولي", icon: "📅" }
];
function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate$2();
  const [sidebarOpen, setSidebarOpen] = useState$6(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: "1rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "تطبيق الموظف" }) })
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", margin: 0 }, children: user?.role === "AGENT" ? "مسؤول مبيعات" : "بائع" })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "تطبيق الموظف" })
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
            onClick: handleLogout,
            className: "btn btn-ghost btn-sm",
            style: { display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-1) var(--space-3)" },
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

const {forwardRef} = await importShared('react');

const Button = forwardRef(
  ({ variant = "primary", size = "md", loading, fullWidth, leftIcon, rightIcon, icon, children, className = "", disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;
    const variantStyles = {
      primary: "bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white shadow-md hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-800)] hover:shadow-lg hover:-translate-y-0.5",
      secondary: "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]",
      success: "bg-[var(--color-success-500)] text-white hover:bg-[var(--color-success-600)]",
      warning: "bg-[var(--color-warning-500)] text-white hover:bg-[var(--color-warning-600)]",
      error: "bg-[var(--color-error-500)] text-white hover:bg-[var(--color-error-600)]",
      ghost: "bg-transparent text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]",
      outline: "bg-transparent border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] hover:border-[var(--color-neutral-400)]"
    };
    const sizeStyles = {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg"
    };
    const style = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        ref,
        className: style,
        disabled: disabled || loading,
        ...props,
        children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
          ] }),
          !loading && (leftIcon || icon) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: leftIcon || icon }),
          children,
          !loading && rightIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: rightIcon })
        ]
      }
    );
  }
);
Button.displayName = "Button";
const Input = forwardRef(
  ({ label, error, hint, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className, style: { marginBottom: "var(--space-4)" }, children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: inputId, className: "form-label", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
        leftIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          right: "var(--space-3)",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--color-neutral-400)",
          pointerEvents: "none"
        }, children: leftIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref,
            id: inputId,
            className: `form-input ${error ? "border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-100)]" : ""} ${leftIcon ? "pr-10" : ""} ${rightIcon ? "pl-10" : ""}`,
            "aria-invalid": error ? "true" : "false",
            "aria-describedby": error ? `${inputId}-error` : hint ? `${inputId}-hint` : void 0,
            ...props
          }
        ),
        rightIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          left: "var(--space-3)",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--color-neutral-400)",
          pointerEvents: "none"
        }, children: rightIcon })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: `${inputId}-error`, className: "form-error", role: "alert", children: error }),
      hint && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: `${inputId}-hint`, className: "form-hint", children: hint })
    ] });
  }
);
Input.displayName = "Input";
const Select = forwardRef(
  ({ label, error, hint, options, className = "", id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2)}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className, style: { marginBottom: "var(--space-4)" }, children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: selectId, className: "form-label", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          ref,
          id: selectId,
          className: `form-input form-select ${error ? "border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-100)]" : ""}`,
          "aria-invalid": error ? "true" : "false",
          "aria-describedby": error ? `${selectId}-error` : hint ? `${selectId}-hint` : void 0,
          ...props,
          children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, disabled: opt.disabled, children: opt.label }, opt.value))
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: `${selectId}-error`, className: "form-error", role: "alert", children: error }),
      hint && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: `${selectId}-hint`, className: "form-hint", children: hint })
    ] });
  }
);
Select.displayName = "Select";
function Badge({ children, variant = "neutral", size = "md", className = "", style }) {
  const variantStyles = {
    default: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
    success: "bg-[var(--color-success-50)] text-[var(--color-success-700)]",
    warning: "bg-[var(--color-warning-50)] text-[var(--color-warning-700)]",
    error: "bg-[var(--color-error-50)] text-[var(--color-error-700)]",
    info: "bg-[var(--color-secondary-50)] text-[var(--color-secondary-700)]",
    neutral: "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]"
  };
  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[0.5625rem]",
    md: "px-2 py-0.5 text-[0.6875rem]",
    lg: "px-3 py-1 text-sm"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center font-bold rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`,
      style: { whiteSpace: "nowrap", ...style },
      children
    }
  );
}
function Card({ children, className = "", style, padding = "md", hoverable, onClick }) {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `card ${hoverable ? "cursor-pointer hover:shadow-lg transition-shadow" : ""} ${className}`,
      style: { padding: paddingStyles[padding], ...style },
      onClick,
      children
    }
  );
}
function Tabs({ tabs, activeTab, onChange, variant = "line", fullWidth, className = "" }) {
  const variantStyles = {
    line: "border-b border-[var(--color-neutral-200)]",
    enclosed: "bg-[var(--color-neutral-100)] rounded-xl p-1",
    soft: "",
    pills: ""
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `tabs ${variantStyles[variant]} ${className}`, style: { display: "flex", ...fullWidth ? { width: "100%" } : {} }, role: "tablist", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      role: "tab",
      "aria-selected": activeTab === tab.id,
      "aria-disabled": tab.disabled,
      disabled: tab.disabled,
      onClick: () => !tab.disabled && onChange(tab.id),
      className: `
            flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${activeTab === tab.id ? variant === "enclosed" ? "bg-white text-[var(--color-primary-700)] shadow-sm" : variant === "pills" ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]" : "text-[var(--color-primary-700)] border-b-2 border-[var(--color-primary-600)]" : "text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]"}
          `,
      style: {
        borderBottom: variant === "line" && activeTab === tab.id ? "2px solid var(--color-primary-600)" : void 0,
        marginBottom: variant === "line" && activeTab === tab.id ? "-1px" : void 0,
        flex: fullWidth ? 1 : void 0
      },
      children: [
        tab.icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.icon }),
        tab.label,
        tab.badge && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "error", size: "sm", children: tab.badge })
      ]
    },
    tab.id
  )) });
}

const {useState: useState$5} = await importShared('react');
function DailyEntryPage() {
  const [vanCode, setVanCode] = useState$5("");
  const [location, setLocation] = useState$5("");
  const [agentCount, setAgentCount] = useState$5(1);
  const [agents, setAgents] = useState$5([{ id: "", name: "" }]);
  const handleAddAgent = () => {
    if (agents.length >= 12) return;
    setAgents([...agents, { id: "", name: "" }]);
  };
  const handleRemoveAgent = (index) => {
    if (agents.length <= 1) return;
    setAgents(agents.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("سيتم حفظ البيان اليومي");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "البيان اليومي" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "إدخال بيانات المبيعات والخطوط والتعاقدات اليومية" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: handleSubmit, size: "lg", children: "حفظ البيان" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title", children: "معلومات الوحدة" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-end" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 200 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "كود الوحدة *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "text",
              value: vanCode,
              onChange: (e) => setVanCode(e.target.value),
              placeholder: "مثال: 231",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 200 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الموقع *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "text",
              value: location,
              onChange: (e) => setLocation(e.target.value),
              placeholder: "مثال: شنشور - أشمون",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 150 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "عدد مسؤولي المبيعات *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              value: String(agentCount),
              onChange: (e) => setAgentCount(Number(e.target.value)),
              options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title", children: "مسؤولي المبيعات اليوم" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", children: [
        agents.map((agent, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)", padding: "var(--space-4)", borderBottom: "1px solid var(--color-neutral-200)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 200 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "form-label", children: [
              "المسؤول ",
              index + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                value: agent.name,
                onChange: (e) => {
                  const newAgents = [...agents];
                  newAgents[index] = { ...agent, name: e.target.value };
                  setAgents(newAgents);
                },
                placeholder: "اسم المسؤول"
              }
            )
          ] }),
          agents.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleRemoveAgent(index),
              className: "btn btn-ghost btn-sm",
              style: { marginTop: "auto", height: "fit-content" },
              children: "حذف"
            }
          )
        ] }, index)),
        agents.length < 12 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleAddAgent, className: "btn btn-outline", style: { marginTop: "var(--space-4)" }, children: "+ إضافة مسؤول آخر" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        tabs: [
          { id: "lines", label: "الخطوط والباقات", icon: "📱" },
          { id: "adsl", label: "ADSL والإنترنت", icon: "🌐" },
          { id: "devices", label: "الأجهزة", icon: "📱" },
          { id: "amounts", label: "المبالغ", icon: "💰" }
        ],
        activeTab: "lines",
        onChange: () => {
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", textAlign: "center", padding: "var(--space-10)" }, children: "نموذج البيان اليومي - سيتم تطوير الحقول التفصيلية لكل تبويب" }) }) })
  ] });
}

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param argument - The value to convert
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);

  // Clone the date
  if (
    argument instanceof Date ||
    (typeof argument === "object" && argStr === "[object Date]")
  ) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new argument.constructor(+argument);
  } else if (
    typeof argument === "number" ||
    argStr === "[object Number]" ||
    typeof argument === "string" ||
    argStr === "[object String]"
  ) {
    // TODO: Can we get rid of as?
    return new Date(argument);
  } else {
    // TODO: Can we get rid of as?
    return new Date(NaN);
  }
}

/**
 * @name constructFrom
 * @category Generic Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 * @param value - The value to create the date
 *
 * @returns Date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from 'date-fns'
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<DateType extends Date(date: DateType): DateType {
 *   return constructFrom(
 *     date, // Use contrustor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   )
 * }
 */
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}

/**
 * @module constants
 * @summary Useful constants
 * @description
 * Collection of useful date constants.
 *
 * The constants could be imported from `date-fns/constants`:
 *
 * ```ts
 * import { maxTime, minTime } from "./constants/date-fns/constants";
 *
 * function isAllowedTime(time) {
 *   return time <= maxTime && time >= minTime;
 * }
 * ```
 */


/**
 * @constant
 * @name millisecondsInWeek
 * @summary Milliseconds in 1 week.
 */
const millisecondsInWeek = 604800000;

/**
 * @constant
 * @name millisecondsInDay
 * @summary Milliseconds in 1 day.
 */
const millisecondsInDay = 86400000;

/**
 * @constant
 * @name millisecondsInMinute
 * @summary Milliseconds in 1 minute
 */
const millisecondsInMinute = 60000;

/**
 * @constant
 * @name millisecondsInHour
 * @summary Milliseconds in 1 hour
 */
const millisecondsInHour = 3600000;

let defaultOptions = {};

function getDefaultOptions() {
  return defaultOptions;
}

/**
 * The {@link startOfWeek} function options.
 */

/**
 * @name startOfWeek
 * @category Week Helpers
 * @summary Return the start of a week for the given date.
 *
 * @description
 * Return the start of a week for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of a week
 *
 * @example
 * // The start of a week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfWeek(date, options) {
  const defaultOptions = getDefaultOptions();
  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const _date = toDate(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

/**
 * @name startOfISOWeek
 * @category ISO Week Helpers
 * @summary Return the start of an ISO week for the given date.
 *
 * @description
 * Return the start of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of an ISO week
 *
 * @example
 * // The start of an ISO week for 2 September 2014 11:55:00:
 * const result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfISOWeek(date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/**
 * @name getISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the ISO week-numbering year of the given date.
 *
 * @description
 * Get the ISO week-numbering year of the given date,
 * which always starts 3 days before the year's first Thursday.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The ISO week-numbering year
 *
 * @example
 * // Which ISO-week numbering year is 2 January 2005?
 * const result = getISOWeekYear(new Date(2005, 0, 2))
 * //=> 2004
 */
function getISOWeekYear(date) {
  const _date = toDate(date);
  const year = _date.getFullYear();

  const fourthOfJanuaryOfNextYear = constructFrom(date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);

  const fourthOfJanuaryOfThisYear = constructFrom(date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);

  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

/**
 * @name startOfDay
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a day
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(date) {
  const _date = toDate(date);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds(),
    ),
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

/**
 * @name differenceInCalendarDays
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates. This means that the times are removed
 * from the dates and then the difference in days is calculated.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of calendar days
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 * // How many calendar days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInCalendarDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 1
 */
function differenceInCalendarDays(dateLeft, dateRight) {
  const startOfDayLeft = startOfDay(dateLeft);
  const startOfDayRight = startOfDay(dateRight);

  const timestampLeft =
    +startOfDayLeft - getTimezoneOffsetInMilliseconds(startOfDayLeft);
  const timestampRight =
    +startOfDayRight - getTimezoneOffsetInMilliseconds(startOfDayRight);

  // Round the number of days to the nearest integer because the number of
  // milliseconds in a day is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round((timestampLeft - timestampRight) / millisecondsInDay);
}

/**
 * @name startOfISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the start of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the start of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of an ISO week-numbering year
 *
 * @example
 * // The start of an ISO week-numbering year for 2 July 2005:
 * const result = startOfISOWeekYear(new Date(2005, 6, 2))
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfISOWeekYear(date) {
  const year = getISOWeekYear(date);
  const fourthOfJanuary = constructFrom(date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}

/**
 * @name isDate
 * @category Common Helpers
 * @summary Is the given value a date?
 *
 * @description
 * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
 *
 * @param value - The value to check
 *
 * @returns True if the given value is a date
 *
 * @example
 * // For a valid date:
 * const result = isDate(new Date())
 * //=> true
 *
 * @example
 * // For an invalid date:
 * const result = isDate(new Date(NaN))
 * //=> true
 *
 * @example
 * // For some value:
 * const result = isDate('2014-02-31')
 * //=> false
 *
 * @example
 * // For an object:
 * const result = isDate({})
 * //=> false
 */
function isDate(value) {
  return (
    value instanceof Date ||
    (typeof value === "object" &&
      Object.prototype.toString.call(value) === "[object Date]")
  );
}

/**
 * @name isValid
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Argument is converted to Date using `toDate`. See [toDate](https://date-fns.org/docs/toDate)
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 *
 * @returns The date is valid
 *
 * @example
 * // For the valid date:
 * const result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the value, convertable into a date:
 * const result = isValid(1393804800000)
 * //=> true
 *
 * @example
 * // For the invalid date:
 * const result = isValid(new Date(''))
 * //=> false
 */
function isValid(date) {
  if (!isDate(date) && typeof date !== "number") {
    return false;
  }
  const _date = toDate(date);
  return !isNaN(Number(_date));
}

/**
 * @name startOfYear
 * @category Year Helpers
 * @summary Return the start of a year for the given date.
 *
 * @description
 * Return the start of a year for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a year
 *
 * @example
 * // The start of a year for 2 September 2014 11:55:00:
 * const result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Jan 01 2014 00:00:00
 */
function startOfYear(date) {
  const cleanDate = toDate(date);
  const _date = constructFrom(date, 0);
  _date.setFullYear(cleanDate.getFullYear(), 0, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

const formatDistanceLocale$1 = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds",
  },

  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds",
  },

  halfAMinute: "half a minute",

  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes",
  },

  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes",
  },

  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours",
  },

  xHours: {
    one: "1 hour",
    other: "{{count}} hours",
  },

  xDays: {
    one: "1 day",
    other: "{{count}} days",
  },

  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks",
  },

  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks",
  },

  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months",
  },

  xMonths: {
    one: "1 month",
    other: "{{count}} months",
  },

  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years",
  },

  xYears: {
    one: "1 year",
    other: "{{count}} years",
  },

  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years",
  },

  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years",
  },
};

const formatDistance$1 = (token, count, options) => {
  let result;

  const tokenValue = formatDistanceLocale$1[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }

  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }

  return result;
};

function buildFormatLongFn(args) {
  return (options = {}) => {
    // TODO: Remove String()
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

const dateFormats$1 = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy",
};

const timeFormats$1 = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a",
};

const dateTimeFormats$1 = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}",
};

const formatLong$1 = {
  date: buildFormatLongFn({
    formats: dateFormats$1,
    defaultWidth: "full",
  }),

  time: buildFormatLongFn({
    formats: timeFormats$1,
    defaultWidth: "full",
  }),

  dateTime: buildFormatLongFn({
    formats: dateTimeFormats$1,
    defaultWidth: "full",
  }),
};

const formatRelativeLocale$1 = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P",
};

const formatRelative$1 = (token, _date, _baseDate, _options) =>
  formatRelativeLocale$1[token];

/* eslint-disable no-unused-vars */

/**
 * The localize function argument callback which allows to convert raw value to
 * the actual type.
 *
 * @param value - The value to convert
 *
 * @returns The converted value
 */

/**
 * The map of localized values for each width.
 */

/**
 * The index type of the locale unit value. It types conversion of units of
 * values that don't start at 0 (i.e. quarters).
 */

/**
 * Converts the unit value to the tuple of values.
 */

/**
 * The tuple of localized era values. The first element represents BC,
 * the second element represents AD.
 */

/**
 * The tuple of localized quarter values. The first element represents Q1.
 */

/**
 * The tuple of localized day values. The first element represents Sunday.
 */

/**
 * The tuple of localized month values. The first element represents January.
 */

function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";

    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;

      valuesArray =
        args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;

      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;

    // @ts-expect-error - For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index];
  };
}

const eraValues$1 = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"],
};

const quarterValues$1 = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
};

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
const monthValues$1 = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

const dayValues$1 = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

const dayPeriodValues$1 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
};

const formattingDayPeriodValues$1 = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
};

const ordinalNumber$1 = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`.
  //
  // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'.

  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};

const localize$1 = {
  ordinalNumber: ordinalNumber$1,

  era: buildLocalizeFn({
    values: eraValues$1,
    defaultWidth: "wide",
  }),

  quarter: buildLocalizeFn({
    values: quarterValues$1,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1,
  }),

  month: buildLocalizeFn({
    values: monthValues$1,
    defaultWidth: "wide",
  }),

  day: buildLocalizeFn({
    values: dayValues$1,
    defaultWidth: "wide",
  }),

  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues$1,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues$1,
    defaultFormattingWidth: "wide",
  }),
};

function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;

    const matchPattern =
      (width && args.matchPatterns[width]) ||
      args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);

    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];

    const parsePatterns =
      (width && args.parsePatterns[width]) ||
      args.parsePatterns[args.defaultParseWidth];

    const key = Array.isArray(parsePatterns)
      ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString))
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
        findKey(parsePatterns, (pattern) => pattern.test(matchedString));

    let value;

    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
        options.valueCallback(value)
      : value;

    const rest = string.slice(matchedString.length);

    return { value, rest };
  };
}

function findKey(object, predicate) {
  for (const key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      predicate(object[key])
    ) {
      return key;
    }
  }
  return undefined;
}

function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return undefined;
}

function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];

    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback
      ? args.valueCallback(parseResult[0])
      : parseResult[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
    value = options.valueCallback ? options.valueCallback(value) : value;

    const rest = string.slice(matchedString.length);

    return { value, rest };
  };
}

const matchOrdinalNumberPattern$1 = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern$1 = /\d+/i;

const matchEraPatterns$1 = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i,
};
const parseEraPatterns$1 = {
  any: [/^b/i, /^(a|c)/i],
};

const matchQuarterPatterns$1 = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i,
};
const parseQuarterPatterns$1 = {
  any: [/1/i, /2/i, /3/i, /4/i],
};

const matchMonthPatterns$1 = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
};
const parseMonthPatterns$1 = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i,
  ],

  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i,
  ],
};

const matchDayPatterns$1 = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
};
const parseDayPatterns$1 = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
};

const matchDayPeriodPatterns$1 = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
};
const parseDayPeriodPatterns$1 = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i,
  },
};

const match$1 = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern$1,
    parsePattern: parseOrdinalNumberPattern$1,
    valueCallback: (value) => parseInt(value, 10),
  }),

  era: buildMatchFn({
    matchPatterns: matchEraPatterns$1,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns$1,
    defaultParseWidth: "any",
  }),

  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns$1,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns$1,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1,
  }),

  month: buildMatchFn({
    matchPatterns: matchMonthPatterns$1,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns$1,
    defaultParseWidth: "any",
  }),

  day: buildMatchFn({
    matchPatterns: matchDayPatterns$1,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns$1,
    defaultParseWidth: "any",
  }),

  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns$1,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns$1,
    defaultParseWidth: "any",
  }),
};

/**
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp](https://github.com/kossnocorp)
 * @author Lesha Koss [@leshakoss](https://github.com/leshakoss)
 */
const enUS = {
  code: "en-US",
  formatDistance: formatDistance$1,
  formatLong: formatLong$1,
  formatRelative: formatRelative$1,
  localize: localize$1,
  match: match$1,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1,
  },
};

/**
 * @name getDayOfYear
 * @category Day Helpers
 * @summary Get the day of the year of the given date.
 *
 * @description
 * Get the day of the year of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The day of year
 *
 * @example
 * // Which day of the year is 2 July 2014?
 * const result = getDayOfYear(new Date(2014, 6, 2))
 * //=> 183
 */
function getDayOfYear(date) {
  const _date = toDate(date);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}

/**
 * @name getISOWeek
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The ISO week
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * const result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */
function getISOWeek(date) {
  const _date = toDate(date);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(diff / millisecondsInWeek) + 1;
}

/**
 * The {@link getWeekYear} function options.
 */

/**
 * @name getWeekYear
 * @category Week-Numbering Year Helpers
 * @summary Get the local week-numbering year of the given date.
 *
 * @description
 * Get the local week-numbering year of the given date.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 * @param options - An object with options.
 *
 * @returns The local week-numbering year
 *
 * @example
 * // Which week numbering year is 26 December 2004 with the default settings?
 * const result = getWeekYear(new Date(2004, 11, 26))
 * //=> 2005
 *
 * @example
 * // Which week numbering year is 26 December 2004 if week starts on Saturday?
 * const result = getWeekYear(new Date(2004, 11, 26), { weekStartsOn: 6 })
 * //=> 2004
 *
 * @example
 * // Which week numbering year is 26 December 2004 if the first week contains 4 January?
 * const result = getWeekYear(new Date(2004, 11, 26), { firstWeekContainsDate: 4 })
 * //=> 2004
 */
function getWeekYear(date, options) {
  const _date = toDate(date);
  const year = _date.getFullYear();

  const defaultOptions = getDefaultOptions();
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const firstWeekOfNextYear = constructFrom(date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);

  const firstWeekOfThisYear = constructFrom(date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);

  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

/**
 * The {@link startOfWeekYear} function options.
 */

/**
 * @name startOfWeekYear
 * @category Week-Numbering Year Helpers
 * @summary Return the start of a local week-numbering year for the given date.
 *
 * @description
 * Return the start of a local week-numbering year.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of a week-numbering year
 *
 * @example
 * // The start of an a week-numbering year for 2 July 2005 with default settings:
 * const result = startOfWeekYear(new Date(2005, 6, 2))
 * //=> Sun Dec 26 2004 00:00:00
 *
 * @example
 * // The start of a week-numbering year for 2 July 2005
 * // if Monday is the first day of week
 * // and 4 January is always in the first week of the year:
 * const result = startOfWeekYear(new Date(2005, 6, 2), {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfWeekYear(date, options) {
  const defaultOptions = getDefaultOptions();
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}

/**
 * The {@link getWeek} function options.
 */

/**
 * @name getWeek
 * @category Week Helpers
 * @summary Get the local week index of the given date.
 *
 * @description
 * Get the local week index of the given date.
 * The exact calculation depends on the values of
 * `options.weekStartsOn` (which is the index of the first day of the week)
 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
 * the first week of the week-numbering year)
 *
 * Week numbering: https://en.wikipedia.org/wiki/Week#The_ISO_week_date_system
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 * @param options - An object with options
 *
 * @returns The week
 *
 * @example
 * // Which week of the local week numbering year is 2 January 2005 with default options?
 * const result = getWeek(new Date(2005, 0, 2))
 * //=> 2
 *
 * @example
 * // Which week of the local week numbering year is 2 January 2005,
 * // if Monday is the first day of the week,
 * // and the first week of the year always contains 4 January?
 * const result = getWeek(new Date(2005, 0, 2), {
 *   weekStartsOn: 1,
 *   firstWeekContainsDate: 4
 * })
 * //=> 53
 */

function getWeek(date, options) {
  const _date = toDate(date);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(diff / millisecondsInWeek) + 1;
}

function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* |                                |
 * |  d  | Day of month                   |  D  |                                |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  m  | Minute                         |  M  | Month                          |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  y  | Year (abs)                     |  Y  |                                |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 */

const lightFormatters = {
  // Year
  y(date, token) {
    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
    // |----------|-------|----|-------|-------|-------|
    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

    const signedYear = date.getFullYear();
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    const year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },

  // Month
  M(date, token) {
    const month = date.getMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },

  // Day of the month
  d(date, token) {
    return addLeadingZeros(date.getDate(), token.length);
  },

  // AM or PM
  a(date, token) {
    const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";

    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },

  // Hour [1-12]
  h(date, token) {
    return addLeadingZeros(date.getHours() % 12 || 12, token.length);
  },

  // Hour [0-23]
  H(date, token) {
    return addLeadingZeros(date.getHours(), token.length);
  },

  // Minute
  m(date, token) {
    return addLeadingZeros(date.getMinutes(), token.length);
  },

  // Second
  s(date, token) {
    return addLeadingZeros(date.getSeconds(), token.length);
  },

  // Fraction of second
  S(date, token) {
    const numberOfDigits = token.length;
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = Math.trunc(
      milliseconds * Math.pow(10, numberOfDigits - 3),
    );
    return addLeadingZeros(fractionalSeconds, token.length);
  },
};

const dayPeriodEnum = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night",
};

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |  D  | Day of year                    |
 * |  e  | Local day of week              |  E  | Day of week                    |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  | Stand-alone month              |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
 * |  p! | Long localized time            |  P! | Long localized date            |
 * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  | Local week of year             |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
 * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
 * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
 *   i.e. 7 for Sunday, 1 for Monday, etc.
 * - `I` is ISO week of year, as opposed to `w` which is local week of year.
 * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
 *   `R` is supposed to be used in conjunction with `I` and `i`
 *   for universal ISO week-numbering date, whereas
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 * - `P` is long localized date format
 * - `p` is long localized time format
 */

const formatters = {
  // Era
  G: function (date, token, localize) {
    const era = date.getFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize.era(era, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return localize.era(era, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize.era(era, { width: "wide" });
    }
  },

  // Year
  y: function (date, token, localize) {
    // Ordinal number
    if (token === "yo") {
      const signedYear = date.getFullYear();
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize.ordinalNumber(year, { unit: "year" });
    }

    return lightFormatters.y(date, token);
  },

  // Local week-numbering year
  Y: function (date, token, localize, options) {
    const signedWeekYear = getWeekYear(date, options);
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

    // Two digit year
    if (token === "YY") {
      const twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }

    // Ordinal number
    if (token === "Yo") {
      return localize.ordinalNumber(weekYear, { unit: "year" });
    }

    // Padding
    return addLeadingZeros(weekYear, token.length);
  },

  // ISO week-numbering year
  R: function (date, token) {
    const isoWeekYear = getISOWeekYear(date);

    // Padding
    return addLeadingZeros(isoWeekYear, token.length);
  },

  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function (date, token) {
    const year = date.getFullYear();
    return addLeadingZeros(year, token.length);
  },

  // Quarter
  Q: function (date, token, localize) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize.quarter(quarter, {
          width: "abbreviated",
          context: "formatting",
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize.quarter(quarter, {
          width: "narrow",
          context: "formatting",
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize.quarter(quarter, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Stand-alone quarter
  q: function (date, token, localize) {
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize.ordinalNumber(quarter, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize.quarter(quarter, {
          width: "abbreviated",
          context: "standalone",
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize.quarter(quarter, {
          width: "narrow",
          context: "standalone",
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize.quarter(quarter, {
          width: "wide",
          context: "standalone",
        });
    }
  },

  // Month
  M: function (date, token, localize) {
    const month = date.getMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize.month(month, {
          width: "abbreviated",
          context: "formatting",
        });
      // J, F, ..., D
      case "MMMMM":
        return localize.month(month, {
          width: "narrow",
          context: "formatting",
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize.month(month, { width: "wide", context: "formatting" });
    }
  },

  // Stand-alone month
  L: function (date, token, localize) {
    const month = date.getMonth();
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize.ordinalNumber(month + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize.month(month, {
          width: "abbreviated",
          context: "standalone",
        });
      // J, F, ..., D
      case "LLLLL":
        return localize.month(month, {
          width: "narrow",
          context: "standalone",
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize.month(month, { width: "wide", context: "standalone" });
    }
  },

  // Local week of year
  w: function (date, token, localize, options) {
    const week = getWeek(date, options);

    if (token === "wo") {
      return localize.ordinalNumber(week, { unit: "week" });
    }

    return addLeadingZeros(week, token.length);
  },

  // ISO week of year
  I: function (date, token, localize) {
    const isoWeek = getISOWeek(date);

    if (token === "Io") {
      return localize.ordinalNumber(isoWeek, { unit: "week" });
    }

    return addLeadingZeros(isoWeek, token.length);
  },

  // Day of the month
  d: function (date, token, localize) {
    if (token === "do") {
      return localize.ordinalNumber(date.getDate(), { unit: "date" });
    }

    return lightFormatters.d(date, token);
  },

  // Day of year
  D: function (date, token, localize) {
    const dayOfYear = getDayOfYear(date);

    if (token === "Do") {
      return localize.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
    }

    return addLeadingZeros(dayOfYear, token.length);
  },

  // Day of week
  E: function (date, token, localize) {
    const dayOfWeek = date.getDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "EEEEE":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "EEEEEE":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "EEEE":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Local day of week
  e: function (date, token, localize, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "eee":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "eeeee":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "eeeeee":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "eeee":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Stand-alone local day of week
  c: function (date, token, localize, options) {
    const dayOfWeek = date.getDay();
    const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize.ordinalNumber(localDayOfWeek, { unit: "day" });
      case "ccc":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone",
        });
      // T
      case "ccccc":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "standalone",
        });
      // Tu
      case "cccccc":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "standalone",
        });
      // Tuesday
      case "cccc":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "standalone",
        });
    }
  },

  // ISO day of week
  i: function (date, token, localize) {
    const dayOfWeek = date.getDay();
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize.ordinalNumber(isoDayOfWeek, { unit: "day" });
      // Tue
      case "iii":
        return localize.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting",
        });
      // T
      case "iiiii":
        return localize.day(dayOfWeek, {
          width: "narrow",
          context: "formatting",
        });
      // Tu
      case "iiiiii":
        return localize.day(dayOfWeek, {
          width: "short",
          context: "formatting",
        });
      // Tuesday
      case "iiii":
      default:
        return localize.day(dayOfWeek, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // AM or PM
  a: function (date, token, localize) {
    const hours = date.getHours();
    const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";

    switch (token) {
      case "a":
      case "aa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "aaa":
        return localize
          .dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting",
          })
          .toLowerCase();
      case "aaaaa":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "aaaa":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // AM, PM, midnight, noon
  b: function (date, token, localize) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }

    switch (token) {
      case "b":
      case "bb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "bbb":
        return localize
          .dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting",
          })
          .toLowerCase();
      case "bbbbb":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "bbbb":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // in the morning, in the afternoon, in the evening, at night
  B: function (date, token, localize) {
    const hours = date.getHours();
    let dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }

    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting",
        });
      case "BBBBB":
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting",
        });
      case "BBBB":
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting",
        });
    }
  },

  // Hour [1-12]
  h: function (date, token, localize) {
    if (token === "ho") {
      let hours = date.getHours() % 12;
      if (hours === 0) hours = 12;
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return lightFormatters.h(date, token);
  },

  // Hour [0-23]
  H: function (date, token, localize) {
    if (token === "Ho") {
      return localize.ordinalNumber(date.getHours(), { unit: "hour" });
    }

    return lightFormatters.H(date, token);
  },

  // Hour [0-11]
  K: function (date, token, localize) {
    const hours = date.getHours() % 12;

    if (token === "Ko") {
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return addLeadingZeros(hours, token.length);
  },

  // Hour [1-24]
  k: function (date, token, localize) {
    let hours = date.getHours();
    if (hours === 0) hours = 24;

    if (token === "ko") {
      return localize.ordinalNumber(hours, { unit: "hour" });
    }

    return addLeadingZeros(hours, token.length);
  },

  // Minute
  m: function (date, token, localize) {
    if (token === "mo") {
      return localize.ordinalNumber(date.getMinutes(), { unit: "minute" });
    }

    return lightFormatters.m(date, token);
  },

  // Second
  s: function (date, token, localize) {
    if (token === "so") {
      return localize.ordinalNumber(date.getSeconds(), { unit: "second" });
    }

    return lightFormatters.s(date, token);
  },

  // Fraction of second
  S: function (date, token) {
    return lightFormatters.S(date, token);
  },

  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    if (timezoneOffset === 0) {
      return "Z";
    }

    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX": // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX": // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx": // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx": // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (GMT)
  O: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },

  // Timezone (specific non-location)
  z: function (date, token, _localize) {
    const timezoneOffset = date.getTimezoneOffset();

    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },

  // Seconds timestamp
  t: function (date, token, _localize) {
    const timestamp = Math.trunc(date.getTime() / 1000);
    return addLeadingZeros(timestamp, token.length);
  },

  // Milliseconds timestamp
  T: function (date, token, _localize) {
    const timestamp = date.getTime();
    return addLeadingZeros(timestamp, token.length);
  },
};

function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}

function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}

function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

const dateLongFormatter = (pattern, formatLong) => {
  switch (pattern) {
    case "P":
      return formatLong.date({ width: "short" });
    case "PP":
      return formatLong.date({ width: "medium" });
    case "PPP":
      return formatLong.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong.date({ width: "full" });
  }
};

const timeLongFormatter = (pattern, formatLong) => {
  switch (pattern) {
    case "p":
      return formatLong.time({ width: "short" });
    case "pp":
      return formatLong.time({ width: "medium" });
    case "ppp":
      return formatLong.time({ width: "long" });
    case "pppp":
    default:
      return formatLong.time({ width: "full" });
  }
};

const dateTimeLongFormatter = (pattern, formatLong) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];

  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong);
  }

  let dateTimeFormat;

  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong.dateTime({ width: "full" });
      break;
  }

  return dateTimeFormat
    .replace("{{date}}", dateLongFormatter(datePattern, formatLong))
    .replace("{{time}}", timeLongFormatter(timePattern, formatLong));
};

const longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter,
};

const dayOfYearTokenRE = /^D+$/;
const weekYearTokenRE = /^Y+$/;

const throwTokens = ["D", "DD", "YY", "YYYY"];

function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}

function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}

function warnOrThrowProtectedError(token, format, input) {
  const _message = message(token, format, input);
  console.warn(_message);
  if (throwTokens.includes(token)) throw new RangeError(_message);
}

function message(token, format, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}

// This RegExp consists of three parts separated by `|`:
// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
const formattingTokensRegExp =
  /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

const escapedStringRegExp = /^'([^]*?)'?$/;
const doubleQuoteRegExp = /''/g;
const unescapedLatinCharacterRegExp = /[a-zA-Z]/;

/**
 * The {@link format} function options.
 */

/**
 * @name format
 * @alias formatDate
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. The result may vary by locale.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * The characters wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 * (see the last example)
 *
 * Format of the string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 7 below the table).
 *
 * Accepted patterns:
 * | Unit                            | Pattern | Result examples                   | Notes |
 * |---------------------------------|---------|-----------------------------------|-------|
 * | Era                             | G..GGG  | AD, BC                            |       |
 * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 | GGGGG   | A, B                              |       |
 * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
 * |                                 | yy      | 44, 01, 00, 17                    | 5     |
 * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
 * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
 * |                                 | yyyyy   | ...                               | 3,5   |
 * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
 * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
 * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
 * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
 * |                                 | YYYYY   | ...                               | 3,5   |
 * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
 * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
 * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
 * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
 * |                                 | RRRRR   | ...                               | 3,5,7 |
 * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
 * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
 * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
 * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
 * |                                 | uuuuu   | ...                               | 3,5   |
 * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
 * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | QQ      | 01, 02, 03, 04                    |       |
 * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
 * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | qq      | 01, 02, 03, 04                    |       |
 * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
 * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
 * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | MM      | 01, 02, ..., 12                   |       |
 * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 | MMMM    | January, February, ..., December  | 2     |
 * |                                 | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
 * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | LL      | 01, 02, ..., 12                   |       |
 * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 | LLLL    | January, February, ..., December  | 2     |
 * |                                 | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | w       | 1, 2, ..., 53                     |       |
 * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
 * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | II      | 01, 02, ..., 53                   | 7     |
 * | Day of month                    | d       | 1, 2, ..., 31                     |       |
 * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
 * |                                 | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
 * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
 * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
 * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 | DDDD    | ...                               | 3     |
 * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
 * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
 * |                                 | ii      | 01, 02, ..., 07                   | 7     |
 * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
 * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
 * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
 * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
 * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | ee      | 02, 03, ..., 01                   |       |
 * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | cc      | 02, 03, ..., 01                   |       |
 * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | AM, PM                          | a..aa   | AM, PM                            |       |
 * |                                 | aaa     | am, pm                            |       |
 * |                                 | aaaa    | a.m., p.m.                        | 2     |
 * |                                 | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
 * |                                 | bbb     | am, pm, noon, midnight            |       |
 * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
 * |                                 | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
 * |                                 | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
 * |                                 | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
 * |                                 | KK      | 01, 02, ..., 11, 00               |       |
 * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
 * |                                 | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          | m       | 0, 1, ..., 59                     |       |
 * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | mm      | 00, 01, ..., 59                   |       |
 * | Second                          | s       | 0, 1, ..., 59                     |       |
 * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | ss      | 00, 01, ..., 59                   |       |
 * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
 * |                                 | SS      | 00, 01, ..., 99                   |       |
 * |                                 | SSS     | 000, 001, ..., 999                |       |
 * |                                 | SSSS    | ...                               | 3     |
 * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
 * |                                 | XX      | -0800, +0530, Z                   |       |
 * |                                 | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
 * |                                 | xx      | -0800, +0530, +0000               |       |
 * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
 * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
 * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
 * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
 * | Seconds timestamp               | t       | 512969520                         | 7     |
 * |                                 | tt      | ...                               | 3,7   |
 * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
 * |                                 | TT      | ...                               | 3,7   |
 * | Long localized date             | P       | 04/29/1453                        | 7     |
 * |                                 | PP      | Apr 29, 1453                      | 7     |
 * |                                 | PPP     | April 29th, 1453                  | 7     |
 * |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
 * | Long localized time             | p       | 12:00 AM                          | 7     |
 * |                                 | pp      | 12:00:00 AM                       | 7     |
 * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
 * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
 * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
 * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
 * |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
 * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
 *    the output will be the same as default pattern for this unit, usually
 *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
 *    are marked with "2" in the last column of the table.
 *
 *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
 *
 * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
 *    The output will be padded with zeros to match the length of the pattern.
 *
 *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
 *
 * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 5. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` always returns the last two digits of a year,
 *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
 *
 *    | Year | `yy` | `uu` |
 *    |------|------|------|
 *    | 1    |   01 |   01 |
 *    | 14   |   14 |   14 |
 *    | 376  |   76 |  376 |
 *    | 1453 |   53 | 1453 |
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [getISOWeekYear](https://date-fns.org/docs/getISOWeekYear)
 *    and [getWeekYear](https://date-fns.org/docs/getWeekYear)).
 *
 * 6. Specific non-location timezones are currently unavailable in `date-fns`,
 *    so right now these tokens fall back to GMT timezones.
 *
 * 7. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `t`: seconds timestamp
 *    - `T`: milliseconds timestamp
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 9. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param format - The string of tokens
 * @param options - An object with options
 *
 * @returns The formatted date string
 *
 * @throws `date` must not be Invalid Date
 * @throws `options.locale` must contain `localize` property
 * @throws `options.locale` must contain `formatLong` property
 * @throws use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws format string contains an unescaped latin alphabet character
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * const result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
 *   locale: eoLocale
 * })
 * //=> '2-a de julio 2014'
 *
 * @example
 * // Escape string by single quote characters:
 * const result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
 * //=> "3 o'clock"
 */
function format(date, formatStr, options) {
  const defaultOptions = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions.locale ?? enUS;

  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    defaultOptions.firstWeekContainsDate ??
    defaultOptions.locale?.options?.firstWeekContainsDate ??
    1;

  const weekStartsOn =
    options?.weekStartsOn ??
    options?.locale?.options?.weekStartsOn ??
    defaultOptions.weekStartsOn ??
    defaultOptions.locale?.options?.weekStartsOn ??
    0;

  const originalDate = toDate(date);

  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }

  let parts = formatStr
    .match(longFormattingTokensRegExp)
    .map((substring) => {
      const firstCharacter = substring[0];
      if (firstCharacter === "p" || firstCharacter === "P") {
        const longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    })
    .join("")
    .match(formattingTokensRegExp)
    .map((substring) => {
      // Replace two single quote characters with one single quote character
      if (substring === "''") {
        return { isToken: false, value: "'" };
      }

      const firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return { isToken: false, value: cleanEscapedString(substring) };
      }

      if (formatters[firstCharacter]) {
        return { isToken: true, value: substring };
      }

      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" +
            firstCharacter +
            "`",
        );
      }

      return { isToken: false, value: substring };
    });

  // invoke localize preprocessor (only for french locales at the moment)
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }

  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale,
  };

  return parts
    .map((part) => {
      if (!part.isToken) return part.value;

      const token = part.value;

      if (
        (!options?.useAdditionalWeekYearTokens &&
          isProtectedWeekYearToken(token)) ||
        (!options?.useAdditionalDayOfYearTokens &&
          isProtectedDayOfYearToken(token))
      ) {
        warnOrThrowProtectedError(token, formatStr, String(date));
      }

      const formatter = formatters[token[0]];
      return formatter(originalDate, token, locale.localize, formatterOptions);
    })
    .join("");
}

function cleanEscapedString(input) {
  const matched = input.match(escapedStringRegExp);

  if (!matched) {
    return input;
  }

  return matched[1].replace(doubleQuoteRegExp, "'");
}

/**
 * The {@link parseISO} function options.
 */

/**
 * @name parseISO
 * @category Common Helpers
 * @summary Parse ISO string
 *
 * @description
 * Parse the given string in ISO 8601 format and return an instance of Date.
 *
 * Function accepts complete ISO 8601 formats as well as partial implementations.
 * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
 *
 * If the argument isn't a string, the function cannot parse the string or
 * the values are invalid, it returns Invalid Date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param argument - The value to convert
 * @param options - An object with options
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Convert string '2014-02-11T11:30:30' to date:
 * const result = parseISO('2014-02-11T11:30:30')
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert string '+02014101' to date,
 * // if the additional number of digits in the extended year format is 1:
 * const result = parseISO('+02014101', { additionalDigits: 1 })
 * //=> Fri Apr 11 2014 00:00:00
 */
function parseISO(argument, options) {
  const additionalDigits = 2;
  const dateStrings = splitDateString(argument);

  let date;
  if (dateStrings.date) {
    const parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }

  if (!date || isNaN(date.getTime())) {
    return new Date(NaN);
  }

  const timestamp = date.getTime();
  let time = 0;
  let offset;

  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return new Date(NaN);
    }
  }

  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) {
      return new Date(NaN);
    }
  } else {
    const dirtyDate = new Date(timestamp + time);
    // JS parsed string assuming it's in UTC timezone
    // but we need it to be parsed in our timezone
    // so we use utc values to build date in our timezone.
    // Year values from 0 to 99 map to the years 1900 to 1999
    // so set year explicitly with setFullYear.
    const result = new Date(0);
    result.setFullYear(
      dirtyDate.getUTCFullYear(),
      dirtyDate.getUTCMonth(),
      dirtyDate.getUTCDate(),
    );
    result.setHours(
      dirtyDate.getUTCHours(),
      dirtyDate.getUTCMinutes(),
      dirtyDate.getUTCSeconds(),
      dirtyDate.getUTCMilliseconds(),
    );
    return result;
  }

  return new Date(timestamp + time + offset);
}

const patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/,
};

const dateRegex =
  /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
const timeRegex =
  /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
const timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;

function splitDateString(dateString) {
  const dateStrings = {};
  const array = dateString.split(patterns.dateTimeDelimiter);
  let timeString;

  // The regex match should only return at maximum two array elements.
  // [date], [time], or [date, time].
  if (array.length > 2) {
    return dateStrings;
  }

  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(
        dateStrings.date.length,
        dateString.length,
      );
    }
  }

  if (timeString) {
    const token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }

  return dateStrings;
}

function parseYear(dateString, additionalDigits) {
  const regex = new RegExp(
    "^(?:(\\d{4}|[+-]\\d{" +
      (4 + additionalDigits) +
      "})|(\\d{2}|[+-]\\d{" +
      (2 + additionalDigits) +
      "})$)",
  );

  const captures = dateString.match(regex);
  // Invalid ISO-formatted year
  if (!captures) return { year: NaN, restDateString: "" };

  const year = captures[1] ? parseInt(captures[1]) : null;
  const century = captures[2] ? parseInt(captures[2]) : null;

  // either year or century is null, not both
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length),
  };
}

function parseDate(dateString, year) {
  // Invalid ISO-formatted year
  if (year === null) return new Date(NaN);

  const captures = dateString.match(dateRegex);
  // Invalid ISO-formatted string
  if (!captures) return new Date(NaN);

  const isWeekDate = !!captures[4];
  const dayOfYear = parseDateUnit(captures[1]);
  const month = parseDateUnit(captures[2]) - 1;
  const day = parseDateUnit(captures[3]);
  const week = parseDateUnit(captures[4]);
  const dayOfWeek = parseDateUnit(captures[5]) - 1;

  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    const date = new Date(0);
    if (
      !validateDate(year, month, day) ||
      !validateDayOfYearDate(year, dayOfYear)
    ) {
      return new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}

function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}

function parseTime(timeString) {
  const captures = timeString.match(timeRegex);
  if (!captures) return NaN; // Invalid ISO-formatted time

  const hours = parseTimeUnit(captures[1]);
  const minutes = parseTimeUnit(captures[2]);
  const seconds = parseTimeUnit(captures[3]);

  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }

  return (
    hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1000
  );
}

function parseTimeUnit(value) {
  return (value && parseFloat(value.replace(",", "."))) || 0;
}

function parseTimezone(timezoneString) {
  if (timezoneString === "Z") return 0;

  const captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;

  const sign = captures[1] === "+" ? -1 : 1;
  const hours = parseInt(captures[2]);
  const minutes = (captures[3] && parseInt(captures[3])) || 0;

  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }

  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}

function dayOfISOWeekYear(isoWeekYear, week, day) {
  const date = new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  const fourthOfJanuaryDay = date.getUTCDay() || 7;
  const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// Validation functions

// February is null to handle the leap year (using ||)
const daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYearIndex(year) {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function validateDate(year, month, date) {
  return (
    month >= 0 &&
    month <= 11 &&
    date >= 1 &&
    date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28))
  );
}

function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}

function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}

function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }

  return (
    seconds >= 0 &&
    seconds < 60 &&
    minutes >= 0 &&
    minutes < 60 &&
    hours >= 0 &&
    hours < 25
  );
}

function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}

const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "أقل من ثانية واحدة",
    two: "أقل من ثانتين",
    threeToTen: "أقل من {{count}} ثواني",
    other: "أقل من {{count}} ثانية",
  },

  xSeconds: {
    one: "ثانية واحدة",
    two: "ثانتين",
    threeToTen: "{{count}} ثواني",
    other: "{{count}} ثانية",
  },

  halfAMinute: "نصف دقيقة",

  lessThanXMinutes: {
    one: "أقل من دقيقة",
    two: "أقل من دقيقتين",
    threeToTen: "أقل من {{count}} دقائق",
    other: "أقل من {{count}} دقيقة",
  },

  xMinutes: {
    one: "دقيقة واحدة",
    two: "دقيقتين",
    threeToTen: "{{count}} دقائق",
    other: "{{count}} دقيقة",
  },

  aboutXHours: {
    one: "ساعة واحدة تقريباً",
    two: "ساعتين تقريباً",
    threeToTen: "{{count}} ساعات تقريباً",
    other: "{{count}} ساعة تقريباً",
  },

  xHours: {
    one: "ساعة واحدة",
    two: "ساعتين",
    threeToTen: "{{count}} ساعات",
    other: "{{count}} ساعة",
  },

  xDays: {
    one: "يوم واحد",
    two: "يومين",
    threeToTen: "{{count}} أيام",
    other: "{{count}} يوم",
  },

  aboutXWeeks: {
    one: "أسبوع واحد تقريباً",
    two: "أسبوعين تقريباً",
    threeToTen: "{{count}} أسابيع تقريباً",
    other: "{{count}} أسبوع تقريباً",
  },

  xWeeks: {
    one: "أسبوع واحد",
    two: "أسبوعين",
    threeToTen: "{{count}} أسابيع",
    other: "{{count}} أسبوع",
  },

  aboutXMonths: {
    one: "شهر واحد تقريباً",
    two: "شهرين تقريباً",
    threeToTen: "{{count}} أشهر تقريباً",
    other: "{{count}} شهر تقريباً",
  },

  xMonths: {
    one: "شهر واحد",
    two: "شهرين",
    threeToTen: "{{count}} أشهر",
    other: "{{count}} شهر",
  },

  aboutXYears: {
    one: "عام واحد تقريباً",
    two: "عامين تقريباً",
    threeToTen: "{{count}} أعوام تقريباً",
    other: "{{count}} عام تقريباً",
  },

  xYears: {
    one: "عام واحد",
    two: "عامين",
    threeToTen: "{{count}} أعوام",
    other: "{{count}} عام",
  },

  overXYears: {
    one: "أكثر من عام",
    two: "أكثر من عامين",
    threeToTen: "أكثر من {{count}} أعوام",
    other: "أكثر من {{count}} عام",
  },

  almostXYears: {
    one: "عام واحد تقريباً",
    two: "عامين تقريباً",
    threeToTen: "{{count}} أعوام تقريباً",
    other: "{{count}} عام تقريباً",
  },
};

const formatDistance = (token, count, options) => {
  let result;

  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else if (count === 2) {
    result = tokenValue.two;
  } else if (count <= 10) {
    result = tokenValue.threeToTen.replace("{{count}}", String(count));
  } else {
    result = tokenValue.other.replace("{{count}}", String(count));
  }

  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "في خلال " + result;
    } else {
      return "منذ " + result;
    }
  }

  return result;
};

const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy",
};

const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a",
};

const dateTimeFormats = {
  full: "{{date}} 'عند' {{time}}",
  long: "{{date}} 'عند' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}",
};

const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full",
  }),

  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full",
  }),

  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full",
  }),
};

const formatRelativeLocale = {
  lastWeek: "'أخر' eeee 'عند' p",
  yesterday: "'أمس عند' p",
  today: "'اليوم عند' p",
  tomorrow: "'غداً عند' p",
  nextWeek: "eeee 'عند' p",
  other: "P",
};

const formatRelative = (token, _date, _baseDate, _options) =>
  formatRelativeLocale[token];

const eraValues = {
  narrow: ["ق", "ب"],
  abbreviated: ["ق.م.", "ب.م."],
  wide: ["قبل الميلاد", "بعد الميلاد"],
};

const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["ر1", "ر2", "ر3", "ر4"],
  wide: ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"],
};

const monthValues = {
  narrow: ["ي", "ف", "م", "أ", "م", "ي", "ي", "أ", "س", "أ", "ن", "د"],
  abbreviated: [
    "ينا",
    "فبر",
    "مارس",
    "أبريل",
    "مايو",
    "يونـ",
    "يولـ",
    "أغسـ",
    "سبتـ",
    "أكتـ",
    "نوفـ",
    "ديسـ",
  ],

  wide: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
};

const dayValues = {
  narrow: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
  short: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  abbreviated: ["أحد", "اثنـ", "ثلا", "أربـ", "خميـ", "جمعة", "سبت"],
  wide: [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ],
};

const dayPeriodValues = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً",
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً",
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    evening: "مساءاً",
    night: "ليلاً",
  },
};
const formattingDayPeriodValues = {
  narrow: {
    am: "ص",
    pm: "م",
    midnight: "ن",
    noon: "ظ",
    morning: "في الصباح",
    afternoon: "بعد الظـهر",
    evening: "في المساء",
    night: "في الليل",
  },
  abbreviated: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "في الصباح",
    afternoon: "بعد الظهر",
    evening: "في المساء",
    night: "في الليل",
  },
  wide: {
    am: "ص",
    pm: "م",
    midnight: "نصف الليل",
    noon: "ظهر",
    morning: "صباحاً",
    afternoon: "بعد الظـهر",
    evening: "في المساء",
    night: "في الليل",
  },
};

const ordinalNumber = (dirtyNumber) => {
  return String(dirtyNumber);
};

const localize = {
  ordinalNumber,

  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide",
  }),

  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1,
  }),

  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide",
  }),

  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide",
  }),

  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide",
  }),
};

const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;

const matchEraPatterns = {
  narrow: /^(ق|ب)/i,
  abbreviated: /^(ق\.?\s?م\.?|ق\.?\s?م\.?\s?|a\.?\s?d\.?|c\.?\s?)/i,
  wide: /^(قبل الميلاد|قبل الميلاد|بعد الميلاد|بعد الميلاد)/i,
};
const parseEraPatterns = {
  any: [/^قبل/i, /^بعد/i],
};

const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^ر[1234]/i,
  wide: /^الربع [1234]/i,
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i],
};

const matchMonthPatterns = {
  narrow: /^[يفمأمسند]/i,
  abbreviated: /^(ين|ف|مار|أب|ماي|يون|يول|أغ|س|أك|ن|د)/i,
  wide: /^(ين|ف|مار|أب|ماي|يون|يول|أغ|س|أك|ن|د)/i,
};
const parseMonthPatterns = {
  narrow: [
    /^ي/i,
    /^ف/i,
    /^م/i,
    /^أ/i,
    /^م/i,
    /^ي/i,
    /^ي/i,
    /^أ/i,
    /^س/i,
    /^أ/i,
    /^ن/i,
    /^د/i,
  ],

  any: [
    /^ين/i,
    /^ف/i,
    /^مار/i,
    /^أب/i,
    /^ماي/i,
    /^يون/i,
    /^يول/i,
    /^أغ/i,
    /^س/i,
    /^أك/i,
    /^ن/i,
    /^د/i,
  ],
};

const matchDayPatterns = {
  narrow: /^[حنثرخجس]/i,
  short: /^(أحد|اثنين|ثلاثاء|أربعاء|خميس|جمعة|سبت)/i,
  abbreviated: /^(أحد|اثن|ثلا|أرب|خمي|جمعة|سبت)/i,
  wide: /^(الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت)/i,
};
const parseDayPatterns = {
  narrow: [/^ح/i, /^ن/i, /^ث/i, /^ر/i, /^خ/i, /^ج/i, /^س/i],
  wide: [
    /^الأحد/i,
    /^الاثنين/i,
    /^الثلاثاء/i,
    /^الأربعاء/i,
    /^الخميس/i,
    /^الجمعة/i,
    /^السبت/i,
  ],

  any: [/^أح/i, /^اث/i, /^ث/i, /^أر/i, /^خ/i, /^ج/i, /^س/i],
};

const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i,
  },
};

const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10),
  }),

  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any",
  }),

  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1,
  }),

  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any",
  }),

  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any",
  }),

  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any",
  }),
};

/**
 * @category Locales
 * @summary Arabic locale (Sauid Arabic).
 * @language Arabic
 * @iso-639-2 ara
 * @author Dhaifallah Alwadani [@dalwadani](https://github.com/dalwadani)
 */
const arSA = {
  code: "ar-SA",
  formatDistance: formatDistance,
  formatLong: formatLong,
  formatRelative: formatRelative,
  localize: localize,
  match: match,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1,
  },
};

function formatDate(date, pattern = "yyyy-MM-dd") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: arSA });
}
function formatNumber(num, decimals = 0) {
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("ar-EG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}
function formatCurrency(amount, currency = "EGP") {
  if (isNaN(amount)) return "0 ج.م";
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

const {useState: useState$4} = await importShared('react');

const {useQuery: useQuery$2} = await importShared('@tanstack/react-query');
function MySalesPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState$4({
    dateFrom: "2026-11-01",
    dateTo: "2026-11-10"
  });
  const { data: sales = [], isLoading, refetch } = useQuery$2({
    queryKey: ["mySales", user?.id, filters],
    queryFn: async () => {
      const res = await api.getMySales({
        agentId: user?.id,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo
      });
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1e3,
    enabled: !!user?.id
  });
  const totalLines = sales.reduce((s, r) => s + (r.totalLines || 0), 0);
  const totalAmount = sales.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const totalADSL = sales.reduce((s, r) => s + (r.totalADSL || 0), 0);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "مبيعاتي" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "متابعة أدائي ومبيعاتي الشخصية" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.875rem", color: "var(--color-neutral-700)" }, children: [
          "من:",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.dateFrom, onChange: (e) => setFilters((f) => ({ ...f, dateFrom: e.target.value })), className: "form-input", style: { width: "auto", minWidth: 160 } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "0.875rem", color: "var(--color-neutral-700)" }, children: [
          "إلى:",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.dateTo, onChange: (e) => setFilters((f) => ({ ...f, dateTo: e.target.value })), className: "form-input", style: { width: "auto", minWidth: 160 } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي الخطوط" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: formatNumber(totalLines) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-secondary-50)", borderColor: "var(--color-secondary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-secondary-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي ADSL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "2rem", fontWeight: 700, color: "var(--color-secondary-900)" }, children: formatNumber(totalADSL) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-success-50)", borderColor: "var(--color-success-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-success-700)", fontWeight: 600, textTransform: "uppercase" }, children: "إجمالي المبلغ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-success-900)" }, children: formatCurrency(totalAmount).replace(" ج.م", "") })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title", children: "تفاصيل المبيعات اليومية" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "التاريخ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الوحدة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الموقع" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "الخطوط" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "ADSL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "المبلغ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "كاش" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "فيزا" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "معفي" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          sales.map((sale) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: sale.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: sale.vanCode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: sale.location }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(sale.totalLines) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(sale.totalADSL) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(sale.totalAmount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(sale.mobileCash) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(sale.mobileVisa) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: formatCurrency(sale.mobileExempt) })
          ] }, sale.id)),
          sales.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "📊" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد مبيعات" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لا توجد بيانات مبيعات لهذا النطاق الزمني" })
          ] }) }) })
        ] })
      ] }) })
    ] })
  ] });
}

const {useState: useState$3} = await importShared('react');

const {useQuery: useQuery$1,useMutation} = await importShared('@tanstack/react-query');
function MyLeavesPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState$3({
    dateFrom: "2026-01-01",
    dateTo: "2026-12-31",
    status: ""
  });
  const [showRequestModal, setShowRequestModal] = useState$3(false);
  const [newLeave, setNewLeave] = useState$3({
    leaveType: "annual",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const { data: leaves = [], isLoading, refetch } = useQuery$1({
    queryKey: ["myLeaves", user?.id, filters],
    queryFn: async () => {
      const res = await api.getLeaves({
        agentId: user?.id,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        status: filters.status || void 0
      });
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1e3,
    enabled: !!user?.id
  });
  const { data: balanceResponse } = useQuery$1({
    queryKey: ["leaveBalance", user?.id],
    queryFn: async () => {
      const res = await api.getLeaveBalances({ vanCode: user?.vanCode || "" });
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1e3,
    enabled: !!user?.id
  });
  const createLeave = useMutation({
    mutationFn: async (leave) => {
      const res = await api.createLeaveRequest({ ...leave, agentId: user?.id });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      setShowRequestModal(false);
      setNewLeave({ leaveType: "annual", startDate: "", endDate: "", reason: "" });
      refetch();
    },
    onError: (error) => {
      alert(error.message);
    }
  });
  const balance = balanceResponse?.[0]?.balances || {};
  const leaveTypeLabels = {
    annual: "سنوية",
    sick: "مرضية",
    casual: "عارضة",
    emergency: "طارئة",
    maternity: "ولادة",
    paternity: "أبوة",
    unpaid: "بدون راتب"
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "إجازاتي" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "طلبات الإجازات والرصيد المتاح" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => setShowRequestModal(true), icon: "➕", children: "طلب إجازة جديدة" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }, children: Object.entries(balance).map(([type, data]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { style: { background: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.75rem", color: "var(--color-primary-700)", fontWeight: 600, textTransform: "uppercase" }, children: leaveTypeLabels[type] || type }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary-900)" }, children: [
        data.remaining,
        " / ",
        data.total
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "0.75rem", color: "var(--color-neutral-500)" }, children: [
        "مستخدم: ",
        data.used
      ] })
    ] }) }, type)) }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "الحالة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Select,
          {
            value: filters.status,
            onChange: (e) => setFilters((f) => ({ ...f, status: e.target.value })),
            options: [
              { value: "", label: "الكل" },
              { value: "pending", label: "قيد الانتظار" },
              { value: "approved", label: "مقبولة" },
              { value: "rejected", label: "مرفوضة" },
              { value: "cancelled", label: "ملغية" }
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "النوع" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "من" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "إلى" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الأيام" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الحالة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "السبب" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "تاريخ الطلب" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        leaves.map((leave) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: leaveTypeLabels[leave.leaveType] || leave.leaveType }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatDate(leave.startDate) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatDate(leave.endDate) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: formatNumber(leave.daysCount) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: leave.status === "approved" ? "success" : leave.status === "rejected" ? "error" : leave.status === "cancelled" ? "neutral" : "warning", children: leave.status === "approved" ? "مقبولة" : leave.status === "rejected" ? "مرفوضة" : leave.status === "cancelled" ? "ملغية" : "قيد الانتظار" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: leave.reason }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatDate(leave.requestedAt) })
        ] }, leave.id)),
        leaves.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "🏖️" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا توجد طلبات إجازة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لم تقم بطلب أي إجازات بعد" })
        ] }) }) })
      ] })
    ] }) }) }),
    showRequestModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1e3
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { style: { maxWidth: 500, width: "90%", margin: "auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title", children: "طلب إجازة جديدة" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        createLeave.mutate(newLeave);
      }, className: "card-body", style: { display: "flex", flexDirection: "column", gap: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "نوع الإجازة *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Select,
            {
              value: newLeave.leaveType,
              onChange: (e) => setNewLeave({ ...newLeave, leaveType: e.target.value }),
              options: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "تاريخ البداية *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: newLeave.startDate, onChange: (e) => setNewLeave({ ...newLeave, startDate: e.target.value }), className: "form-input", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "تاريخ النهاية *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: newLeave.endDate, onChange: (e) => setNewLeave({ ...newLeave, endDate: e.target.value }), className: "form-input", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "السبب *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: newLeave.reason, onChange: (e) => setNewLeave({ ...newLeave, reason: e.target.value }), className: "form-input", rows: 3, required: true, placeholder: "اكتب سبب الإجازة..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-4)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => setShowRequestModal(false), children: "إلغاء" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", loading: createLeave.isPending, children: createLeave.isPending ? "جاري الإرسال..." : "إرسال الطلب" })
        ] })
      ] })
    ] }) })
  ] });
}

const {useState: useState$2} = await importShared('react');

const {useQuery} = await importShared('@tanstack/react-query');
function VanSchedulePage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState$2({
    dateFrom: "2026-11-01",
    dateTo: "2026-11-10",
    vanCode: user?.vanCode || ""
  });
  const { data: schedule = [], isLoading, refetch } = useQuery({
    queryKey: ["vanSchedule", filters],
    queryFn: async () => {
      const res = await api.getVanSchedule({
        vanCode: filters.vanCode || void 0,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo
      });
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1e3,
    enabled: !!filters.vanCode
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "جدول الوحدة المتنقلة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "خطة حركة الوحدة والموقع اليومي" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), icon: "🔄", children: "تحديث" })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: filters.vanCode, onChange: (e) => setFilters((f) => ({ ...f, vanCode: e.target.value })), className: "form-input", placeholder: "كود الوحدة" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "primary", onClick: () => refetch(), style: { height: "fit-content" }, icon: "🔄", children: "تحديث" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "card-title", children: "خطة الحركة اليومية" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "التاريخ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "كود الوحدة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الموقع" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "المحافظة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "الحالة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ملاحظات" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          schedule.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: entry.vanCode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry.location }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry.governorate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: entry.status === "ACTIVE" ? "success" : entry.status === "MAINTENANCE" ? "warning" : "neutral", children: entry.status === "ACTIVE" ? "نشط" : entry.status === "MAINTENANCE" ? "صيانة" : "غير نشط" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry.notes || "-" })
          ] }, entry.id)),
          schedule.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, style: { textAlign: "center", padding: "var(--space-10)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state-icon", children: "📅" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "empty-state-title", children: "لا يوجد جدول" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "empty-state-description", children: "لا توجد بيانات جدول للفترة المحددة" })
          ] }) }) })
        ] })
      ] }) }) })
    ] })
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
          navigate("/daily-entry");
        }
        return;
      }
      const localResult = await localLogin(empId.trim(), pin);
      if (localResult) {
        await login(localResult.user, localResult.token);
        if (localResult.forcePinChange) {
          navigate("/change-pin");
        } else {
          navigate("/daily-entry");
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
          navigate("/daily-entry");
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "var(--space-1)" }, children: "تطبيق الموظف" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", fontSize: "0.875rem", margin: 0 }, children: "البيان اليومي، مبيعاتي، إجازاتي" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, style: { paddingTop: "var(--space-4)" }, children: [
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
            placeholder: "أدخل رقم العامل أو اسم المستخدم (مثال: 113976 أو Ahmed.Refaai)",
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
        navigate("/daily-entry");
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

const {Navigate,useLocation} = await importShared('react-router-dom');
const React = await importShared('react');

function ProtectedRoute({ children, allowedRoles }) {
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
    return React.createElement(Navigate, { to: "/login", state: { from: location }, replace: true });
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return React.createElement(Navigate, { to: "/unauthorized", replace: true });
  }
  return React.createElement(React.Fragment, null, children);
}

export { AuthProvider as A, ChangePinPage as C, DailyEntryPage as D, LoginPage as L, MySalesPage as M, ProtectedRoute as P, VanSchedulePage as V, MyLeavesPage as a, Layout as b, api as c, useAuth as u };
