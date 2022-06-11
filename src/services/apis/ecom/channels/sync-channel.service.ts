import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const syncChannel = (data: { id: number }) => {
  let url =
    BACKEND_API_PATHS.BASE +
    BACKEND_API_PATHS.SYNC_CHANNEL.replace(":id", data.id.toString());

  return axios.post(url);
};

export default syncChannel;
