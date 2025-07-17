import {create} from "zustand";

export type CurrentUser = {
    id: string;
    publicKey: string;
    privateKey: string;
} | null;

export interface UserStore {
    user: CurrentUser | null;
    setUser: (user: CurrentUser | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({user}),
}));