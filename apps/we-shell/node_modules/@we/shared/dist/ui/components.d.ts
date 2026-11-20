import { ReactNode } from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    icon?: ReactNode;
}
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    options: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
}
export declare const Select: import("react").ForwardRefExoticComponent<SelectProps & import("react").RefAttributes<HTMLSelectElement>>;
export interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}
export declare function Badge({ children, variant, size, className, style }: BadgeProps): import("react").JSX.Element;
export interface CardProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    onClick?: () => void;
}
export declare function Card({ children, className, style, padding, hoverable, onClick }: CardProps): import("react").JSX.Element;
export declare function CardHeader({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export declare function CardBody({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export declare function CardFooter({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export declare function CardTitle({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
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
export declare function DataTable<T>({ columns, data, keyExtractor, onRowClick, striped, bordered, hoverable, emptyMessage, loading, className, }: DataTableProps<T>): import("react").JSX.Element;
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
export declare function Tabs({ tabs, activeTab, onChange, variant, fullWidth, className }: TabsProps): import("react").JSX.Element;
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
export declare function StatCard({ title, value, change, changeLabel, icon, trend, color, className }: StatCardProps): import("react").JSX.Element;
//# sourceMappingURL=components.d.ts.map