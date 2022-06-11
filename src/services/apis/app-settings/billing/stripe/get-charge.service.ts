import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../../utils/constants/backend-api-path.constants";

const getCharge = () => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STRIPE_CHARGE_GET;
  let queryParams = {};

  return axios.get(url, queryParams).then((res) => {
    return res;
  });
};

export default getCharge;
