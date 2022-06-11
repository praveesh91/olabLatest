import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  isShow: false,
  type: "success",
  msg: {
    title: "",
    desc: "",
  },
};

const alertSlice = createSlice({
  name: "alert",
  initialState: {
    settings: defaultState,
    login: defaultState,
  },
  reducers: {
    set: (state: any, action) => {
      let key = action.payload.context;
      state[key]["msg"] = action.payload.msg;
      state[key]["type"] = action.payload.type;
      state[key]["isShow"] = true;
      return state;
    },
    reset: (state: any, action) => {
      let key = action.payload.context;
      state[key] = defaultState;
      return state;
    },
  },
});

export const { set, reset } = alertSlice.actions;
export default alertSlice.reducer;
