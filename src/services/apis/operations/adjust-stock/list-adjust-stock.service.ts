import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const listAdjustStocks = (
  data: any = {
    url: null,
    queryParams: {},
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUST_STOCK;
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

export default listAdjustStocks;
