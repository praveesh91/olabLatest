import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const updateStockService = (data: any) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUST_STOCK_LINE;

  if (data.url) {
    url = data.url;
  }

  if (!data.body) {
    data.body = {};
  }

  return axios.post(url, data.body).then((res) => {
    return res;
  });
};

export default updateStockService;
