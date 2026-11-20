// WE Mobile Units - Utility Functions
import { format, parseISO, startOfDay, endOfDay, subDays } from 'date-fns';
import { arSA } from 'date-fns/locale';
// ==================== Date Utilities ====================
export function formatDate(date, pattern = 'yyyy-MM-dd') {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern, { locale: arSA });
}
export function formatDateTime(date, pattern = 'yyyy-MM-dd HH:mm') {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern, { locale: arSA });
}
export function formatArabicDate(date) {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'EEEE، d MMMM yyyy', { locale: arSA });
}
export function parseArabicDate(dateStr) {
    try {
        // Handle formats like "1/11/2026" or "1-Nov-2026"
        if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        }
        if (dateStr.includes('-')) {
            return parseISO(dateStr);
        }
        return null;
    }
    catch {
        return null;
    }
}
export function getDateRange(period) {
    const now = new Date();
    const today = startOfDay(now);
    switch (period) {
        case 'today':
            return { from: today, to: endOfDay(now) };
        case 'week':
            return { from: subDays(today, 7), to: endOfDay(now) };
        case 'month':
            return { from: subDays(today, 30), to: endOfDay(now) };
        case 'quarter':
            return { from: subDays(today, 90), to: endOfDay(now) };
        case 'year':
            return { from: subDays(today, 365), to: endOfDay(now) };
    }
}
export function isDateInRange(date, from, to) {
    const d = typeof date === 'string' ? parseISO(date) : date;
    const f = from ? (typeof from === 'string' ? parseISO(from) : from) : null;
    const t = to ? (typeof to === 'string' ? parseISO(to) : to) : null;
    if (f && d < f)
        return false;
    if (t && d > t)
        return false;
    return true;
}
// ==================== Number Formatting ====================
export function formatNumber(num, decimals = 0) {
    if (isNaN(num))
        return '0';
    return new Intl.NumberFormat('ar-EG', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
}
export function formatCurrency(amount, currency = 'EGP') {
    if (isNaN(amount))
        return '0 ج.م';
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}
export function parseNumber(value) {
    if (typeof value === 'number')
        return value;
    const cleaned = value.replace(/[،,]/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}
// ==================== String Utilities ====================
export function normalizeArabicText(text) {
    return text
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ة]/g, 'ه')
        .replace(/[ى]/g, 'ي')
        .replace(/[ٱ]/g, 'ا')
        .trim();
}
export function cleanPhoneNumber(phone) {
    return phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
}
export function formatPhoneNumber(phone) {
    const cleaned = cleanPhoneNumber(phone);
    if (cleaned.length === 11 && cleaned.startsWith('01')) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return phone;
}
export function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength - 3) + '...';
}
export function slugify(text) {
    return normalizeArabicText(text)
        .toLowerCase()
        .replace(/[^a-z0-9؀-ۿ]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
// ==================== Validation ====================
export function validateEgyptianNationalId(id) {
    // 14 digits, first digit 2 or 3 (century), valid date, valid governorate code
    if (!/^[23]\d{13}$/.test(id))
        return false;
    const century = id[0] === '2' ? 1900 : 2000;
    const year = century + parseInt(id.slice(1, 3), 10);
    const month = parseInt(id.slice(3, 5), 10);
    const day = parseInt(id.slice(5, 7), 10);
    const govCode = parseInt(id.slice(7, 9), 10);
    // Validate date
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return false;
    }
    // Valid governorate codes (1-35 for Egypt)
    if (govCode < 1 || govCode > 35)
        return false;
    return true;
}
export function validateEmployeeId(id) {
    // Employee ID: 6 digits or 'admin'
    return /^\d{6}$/.test(id) || id.toLowerCase() === 'admin';
}
export function validatePIN(pin) {
    if (!pin)
        return { valid: false, error: 'PIN مطلوب' };
    if (pin.length < 4)
        return { valid: false, error: 'PIN يجب أن يكون 4 أرقام على الأقل' };
    if (pin.length > 16)
        return { valid: false, error: 'PIN طويل جداً (أقصى 16 رقم)' };
    if (!/^\d+$/.test(pin))
        return { valid: false, error: 'PIN يجب أن يحتوي على أرقام فقط' };
    return { valid: true };
}
export function validateVanCode(code) {
    return /^\d{3,4}$/.test(code);
}
// ==================== Export/Import Utilities ====================
export function arrayToCSV(data, columns) {
    const headers = columns.map(c => c.label).join(',');
    const rows = data.map(row => columns.map(c => {
        const value = row[c.key];
        if (value === null || value === undefined)
            return '';
        if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
    }).join(','));
    return [headers, ...rows].join('\n');
}
export function downloadCSV(content, filename) {
    if (typeof document === 'undefined')
        return;
    const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}
export function downloadJSON(data, filename) {
    if (typeof document === 'undefined')
        return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}
// ==================== Color Utilities ====================
export function getRoleColor(role) {
    const colors = {
        ADMIN: '#7C3AED', // Purple
        SUPERVISOR: '#06B6D4', // Cyan
        FINANCE: '#10B981', // Emerald
        STOCK_MANAGER: '#F59E0B', // Amber
        HR: '#EC4899', // Pink
        AGENT: '#3B82F6', // Blue
        SELLER: '#6366F1', // Indigo
    };
    return colors[role] || '#6B7280'; // Gray
}
export function getStatusColor(status) {
    const colors = {
        matched: '#10B981', // Green
        excess: '#F59E0B', // Amber
        shortage: '#EF4444', // Red
        pending: '#6B7280', // Gray
        draft: '#6B7280',
        submitted: '#3B82F6', // Blue
        approved: '#10B981', // Green
        rejected: '#EF4444', // Red
        active: '#10B981',
        maintenance: '#F59E0B',
        inactive: '#6B7280',
    };
    return colors[status] || '#6B7280';
}
export function getSupplyStatusColor(status) {
    const colors = {
        'توريد مطابق': '#10B981',
        'توريد زياده': '#F59E0B',
        'توريد ناقص': '#EF4444',
    };
    return colors[status] || '#6B7280';
}
// ==================== Debounce/Throttle ====================
export function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
export function throttle(fn, limit) {
    let inThrottle = false;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
// ==================== Local Storage Helpers ====================
export function getFromStorage(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    }
    catch {
        return defaultValue;
    }
}
export function setToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch {
        // Ignore storage errors (quota exceeded, etc.)
    }
}
export function removeFromStorage(key) {
    localStorage.removeItem(key);
}
// ==================== URL Helpers ====================
export function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value));
        }
    });
    return searchParams.toString();
}
export function parseQueryString(query) {
    const params = new URLSearchParams(query);
    const result = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}
