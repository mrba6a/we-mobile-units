// WE Mobile Units - Authentication Utilities
export function decodeJWT(token) {
    try {
        // Handle local development tokens (local_<base64>)
        if (token.startsWith('local_')) {
            const base64 = token.slice(6);
            const decoded = decodeURIComponent(atob(base64));
            return JSON.parse(decoded);
        }
        // Handle standard JWT
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload;
    }
    catch {
        return null;
    }
}
export function isTokenExpired(token) {
    const payload = decodeJWT(token);
    if (!payload)
        return true;
    return Date.now() >= payload.exp * 1000;
}
export function getTokenRemainingTime(token) {
    const payload = decodeJWT(token);
    if (!payload)
        return 0;
    return Math.max(0, payload.exp * 1000 - Date.now());
}
// ==================== PIN Encryption (Web Crypto API) ====================
const PIN_STORAGE_KEY = 'we_user_pins_v1';
const ENCRYPTION_KEY_NAME = 'we_pin_encryption_key';
async function getOrCreateEncryptionKey() {
    const keyData = localStorage.getItem('we_pin_encryption_key');
    let key;
    if (keyData) {
        const rawKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
        key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
    }
    else {
        key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
        const exported = await crypto.subtle.exportKey('raw', key);
        localStorage.setItem('we_pin_encryption_key', btoa(String.fromCharCode(...new Uint8Array(exported))));
    }
    return key;
}
export async function encryptPIN(empId, pin) {
    const key = await getOrCreateEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(`${empId}:${pin}`);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...result));
}
export async function decryptPIN(encryptedData) {
    try {
        const key = await getOrCreateEncryptionKey();
        const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        const iv = data.slice(0, 12);
        const encrypted = data.slice(12);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
        const text = new TextDecoder().decode(decrypted);
        const [empId, pin] = text.split(':');
        return { empId, pin };
    }
    catch {
        return null;
    }
}
// ==================== PIN Storage (Encrypted) ====================
export async function storePIN(empId, pin) {
    const encrypted = await encryptPIN(empId, pin);
    const store = JSON.parse(localStorage.getItem('we_user_pins_v1') || '{}');
    store[empId.toUpperCase()] = encrypted;
    localStorage.setItem('we_user_pins_v1', JSON.stringify(store));
}
export async function getStoredPIN(empId) {
    const store = JSON.parse(localStorage.getItem('we_user_pins_v1') || '{}');
    const encrypted = store[empId.toUpperCase()];
    if (!encrypted)
        return null;
    const decrypted = await decryptPIN(encrypted);
    return decrypted?.pin || null;
}
export async function removePIN(empId) {
    const store = JSON.parse(localStorage.getItem('we_user_pins_v1') || '{}');
    delete store[empId.toUpperCase()];
    localStorage.setItem('we_user_pins_v1', JSON.stringify(store));
}
export async function hasCustomPIN(empId) {
    const store = JSON.parse(localStorage.getItem('we_user_pins_v1') || '{}');
    return !!store[empId.toUpperCase()];
}
export async function clearAllPINs() {
    localStorage.removeItem('we_user_pins_v1');
}
// ==================== User Management (Admin Functions) ====================
const USERS_STORAGE_KEY = 'we_users_v1';
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}
export async function verifyPassword(password, hash) {
    const hashBuffer = await hashPassword(password);
    return hashBuffer === hash;
}
// ==================== Local Login (Development - No API) ====================
export async function localLogin(identifier, pin) {
    await initializeDefaultUsers();
    const users = await getAllUsers();
    // Find user by empId (id) OR username
    const user = users.find(u => u.id === identifier.toUpperCase() ||
        u.username.toLowerCase() === identifier.toLowerCase()) || null;
    if (!user || !user.isActive)
        return null;
    const valid = await verifyPassword(pin, user.passwordHash);
    if (!valid)
        return null;
    // Build permissions from role
    const permissions = buildPermissions(user.role, user.vanCode, user.governorate);
    // Create a simple JWT-like token for local use
    const payload = {
        sub: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        vanCode: user.vanCode,
        governorate: user.governorate,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        mustChangePassword: user.mustChangePassword,
    };
    // Simple base64 token (not secure, just for local dev)
    // Use encodeURIComponent to handle Unicode (Arabic) characters
    const token = 'local_' + btoa(encodeURIComponent(JSON.stringify(payload)));
    const authUser = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        vanCode: user.vanCode,
        governorate: user.governorate,
        email: user.email,
        phone: user.phone,
        permissions,
        defaultPin: user.id.slice(-4),
        skipForcePin: !user.mustChangePassword,
    };
    return { user: authUser, token, forcePinChange: user.mustChangePassword };
}
export async function initializeDefaultUsers() {
    const existing = localStorage.getItem('we_users_v1');
    if (existing)
        return;
    const users = [
        {
            id: 'admin',
            username: 'admin',
            name: 'مدير النظام',
            role: 'ADMIN',
            passwordHash: await hashPassword('4195'),
            mustChangePassword: false,
            createdAt: new Date().toISOString(),
            isActive: true,
        },
        {
            id: '113976',
            username: 'Ahmed.Refaai',
            name: 'أحمد رفاعي',
            role: 'AGENT',
            vanCode: '596',
            governorate: 'القاهرة',
            email: 'ahmed.refaai@te.eg',
            phone: '01555601070',
            passwordHash: await hashPassword('7007'),
            mustChangePassword: false,
            createdAt: new Date().toISOString(),
            isActive: true,
        },
        {
            id: '113978',
            username: 'Ahmad.Abdelmohsen',
            name: 'احمد عبد المحسن عبد الحميد',
            role: 'AGENT',
            vanCode: '2346',
            governorate: 'الدقهلية',
            email: 'Ahmad.Abdelmohsen@te.eg',
            phone: '01555701000',
            passwordHash: await hashPassword('3978'),
            mustChangePassword: true,
            createdAt: new Date().toISOString(),
            isActive: true,
        },
    ];
    localStorage.setItem('we_users_v1', JSON.stringify(users));
}
export async function getAllUsers() {
    await initializeDefaultUsers();
    const stored = localStorage.getItem('we_users_v1');
    return stored ? JSON.parse(stored) : [];
}
export async function getUserById(id) {
    await initializeDefaultUsers();
    const users = await getAllUsers();
    return users.find(u => u.id === id) || null;
}
export async function getUserByUsername(username) {
    await initializeDefaultUsers();
    const users = await getAllUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}
