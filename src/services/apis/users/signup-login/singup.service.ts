import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const signup = (data: { body: any }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.SIGNUP;
  return axios.post(url, data.body);
};

export default signup;
