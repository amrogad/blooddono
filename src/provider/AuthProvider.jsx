import React, { createContext } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const demoUser = {
    displayName: 'Amro Gad',
    email: 'amro@blooddono.com',
    photoURL: 'https://i.ibb.co/2K1L6N0/default-avatar.png',
};

const AuthProvider = ({ children }) => {

    const authData = {
        user: demoUser,
        loading: false,
        logOut: () => Promise.resolve(),
    };

    return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
