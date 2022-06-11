import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const listProducts = (
  data: {
    url?: string | null | undefined;
    queryParams?: any;
  } = {
    url: undefined,
    queryParams: undefined,
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.PRODUCTS;
  let queryParams = {};

  if (data.url) {
    url = data.url;
  }

  if (data.queryParams) {
    queryParams = data.queryParams;
  }
  return axios
    .get(url, {
      params: { ...queryParams, include: "count_links" },
    })
    .then((res) => {
      return res;
    });
};

export default listProducts;
