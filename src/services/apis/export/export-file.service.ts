import axios from "axios";
import APP_CONSTANTS from "../../../utils/constants/app.constants";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const exportFile = (data: {
  filename?: string;
  type: string;
  id?: number;
  extraParams?: any;
}) => {
  let url: string = "";
  if (data.type === APP_CONSTANTS.EXPORT_TYPE.ADJUST_STOCK_LINES) {
    url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.ADJUST_STOCK_LINE;
  }
  if (data.type === APP_CONSTANTS.EXPORT_TYPE.PRODUCTS) {
    url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.PRODUCTS;
  }
  if (data.type === APP_CONSTANTS.EXPORT_TYPE.BUNDLES) {
    url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.BUNDLE_LINES;
  }
  if (data.type === APP_CONSTANTS.EXPORT_TYPE.STOCK_LOCATIONS) {
    url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STOCK_LEVELS;
  }

  let queryParams = {
    ...data.extraParams,
    format: "csv",
    paginate: "False",
    document: data.id ? data.id : undefined,
  };

  return axios
    .get(url, {
      params: queryParams,
    })
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

export default exportFile;
