import { createSlice } from "@reduxjs/toolkit";
import listStockLevels from "../../apis/stock/list-stock-levels.service";
import { createQueryParams } from "../../conversion.service";
import localStore from "../../local-storage.service";

const configToParamMap = {
  warehouses: "warehouse_ids",
  paginate: "paginate",
  search: "search",
  bundle: "product_ids",
  productTags: "product_tags",
  sort: "o",
  onlineListing: "has_links",
  belowThreshold: "is_below_threshold",
  category: "product_group1",
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    globalConfig: localStore.get("inventory.globalConfig")
      ? localStore.get("inventory.globalConfig")
      : {
          warehouses: [],
        },
    stockList: {
      loading: true,
      pagination: { next: null, previous: null },
      list: [],
      config: localStore.get("inventory.stockList.config")
        ? localStore.get("inventory.stockList.config")
        : {
            bundle: null,
            search: null,
            productTags: [],
            sort: [],
            belowThreshold: "all",
            onlineListing: "all",
            category: null,
          },
    },
  },
  reducers: {
    setStockList: (state: any, action) => {
      state["stockList"]["list"] = action.payload.results;
      return state;
    },
    setLoading: (state: any, action) => {
      state["stockList"]["loading"] = action.payload;
      return state;
    },
    setPagination: (state: any, action) => {
      state["stockList"]["pagination"] = action.payload;
    },
    updateStockListConfig: (state: any, action) => {
      for (let key in action.payload) {
        state["stockList"]["config"][key] = action.payload[key];
      }
      localStore.set(
        "inventory.stockList.config",
        state["stockList"]["config"]
      );
      return state;
    },
    updateGlobalConfig: (state: any, action) => {
      for (let key in action.payload) {
        state["globalConfig"][key] = action.payload[key];
      }
      localStore.set("inventory.globalConfig", state["globalConfig"]);
      return state;
    },

    resetStockListConfig: (state: any) => {
      state["stockList"]["config"] = {
        bundle: null,
        search: null,
        productTags: [],
        sort: [],
        belowThreshold: "all",
        onlineListing: "all",
        category: null,
      };
      localStore.set(
        "inventory.stockList.config",
        state["stockList"]["config"]
      );
      return state;
    },

    resetGlobalConfig: (state: any) => {
      state["globalConfig"] = {
        warehouses: [],
      };
      return state;
    },
    updateStock: (state: any, action: any) => {
      for (let i = 0; i < state["stockList"]["list"].length; i++) {
        if (state["stockList"]["list"][i]["id"] == action.payload.id) {
          state["stockList"]["list"][i] = action.payload;
          break;
        }
      }

      return state;
    },
  },
});

export const performFetchStockList =
  (data: any = {}, cb: any = null) =>
  async (dispatch: any) => {
    try {
      let queryParams = data.config
        ? createQueryParams(data.config, configToParamMap)
        : {};

      queryParams["product_bundle_type"] = "NONE";
      queryParams["product_is_archived"] = "False";
      queryParams["product_tracking_type"] = 2;
      dispatch(setLoading(true));
      dispatch(
        setStockList({
          results: [],
        })
      );
      let res = await listStockLevels({
        url: data.url ? data.url : null,
        queryParams: data.url ? {} : queryParams,
      });
      if (cb) {
        cb();
      }
      dispatch(setStockList(res.data));
      dispatch(
        setPagination({
          next: res.data.next,
          previous: res.data.previous,
        })
      );
      dispatch(setLoading(false));
    } catch (err) {
      console.log(err);
    }
  };

export const {
  setStockList,
  setLoading,
  setPagination,
  updateStockListConfig,
  updateGlobalConfig,
  resetGlobalConfig,
  resetStockListConfig,
  updateStock,
} = inventorySlice.actions;
export default inventorySlice.reducer;
