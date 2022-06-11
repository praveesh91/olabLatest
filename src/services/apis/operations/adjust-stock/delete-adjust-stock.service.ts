import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const deleteAdjustStock = (data: { id: number }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUST_STOCK;

  return axios.delete(url+data.id+"/").then((res) => {
    return res;
  });
};

export default deleteAdjustStock;
