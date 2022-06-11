import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const getMetaData = (data?: any) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.TAXES;
  let query_params = null;

  if (data && data.url) {
    url = data.url;
  }
  if (data && data.query_params) {
    query_params = data.query_params;
  }
  return axios
    .get(url, {
      params: query_params,
    })
    .then((res) => {
      return res;
    });
};

export default getMetaData;
