export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'FINANCE' | 'STOCK_MANAGER' | 'HR' | 'AGENT' | 'SELLER';
export interface WEUser {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    vanCode?: string;
    governorate?: string;
    email?: string;
    phone?: string;
    permissions: Permission[];
    defaultPin?: string;
    skipForcePin?: boolean;
}
export interface Permission {
    resource: ResourceType;
    actions: ('read' | 'write' | 'delete' | 'export')[];
    scope: 'own' | 'van' | 'governorate' | 'all';
}
export type ResourceType = 'reconciliation' | 'finance' | 'monthly' | 'historical' | 'dailyEntry' | 'mySales' | 'myLeaves' | 'vanSchedule' | 'stock' | 'allLeaves' | 'vans' | 'categories' | 'users' | 'reports' | 'whatsapp';
export interface Agent {
    name: string;
    username: string;
    id: string;
    email: string;
    phone: string;
    nationalId: string;
    location: string;
    van: string;
}
export interface Van {
    code: string;
    plate: string;
    ouName: string;
    ouCode: string;
    name: string;
    gov: string;
    isOfficeDefault?: boolean;
}
export interface DailyMovementPlan {
    code: string;
    ouCode: string;
    plate: string;
    oldLoc: string;
    oldGov: string;
    oldEnd: string;
    newLoc: string;
    newGov: string;
    landmark: string;
    newStart: string;
    status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
    notes: string;
}
export interface DailyEntry {
    id: string;
    date: string;
    vanCode: string;
    location: string;
    governorate: string;
    agentCount: number;
    agents: AgentEntry[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
}
export interface AgentEntry {
    slot: number;
    agentId: string;
    agentName: string;
    mobileLines: MobileLinesEntry;
    adsl: ADSLEntry;
    fixedLines: FixedLinesEntry;
    devices: DevicesEntry;
    amounts: AmountsEntry;
    selfReview: SelfReviewEntry;
    signature?: string;
}
export interface MobileLinesEntry {
    weClub: SimTypeEntry;
    weClubEsim: SimTypeEntry;
    zero100: SimTypeEntry;
    zero100Esim: SimTypeEntry;
    weMix250: SimTypeEntry;
    weMix250Esim: SimTypeEntry;
    weMix355: SimTypeEntry;
    weMix355Esim: SimTypeEntry;
    weMix500: SimTypeEntry;
    weMix500Esim: SimTypeEntry;
    weGold300: SimTypeEntry;
    weGold300Esim: SimTypeEntry;
    weGold500: SimTypeEntry;
    weGold500Esim: SimTypeEntry;
    weGold700: SimTypeEntry;
    weGold700Esim: SimTypeEntry;
    weGold1000: SimTypeEntry;
    weGold1000Esim: SimTypeEntry;
    weGold1500: SimTypeEntry;
    weGold1500Esim: SimTypeEntry;
    weGold2300: SimTypeEntry;
    weGold2300Esim: SimTypeEntry;
    mnp: SimTypeEntry;
    mnpEsim: SimTypeEntry;
    students: SimTypeEntry;
    studentsEsim: SimTypeEntry;
    gas: SimTypeEntry;
    gasEsim: SimTypeEntry;
    initiative: SimTypeEntry;
    initiativeEsim: SimTypeEntry;
    totalLines: number;
}
export interface SimTypeEntry {
    physical: number;
    esim: number;
}
export interface ADSLEntry {
    adsl10M: number;
    adsl30M: number;
    adsl70M: number;
    adsl100M: number;
    adsl200M: number;
    adsl300M: number;
    adsl500M: number;
    adsl1G: number;
    routerHuawei: number;
    routerZyxel: number;
    routerNokia: number;
    routerTpLink: number;
    fixedContracts: number;
    totalADSL: number;
}
export interface FixedLinesEntry {
    ossContract: number;
    fixedLines: number;
}
export interface DevicesEntry {
    weAir: number;
    ont: number;
    cpe: number;
    mifi: number;
}
export interface AmountsEntry {
    bssCash: number;
    bssVisa: number;
    bssExempt: number;
    mobileCash: number;
    mobileVisa: number;
    mobileExempt: number;
    dawryCount: number;
    dawryCash: number;
    dawryVisa: number;
    systemTotal: number;
    difference: number;
}
export interface SelfReviewEntry {
    linesValue: number;
    adslValue: number;
    devicesValue: number;
    totalCalculated: number;
    matchesBSS: boolean;
    notes: string;
}
export interface ReconciliationEntry {
    id: string;
    date: string;
    vanCode: string;
    location: string;
    governorate: string;
    agentName: string;
    agentId: string;
    bssEmpCode: string;
    bssSessionsCount: number;
    totalLines: number;
    totalADSL: number;
    totalAmount: number;
    mobileCash: number;
    mobileVisa: number;
    mobileExempt: number;
    enteredAmount: number;
    bssAmount: number;
    difference: number;
    status: 'matched' | 'excess' | 'shortage' | 'pending';
    source: 'BSS' | 'MANUAL' | 'VOICE';
    isCumulative10D?: boolean;
    minDate?: string;
    maxDate?: string;
    daysSet?: Set<string>;
}
export interface BSSEntry {
    id: string;
    date: string;
    vanCode: string;
    location: string;
    governorate: string;
    agentId: string;
    agentName: string;
    sessionId: string;
    lines: number;
    adsl: number;
    amount: number;
    cash: number;
    visa: number;
    exempt: number;
    source: 'cairo' | 'delta' | 'upper';
}
export interface EnteredEntry {
    id: string;
    date: string;
    vanCode: string;
    location: string;
    governorate: string;
    agentId: string;
    agentName: string;
    totalLines: number;
    totalADSL: number;
    amount: number;
    mobileCash: number;
    mobileVisa: number;
    mobileExempt: number;
}
export interface ComparisonResult {
    key: string;
    groupBy: string;
    enteredAmount: number;
    bssAmount: number;
    difference: number;
    status: 'matched' | 'excess' | 'shortage';
    enteredLines: number;
    bssLines: number;
    enteredADSL: number;
    bssADSL: number;
    vanCode: string;
    governorate: string;
    agentId: string;
    agentName: string;
}
export interface Discrepancy {
    type: 'missing_in_bss' | 'excess_in_bss' | 'shortage_in_bss' | 'missing_in_entered';
    entered: EnteredEntry | null;
    bss: BSSEntry | null;
    difference?: number;
    severity: 'high' | 'medium' | 'low';
}
export interface DawryEntry {
    id: string;
    date: string;
    day: number;
    muCode: string;
    agentName: string;
    function: string;
    count: number;
    cost: number;
    executorCode: string;
    executorName: string;
    executorCount: number;
    executorValue: number;
    matchesVoiceAmount: boolean;
}
export interface MonthlyReportEntry {
    id: string;
    month: string;
    year: number;
    vanCode: string;
    location: string;
    governorate: string;
    agentId: string;
    agentName: string;
    totalLines: number;
    totalADSL: number;
    totalAmount: number;
    mobileCash: number;
    mobileVisa: number;
    mobileExempt: number;
    dawryCount: number;
    dawryCash: number;
    dawryVisa: number;
    devices: number;
    breakdown: Record<string, number>;
}
export interface HistoricalReportEntry {
    date: string;
    period: 'daily' | 'monthly' | 'yearly';
    groupBy: string;
    totalAmount: number;
    totalLines: number;
    totalADSL: number;
    vansActive: number;
    agentsActive: number;
    groupValue: string;
}
export interface StockItem {
    id: string;
    vanCode: string;
    category: string;
    product: string;
    quantity: number;
    minQuantity: number;
    unit: string;
    unitPrice: number;
    location: string;
    governorate: string;
    lastUpdated: string;
    updatedBy: string;
}
export interface StockTransfer {
    id: string;
    fromVanCode: string;
    toVanCode: string;
    items: StockTransferItem[];
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    requestedAt: string;
    approvedAt?: string;
    requestedBy: string;
    approvedBy?: string;
}
export interface StockTransferItem {
    product: string;
    quantity: number;
}
export type LeaveType = 'annual' | 'sick' | 'casual' | 'emergency' | 'maternity' | 'paternity' | 'unpaid';
export interface LeaveRequest {
    id: string;
    agentId: string;
    agentName: string;
    vanCode: string;
    governorate: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    requestedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    notes?: string;
}
export interface LeaveBalance {
    agentId: string;
    agentName: string;
    vanCode: string;
    balances: Record<LeaveType, {
        total: number;
        used: number;
        remaining: number;
    }>;
    updatedAt: string;
}
export interface WhatsAppReport {
    id: string;
    date: string;
    vanCode: string;
    groupName: string;
    rawText: string;
    images?: string[];
    parsedData: WhatsAppParsedData;
    extractedAt: string;
    verified: boolean;
}
export interface WhatsAppParsedData {
    vanCode: string;
    date: string;
    location: string;
    sales: {
        landRequests: number;
        landContracts: number;
        netContracts: number;
        weLife: number;
        mobile: number;
        weGold: number;
        swap: number;
        mnp: number;
        esim: number;
        wallet: number;
    };
    devices: {
        weAir: number;
        ont: number;
        cpe: number;
        mifi: number;
    };
    amounts: {
        cashTotal: number;
        cashSafeBankName: string;
        visaTotal: number;
        visaMobileBranch: string;
        dawryCash: number;
        dawryVisa: number;
        totalMobile: number;
        barz: number;
        totalSupply: number;
    };
    agents: WhatsAppAgentDetail[];
    remainingStock: Record<string, number>;
    notes: string;
}
export interface WhatsAppAgentDetail {
    name: string;
    lines: number;
    contracts: {
        landRequests: number;
        landContracts: number;
        netContracts: number;
        details: string[];
    };
    devices: {
        weAir: number;
        ont: number;
        cpe: number;
        mifi: number;
    };
    specialLines: {
        students: number;
        takaful: number;
        mnp: number;
        gas: number;
    };
    cashAmount: number;
    visaAmount: number;
    safeBankName?: string;
    visaBranch?: string;
}
export interface WhatsAppImageData {
    base64: string;
    mimeType: string;
    description?: string;
}
export interface AutomaticSheetRow {
    date: string;
    month: string;
    city: string;
    location: string;
    unitNo: string;
    totalLines: number;
    regularLines: number;
    students: number;
    takaful: number;
    mnp: number;
    gas: number;
    net: number;
    adsl: number;
    mobileAmount: number;
    voiceBills: number;
    voiceAmount: number;
    oss: number;
    wePay: number;
    barz: number;
    total: number;
    systemAmount: number;
    supplyStatus: 'توريد مطابق' | 'توريد زياده' | 'توريد ناقص';
    treasurySupply: string;
    isMissingCash: boolean;
    isMissingVisa: boolean;
    isMissingDawry: boolean;
}
export interface FinalSheetRow extends AutomaticSheetRow {
    cashCompleted: number;
    cashSafeBankName: string;
    visaCompleted: number;
    visaMobileBranch: string;
    dawryCashCompleted: number;
    dawryVisaCompleted: number;
    mobileAmountFinal: number;
    barzFinal: number;
    totalFinal: number;
    whatsappVerified: boolean;
    whatsappVerifiedAt: string;
    whatsappSource: 'text' | 'image' | 'both';
}
export interface ReconciliationTripleMatch {
    vanCode: string;
    date: string;
    location: string;
    governorate: string;
    agentName: string;
    agentId: string;
    systemAmount: number;
    systemCash: number;
    systemVisa: number;
    whatsappCash: number;
    whatsappVisa: number;
    whatsappDawryCash: number;
    whatsappDawryVisa: number;
    whatsappTotal: number;
    whatsappVerified: boolean;
    finalSheetCash: number;
    finalSheetVisa: number;
    finalSheetTotal: number;
    finalSheetBarz: number;
    finalSheetMobileAmount: number;
    finalSheetSystem: number;
    supplyStatus: 'توريد مطابق' | 'توريد زياده' | 'توريد ناقص';
    treasurySupply: string;
    dawryVoiceAmount: number;
    dawryMatched: boolean;
    systemVsWhatsApp: 'matched' | 'shortage' | 'excess';
    systemDiff: number;
    finalSheetVsWhatsApp: 'matched' | 'shortage' | 'excess';
    finalSheetDiff: number;
    dawryMatch: 'matched' | 'shortage' | 'excess';
    dawryDiff: number;
    status: 'fully_matched' | 'cash_shortage' | 'visa_shortage' | 'cash_excess' | 'visa_excess' | 'dawry_mismatch' | 'pending_verification';
    notes: string;
}
export interface CashVisaBreakdown {
    vanCode: string;
    date: string;
    cashAmount: number;
    cashSafeBank: string;
    visaAmount: number;
    visaMobileBranch: string;
    dawryCash: number;
    dawryVisa: number;
    totalCashVisa: number;
    barz: number;
    mobileAmountFinal: number;
    supplyStatus: 'توريد مطابق' | 'توريد زياده' | 'توريد ناقص';
    treasurySupply: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface LoginResponse {
    user: WEUser;
    token: string;
    forcePinChange?: boolean;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface DateRangeFilter {
    dateFrom?: string;
    dateTo?: string;
    period?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}
export interface VanFilter {
    vanCode?: string;
    governorate?: string;
    sector?: 'cairo' | 'delta' | 'upper';
}
export interface AgentFilter {
    agentId?: string;
    role?: UserRole;
    vanCode?: string;
}
export interface FinanceFilters extends DateRangeFilter, VanFilter {
    groupBy?: 'van' | 'agent' | 'governorate' | 'date';
}
export interface MonthlyReportFilters extends DateRangeFilter, VanFilter {
    agentId?: string;
    month?: string;
    year?: number;
}
export interface MasterPreviewFilters extends DateRangeFilter, VanFilter {
    status?: 'all' | 'matched' | 'excess' | 'shortage';
}
export interface ReconciliationFilters extends DateRangeFilter, VanFilter {
    basis?: 'AUTO_BSS' | 'MANUAL' | 'VOICE';
    mode?: 'DAILY' | 'CUMULATIVE_10D';
}
export interface HistoricalFilters extends Omit<DateRangeFilter, 'period'>, VanFilter {
    period?: 'daily' | 'monthly' | 'yearly' | 'today' | 'week' | 'quarter' | 'year' | 'custom';
    groupBy?: 'van' | 'agent' | 'governorate' | 'category';
}
export interface DawryFilters extends DateRangeFilter, VanFilter {
    day?: number;
    muCode?: string;
}
//# sourceMappingURL=index.d.ts.map