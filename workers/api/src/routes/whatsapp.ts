// WE Mobile Units - WhatsApp Parser Routes
import { Hono } from 'hono';
import { z } from 'zod';
import { asyncHandler, validateBody } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

type Bindings = {
  CACHE: KVNamespace;
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  REPORTS_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
};

const whatsapp = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const importSchema = z.object({
  groupName: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rawText: z.string().min(50, 'نص التقرير قصير جداً'),
  images: z.array(z.object({
    base64: z.string(),
    mimeType: z.string(),
    description: z.string().optional(),
  })).optional(),
  source: z.enum(['manual', 'file', 'api']).default('manual'),
});

const parseSchema = z.object({
  rawText: z.string().min(50),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  vanCode: z.string().optional(),
  images: z.array(z.object({
    base64: z.string(),
    mimeType: z.string(),
    description: z.string().optional(),
  })).optional(),
});

const verifySchema = z.object({
  textData: z.object({}),
  imageData: z.array(z.object({})).optional(),
});

const whatsapp = new Hono<{ Bindings: Bindings }>();

// POST /api/whatsapp/import - Import WhatsApp report with text + images
whatsapp.post(
  '/import',
  requirePermission('whatsapp', 'write'),
  validateBody(importSchema),
  asyncHandler(async (c) => {
    const { groupName, date, rawText, images, source } = c.get('validatedBody');
    const user = c.get('user');

    // Parse the WhatsApp text
    const parsed = parseWhatsAppReport(rawText, date);

    if (!parsed.vanCode) {
      return c.json({ success: false, error: 'تعذر استخراج كود الوحدة من التقرير' }, 400);
    }

    // If images provided, run OCR verification
    let verified = false;
    let imageVerification: any = null;
    if (images && images.length > 0) {
      imageVerification = await verifyWithImages(rawText, images);
      verified = imageVerification.matched;
    }

    // Create report record
    const report = {
      id: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date,
      groupName: groupName || parsed.groupName || `Group_${parsed.vanCode}`,
      vanCode: parsed.vanCode,
      location: parsed.location,
      rawText,
      images: images?.map(img => img.base64) || [],
      parsedData: {
        ...parsed,
        verified,
        verifiedAt: new Date().toISOString(),
      },
      importedAt: new Date().toISOString(),
      importedBy: user.id,
      source,
      verified,
    };

    // TODO: Save to Apps Script /sheets
    // TODO: Update Final Sheet with WhatsApp data
    // await updateFinalSheetWithWhatsApp(c.env, report);

    return c.json({ success: true, data: report });
  })
);

// POST /api/whatsapp/parse - Parse WhatsApp text without saving
whatsapp.post(
  '/parse',
  requirePermission('whatsapp', 'read'),
  validateBody(parseSchema),
  asyncHandler(async (c) => {
    const { rawText, date, vanCode, images } = c.get('validatedBody');

    const parsed = parseWhatsAppReport(rawText, date, vanCode);

    let verified = false;
    let imageVerification = null;
    if (images && images.length > 0) {
      imageVerification = await verifyWithImages(rawText, images);
      verified = imageVerification.matched;
    }

    return c.json({
      success: true,
      data: {
        ...parsed,
        verified,
        verifiedAt: new Date().toISOString(),
        imageVerification,
      },
    });
  })
);

// POST /api/whatsapp/verify - Cross-verify text with images
whatsapp.post(
  '/verify',
  requirePermission('whatsapp', 'read'),
  validateBody(verifySchema),
  asyncHandler(async (c) => {
    const { textData, imageData } = c.get('validatedBody');

    // This would use OCR to extract text from images and compare with textData
    // For now, return mock verification
    const verification = await verifyWithImages(
      JSON.stringify(textData),
      imageData || []
    );

    return c.json({ success: true, data: verification });
  })
);

