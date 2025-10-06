import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null, // user object or null if logged out

  reducers: {
    // ✅ Set user object (on login or fetch)
    setUser: (state, action) => action.payload,

    // ✅ Update addresses in user object
    setUserAddresses: (state, action) => {
      if (state) {
        state.addresses = action.payload; // replaces existing addresses
      }
    },

    // ✅ Logout user
    logout: () => null,
  },
});

export const { setUser, setUserAddresses, logout } =
  userSlice.actions;

export default userSlice.reducer;