// ==================== WhatsApp Parser Helpers ====================
export function parseWhatsAppReport(text) {
    // This is a placeholder - the actual parser would be more complex
    // and would be implemented in the whatsapp.ts route
    return {
        rawText: text,
        parsed: false,
    };
}
// ==================== MU Code Mapping ====================
export const MU_CODE_TO_AGENT = {
    'MU0001': 'أحمد مرسى وهبه مرسى',
    'MU0002': 'عادل خميس شاكر عبد الحى',
    'MU0003': 'أحمد عطيه حسن محمد',
    'MU0004': 'محمد ممدوح مصطفى رأفت محمد',
    'MU0005': 'نادر جمال محمود محمد على',
    'MU0006': 'محمد أحمد عبد الخالق إبراهيم',
    'MU0007': 'محمد أحمد أدم حسين',
    'MU0008': 'أحمد محمد منصور أبو العنيين',
    'MU0009': 'أحمد عبد المحسن عبد الحميد',
    'MU0010': 'اسلام جابر جمعه على جمعه',
    'MU0011': 'أحمد عادل على رفاعى',
    'MU0012': 'أشرف محمد حمدى حبشى حسين',
    'MU0013': 'حسن سامى حسن أحمد الملا',
    'MU0014': 'عبد الرحمن أسامه محمد محمد',
    'MU0015': 'أحمد سامى ذكى على الوزيرى',
    'MU0017': 'عمر عبدالرحمن جاد ابراهيم',
    'MU0018': 'أحمد سعيد يوسف محمد',
    'MU0019': 'فكرى محمد محمد الجبالى شحاته',
    'MU0020': 'وسام ممدوح حسن يوسف',
    'MU0021': 'مصطفى عبد الخالق محمد عبد الرازق',
    'MU0022': 'على عثمان حجازى كامل',
    'MU0023': 'على لطفى محمد متولى',
    'MU0024': 'محمد سالم محمد مصطفى',
    'MU0025': 'مهند محمد رمضان قرنى',
    'MU0026': 'خالد جمعه سلمان رمضان عروز',
    'MU0027': 'محمد المغازى عبد الحليم المغازى',
    'MU0028': 'احمد ابو زيد صالح أبو زيد',
    'MU0029': 'محمد رمزى جعفر إبراهيم',
    'MU0030': 'عماد إيهاب فكتور تادروس',
    'MU0031': 'مصطفى عطيه حسن مصطفى',
    'MU0032': 'أحمد عصام محمود سيد عبده',
    'MU0033': 'محمد أحمد بدر محمد جعفر',
    'MU0034': 'حسن يوسف حسن عيسى',
    'MU0035': 'محمود جمال محمود حماد',
    'MU0036': 'كيرلس ثروت شفيق متياس',
    'MU0037': 'باسم حسن مليجي حسين',
    'MU0038': 'سعيد محمد الشافعى عطاء محمد',
    'MU0039': 'محمود حسنى عبد البديع عبد اللطيف',
    'MU0040': 'احمد حسين جمعه علواية',
    'MU0041': 'احمد عبدالقادر محمد السيد',
    'MU0042': 'كريم طارق محمد المهدى',
    'MU0043': 'محمد علاء الدين عبد القادر توفيق',
    'MU0044': 'محمد فتحى أحمد محمد',
    'MU0045': 'معاذ محمد زكريا محمود',
    'MU0046': 'كريم اشرف انيس فرج الله نصر',
    'MU0050': 'عبد الرحمن قاسم محمد رشيدى',
    'MU0051': 'محمد سمير عوض احمد',
    'MU0052': 'عبود عاصم عطيه حسين',
    'MU0053': 'احمد صلاح سليمان يوسف',
    'MU0054': 'عمرو محمد عبد الغنى على',
    'MU0055': 'محمد عماد ممدوح عبد العزيز',
    'MU0056': 'محمد رضوان عبد الصبور',
    'MU0057': 'كيرولس ماهر صموئيل مؤنس',
    'MU0058': 'سامح بولس ناصف ايوب',
    'MU0059': 'شادى سمير نظير ياكين',
    'MU0060': 'خالد الحسيني محمود عثمان',
    'MU0061': 'مهاب عرفة محمد سلامة',
    'MU0062': 'اشرف بخيت محمد عزاز',
    'MU0063': 'احمد عبدالعزيز امين النجار',
    'MU0064': 'احمد سمير امام محروس',
    'MU0065': 'مراد محمد عبدالعزيز السيد',
    'MU0066': 'حسن سعيد محمد احمد جادالله',
    'MU0067': 'هشام سعد عبدالعزيز ابو حسين',
    'MU0068': 'محمد عبدالباقى سليمان ابراهيم',
    'MU0069': 'محمود محمد احمد محمد',
    'MU0070': 'محمد عصام عبدالرحيم عبدالرحيم',
    'MU0071': 'محمد حسني حلمي احمد',
    'MU0072': 'احمد اشرف احمد محمد رزق',
    'MU0073': 'محمد عاطف محمد عواد',
    'MU0074': 'معتز عاطف محمود مصطفي',
    'MU0075': 'مسعود انيس مسعود خليفه',
    'MU0076': 'محمد رجب محمد عطية',
    'MU0077': 'احمد عبداللطيف فهيم عبداللطيف',
    'MU0078': 'احمد عماد صلاح عبدالعظيم',
    'MU0079': 'محمد سمير محروس محمد',
    'MU0080': 'مصطفى سعد كامل سعد',
    'MU0081': 'عمر محمد محمد محمد',
    'MU0082': 'مصطفى عبد الهادى محمد عمر',
    'MU0083': 'بلال محمد عبدالهادي',
    'MU0084': 'اسلام منير سيد احمد',
    'MU0085': 'احمد محمد عبد المنعم حسين',
    'MU0086': 'احمد محمود محمد عبدالواحد',
    'MU0087': 'ماهر ابراهيم سعيد شهاب الدين',
    'MU0088': 'محمد محمود توفيق عبدالمقصود',
    'MU0089': 'محمد السيد طه محمد',
    'MU0090': 'عبدالله جمعه عبدالله السيد',
    'MU0091': 'محمد رمضان محمود عبد الرحيم',
    'MU0092': 'شريف طلعت الراعى كساب',
    'MU0093': 'أحمد ماهر أحمد عبد ربه',
    'MU0094': 'محمد محمد السعيد محمد',
    'MU0095': 'محمد احمد حسنين البلشي',
    'MU0096': 'إسلام عبد الغفار حامد',
    'MU0097': 'إسلام رمضان جمعه إبراهيم',
    'MU0098': 'محمود نظيف محمد نظيف',
    'MU0099': 'إبراهيم احمد فؤاد إبراهيم',
    'MU0100': 'عبد الله نصر الدين احمد محمد',
    'MU0101': 'محمد اسماعيل حسني حسين',
    'MU0103': 'احمد عيد محمد عبدالغني',
    // Additional from sheet 2+
    'MU0108': 'مصطفي محمد نوبي محمود',
    'MU0111': 'إبراهيم صبحي إبراهيم القاضي',
    'MU0112': 'احمد مصطفى حامد الشحات',
    'MU0131': 'احمد سمير حسين نقودي',
    'MU0143': 'عز الدين محمد يحيى اسماعيل',
};
export function getAgentNameFromMUCode(muCode) {
    return MU_CODE_TO_AGENT[muCode?.toUpperCase()];
}
