import { createSlice } from '@reduxjs/toolkit';

const demoUser = {
    displayName: 'Amro Gad',
    email: 'amro@blooddono.com',
    photoURL: '/images/person-avatar.png',
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
    },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
