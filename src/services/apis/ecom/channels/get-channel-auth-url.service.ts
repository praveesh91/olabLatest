import axios from "axios";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";

const getChannelAuthURL = (args: {
  authUrl: string;
  queryParams?: Record<string, any>;
}) => {
  let url = BACKEND_API_PATHS.BASE + args.authUrl;
  let queryParams = args.queryParams || {};
  return axios.get(url, {
    params: queryParams,
  });
};

export default getChannelAuthURL;
