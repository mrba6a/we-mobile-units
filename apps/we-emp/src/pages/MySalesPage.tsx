import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button } from '@we/shared/ui';
import { formatNumber, formatCurrency } from '@we/shared/utils';
import { useAuth } from '@we/shared/auth';

interface SaleEntry {
  id: string;
  date: string;
  vanCode: string;
  location: string;
  totalLines: number;
  totalADSL: number;
  totalAmount: number;
  mobileCash: number;
  mobileVisa: number;
  mobileExempt: number;
}

export function MySalesPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    dateFrom: '2026-11-01',
    dateTo: '2026-11-10',
  });

  const { data: sales = [], isLoading, refetch } = useQuery<SaleEntry[]>({
    queryKey: ['mySales', user?.id, filters],
    queryFn: async () => {
      const res = await api.getMySales({
        agentId: user?.id,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user?.id,
  });

  const totalLines = sales.reduce((s: number, r: SaleEntry) => s + (r.totalLines || 0), 0);
  const totalAmount = sales.reduce((s: number, r: SaleEntry) => s + (r.totalAmount || 0), 0);
  const totalADSL = sales.reduce((s: number, r: SaleEntry) => s + (r.totalADSL || 0), 0);

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
            مبيعاتي
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            متابعة أدائي ومبيعاتي الشخصية
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
            من:
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))} className="form-input" style={{ width: 'auto', minWidth: 160 }} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
            إلى:
            <input type="date" value={filters.dateTo} onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))} className="form-input" style={{ width: 'auto', minWidth: 160 }} />
          </label>
          <Button variant="primary" onClick={() => refetch()} icon="🔄">
            تحديث
          </Button>
        </div>
      </div>

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
      </div>

      <Card>
        <div className="card-header">
          <h3 className="card-title">تفاصيل المبيعات اليومية</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>الوحدة</th>
                <th>الموقع</th>
                <th style={{ textAlign: 'center' }}>الخطوط</th>
                <th style={{ textAlign: 'center' }}>ADSL</th>
                <th style={{ textAlign: 'right' }}>المبلغ</th>
                <th style={{ textAlign: 'right' }}>كاش</th>
                <th style={{ textAlign: 'right' }}>فيزا</th>
                <th style={{ textAlign: 'right' }}>معفي</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.date}</td>
                  <td><Badge variant="neutral">{sale.vanCode}</Badge></td>
                  <td>{sale.location}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(sale.totalLines)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(sale.totalADSL)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(sale.totalAmount)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(sale.mobileCash)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(sale.mobileVisa)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(sale.mobileExempt)}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📊</div>
                      <h3 className="empty-state-title">لا توجد مبيعات</h3>
                      <p className="empty-state-description">لا توجد بيانات مبيعات لهذا النطاق الزمني</p>
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