// WE Mobile Units - Dawry (الدوري) Routes
import { Hono } from 'hono';
import { z } from 'zod';
import { asyncHandler, validateQuery } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

type Bindings = {
  CACHE: KVNamespace;
  CAIRO_SCRIPT_URL: string;
  DELTA_SCRIPT_URL: string;
  UPPER_SCRIPT_URL: string;
  REPORTS_SCRIPT_URL: string;
  INTERNAL_SECRET: string;
};

const dawry = new Hono<{ Bindings: Bindings }>();

// Validation schemas
const dawryQuerySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
  day: z.coerce.number().min(1).max(10).optional(),
  muCode: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(100),
});

const matchQuerySchema = z.object({
  dateFrom: z.string(),
  dateTo: z.string(),
  vanCode: z.string().optional(),
  governorate: z.string().optional(),
});

// GET /api/dawry - Get Dawry data
dawry.get(
  '/',
  validateQuery(dawryQuerySchema),
  requirePermission('finance', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate, day, muCode, page, pageSize } = c.get('validatedQuery');

    // TODO: Fetch from Apps Script or Excel file upload
    const mockData = generateMockDawryData();

    let filtered = mockData;
    if (dateFrom) filtered = filtered.filter(d => d.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(d => d.date <= dateTo);
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);
    if (day) filtered = filtered.filter(d => d.day === day);
    if (muCode) filtered = filtered.filter(d => d.muCode.toUpperCase() === muCode.toUpperCase());

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

// GET /api/dawry/match-voice - Match Dawry with Voice Amount
dawry.get(
  '/match-voice',
  validateQuery(matchQuerySchema),
  requirePermission('finance', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate } = c.get('validatedQuery');

    // TODO: Match Dawry entries with final sheet Voice Amount column
    const dawryData = generateMockDawryData();
    const finalSheetData = generateMockFinalSheetData(dateFrom, dateTo);

    let filteredDawry = dawryData.filter(d => d.date >= dateFrom && d.date <= dateTo);
    let filteredFinal = finalSheetData.filter(d => d.date >= dateFrom && d.date <= dateTo);

    if (vanCode) {
      filteredDawry = filteredDawry.filter(d => d.vanCode === vanCode);
      filteredFinal = filteredFinal.filter(d => d.vanCode === vanCode);
    }
    if (governorate) {
      filteredDawry = filteredDawry.filter(d => d.governorate === governorate);
      filteredFinal = filteredFinal.filter(d => d.governorate === governorate);
    }

    const matches = matchDawryWithVoiceAmount(filteredDawry, filteredFinal);

    return c.json({
      success: true,
      data: matches,
      meta: {
        totalDawry: filteredDawry.length,
        totalFinalSheet: filteredFinal.length,
        matched: matches.filter(m => m.matched).length,
        unmatched: matches.filter(m => !m.matched).length,
      },
    });
  })
);

// POST /api/dawry/import - Import Dawry data from Excel
dawry.post(
  '/import',
  requirePermission('finance', 'write'),
  asyncHandler(async (c) => {
    const contentType = c.req.header('Content-Type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return c.json({ success: false, error: 'No file provided' }, 400);
      }

      // TODO: Parse Excel file (xlsx)
      // For now, return mock response
      const text = await file.text();

      return c.json({
        success: true,
        data: {
          message: 'Dawry data import would parse Excel file and store in database',
          filename: file.name,
          size: file.size,
          preview: text.slice(0, 500),
        },
      });
    }

    return c.json({ success: false, error: 'Expected multipart/form-data' }, 400);
  })
);

// GET /api/dawry/mu-codes - Get MU code to agent mapping
dawry.get(
  '/mu-codes',
  asyncHandler(async (c) => {
    // This mapping comes from the hidden sheet in الدوري.xlsx
    const muCodes = getMUCodeMapping();

    return c.json({
      success: true,
      data: muCodes,
      meta: { total: Object.keys(muCodes).length },
    });
  })
);

