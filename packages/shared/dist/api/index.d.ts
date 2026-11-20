import type { WEUser, DailyEntry, ReconciliationEntry, BSSEntry, MonthlyReportEntry, HistoricalReportEntry, StockItem, StockTransfer, LeaveRequest, LeaveBalance, WhatsAppReport, DawryEntry, ApiResponse, PaginatedResponse, DateRangeFilter, VanFilter, AgentFilter } from '../types';
declare class ApiClient {
    private baseUrl;
    private token;
    constructor(baseUrl?: string);
    setToken(token: string | null): void;
    setBaseUrl(baseUrl: string): void;
    private request;
    login(empId: string, pin: string): Promise<ApiResponse<{
        user: WEUser;
        token: string;
        forcePinChange?: boolean;
    }>>;
    verifyToken(): Promise<ApiResponse<{
        user: WEUser;
    }>>;
    changePin(oldPin: string, newPin: string): Promise<ApiResponse<{
        success: boolean;
    }>>;
    changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<{
        success: boolean;
    }>>;
    logout(): Promise<void>;
    getAgents(filters?: AgentFilter): Promise<ApiResponse<WEUser[]>>;
    getAgentById(id: string): Promise<ApiResponse<WEUser>>;
    getVans(filters?: VanFilter): Promise<ApiResponse<any[]>>;
    getVanByCode(code: string): Promise<ApiResponse<any>>;
    getDailyMovementPlan(date?: string): Promise<ApiResponse<Record<string, any>>>;
    updateDailyMovementPlan(data: any): Promise<ApiResponse<any>>;
    createDailyEntry(entry: Partial<DailyEntry>): Promise<ApiResponse<DailyEntry>>;
    getDailyEntries(filters: DateRangeFilter & VanFilter & {
        page?: number;
        pageSize?: number;
    }): Promise<ApiResponse<PaginatedResponse<DailyEntry>>>;
    getDailyEntryById(id: string): Promise<ApiResponse<DailyEntry>>;
    updateDailyEntry(id: string, entry: Partial<DailyEntry>): Promise<ApiResponse<DailyEntry>>;
    submitDailyEntry(id: string): Promise<ApiResponse<DailyEntry>>;
    getReconciliation(filters: DateRangeFilter & VanFilter & {
        mode?: string;
        basis?: string;
    }): Promise<ApiResponse<ReconciliationEntry[]>>;
    getReconciliationSummary(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<any>>;
    getBSSData(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<BSSEntry[]>>;
    getFinanceComparison(filters: DateRangeFilter & VanFilter & {
        groupBy?: 'van' | 'agent' | 'governorate' | 'date';
    }): Promise<ApiResponse<any>>;
    getFinanceDiscrepancies(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<any[]>>;
    getMonthlyReport(filters: DateRangeFilter & VanFilter & {
        month?: string;
        year?: number;
        agentId?: string;
        page?: number;
        pageSize?: number;
    }): Promise<ApiResponse<MonthlyReportEntry[]>>;
    getCategories(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<any[]>>;
    getHistoricalReport(filters: Omit<DateRangeFilter, 'period'> & VanFilter & {
        period?: 'daily' | 'monthly' | 'yearly' | 'today' | 'week' | 'quarter' | 'year' | 'custom' | 'month';
    }): Promise<ApiResponse<HistoricalReportEntry[]>>;
    getFinalSheet(filters: DateRangeFilter & VanFilter & {
        status?: 'all' | 'matched' | 'excess' | 'shortage';
        page?: number;
        pageSize?: number;
    }): Promise<ApiResponse<any[]>>;
    exportReport(type: 'monthly' | 'historical' | 'final-sheet' | 'reconciliation', filters: any): Promise<Blob>;
    getStock(filters: VanFilter): Promise<ApiResponse<StockItem[]>>;
    updateStock(item: Partial<StockItem>): Promise<ApiResponse<StockItem>>;
    getStockTransfers(filters: VanFilter & DateRangeFilter): Promise<ApiResponse<StockTransfer[]>>;
    createStockTransfer(transfer: Partial<StockTransfer>): Promise<ApiResponse<StockTransfer>>;
    approveStockTransfer(id: string): Promise<ApiResponse<StockTransfer>>;
    getLeaves(filters: DateRangeFilter & VanFilter & {
        status?: string;
        agentId?: string;
    }): Promise<ApiResponse<LeaveRequest[]>>;
    getMySales(filters: {
        agentId?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<any[]>>;
    getVanSchedule(filters: {
        vanCode?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<any[]>>;
    createLeaveRequest(leave: Partial<LeaveRequest>): Promise<ApiResponse<LeaveRequest>>;
    approveLeave(id: string, approved: boolean, notes?: string): Promise<ApiResponse<LeaveRequest>>;
    getLeaveBalances(filters: VanFilter): Promise<ApiResponse<LeaveBalance[]>>;
    importWhatsAppData(file: File): Promise<ApiResponse<{
        imported: number;
        errors: string[];
    }>>;
    getWhatsAppReports(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<WhatsAppReport[]>>;
    getDawryData(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<DawryEntry[]>>;
    matchDawryWithVoiceAmount(filters: DateRangeFilter & VanFilter): Promise<ApiResponse<any>>;
}
export declare const api: ApiClient;
export default api;
//# sourceMappingURL=index.d.ts.map