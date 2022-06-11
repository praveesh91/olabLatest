import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const updateStockTransfer = (data: { id: number; body: any }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STOCK_TRANSFER + data.id + "/";
  return axios.put(url, data.body);
};

export default updateStockTransfer;
