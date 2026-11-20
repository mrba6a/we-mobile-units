import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Tabs } from '@we/shared/ui';
import { formatNumber, formatCurrency, getStatusColor } from '@we/shared/utils';
import type { BSSEntry, FinanceFilters, ComparisonResult, Discrepancy } from '@we/shared/types';
import { generateMockEnteredData } from '../mocks/finance';

const initialFilters: FinanceFilters = {
  dateFrom: '2026-11-01',
  dateTo: '2026-11-10',
  vanCode: '',
  governorate: '',
  groupBy: 'van',
};

export function FinancePage() {
  const [filters, setFilters] = useState<FinanceFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState<'comparison' | 'discrepancies' | 'bss' | 'entered'>('comparison');

  // Fetch data
  const { data: bssData, isLoading: bssLoading } = useQuery({
    queryKey: ['financeBSS', filters.dateFrom, filters.dateTo, filters.vanCode, filters.governorate],
    queryFn: async () => {
      const res = await api.getBSSData({ dateFrom: filters.dateFrom, dateTo: filters.dateTo, vanCode: filters.vanCode || '', governorate: filters.governorate || '' });
      if (!res.success) throw new Error(res.error);
      return res.data as BSSEntry[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: enteredData, isLoading: enteredLoading } = useQuery({
    queryKey: ['financeEntered', filters.dateFrom, filters.dateTo, filters.vanCode, filters.governorate],
    queryFn: async () => {
      return generateMockEnteredData(filters.dateFrom || '', filters.dateTo || '');
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: comparisonData } = useQuery({
    queryKey: ['financeComparison', filters],
    queryFn: async () => {
      const res = await api.getFinanceComparison({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || '',
        governorate: filters.governorate || '',
        groupBy: filters.groupBy,
      });
      if (!res.success) throw new Error(res.error);
      return res.data as { summary: any; details: ComparisonResult[] };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!filters.dateFrom && !!filters.dateTo,
  });

  const { data: discrepanciesData } = useQuery({
    queryKey: ['financeDiscrepancies', filters],
    queryFn: async () => {
      const res = await api.getFinanceDiscrepancies({ dateFrom: filters.dateFrom, dateTo: filters.dateTo, vanCode: filters.vanCode || '', governorate: filters.governorate || '' });
      if (!res.success) throw new Error(res.error);
      return res.data as Discrepancy[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!filters.dateFrom && !!filters.dateTo,
  });

  const isLoading = bssLoading || enteredLoading;

  const bss = bssData || [];
  const entered = enteredData || [];
  const comparison = comparisonData?.details || [];
  const summary = comparisonData?.summary || { totalGroups: 0, matched: 0, excess: 0, shortage: 0, totalEnteredAmount: 0, totalBSSAmount: 0, totalDifference: 0 };
  const discrepancies = discrepanciesData || [];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
            المالية ومقارنة BSS
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            مقارنة البيانات المدخلة يدوياً مع بيانات BSS الرسمية
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => alert('تصدير المقارنة')} icon="📥">
            تصدير
          </Button>
          <Button variant="primary" onClick={() => {}} icon="🔄">
            تحديث
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>المدخول</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>{formatCurrency(summary.totalEnteredAmount)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-secondary-50)', borderColor: 'var(--color-secondary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-700)', fontWeight: 600, textTransform: 'uppercase' }}>BSS</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-secondary-900)' }}>{formatCurrency(summary.totalBSSAmount)}</p>
          </div>
        </Card>
        <Card style={{ background: `${summary.totalDifference >= 0 ? 'var(--color-warning-50)' : 'var(--color-error-50)'}`, borderColor: `${summary.totalDifference >= 0 ? 'var(--color-warning-200)' : 'var(--color-error-200)'}` }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: `${summary.totalDifference >= 0 ? 'var(--color-warning-700)' : 'var(--color-error-700)'}`, fontWeight: 600, textTransform: 'uppercase' }}>الفرق</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: `${summary.totalDifference >= 0 ? 'var(--color-warning-900)' : 'var(--color-error-900)'}` }}>
              {summary.totalDifference >= 0 ? '+' : ''}{formatCurrency(summary.totalDifference)}
            </p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-success-50)', borderColor: 'var(--color-success-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-success-700)', fontWeight: 600, textTransform: 'uppercase' }}>مطابق</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success-900)' }}>{summary.matched}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-warning-50)', borderColor: 'var(--color-warning-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-warning-700)', fontWeight: 600, textTransform: 'uppercase' }}>زيادة</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning-900)' }}>{summary.excess}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-error-50)', borderColor: 'var(--color-error-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-error-700)', fontWeight: 600, textTransform: 'uppercase' }}>نقص</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error-900)' }}>{summary.shortage}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">من تاريخ</label>
            <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} className="form-input" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">إلى تاريخ</label>
            <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} className="form-input" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">كود الوحدة</label>
            <input type="text" value={filters.vanCode} onChange={e => setFilters(f => ({ ...f, vanCode: e.target.value }))} className="form-input" placeholder="مثال: 231" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">المحافظة</label>
            <select value={filters.governorate} onChange={e => setFilters(f => ({ ...f, governorate: e.target.value }))} className="form-input form-select">
              <option value="">الكل</option>
              <option value="القاهرة الكبرى">القاهرة الكبرى</option>
              <option value="الإسكندرية">الإسكندرية</option>
              <option value="المنوفية">المنوفية</option>
              <option value="الشرقية">الشرقية</option>
              <option value="البحيرة">البحيرة</option>
              <option value="الغربية">الغربية</option>
              <option value="الدقهلية">الدقهلية</option>
              <option value="كفر الشيخ">كفر الشيخ</option>
              <option value="دمياط">دمياط</option>
              <option value="الفيوم">الفيوم</option>
              <option value="بني سويف">بني سويف</option>
              <option value="المنيا">المنيا</option>
              <option value="أسيوط">أسيوط</option>
              <option value="سوهاج">سوهاج</option>
              <option value="قنا">قنا</option>
              <option value="الأقصر">الأقصر</option>
              <option value="أسوان">أسوان</option>
              <option value="المكتب">المكتب</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">تجميع حسب</label>
            <select value={filters.groupBy} onChange={e => setFilters(f => ({ ...f, groupBy: e.target.value as any }))} className="form-input form-select">
              <option value="van">حسب الوحدة</option>
              <option value="agent">حسب المسؤول</option>
              <option value="governorate">حسب المحافظة</option>
              <option value="date">حسب التاريخ</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'comparison', label: 'مقارنة مفصلة' },
          { id: 'discrepancies', label: 'الفروقات', badge: discrepancies.length },
          { id: 'bss', label: 'بيانات BSS' },
          { id: 'entered', label: 'البيانات المدخلة' },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as 'comparison' | 'discrepancies' | 'bss' | 'entered')}
      />

      {/* Tab Content */}
      {activeTab === 'comparison' && (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>{filters.groupBy === 'van' ? 'الوحدة' : filters.groupBy === 'agent' ? 'المسؤول' : filters.groupBy === 'governorate' ? 'المحافظة' : 'التاريخ'}</th>
                  <th style={{ textAlign: 'right' }}>المدخول</th>
                  <th style={{ textAlign: 'right' }}>BSS</th>
                  <th style={{ textAlign: 'right' }}>الفرق</th>
                  <th>الحالة</th>
                  <th style={{ textAlign: 'center' }}>خطوط مدخلة</th>
                  <th style={{ textAlign: 'center' }}>خطوط BSS</th>
                  <th style={{ textAlign: 'center' }}>ADSL مدخل</th>
                  <th style={{ textAlign: 'center' }}>ADSL BSS</th>
                  <th>المحافظة</th>
                  <th>المسؤول</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <Badge variant="neutral">{item.key}</Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.enteredAmount)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.bssAmount)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ color: getStatusColor(item.status), fontWeight: 600 }}>
                        {item.difference >= 0 ? '+' : ''}{formatCurrency(item.difference)}
                      </span>
                    </td>
                    <td>
                      <Badge
                        variant={item.status === 'matched' ? 'success' : item.status === 'excess' ? 'warning' : 'error'}
                      >
                        {item.status === 'matched' ? 'مطابق' : item.status === 'excess' ? 'زيادة' : 'نقص'}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'center' }}>{formatNumber(item.enteredLines)}</td>
                    <td style={{ textAlign: 'center' }}>{formatNumber(item.bssLines)}</td>
                    <td style={{ textAlign: 'center' }}>{formatNumber(item.enteredADSL)}</td>
                    <td style={{ textAlign: 'center' }}>{formatNumber(item.bssADSL)}</td>
                    <td>{item.governorate}</td>
                    <td>{item.agentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'discrepancies' && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>إجمالي الفروقات: {discrepancies.length}</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>النوع</th>
                  <th>الوحدة</th>
                  <th>التاريخ</th>
                  <th>المسؤول</th>
                  <th style={{ textAlign: 'right' }}>المبلغ المدخل</th>
                  <th style={{ textAlign: 'right' }}>مبلغ BSS</th>
                  <th style={{ textAlign: 'right' }}>الفرق</th>
                  <th>الشدة</th>
                </tr>
              </thead>
              <tbody>
                {discrepancies.map((d, i) => (
                  <tr key={i}>
                    <td>
                      <Badge variant={d.type === 'missing_in_bss' ? 'error' : d.type === 'missing_in_entered' ? 'warning' : d.type === 'excess_in_bss' ? 'warning' : 'error'}>
                        {d.type === 'missing_in_bss' ? 'مفقود في BSS' :
                         d.type === 'missing_in_entered' ? 'مفقود في المدخلات' :
                         d.type === 'excess_in_bss' ? 'زيادة في BSS' : 'نقص في BSS'}
                      </Badge>
                    </td>
                    <td><Badge variant="neutral">{d.entered?.vanCode || d.bss?.vanCode}</Badge></td>
                    <td>{d.entered?.date || d.bss?.date}</td>
                    <td>{d.entered?.agentName || d.bss?.agentName}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(d.entered?.amount || 0)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(d.bss?.amount || 0)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ color: getStatusColor(d.difference ? (d.difference >= 0 ? 'excess' : 'shortage') : 'pending'), fontWeight: 600 }}>
                        {d.difference !== undefined ? (d.difference >= 0 ? '+' : '') + formatCurrency(Math.abs(d.difference)) : '-'}
                      </span>
                    </td>
                    <td>
                      <Badge variant={d.severity === 'high' ? 'error' : d.severity === 'medium' ? 'warning' : 'success'}>
                        {d.severity === 'high' ? 'عالي' : d.severity === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'bss' && (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>الوحدة</th>
                  <th>الموقع</th>
                  <th>المسؤول</th>
                  <th style={{ textAlign: 'center' }}>الخطوط</th>
                  <th style={{ textAlign: 'center' }}>ADSL</th>
                  <th style={{ textAlign: 'right' }}>المبلغ</th>
                  <th style={{ textAlign: 'right' }}>كاش</th>
                  <th style={{ textAlign: 'right' }}>فيزا</th>
                  <th style={{ textAlign: 'right' }}>معفي</th>
                </tr>
              </thead>
              <tbody>
                {bss.slice(0, 100).map((item, i) => (
                  <tr key={i}>
                    <td>{item.date}</td>
                    <td><Badge variant="neutral">{item.vanCode}</Badge></td>
                    <td>{item.location}</td>
                    <td>{item.agentName}</td>
                    <td style={{ textAlign: 'center' }}>{formatNumber(item.lines)}</td>
                    <td style={{ textAlign: 'center' }}>{formatNumber(item.adsl)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.amount)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.cash)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.visa)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.exempt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'entered' && (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>الوحدة</th>
                  <th>الموقع</th>
                  <th>المسؤول</th>
                  <th style={{ textAlign: 'center' }}>الخطوط</th>
                  <th style={{ textAlign: 'center' }}>ADSL</th>
                  <th style={{ textAlign: 'right' }}>المبلغ</th>
                  <th style={{ textAlign: 'right' }}>كاش</th>
                  <th style={{ textAlign: 'right' }}>فيزا</th>
                  <th style={{ textAlign: 'right' }}>معفي</th>
                </tr>
              </thead>
              <tbody>
                {entered.slice(0, 100).map((item, i) => (
                  <tr key={i}>
                    <td>{item.date}</td>
                    <td><Badge variant="neutral">{item.vanCode}</Badge></td>
                    <td>{item.location}</td>
                    <td>{item.agentName}</td>
                    <td style={{ textAlign: 'center' }}>{formatNumber(item.totalLines)}</td>
                    <td style={{ textAlign: 'center' }}>{formatNumber(item.totalADSL)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.amount)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.mobileCash)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.mobileVisa)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.mobileExempt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}