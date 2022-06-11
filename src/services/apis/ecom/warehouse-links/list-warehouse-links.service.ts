import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const listWarehouseLinks = (args?: {
  queryParams?: {
    channel?: any;
  };
}) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.WAREHOUSE_LINKS;
  let queryParams = {};

  if (args?.queryParams) {
    queryParams = args.queryParams;
  }

  return axios.get(url, {
    params: queryParams,
  });
};

export default listWarehouseLinks;
