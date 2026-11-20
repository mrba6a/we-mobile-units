import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
export const Button = forwardRef(({ variant = 'primary', size = 'md', loading, fullWidth, leftIcon, rightIcon, icon, children, className = '', disabled, ...props }, ref) => {
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
    return (_jsxs("button", { ref: ref, className: style, disabled: disabled || loading, ...props, children: [loading && (_jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })), !loading && (leftIcon || icon) && _jsx("span", { children: leftIcon || icon }), children, !loading && rightIcon && _jsx("span", { children: rightIcon })] }));
});
Button.displayName = 'Button';
export const Input = forwardRef(({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
    return (_jsxs("div", { className: className, style: { marginBottom: 'var(--space-4)' }, children: [label && (_jsx("label", { htmlFor: inputId, className: "form-label", children: label })), _jsxs("div", { style: { position: 'relative' }, children: [leftIcon && (_jsx("div", { style: {
                            position: 'absolute',
                            right: 'var(--space-3)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-neutral-400)',
                            pointerEvents: 'none'
                        }, children: leftIcon })), _jsx("input", { ref: ref, id: inputId, className: `form-input ${error ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-100)]' : ''} ${leftIcon ? 'pr-10' : ''} ${rightIcon ? 'pl-10' : ''}`, "aria-invalid": error ? 'true' : 'false', "aria-describedby": error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined, ...props }), rightIcon && (_jsx("div", { style: {
                            position: 'absolute',
                            left: 'var(--space-3)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-neutral-400)',
                            pointerEvents: 'none'
                        }, children: rightIcon }))] }), error && (_jsx("p", { id: `${inputId}-error`, className: "form-error", role: "alert", children: error })), hint && !error && (_jsx("p", { id: `${inputId}-hint`, className: "form-hint", children: hint }))] }));
});
Input.displayName = 'Input';
export const Select = forwardRef(({ label, error, hint, options, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2)}`;
    return (_jsxs("div", { className: className, style: { marginBottom: 'var(--space-4)' }, children: [label && (_jsx("label", { htmlFor: selectId, className: "form-label", children: label })), _jsx("select", { ref: ref, id: selectId, className: `form-input form-select ${error ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-[var(--color-error-100)]' : ''}`, "aria-invalid": error ? 'true' : 'false', "aria-describedby": error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined, ...props, children: options.map(opt => (_jsx("option", { value: opt.value, disabled: opt.disabled, children: opt.label }, opt.value))) }), error && (_jsx("p", { id: `${selectId}-error`, className: "form-error", role: "alert", children: error })), hint && !error && (_jsx("p", { id: `${selectId}-hint`, className: "form-hint", children: hint }))] }));
});
Select.displayName = 'Select';
export function Badge({ children, variant = 'neutral', size = 'md', className = '', style }) {
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
    return (_jsx("span", { className: `inline-flex items-center font-bold rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`, style: { whiteSpace: 'nowrap', ...style }, children: children }));
}
export function Card({ children, className = '', style, padding = 'md', hoverable, onClick }) {
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8',
    };
    return (_jsx("div", { className: `card ${hoverable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`, style: { padding: paddingStyles[padding], ...style }, onClick: onClick, children: children }));
}
export function CardHeader({ children, className = '' }) {
    return _jsx("div", { className: `card-header ${className}`, children: children });
}
export function CardBody({ children, className = '' }) {
    return _jsx("div", { className: `card-body ${className}`, children: children });
}
export function CardFooter({ children, className = '' }) {
    return _jsx("div", { className: `card-footer ${className}`, children: children });
}
export function CardTitle({ children, className = '' }) {
    return _jsx("h3", { className: `card-title ${className}`, children: children });
}
export function DataTable({ columns, data, keyExtractor, onRowClick, striped = false, bordered = true, hoverable = true, emptyMessage = 'لا توجد بيانات', loading = false, className = '', }) {
    if (loading) {
        return (_jsx("div", { className: "table-container", style: { minHeight: 200 }, children: _jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }, children: _jsx("div", { className: "loading-spinner", style: { width: 40, height: 40 } }) }) }));
    }
    if (data.length === 0) {
        return (_jsx("div", { className: "table-container", style: { minHeight: 200 }, children: _jsxs("div", { className: "empty-state", style: { padding: 'var(--space-10)' }, children: [_jsx("div", { className: "empty-state-icon", children: "\uD83D\uDCCB" }), _jsx("h3", { className: "empty-state-title", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A" }), _jsx("p", { className: "empty-state-description", children: emptyMessage })] }) }));
    }
    return (_jsx("div", { className: `table-container ${className}`, children: _jsxs("table", { className: `table ${striped ? 'striped' : ''} ${bordered ? '' : 'border-none'} ${hoverable ? 'hoverable' : ''}`, children: [_jsx("thead", { children: _jsx("tr", { children: columns.map(col => (_jsx("th", { style: {
                                width: col.width,
                                textAlign: col.align || 'right',
                                whiteSpace: 'nowrap',
                                minWidth: col.width ? undefined : '100px',
                            }, children: col.label }, col.key))) }) }), _jsx("tbody", { children: data.map((item, index) => (_jsx("tr", { onClick: () => onRowClick?.(item, index), style: {
                            cursor: onRowClick ? 'pointer' : 'default',
                            ...(onRowClick && { transition: 'background var(--transition-fast)' }),
                        }, children: columns.map(col => (_jsx("td", { style: {
                                textAlign: col.align || 'right',
                                whiteSpace: 'nowrap',
                                width: col.width,
                            }, children: col.render ? col.render(item[col.key], item, index) : String(item[col.key] ?? '') }, col.key))) }, keyExtractor(item)))) })] }) }));
}
export function Tabs({ tabs, activeTab, onChange, variant = 'line', fullWidth, className = '' }) {
    const variantStyles = {
        line: 'border-b border-[var(--color-neutral-200)]',
        enclosed: 'bg-[var(--color-neutral-100)] rounded-xl p-1',
        soft: '',
        pills: '',
    };
    return (_jsx("div", { className: `tabs ${variantStyles[variant]} ${className}`, style: { display: 'flex', ...(fullWidth ? { width: '100%' } : {}) }, role: "tablist", children: tabs.map(tab => (_jsxs("button", { role: "tab", "aria-selected": activeTab === tab.id, "aria-disabled": tab.disabled, disabled: tab.disabled, onClick: () => !tab.disabled && onChange(tab.id), className: `
            flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${activeTab === tab.id
                ? variant === 'enclosed'
                    ? 'bg-white text-[var(--color-primary-700)] shadow-sm'
                    : variant === 'pills'
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                        : 'text-[var(--color-primary-700)] border-b-2 border-[var(--color-primary-600)]'
                : 'text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]'}
          `, style: {
                borderBottom: variant === 'line' && activeTab === tab.id ? '2px solid var(--color-primary-600)' : undefined,
                marginBottom: variant === 'line' && activeTab === tab.id ? '-1px' : undefined,
                flex: fullWidth ? 1 : undefined,
            }, children: [tab.icon && _jsx("span", { children: tab.icon }), tab.label, tab.badge && (_jsx(Badge, { variant: "error", size: "sm", children: tab.badge }))] }, tab.id))) }));
}
export function StatCard({ title, value, change, changeLabel, icon, trend = 'neutral', color = 'primary', className = '' }) {
    const colorStyles = {
        primary: 'bg-[var(--color-primary-50)] border-[var(--color-primary-200)] text-[var(--color-primary-900)]',
        secondary: 'bg-[var(--color-secondary-50)] border-[var(--color-secondary-200)] text-[var(--color-secondary-900)]',
        success: 'bg-[var(--color-success-50)] border-[var(--color-success-200)] text-[var(--color-success-900)]',
        warning: 'bg-[var(--color-warning-50)] border-[var(--color-warning-200)] text-[var(--color-warning-900)]',
        error: 'bg-[var(--color-error-50)] border-[var(--color-error-200)] text-[var(--color-error-900)]',
    };
    const trendColor = trend === 'up' ? 'var(--color-success-600)' : trend === 'down' ? 'var(--color-error-600)' : 'var(--color-neutral-600)';
    const trendIcon = trend === 'up' ? '⬆️' : trend === 'down' ? '⬇️' : '➡️';
    return (_jsx("div", { className: `card ${colorStyles[color]} ${className}`, style: { background: `var(--color-${color}-50)`, borderColor: `var(--color-${color}-200)`, color: `var(--color-${color}-900)` }, children: _jsxs("div", { className: "card-body", style: { textAlign: 'center', padding: 'var(--space-4)' }, children: [icon && _jsx("div", { style: { fontSize: '1.5rem', marginBottom: 'var(--space-2)' }, children: icon }), _jsx("p", { style: { fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', marginBottom: 'var(--space-1)' }, children: title }), _jsx("p", { style: { fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }, children: value }), change !== undefined && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)' }, children: [_jsxs("span", { style: { color: trendColor, fontSize: '0.75rem', fontWeight: 600 }, children: [trendIcon, " ", Math.abs(change), "%"] }), changeLabel && _jsx("span", { style: { fontSize: '0.6875rem', opacity: 0.7 }, children: changeLabel })] }))] }) }));
}
