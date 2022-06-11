import { createSlice } from "@reduxjs/toolkit";
import { udpateSettingInLocalStore } from "../../setting.service";
import getMetaData from "../../apis/app-settings/get-metadata.service";
import localStore from "../../local-storage.service";
import { getObjFromList } from "../../conversion.service";
import APP_CONSTANTS from "../../../utils/constants/app.constants";
import { ECOM_CONSTANTS } from "../../../utils/constants/ecom.constants";

interface metaDataProps {}

const resetState = {
  client_settings: null,
  country_code: null,
  default_setting: null,
  id: null,
  name: null,
  is_active: null,
  permissions: null,
  source: null,
  subscription: null,
  uoms: null,
  user_settings: null,
};

const metaDataSlice = createSlice({
  name: "meta_data",
  initialState: {
    client_settings: localStore.get("client_settings"),
    country_code: localStore.get("country_code"),
    default_setting: localStore.get("default_setting"),
    id: localStore.get("id"),
    name: localStore.get("name"),
    is_active: localStore.get("is_active"),
    permissions: localStore.get("permissions"),
    source: localStore.get("source"),
    subscription: localStore.get("subscription"),
    uoms: localStore.get("uoms"),
    user_settings: localStore.get("user_settings"),
  },
  reducers: {
    updateAllSetting: (state: any, action) => {
      const settings = action.payload;
      let C = APP_CONSTANTS.SETTINGS;
      let ECOM_C = ECOM_CONSTANTS.SETTINGS;
      let settingsStoredById: any = [C.CLIENT_SETTINGS, C.USER_SETTINGS];
      let settingsStoredAsItIs = [
        C.CLIENT_ID,
        C.CLIENT_NAME,
        C.CLIENT_SOURCE,
        C.CLIENT_IS_ACTIVE,
        C.DEFAULT_SETTINGS,
        C.UOMS,
        C.SUBSCRIPTION,
      ];
      settingsStoredById.forEach((settingName: string) => {
        let setting = getObjFromList(settings[settingName]);
        state[settingName] = setting;
        localStore.set(settingName, setting);
      });
      settingsStoredAsItIs.forEach((settingName) => {
        let setting = settings[settingName];
        state[settingName] = setting;
        localStore.set(settingName, setting);
      });
      return state;
    },
    reset: () => {
      return resetState;
    },
  },
});

export const performUpdateAllSetting = () => async (dispatch: any) => {
  try {
    let data = await getMetaData();
    udpateSettingInLocalStore(data.data);
    dispatch(updateAllSetting(data.data));
  } catch (err) {
    console.log(err);
  }
};

export const { updateAllSetting, reset } = metaDataSlice.actions;
export default metaDataSlice.reducer;
