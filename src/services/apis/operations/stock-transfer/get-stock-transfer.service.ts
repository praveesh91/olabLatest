import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const getStockTransfer = (data: { id: number }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STOCK_TRANSFER + data.id;
  return axios.get(url);
};

export default getStockTransfer;