// GET /api/whatsapp/reports - List imported WhatsApp reports
whatsapp.get(
  '/reports',
  requirePermission('whatsapp', 'read'),
  asyncHandler(async (c) => {
    const dateFrom = c.req.query('dateFrom');
    const dateTo = c.req.query('dateTo');
    const vanCode = c.req.query('vanCode');
    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '50');

    // TODO: Fetch from Apps Script or cache
    const mockData = generateMockWhatsAppReports();

    let filtered = mockData;
    if (dateFrom) filtered = filtered.filter(d => d.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(d => d.date <= dateTo);
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return c.json({
      success: true,
      data: paginated,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  })
);

// GET /api/whatsapp/stats - WhatsApp import statistics
whatsapp.get(
  '/stats',
  requirePermission('whatsapp', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode } = c.req.query();

    return c.json({
      success: true,
      data: {
        period: { from: dateFrom || '2026-11-01', to: dateTo || '2026-11-10' },
        totalReports: 330,
        parsedSuccessfully: 315,
        verifiedWithImages: 280,
        failedToParse: 15,
        byVan: [
          { vanCode: '231', reports: 12, parsed: 12, verified: 11 },
          { vanCode: '582', reports: 10, parsed: 10, verified: 10 },
          { vanCode: '825', reports: 10, parsed: 9, verified: 9 },
          { vanCode: '2348', reports: 10, parsed: 10, verified: 10 },
        ],
        commonErrors: [
          { error: 'كود الوحدة غير واضح', count: 8 },
          { error: 'تنسيق التاريخ غير صحيح', count: 4 },
          { error: 'نص التقرير غير مكتمل', count: 3 },
        ],
      },
    });
  })
);

// ==================== WhatsApp Parser Functions ====================

function parseWhatsAppReport(rawText: string, date: string, forcedVanCode?: string): any {
  const result: any = {
    vanCode: forcedVanCode || null,
    groupName: null,
    date,
    location: null,
    sales: {
      landRequests: 0,
      landContracts: 0,
      netContracts: 0,
      weLife: 0,
      mobile: 0,
      weGold: 0,
      swap: 0,
      mnp: 0,
      esim: 0,
      wallet: 0,
    },
    devices: {
      weAir: 0,
      ont: 0,
      cpe: 0,
      mifi: 0,
    },
    amounts: {
      cashTotal: 0,
      cashSafeBankName: '',
      visaTotal: 0,
      visaMobileBranch: '',
      dawryCash: 0,
      dawryVisa: 0,
      totalMobile: 0,
      barz: 0,
      totalSupply: 0,
    },
    agents: [],
    remainingStock: {},
    notes: '',
  };

  // Extract van code
  const vanCodeMatch = rawText.match(/بيان وحدة\s*[\(（]?\s*(\d+)\s*[\)）]?/);
  if (vanCodeMatch) {
    result.vanCode = vanCodeMatch[1];
  } else if (!forcedVanCode) {
    const altMatch = rawText.match(/وحدة\s*[\(（]?\s*(\d+)\s*[\)）]?/);
    if (altMatch) result.vanCode = altMatch[1];
  }

  // Extract date
  const dateMatch = rawText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  if (dateMatch) {
    result.date = dateMatch[1];
  }

  // Extract location
  const locationMatch = rawText.match(/مكان العمل:\s*([^\n]+)/);
  if (locationMatch) {
    result.location = locationMatch[1].trim();
  }

  // Extract group name
  const groupMatch = rawText.match(/الجروب:\s*[\(（]?\s*([^\)）\n]+)/);
  if (groupMatch) {
    result.groupName = groupMatch[1].trim();
  }

  // Parse sales section
  const salesSection = extractSection(rawText, 'أولًا: بيان التعاقدات والمبيعات', 'ثانيًا:');
  if (salesSection) {
    result.sales.landRequests = extractNumber(salesSection, 'طلب أرضي');
    result.sales.landContracts = extractNumber(salesSection, 'تعاقد أرضي');
    result.sales.netContracts = extractNumber(salesSection, 'تعاقد نت');
    result.sales.weLife = extractNumber(salesSection, 'WE Life');
    result.sales.mobile = extractNumber(salesSection, 'موبايل');
    result.sales.weGold = extractNumber(salesSection, 'WE Gold');
    result.sales.swap = extractNumber(salesSection, 'Swap');
    result.sales.mnp = extractNumber(salesSection, 'MNP');
    result.sales.esim = extractNumber(salesSection, 'E-SIM');
    result.sales.wallet = extractNumber(salesSection, 'Wallet');
  }

  // Parse devices section
  const devicesSection = extractSection(rawText, 'ثانيًا: بيان الأجهزة', 'ثالثًا:');
  if (devicesSection) {
    result.devices.weAir = extractNumber(devicesSection, 'WE Air');
    result.devices.ont = extractNumber(devicesSection, 'ONT');
    result.devices.cpe = extractNumber(devicesSection, 'CPE');
    result.devices.mifi = extractNumber(devicesSection, 'Mi-Fi');
  }

  // Parse amounts section - CRITICAL: Cash vs Visa breakdown
  const amountsSection = extractSection(rawText, 'ثالثًا: بيان المبالغ', 'رابعًا:');
  if (amountsSection) {
    // Total mobile
    result.amounts.totalMobile = extractNumber(amountsSection, 'إجمالي المحمول');
    result.amounts.mobileVisa = extractNumber(amountsSection, 'المحمول فيزا');
    result.amounts.dawryCash = extractNumber(amountsSection, 'دوري كاش');
    result.amounts.mobileCash = extractNumber(amountsSection, 'المحمول كاش');
    result.amounts.barz = extractNumber(amountsSection, 'بارز');
    result.amounts.totalSupply = extractNumber(amountsSection, 'اجمالى توريد');

    // Extract cash safe/bank name from context
    const cashBankMatch = amountsSection.match(/(?:توريد بالبنك|شبرا مصر|أكتوبر|المعادي|خزنة|بنك)\s*[^0-9]*([^\n]+)/);
    if (cashBankMatch) {
      result.amounts.cashSafeBankName = cashBankMatch[1].trim();
    }

    // Extract visa mobile branch
    const visaBranchMatch = amountsSection.match(/(?:محمول|فيزا محمول)\s*[\(（]?([^\)）\n]+)/);
    if (visaBranchMatch) {
      result.amounts.visaMobileBranch = visaBranchMatch[1].trim();
    }
  }

  // Parse detailed agents section
  const detailSection = extractSection(rawText, 'رابعًا: البيان التفصيلي', 'خامسًا:');
  if (detailSection) {
    result.agents = parseAgentDetails(detailSection);
  }

  // Parse remaining stock
  const stockSection = extractSection(rawText, 'خامسًا: المتبقي', 'ملاحظات:');
  if (stockSection) {
    result.remainingStock = parseRemainingStock(stockSection);
  }

  // Parse notes
  const notesMatch = rawText.match(/ملاحظات:\s*([\s\S]*?)(?:━|$)/);
  if (notesMatch) {
    result.notes = notesMatch[1].trim();
  }

  return result;
}

