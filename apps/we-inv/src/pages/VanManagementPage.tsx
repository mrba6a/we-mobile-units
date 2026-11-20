import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Select, Input } from '@we/shared/ui';

interface Van {
  id: string;
  code: string;
  plate: string;
  name: string;
  gov: string;
  ouCode: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  isOfficeDefault?: boolean;
}

export function VanManagementPage() {
  const [filters, setFilters] = useState({
    vanCode: '',
    governorate: '',
    status: '',
    page: 1,
    pageSize: 50,
  });

  const { data: vans, isLoading, refetch } = useQuery({
    queryKey: ['vans', filters],
    queryFn: async () => {
      const res = await api.getVans(filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const vansData = vans || [];
  const meta = { total: vansData.length, page: filters.page, pageSize: filters.pageSize, totalPages: 1 };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
            إدارة الوحدات المتنقلة
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            إدارة بيانات الوحدات، المواقع، والمحافظات
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => alert('تصدير الوحدات')} icon="📥">
            تصدير
          </Button>
          <Button variant="primary" onClick={() => alert('إضافة وحدة - سيتم تطويرها لاحقاً')} icon="➕">
            إضافة وحدة
          </Button>
          <Button variant="primary" onClick={() => refetch()} icon="🔄">
            تحديث
          </Button>
        </div>
      </div>

      <Card>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">كود الوحدة</label>
            <Input type="text" value={filters.vanCode} onChange={e => setFilters(f => ({ ...f, vanCode: e.target.value, page: 1 }))} className="form-input" placeholder="كود الوحدة" />
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
            <label className="form-label">الحالة</label>
            <Select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
              options={[
                { value: '', label: 'الكل' },
                { value: 'ACTIVE', label: 'نشط' },
                { value: 'MAINTENANCE', label: 'صيانة' },
                { value: 'INACTIVE', label: 'غير نشط' },
              ]}
            />
          </div>
          <Button variant="primary" onClick={() => refetch()} style={{ height: 'fit-content' }} icon="🔄">
            بحث
          </Button>
        </div>
      </Card>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>كود الوحدة</th>
                <th>اللوحة</th>
                <th>الاسم</th>
                <th>المحافظة</th>
                <th>رمز الوحدة (OU)</th>
                <th>الحالة</th>
                <th>مكتب افتراضي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {vansData.map((van: Van, _i) => (
                <tr key={van.id}>
                  <td><Badge variant="neutral">{van.code}</Badge></td>
                  <td>{van.plate}</td>
                  <td>{van.name}</td>
                  <td>{van.gov}</td>
                  <td>{van.ouCode}</td>
                  <td>
                    <Badge variant={
                      van.status === 'ACTIVE' ? 'success' :
                      van.status === 'MAINTENANCE' ? 'warning' : 'neutral'
                    }>
                      {van.status === 'ACTIVE' ? 'نشط' : van.status === 'MAINTENANCE' ? 'صيانة' : 'غير نشط'}
                    </Badge>
                  </td>
                  <td>{van.isOfficeDefault ? '✅ نعم' : '❌ لا'}</td>
                  <td>
                    <Button size="sm" variant="outline" onClick={() => {}}>تعديل</Button>
                  </td>
                </tr>
              ))}
              {vansData.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">🚐</div>
                      <h3 className="empty-state-title">لا توجد وحدات</h3>
                      <p className="empty-state-description">لا توجد وحدات للفلاتر المحددة</p>
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
              الصفحة {filters.page} من {meta.totalPages} (إجمالي {meta.total} وحدة)
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}