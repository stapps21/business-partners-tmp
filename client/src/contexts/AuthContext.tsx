import { createContext, ReactNode, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../../../server/src/enum/UserRoles.ts'
import { USER_ROLES } from "../../../server/src/enum/UserRoles.ts";
import PersistentLogin from "../components/PersistentLogin.tsx";

// Add a new type for User with roles
interface UserType {
    id: number;
    firstName: string,
    lastName: string,
    mail: string,
    roles: USER_ROLES[];
}

export interface AuthContextType {
    accessToken: string | null;
    user: UserType | null;
    isAdmin: boolean;
    login: (accessToken: string, firstName: string, lastName: string, mail: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const login = (accessToken: string, firstName: string, lastName: string, mail: string) => {
        setAccessToken(accessToken)
        const decoded = jwtDecode<{ user: { id: number, roles: USER_ROLES[] } }>(accessToken);
        const roles = decoded.user.roles.map(role => parseInt(role as unknown as string))
        setUser({
            id: decoded.user.id,
            firstName,
            lastName,
            mail,
            roles: roles
        });
        setIsAdmin(roles.includes(USER_ROLES.ADMIN))
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null)
        setIsAdmin(false)
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, accessToken }}>
            <PersistentLogin>
                {children}
            </PersistentLogin>
        </AuthContext.Provider>
    );
};

export default AuthProvider