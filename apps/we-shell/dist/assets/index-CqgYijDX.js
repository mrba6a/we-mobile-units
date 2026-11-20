import { i as importShared } from './_virtual___federation_fn_import-CrGvos10.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CyoIsdjr.js';
import { r as reactDomExports } from './index-D9Af7wOI.js';

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

const {createContext,useContext,useState: useState$2,useEffect} = await importShared('react');
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState$2(null);
  const [token, setToken] = useState$2(null);
  const [isLoading, setIsLoading] = useState$2(true);
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

const remotesMap = {
'we_review':{url:'http://localhost:3001/assets/remoteEntry.js',format:'esm',from:'vite'},
  'we_emp':{url:'http://localhost:3002/assets/remoteEntry.js',format:'esm',from:'vite'},
  'we_inv':{url:'http://localhost:3003/assets/remoteEntry.js',format:'esm',from:'vite'}
};
                const currentImports = {};
                const loadJS = async (url, fn) => {
                    const resolvedUrl = typeof url === 'function' ? await url() : url;
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.onload = fn;
                    script.src = resolvedUrl;
                    document.getElementsByTagName('head')[0].appendChild(script);
                };

                function get(name, remoteFrom) {
                    return __federation_import(name).then(module => () => {
                        if (remoteFrom === 'webpack') {
                            return Object.prototype.toString.call(module).indexOf('Module') > -1 && module.default ? module.default : module
                        }
                        return module
                    })
                }
                
                function merge(obj1, obj2) {
                  const mergedObj = Object.assign(obj1, obj2);
                  for (const key of Object.keys(mergedObj)) {
                    if (typeof mergedObj[key] === 'object' && typeof obj2[key] === 'object') {
                      mergedObj[key] = merge(mergedObj[key], obj2[key]);
                    }
                  }
                  return mergedObj;
                }

                const wrapShareModule = remoteFrom => {
                  return merge({
                    'react':{'18.3.1':{get:()=>get(new URL('__federation_shared_react-BCcI129A.js', import.meta.url).href, remoteFrom), loaded:1}},'react-dom':{'18.3.1':{get:()=>get(new URL('__federation_shared_react-dom-BhMZJInU.js', import.meta.url).href, remoteFrom), loaded:1}},'react-router-dom':{'6.30.6':{get:()=>get(new URL('__federation_shared_react-router-dom-D9ruwdFk.js', import.meta.url).href, remoteFrom), loaded:1}},'@tanstack/react-query':{'5.108.0':{get:()=>get(new URL('__federation_shared_@tanstack/react-query-BtDifcaW.js', import.meta.url).href, remoteFrom), loaded:1}},'zustand':{'4.5.7':{get:()=>get(new URL('__federation_shared_zustand-DuFS-XKF.js', import.meta.url).href, remoteFrom), loaded:1}},'recharts':{'3.11.0':{get:()=>get(new URL('__federation_shared_recharts-Cik-VV8x.js', import.meta.url).href, remoteFrom), loaded:1}}
                  }, (globalThis.__federation_shared__ || {})['default'] || {});
                };

                async function __federation_import(name) {
                    currentImports[name] ??= import(name);
                    return currentImports[name]
                }

                async function __federation_method_ensure(remoteId) {
                    const remote = remotesMap[remoteId];
                    if (!remote.inited) {
                        if ('var' === remote.format) {
                            // loading js with script tag
                            return new Promise(resolve => {
                                const callback = () => {
                                    if (!remote.inited) {
                                        remote.lib = window[remoteId];
                                        remote.lib.init(wrapShareModule(remote.from));
                                        remote.inited = true;
                                    }
                                    resolve(remote.lib);
                                };
                                return loadJS(remote.url, callback);
                            });
                        } else if (['esm', 'systemjs'].includes(remote.format)) {
                            // loading js with import(...)
                            return new Promise((resolve, reject) => {
                                const getUrl = typeof remote.url === 'function' ? remote.url : () => Promise.resolve(remote.url);
                                getUrl().then(url => {
                                    import(/* @vite-ignore */ url).then(lib => {
                                        if (!remote.inited) {
                                            const shareScope = wrapShareModule(remote.from);
                                            lib.init(shareScope);
                                            remote.lib = lib;
                                            remote.lib.init(shareScope);
                                            remote.inited = true;
                                        }
                                        resolve(remote.lib);
                                    }).catch(reject);
                                });
                            })
                        }
                    } else {
                        return remote.lib;
                    }
                }

                function __federation_method_wrapDefault(module, need) {
                    if (!module?.default && need) {
                        let obj = Object.create(null);
                        obj.default = module;
                        obj.__esModule = true;
                        return obj;
                    }
                    return module;
                }

                function __federation_method_getRemote(remoteName, componentName) {
                    return __federation_method_ensure(remoteName).then((remote) => remote.get(componentName).then(factory => factory()));
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

const {useState: useState$1} = await importShared('react');

const {useNavigate} = await importShared('react-router-dom');
function LoginPage() {
  const navigate = useNavigate();
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
      setError("رقم العامل مطلوب");
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
      const response = await api.login(empId.trim().toUpperCase(), pin);
      if (response.success && response.data) {
        await login(response.data.user, response.data.token);
        if (response.data.forcePinChange) {
          navigate("/change-pin");
        } else {
          navigate("/review");
        }
      } else {
        setError(response.error || "رقم العامل أو PIN غير صحيح");
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "var(--space-1)" }, children: "الإدارة العامة للوحدات المتنقلة" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--color-neutral-500)", fontSize: "0.875rem", margin: 0 }, children: "نظام المراجعة والتقارير" })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "1. رقم العامل / اسم المستخدم *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "text",
            value: empId,
            onChange: (e) => setEmpId(e.target.value),
            placeholder: "أدخل رقم العامل (مثال: 113985 أو admin)",
            autoComplete: "username",
            inputMode: "numeric",
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.6875rem", color: "var(--color-neutral-500)", marginTop: "var(--space-1)" }, children: "أدخل رقم العامل أولاً للتحقق من حالة تفعيل الحساب" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "var(--space-4)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", style: { width: 18, height: 18, accentColor: "var(--color-primary-600)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", color: "var(--color-neutral-600)" }, children: "تذكرني لمدة 30 يوماً" })
      ] }) }),
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