function extractSection(text: string, startMarker: string, endMarker: string): string | null {
  const startIdx = text.indexOf(startMarker);
  if (startIdx === -1) return null;

  const endIdx = text.indexOf(endMarker, startIdx);
  if (endIdx === -1) return text.slice(startIdx + startMarker.length);

  return text.slice(startIdx + startMarker.length, endIdx);
}

function extractNumber(text: string, label: string): number {
  const regex = new RegExp(`${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:?\\s*([\\d,]+)`);
  const match = text.match(regex);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return 0;
}

function parseAgentDetails(text: string): any[] {
  const agents = [];
  const sections = text.split(/[━─]{5,}/);

  for (const section of sections) {
    const lines = section.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) continue;

    let name = '';
    const details: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (!name && !trimmed.match(/^\d/)) {
        name = trimmed;
      } else {
        details.push(trimmed);
      }
    }

    if (name) {
      agents.push({
        name,
        details: details.join(' | '),
        lines: details.filter(d => d.includes('خط')).length,
        contracts: details.filter(d => d.includes('تعاقد')).length,
      });
    }
  }

  return agents;
}

function parseRemainingStock(text: string): Record<string, number> {
  const stock: Record<string, number> = {};
  const lines = text.split('\n');

  for (const line of lines) {
    const match = line.match(/([^:]+):\s*([\d,]+)/);
    if (match) {
      stock[match[1].trim()] = parseInt(match[2].replace(/,/g, ''), 10);
    }
  }

  return stock;
}

// ==================== Image Verification (OCR) ====================

async function verifyWithImages(textData: string, images: any[]): Promise<{
  matched: boolean;
  confidence: number;
  extractedText: string;
  differences: string[];
}> {
  // This would use OCR (Google Vision, AWS Textract, or Tesseract.js)
  // For now, return mock verification
  // In production, integrate with:
  // - Google Cloud Vision API
  // - AWS Textract
  // - Azure Computer Vision
  // - Tesseract.js (client-side)

  const differences: string[] = [];
  let matched = true;
  let confidence = 0.95;

  // Mock: extract text from images and compare with textData
  // For each image, run OCR and compare key numbers
  for (const img of images) {
    // const extractedText = await runOCR(img.base64);
    // Compare extractedText with textData
    // Find differences in key numbers (amounts, van codes, dates)
  }

  // Mock verification result
  if (images.length > 0) {
    // Simulate OCR extraction
    differences.push('مبلغ الكاش في الصورة: 900 vs النص: 900 - مطابق');
    differences.push('مبلغ الفيزا في الصورة: 100 vs النص: 100 - مطابق');
  }

  return {
    matched,
    confidence,
    extractedText: 'نص مستخرج من الصور...',
    differences,
  };
}

