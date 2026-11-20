import type { WEUser, UserRole, ResourceType } from '../types';
export declare function hasPermission(user: WEUser | null, resource: ResourceType, action: 'read' | 'write' | 'delete' | 'export', scope?: 'own' | 'van' | 'governorate' | 'all'): boolean;
export declare function canRead(user: WEUser | null, resource: ResourceType, scope?: 'own' | 'van' | 'governorate' | 'all'): boolean;
export declare function canWrite(user: WEUser | null, resource: ResourceType, scope?: 'own' | 'van' | 'governorate' | 'all'): boolean;
export declare function canDelete(user: WEUser | null, resource: ResourceType, scope?: 'own' | 'van' | 'governorate' | 'all'): boolean;
export declare function canExport(user: WEUser | null, resource: ResourceType, scope?: 'own' | 'van' | 'governorate' | 'all'): boolean;
export declare function isAdmin(user: WEUser | null): boolean;
export declare function isSupervisorOrAbove(user: WEUser | null): boolean;
export declare function isFinanceOrAbove(user: WEUser | null): boolean;
export declare function isStockManagerOrAbove(user: WEUser | null): boolean;
export declare function isHROrAbove(user: WEUser | null): boolean;
export declare function isAgentOrSeller(user: WEUser | null): boolean;
export declare function isSupervisorOrAdmin(user: WEUser | null): boolean;
export declare function getUserDataScope(user: WEUser | null, resource: ResourceType): 'own' | 'van' | 'governorate' | 'all';
export declare function filterByDataScope<T extends {
    vanCode?: string;
    governorate?: string;
    agentId?: string;
}>(user: WEUser | null, items: T[], resource: ResourceType): T[];
export interface RouteGuardConfig {
    requiredRole?: UserRole;
    requiredPermission?: {
        resource: ResourceType;
        action: 'read' | 'write' | 'delete' | 'export';
    };
    allowedRoles?: UserRole[];
    redirectTo?: string;
}
export declare function checkRouteAccess(user: WEUser | null, config: RouteGuardConfig): {
    allowed: boolean;
    redirectTo?: string;
};
export declare const APP_PERMISSIONS: {
    readonly 'we-review': {
        readonly requiredRole: UserRole;
        readonly requiredPermission: {
            readonly resource: ResourceType;
            readonly action: "read";
        };
        readonly description: "تطبيق المراجعة والتقارير - للمشرفين والإدارة والمالية";
    };
    readonly 'we-emp': {
        readonly allowedRoles: UserRole[];
        readonly requiredPermission: {
            readonly resource: ResourceType;
            readonly action: "write";
        };
        readonly description: "تطبيق الموظف - لمسؤولي المبيعات";
    };
    readonly 'we-inv': {
        readonly requiredRole: UserRole;
        readonly requiredPermission: {
            readonly resource: ResourceType;
            readonly action: "read";
        };
        readonly description: "تطبيق المخزون والإجازات - للمخازن وشؤون الموظفين والمشرفين";
    };
};
export declare const FEATURE_FLAGS: Record<UserRole, string[]>;
export declare function hasFeature(user: WEUser | null, feature: string): boolean;
//# sourceMappingURL=index.d.ts.map