// GET /api/dawry/summary - Dawry summary for dashboard
dawry.get(
  '/summary',
  validateQuery(z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    vanCode: z.string().optional(),
    governorate: z.string().optional(),
  })),
  requirePermission('finance', 'read'),
  asyncHandler(async (c) => {
    const { dateFrom, dateTo, vanCode, governorate } = c.get('validatedQuery');

    const mockData = generateMockDawryData();

    let filtered = mockData;
    if (dateFrom) filtered = filtered.filter(d => d.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(d => d.date <= dateTo);
    if (vanCode) filtered = filtered.filter(d => d.vanCode === vanCode);
    if (governorate) filtered = filtered.filter(d => d.governorate === governorate);

    const summary = {
      totalEntries: filtered.length,
      totalAmount: filtered.reduce((s, d) => s + (d.cost || 0), 0),
      byFunction: filtered.reduce((acc, d) => {
        if (!acc[d.function]) acc[d.function] = { count: 0, amount: 0 };
        acc[d.function].count++;
        acc[d.function].amount += d.cost || 0;
        return acc;
      }, {} as Record<string, any>),
      byDay: filtered.reduce((acc, d) => {
        if (!acc[d.day]) acc[d.day] = { count: 0, amount: 0 };
        acc[d.day].count++;
        acc[d.day].amount += d.cost || 0;
        return acc;
      }, {} as Record<string, any>),
      topAgents: filtered
        .reduce((acc, d) => {
          if (!acc[d.executorName]) acc[d.executorName] = { count: 0, amount: 0, vanCode: d.vanCode };
          acc[d.executorName].count++;
          acc[d.executorName].amount += d.cost || 0;
          return acc;
        }, {} as Record<string, any>),
    };

    // Convert to arrays and sort
    summary.byFunction = Object.entries(summary.byFunction).map(([function_, stats]) => ({ function_, ...stats }));
    summary.byDay = Object.entries(summary.byDay).map(([day, stats]) => ({ day: parseInt(day), ...stats })).sort((a, b) => a.day - b.day);
    summary.topAgents = Object.entries(summary.topAgents)
      .map(([executorName, stats]) => ({ executorName, ...stats }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    return c.json({ success: true, data: summary });
  })
);

// Helper functions
function generateMockDawryData() {
  const data = [];
  const functions = ['صوت', 'نت', 'خطوط', 'أجهزة', 'أخرى'];
  const vans = ['231', '582', '825', '832', '2348', '2349', '2347', '2346', '2357', '1896'];
  const muCodes = Object.keys(getMUCodeMapping());

  for (let i = 0; i < 500; i++) {
    const day = Math.floor(Math.random() * 10) + 1;
    const date = `2026-11-${String(day).padStart(2, '0')}`;
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const muCode = muCodes[Math.floor(Math.random() * muCodes.length)];
    const agentName = getMUCodeMapping()[muCode];
    const executorMuCode = muCodes[Math.floor(Math.random() * muCodes.length)];
    const executorName = getMUCodeMapping()[executorMuCode];

    data.push({
      id: `dawry_${i}`,
      date,
      day,
      vanCode,
      governorate: getVanGovernorate(vanCode),
      muCode,
      agentName,
      function: functions[Math.floor(Math.random() * functions.length)],
      count: Math.floor(Math.random() * 10) + 1,
      cost: Math.floor(Math.random() * 500) + 50,
      executorCode: executorMuCode,
      executorName,
      executorCount: Math.floor(Math.random() * 5) + 1,
      executorValue: Math.floor(Math.random() * 300) + 50,
      matchesVoiceAmount: Math.random() > 0.3, // 70% match rate
    });
  }

  return data;
}

function generateMockFinalSheetData(dateFrom: string, dateTo: string) {
  // Reuse the final sheet mock data generator
  return generateMockFinalSheetDataFromDawry(dateFrom, dateTo);
}

function generateMockFinalSheetDataFromDawry(dateFrom: string, dateTo: string) {
  const data = [];
  const vans = ['231', '582', '825', '832', '2348', '2349', '2347', '2346', '2357', '1896'];

  for (let i = 0; i < 200; i++) {
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const day = Math.floor(Math.random() * 10) + 1;

    data.push({
      date: `2026-11-${String(day).padStart(2, '0')}`,
      vanCode,
      voiceAmount: Math.floor(Math.random() * 1000) + 100, // Voice Amount column
      mobileAmount: Math.floor(Math.random() * 50000),
      totalAmount: Math.floor(Math.random() * 60000),
      supplyStatus: ['توريد مطابق', 'توريد زياده', 'توريد ناقص'][Math.floor(Math.random() * 3)],
    });
  }

  return data;
}

function matchDawryWithVoiceAmount(dawryData: any[], finalSheetData: any[]) {
  // Create lookup for final sheet by vanCode + date
  const finalSheetMap = new Map<string, any>();
  for (const d of finalSheetData) {
    const key = `${d.date}_${d.vanCode}`;
    finalSheetMap.set(key, d);
  }

  // Group dawry by vanCode + date + executor (agent)
  const dawryGroups = new Map<string, any[]>();
  for (const d of dawryData) {
    const key = `${d.date}_${d.vanCode}_${d.executorCode}`;
    if (!dawryGroups.has(key)) dawryGroups.set(key, []);
    dawryGroups.get(key)!.push(d);
  }

  const matches = [];

  for (const [key, entries] of dawryGroups) {
    const [date, vanCode, executorCode] = key.split('_');
    const finalSheetKey = `${date}_${vanCode}`;
    const finalSheetEntry = finalSheetMap.get(finalSheetKey);

    const totalDawryCost = entries.reduce((s, e) => s + (e.cost || 0), 0);
    const voiceAmount = finalSheetEntry?.voiceAmount || 0;

    const matched = Math.abs(totalDawryCost - voiceAmount) <= 50; // 50 EGP tolerance

    matches.push({
      date,
      vanCode,
      executorCode,
      executorName: entries[0]?.executorName,
      governorate: entries[0]?.governorate,
      dawryEntries: entries.length,
      totalDawryCost,
      voiceAmount,
      difference: voiceAmount - totalDawryCost,
      matched,
      matchQuality: matched ? 'perfect' : (Math.abs(voiceAmount - totalDawryCost) <= 200 ? 'close' : 'mismatch'),
    });
  }

  return matches;
}

function getMUCodeMapping(): Record<string, string> {
  return {
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
    'MU0108': 'مصطفي محمد نوبي محمود',
    'MU0111': 'إبراهيم صبحي إبراهيم القاضي',
    'MU0112': 'احمد مصطفى حامد الشحات',
    'MU0131': 'احمد سمير حسين نقودي',
    'MU0143': 'عز الدين محمد يحيى اسماعيل',
  };
}

function getVanGovernorate(vanCode: string): string {
  const govs: Record<string, string> = {
    '231': 'المنوفية',
    '582': 'القاهرة الكبرى',
    '825': 'القاهرة الكبرى',
    '832': 'القاهرة الكبرى',
    '2348': 'الإسكندرية',
    '2349': 'البحيرة',
    '2347': 'القاهرة الكبرى',
    '2346': 'الدقهلية',
    '2357': 'القاهرة الكبرى',
    '1896': 'القاهرة الكبرى',
  };
  return govs[vanCode] || 'القاهرة الكبرى';
}

export default dawry;