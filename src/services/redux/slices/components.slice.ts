import { createSlice } from "@reduxjs/toolkit";
import listWarehouses from "../../apis/app-settings/warehouses/list-warehouses.service";

const resetState = {
  warehouses: {
    list: [],
  },
};

const componentsSlice = createSlice({
  name: "components",
  initialState: {
    warehouses: {
      list: [],
    },
  },
  reducers: {
    setWarehouses: (state: any, action) => {
      state["warehouses"]["list"] = action.payload.list;
      return state;
    },
    reset: () => {
      return resetState;
    },
  },
});

export const performFetchWarehouseList = () => async (dispatch: any) => {
  listWarehouses().then((res) => {
    dispatch(setWarehouses({ list: res.data }));
  });
};

export const { setWarehouses, reset } = componentsSlice.actions;
export default componentsSlice.reducer;
