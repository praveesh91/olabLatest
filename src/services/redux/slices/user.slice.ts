import { createSlice } from "@reduxjs/toolkit";
import getMetaData from "../../apis/app-settings/get-metadata.service";
import login from "../../apis/users/signup-login/login.service";
import localStore from "../../local-storage.service";
import { updateAllSetting } from "./meta-data.slice";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStore.get("user"),
    client: localStore.get("client"),
    token: localStore.get("token"),
  },
  reducers: {
    updateUser: (state, action) => {
      state["user"] = action.payload.user;
      state["token"] = action.payload.token;
      state["client"] = action.payload.client;
      return state;
    },
  },
});

export const performLoginSteps =
  (body: any, successCB?: () => void, failureCB?: () => void) =>
  async (dispatch: any) => {
    try {
      let data: any = await login({body:body});
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("token", JSON.stringify(data.data.token));
      localStorage.setItem("client", JSON.stringify(data.data.client));
      dispatch(updateUser(data.data));
      data = await getMetaData(body);
      dispatch(updateAllSetting(data.data));
      if (successCB) {
        successCB();
      }
    } catch (error) {
      console.log(error);
      if (failureCB) {
        failureCB();
      }
    }
  };
export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
