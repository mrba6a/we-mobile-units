import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Select } from '@we/shared/ui';
import { formatNumber, formatCurrency } from '@we/shared/utils';

interface MasterEntry {
  id: string;
  date: string;
  month: string;
  city: string;
  location: string;
  vanCode: string;
  totalLines: number;
  '5at_3ady': number;
  talabh: number;
  takafol: number;
  mnp: number;
  ghaz: number;
  net: number;
  '2rdy': number;
  mobileAmount: number;
  voiceBills: number;
  voiceAmount: number;
  oss: number;
  wePay: number;
  البارز: number;
  total: number;
  system: number;
  supplyStatus: string;
  treasurySupply: string;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  vanCode: string;
  governorate: string;
  status: 'all' | 'matched' | 'excess' | 'shortage';
  page: number;
  pageSize: number;
}

const initialFilters: Filters = {
  dateFrom: '2026-11-01',
  dateTo: '2026-11-10',
  vanCode: '',
  governorate: '',
  status: 'all',
  page: 1,
  pageSize: 50,
};

const COLUMNS = [
  { key: 'date', label: 'التاريخ' },
  { key: 'month', label: 'الشهر' },
  { key: 'city', label: 'المدينة' },
  { key: 'location', label: 'الموقع' },
  { key: 'vanCode', label: 'رقم الوحدة' },
  { key: 'totalLines', label: 'إجمالي الخطوط' },
  { key: '5at_3ady', label: 'خطوط عادية' },
  { key: 'talabh', label: 'الطلبة' },
  { key: 'takafol', label: 'التكافل' },
  { key: 'mnp', label: 'MNP' },
  { key: 'ghaz', label: 'الغاز' },
  { key: 'net', label: 'النت' },
  { key: '2rdy', label: 'أرضي' },
  { key: 'mobileAmount', label: 'مبلغ المحمول' },
  { key: 'voiceBills', label: 'فواتير الصوت' },
  { key: 'voiceAmount', label: 'مبلغ الصوت' },
  { key: 'oss', label: 'OSS' },
  { key: 'wePay', label: 'We Pay' },
  { key: 'البارز', label: 'البارز' },
  { key: 'total', label: 'الإجمالي' },
  { key: 'system', label: 'النظام' },
  { key: 'supplyStatus', label: 'حالة التوريد' },
  { key: 'treasurySupply', label: 'توريد الخزينة' },
];

