// WE Mobile Units - Permission Guards & RBAC Helpers

import type { WEUser, UserRole, ResourceType, Permission } from '../types';
import { ROLE_HIERARCHY, DEFAULT_PERMISSIONS, buildPermissions } from '../auth';

// ==================== Permission Checking ====================
export function hasPermission(
  user: WEUser | null,
  resource: ResourceType,
  action: 'read' | 'write' | 'delete' | 'export',
  scope?: 'own' | 'van' | 'governorate' | 'all'
): boolean {
  if (!user) return false;

  const permission = user.permissions.find(p => p.resource === resource);
  if (!permission) return false;

  if (!permission.actions.includes(action)) return false;

  if (scope && permission.scope !== scope && permission.scope !== 'all') {
    return false;
  }

  return true;
}

export function canRead(user: WEUser | null, resource: ResourceType, scope?: 'own' | 'van' | 'governorate' | 'all'): boolean {
  return hasPermission(user, resource, 'read', scope);
}

export function canWrite(user: WEUser | null, resource: ResourceType, scope?: 'own' | 'van' | 'governorate' | 'all'): boolean {
  return hasPermission(user, resource, 'write', scope);
}

export function canDelete(user: WEUser | null, resource: ResourceType, scope?: 'own' | 'van' | 'governorate' | 'all'): boolean {
  return hasPermission(user, resource, 'delete', scope);
}

export function canExport(user: WEUser | null, resource: ResourceType, scope?: 'own' | 'van' | 'governorate' | 'all'): boolean {
  return hasPermission(user, resource, 'export', scope);
}

// ==================== Role Guards ====================
export function isAdmin(user: WEUser | null): boolean {
  return user?.role === 'ADMIN';
}

export function isSupervisorOrAbove(user: WEUser | null): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY.SUPERVISOR;
}

export function isFinanceOrAbove(user: WEUser | null): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY.FINANCE;
}

export function isStockManagerOrAbove(user: WEUser | null): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY.STOCK_MANAGER;
}

export function isHROrAbove(user: WEUser | null): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY.HR;
}

export function isAgentOrSeller(user: WEUser | null): boolean {
  if (!user) return false;
  return user.role === 'AGENT' || user.role === 'SELLER';
}

export function isSupervisorOrAdmin(user: WEUser | null): boolean {
  if (!user) return false;
  return user.role === 'ADMIN' || user.role === 'SUPERVISOR';
}

// ==================== Data Scope Guards ====================
export function getUserDataScope(user: WEUser | null, resource: ResourceType): 'own' | 'van' | 'governorate' | 'all' {
  if (!user) return 'own';
  const permission = user.permissions.find(p => p.resource === resource);
  return permission?.scope || 'own';
}

export function filterByDataScope<T extends { vanCode?: string; governorate?: string; agentId?: string }>(
  user: WEUser | null,
  items: T[],
  resource: ResourceType
): T[] {
  if (!user) return [];

  const scope = getUserDataScope(user, resource);

  switch (scope) {
    case 'all':
      return items;
    case 'governorate':
      return items.filter(item => item.governorate === user.governorate);
    case 'van':
      return items.filter(item => item.vanCode === user.vanCode);
    case 'own':
    default:
      return items.filter(item => item.agentId === user.id || item.vanCode === user.vanCode);
  }
}

// ==================== Route Guards ====================
export interface RouteGuardConfig {
  requiredRole?: UserRole;
  requiredPermission?: { resource: ResourceType; action: 'read' | 'write' | 'delete' | 'export' };
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function checkRouteAccess(user: WEUser | null, config: RouteGuardConfig): { allowed: boolean; redirectTo?: string } {
  if (!user) {
    return { allowed: false, redirectTo: config.redirectTo || '/login' };
  }

  // Check role
  if (config.requiredRole && ROLE_HIERARCHY[user.role] < ROLE_HIERARCHY[config.requiredRole]) {
    return { allowed: false, redirectTo: config.redirectTo || '/unauthorized' };
  }

  if (config.allowedRoles && !config.allowedRoles.includes(user.role)) {
    return { allowed: false, redirectTo: config.redirectTo || '/unauthorized' };
  }

  // Check permission
  if (config.requiredPermission) {
    const { resource, action } = config.requiredPermission;
    if (!hasPermission(user, resource, action)) {
      return { allowed: false, redirectTo: config.redirectTo || '/unauthorized' };
    }
  }

  return { allowed: true };
}

// ==================== App-Level Permission Configs ====================
export const APP_PERMISSIONS = {
  'we-review': {
    requiredRole: 'SUPERVISOR' as UserRole,
    requiredPermission: { resource: 'reconciliation' as ResourceType, action: 'read' as const },
    description: 'تطبيق المراجعة والتقارير - للمشرفين والإدارة والمالية',
  },
  'we-emp': {
    allowedRoles: ['AGENT', 'SELLER', 'SUPERVISOR', 'ADMIN'] as UserRole[],
    requiredPermission: { resource: 'dailyEntry' as ResourceType, action: 'write' as const },
    description: 'تطبيق الموظف - لمسؤولي المبيعات',
  },
  'we-inv': {
    requiredRole: 'STOCK_MANAGER' as UserRole,
    requiredPermission: { resource: 'stock' as ResourceType, action: 'read' as const },
    description: 'تطبيق المخزون والإجازات - للمخازن وشؤون الموظفين والمشرفين',
  },
} as const;

// ==================== Feature Flags by Role ====================
export const FEATURE_FLAGS: Record<UserRole, string[]> = {
  ADMIN: [
    'reconciliation',
    'finance',
    'monthly-reports',
    'historical-reports',
    'final-sheet',
    'daily-entry',
    'my-sales',
    'my-leaves',
    'van-schedule',
    'stock-management',
    'all-leaves',
    'van-management',
    'categories',
    'user-management',
    'whatsapp-import',
    'dawry-matching',
    'settings',
    'audit-log',
  ],
  SUPERVISOR: [
    'reconciliation',
    'finance',
    'monthly-reports',
    'historical-reports',
    'daily-entry',
    'my-sales',
    'my-leaves',
    'van-schedule',
    'stock-management',
    'all-leaves',
    'van-management',
    'categories',
    'whatsapp-import',
    'dawry-matching',
  ],
  FINANCE: [
    'reconciliation',
    'finance',
    'monthly-reports',
    'historical-reports',
    'final-sheet',
    'dawry-matching',
  ],
  STOCK_MANAGER: [
    'stock-management',
    'van-management',
    'categories',
    'monthly-reports',
  ],
  HR: [
    'all-leaves',
    'user-management',
    'monthly-reports',
  ],
  AGENT: [
    'daily-entry',
    'my-sales',
    'my-leaves',
    'van-schedule',
    'reconciliation-view',
  ],
  SELLER: [
    'daily-entry',
    'my-sales',
    'my-leaves',
    'van-schedule',
  ],
};

export function hasFeature(user: WEUser | null, feature: string): boolean {
  if (!user) return false;
  return FEATURE_FLAGS[user.role]?.includes(feature) || false;
}