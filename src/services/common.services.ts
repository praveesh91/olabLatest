import { matchRoutes } from "react-router-config";
import { routes } from "../config/routes";
import { BACKEND_API_PATHS } from "../utils/constants/backend-api-path.constants";

export const downloadBlob = (blobObj: Blob, filename: string) => {
  let link = document.createElement("a");
  document.body.appendChild(link);
  let url = window.URL.createObjectURL(blobObj);
  link.href = url;
  link.download = filename;
  link.click();
  document.body.removeChild(link);
};

export const getElementIndex = (list: any, ele: any, key: string) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i][key] === ele[key]) {
      return i;
    }
  }
  return -1;
};

export const getExtensionName = (extension: string) => {
  if (extension === ".csv") {
    return "csv";
  }

  return "";
};

export const isPublicUrl = (url: string) => {
  if(url.includes(BACKEND_API_PATHS.CLOUD_STORAGE_URL)) {
    return true
  }
  return false
};

export const isMatchingCurrentRoute = (pattern: string, isExact:boolean = true) => {
  let matchedRoutes = matchRoutes(routes, window.location.pathname);
  let isMatched = false;
  matchedRoutes.forEach((matching) => {
    if (isExact && matching.match.isExact && pattern === matching.match.path) {
      isMatched = true
    }

    if(!isExact && pattern === matching.match.path) {
      isMatched = true;
    }
  });
  return isMatched;
};

export const removeSlashFromEnds = (str:string) => {
  return str.replace(/^\/|\/$/g, '')
}
