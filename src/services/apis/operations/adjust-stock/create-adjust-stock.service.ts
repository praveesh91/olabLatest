import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const createAdjustStock = (
  data: {
    body?: any;
  } = {
    body: {},
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUST_STOCK;
  let body = {};

  if (data.body) {
    body = data.body;
  }

  return axios.post(url, body).then((res) => {
    return res;
  });
};

export default createAdjustStock;
