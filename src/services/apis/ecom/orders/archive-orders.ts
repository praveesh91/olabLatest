import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";
import { ECOM_CONSTANTS } from "../../../../utils/constants/ecom.constants";

const archiveOrders = (id: [string]) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.ORDERS}${BACKEND_API_PATHS.PERFORM_BULK_ACTION}archive/`;
  let params = { ids: id };
  return axios.put(url, params).then((res) => {
    return res;
  });
};

export default archiveOrders;
