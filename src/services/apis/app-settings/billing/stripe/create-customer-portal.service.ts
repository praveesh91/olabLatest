import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../../utils/constants/backend-api-path.constants";

const createCustomerPortal = () => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STRIPE_PORTAL_CREATE;
  let body = {};

  return axios.post(url, body).then((res) => {
    return res;
  });
};

export default createCustomerPortal;
