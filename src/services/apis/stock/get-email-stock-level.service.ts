import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const getEmailStockLevel = (data: { queryParams?: any }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.EMAIL_STOCK_LEVELS;
  let queryParams = {};

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

export default getEmailStockLevel;
