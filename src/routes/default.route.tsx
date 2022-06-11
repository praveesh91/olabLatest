import { matchRoutes, renderRoutes } from "react-router-config";
import { Redirect } from "react-router-dom";
import localStore from "../services/local-storage.service";
import PAGE_PATHS from "../utils/constants/page-paths.constants";

const DefaultRoute = ({ route }: any) => {
  return <Redirect to={"/" + PAGE_PATHS.HOME} />;
};

export default DefaultRoute;
