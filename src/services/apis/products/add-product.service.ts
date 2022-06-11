import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const addProduct = async (details: any) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PRODUCTS}`;
  return axios
    .post(url, details)
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
export default addProduct;
