import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import PAGE_PATHS from "../../utils/constants/page-paths.constants";
import logoutAPI from "../../services/apis/users/signup-login/logout.service";
import { reset } from "../../services/redux/slices/meta-data.slice";
import { reset as resetComponents } from "../../services/redux/slices/components.slice";
import localStore from "../../services/local-storage.service";
import {
  resetGlobalConfig,
  resetStockListConfig,
} from "../../services/redux/slices/inventory.slice";

const useLogout = () => {
  const history = useHistory();
  const dispatcher = useDispatch();
  const logout = async () => {
    try {
      let res: any = await logoutAPI();
      localStore.clear();
      dispatcher(reset());
      dispatcher(resetComponents());
      dispatcher(resetStockListConfig());
      dispatcher(resetGlobalConfig());
      return Promise.resolve(res.data);
    } catch (error) {
      Promise.reject(error);
    }
  };

  return {
    logout,
  };
};

export default useLogout;
