import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const getBundleLocations = (
  data: {
    url?: string | null | undefined;
    queryParams?: any;
  } = {
    url: undefined,
    queryParams: undefined,
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.BUNDLE_LOCATION;
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

export default getBundleLocations;
