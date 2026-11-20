// WE Mobile Units - Shared Type Definitions

// ==================== USER & AUTH ====================
export type UserRole =
  | 'ADMIN'
  | 'SUPERVISOR'
  | 'FINANCE'
  | 'STOCK_MANAGER'
  | 'HR'
  | 'AGENT'
  | 'SELLER';

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

export type ResourceType =
  | 'reconciliation'
  | 'finance'
  | 'monthly'
  | 'historical'
  | 'dailyEntry'
  | 'mySales'
  | 'myLeaves'
  | 'vanSchedule'
  | 'stock'
  | 'allLeaves'
  | 'vans'
  | 'categories'
  | 'users'
  | 'reports'
  | 'whatsapp';

// ==================== AGENT & VAN ====================
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

// ==================== DAILY ENTRY (بيان يومي) ====================
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
  // Mobile Lines
  mobileLines: MobileLinesEntry;
  // ADSL
  adsl: ADSLEntry;
  // Fixed Lines
  fixedLines: FixedLinesEntry;
  // Devices
  devices: DevicesEntry;
  // Amounts
  amounts: AmountsEntry;
  // Self Review
  selfReview: SelfReviewEntry;
  // Signature
  signature?: string;
}

export interface MobileLinesEntry {
  // WE Club / Prepaid
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
  // Special lines
  students: SimTypeEntry;
  studentsEsim: SimTypeEntry;
  gas: SimTypeEntry;
  gasEsim: SimTypeEntry;
  initiative: SimTypeEntry;
  initiativeEsim: SimTypeEntry;
  // Totals
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
  // Router types
  routerHuawei: number;
  routerZyxel: number;
  routerNokia: number;
  routerTpLink: number;
  // Fixed contracts
  fixedContracts: number;
  // Totals
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
  // BSS Cash
  bssCash: number;
  // BSS Visa
  bssVisa: number;
  // BSS Exempt
  bssExempt: number;
  // Mobile Cash
  mobileCash: number;
  // Mobile Visa
  mobileVisa: number;
  // Mobile Exempt
  mobileExempt: number;
  // Dawry
  dawryCount: number;
  dawryCash: number;
  dawryVisa: number;
  // System calculated
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

// ==================== RECONCILIATION ====================
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
  // Aggregated data
  totalLines: number;
  totalADSL: number;
  totalAmount: number;
  mobileCash: number;
  mobileVisa: number;
  mobileExempt: number;
  // Comparison
  enteredAmount: number;
  bssAmount: number;
  difference: number;
  status: 'matched' | 'excess' | 'shortage' | 'pending';
  source: 'BSS' | 'MANUAL' | 'VOICE';
  // 10-day cumulative
  isCumulative10D?: boolean;
  minDate?: string;
  maxDate?: string;
  daysSet?: Set<string>;
}

// ==================== FINANCE / BSS ====================
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

// ==================== DAILY ENTRY (for Finance) ====================
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

// ==================== FINANCE COMPARISON ====================
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

// ==================== DAWRY (الدوري) ====================
export interface DawryEntry {
  id: string;
  date: string;
  day: number; // 1-10
  muCode: string; // MU0001, MU0002, etc.
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

// ==================== REPORTS ====================
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

// ==================== STOCK ====================
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

// ==================== LEAVES ====================
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
  balances: Record<LeaveType, { total: number; used: number; remaining: number }>;
  updatedAt: string;
}

// ==================== WHATSAPP ====================
export interface WhatsAppReport {
  id: string;
  date: string;
  vanCode: string;
  groupName: string;
  rawText: string;
  images?: string[]; // Base64 encoded images for OCR verification
  parsedData: WhatsAppParsedData;
  extractedAt: string;
  verified: boolean; // Text + Images cross-verified
}

export interface WhatsAppParsedData {
  // Header
  vanCode: string;
  date: string;
  location: string;
  // Section 1: Sales
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
  // Section 2: Devices
  devices: {
    weAir: number;
    ont: number;
    cpe: number;
    mifi: number;
  };
  // Section 3: Amounts - Cash/Visa breakdown per van
  amounts: {
    // Cash breakdown (First row in final sheet - Cash + Safe/Bank name)
    cashTotal: number;
    cashSafeBankName: string; // e.g., "شبرا مصر", "أكتوبر", "المعادي"
    // Visa breakdown (Second row - Visa + "محمول" + branch)
    visaTotal: number;
    visaMobileBranch: string; // e.g., "محمول (القبة)", "محمول"
    // Dawry breakdown
    dawryCash: number;
    dawryVisa: number;
    // Totals
    totalMobile: number; // Column N - Mobile Amount
    barz: number; // Column S - البارز (surplus)
    totalSupply: number; // Total supplied
  };
  // Section 4: Detailed per agent
  agents: WhatsAppAgentDetail[];
  // Section 5: Remaining stock
  remainingStock: Record<string, number>;
  // Notes
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
  // Cash/Visa per agent
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

// ==================== AUTOMATIC SHEET (from Google Apps Script) ====================
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
  barz: number; // Column S - البارز
  total: number;
  systemAmount: number; // Column "النظام" - Trans Am EPG
  supplyStatus: 'توريد مطابق' | 'توريد زياده' | 'توريد ناقص';
  treasurySupply: string; // Column "توريد الخزينة" - e.g., "توريد بالبنك يوم 3/11", "فيزا محمول(القبه)", "شبرا مصر"
  // Missing data flags
  isMissingCash: boolean;
  isMissingVisa: boolean;
  isMissingDawry: boolean;
}

