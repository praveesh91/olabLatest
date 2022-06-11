import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const importAdjustStock = (
  data: any = {
    url: null,
    id: null,
    body: {},
    headers: {},
  }
) => {
  let url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUST_STOCK_IMPORT;

  if (data.url) {
    url = data.url;
  }

  if (data.id) {
    url = url + data.id + "/";
  }

  if (!data.body) {
    data.body = {};
  }

  return axios
    .post(url, data.body, {
      headers: {
        "Content-Type": "text/csv",
      },
    })
    .then((res) => {
      return res;
    });
};

export default importAdjustStock;