export async function getUserByEmpId(empId) {
    await initializeDefaultUsers();
    const users = await getAllUsers();
    return users.find(u => u.id === empId) || null;
}
export async function createUser(userData) {
    await initializeDefaultUsers();
    const users = await getAllUsers();
    if (users.find(u => u.id === userData.id || u.username.toLowerCase() === userData.username.toLowerCase())) {
        throw new Error('المستخدم موجود بالفعل');
    }
    const newUser = {
        ...userData,
        passwordHash: await hashPassword(userData.password),
        createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('we_users_v1', JSON.stringify(users));
    return newUser;
}
export async function updateUser(id, updates) {
    await initializeDefaultUsers();
    const users = await getAllUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1)
        return null;
    if (updates.passwordHash && !updates.passwordHash.startsWith('hashed:')) {
        updates.passwordHash = await hashPassword(updates.passwordHash);
    }
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('we_users_v1', JSON.stringify(users));
    return users[index];
}
export async function deleteUser(id) {
    if (id === 'admin')
        return false;
    const users = await getAllUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem('we_users_v1', JSON.stringify(filtered));
    return true;
}
export async function resetUserPassword(id, newPassword) {
    const user = await getUserById(id);
    if (!user)
        return false;
    const hashed = await hashPassword(newPassword);
    return updateUser(id, { passwordHash: hashed, mustChangePassword: true }) !== null;
}
// ==================== Auth Helpers ====================
export function getDefaultPIN(empId) {
    return empId.slice(-4);
}
export function validatePassword(password) {
    if (!password)
        return { valid: false, error: 'كلمة المرور مطلوبة' };
    if (password.length < 4)
        return { valid: false, error: 'كلمة المرور يجب أن تكون 4 أحرف على الأقل' };
    if (password.length > 50)
        return { valid: false, error: 'كلمة المرور طويلة جداً' };
    return { valid: true };
}
// ==================== Role & Permission Helpers ====================
export const ROLE_HIERARCHY = {
    ADMIN: 100,
    SUPERVISOR: 80,
    FINANCE: 70,
    STOCK_MANAGER: 60,
    HR: 60,
    AGENT: 40,
    SELLER: 30,
};
export function hasRole(userRole, requiredRole) {
    return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}
