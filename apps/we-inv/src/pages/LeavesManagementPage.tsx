import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@we/shared/api';
import { Card, Badge, Button, Select, Input } from '@we/shared/ui';
import { formatDate, formatNumber } from '@we/shared/utils';

export function LeavesManagementPage() {
  const [filters, setFilters] = useState({
    agentId: '',
    vanCode: '',
    governorate: '',
    leaveType: '',
    status: '',
    dateFrom: '2026-01-01',
    dateTo: '2026-12-31',
    page: 1,
    pageSize: 50,
  });

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['leaves', filters],
    queryFn: async () => {
      const res = await api.getLeaves(filters);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const leaves = response || [];
  const meta = { total: leaves.length, page: filters.page, pageSize: filters.pageSize, totalPages: 1 };

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
            إدارة الإجازات الشاملة
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            مراجعة واعتماد طلبات الإجازات لجميع الموظفين
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={() => alert('تصدير الإجازات')} icon="📥">
            تصدير
          </Button>
          <Button variant="primary" onClick={() => refetch()} icon="🔄">
            تحديث
          </Button>
        </div>
      </div>

      <Card>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">الموظف</label>
            <Input type="text" value={filters.agentId} onChange={e => setFilters(f => ({ ...f, agentId: e.target.value, page: 1 }))} className="form-input" placeholder="كود أو اسم الموظف" />
          </div>
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
            <label className="form-label">نوع الإجازة</label>
            <Select
              value={filters.leaveType}
              onChange={e => setFilters(f => ({ ...f, leaveType: e.target.value, page: 1 }))}
              options={[
                { value: '', label: 'الكل' },
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
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">الحالة</label>
            <Select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
              options={[
                { value: '', label: 'الكل' },
                { value: 'pending', label: 'قيد الانتظار' },
                { value: 'approved', label: 'مقبولة' },
                { value: 'rejected', label: 'مرفوضة' },
                { value: 'cancelled', label: 'ملغية' },
              ]}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">من تاريخ</label>
            <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value, page: 1 }))} className="form-input" />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">إلى تاريخ</label>
            <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value, page: 1 }))} className="form-input" />
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>الموظف</th>
                <th>الوحدة</th>
                <th>المحافظة</th>
                <th>نوع الإجازة</th>
                <th>من</th>
                <th>إلى</th>
                <th>الأيام</th>
                <th>الحالة</th>
                <th>تاريخ الطلب</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, _i) => (
                <tr key={leave.id}>
                  <td>{leave.agentName}</td>
                  <td><Badge variant="neutral">{leave.vanCode}</Badge></td>
                  <td>{leave.governorate}</td>
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
                  <td>{formatDate(leave.requestedAt)}</td>
                  <td>
                    {leave.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Button size="sm" variant="success" onClick={() => approveLeave(leave.id)}>اعتماد</Button>
                        <Button size="sm" variant="error" onClick={() => rejectLeave(leave.id)}>رفض</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="empty-state">
                      <div className="empty-state-icon">🏖️</div>
                      <h3 className="empty-state-title">لا توجد طلبات إجازة</h3>
                      <p className="empty-state-description">لا توجد طلبات إجازة للفلاتر المحددة</p>
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
              الصفحة {filters.page} من {meta.totalPages} (إجمالي {meta.total} طلب)
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}

const leaveTypeLabels: Record<string, string> = {
  annual: 'سنوية',
  sick: 'مرضية',
  casual: 'عارضة',
  emergency: 'طارئة',
  maternity: 'ولادة',
  paternity: 'أبوة',
  unpaid: 'بدون راتب',
};

const approveLeave = (id: string) => {
  alert(`اعتماد الإجازة ${id} - سيتم تنفيذ API`);
};

const rejectLeave = (id: string) => {
  alert(`رفض الإجازة ${id} - سيتم تنفيذ API`);
};