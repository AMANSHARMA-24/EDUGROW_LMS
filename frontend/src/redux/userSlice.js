import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    adminUsersData : null
   
  },
  reducers: {

    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setAdminUsersData: (state, action) => {
      state.adminUsersData = action.payload;
    },
  
  }
});

export const {
  setUserData,
  setAdminUsersData
} = userSlice.actions;

export default userSlice.reducer;