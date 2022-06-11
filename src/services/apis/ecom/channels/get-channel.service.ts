import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const getChannel = (data: { id: number }) => {
  let url =
    BACKEND_API_PATHS.BASE +
    BACKEND_API_PATHS.CHANNEL.replace(":id", data.id.toString());
  return axios.get(url);
};

export default getChannel;
