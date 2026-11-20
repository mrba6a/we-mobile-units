import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, StatCard, Badge } from '@we/shared/ui';
import { formatNumber, formatCurrency } from '@we/shared/utils';
import { useState } from 'react';
import type { FinanceFilters } from '@we/shared/types';

interface DashboardStats {
  totalEntries: number;
  matched: number;
  excess: number;
  shortage: number;
  pending: number;
  totalEnteredAmount: number;
  totalBSSAmount: number;
  totalDifference: number;
  matchRate: number;
  byGovernorate: Array<{ governorate: string; count: number; entered: number; bss: number; diff: number }>;
  byVan: Array<{ vanCode: string; count: number; entered: number; bss: number; diff: number }>;
  topDiscrepancies: Array<{ vanCode: string; agent: string; diff: number; type: string }>;
}

export function DashboardPage() {
  const [filters, setFilters] = useState<FinanceFilters>({
    dateFrom: '2026-11-01',
    dateTo: '2026-11-10',
    vanCode: '',
    governorate: '',
    groupBy: 'van',
  });

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardStats', filters],
    queryFn: async () => {
      const response = await api.getFinanceComparison({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        vanCode: filters.vanCode || undefined,
        governorate: filters.governorate || undefined,
        groupBy: filters.groupBy,
      });
      if (!response.success) throw new Error(response.error);
      return response.data as DashboardStats;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ maxWidth: 600, margin: 'var(--space-6) auto' }}>
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3 className="empty-state-title">تعذر تحميل البيانات</h3>
            <p className="empty-state-description">{error.message}</p>
            <button className="btn btn-primary" onClick={() => refetch()}>
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const s = stats || {
    totalEntries: 0,
    matched: 0,
    excess: 0,
    shortage: 0,
    pending: 0,
    totalEnteredAmount: 0,
    totalBSSAmount: 0,
    totalDifference: 0,
    matchRate: 0,
    byGovernorate: [],
    byVan: [],
    topDiscrepancies: [],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
            لوحة تحكم المراجعة والتقارير
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            نظرة شاملة على التسويات المالية والتقارير للفترة المحددة
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
            من:
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              className="form-input"
              style={{ width: 'auto', minWidth: 160 }}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
            إلى:
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              className="form-input"
              style={{ width: 'auto', minWidth: 160 }}
            />
          </label>
          <button className="btn btn-primary" onClick={() => refetch()} disabled={!filters.dateFrom || !filters.dateTo}>
            تحديث
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <StatCard
          title="إجمالي السجلات"
          value={formatNumber(s.totalEntries)}
          icon="📋"
          color="primary"
          trend="neutral"
        />
        <StatCard
          title="مطابق"
          value={formatNumber(s.matched)}
          change={s.totalEntries > 0 ? Number(((s.matched / s.totalEntries) * 100).toFixed(1)) : 0}
          icon="✅"
          color="success"
          trend="up"
        />
        <StatCard
          title="زيادة"
          value={formatNumber(s.excess)}
          change={s.totalEntries > 0 ? Number(((s.excess / s.totalEntries) * 100).toFixed(1)) : 0}
          icon="⬆️"
          color="warning"
          trend="down"
        />
        <StatCard
          title="نقص"
          value={formatNumber(s.shortage)}
          change={s.totalEntries > 0 ? Number(((s.shortage / s.totalEntries) * 100).toFixed(1)) : 0}
          icon="⬇️"
          color="error"
          trend="down"
        />
        <StatCard
          title="مبلغ مدخول"
          value={formatCurrency(s.totalEnteredAmount)}
          icon="💵"
          color="secondary"
        />
        <StatCard
          title="مبلغ BSS"
          value={formatCurrency(s.totalBSSAmount)}
          icon="🏦"
          color="primary"
        />
        <StatCard
          title="الفرق"
          value={formatCurrency(s.totalDifference)}
          icon="📊"
          color={s.totalDifference > 0 ? 'warning' : s.totalDifference < 0 ? 'error' : 'success'}
        />
        <StatCard
          title="معدل المطابقة"
          value={`${s.matchRate}%`}
          icon="🎯"
          color={s.matchRate >= 95 ? 'success' : s.matchRate >= 85 ? 'warning' : 'error'}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
        {/* By Governorate */}
        <Card>
          <div className="card-header">
            <h3 className="card-title">الأداء حسب المحافظة</h3>
          </div>
          <div className="card-body">
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>المحافظة</th>
                    <th style={{ textAlign: 'center' }}>السجلات</th>
                    <th style={{ textAlign: 'right' }}>المدخول</th>
                    <th style={{ textAlign: 'right' }}>BSS</th>
                    <th style={{ textAlign: 'right' }}>الفرق</th>
                  </tr>
                </thead>
                <tbody>
                  {s.byGovernorate.slice(0, 10).map((g, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{g.governorate}</td>
                      <td style={{ textAlign: 'center' }}>{formatNumber(g.count)}</td>
                      <td>{formatCurrency(g.entered)}</td>
                      <td>{formatCurrency(g.bss)}</td>
                      <td>
                        <Badge
                          variant={g.diff > 0 ? 'warning' : g.diff < 0 ? 'error' : 'success'}
                        >
                          {g.diff >= 0 ? '+' : ''}{formatCurrency(g.diff)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Top Discrepancies */}
        <Card>
          <div className="card-header">
            <h3 className="card-title">أكبر الفروقات</h3>
          </div>
          <div className="card-body">
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>الوحدة</th>
                    <th>المسؤول</th>
                    <th style={{ textAlign: 'right' }}>الفرق</th>
                    <th>النوع</th>
                  </tr>
                </thead>
                <tbody>
                  {s.topDiscrepancies.slice(0, 10).map((d, i) => (
                    <tr key={i}>
                      <td><Badge variant="neutral">{d.vanCode}</Badge></td>
                      <td>{d.agent}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ color: d.type === 'excess' ? 'var(--color-warning-600)' : 'var(--color-error-600)', fontWeight: 600 }}>
                          {d.diff >= 0 ? '+' : ''}{formatCurrency(Math.abs(d.diff))}
                        </span>
                      </td>
                      <td>
                        <Badge variant={d.type === 'excess' ? 'warning' : 'error'}>
                          {d.type === 'excess' ? 'زيادة' : 'نقص'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="card-header">
          <h3 className="card-title">إجراءات سريعة</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <a href="/reconciliation" className="btn btn-primary">
            ⚖️ فتح التسوية
          </a>
          <a href="/finance" className="btn btn-secondary">
            💰 المقارنة المالية
          </a>
          <a href="/monthly" className="btn btn-secondary">
            📅 التقارير الشهرية
          </a>
          <a href="/historical" className="btn btn-secondary">
            📈 التحليل التاريخي
          </a>
          <a href="/master-preview" className="btn btn-secondary">
            📋 معاينة الشيت الرئيسي
          </a>
        </div>
      </Card>
    </div>
  );
}