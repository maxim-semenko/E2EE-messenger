import {createContext, type Dispatch, type SetStateAction, useContext} from 'react';

export type UserContextType = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
};

export type User = {
    id: string;
    publicKey: string;
    privateKey: string;
} | null;


const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return ctx;
};

export default UserContext;
