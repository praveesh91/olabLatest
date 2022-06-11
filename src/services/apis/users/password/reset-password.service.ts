import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const resetPassword = (data: {
  body: {
    new_password1: string;
    new_password2: string;
    token: string;
  };
}) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.RESET_PASSWORD;
  return axios.post(url, data.body);
};

export default resetPassword;
