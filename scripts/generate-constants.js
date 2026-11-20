const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DESKTOP_PATH = 'C:/Users/Ahmed Refaai/Desktop';
const PROJECT_PATH = 'C:/Users/Ahmed Refaai/Downloads/Documents/we-mobile-units';

// ===== 1. Parse Agents (171 agents from new Excel) =====
const agentWb = XLSX.readFile(path.join(DESKTOP_PATH, 'agent.xlsx'));
const agentSheet = agentWb.Sheets[agentWb.SheetNames[0]];
const agentRows = XLSX.utils.sheet_to_json(agentSheet, { header: 1 });
const agents = agentRows.slice(1).map(row => ({
  name: row[0],
  username: row[1],
  id: String(row[2]),
  email: row[3] || row[1] + '@te.eg',
  phone: String(row[4]),
  nationalId: row[5],
  location: '',
  van: ''
}));
console.log('Total agents:', agents.length);

// ===== 1b. Extract van assignments from original HTML file =====
const htmlContent = fs.readFileSync('C:/Users/Ahmed Refaai/Downloads/we- 13-fast.html', 'utf8');
// Match the array before .map()
const agentsMatch = htmlContent.match(/const AGENTS_DB = (\[[\s\S]*?\])\.map/);
let originalAgentsMap = new Map();

if (agentsMatch) {
  const agentsArray = eval(agentsMatch[1]);
  agentsArray.forEach(arr => {
    const agentData = {
      name: arr[0],
      username: arr[1],
      id: arr[2],
      email: arr[3] || (arr[1] + '@te.eg'),
      phone: arr[4],
      nationalId: arr[5],
      location: arr[6],
      van: arr[7]
    };
    // Map by ID
    originalAgentsMap.set(agentData.id, agentData);
    // Also map by username
    originalAgentsMap.set(agentData.username, agentData);
  });
  console.log('Original agents loaded:', originalAgentsMap.size);
}

// ===== 2. Parse Codes (36 units) =====
const codesWb = XLSX.readFile(path.join(DESKTOP_PATH, 'codes.xlsx'));
const codesSheet = codesWb.Sheets[codesWb.SheetNames[0]];
const codeRows = XLSX.utils.sheet_to_json(codesSheet, { header: 1 });

function cleanPlate(str) {
  return String(str).trim()
    .replace(/^VAN\s*[\(\)]?/i, '')
    .replace(/[\(\)]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCode(plate) {
  const match = plate.match(/(\d+)$/);
  return match ? match[1] : null;
}

const codes = codeRows.map(row => {
  const plate = cleanPlate(row[0]);
  const ouCode = String(row[1]).trim();
  const code = extractCode(plate);
  return { plate, ouCode, code };
}).filter(c => c.code);

console.log('Total codes:', codes.length);

// ===== 3. Governorate mapping from plate/name =====
function getGovFromName(name) {
  const n = name || '';
  if (n.includes('الإسكندرية') || n.includes('اسكندر')) return 'الإسكندرية';
  if (n.includes('المنوفية')) return 'المنوفية';
  if (n.includes('الشرقية')) return 'الشرقية';
  if (n.includes('البحيرة')) return 'البحيرة';
  if (n.includes('الغربية')) return 'الغربية';
  if (n.includes('الدقهلية')) return 'الدقهلية';
  if (n.includes('كفر الشيخ') || n.includes('كفرالشيخ')) return 'كفر الشيخ';
  if (n.includes('دمياط')) return 'دمياط';
  if (n.includes('الفيوم')) return 'الفيوم';
  if (n.includes('بني سويف') || n.includes('بنى سويف')) return 'بني سويف';
  if (n.includes('المنيا')) return 'المنيا';
  if (n.includes('أسيوط') || n.includes('اسيوط')) return 'أسيوط';
  if (n.includes('سوهاج')) return 'سوهاج';
  if (n.includes('قنا')) return 'قنا';
  if (n.includes('الأقصر') || n.includes('الاقصر')) return 'الأقصر';
  if (n.includes('أسوان') || n.includes('اسوان')) return 'أسوان';
  if (n.includes('كفر الشيخ')) return 'كفر الشيخ';
  if (n.includes('بورسعيد')) return 'بورسعيد';
  if (n.includes('الإسماعيلية') || n.includes('الاسماعيلية')) return 'الإسماعيلية';
  if (n.includes('السويس')) return 'السويس';
  if (n.includes('المكتب') || n.includes('مكتب')) return 'المكتب';
  // Default: check plate prefix
  if (n.includes('ف ق ب') || n.includes('ف ق ب')) return 'المنوفية';
  if (n.includes('أ م ر') || n.includes('ا م ر')) return 'القاهرة الكبرى';
  if (n.includes('ا ل ب') || n.includes('ر ل ب')) return 'القاهرة الكبرى';
  if (n.includes('ج ف ب') || n.includes('ج و ب')) return 'القاهرة الكبرى';
  if (n.includes('س ف ب')) return 'القاهرة الكبرى';
  if (n.includes('ف و ب')) return 'القاهرة الكبرى';
  if (n.includes('ط و ب')) return 'القاهرة الكبرى';
  if (n.includes('أ و ب')) return 'الغربية';
  if (n.includes('ن ف ب')) return 'كفر الشيخ';
  if (n.includes('ل ف ب')) return 'المنيا';
  if (n.includes('د ف ب')) return 'القاهرة الكبرى';
  if (n.includes('ن ق ب')) return 'أسوان';
  if (n.includes('ا ل ص')) return 'القاهرة الكبرى';
  return 'القاهرة الكبرى';
}

// ===== 4. Build VANS_DB =====
const vansDb = codes.map(c => {
  const gov = getGovFromName(c.plate);
  return {
    code: c.code,
    plate: c.plate,
    ouName: 'VAN(' + c.plate + ')',
    ouCode: c.ouCode,
    name: c.plate,
    gov: gov
  };
});

console.log('\n=== VANS_DB ===');
vansDb.forEach(v => console.log(v.code, v.plate, v.ouCode, v.name, v.gov));

// Save VANS_DB
const vansTs = 'export const VANS_DB = ' + JSON.stringify(vansDb, null, 2) + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'packages', 'shared', 'src', 'constants', 'vans.ts'), vansTs);
console.log('\nVANS_DB saved!');

