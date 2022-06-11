import localStore from "./local-storage.service";
import APP_CONSTANTS from "../utils/constants/app.constants";
import { ECOM_CONSTANTS } from "../utils/constants/ecom.constants";
import { getObjFromList } from "./conversion.service";

export const udpateSettingInLocalStore = (
  settings: any,
  callback?: () => void
) => {
  saveSettingToLocalStore(settings);
  if (callback) {
    callback();
  }
};

export const saveSettingToLocalStore = (settings: any) => {
  let C = APP_CONSTANTS.SETTINGS;
  let ECOM_C = ECOM_CONSTANTS.SETTINGS;
  let settingsStoredById = [C.CLIENT_SETTINGS, C.USER_SETTINGS];
  let settingsStoredAsItIs = [
    C.CLIENT_ID,
    C.CLIENT_NAME,
    C.CLIENT_SOURCE,
    C.CLIENT_IS_ACTIVE,
    C.DEFAULT_SETTINGS,
    C.UOMS,
    C.SUBSCRIPTION,
  ];
  settingsStoredById.forEach((settingName) => {
    localStore.set(settingName, getObjFromList(settings[settingName]));
  });
  settingsStoredAsItIs.forEach((settingName) => {
    localStore.set(settingName, settings[settingName]);
  });

  saveLocalCode();
};

export const saveLocalCode = () => {
  const defaultStettings: any = localStore.get(
    APP_CONSTANTS.SETTINGS.DEFAULT_SETTINGS
  );
  const country_code = defaultStettings["country_code"] || "us";
  const localCode = "en".concat("-", country_code.toLowerCase());
  localStore.set("locale", localCode);
};

export const getLocaleCode = () => {
  return localStore.get("locale");
};

export const saveClientDetails = (client: any) => {
  localStore.set(APP_CONSTANTS.SETTINGS.CLIENT_NAME, client.name);
  localStore.set(APP_CONSTANTS.SETTINGS.CLIENT_IS_ACTIVE, client.is_active);
  localStore.set(APP_CONSTANTS.SETTINGS.CLIENT_SOURCE, client.source);
};
