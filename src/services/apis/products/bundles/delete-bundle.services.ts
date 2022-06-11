import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const deleteBundle = (arrIds: any) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.BUNDLES}/`;
  let payload = { bundle_ids: arrIds };

  return axios.delete(url).then((res) => {
    return res;
  });
};

export default deleteBundle;
