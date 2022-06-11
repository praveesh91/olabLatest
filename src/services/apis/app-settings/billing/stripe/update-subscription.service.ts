import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../../utils/constants/backend-api-path.constants";

const updateSubscription = (data: { planId: number }) => {
  let url =
    BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STRIPE_SUBSCRIPTION_UPDATE;
  let planId = data.planId;
  url = url.replace(":plan_id", "" + planId);
  return axios.post(url).then((res) => {
    return res;
  });
};

export default updateSubscription;
