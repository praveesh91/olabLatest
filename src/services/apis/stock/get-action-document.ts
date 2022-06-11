import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";

const getActionDocument = async (id: Number) => {
  const url =
    BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.LIST_ADJUST_STOCK + `${id}/`;

  return await axios
    .get(url)
    .then((res) => {
      console.log("then", res);
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

const createActionDocument = async (body: any) => {
  const url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.LIST_ADJUST_STOCK;
  return await axios
    .post(url, body)
    .then((res) => {
      console.log("update res", res);
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

const updateActionDocument = async (id: Number, body: any) => {
  const url =
    BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.LIST_ADJUST_STOCK + `${id}/`;
  return await axios
    .put(url, body)
    .then((res) => {
      console.log("update res", res);
    })
    .catch((err) => {
      return err;
    });
};

const completeActionDocument = async (params: any) => {
  const url =
    BACKEND_API_PATHS.BASE +
    BACKEND_API_PATHS.MARK_AS_COMPLETE +
    `${params.id}/${params.action}/`;
  return await axios
    .put(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export {
  getActionDocument,
  updateActionDocument,
  createActionDocument,
  completeActionDocument,
};
