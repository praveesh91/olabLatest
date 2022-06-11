import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const listBundlesService = (
  data: any = {
    url: null,
    queryParams: {},
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.BUNDLES;

  if (data.url) {
    url = data.url;
  }

  if (!data.queryParams) {
    data.queryParams = {};
  }

  return axios
    .get(url, {
      params: data.queryParams,
    })
    .then((res) => {
      return res;
    });
};

export default listBundlesService;
