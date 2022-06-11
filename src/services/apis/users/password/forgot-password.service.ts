import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const forgotPassword = (data: {
  body: {
    email: string;
  };
  recaptch_token: string;
}) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.FORGOT_PASSWORD_LINK;
  return axios.post(url, data.body, {
      headers: {
        'X-G-Recaptcha-Response' : data.recaptch_token
      }
  });
};

export default forgotPassword;
