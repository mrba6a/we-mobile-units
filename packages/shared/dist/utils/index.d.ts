export declare function formatDate(date: string | Date, pattern?: string): string;
export declare function formatDateTime(date: string | Date, pattern?: string): string;
export declare function formatArabicDate(date: string | Date): string;
export declare function parseArabicDate(dateStr: string): Date | null;
export declare function getDateRange(period: 'today' | 'week' | 'month' | 'quarter' | 'year'): {
    from: Date;
    to: Date;
};
export declare function isDateInRange(date: string | Date, from?: string | Date, to?: string | Date): boolean;
export declare function formatNumber(num: number, decimals?: number): string;
export declare function formatCurrency(amount: number, currency?: string): string;
export declare function parseNumber(value: string | number): number;
export declare function normalizeArabicText(text: string): string;
export declare function cleanPhoneNumber(phone: string): string;
export declare function formatPhoneNumber(phone: string): string;
export declare function truncate(text: string, maxLength: number): string;
export declare function slugify(text: string): string;
export declare function validateEgyptianNationalId(id: string): boolean;
export declare function validateEmployeeId(id: string): boolean;
export declare function validatePIN(pin: string): {
    valid: boolean;
    error?: string;
};
export declare function validateVanCode(code: string): boolean;
export declare function arrayToCSV<T extends Record<string, any>>(data: T[], columns: {
    key: keyof T;
    label: string;
}[]): string;
export declare function downloadCSV(content: string, filename: string): void;
export declare function downloadJSON(data: any, filename: string): void;
export declare function getRoleColor(role: string): string;
export declare function getStatusColor(status: string): string;
export declare function getSupplyStatusColor(status: string): string;
export declare function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void;
export declare function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void;
export declare function getFromStorage<T>(key: string, defaultValue: T): T;
export declare function setToStorage<T>(key: string, value: T): void;
export declare function removeFromStorage(key: string): void;
export declare function buildQueryString(params: Record<string, any>): string;
export declare function parseQueryString(query: string): Record<string, string>;
export declare function parseWhatsAppReport(text: string): any;
export declare const MU_CODE_TO_AGENT: Record<string, string>;
export declare function getAgentNameFromMUCode(muCode: string): string | undefined;
//# sourceMappingURL=index.d.ts.map