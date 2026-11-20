import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Select } from '@we/shared/ui';
import { formatNumber, formatDate } from '@we/shared/utils';
import { useAuth } from '@we/shared/auth';
import type { LeaveType, LeaveRequest, LeaveBalance } from '@we/shared/types';

export function MyLeavesPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    dateFrom: '2026-01-01',
    dateTo: '2026-12-31',
    status: '',
  });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveType: 'annual' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });

  const { data: leaves = [], isLoading, refetch } = useQuery<LeaveRequest[]>({
    queryKey: ['myLeaves', user?.id, filters],
    queryFn: async () => {
      const res = await api.getLeaves({
        agentId: user?.id,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        status: filters.status || undefined,
      });
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user?.id,
  });

  const { data: balanceResponse } = useQuery<LeaveBalance[]>({
    queryKey: ['leaveBalance', user?.id],
    queryFn: async () => {
      const res = await api.getLeaveBalances({ vanCode: user?.vanCode || '' });
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user?.id,
  });

  const createLeave = useMutation({
    mutationFn: async (leave: Omit<LeaveRequest, 'id' | 'agentId' | 'agentName' | 'vanCode' | 'governorate' | 'daysCount' | 'status' | 'requestedAt' | 'reviewedAt' | 'reviewedBy' | 'notes'>) => {
      const res = await api.createLeaveRequest({ ...leave, agentId: user?.id });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      setShowRequestModal(false);
      setNewLeave({ leaveType: 'annual', startDate: '', endDate: '', reason: '' });
      refetch();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const balance: Record<string, { total: number; used: number; remaining: number }> = balanceResponse?.[0]?.balances || {};

  const leaveTypeLabels: Record<string, string> = {
    annual: 'سنوية',
    sick: 'مرضية',
    casual: 'عارضة',
    emergency: 'طارئة',
    maternity: 'ولادة',
    paternity: 'أبوة',
    unpaid: 'بدون راتب',
  };

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
            إجازاتي
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            طلبات الإجازات والرصيد المتاح
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowRequestModal(true)} icon="➕">
          طلب إجازة جديدة
        </Button>
      </div>

      {/* Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        {Object.entries(balance).map(([type, data]) => (
          <Card key={type} style={{ background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600, textTransform: 'uppercase' }}>
                {leaveTypeLabels[type] || type}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-900)' }}>
                {data.remaining} / {data.total}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>
                مستخدم: {data.used}
              </p>
            </div>
          </Card>
        ))}
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
            <label className="form-label">الحالة</label>
            <Select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              options={[
                { value: '', label: 'الكل' },
                { value: 'pending', label: 'قيد الانتظار' },
                { value: 'approved', label: 'مقبولة' },
                { value: 'rejected', label: 'مرفوضة' },
                { value: 'cancelled', label: 'ملغية' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Leaves List */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>النوع</th>
                <th>من</th>
                <th>إلى</th>
                <th>الأيام</th>
                <th>الحالة</th>
                <th>السبب</th>
                <th>تاريخ الطلب</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td><Badge variant="neutral">{leaveTypeLabels[leave.leaveType] || leave.leaveType}</Badge></td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td style={{ textAlign: 'center' }}>{formatNumber(leave.daysCount)}</td>
                  <td>
                    <Badge variant={
                      leave.status === 'approved' ? 'success' :
                      leave.status === 'rejected' ? 'error' :
                      leave.status === 'cancelled' ? 'neutral' : 'warning'
                    }>
                      {leave.status === 'approved' ? 'مقبولة' :
                       leave.status === 'rejected' ? 'مرفوضة' :
                       leave.status === 'cancelled' ? 'ملغية' : 'قيد الانتظار'}
                    </Badge>
                  </td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leave.reason}</td>
                  <td>{formatDate(leave.requestedAt)}</td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">🏖️</div>
                      <h3 className="empty-state-title">لا توجد طلبات إجازة</h3>
                      <p className="empty-state-description">لم تقم بطلب أي إجازات بعد</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Request Modal */}
      {showRequestModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <Card style={{ maxWidth: 500, width: '90%', margin: 'auto' }}>
            <div className="card-header">
              <h3 className="card-title">طلب إجازة جديدة</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); createLeave.mutate(newLeave); }} className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label className="form-label">نوع الإجازة *</label>
                <Select
                  value={newLeave.leaveType}
                  onChange={e => setNewLeave({...newLeave, leaveType: e.target.value as LeaveType})}
                  options={[
                    { value: 'annual', label: 'سنوية' },
                    { value: 'sick', label: 'مرضية' },
                    { value: 'casual', label: 'عارضة' },
                    { value: 'emergency', label: 'طارئة' },
                    { value: 'maternity', label: 'ولادة' },
                    { value: 'paternity', label: 'أبوة' },
                    { value: 'unpaid', label: 'بدون راتب' },
                  ]}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="form-label">تاريخ البداية *</label>
                  <input type="date" value={newLeave.startDate} onChange={e => setNewLeave({...newLeave, startDate: e.target.value})} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">تاريخ النهاية *</label>
                  <input type="date" value={newLeave.endDate} onChange={e => setNewLeave({...newLeave, endDate: e.target.value})} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">السبب *</label>
                <textarea value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} className="form-input" rows={3} required placeholder="اكتب سبب الإجازة..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <Button type="button" variant="ghost" onClick={() => setShowRequestModal(false)}>إلغاء</Button>
                <Button type="submit" loading={createLeave.isPending}>
                  {createLeave.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}