// ===== 5. Parse System Sheet (Cash Box) for agent-van mapping =====
const sysWb = XLSX.readFile('D:/Dola/Database/database month/cash box/2026/11/VAN from 01-11-2026 to 10-11-2026.xlsx');
const sysSheet = sysWb.Sheets[sysWb.SheetNames[0]];
const sysRows = XLSX.utils.sheet_to_json(sysSheet, { header: 1 });
const sysHeaders = sysRows[0];

// Find column indices
const orgCodeIdx = sysHeaders.findIndex(h => h && h.toString().includes('org code'));
const empCodeIdx = sysHeaders.findIndex(h => h && h.toString().includes('Employee Code'));
const empNameIdx = sysHeaders.findIndex(h => h && h.toString().includes('Employee Name'));
const ouNameIdx = sysHeaders.findIndex(h => h && h.toString().includes('Org Name'));

console.log('System indices:', { orgCodeIdx, empCodeIdx, empNameIdx, ouNameIdx });

// Build orgCode -> vanCode mapping
const orgCodeToVan = new Map();

sysRows.slice(1).forEach(row => {
  const orgCode = row[orgCodeIdx] ? String(row[orgCodeIdx]).trim() : '';
  const empCode = row[empCodeIdx] ? String(row[empCodeIdx]).trim() : '';
  const empName = row[empNameIdx] ? String(row[empNameIdx]).trim() : '';
  const ouName = row[ouNameIdx] ? String(row[ouNameIdx]).trim() : '';

  if (orgCode && empCode) {
    orgCodeToVan.set(orgCode, { empCode, empName, ouName });
  }
});

// Match org codes to van codes
const ouCodeToVanCode = new Map();
vansDb.forEach(v => {
  if (orgCodeToVan.has(v.ouCode)) {
    ouCodeToVanCode.set(v.ouCode, v.code);
  }
});

console.log('\nOU Code -> Van Code mappings:');
ouCodeToVanCode.forEach((vanCode, ouCode) => {
  console.log(ouCode, '->', vanCode);
});

// ===== 6. Assign agents to vans =====
let matchedCount = 0;

agents.forEach(agent => {
  // First try: match by ID from original HTML data
  const originalAgent = originalAgentsMap.get(agent.id) || originalAgentsMap.get(agent.username);
  if (originalAgent && originalAgent.van) {
    agent.van = originalAgent.van;
    agent.location = originalAgent.location || '';
    matchedCount++;
    return;
  }

  // Second try: match by empCode from cash box system sheet
  for (const [ouCode, data] of orgCodeToVan) {
    if (data.empCode === agent.id) {
      const vanCode = ouCodeToVanCode.get(ouCode);
      if (vanCode) {
        agent.van = vanCode;
        agent.location = data.ouName || '';
        matchedCount++;
        return;
      }
    }
  }
});

console.log('\nAgents with van assigned:', matchedCount);
console.log('Agents without van:', agents.filter(a => !a.van).length);

// Save AGENTS_DB
const agentsTs = 'export const AGENTS_DB = ' + JSON.stringify(agents, null, 2) + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'packages', 'shared', 'src', 'constants', 'agents.ts'), agentsTs);
console.log('AGENTS_DB saved!');

// Also save GOVERNORATES
const governorates = [
  'القاهرة الكبرى',
  'الإسكندرية',
  'الشرقية',
  'المنوفية',
  'الغربية',
  'الدقهلية',
  'كفر الشيخ',
  'البحيرة',
  'دمياط',
  'الإسماعيلية',
  'السويس',
  'بورسعيد',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'المكتب'
];
const govTs = 'export const GOVERNORATES = ' + JSON.stringify(governorates, null, 2) + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'packages', 'shared', 'src', 'constants', 'governorates.ts'), govTs);
console.log('GOVERNORATES saved!');