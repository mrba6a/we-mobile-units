import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';
import { api } from '@we/shared/api';
import { Card, Button, Input } from '@we/shared/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [empId, setEmpId] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!empId.trim()) {
      setError('رقم العامل مطلوب');
      return;
    }
    if (!pin.trim()) {
      setError('PIN مطلوب');
      return;
    }
    if (pin.length < 4) {
      setError('PIN يجب أن يكون 4 أرقام على الأقل');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.login(empId.trim().toUpperCase(), pin);

      if (response.success && response.data) {
        await login(response.data.user, response.data.token);

        if (response.data.forcePinChange) {
          navigate('/change-pin');
        } else {
          navigate('/review');
        }
      } else {
        setError(response.error || 'رقم العامل أو PIN غير صحيح');
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
              الإدارة العامة للوحدات المتنقلة
            </h2>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem', margin: 0 }}>
              نظام المراجعة والتقارير
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ paddingTop: 'var(--space-4)' }}>
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
            <label className="form-label">1. رقم العامل / اسم المستخدم *</label>
            <Input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              placeholder="أدخل رقم العامل (مثال: 113985 أو admin)"
              autoComplete="username"
              inputMode="numeric"
              required
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label">2. الرمز السري (PIN) *</label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="أدخل PIN الخاص بك"
                autoComplete="current-password"
                required
                disabled={isLoading}
                style={{ paddingLeft: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
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
                {showPin ? '🙈' : '👁️'}
              </button>
            </div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', marginTop: 'var(--space-1)' }}>
              أدخل رقم العامل أولاً للتحقق من حالة تفعيل الحساب
            </p>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: 18, height: 18, accentColor: 'var(--color-primary-600)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)' }}>
                تذكرني لمدة 30 يوماً
              </span>
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            style={{ marginBottom: 'var(--space-4)' }}
          >
            تسجيل الدخول
          </Button>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <button
              type="button"
              onClick={() => alert('لإعادة تعيين PIN، يرجى التواصل مع الإدارة')}
              className="btn btn-ghost btn-sm"
              style={{ padding: 0 }}
            >
              نسيت PIN؟
            </button>
            <span style={{ color: 'var(--color-neutral-400)' }}>
              للإدارة العامة للوحدات المتنقلة - WE
            </span>
          </div>
        </form>

        <div style={{ borderTop: '1px solid var(--color-neutral-200)', paddingTop: 'var(--space-4)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', margin: 0 }}>
            إصدار 1.0.0 | نظام آمن ومشفر
          </p>
        </div>
      </Card>
    </div>
  );
}