// ==================== FINAL SHEET (Complete - Auto + WhatsApp) ====================
export interface FinalSheetRow extends AutomaticSheetRow {
  // Completed from WhatsApp
  cashCompleted: number; // Cash from WhatsApp (First row - Cash + Safe/Bank)
  cashSafeBankName: string; // e.g., "شبرا مصر", "أكتوبر", "المعادي"
  visaCompleted: number; // Visa from WhatsApp (Second row - Visa + "محمول")
  visaMobileBranch: string; // e.g., "محمول (القبة)", "محمول"
  dawryCashCompleted: number;
  dawryVisaCompleted: number;
  // Completed totals
  mobileAmountFinal: number; // Column N - Mobile Amount (Column N + Column S barz)
  barzFinal: number; // Column S - البارز
  totalFinal: number; // Total final amount
  // WhatsApp verification
  whatsappVerified: boolean;
  whatsappVerifiedAt: string;
  whatsappSource: 'text' | 'image' | 'both';
}

// ==================== RECONCILIATION ====================
export interface ReconciliationTripleMatch {
  vanCode: string;
  date: string;
  location: string;
  governorate: string;
  agentName: string;
  agentId: string;

  // Source 1: System (Trans Am EPG from Cash Box)
  systemAmount: number; // Trans Am EPG from Cash Box
  systemCash: number;
  systemVisa: number;

  // Source 2: WhatsApp (Actual deposited - THE TRUTH)
  whatsappCash: number;
  whatsappVisa: number;
  whatsappDawryCash: number;
  whatsappDawryVisa: number;
  whatsappTotal: number; // Actual deposited
  whatsappVerified: boolean;

  // Source 3: Final Sheet (Reference)
  finalSheetCash: number; // First row cash + safe/bank
  finalSheetVisa: number; // Second row visa + mobile
  finalSheetTotal: number; // Mobile Amount (Column N)
  finalSheetBarz: number; // Column S - البارز
  finalSheetMobileAmount: number; // Column N
  finalSheetSystem: number; // System column
  supplyStatus: 'توريد مطابق' | 'توريد زياده' | 'توريد ناقص';
  treasurySupply: string;

  // Source 4: Dawry (Voice Amount matching)
  dawryVoiceAmount: number; // From الدوري.xlsx
  dawryMatched: boolean;

  // Triple Match Results
  systemVsWhatsApp: 'matched' | 'shortage' | 'excess'; // System vs Actual deposited
  systemDiff: number; // System - WhatsApp
  finalSheetVsWhatsApp: 'matched' | 'shortage' | 'excess'; // Final Sheet vs Actual
  finalSheetDiff: number; // Final Sheet - WhatsApp
  dawryMatch: 'matched' | 'shortage' | 'excess';
  dawryDiff: number;

  // Final Status
  status: 'fully_matched' | 'cash_shortage' | 'visa_shortage' | 'cash_excess' | 'visa_excess' | 'dawry_mismatch' | 'pending_verification';
  notes: string;
}

// ==================== CASH/VISA BREAKDOWN ====================
export interface CashVisaBreakdown {
  vanCode: string;
  date: string;
  // First Row - Cash
  cashAmount: number;
  cashSafeBank: string; // "شبرا مصر", "أكتوبر", "المعادي", "بنك..."
  // Second Row - Visa
  visaAmount: number;
  visaMobileBranch: string; // "محمول (القبة)", "محمول", "فيزا محمول(القبه)"
  // Dawry
  dawryCash: number;
  dawryVisa: number;
  // Totals
  totalCashVisa: number; // Cash + Visa
  barz: number; // Column S - البارز
  mobileAmountFinal: number; // Column N (Cash + Visa + Barz)
  supplyStatus: 'توريد مطابق' | 'توريد زياده' | 'توريد ناقص';
  treasurySupply: string; // "توريد بالبنك يوم X", "فيزا محمول(القبه)", "شبرا مصر"
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

// ==================== FILTERS ====================
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

// Extended filter types for specific pages
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