import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const sendVerificationToken = (data: {
  body: any;
  recaptcha_token: string;
}) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.SEND_VARIFICATION_TOKEN;

  return axios.post(url, data.body, {
    headers: {
      "X-G-Recaptcha-Response": data.recaptcha_token,
    },
  });
};

export default sendVerificationToken;
