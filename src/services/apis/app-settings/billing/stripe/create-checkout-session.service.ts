import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../../utils/constants/backend-api-path.constants";

const createCheckoutSession = (data: { id: number; body?: any }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STRIPE_SUBSCRIPTION_CREATE;
  let body = {};
  if (data.body) {
    body = data.body;
  }
  let planId = data.id;
  return axios.post(url + planId + "/", body).then((res) => {
    return res;
  });
};

export default createCheckoutSession;
