import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const getSubscription = (
  data: {
    url?: string;
    queryParams?: any;
  } = {
    url: undefined,
    queryParams: undefined,
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.SUBSCRIPTION;
  let queryParams = {};

  if (data.url) {
    url = data.url;
  }
  if (data.queryParams) {
    queryParams = data.queryParams;
  }
  return axios
    .get(url, {
      params: queryParams,
    })
    .then((res) => {
      return res;
    });
};

export default getSubscription;
