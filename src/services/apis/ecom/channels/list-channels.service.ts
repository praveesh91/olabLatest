import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const listChannels = () => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.CHANNELS;
  return axios.get(url);
};

export default listChannels;
