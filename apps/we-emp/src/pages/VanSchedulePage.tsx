import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button } from '@we/shared/ui';
import { useAuth } from '@we/shared/auth';

interface ScheduleEntry {
  id: string;
  date: string;
  vanCode: string;
  location: string;
  governorate: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  notes?: string;
}

export function VanSchedulePage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    dateFrom: '2026-11-01',
    dateTo: '2026-11-10',
    vanCode: user?.vanCode || '',
  });

  const { data: schedule = [], isLoading, refetch } = useQuery<ScheduleEntry[]>({
    queryKey: ['vanSchedule', filters],
    queryFn: async () => {
      const res = await api.getVanSchedule({
        vanCode: filters.vanCode || undefined,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!filters.vanCode,
  });

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
            جدول الوحدة المتنقلة
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            خطة حركة الوحدة والموقع اليومي
          </p>
        </div>
        <Button variant="primary" onClick={() => refetch()} icon="🔄">
          تحديث
        </Button>
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
            <input type="text" value={filters.vanCode} onChange={e => setFilters(f => ({ ...f, vanCode: e.target.value }))} className="form-input" placeholder="كود الوحدة" />
          </div>
          <Button variant="primary" onClick={() => refetch()} style={{ height: 'fit-content' }} icon="🔄">
            تحديث
          </Button>
        </div>
      </Card>

      {/* Schedule */}
      <Card>
        <div className="card-header">
          <h3 className="card-title">خطة الحركة اليومية</h3>
        </div>
        <div className="card-body">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>كود الوحدة</th>
                  <th>الموقع</th>
                  <th>المحافظة</th>
                  <th>الحالة</th>
                  <th>ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td><Badge variant="neutral">{entry.vanCode}</Badge></td>
                    <td>{entry.location}</td>
                    <td>{entry.governorate}</td>
                    <td>
                      <Badge variant={
                        entry.status === 'ACTIVE' ? 'success' :
                        entry.status === 'MAINTENANCE' ? 'warning' : 'neutral'
                      }>
                        {entry.status === 'ACTIVE' ? 'نشط' :
                         entry.status === 'MAINTENANCE' ? 'صيانة' : 'غير نشط'}
                      </Badge>
                    </td>
                    <td>{entry.notes || '-'}</td>
                  </tr>
                ))}
                {schedule.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                      <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <h3 className="empty-state-title">لا يوجد جدول</h3>
                        <p className="empty-state-description">لا توجد بيانات جدول للفترة المحددة</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}