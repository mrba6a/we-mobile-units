import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';
import { api } from '@we/shared/api';
import { Card, Button, Input } from '@we/shared/ui';

export function ChangePinPage() {
  const navigate = useNavigate();
  useAuth(); // for auth context
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!oldPin.trim()) {
      setError('PIN الحالي مطلوب');
      return;
    }
    if (!newPin.trim()) {
      setError('PIN الجديد مطلوب');
      return;
    }
    if (newPin.length < 4) {
      setError('PIN الجديد يجب أن يكون 4 أرقام على الأقل');
      return;
    }
    if (newPin !== confirmPin) {
      setError('تأكيد PIN غير متطابق');
      return;
    }
    if (newPin === oldPin) {
      setError('PIN الجديد يجب أن يكون مختلف عن PIN الحالي');
      return;
    }

    setIsLoading(true);

    try {
      // Use changePin API for PIN change
      const response = await api.changePin(oldPin, newPin);

      if (response.success) {
        alert('تم تغيير PIN بنجاح');
        navigate('/dashboard');
      } else {
        setError(response.error || 'فشل في تغيير PIN');
      }
    } catch {
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
      background: 'linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-neutral-50) 100%)'
    }}>
      <Card style={{ maxWidth: 420, width: '100%', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ borderBottom: 'none', background: 'transparent', paddingBottom: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 'var(--radius-2xl)',
              background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>WE</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 'var(--space-1)' }}>
              تغيير PIN الإجباري
            </h2>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem', margin: 0 }}>
              يجب تغيير PIN الخاص بك قبل المتابعة
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-body" style={{ paddingTop: 'var(--space-4)' }}>
          {error && (
            <div style={{
              background: 'var(--color-error-50)',
              border: '1px solid var(--color-error-200)',
              color: 'var(--color-error-600)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-4)',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label">1. PIN الحالي *</label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showOldPin ? 'text' : 'password'}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                placeholder="أدخل PIN الحالي"
                autoComplete="current-password"
                required
                disabled={isLoading}
                style={{ paddingLeft: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowOldPin(!showOldPin)}
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-neutral-400)',
                  cursor: 'pointer',
                  padding: 'var(--space-1)',
                  fontSize: '1rem'
                }}
              >
                {showOldPin ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label">2. PIN الجديد *</label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showNewPin ? 'text' : 'password'}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="أدخل PIN الجديد (4 أرقام على الأقل)"
                autoComplete="new-password"
                required
                disabled={isLoading}
                style={{ paddingLeft: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-neutral-400)',
                  cursor: 'pointer',
                  padding: 'var(--space-1)',
                  fontSize: '1rem'
                }}
              >
                {showNewPin ? '🙈' : '👁️'}
              </button>
            </div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
              يجب أن يكون 4 أرقام على الأقل، مختلف عن PIN الحالي
            </p>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label">3. تأكيد PIN الجديد *</label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showConfirmPin ? 'text' : 'password'}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="أعد كتابة PIN الجديد للتأكيد"
                autoComplete="new-password"
                required
                disabled={isLoading}
                style={{ paddingLeft: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-neutral-400)',
                  cursor: 'pointer',
                  padding: 'var(--space-1)',
                  fontSize: '1rem'
                }}
              >
                {showConfirmPin ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            style={{ marginBottom: 'var(--space-4)' }}
          >
            تغيير PIN
          </Button>
        </form>

        <div className="card-footer" style={{ borderTop: '1px solid var(--color-neutral-200)', paddingTop: 'var(--space-4)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', margin: 0 }}>
            إصدار 1.0.0 | نظام آمن ومشفر
          </p>
        </div>
      </Card>
    </div>
  );
}