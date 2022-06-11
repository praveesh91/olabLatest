import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";
import { IParamTypes, IProductDetail } from "../../../interfaces/IProducts";

const updateProductDetail = async (pdtId: string, details: IProductDetail) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PRODUCTS}${pdtId}/`;
  return axios
    .put(url, details)
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
export default updateProductDetail;
