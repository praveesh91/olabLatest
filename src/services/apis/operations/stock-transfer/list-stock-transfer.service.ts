import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const listStockTransfer = (data: {
  paginationUrl?: string;
  queryParams?: any;
}) => {
  let url =
    data?.paginationUrl ||
    BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STOCK_TRANSFER;
  let queryParams = data?.queryParams || {};

  return axios.get(url, {
    params: queryParams,
  });
};

export default listStockTransfer;
