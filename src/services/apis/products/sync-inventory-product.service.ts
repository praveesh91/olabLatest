import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const syncInventoryProduct = (id: string) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PRODUCTS}${id}/${BACKEND_API_PATHS.FORCE_SYNC_PRODUCT_INVENTORY}`;
  return axios.post(url).then((res) => {
    return res;
  });
};

export default syncInventoryProduct;
