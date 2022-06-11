import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../../utils/constants/backend-api-path.constants";

const cancelSubscription = () => {
  let url =
    BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STRIPE_SUBSCRIPTION_CANCEL;

  return axios.post(url).then((res) => {
    return res;
  });
};

export default cancelSubscription;
