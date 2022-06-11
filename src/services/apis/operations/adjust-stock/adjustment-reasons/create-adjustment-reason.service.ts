import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../../utils/constants/backend-api-path.constants"; 

const createAdjustmentReason = (
  data: {
      url?:string,
      body:any
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUSTMENT_REASONS;
  let body = data.body;

  if (data?.url) {
    url = data.url;
  }


  return axios
    .post(url, body)
    .then((res) => {
      return res;
    });
};

export default createAdjustmentReason;
