import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const deletePurchasePrice = (id: number) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PURCHASE_RATES}${id}/`;
  return axios.delete(url).then((res) => {
    return res;
  });
};

export default deletePurchasePrice;