export function MasterPreviewPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['masterPreview', filters],
    queryFn: async () => {
      const res = await api.getFinalSheet({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || undefined,
        governorate: filters.governorate || undefined,
        status: filters.status,
        page: filters.page,
        pageSize: filters.pageSize,
      });
      if (!res.success) throw new Error(res.error);
      return (res.data as unknown) as { data: MasterEntry[]; meta: { total: number; page: number; pageSize: number; totalPages: number } };
    },
    staleTime: 5 * 60 * 1000,
  });

  const entries = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, pageSize: 50, totalPages: 1 };

  const matched = entries.filter(e => e.supplyStatus === 'توريد مطابق').length;
  const excess = entries.filter(e => e.supplyStatus === 'توريد زياده').length;
  const shortage = entries.filter(e => e.supplyStatus === 'توريد ناقص').length;
  const totalAmount = entries.reduce((s, e) => s + e.total, 0);
  const totalSystem = entries.reduce((s, e) => s + e.system, 0);

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
            <h3 className="empty-state-title">تعذر تحميل الشيت الرئيسي</h3>
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
            معاينة الشيت الرئيسي (22 عمود)
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            الشيت النهائي بعد المطابقة والتدقيق اليدوي - جاهز للإدارة المالية
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => alert('تصدير الشيت الرئيسي')} icon="📥">
            تصدير Excel
          </Button>
          <Button variant="primary" onClick={() => refetch()} icon="🔄">
            تحديث
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي السجلات</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>{formatNumber(meta.total)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-success-50)', borderColor: 'var(--color-success-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-success-700)', fontWeight: 600, textTransform: 'uppercase' }}>مطابق</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success-900)' }}>{formatNumber(matched)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-warning-50)', borderColor: 'var(--color-warning-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-warning-700)', fontWeight: 600, textTransform: 'uppercase' }}>زيادة</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning-900)' }}>{formatNumber(excess)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-error-50)', borderColor: 'var(--color-error-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-error-700)', fontWeight: 600, textTransform: 'uppercase' }}>ناقص</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error-900)' }}>{formatNumber(shortage)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-secondary-50)', borderColor: 'var(--color-secondary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي المبلغ</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-secondary-900)' }}>{formatCurrency(totalAmount).replace(' ج.م', '')}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>مبلغ النظام</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>{formatCurrency(totalSystem).replace(' ج.م', '')}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">من تاريخ</label>
            <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value, page: 1 }))} className="form-input" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">إلى تاريخ</label>
            <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value, page: 1 }))} className="form-input" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">الوحدة</label>
            <input type="text" value={filters.vanCode} onChange={e => setFilters(f => ({ ...f, vanCode: e.target.value, page: 1 }))} className="form-input" placeholder="كود الوحدة" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">المحافظة</label>
            <Select
              value={filters.governorate}
              onChange={e => setFilters(f => ({ ...f, governorate: e.target.value, page: 1 }))}
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
            <label className="form-label">حالة التوريد</label>
            <Select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value as any, page: 1 }))}
              options={[
                { value: 'all', label: 'الكل' },
                { value: 'matched', label: 'مطابق' },
                { value: 'excess', label: 'زيادة' },
                { value: 'shortage', label: 'ناقص' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ fontSize: '0.6875rem' }}>
            <thead>
              <tr>
                {COLUMNS.map(col => (
                  <th key={col.key} style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, _i) => (
                <tr key={entry.id} style={{ fontSize: '0.6875rem' }}>
                  {COLUMNS.map(col => (
                    <td key={col.key} style={{ whiteSpace: 'nowrap' }}>
                      {col.key === 'supplyStatus' && (
                        <Badge
                          variant={
                            entry.supplyStatus === 'توريد مطابق' ? 'success' :
                            entry.supplyStatus === 'توريد زياده' ? 'warning' :
                            entry.supplyStatus === 'توريد ناقص' ? 'error' : 'neutral'
                          }
                          style={{ fontSize: '0.5625rem' }}
                        >
                          {entry.supplyStatus}
                        </Badge>
                      )}
                      {['mobileAmount', 'voiceAmount', 'البارز', 'total', 'system'].includes(col.key) && (
                        <span style={{ textAlign: 'right', display: 'block' }}>
                          {formatCurrency(entry[col.key as keyof MasterEntry] as number).replace(' ج.م', '')}
                        </span>
                      )}
                      {['totalLines', '5at_3ady', 'talabh', 'takafol', 'mnp', 'ghaz', 'net', '2rdy', 'voiceBills', 'oss', 'wePay'].includes(col.key) && (
                        <span style={{ textAlign: 'center', display: 'block' }}>
                          {formatNumber(entry[col.key as keyof MasterEntry] as number)}
                        </span>
                      )}
                      {col.key === 'vanCode' && (
                        <Badge variant="neutral" style={{ fontSize: '0.5625rem' }}>
                          {entry[col.key as keyof MasterEntry]}
                        </Badge>
                      )}
                      {!['supplyStatus', 'mobileAmount', 'voiceAmount', 'البارز', 'total', 'system', 'totalLines', '5at_3ady', 'talabh', 'takafol', 'mnp', 'ghaz', 'net', '2rdy', 'voiceBills', 'oss', 'wePay', 'vanCode'].includes(col.key) && (
                        <span>{entry[col.key as keyof MasterEntry]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <h3 className="empty-state-title">لا توجد بيانات</h3>
                      <p className="empty-state-description">لا توجد سجلات لهذا النطاق مع الفلاتر المحددة</p>
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