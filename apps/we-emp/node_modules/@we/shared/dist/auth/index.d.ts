export interface JWTPayload {
    sub: string;
    username: string;
    name: string;
    role: string;
    vanCode?: string;
    governorate?: string;
    iat: number;
    exp: number;
    mustChangePassword?: boolean;
}
export declare function decodeJWT(token: string): any | null;
export declare function isTokenExpired(token: string): boolean;
export declare function getTokenRemainingTime(token: string): number;
declare const PIN_STORAGE_KEY = "we_user_pins_v1";
declare const ENCRYPTION_KEY_NAME = "we_pin_encryption_key";
export declare function encryptPIN(empId: string, pin: string): Promise<string>;
export declare function decryptPIN(encryptedData: string): Promise<{
    empId: string;
    pin: string;
} | null>;
export declare function storePIN(empId: string, pin: string): Promise<void>;
export declare function getStoredPIN(empId: string): Promise<string | null>;
export declare function removePIN(empId: string): Promise<void>;
export declare function hasCustomPIN(empId: string): Promise<boolean>;
export declare function clearAllPINs(): Promise<void>;
declare const USERS_STORAGE_KEY = "we_users_v1";
export interface StoredUser {
    id: string;
    username: string;
    name: string;
    role: string;
    vanCode?: string;
    governorate?: string;
    email?: string;
    phone?: string;
    passwordHash: string;
    mustChangePassword: boolean;
    createdAt: string;
    createdBy?: string;
    isActive: boolean;
}
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
export declare function localLogin(identifier: string, pin: string): Promise<{
    user: any;
    token: string;
    forcePinChange?: boolean;
} | null>;
export declare function initializeDefaultUsers(): Promise<void>;
export declare function getAllUsers(): Promise<any[]>;
export declare function getUserById(id: string): Promise<any | null>;
export declare function getUserByUsername(username: string): Promise<any | null>;
export declare function getUserByEmpId(empId: string): Promise<any | null>;
export declare function createUser(userData: any): Promise<any>;
export declare function updateUser(id: string, updates: any): Promise<any | null>;
export declare function deleteUser(id: string): Promise<boolean>;
export declare function resetUserPassword(id: string, newPassword: string): Promise<boolean>;
export declare function getDefaultPIN(empId: string): string;
export declare function validatePassword(password: string): {
    valid: boolean;
    error?: string;
};
export declare const ROLE_HIERARCHY: Record<string, number>;
export declare function hasRole(userRole: string, requiredRole: string): boolean;
export declare function canAccessResource(user: {
    permissions: any[];
}, resource: string, action: string): boolean;
export declare function getDataScope(user: {
    permissions: any[];
}, resource: string): 'own' | 'van' | 'governorate' | 'all';
export declare const DEFAULT_PERMISSIONS: Record<string, Array<{
    resource: string;
    actions: string[];
    scope: string;
}>>;
export declare function buildPermissions(role: string, _vanCode?: string, _governorate?: string): any[];
export { AuthProvider, useAuth } from './AuthContext';
export interface AuthState {
    user: any | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
export declare function createInitialAuthState(): any;
export { PIN_STORAGE_KEY, ENCRYPTION_KEY_NAME, USERS_STORAGE_KEY };
//# sourceMappingURL=index.d.ts.map