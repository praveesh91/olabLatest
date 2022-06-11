import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const toggleSync = (data: { id: number }) => {
  let url =
    BACKEND_API_PATHS.BASE +
    BACKEND_API_PATHS.TOGGLE_SYNC_CHANNEL.replace(":id", data.id.toString());
  return axios.post(url);
};

export default toggleSync;
