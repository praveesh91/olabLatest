import { matchRoutes } from "react-router-config";
import APP_CONSTANTS from "../utils/constants/app.constants";
import { getData } from "country-list";

export const extractPlans = (plans: any, planType: string) => {
  let montlyPlans = plans.filter((plan: any) => {
    if (plan.duration === planType) {
      return plan;
    }
  });

  return montlyPlans;
};

export const getMaxIndexNumber = (list: any[]) => {
  let lastIndex = list.length - 1;
  if (lastIndex > -1) {
    return list[lastIndex]["index_number"];
  }
  return -1;
};

export const getProductIdsFromProductList = (products: any[]) => {
  let idList = products.map((product: any) => {
    return product.id;
  });
  return idList;
};

export const getProductIdsFromLines = (lines: any[]) => {
  let idList = lines.map((line: any) => {
    return line.product.id;
  });
  return idList;
};

export const getActiveMenu = (menuList: any[], route: any) => {
  let matched = menuList.filter((item) => {
    let matchedRoutes = matchRoutes(route.routes, "/" + item.path);
    if (matchedRoutes.length > 0) {
      return item;
    }
  });
  if (matched.length > 0) {
    return matched[0];
  }
  return;
};

export const getRecurringDurationString = (planType: string) => {
  if (planType === APP_CONSTANTS.SUBSCRIPTION_PLANS.MONTHLY) {
    return "Month";
  }

  if (planType === APP_CONSTANTS.SUBSCRIPTION_PLANS.YEARLY) {
    return "Year";
  }

  return "";
};

export const isPlanActive = (status: string) => {
  if (status === APP_CONSTANTS.SUBSCRIPTION_STATUS.ACTIVE) {
    return true;
  }
  return false;
};

export const getQueryParamsFromUrl = (
  args: {
    paramsToRead?: string[];
    url?: string;
  } = {}
) => {
  let params = new URL(args.url || document.location.href).searchParams;
  let readParams: any = {};

  if (args.paramsToRead) {
    args.paramsToRead.forEach((param) => {
      let temp = params.get(param);
      if (temp !== null) {
        readParams[param] = temp;
      }
    });
  }

  params.forEach(function (val, key) {
    readParams[key] = val;
  });
  return readParams;
};

export const getQueryParamsFromForm = (form: any) => {
  let queryParams: any = {};

  Object.entries(form).forEach(([property, value]) => {
    if (property === "adjustmentType") {
      queryParams["adjustment_type"] = value;
      return;
    }
    queryParams[property] = value;
  });
  return queryParams;
};

export const getQueryParamsFromFilterList = (list: any[]) => {
  let queryParams: any = {};
  list.forEach((filter: any) => {
    queryParams[filter.index] = filter.value;
  });
  return queryParams;
};

export const getCountryList = () => {
  let allCountries = getData();
  return allCountries.map((country) => {
    return {
      label: country.name,
      value: country.name,
      id: country.code,
    };
  });
};
