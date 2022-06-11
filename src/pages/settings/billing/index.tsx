import { renderRoutes } from "react-router-config";

const Billing = ({ route }: any) => {
  return <div>{renderRoutes(route.routes)}</div>;
};

export default Billing;
