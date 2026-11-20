import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Select, Input } from '@we/shared/ui';
import { formatNumber, formatCurrency } from '@we/shared/utils';

export function StockManagementPage() {
  const [filters, setFilters] = useState({
    vanCode: '',
    governorate: '',
    category: '',
    lowStock: false,
    page: 1,
    pageSize: 50,
  });

  const { data: stockData, isLoading, refetch } = useQuery({
    queryKey: ['stock', filters],
    queryFn: async () => {
      const res = await api.getStock(filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const stockDataSafe = stockData || [];
  const totalItems = stockDataSafe.length;
  const lowStockCount = stockDataSafe.filter(s => s.quantity <= s.minQuantity).length;
  const outOfStockCount = stockDataSafe.filter(s => s.quantity === 0).length;

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
            إدارة المخزون
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            متابعة مخزون الوحدات، تنبيهات النقص، تحويلات المخزون
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => alert('تصدير المخزون')} icon="📥">
            تصدير Excel
          </Button>
          <Button variant="primary" onClick={() => refetch()} icon="🔄">
            تحديث
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>إجمالي الأصناف</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>{formatNumber(totalItems)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-warning-50)', borderColor: 'var(--color-warning-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-warning-700)', fontWeight: 600, textTransform: 'uppercase' }}>منخفض المخزون</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning-900)' }}>{formatNumber(lowStockCount)}</p>
          </div>
        </Card>
        <Card style={{ background: 'var(--color-error-50)', borderColor: 'var(--color-error-200)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-error-700)', fontWeight: 600, textTransform: 'uppercase' }}>ناقص المخزون</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error-900)' }}>{formatNumber(outOfStockCount)}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">الوحدة</label>
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
                { value: 'الشرقية', label: 'الشرقية' },
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
            <label className="form-label">الفئة</label>
            <Select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))}
              options={[
                { value: '', label: 'الكل' },
                { value: 'WE Air', label: 'WE Air' },
                { value: 'ONT', label: 'ONT' },
                { value: 'CPE', label: 'CPE' },
                { value: 'Mi-Fi', label: 'Mi-Fi' },
                { value: 'Sim Cards', label: 'Sim Cards' },
                { value: 'Routers', label: 'Routers' },
              ]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">
              <input type="checkbox" checked={filters.lowStock} onChange={e => setFilters(f => ({ ...f, lowStock: e.target.checked, page: 1 }))} style={{ marginLeft: 'var(--space-2)' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>منخفض المخزون فقط</span>
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>الوحدة</th>
                <th>الموقع</th>
                <th>المحافظة</th>
                <th>الفئة</th>
                <th>المنتج</th>
                <th style={{ textAlign: 'center' }}>الكمية</th>
                <th style={{ textAlign: 'center' }}>الحد الأدنى</th>
                <th style={{ textAlign: 'right' }}>القيمة</th>
                <th>الحالة</th>
                <th>آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {stockDataSafe.map((item, _i) => (
                <tr key={item.id}>
                  <td><Badge variant="neutral">{item.vanCode}</Badge></td>
                  <td>{item.location}</td>
                  <td>{item.governorate}</td>
                  <td>{item.category}</td>
                  <td>{item.product}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(item.quantity)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(item.minQuantity)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(item.quantity * (item.unitPrice || 0))}</td>
                  <td>
                    <Badge variant={
                      item.quantity === 0 ? 'error' :
                      item.quantity <= item.minQuantity ? 'warning' : 'success'
                    }>
                      {item.quantity === 0 ? 'ناقص' :
                       item.quantity <= item.minQuantity ? 'منخفض' : 'متوفر'}
                    </Badge>
                  </td>
                  <td>{item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('ar-EG') : '-'}</td>
                </tr>
              ))}
              {stockDataSafe.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📦</div>
                      <h3 className="empty-state-title">لا توجد أصناف</h3>
                      <p className="empty-state-description">لا توجد بيانات مخزون للفلاتر المحددة</p>
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