// ==================== Final Sheet Builder ====================

export async function buildFinalSheetFromWhatsApp(
  env: any,
  automaticSheetData: any[],
  whatsappReports: any[]
): Promise<any[]> {
  // Merge automatic sheet data with WhatsApp reports
  const finalSheet = [];

  for (const autoRow of automaticSheetData) {
    const vanCode = autoRow.unitNo || autoRow['Unit NO'];
    const date = autoRow.date;

    // Find matching WhatsApp report
    const waReport = whatsappReports.find(r =>
      r.vanCode === vanCode && r.date === date
    );

    const finalRow = { ...autoRow };

    if (waReport && waReport.parsedData) {
      const wa = waReport.parsedData;

      // Complete cash from WhatsApp (First row)
      finalRow.cashCompleted = wa.amounts.cashTotal;
      finalRow.cashSafeBankName = wa.amounts.cashSafeBankName;

      // Complete visa from WhatsApp (Second row)
      finalRow.visaCompleted = wa.amounts.visaTotal;
      finalRow.visaMobileBranch = wa.amounts.visaMobileBranch;

      // Dawry
      finalRow.dawryCashCompleted = wa.amounts.dawryCash;
      finalRow.dawryVisaCompleted = wa.amounts.dawryVisa;

      // Final totals
      finalRow.mobileAmountFinal = wa.amounts.totalMobile + wa.amounts.barz; // Column N + Column S
      finalRow.barzFinal = wa.amounts.barz;
      finalRow.totalFinal = wa.amounts.totalSupply;

      // Verification
      finalRow.whatsappVerified = wa.verified || false;
      finalRow.whatsappVerifiedAt = waReport.verifiedAt;
      finalRow.whatsappSource = waReport.images?.length ? 'both' : 'text';
    }

    finalSheet.push(finalRow);
  }

  return finalSheet;
}

// ==================== Reconciliation Triple Match ====================

export function performTripleMatch(
  systemData: any[],      // From Cash Box (Trans Am EPG)
  whatsappData: any[],    // From WhatsApp (Actual deposited)
  finalSheetData: any[],  // Final Sheet (Auto + WhatsApp)
  dawryData: any[]        // From الدوري.xlsx
): any[] {
  const results = [];

  // Group by vanCode + date
  const groups = new Map<string, any>();

  // Index system data by vanCode+date
  const systemMap = new Map<string, any>();
  for (const s of systemData) {
    const key = `${s.vanCode}_${s.date}`;
    systemMap.set(key, s);
  }

  // Index whatsapp data by vanCode+date
  const whatsappMap = new Map<string, any>();
  for (const w of whatsappData) {
    const key = `${w.vanCode}_${w.date}`;
    whatsappMap.set(key, w);
  }

  // Index final sheet by vanCode+date
  const finalSheetMap = new Map<string, any>();
  for (const f of finalSheetData) {
    const key = `${f.vanCode}_${f.date}`;
    finalSheetMap.set(key, f);
  }

  // Index dawry by vanCode+date (via MU codes)
  const dawryMap = new Map<string, any>();
  for (const d of dawryData) {
    const key = `${d.vanCode}_${d.date}`;
    if (!dawryMap.has(key)) dawryMap.set(key, []);
    dawryMap.get(key).push(d);
  }

  // Get all unique keys
  const allKeys = new Set([
    ...systemMap.keys(),
    ...whatsappMap.keys(),
    ...finalSheetMap.keys(),
    ...dawryMap.keys(),
  ]);

  for (const key of allKeys) {
    const [vanCode, date] = key.split('_');

    const system = systemMap.get(key);
    const whatsapp = whatsappMap.get(key);
    const finalSheet = finalSheetMap.get(key);
    const dawryEntries = dawryMap.get(key) || [];

    // Calculate totals
    const systemAmount = system?.transAmEPG || 0;
    const whatsappCash = whatsapp?.amounts?.cashTotal || 0;
    const whatsappVisa = whatsapp?.amounts?.visaTotal || 0;
    const whatsappTotal = whatsappCash + whatsappVisa;

    const finalSheetCash = finalSheet?.cashCompleted || finalSheet?.cashCompleted || 0;
    const finalSheetVisa = finalSheet?.visaCompleted || finalSheet?.visaCompleted || 0;
    finalSheet?.mobileAmountFinal || finalSheet?.mobileAmountFinal || 0;
    const finalSheetBarz = finalSheet?.barzFinal || finalSheet?.barz || 0;
    finalSheet?.mobileAmountFinal || 0;

    const dawryVoiceAmount = dawryEntries.reduce((sum, d) => sum + (d.cost || 0), 0);

    // Triple Match Logic
    const systemVsWhatsApp = systemAmount === whatsappTotal ? 'matched' :
      systemAmount > whatsappTotal ? 'shortage' : 'excess';
    const systemDiff = systemAmount - whatsappTotal;

    const finalSheetTotal = finalSheetCash + finalSheetVisa;
    const finalSheetVsWhatsApp = finalSheetTotal === whatsappTotal ? 'matched' :
      finalSheetTotal > whatsappTotal ? 'excess' : 'shortage';
    const finalSheetDiff = finalSheetTotal - whatsappTotal;

    const dawryMatched = Math.abs(dawryVoiceAmount - whatsappTotal) <= 50;
    const dawryDiff = dawryVoiceAmount - whatsappTotal;

    // Determine overall status
    let status = 'fully_matched';
    if (systemVsWhatsApp === 'shortage') status = 'cash_shortage';
    else if (systemVsWhatsApp === 'excess') status = 'cash_excess';
    else if (finalSheetVsWhatsApp === 'shortage') status = 'visa_shortage';
    else if (finalSheetVsWhatsApp === 'excess') status = 'visa_excess';
    else if (!dawryMatched) status = 'dawry_mismatch';
    else if (!whatsapp.verified) status = 'pending_verification';

    return {
      vanCode,
      date,
      systemAmount,
      whatsappCash,
      whatsappVisa,
      whatsappTotal,
      finalSheetCash,
      finalSheetVisa,
      finalSheetTotal,
      finalSheetBarz,
      dawryVoiceAmount,
      systemVsWhatsApp,
      systemDiff,
      finalSheetVsWhatsApp,
      finalSheetDiff,
      dawryMatched,
      dawryDiff,
      status,
    };
  }

  return results;
}

