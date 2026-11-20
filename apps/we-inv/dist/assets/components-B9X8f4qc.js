import { importShared } from './__federation_fn_import-BaF0yEKb.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CDyZ5S4g.js';

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

export { Button as B, Card as C, Input as I, Select as S, api as a, Badge as b };
