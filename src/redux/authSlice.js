import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    logOut: (state) => {
      state.user = null;
      state.loading = false;
    },
    setRole: (state, action) => {
      if (state.user) state.user.role = action.payload;
    },
  },
});

export const { setUser, logOut, setRole } = authSlice.actions;
export default authSlice.reducer;
