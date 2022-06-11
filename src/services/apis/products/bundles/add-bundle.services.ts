import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const addBundle = async (id: string, details: any) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.BUNDLES}${id}/`;
  return axios
    .put(url, details)
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
export default addBundle;
