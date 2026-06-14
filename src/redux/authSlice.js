import { createSlice } from '@reduxjs/toolkit';

const demoUser = {
    displayName: 'Amro Gad',
    email: 'amro@blooddono.com',
    photoURL: '/images/person-avatar.png',
    role: 'admin',
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: demoUser,
        loading: false,
    },
    reducers: {
        logOut: (state) => {
            state.user = null;
        },
        setRole: (state, action) => {
            if (state.user) {
                state.user.role = action.payload;
            }
        },
    },
});

export const { logOut, setRole } = authSlice.actions;
export default authSlice.reducer;
