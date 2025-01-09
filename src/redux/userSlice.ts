import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: string | null;
    email: string | null;
    username: string | null;
    role: string | null;
    lastLogin: string | null;
}

const initialState: UserState = {
    id: null,
    email: null,
    username: null,
    role: null,
    lastLogin: null,
};

// Fonction pour récupérer l'utilisateur depuis localStorage
const getUserFromLocalStorage = (): UserState => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : initialState;
};

const userSlice = createSlice({
    name: 'user',
    initialState: getUserFromLocalStorage(), // On charge l'état de l'utilisateur depuis localStorage
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            const user = action.payload;
            localStorage.setItem('user', JSON.stringify(user)); // Sauvegarde dans localStorage
            return { ...state, ...user };
        },
        clearUser(state) {
            localStorage.removeItem('user'); // Supprime l'utilisateur de localStorage
            return initialState;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
