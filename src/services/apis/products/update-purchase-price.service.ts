import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const addPurchasePriceDetails = async (details: any, id: any) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PURCHASE_RATES}${id}/`;
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
export default addPurchasePriceDetails;
