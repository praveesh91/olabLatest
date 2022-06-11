import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const login = (data:{body:any}) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.LOGIN;

  return axios.post(url, data.body).then((res) => {
    return res;
  });
};

export default login;
