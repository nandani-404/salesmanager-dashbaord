import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface User {
    id: number;
    name: string;
    role: string;
    mobile: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Check for token in cookies on initial load
const token = Cookies.get('token');
const userStr = Cookies.get('user');
const user = userStr ? JSON.parse(userStr) : null;

const initialState: AuthState = {
    user: user,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;

            // Allow secure false for dev (http)
            Cookies.set('token', action.payload.token, { expires: 7, sameSite: 'lax', secure: false });
            Cookies.set('user', JSON.stringify(action.payload.user), { expires: 7, sameSite: 'lax', secure: false });
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            Cookies.remove('token');
            Cookies.remove('user');
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
