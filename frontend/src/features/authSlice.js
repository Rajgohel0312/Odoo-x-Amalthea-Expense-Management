import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, 
  token: null,
  isAuthenticated: false,
  loading: true,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {

    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setRole: (state, action) => {
        if (state.user) {
            state.user.role = action.payload;
        }
    }
  },
});

export const { loginSuccess, logout, setRole } = authSlice.actions;

export default authSlice.reducer;