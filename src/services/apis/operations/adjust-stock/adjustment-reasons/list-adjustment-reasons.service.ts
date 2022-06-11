import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../../utils/constants/backend-api-path.constants"; 

const listAdjustmentReasons = (
  data?: {
      url?:string,
      queryParams?:any
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUSTMENT_REASONS;
  let queryParams = {};

  if (data?.url) {
    url = data.url;
  }

  if (data?.queryParams) {
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

export default listAdjustmentReasons;
