import moment from "moment";
import APP_CONSTANTS from "../utils/constants/app.constants";
import { getQueryParamsFromUrl } from "./get-values.service";
import localStore from "./local-storage.service";
import {
  enAU,
  enCA,
  enGB,
  enIE,
  enIN,
  enNZ,
  enUS,
  enZA,
} from "date-fns/locale";
import { format as formatDate } from "date-fns";
import { getLocaleCode } from "./setting.service";

export const localeCodeMappings: any = {
  "en-au": enAU,
  "en-ca": enCA,
  "en-gb": enGB,
  "en-ie": enIE,
  "en-in": enIN,
  "en-nz": enNZ,
  "en-us": enUS,
  "en-za": enZA,
};

export const getObjFromList = (array: any) => {
  let objectMappedById: any = {};
  if (!array) {
    return;
  }
  array.forEach(
    (arrayItem: any) => (objectMappedById[arrayItem.id] = arrayItem)
  );
  return objectMappedById;
};

export const titleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const convertObjToList = (obj: any) => {
  if (!obj) {
    return [];
  }
  return Object.keys(obj).map((key: any) => {
    return obj[key];
  });
};

export const getDropdownList = (list: any) => {
  return list.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
      fullObj: item,
    };
  });
};

export const getWarehouseDropdownList = (list: Array<any>) => {
  return list.map((item: any) => {
    return {
      label: item.code,
      value: item.id,
      fullObj: item,
    };
  });
};

export const createQueryParams = (config: any, configToParamMap: any) => {
  let queryParams: any = {};
  for (let configKey in configToParamMap) {
    if (
      configKey == "warehouses" &&
      config.warehouses &&
      config.warehouses.length > 0
    ) {
      let list = config.warehouses.map((item: any) => item.id);
      queryParams[configToParamMap[configKey]] = list.join();
    } else if (configKey == "bundle" && config.bundle) {
      let list = config.bundle.components.map(
        (component: any) => component.component_id
      );
      queryParams[configToParamMap[configKey]] = list.join();
    } else if (
      configKey == "productTags" &&
      config.productTags &&
      config.productTags.length > 0
    ) {
      let list = config.productTags.map((tag: any) => tag.name);
      queryParams[configToParamMap[configKey]] = list.join();
    } else if (configKey == "sort" && config.sort && config.sort.length > 0) {
      let list = config.sort.map((item: any) =>
        item.value == "+" ? item.type : "-" + item.type
      );
      queryParams[configToParamMap[configKey]] = list.join();
    } else if (configKey == "belowThreshold" && config.belowThreshold) {
      if (config.belowThreshold == "yes") {
        queryParams[configToParamMap[configKey]] = "True";
      }
    } else if (configKey == "onlineListing" && config.onlineListing) {
      if (config.onlineListing == "yes") {
        queryParams[configToParamMap[configKey]] = "True";
      } else if (config.onlineListing == "no") {
        queryParams[configToParamMap[configKey]] = "False";
      }
    } else if (configKey == "category" && config.category) {
      queryParams[configToParamMap[configKey]] = config.category.id;
    } else {
      queryParams[configToParamMap[configKey]] = config[configKey];
    }
  }
  return queryParams;
};

export const displayNumber = (
  value?: string | number | null | undefined
): null | number => {
  if (typeof value == "string") {
    return parseFloat(value);
  }
  if (typeof value == "number") {
    return value;
  }
  return null;
};

export const dec2hex = (dec: any) => {
  return dec.toString(16).padStart(2, "0");
};

// generateId :: Integer -> String
export const generateId = (len: number | undefined | null = null) => {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};

export const generateAdjustFormBody = ({
  AdjustStockForm,
  isEdit,
  max_index,
}: any) => {
  const { warehouse, reason, notes, adjustmentType, selectedProducts } =
    AdjustStockForm;
  let maxIndex = max_index;
  let n = selectedProducts.map((product: any, key: number) => {
    const newIndex =
      "index_number" in product ? product.index_number : (maxIndex += 1);
    return {
      product_id: product.id,
      quantity: product.newQTY,
      index_number: !isEdit ? key + 1 : newIndex,
    };
  });
  return {
    warehouse_id: warehouse,
    adjustment_type: adjustmentType,
    reason: reason,
    notes: notes,
    lines: n,
  };
};

export const formateDocumentdata = ({
  dataList,
  productList,
  max_index,
}: any) => {
  let counter = 0;
  let maxIndex = max_index;
  const SelectedProducts = dataList.map((product: any) => {
    counter += 1;
    maxIndex =
      maxIndex < product["index_number"] ? product["index_number"] : maxIndex;
    const stocklevel = productList
      .filter((v: any) => v.id === product["product_id"])
      .map((p: any) => p["stocklevels"]);
    return {
      id: product["product_id"],
      name: product["product"].name,
      sku: product["product"].sku,
      in_stock: product["product"].in_stock,
      booked: product["product"].booked,
      newQTY: product["quantity"],
      index_number: product["index_number"],
      stocklevels: stocklevel[0],
      sid: counter,
      // stocklevels: stock,
    };
  });
  return { SelectedProducts: SelectedProducts, maxIndex: maxIndex };
};

export const displayLocaleDateTime = (date: string, format: string) => {
  if (!date) {
    return "";
  }
  return formatDate(new Date(date), format, {
    locale: localeCodeMappings[getLocaleCode()],
  });
};

export const createCSVBlob = (data: any) => {
  return new Blob([data], {
    type: "text/csv;charset=utf-8",
  });
};

export const getObjFromListBy = (array: any, by: string) => {
  let objectMapped: any = {};
  if (!array) {
    return;
  }
  array.forEach((arrayItem: any) => (objectMapped[arrayItem[by]] = arrayItem));
  return objectMapped;
};

export const getListFromObj = (obj: any) => {
  return Object.values(obj);
};

export const castToNumber = (value: string | number) => {
  if (typeof value == "string") {
    return parseFloat(value);
  }
  if (typeof value == "number") {
    return value;
  }
  return NaN;
};

export const processQueryParams = (params: any) => {
  if (params.adjustment_type === "ALL") {
    delete params.adjustment_type;
  }
  return params;
};

export const convertJsonToQueryString = (json: any) => {
  return new URLSearchParams(json).toString();
};

export const getFilterListFromUrl = (
  args: {
    paramsToRead?: string[];
    url?: string;
  } = {}
) => {
  const filterQueryParamsToLabelMapping: any = {
    adjustment_type: "Adjustment Type",
    group1: "Category",
    tags: "Tags",
    component: "Component",
    channel: "Linked with Channel",
    channelId: "Channel",
    channel_exclude: "Not Linked with Channel",
    is_below_threshold: "Below threshold",
    has_links: "Has links",
    is_archived: "Archived",
    order_created_range_before: "Order created before",
    order_created_range_after: "Order created after",
    order_status: "Order status",
    fulfillment_status: "Fulfillment status",
  };

  let filterList: any = [];
  let queryParams = getQueryParamsFromUrl(args);
  Object.entries(queryParams).forEach(([property, value]) => {
    if (property === "cursor") {
      return;
    }
    filterList.push({
      label: filterQueryParamsToLabelMapping[property],
      index: property,
      value: value,
    });
  });
  return filterList;
};
