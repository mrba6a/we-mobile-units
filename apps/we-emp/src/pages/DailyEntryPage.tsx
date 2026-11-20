import { useState } from 'react';
import { Card, Button, Input, Select, Tabs } from '@we/shared/ui';

export function DailyEntryPage() {
  const [vanCode, setVanCode] = useState('');
  const [location, setLocation] = useState('');
  const [agentCount, setAgentCount] = useState(1);
  const [agents, setAgents] = useState<Array<{id: string, name: string}>>([{id: '', name: ''}]);

  const handleAddAgent = () => {
    if (agents.length >= 12) return;
    setAgents([...agents, {id: '', name: ''}]);
  };

  const handleRemoveAgent = (index: number) => {
    if (agents.length <= 1) return;
    setAgents(agents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit daily entry
    alert('سيتم حفظ البيان اليومي');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
            البيان اليومي
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
            إدخال بيانات المبيعات والخطوط والتعاقدات اليومية
          </p>
        </div>
        <Button variant="primary" onClick={handleSubmit} size="lg">
          حفظ البيان
        </Button>
      </div>

      <Card>
        <div className="card-header">
          <h3 className="card-title">معلومات الوحدة</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label">كود الوحدة *</label>
            <Input
              type="text"
              value={vanCode}
              onChange={(e) => setVanCode(e.target.value)}
              placeholder="مثال: 231"
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label">الموقع *</label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="مثال: شنشور - أشمون"
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label className="form-label">عدد مسؤولي المبيعات *</label>
            <Select
              value={String(agentCount)}
              onChange={(e) => setAgentCount(Number(e.target.value))}
              options={Array.from({length: 12}, (_, i) => ({value: String(i+1), label: String(i+1)}))}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="card-header">
          <h3 className="card-title">مسؤولي المبيعات اليوم</h3>
        </div>
        <div className="card-body">
          {agents.map((agent, index) => (
            <div key={index} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', padding: 'var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label">المسؤول {index + 1}</label>
                <Input
                  type="text"
                  value={agent.name}
                  onChange={(e) => {
                    const newAgents = [...agents];
                    newAgents[index] = {...agent, name: e.target.value};
                    setAgents(newAgents);
                  }}
                  placeholder="اسم المسؤول"
                />
              </div>
              {agents.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAgent(index)}
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 'auto', height: 'fit-content' }}
                >
                  حذف
                </button>
              )}
            </div>
          ))}
          {agents.length < 12 && (
            <button type="button" onClick={handleAddAgent} className="btn btn-outline" style={{ marginTop: 'var(--space-4)' }}>
              + إضافة مسؤول آخر
            </button>
          )}
        </div>
      </Card>

      <Tabs
        tabs={[
          { id: 'lines', label: 'الخطوط والباقات', icon: '📱' },
          { id: 'adsl', label: 'ADSL والإنترنت', icon: '🌐' },
          { id: 'devices', label: 'الأجهزة', icon: '📱' },
          { id: 'amounts', label: 'المبالغ', icon: '💰' },
        ]}
        activeTab="lines"
        onChange={() => {}}
      />

      <Card>
        <div className="card-body">
          <p style={{ color: 'var(--color-neutral-500)', textAlign: 'center', padding: 'var(--space-10)' }}>
            نموذج البيان اليومي - سيتم تطوير الحقول التفصيلية لكل تبويب
          </p>
        </div>
      </Card>
    </div>
  );
}