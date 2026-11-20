// WE Mobile Units - API Client
// Get API base URL from environment or use default
const getApiBase = () => {
    if (typeof importMeta !== 'undefined' && importMeta.env?.VITE_API_BASE) {
        return importMeta.env.VITE_API_BASE;
    }
    if (typeof process !== 'undefined' && process.env?.VITE_API_BASE) {
        return process.env.VITE_API_BASE;
    }
    return '/api';
};
const API_BASE = getApiBase();
class ApiClient {
    baseUrl;
    token = null;
    constructor(baseUrl = API_BASE) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('we_auth_token');
    }
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('we_auth_token', token);
        }
        else {
            localStorage.removeItem('we_auth_token');
        }
    }
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });
        const data = await response.json();
        if (!response.ok) {
            return { success: false, error: data.error || 'Request failed' };
        }
        return { success: true, data: data.data || data };
    }
    // ==================== AUTH ====================
    async login(empId, pin) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ empId, pin }),
        });
    }
    async verifyToken() {
        return this.request('/auth/verify');
    }
    async changePin(oldPin, newPin) {
        return this.request('/auth/change-pin', {
            method: 'POST',
            body: JSON.stringify({ oldPin, newPin }),
        });
    }
    async changePassword(oldPassword, newPassword) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword }),
        });
    }
    async logout() {
        this.setToken(null);
    }
    // ==================== DATA (Agents, Vans, Plans) ====================
    async getAgents(filters) {
        const params = new URLSearchParams();
        if (filters?.agentId)
            params.set('agentId', filters.agentId);
        if (filters?.role)
            params.set('role', filters.role);
        if (filters?.vanCode)
            params.set('vanCode', filters.vanCode);
        return this.request(`/data/agents?${params}`);
    }
    async getAgentById(id) {
        return this.request(`/data/agents/${id}`);
    }
    async getVans(filters) {
        const params = new URLSearchParams();
        if (filters?.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters?.governorate)
            params.set('governorate', filters.governorate);
        if (filters?.sector)
            params.set('sector', filters.sector);
        return this.request(`/data/vans?${params}`);
    }
    async getVanByCode(code) {
        return this.request(`/data/vans/${code}`);
    }
    async getDailyMovementPlan(date) {
        const params = date ? `?date=${date}` : '';
        return this.request(`/data/movement-plan${params}`);
    }
    async updateDailyMovementPlan(data) {
        return this.request('/data/movement-plan', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    // ==================== DAILY ENTRY ====================
    async createDailyEntry(entry) {
        return this.request('/entries', {
            method: 'POST',
            body: JSON.stringify(entry),
        });
    }
    async getDailyEntries(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.period)
            params.set('period', filters.period);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        if (filters.page)
            params.set('page', String(filters.page));
        if (filters.pageSize)
            params.set('pageSize', String(filters.pageSize));
        return this.request(`/entries?${params}`);
    }
    async getDailyEntryById(id) {
        return this.request(`/entries/${id}`);
    }
    async updateDailyEntry(id, entry) {
        return this.request(`/entries/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(entry),
        });
    }
    async submitDailyEntry(id) {
        return this.request(`/entries/${id}/submit`, { method: 'POST' });
    }
    // ==================== RECONCILIATION ====================
    async getReconciliation(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        if (filters.mode)
            params.set('mode', filters.mode);
        if (filters.basis)
            params.set('basis', filters.basis);
        return this.request(`/reconciliation?${params}`);
    }
    async getReconciliationSummary(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        return this.request(`/reconciliation/summary?${params}`);
    }
    // ==================== FINANCE / BSS ====================
    async getBSSData(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        return this.request(`/finance/bss?${params}`);
    }
    async getFinanceComparison(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        if (filters.groupBy)
            params.set('groupBy', filters.groupBy);
        return this.request(`/finance/comparison?${params}`);
    }
    async getFinanceDiscrepancies(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        return this.request(`/finance/discrepancies?${params}`);
    }
    // ==================== REPORTS ====================
    async getMonthlyReport(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        if (filters.month)
            params.set('month', filters.month);
        if (filters.year)
            params.set('year', String(filters.year));
        if (filters.agentId)
            params.set('agentId', filters.agentId);
        if (filters.page)
            params.set('page', String(filters.page));
        if (filters.pageSize)
            params.set('pageSize', String(filters.pageSize));
        return this.request(`/reports/monthly?${params}`);
    }
    async getCategories(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        return this.request(`/reports/categories?${params}`);
    }
    async getHistoricalReport(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        if (filters.period)
            params.set('period', filters.period);
        return this.request(`/reports/historical?${params}`);
    }
    async getFinalSheet(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        if (filters.status)
            params.set('status', filters.status);
        if (filters.page)
            params.set('page', String(filters.page));
        if (filters.pageSize)
            params.set('pageSize', String(filters.pageSize));
        return this.request(`/reports/final-sheet?${params}`);
    }
    async exportReport(type, filters) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined)
                params.set(key, String(value));
        });
        const response = await fetch(`${this.baseUrl}/reports/export/${type}?${params}`, {
            headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        });
        return response.blob();
    }
    // ==================== STOCK ====================
    async getStock(filters) {
        const params = new URLSearchParams();
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        return this.request(`/stock?${params}`);
    }
    async updateStock(item) {
        return this.request('/stock', {
            method: 'POST',
            body: JSON.stringify(item),
        });
    }
    async getStockTransfers(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        return this.request(`/stock/transfers?${params}`);
    }
    async createStockTransfer(transfer) {
        return this.request('/stock/transfers', {
            method: 'POST',
            body: JSON.stringify(transfer),
        });
    }
    async approveStockTransfer(id) {
        return this.request(`/stock/transfers/${id}/approve`, { method: 'POST' });
    }
    // ==================== LEAVES ====================
    async getLeaves(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        if (filters.status)
            params.set('status', filters.status);
        if (filters.agentId)
            params.set('agentId', filters.agentId);
        return this.request(`/leaves?${params}`);
    }
    // ==================== MY SALES (Agent) ====================
    async getMySales(filters) {
        const params = new URLSearchParams();
        if (filters.agentId)
            params.set('agentId', filters.agentId);
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        return this.request(`/sales/my-sales?${params}`);
    }
    // ==================== VAN SCHEDULE ====================
    async getVanSchedule(filters) {
        const params = new URLSearchParams();
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        return this.request(`/schedule/van?${params}`);
    }
    async createLeaveRequest(leave) {
        return this.request('/leaves', {
            method: 'POST',
            body: JSON.stringify(leave),
        });
    }
    async approveLeave(id, approved, notes) {
        return this.request(`/leaves/${id}/${approved ? 'approve' : 'reject'}`, {
            method: 'POST',
            body: JSON.stringify({ notes }),
        });
    }
    async getLeaveBalances(filters) {
        const params = new URLSearchParams();
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        if (filters.governorate)
            params.set('governorate', filters.governorate);
        return this.request(`/leaves/balances?${params}`);
    }
    // ==================== WHATSAPP ====================
    async importWhatsAppData(file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${this.baseUrl}/whatsapp/import`, {
            method: 'POST',
            headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
            body: formData,
        });
        return response.json();
    }
    async getWhatsAppReports(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        return this.request(`/whatsapp/reports?${params}`);
    }
    // ==================== DAWRY (الدوري) ====================
    async getDawryData(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        return this.request(`/dawry?${params}`);
    }
    async matchDawryWithVoiceAmount(filters) {
        const params = new URLSearchParams();
        if (filters.dateFrom)
            params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo)
            params.set('dateTo', filters.dateTo);
        if (filters.vanCode)
            params.set('vanCode', filters.vanCode);
        return this.request(`/dawry/match-voice?${params}`);
    }
}
export const api = new ApiClient();
export default api;
