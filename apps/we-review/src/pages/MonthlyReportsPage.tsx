import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Select } from '@we/shared/ui';
import { formatNumber, formatCurrency } from '@we/shared/utils';

interface MonthlyReportEntry {
  id: string;
  month: string;
  date: string;
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

interface Filters {
  month: string;
  vanCode: string;
  governorate: string;
  agentId: string;
  page: number;
  pageSize: number;
}

const initialFilters: Filters = {
  month: '2026-11',
  vanCode: '',
  governorate: '',
  agentId: '',
  page: 1,
  pageSize: 50,
};

export function MonthlyReportsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['monthlyReports', filters],
    queryFn: async () => {
      const res = await api.getMonthlyReport({
        month: filters.month,
        vanCode: filters.vanCode || undefined,
        governorate: filters.governorate || undefined,
        agentId: filters.agentId || undefined,
        page: filters.page,
        pageSize: filters.pageSize,
      });
      if (!res.success) throw new Error(res.error);
      return (res.data as unknown) as { data: MonthlyReportEntry[]; meta: { total: number; page: number; pageSize: number; totalPages: number } };
    },
    staleTime: 5 * 60 * 1000,
  });

  const reports = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, pageSize: 50, totalPages: 1 };

  const totalLines = reports.reduce((s, r) => s + r.totalLines, 0);
  const totalADSL = reports.reduce((s, r) => s + r.totalADSL, 0);
  const totalAmount = reports.reduce((s, r) => s + r.totalAmount, 0);
  const totalDawry = reports.reduce((s, r) => s + r.dawryCount, 0);
  const totalDevices = reports.reduce((s, r) => s + r.devices, 0);

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
            <h3 className="empty-state-title">تعذر تحميل التقرير الشهري</h3>
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
            تقرير مبيعات مسئولي المبيعات (شهري)
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            تفصيل مبيعات كل مسؤول مبيعات للشهر المحدد
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => alert('تصدير التقرير')} icon="📥">
            تصدير Excel
          </Button>
          <Button variant="primary" onClick={() => refetch()} icon="🔄">
            تحديث
          </Button>
        </div>
      </div>

      {/* Month Selector */}
      <Card>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label">الشهر</label>
            <Select
              value={filters.month}
              onChange={(e) => setFilters(f => ({ ...f, month: e.target.value, page: 1 }))}
              options={[
                { value: '2026-11', label: 'نوفمبر 2026' },
                { value: '2026-10', label: 'أكتوبر 2026' },
                { value: '2026-09', label: 'سبتمبر 2026' },
                { value: '2026-08', label: 'أغسطس 2026' },
                { value: '2026-07', label: 'يوليو 2026' },
              ]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">الوحدة</label>
            <input type="text" value={filters.vanCode} onChange={e => setFilters(f => ({ ...f, vanCode: e.target.value, page: 1 }))} className="form-input" placeholder="كود الوحدة" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">المحافظة</label>
            <Select
              value={filters.governorate}
              onChange={(e) => setFilters(f => ({ ...f, governorate: e.target.value, page: 1 }))}
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
            <label className="form-label">المسؤول</label>
            <input type="text" value={filters.agentId} onChange={e => setFilters(f => ({ ...f, agentId: e.target.value, page: 1 }))} className="form-input" placeholder="كود أو اسم المسؤول" />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي الخطوط</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>{formatNumber(totalLines)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-secondary-50)', borderColor: 'var(--color-secondary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي ADSL</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-secondary-900)' }}>{formatNumber(totalADSL)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-success-50)', borderColor: 'var(--color-success-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-success-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي المبلغ</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success-900)' }}>{formatCurrency(totalAmount).replace(' ج.م', '')}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-warning-50)', borderColor: 'var(--color-warning-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-warning-700)', fontWeight: 600, textTransform: 'uppercase' }}>الدوري</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning-900)' }}>{formatNumber(totalDawry)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-error-50)', borderColor: 'var(--color-error-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-error-700)', fontWeight: 600, textTransform: 'uppercase' }}>الأجهزة</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error-900)' }}>{formatNumber(totalDevices)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-neutral-100)', borderColor: 'var(--color-neutral-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)', fontWeight: 600, textTransform: 'uppercase' }}>السجلات</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-neutral-700)' }}>{formatNumber(meta.total)}</p>
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
                <th>الوحدة</th>
                <th>الموقع</th>
                <th>المحافظة</th>
                <th>المسؤول</th>
                <th style={{ textAlign: 'center' }}>الخطوط</th>
                <th style={{ textAlign: 'center' }}>ADSL</th>
                <th style={{ textAlign: 'right' }}>المبلغ</th>
                <th style={{ textAlign: 'right' }}>كاش</th>
                <th style={{ textAlign: 'right' }}>فيزا</th>
                <th style={{ textAlign: 'right' }}>معفي</th>
                <th style={{ textAlign: 'center' }}>الدوري</th>
                <th style={{ textAlign: 'center' }}>الأجهزة</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, _i) => (
                <tr key={report.id}>
                  <td>{report.date}</td>
                  <td><Badge variant="neutral">{report.vanCode}</Badge></td>
                  <td>{report.location}</td>
                  <td><Badge variant="neutral" style={{ fontSize: '0.625rem' }}>{report.governorate}</Badge></td>
                  <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.agentName}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(report.totalLines)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(report.totalADSL)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(report.totalAmount)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(report.mobileCash)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(report.mobileVisa)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(report.mobileExempt)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(report.dawryCount)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(report.devices)}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={14} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <h3 className="empty-state-title">لا توجد بيانات</h3>
                      <p className="empty-state-description">لا توجد سجلات لهذا الشهر مع الفلاتر المحددة</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="card-footer" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Button variant="outline" size="sm" onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))} disabled={filters.page === 1}>
              السابق
            </Button>
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
              let pageNum = i + 1;
              if (meta.totalPages > 5) {
                if (filters.page <= 3) pageNum = i + 1;
                else if (filters.page >= meta.totalPages - 2) pageNum = meta.totalPages - 4 + i;
                else pageNum = filters.page - 2 + i;
              }
              return (
                <Button key={pageNum} variant={filters.page === pageNum ? 'primary' : 'outline'} size="sm" onClick={() => setFilters(f => ({ ...f, page: pageNum }))}>
                  {pageNum}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" onClick={() => setFilters(f => ({ ...f, page: Math.min(meta.totalPages, f.page + 1) }))} disabled={filters.page === meta.totalPages}>
              التالي
            </Button>
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-neutral-500)', fontSize: '0.8125rem' }}>
              الصفحة {filters.page} من {meta.totalPages} (إجمالي {meta.total} سجل)
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}