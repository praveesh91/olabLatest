import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const logout = () => {
  let url: string = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.LOGOUT;
  return axios.post(url);
};

export default logout;
