import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const updateChannel = ({ id, body }: { id: number; body: any }) => {
  let url =
    BACKEND_API_PATHS.BASE +
    BACKEND_API_PATHS.CHANNEL.replace(":id", id.toString());

  return axios.put(url, body);
};

export default updateChannel;
