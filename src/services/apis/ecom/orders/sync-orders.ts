import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";
import { ECOM_CONSTANTS } from "../../../../utils/constants/ecom.constants";

const syncOrders = (id: string) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.ORDERS}${BACKEND_API_PATHS.PERFORM_ACTION}${id}/${ECOM_CONSTANTS.ACTIONS.REFRESH}`;
  return axios.put(url).then((res) => {
    return res;
  });
};

export default syncOrders;
