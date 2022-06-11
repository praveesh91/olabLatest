import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const updateAdjustStock = (data: { id: number; body: any }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUST_STOCK;
  let id = data.id;
  let body = {};

  if (data.body) {
    body = data.body;
  }

  return axios.put(url + id + "/", body).then((res) => {
    return res;
  });
};

export default updateAdjustStock;
