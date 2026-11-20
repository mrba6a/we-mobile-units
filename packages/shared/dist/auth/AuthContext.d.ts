import { ReactNode } from 'react';
import type { WEUser } from '../types';
interface AuthContextType {
    user: WEUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: WEUser, token: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: Partial<WEUser>) => void;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useAuth(): AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map