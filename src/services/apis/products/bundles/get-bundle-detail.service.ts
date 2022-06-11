import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const getBundleDetail = async (pdtId: string) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.BUNDLES}${pdtId}`;
  return axios
    .get(url)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.data && error.data.message) {
        return Promise.reject(error.data.message);
      }
      return Promise.reject(
        error.message ? error.message : "Oops Something went wrong"
      );
    });
};
export default getBundleDetail;
