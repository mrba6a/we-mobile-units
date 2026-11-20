import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Select, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@we/shared/ui';
import { formatNumber, formatCurrency } from '@we/shared/utils';
import type { HistoricalReportEntry } from '@we/shared/types';

const initialFilters = {
  dateFrom: '2026-01-01',
  dateTo: '2026-11-10',
  vanCode: '',
  governorate: '',
  period: 'monthly' as const,
  groupBy: 'van' as const,
};

type HistoricalPageFilters = {
  dateFrom: string;
  dateTo: string;
  vanCode: string;
  governorate: string;
  period: 'monthly' | 'daily' | 'yearly';
  groupBy: 'van' | 'agent' | 'governorate' | 'category';
};

export function HistoricalPage() {
  const [filters, setFilters] = useState<HistoricalPageFilters>(initialFilters);

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['historical', filters],
    queryFn: async () => {
      const res = await api.getHistoricalReport({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || '',
        governorate: filters.governorate || '',
        period: filters.period as 'today' | 'week' | 'quarter' | 'year' | 'custom' | 'daily' | 'monthly' | 'yearly' | 'month',
      });
      if (!res.success) throw new Error(res.error);
      return res.data as HistoricalReportEntry[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const data = response || [];

  // Aggregate data for charts
  const chartData = data.map(d => ({
    date: d.date,
    value: d.totalAmount,
    lines: d.totalLines,
    adsl: d.totalADSL,
    group: d.groupValue,
  }));

  const totalAmount = data.reduce((s, d) => s + d.totalAmount, 0);
  const totalLines = data.reduce((s, d) => s + d.totalLines, 0);
  const totalADSL = data.reduce((s, d) => s + d.totalADSL, 0);
  const avgVans = data.length > 0 ? (data.reduce((s, d) => s + d.vansActive, 0) / data.length).toFixed(1) : 0;
  const avgAgents = data.length > 0 ? (data.reduce((s, d) => s + d.agentsActive, 0) / data.length).toFixed(1) : 0;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (error) {
    return (
      <Card style={{ maxWidth: 600, margin: 'var(--space-6) auto' }}>
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3 className="empty-state-title">تعذر تحميل البيانات التاريخية</h3>
            <p className="empty-state-description">{error.message}</p>
            <button className="btn btn-primary" onClick={() => refetch()}>إعادة المحاولة</button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
            محرك التحليل التاريخي (3 سنوات)
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            تحليل الاتجاهات والأداء عبر الفترات الزمنية
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => alert('تصدير البيانات')} icon="📥">
            تصدير
          </Button>
          <Button variant="primary" onClick={() => refetch()} icon="🔄">
            تحديث
          </Button>
        </div>
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
            <label className="form-label">الوحدة</label>
            <input type="text" value={filters.vanCode} onChange={e => setFilters(f => ({ ...f, vanCode: e.target.value }))} className="form-input" placeholder="كود الوحدة" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">المحافظة</label>
            <Select
              value={filters.governorate}
              onChange={e => setFilters(f => ({ ...f, governorate: e.target.value }))}
              options={[
                { value: '', label: 'الكل' },
                { value: 'القاهرة الكبرى', label: 'القاهرة الكبرى' },
                { value: 'الإسكندرية', label: 'الإسكندرية' },
                { value: 'المنوفية', label: 'المنوفية' },
                { value: 'الشرقية', label: 'الشرقية' },
                { value: 'البحيرة', label: 'البحيرة' },
                { value: 'الغربية', label: 'الغربية' },
                { value: 'الدقهلية', label: 'الدقهلية' },
                { value: 'كفر الشيخ', label: 'كفر الشيخ' },
                { value: 'دمياط', label: 'دمياط' },
                { value: 'الفيوم', label: 'الفيوم' },
                { value: 'بني سويف', label: 'بني سويف' },
                { value: 'المنيا', label: 'المنيا' },
                { value: 'أسيوط', label: 'أسيوط' },
                { value: 'سوهاج', label: 'سوهاج' },
                { value: 'قنا', label: 'قنا' },
                { value: 'الأقصر', label: 'الأقصر' },
                { value: 'أسوان', label: 'أسوان' },
                { value: 'المكتب', label: 'المكتب' },
              ]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">الفترة</label>
            <Select
              value={filters.period}
              onChange={e => setFilters(f => ({ ...f, period: e.target.value as any }))}
              options={[
                { value: 'daily', label: 'يومي' },
                { value: 'monthly', label: 'شهري' },
                { value: 'yearly', label: 'سنوي' },
              ]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">تجميع حسب</label>
            <Select
              value={filters.groupBy}
              onChange={e => setFilters(f => ({ ...f, groupBy: e.target.value as any }))}
              options={[
                { value: 'van', label: 'حسب الوحدة' },
                { value: 'agent', label: 'حسب المسؤول' },
                { value: 'governorate', label: 'حسب المحافظة' },
                { value: 'category', label: 'حسب الفئة' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي المبلغ</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>{formatCurrency(totalAmount).replace(' ج.م', '')}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-secondary-50)', borderColor: 'var(--color-secondary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي الخطوط</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-secondary-900)' }}>{formatNumber(totalLines)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-success-50)', borderColor: 'var(--color-success-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-success-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي ADSL</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success-900)' }}>{formatNumber(totalADSL)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-warning-50)', borderColor: 'var(--color-warning-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-warning-700)', fontWeight: 600, textTransform: 'uppercase' }}>متوسط الوحدات النشطة</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning-900)' }}>{avgVans}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-error-50)', borderColor: 'var(--color-error-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-error-700)', fontWeight: 600, textTransform: 'uppercase' }}>متوسط المسؤولين النشطين</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error-900)' }}>{avgAgents}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-neutral-100)', borderColor: 'var(--color-neutral-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)', fontWeight: 600, textTransform: 'uppercase' }}>عدد الفترات</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-neutral-700)' }}>{data.length}</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Amount Trend */}
        <Card>
          <div className="card-header">
            <h3 className="card-title">اتجاه المبلغ ({filters.period === 'daily' ? 'يومي' : filters.period === 'monthly' ? 'شهري' : 'سنوي'})</h3>
          </div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} interval="preserveStartEnd" />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={value => formatCurrency(value).replace(' ج.م', '')} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: number | undefined, name: string) => [value !== undefined ? formatCurrency(value) : '0 ج.م', name]) as any}
                />
                <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lines & ADSL Trend */}
        <Card>
          <div className="card-header">
            <h3 className="card-title">اتجاه الخطوط و ADSL</h3>
          </div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} interval="preserveStartEnd" />
                <YAxis yAxisId="left" stroke="#64748B" fontSize={11} tickFormatter={value => formatNumber(value)} />
                <YAxis yAxisId="right" orientation="left" stroke="#64748B" fontSize={11} tickFormatter={value => formatNumber(value)} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: number | undefined, name: string) => [value !== undefined ? formatNumber(value) : '0', name === 'lines' ? 'الخطوط' : 'ADSL']) as any}
                />
                <Line yAxisId="left" type="monotone" dataKey="lines" stroke="#10B981" strokeWidth={2} dot={false} name="الخطوط" />
                <Line yAxisId="right" type="monotone" dataKey="adsl" stroke="#F59E0B" strokeWidth={2} dot={false} name="ADSL" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>المجموعة ({filters.groupBy === 'van' ? 'الوحدة' : filters.groupBy === 'agent' ? 'المسؤول' : filters.groupBy === 'governorate' ? 'المحافظة' : 'الفئة'})</th>
                <th style={{ textAlign: 'right' }}>المبلغ</th>
                <th style={{ textAlign: 'center' }}>الخطوط</th>
                <th style={{ textAlign: 'center' }}>ADSL</th>
                <th style={{ textAlign: 'center' }}>الوحدات النشطة</th>
                <th style={{ textAlign: 'center' }}>المسؤولين النشطين</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => (
                <tr key={i}>
                  <td>{entry.date}</td>
                  <td><Badge variant="neutral">{entry.groupValue}</Badge></td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(entry.totalAmount)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(entry.totalLines)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(entry.totalADSL)}</td>
                  <td style={{ textAlign: 'center' }}>{entry.vansActive}</td>
                  <td style={{ textAlign: 'center' }}>{entry.agentsActive}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📊</div>
                      <h3 className="empty-state-title">لا توجد بيانات تاريخية</h3>
                      <p className="empty-state-description">جرب تغيير نطاق التاريخ أو الفلاتر</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}