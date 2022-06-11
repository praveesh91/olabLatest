import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const getAdjustStock = (
  data: {
    url?: string;
    id?: number;
    queryParams?: any;
  } = {
    url: undefined,
    id: undefined,
    queryParams: {},
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUST_STOCK;
  let queryParams = {};
  let id = undefined;

  if (data.url) {
    url = data.url;
  }

  if (data.id) {
    id = data.id;
  }

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

export default getAdjustStock;
