import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const deleteProduct = (id: string) => {
  let url = `${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PRODUCTS}${id}/`;
  return axios.delete(url).then((res) => {
    return res;
  });
};

export default deleteProduct;