export function generateMockWhatsAppReports() {
  const data = [];
  const vans = ['231', '582', '825', '832', '2348', '2349', '2347', '2346', '2357', '1896'];

  for (let i = 0; i < 100; i++) {
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const date = new Date(2026, 10, Math.floor(Math.random() * 10) + 1).toISOString().split('T')[0];
    const parsed = Math.random() > 0.1;
    const verified = parsed && Math.random() > 0.15;

    data.push({
      id: `wa_${i}`,
      date,
      groupName: `مجموعة ${vanCode}`,
      vanCode,
      location: getVanLocation(vanCode),
      rawText: parsed ? 'Parsed report text...' : 'Raw unparsed text...',
      parsedData: parsed ? {
        vanCode,
        location: getVanLocation(vanCode),
        sales: { mobile: Math.floor(Math.random() * 50), landContracts: Math.floor(Math.random() * 5) },
        devices: { weAir: Math.floor(Math.random() * 3), ont: Math.floor(Math.random() * 2) },
        amounts: {
          cashTotal: Math.floor(Math.random() * 50000),
          cashSafeBankName: 'شبرا مصر',
          visaTotal: Math.floor(Math.random() * 20000),
          visaMobileBranch: 'محمول (القبة)',
          totalMobile: Math.floor(Math.random() * 50000),
          barz: Math.floor(Math.random() * 1000),
          totalSupply: Math.floor(Math.random() * 60000),
        },
        agents: [],
        remainingStock: {},
        notes: '',
        verified,
        verifiedAt: new Date().toISOString(),
      } : null,
      importedAt: new Date().toISOString(),
      importedBy: 'system',
      verified,
    });
  }

  return data;
}

function getVanLocation(vanCode: string): string {
  const locations: Record<string, string> = {
    '231': 'شنشور - أشمون',
    '582': 'وصال / الحصري',
    '825': 'دجلة بالمز / كفر بطا',
    '832': 'المكتب',
    '2348': 'الرابعة الناصرية - ثان الرمل',
    '2349': 'سنطيس - دمنهور',
    '2347': 'رمسيس',
    '2346': 'الدقهلية',
    '2357': 'الأخصاص - كوبري الأخصاص',
    '1896': 'سنترال الشيخ زايد 1',
  };
  return locations[vanCode] || 'غير محدد';
}

export default whatsapp;