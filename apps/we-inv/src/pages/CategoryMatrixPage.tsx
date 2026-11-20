import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Select } from '@we/shared/ui';
import { formatCurrency } from '@we/shared/utils';

export function CategoryMatrixPage() {
  const [filters, setFilters] = useState({
    category: '',
    governorate: '',
    page: 1,
    pageSize: 50,
  });

  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['categories', filters],
    queryFn: async () => {
      const res = await api.getCategories(filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const categoriesData = categories || [];
  const meta = { total: categoriesData.length, page: filters.page, pageSize: filters.pageSize, totalPages: 1 };

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
            مصفوفة الفئات والأسعار
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            أسعار المنتجات والخدمات، باقات الخطوط، أجهزة، وخدمات أخرى
          </p>
        </div>
        <Button variant="primary" onClick={() => refetch()} icon="🔄">
          تحديث
        </Button>
      </div>

      <Card>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">الفئة</label>
            <Select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))}
              options={[
                { value: '', label: 'الكل' },
                { value: 'WE Life', label: 'WE Life' },
                { value: 'WE Mix 250', label: 'WE Mix 250' },
                { value: 'WE Mix 355', label: 'WE Mix 355' },
                { value: 'WE Gold', label: 'WE Gold (Postpaid)' },
                { value: 'MNP', label: 'MNP (حول رقمك)' },
                { value: 'E-SIM', label: 'E-SIM' },
                { value: 'Wallet', label: 'Wallet' },
                { value: 'Students', label: 'خطوط الطلبة' },
                { value: 'Gas', label: 'خطوط الغاز' },
                { value: 'Initiative', label: 'خطوط المبادرة' },
                { value: 'ADSL', label: 'ADSL' },
                { value: 'Fixed Lines', label: 'Fixed Lines' },
                { value: 'Routers', label: 'Routers' },
                { value: 'WE Air', label: 'WE Air' },
                { value: 'ONT', label: 'ONT' },
                { value: 'CPE', label: 'CPE' },
                { value: 'Mi-Fi', label: 'Mi-Fi' },
              ]}
            />
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
        </div>
      </Card>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>الفئة</th>
                <th>المنتج/الباقة</th>
                <th>السعر</th>
                <th>الوصف</th>
                <th>المحافظة</th>
                <th>نشط</th>
                <th>تاريخ التحديث</th>
              </tr>
            </thead>
            <tbody>
              {categoriesData.map((cat: any, _i: number) => (
                <tr key={cat.id}>
                  <td><Badge variant="neutral">{cat.category}</Badge></td>
                  <td>{cat.product}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(cat.price)}</td>
                  <td>{cat.description || '-'}</td>
                  <td>{cat.governorate}</td>
                  <td>
                    <Badge variant={cat.active ? 'success' : 'neutral'}>
                      {cat.active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </td>
                  <td>{cat.updatedAt ? new Date(cat.updatedAt).toLocaleDateString('ar-EG') : '-'}</td>
                </tr>
              ))}
              {categoriesData.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📊</div>
                      <h3 className="empty-state-title">لا توجد فئات</h3>
                      <p className="empty-state-description">لا توجد فئات للفلاتر المحددة</p>
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
              الصفحة {filters.page} من {meta.totalPages} (إجمالي {meta.total} فئة)
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}