import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Tabs, Button } from '@we/shared/ui';
import { formatNumber, formatCurrency, getStatusColor } from '@we/shared/utils';

interface ReconciliationEntry {
  id: string;
  date: string;
  vanCode: string;
  location: string;
  governorate: string;
  agentName: string;
  agentId: string;
  bssEmpCode: string;
  bssSessionsCount: number;
  totalLines: number;
  totalADSL: number;
  enteredAmount: number;
  bssAmount: number;
  difference: number;
  status: 'matched' | 'excess' | 'shortage' | 'pending';
  source: 'BSS' | 'MANUAL' | 'VOICE';
  mobileCash: number;
  mobileVisa: number;
  mobileExempt: number;
  isCumulative10D?: boolean;
  minDate?: string;
  maxDate?: string;
}

interface ReconciliationFilters {
  dateFrom: string;
  dateTo: string;
  vanCode: string;
  governorate: string;
  basis: 'AUTO_BSS' | 'MANUAL' | 'VOICE';
  mode: 'DAILY' | 'CUMULATIVE_10D';
}

const initialFilters: ReconciliationFilters = {
  dateFrom: '2026-11-01',
  dateTo: '2026-11-10',
  vanCode: '',
  governorate: '',
  basis: 'AUTO_BSS',
  mode: 'CUMULATIVE_10D',
};

