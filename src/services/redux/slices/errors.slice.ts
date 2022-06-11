import { createSlice } from "@reduxjs/toolkit";

const errorsSlice = createSlice({
  name: "errors",
  initialState: {
    inventoryPage: null,
    productPage: null,
    importStockPage: null,
  },
  reducers: {
    setError: (state: any, action) => {
      let key = action.payload.context;
      state[key] = action.payload.msg;
      return state;
    },
    resetError: (state: any, action) => {
      let key = action.payload.context;
      state[key] = null;
      return state;
    },
  },
});

export const { setError, resetError } = errorsSlice.actions;
export default errorsSlice.reducer;
