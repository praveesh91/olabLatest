import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const markComplete = (data: { id: number; action: string; body?: any }) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.MARK_AS_COMPLETE;
  let id = data.id;
  let action = data.action;
  let body = {};

  if (data.body) {
    body = data.body;
  }

  url = url.replace(":id", "" + id);
  url = url.replace(":action", action);

  return axios.put(url, body).then((res) => {
    return res;
  });
};

export default markComplete;
