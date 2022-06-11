import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const markComplete = (data: { id: number }) => {
  let url =
    BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STOCK_TRANSFER_MARK_COMPLETE;
  let id = data.id;
  url = url.replace(":id", "" + id);

  return axios.put(url).then((res) => {
    return res;
  });
};

export default markComplete;
