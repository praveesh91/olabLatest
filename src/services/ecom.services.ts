import APP_CONSTANTS from "../utils/constants/app.constants";
import getMetaData from "./apis/app-settings/get-metadata.service";
import connectAmazon from "./apis/ecom/amazon/connect-amazon.service";
import connectShopify from "./apis/ecom/shopify/connect-shopify.service";
import localStore from "./local-storage.service";
import {
  saveClientDetails,
  udpateSettingInLocalStore,
} from "./setting.service";

export const getShopifyParams = (params: any) => {
  let shopifyParams: any = {};

  if (params.shop) {
    shopifyParams.shop = params.shop;
  }

  if (params.state) {
    shopifyParams.state = params.state;
  }

  if (params.code) {
    shopifyParams.code = params.code;
  }

  if (params.hmac) {
    shopifyParams.hmac = params.hmac;
  }

  if (params.timestamp) {
    shopifyParams.timestamp = params.timestamp;
  }

  if (params.token) {
    shopifyParams.token = params.token;
  }

  if (params.country_code) {
    shopifyParams.country_code = params.country_code;
  }

  return shopifyParams;
};

export const getAmazonParams = (params: any) => {
  let amazonParams: any = {};
  if (params.selling_partner_id) {
    amazonParams.selling_partner_id = params.selling_partner_id;
  }

  if (params.amazon_callback_uri) {
    amazonParams.amazon_callback_uri = params.amazon_callback_uri;
  }

  if (params.amazon_state) {
    amazonParams.amazon_state = params.amazon_state;
  }

  return amazonParams;
};

export const getSource = (params: any) => {
  if (params.selling_partner_id) {
    return APP_CONSTANTS.SOURCE.AMAZON;
  }

  if (params.shop) {
    return APP_CONSTANTS.SOURCE.SHOPIFY;
  }

  return APP_CONSTANTS.SOURCE.WEBSITE;
};

export const setupForLogin = async (args: {
  res: any;
  successCallback?: any;
  otherParams?: any;
}) => {
  saveClientDetails(args.res.data.client);
  localStore.set(APP_CONSTANTS.SETTINGS.TOKEN, args.res.data.token);
  localStore.set(APP_CONSTANTS.SETTINGS.USER, args.res.data.user);
  let connectRes: any;
  try {
    if (args.otherParams?.shop) {
      connectRes = await connectShopify({ body: args.otherParams });
    }

    if (args.otherParams?.selling_partner_id) {
      connectRes = await connectAmazon({ body: args.otherParams });
    }
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error);
  }
  let metaRes: any;
  try {
    metaRes = await getMetaData();
    udpateSettingInLocalStore(metaRes.data);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }

  args.successCallback?.({
    metaRes: metaRes,
    connectRes: connectRes,
  });
};