export function ReconciliationPage() {
  const [filters, setFilters] = useState<ReconciliationFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['reconciliation', filters],
    queryFn: async () => {
      const res = await api.getReconciliation({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || undefined,
        governorate: filters.governorate || undefined,
        basis: filters.basis,
        mode: filters.mode,
      });
      if (!res.success) throw new Error(res.error);
      return res.data as ReconciliationEntry[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const entries = response || [];

  // Client-side pagination
  const totalPages = Math.ceil(entries.length / pageSize);
  const paginatedEntries = useMemo(
    () => entries.slice((page - 1) * pageSize, page * pageSize),
    [entries, page]
  );

  // Summary calculations
  const summary = useMemo(() => {
    const totalEntries = entries.length;
    const matched = entries.filter(e => e.status === 'matched').length;
    const excess = entries.filter(e => e.status === 'excess').length;
    const shortage = entries.filter(e => e.status === 'shortage').length;
    const pending = entries.filter(e => e.status === 'pending').length;
    const totalEntered = entries.reduce((s, e) => s + e.enteredAmount, 0);
    const totalBSS = entries.reduce((s, e) => s + e.bssAmount, 0);
    const totalDiff = totalBSS - totalEntered;
    const matchRate = totalEntries > 0 ? ((matched / totalEntries) * 100).toFixed(1) : 0;

    return { totalEntries, matched, excess, shortage, pending, totalEntered, totalBSS, totalDiff, matchRate };
  }, [entries]);

  const handleFilterChange = (key: keyof ReconciliationFilters, value: string) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const handleExport = async () => {
    // TODO: Implement export
    alert('تصدير البيانات - سيتم التنفيذ');
  };

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
            <h3 className="empty-state-title">تعذر تحميل بيانات التسوية</h3>
            <p className="empty-state-description">{error.message}</p>
            <button className="btn btn-primary" onClick={() => refetch()}>
              إعادة المحاولة
            </button>
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
            محرك التسوية والمراجعة
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            مراجعة شاملة للبيانات المدخلة مقابل BSS مع دعم التراكمي 10 أيام
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={handleExport} icon="📥">
            تصدير
          </Button>
          <Button variant="primary" onClick={() => refetch()} icon="🔄">
            تحديث
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي السجلات</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>{formatNumber(summary.totalEntries)}</p>
          </div>
        </div>
        <div className="card" style={{ background: 'var(--color-success-50)', borderColor: 'var(--color-success-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-success-700)', fontWeight: 600, textTransform: 'uppercase' }}>مطابق</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success-900)' }}>{formatNumber(summary.matched)}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-success-600)' }}>{summary.matchRate}%</p>
          </div>
        </div>
        <div className="card" style={{ background: 'var(--color-warning-50)', borderColor: 'var(--color-warning-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-warning-700)', fontWeight: 600, textTransform: 'uppercase' }}>زيادة</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning-900)' }}>{formatNumber(summary.excess)}</p>
          </div>
        </div>
        <div className="card" style={{ background: 'var(--color-error-50)', borderColor: 'var(--color-error-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-error-700)', fontWeight: 600, textTransform: 'uppercase' }}>نقص</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error-900)' }}>{formatNumber(summary.shortage)}</p>
          </div>
        </div>
        <div className="card" style={{ background: 'var(--color-neutral-100)', borderColor: 'var(--color-neutral-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)', fontWeight: 600, textTransform: 'uppercase' }}>معلق</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-neutral-700)' }}>{formatNumber(summary.pending)}</p>
          </div>
        </div>
        <div className="card" style={{ background: 'var(--color-secondary-50)', borderColor: 'var(--color-secondary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary-700)', fontWeight: 600, textTransform: 'uppercase' }}>مبلغ مدخول</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-secondary-900)' }}>{formatCurrency(summary.totalEntered).replace(' ج.م', '')}</p>
          </div>
        </div>
        <div className="card" style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>مبلغ BSS</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>{formatCurrency(summary.totalBSS).replace(' ج.م', '')}</p>
          </div>
        </div>
        <div className="card" style={{ background: `${summary.totalDiff >= 0 ? 'var(--color-warning-50)' : 'var(--color-error-50)'}`, borderColor: `${summary.totalDiff >= 0 ? 'var(--color-warning-200)' : 'var(--color-error-200)'}` }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: `${summary.totalDiff >= 0 ? 'var(--color-warning-700)' : 'var(--color-error-700)'}`, fontWeight: 600, textTransform: 'uppercase' }}>الفرق</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: `${summary.totalDiff >= 0 ? 'var(--color-warning-900)' : 'var(--color-error-900)'}` }}>
              {summary.totalDiff >= 0 ? '+' : ''}{formatCurrency(summary.totalDiff).replace(' ج.م', '')}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">من تاريخ</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="form-input"
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">إلى تاريخ</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="form-input"
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">كود الوحدة</label>
            <input
              type="text"
              value={filters.vanCode}
              onChange={(e) => handleFilterChange('vanCode', e.target.value)}
              className="form-input"
              placeholder="مثال: 231"
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">المحافظة</label>
            <select
              value={filters.governorate}
              onChange={(e) => handleFilterChange('governorate', e.target.value)}
              className="form-input form-select"
            >
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
            <label className="form-label">الأساس</label>
            <select
              value={filters.basis}
              onChange={(e) => handleFilterChange('basis', e.target.value)}
              className="form-input form-select"
            >
              <option value="AUTO_BSS">تلقائي (BSS)</option>
              <option value="MANUAL">يدوي</option>
              <option value="VOICE">صوتي</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Mode Tabs */}
      <Tabs
        tabs={[
          { id: 'DAILY', label: 'يومي' },
          { id: 'CUMULATIVE_10D', label: 'تراكمي 10 أيام' },
        ]}
        activeTab={filters.mode}
        onChange={(mode) => { handleFilterChange('mode', mode); setPage(1); }}
      />

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
                <th>مسؤول المبيعات</th>
                <th style={{ textAlign: 'center' }}>الخطوط</th>
                <th style={{ textAlign: 'center' }}>ADSL</th>
                <th style={{ textAlign: 'right' }}>المدخول</th>
                <th style={{ textAlign: 'right' }}>BSS</th>
                <th style={{ textAlign: 'right' }}>الفرق</th>
                <th>الحالة</th>
                <th>الأساس</th>
                {filters.mode === 'CUMULATIVE_10D' && (
                  <>
                    <th style={{ textAlign: 'center' }}>الجلسات</th>
                    <th>فترة</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.map((entry, _index) => (
                <tr key={entry.id} style={{ cursor: 'pointer' }}>
                  <td>{entry.date}</td>
                  <td>
                    <Badge variant="neutral">{entry.vanCode}</Badge>
                  </td>
                  <td>{entry.location}</td>
                  <td>
                    <Badge variant="neutral" style={{ fontSize: '0.625rem' }}>{entry.governorate}</Badge>
                  </td>
                  <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.agentName}
                  </td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(entry.totalLines)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(entry.totalADSL)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(entry.enteredAmount)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(entry.bssAmount)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      color: getStatusColor(entry.status),
                      fontWeight: 600,
                      fontSize: '0.8125rem'
                    }}>
                      {entry.difference >= 0 ? '+' : ''}{formatCurrency(entry.difference)}
                    </span>
                  </td>
                  <td>
                    <Badge
                      variant={
                        entry.status === 'matched' ? 'success' :
                        entry.status === 'excess' ? 'warning' :
                        entry.status === 'shortage' ? 'error' : 'neutral'
                      }
                    >
                      {entry.status === 'matched' ? 'مطابق' :
                       entry.status === 'excess' ? 'زيادة' :
                       entry.status === 'shortage' ? 'نقص' : 'معلق'}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant="neutral" style={{ fontSize: '0.625rem' }}>
                      {entry.source === 'BSS' ? 'BSS' : entry.source === 'MANUAL' ? 'يدوي' : 'صوتي'}
                    </Badge>
                  </td>
                  {filters.mode === 'CUMULATIVE_10D' && (
                    <>
                      <td style={{ textAlign: 'center' }}>{entry.bssSessionsCount || 1}</td>
                      <td style={{ fontSize: '0.75rem' }}>
                        {entry.minDate && entry.maxDate && entry.minDate !== entry.maxDate
                          ? `${entry.minDate} → ${entry.maxDate}`
                          : entry.minDate || '-'}
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {paginatedEntries.length === 0 && (
                <tr>
                  <td colSpan={filters.mode === 'CUMULATIVE_10D' ? 15 : 13} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">🔍</div>
                      <h3 className="empty-state-title">لا توجد بيانات</h3>
                      <p className="empty-state-description">جرب تغيير الفلاتر أو نطاق التاريخ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {entries.length > pageSize && (
          <div className="card-footer" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              السابق
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              التالي
            </Button>
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-neutral-500)', fontSize: '0.8125rem' }}>
              الصفحة {page} من {totalPages} (إجمالي {entries.length} سجل)
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}