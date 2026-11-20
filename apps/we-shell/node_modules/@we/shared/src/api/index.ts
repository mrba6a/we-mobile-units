// WE Mobile Units - API Client

import type {
  WEUser,
  DailyEntry,
  ReconciliationEntry,
  BSSEntry,
  MonthlyReportEntry,
  HistoricalReportEntry,
  StockItem,
  StockTransfer,
  LeaveRequest,
  LeaveBalance,
  WhatsAppReport,
  DawryEntry,
  ApiResponse,
  PaginatedResponse,
  DateRangeFilter,
  VanFilter,
  AgentFilter,
} from '../types';

// Vite/Node environment types
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const importMeta: ImportMeta | undefined;
declare const process: { env: { VITE_API_BASE?: string } } | undefined;

// Get API base URL from environment or use default
const getApiBase = (): string => {
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
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('we_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('we_auth_token', token);
    } else {
      localStorage.removeItem('we_auth_token');
    }
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
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
  async login(empId: string, pin: string): Promise<ApiResponse<{ user: WEUser; token: string; forcePinChange?: boolean }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ empId, pin }),
    });
  }

  async verifyToken(): Promise<ApiResponse<{ user: WEUser }>> {
    return this.request('/auth/verify');
  }

  async changePin(oldPin: string, newPin: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('/auth/change-pin', {
      method: 'POST',
      body: JSON.stringify({ oldPin, newPin }),
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  // ==================== DATA (Agents, Vans, Plans) ====================
  async getAgents(filters?: AgentFilter): Promise<ApiResponse<WEUser[]>> {
    const params = new URLSearchParams();
    if (filters?.agentId) params.set('agentId', filters.agentId);
    if (filters?.role) params.set('role', filters.role);
    if (filters?.vanCode) params.set('vanCode', filters.vanCode);
    return this.request(`/data/agents?${params}`);
  }

  async getAgentById(id: string): Promise<ApiResponse<WEUser>> {
    return this.request(`/data/agents/${id}`);
  }

  async getVans(filters?: VanFilter): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters?.vanCode) params.set('vanCode', filters.vanCode);
    if (filters?.governorate) params.set('governorate', filters.governorate);
    if (filters?.sector) params.set('sector', filters.sector);
    return this.request(`/data/vans?${params}`);
  }

  async getVanByCode(code: string): Promise<ApiResponse<any>> {
    return this.request(`/data/vans/${code}`);
  }

  async getDailyMovementPlan(date?: string): Promise<ApiResponse<Record<string, any>>> {
    const params = date ? `?date=${date}` : '';
    return this.request(`/data/movement-plan${params}`);
  }

  async updateDailyMovementPlan(data: any): Promise<ApiResponse<any>> {
    return this.request('/data/movement-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== DAILY ENTRY ====================
  async createDailyEntry(entry: Partial<DailyEntry>): Promise<ApiResponse<DailyEntry>> {
    return this.request('/entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async getDailyEntries(filters: DateRangeFilter & VanFilter & { page?: number; pageSize?: number }): Promise<ApiResponse<PaginatedResponse<DailyEntry>>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.period) params.set('period', filters.period);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
    return this.request(`/entries?${params}`);
  }

  async getDailyEntryById(id: string): Promise<ApiResponse<DailyEntry>> {
    return this.request(`/entries/${id}`);
  }

  async updateDailyEntry(id: string, entry: Partial<DailyEntry>): Promise<ApiResponse<DailyEntry>> {
    return this.request(`/entries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(entry),
    });
  }

  async submitDailyEntry(id: string): Promise<ApiResponse<DailyEntry>> {
    return this.request(`/entries/${id}/submit`, { method: 'POST' });
  }

  // ==================== RECONCILIATION ====================
  async getReconciliation(filters: DateRangeFilter & VanFilter & { mode?: string; basis?: string }): Promise<ApiResponse<ReconciliationEntry[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    if (filters.mode) params.set('mode', filters.mode);
    if (filters.basis) params.set('basis', filters.basis);
    return this.request(`/reconciliation?${params}`);
  }

  async getReconciliationSummary(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    return this.request(`/reconciliation/summary?${params}`);
  }

  // ==================== FINANCE / BSS ====================
  async getBSSData(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<BSSEntry[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    return this.request(`/finance/bss?${params}`);
  }

  async getFinanceComparison(filters: DateRangeFilter & VanFilter & { groupBy?: 'van' | 'agent' | 'governorate' | 'date' }): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    if (filters.groupBy) params.set('groupBy', filters.groupBy);
    return this.request(`/finance/comparison?${params}`);
  }

  async getFinanceDiscrepancies(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    return this.request(`/finance/discrepancies?${params}`);
  }

  // ==================== REPORTS ====================
  async getMonthlyReport(filters: DateRangeFilter & VanFilter & { month?: string; year?: number; agentId?: string; page?: number; pageSize?: number }): Promise<ApiResponse<MonthlyReportEntry[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    if (filters.month) params.set('month', filters.month);
    if (filters.year) params.set('year', String(filters.year));
    if (filters.agentId) params.set('agentId', filters.agentId);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
    return this.request(`/reports/monthly?${params}`);
  }

  async getCategories(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    return this.request(`/reports/categories?${params}`);
  }

  async getHistoricalReport(filters: Omit<DateRangeFilter, 'period'> & VanFilter & { period?: 'daily' | 'monthly' | 'yearly' | 'today' | 'week' | 'quarter' | 'year' | 'custom' | 'month' }): Promise<ApiResponse<HistoricalReportEntry[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    if (filters.period) params.set('period', filters.period);
    return this.request(`/reports/historical?${params}`);
  }

  async getFinalSheet(filters: DateRangeFilter & VanFilter & { status?: 'all' | 'matched' | 'excess' | 'shortage'; page?: number; pageSize?: number }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
    return this.request(`/reports/final-sheet?${params}`);
  }

  async exportReport(type: 'monthly' | 'historical' | 'final-sheet' | 'reconciliation', filters: any): Promise<Blob> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    const response = await fetch(`${this.baseUrl}/reports/export/${type}?${params}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    });
    return response.blob();
  }

  // ==================== STOCK ====================
  async getStock(filters: VanFilter): Promise<ApiResponse<StockItem[]>> {
    const params = new URLSearchParams();
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    return this.request(`/stock?${params}`);
  }

  async updateStock(item: Partial<StockItem>): Promise<ApiResponse<StockItem>> {
    return this.request('/stock', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async getStockTransfers(filters: VanFilter & DateRangeFilter): Promise<ApiResponse<StockTransfer[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    return this.request(`/stock/transfers?${params}`);
  }

  async createStockTransfer(transfer: Partial<StockTransfer>): Promise<ApiResponse<StockTransfer>> {
    return this.request('/stock/transfers', {
      method: 'POST',
      body: JSON.stringify(transfer),
    });
  }

  async approveStockTransfer(id: string): Promise<ApiResponse<StockTransfer>> {
    return this.request(`/stock/transfers/${id}/approve`, { method: 'POST' });
  }

  // ==================== LEAVES ====================
  async getLeaves(filters: DateRangeFilter & VanFilter & { status?: string; agentId?: string }): Promise<ApiResponse<LeaveRequest[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    if (filters.status) params.set('status', filters.status);
    if (filters.agentId) params.set('agentId', filters.agentId);
    return this.request(`/leaves?${params}`);
  }

  // ==================== MY SALES (Agent) ====================
  async getMySales(filters: { agentId?: string; dateFrom?: string; dateTo?: string }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters.agentId) params.set('agentId', filters.agentId);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    return this.request(`/sales/my-sales?${params}`);
  }

  // ==================== VAN SCHEDULE ====================
  async getVanSchedule(filters: { vanCode?: string; dateFrom?: string; dateTo?: string }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    return this.request(`/schedule/van?${params}`);
  }

  async createLeaveRequest(leave: Partial<LeaveRequest>): Promise<ApiResponse<LeaveRequest>> {
    return this.request('/leaves', {
      method: 'POST',
      body: JSON.stringify(leave),
    });
  }

  async approveLeave(id: string, approved: boolean, notes?: string): Promise<ApiResponse<LeaveRequest>> {
    return this.request(`/leaves/${id}/${approved ? 'approve' : 'reject'}`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async getLeaveBalances(filters: VanFilter): Promise<ApiResponse<LeaveBalance[]>> {
    const params = new URLSearchParams();
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    if (filters.governorate) params.set('governorate', filters.governorate);
    return this.request(`/leaves/balances?${params}`);
  }

  // ==================== WHATSAPP ====================
  async importWhatsAppData(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${this.baseUrl}/whatsapp/import`, {
      method: 'POST',
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    });
    return response.json();
  }

  async getWhatsAppReports(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<WhatsAppReport[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    return this.request(`/whatsapp/reports?${params}`);
  }

  // ==================== DAWRY (الدوري) ====================
  async getDawryData(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<DawryEntry[]>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    return this.request(`/dawry?${params}`);
  }

  async matchDawryWithVoiceAmount(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.vanCode) params.set('vanCode', filters.vanCode);
    return this.request(`/dawry/match-voice?${params}`);
  }
}

export const api = new ApiClient();
export default api;