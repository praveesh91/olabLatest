import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const getCSVSample = (data: { filename: string }) => {
  let url = BACKEND_API_PATHS.CLOUD_STORAGE_URL;
  if (data.filename) {
    url = url + data.filename;
  }
  return axios
    .get(url)
    .then((res) => {
      let blobObj = new Blob([res.data], {
        type: "text/csv;charset=utf-8",
      });
      return blobObj;
    })
    .catch((err) => {
      console.log("catch", err);
    });
};

export default getCSVSample;
