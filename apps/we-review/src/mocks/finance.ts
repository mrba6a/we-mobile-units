import { vans, agents, vanLocations, vanGovernorates } from './data';

export const generateMockEnteredData = (_dateFrom: string, _dateTo: string) => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const vanCode = vans[Math.floor(Math.random() * vans.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const day = Math.floor(Math.random() * 10) + 1;

    data.push({
      id: `ent_${i}`,
      date: `2026-11-${String(day).padStart(2, '0')}`,
      vanCode,
      location: vanLocations[vanCode] || 'غير محدد',
      governorate: vanGovernorates[vanCode] || 'القاهرة الكبرى',
      agentId: agent.id,
      agentName: agent.name,
      totalLines: Math.floor(Math.random() * 100) + 20,
      totalADSL: Math.floor(Math.random() * 10) + 2,
      amount: Math.floor(Math.random() * 200000) + 50000,
      mobileCash: Math.floor(Math.random() * 120000) + 20000,
      mobileVisa: Math.floor(Math.random() * 50000) + 10000,
      mobileExempt: Math.floor(Math.random() * 20000) + 5000,
    });
  }
  return data;
};