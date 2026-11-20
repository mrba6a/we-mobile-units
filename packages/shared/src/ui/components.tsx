import { forwardRef, ReactNode } from 'react';

// ==================== Button ====================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, leftIcon, rightIcon, icon, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantStyles = {
      primary: 'bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-700)] text-white shadow-md hover:from-[var(--color-primary-700)] hover:to-[var(--color-primary-800)] hover:shadow-lg hover:-translate-y-0.5',
      secondary: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-200)]',
      success: 'bg-[var(--color-success-500)] text-white hover:bg-[var(--color-success-600)]',
      warning: 'bg-[var(--color-warning-500)] text-white hover:bg-[var(--color-warning-600)]',
      error: 'bg-[var(--color-error-500)] text-white hover:bg-[var(--color-error-600)]',
      ghost: 'bg-transparent text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]',
      outline: 'bg-transparent border border-[var(--color-neutral-300)] text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] hover:border-[var(--color-neutral-400)]',
    };

    const sizeStyles = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const style = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
      <button
        ref={ref}
        className={style}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && (leftIcon || icon) && <span>{leftIcon || icon}</span>}
        {children}
        {!loading && rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ==================== Input ====================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

    return (
      <div className={className} style={{ marginBottom: 'var(--space-4)' }}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {leftIcon && (
            <div style={{
              position: 'absolute',
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-neutral-400)',
              pointerEvents: 'none'
            }}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`form-input ${error ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-100)]' : ''} ${leftIcon ? 'pr-10' : ''} ${rightIcon ? 'pl-10' : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div style={{
              position: 'absolute',
              left: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-neutral-400)',
              pointerEvents: 'none'
            }}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="form-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="form-hint">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ==================== Select ====================
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2)}`;

    return (
      <div className={className} style={{ marginBottom: 'var(--space-4)' }}>
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`form-input form-select ${error ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-100)]' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="form-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="form-hint">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ==================== Badge ====================
export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'neutral', size = 'md', className = '', style }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
    success: 'bg-[var(--color-success-50)] text-[var(--color-success-700)]',
    warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)]',
    error: 'bg-[var(--color-error-50)] text-[var(--color-error-700)]',
    info: 'bg-[var(--color-secondary-50)] text-[var(--color-secondary-700)]',
    neutral: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[0.5625rem]',
    md: 'px-2 py-0.5 text-[0.6875rem]',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{ whiteSpace: 'nowrap', ...style }}
    >
      {children}
    </span>
  );
}

// ==================== Card ====================
export interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', style, padding = 'md', hoverable, onClick }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`card ${hoverable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      style={{ padding: paddingStyles[padding], ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`card-title ${className}`}>{children}</h3>;
}

// ==================== DataTable ====================
export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T, index: number) => void;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export interface DataTableColumn<T> {
  key: string;
  label: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T, index: number) => ReactNode;
  sticky?: 'left' | 'right';
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  striped = false,
  bordered = true,
  hoverable = true,
  emptyMessage = 'لا توجد بيانات',
  loading = false,
  className = '',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="table-container" style={{ minHeight: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <div className="loading-spinner" style={{ width: 40, height: 40 }} />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-container" style={{ minHeight: 200 }}>
        <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">لا توجد بيانات</h3>
          <p className="empty-state-description">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className={`table ${striped ? 'striped' : ''} ${bordered ? '' : 'border-none'} ${hoverable ? 'hoverable' : ''}`}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  width: col.width,
                  textAlign: col.align || 'right',
                  whiteSpace: 'nowrap',
                  minWidth: col.width ? undefined : '100px',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item, index)}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                ...(onRowClick && { transition: 'background var(--transition-fast)' }),
              }}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  style={{
                    textAlign: col.align || 'right',
                    whiteSpace: 'nowrap',
                    width: col.width,
                  }}
                >
                  {col.render ? col.render(item[col.key as keyof T], item, index) : String(item[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== Tabs ====================
export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'line' | 'enclosed' | 'soft' | 'pills';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'line', fullWidth, className = '' }: TabsProps) {
  const variantStyles = {
    line: 'border-b border-[var(--color-neutral-200)]',
    enclosed: 'bg-[var(--color-neutral-100)] rounded-xl p-1',
    soft: '',
    pills: '',
  };

  return (
    <div className={`tabs ${variantStyles[variant]} ${className}`} style={{ display: 'flex', ...(fullWidth ? { width: '100%' } : {}) }} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-disabled={tab.disabled}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.id)}
          className={`
            flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${activeTab === tab.id
              ? variant === 'enclosed'
                ? 'bg-white text-[var(--color-primary-700)] shadow-sm'
                : variant === 'pills'
                ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                : 'text-[var(--color-primary-700)] border-b-2 border-[var(--color-primary-600)]'
              : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]'
            }
          `}
          style={{
            borderBottom: variant === 'line' && activeTab === tab.id ? '2px solid var(--color-primary-600)' : undefined,
            marginBottom: variant === 'line' && activeTab === tab.id ? '-1px' : undefined,
            flex: fullWidth ? 1 : undefined,
          }}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
          {tab.badge && (
            <Badge variant="error" size="sm">{tab.badge}</Badge>
          )}
        </button>
      ))}
    </div>
  );
}

// ==================== StatCard ====================
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function StatCard({ title, value, change, changeLabel, icon, trend = 'neutral', color = 'primary', className = '' }: StatCardProps) {
  const colorStyles = {
    primary: 'bg-[var(--color-primary-50)] border-[var(--color-primary-200)] text-[var(--color-primary-900)]',
    secondary: 'bg-[var(--color-secondary-50)] border-[var(--color-secondary-200)] text-[var(--color-secondary-900)]',
    success: 'bg-[var(--color-success-50)] border-[var(--color-success-200)] text-[var(--color-success-900)]',
    warning: 'bg-[var(--color-warning-50)] border-[var(--color-warning-200)] text-[var(--color-warning-900)]',
    error: 'bg-[var(--color-error-50)] border-[var(--color-error-200)] text-[var(--color-error-900)]',
  };

  const trendColor = trend === 'up' ? 'var(--color-success-600)' : trend === 'down' ? 'var(--color-error-600)' : 'var(--color-neutral-600)';
  const trendIcon = trend === 'up' ? '⬆️' : trend === 'down' ? '⬇️' : '➡️';

  return (
    <div className={`card ${colorStyles[color]} ${className}`} style={{ background: `var(--color-${color}-50)`, borderColor: `var(--color-${color}-200)`, color: `var(--color-${color}-900)` }}>
      <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
        {icon && <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>{icon}</div>}
        <p style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>
          {title}
        </p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          {value}
        </p>
        {change !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)' }}>
            <span style={{ color: trendColor, fontSize: '0.75rem', fontWeight: 600 }}>
              {trendIcon} {Math.abs(change)}%
            </span>
            {changeLabel && <span style={{ fontSize: '0.6875rem', opacity: 0.7 }}>{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Charts ====================
// Charts are re-exported from recharts in the apps that use them
// export { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Types are already exported above with their component definitions
// No need to re-export them here