import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const productBulkAction = async (
  pdtIds: string[],
  path: string,
  params?: any
) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PRODUCTS}bulk/${path}/`;
  let payload = { product_ids: pdtIds };
  return axios
    .post(url, params ? params : payload)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.data && error.data.message) {
        return Promise.reject(error.data.message);
      }
      return Promise.reject(
        error.message ? error.message : "Oops Something went wrong"
      );
    });
};
export default productBulkAction;
