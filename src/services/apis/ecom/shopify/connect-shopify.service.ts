import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const connectShopify = (data: { body: any }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.SHOPIFY_CONNECT;
  return axios.post(url, data.body);
};

export default connectShopify;