const {Navigate: Navigate$1,useLocation} = await importShared('react-router-dom');
const React$1 = await importShared('react');

function ProtectedRoute({ children, requiredRole, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return React$1.createElement(
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
      React$1.createElement("div", { className: "loading-spinner", style: { width: 40, height: 40 } })
    );
  }
  if (!user) {
    return React$1.createElement(Navigate$1, { to: "/login", state: { from: location }, replace: true });
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
      return React$1.createElement(
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
        React$1.createElement(
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
          React$1.createElement("div", { style: { fontSize: "3rem", marginBottom: "var(--space-4)" } }, "🔒"),
          React$1.createElement(
            "h2",
            { style: { fontSize: "1.25rem", fontWeight: 700, color: "var(--color-neutral-900)", marginBottom: "var(--space-3)" } },
            "غير مصرح"
          ),
          React$1.createElement(
            "p",
            { style: { color: "var(--color-neutral-600)", marginBottom: "var(--space-6)" } },
            "لا تملك الصلاحية للوصول إلى هذه الصفحة. دورك الحالي: ",
            React$1.createElement("strong", null, user.role)
          ),
          React$1.createElement(
            "button",
            {
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
            },
            "رجوع"
          )
        )
      );
    }
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return React$1.createElement(Navigate$1, { to: "/unauthorized", replace: true });
  }
  return React$1.createElement(React$1.Fragment, null, children);
}

const {Suspense,lazy,useState} = await importShared('react');

const {Routes,Route,Navigate} = await importShared('react-router-dom');
const ReviewRoutes = lazy(() => __federation_method_getRemote("we_review" , "./ReviewRoutes").then(module=>__federation_method_wrapDefault(module, true)).then((m) => ({ default: m.ReviewRoutes })));
const EmpRoutes = lazy(() => __federation_method_getRemote("we_emp" , "./EmpRoutes").then(module=>__federation_method_wrapDefault(module, true)).then((m) => ({ default: m.EmpRoutes })));
const InvRoutes = lazy(() => __federation_method_getRemote("we_inv" , "./InvRoutes").then(module=>__federation_method_wrapDefault(module, true)).then((m) => ({ default: m.InvRoutes })));
function App() {
  const { user, isLoading } = useAuth();
  const [activeApp, setActiveApp] = useState("review");
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
  const switchApp = (app) => {
    setActiveApp(app);
    window.location.href = `/${app}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "white",
      borderBottom: "1px solid var(--color-neutral-200)",
      boxShadow: "var(--shadow-sm)",
      padding: "0 var(--space-6)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-4)" }, children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.125rem", fontWeight: 700, color: "var(--color-neutral-900)" }, children: "نظام إدارة الوحدات المتنقلة - WE" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { style: { display: "flex", gap: "var(--space-2)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => switchApp("review"),
            className: `btn ${activeApp === "review" ? "btn-primary" : "btn-secondary"} btn-sm`,
            children: "📊 المراجعة والتقارير"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => switchApp("emp"),
            className: `btn ${activeApp === "emp" ? "btn-primary" : "btn-secondary"} btn-sm`,
            children: "👤 الموظف"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => switchApp("inv"),
            className: `btn ${activeApp === "inv" ? "btn-primary" : "btn-secondary"} btn-sm`,
            children: "📦 المخزون والإجازات"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-4)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8125rem", color: "var(--color-neutral-600)" }, children: user?.name }),
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
          fontSize: "0.875rem"
        }, children: user?.name?.charAt(0) || "م" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { style: { flex: 1, padding: "var(--space-6)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      background: "var(--color-neutral-50)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/review/*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { requiredRole: "SUPERVISOR", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewRoutes, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/emp/*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["AGENT", "SELLER", "SUPERVISOR", "ADMIN"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmpRoutes, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/inv/*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { requiredRole: "STOCK_MANAGER", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InvRoutes, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/review", replace: true }) })
    ] }) }) })
  ] });
}

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
api.setBaseUrl("/api");
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) }) }) })
);
