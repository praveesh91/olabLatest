import { createSlice } from "@reduxjs/toolkit";

const successSlice = createSlice({
  name: "success",
  initialState: {
    inventoryPage: null,
    productPage: null,
  },
  reducers: {
    setSuccess: (state: any, action) => {
      let key = action.payload.context;
      state[key] = action.payload.msg;
      return state;
    },
    resetSuccess: (state: any, action) => {
      let key = action.payload.context;
      state[key] = null;
      return state;
    },
  },
});

export const { setSuccess, resetSuccess } = successSlice.actions;
export default successSlice.reducer;
