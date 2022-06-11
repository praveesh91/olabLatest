import devConfig from "./dev.config";
import prodConfig from "./prod.config";
import localConfig from "./local.config";

let selectedConfig:any = {};
switch (process.env.REACT_APP_ENV) {
  case "prod":
    selectedConfig = prodConfig;
    break;
  case "dev":
    selectedConfig = devConfig;
    break;
  default:
    selectedConfig = localConfig;
}

const config = {
  // other defualt variables go here...
  ...selectedConfig,
};

export default config;
