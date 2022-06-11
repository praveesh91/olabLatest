import { matchRoutes, renderRoutes } from "react-router-config";
import { Redirect } from "react-router-dom";
import localStore from "../services/local-storage.service";
import PAGE_PATHS from "../utils/constants/page-paths.constants";

const AuthorizedRoute = ({ route }: any) => {
  let token = localStore.get("token");

  if (token) {
    return renderRoutes(route.routes);
  }
  return <Redirect to={"/" + PAGE_PATHS.LOGIN} />;
};

export default AuthorizedRoute;