export function canAccessResource(user, resource, action) {
    const permission = user.permissions.find(p => p.resource === resource);
    if (!permission)
        return false;
    return permission.actions.includes(action);
}
export function getDataScope(user, resource) {
    const permission = user.permissions.find(p => p.resource === resource);
    return permission?.scope || 'own';
}
// ==================== Default Permissions by Role ====================
export const DEFAULT_PERMISSIONS = {
    ADMIN: [
        { resource: 'reconciliation', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'finance', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'monthly', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'historical', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'dailyEntry', actions: ['read', 'write'], scope: 'all' },
        { resource: 'mySales', actions: ['read'], scope: 'all' },
        { resource: 'myLeaves', actions: ['read', 'write'], scope: 'all' },
        { resource: 'vanSchedule', actions: ['read'], scope: 'all' },
        { resource: 'stock', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'allLeaves', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'vans', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'categories', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'users', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'reports', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'whatsapp', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
    ],
    SUPERVISOR: [
        { resource: 'reconciliation', actions: ['read', 'export'], scope: 'governorate' },
        { resource: 'finance', actions: ['read', 'export'], scope: 'governorate' },
        { resource: 'monthly', actions: ['read', 'export'], scope: 'governorate' },
        { resource: 'historical', actions: ['read', 'export'], scope: 'governorate' },
        { resource: 'dailyEntry', actions: ['read'], scope: 'governorate' },
        { resource: 'mySales', actions: ['read'], scope: 'governorate' },
        { resource: 'myLeaves', actions: ['read', 'write'], scope: 'governorate' },
        { resource: 'vanSchedule', actions: ['read'], scope: 'governorate' },
        { resource: 'stock', actions: ['read', 'write'], scope: 'governorate' },
        { resource: 'allLeaves', actions: ['read', 'write'], scope: 'governorate' },
        { resource: 'vans', actions: ['read', 'write'], scope: 'governorate' },
        { resource: 'categories', actions: ['read'], scope: 'all' },
        { resource: 'users', actions: ['read'], scope: 'governorate' },
        { resource: 'reports', actions: ['read', 'export'], scope: 'governorate' },
        { resource: 'whatsapp', actions: ['read'], scope: 'governorate' },
    ],
    FINANCE: [
        { resource: 'reconciliation', actions: ['read', 'write', 'export'], scope: 'all' },
        { resource: 'finance', actions: ['read', 'write', 'export'], scope: 'all' },
        { resource: 'monthly', actions: ['read', 'export'], scope: 'all' },
        { resource: 'historical', actions: ['read', 'export'], scope: 'all' },
        { resource: 'reports', actions: ['read', 'export'], scope: 'all' },
    ],
    STOCK_MANAGER: [
        { resource: 'stock', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'vans', actions: ['read', 'write'], scope: 'all' },
        { resource: 'categories', actions: ['read', 'write'], scope: 'all' },
        { resource: 'reports', actions: ['read', 'export'], scope: 'all' },
    ],
    HR: [
        { resource: 'allLeaves', actions: ['read', 'write', 'delete', 'export'], scope: 'all' },
        { resource: 'users', actions: ['read', 'write'], scope: 'all' },
        { resource: 'reports', actions: ['read', 'export'], scope: 'all' },
    ],
    AGENT: [
        { resource: 'dailyEntry', actions: ['read', 'write'], scope: 'own' },
        { resource: 'mySales', actions: ['read'], scope: 'own' },
        { resource: 'myLeaves', actions: ['read', 'write'], scope: 'own' },
        { resource: 'vanSchedule', actions: ['read'], scope: 'own' },
        { resource: 'reconciliation', actions: ['read'], scope: 'own' },
    ],
    SELLER: [
        { resource: 'dailyEntry', actions: ['read', 'write'], scope: 'own' },
        { resource: 'mySales', actions: ['read'], scope: 'own' },
        { resource: 'myLeaves', actions: ['read', 'write'], scope: 'own' },
        { resource: 'vanSchedule', actions: ['read'], scope: 'own' },
    ],
};
export function buildPermissions(role, _vanCode, _governorate) {
    const basePerms = DEFAULT_PERMISSIONS[role] || [];
    return basePerms.map((p) => ({
        ...p,
        scope: p.scope === 'own' ? 'own' : p.scope === 'van' ? 'van' : p.scope === 'governorate' ? 'governorate' : 'all',
    }));
}
// ==================== Auth Context ====================
export { AuthProvider, useAuth } from './AuthContext';
export function createInitialAuthState() {
    return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    };
}
// Export constants
export { PIN_STORAGE_KEY, ENCRYPTION_KEY_NAME, USERS_STORAGE_KEY };
