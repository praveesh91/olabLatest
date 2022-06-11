import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const getStockLevel = (data: { id: number | string; queryParams?: any }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STOCK_LEVELS;
  let id = data.id;
  let queryParams = {};

  if (data.queryParams) {
    queryParams = data.queryParams;
  }

  return axios
    .get(url + id + "/", {
      params: queryParams,
    })
    .then((res) => {
      return res;
    });
};

export default getStockLevel;
