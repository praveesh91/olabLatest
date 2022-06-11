import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API_PATHS } from "../../../utils/constants/backend-api-path.constants";
import { RootState } from "../store";
import {
  generateAdjustFormBody,
  formateDocumentdata,
} from "../../conversion.service";
import APP_CONSTANTS from "../../../utils/constants/app.constants";
import listProducts from "../../apis/products/list-products.service";
import { completeActionDocument } from "../../apis/stock/get-action-document";

const initialState = {
  AdjustStockForm: {
    warehouse: 0,
    reason: "",
    notes: "",
    adjustmentType: APP_CONSTANTS.STOCK_ACTION.ADD,
    selectedProducts: [],
  },
  ProductListData: [],
  updateStockForm: {
    created_at: "",
    updated_at: "",
    user: "",
    number: "",
    warehouse: 0,
    reason: "",
    notes: "",
    adjustmentType: "",
    selectedProducts: [],
    max_index: 0,
    is_complete: false,
  },
  dummyUpdateStockForm: {},
  temporarySelectedProducts: [],
  selectedProducts: 0,
  loding: false,
  errorMessage: {},
  listStockDocuments: {
    data: [],
    previous: null,
    next: null,
  },
  loder: false,
};

export const getProducts = createAsyncThunk(
  "sumtracker/products",
  async ({ params, rejectWithValue }: any) => {
    // params["include"] = "stocklevels"
    const url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.PRODUCTS;

    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (err) {
      let error: any = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getStockDocument = createAsyncThunk(
  "sumtracker/getStockDocument",
  async ({ url, rejectWithValue }: any) => {
    const defaultUrl =
      BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.LIST_ADJUST_STOCK;
    try {
      const response = await axios.get(url === null ? defaultUrl : url);
      return response.data;
    } catch (err) {
      let error: any = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUpdateDocumentData = createAsyncThunk(
  "sumtracker/getUpdateDocumentData",
  async (id: Number, { rejectWithValue }) => {
    const url =
      BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.LIST_ADJUST_STOCK + `${id}/`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      let error: any = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const putUpdateStock = createAsyncThunk(
  "sumtracker/putUpdateStock",
  async (id: any, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const adjustStockState = state.adjust_stock_form;

    const { max_index } = adjustStockState.updateStockForm;
    const url =
      BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.LIST_ADJUST_STOCK + `${id}/`;
    const ReqBody = generateAdjustFormBody({
      AdjustStockForm: adjustStockState.updateStockForm,
      isEdit: true,
      max_index: max_index,
    });
    try {
      const response = await axios.put(url, ReqBody);
      return response.data;
    } catch (err) {
      let error: any = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const putMarkAsComplete = createAsyncThunk(
  "sumtracker/putMarkAsComplete",
  async ({ isNew, params }: any, { rejectWithValue }) => {
    if (!isNew) {
      try {
        const url =
          BACKEND_API_PATHS.BASE +
          BACKEND_API_PATHS.MARK_AS_COMPLETE +
          `${params.id}/${params.action}/`;
        const response = await axios.put(url);
        return response.data;
      } catch (err) {
        let error: any = err;
        if (!error.response) {
          throw err;
        }
        return rejectWithValue(error.response.data);
      }
    }
  }
);

// export const getStockLevels = createAsyncThunk(
//   "sumtracker/getStockLevels",
//   async ({ params }: any) => {
//     const url =
//       BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.STOCK_LEVELS ;
//     const response = await axios.get(url, { params });
//     return response.data;
//   }
// );

const adjustStockForm = createSlice({
  name: "adjustStockForm",
  initialState: initialState,
  reducers: {
    updateAdjustStockFormData: (state: any, action) => {
      // state.loder = true;
      state.AdjustStockForm = { ...state.AdjustStockForm, ...action.payload };
    },
    updateUpdateStockForm: (state: any, action) => {
      state.updateStockForm = { ...state.updateStockForm, ...action.payload };
    },
    updateChecked: (state: any, action) => {
      const objIndex = state.ProductListData.findIndex(
        (obj: any) => obj.id === action.payload["product"].id
      );
      state.ProductListData[objIndex].checked =
        !state.ProductListData[objIndex].checked;

      const selected = state.ProductListData.filter(
        (product: any) => product.checked
      );
      if (state.temporarySelectedProducts.length === 0) {
        state.temporarySelectedProducts = selected;
      } else {
        const isFound = state.temporarySelectedProducts.some((element: any) => {
          if (element.id === state.ProductListData[objIndex].id) {
            return true;
          }
        });
        if (isFound) {
          const objIndex = state.temporarySelectedProducts.findIndex(
            (obj: any) => obj.id === action.payload["product"].id
          );
          state.temporarySelectedProducts.splice(objIndex, 1);
        } else {
          state.temporarySelectedProducts.push(state.ProductListData[objIndex]);
        }
      }
      state.selectedProducts = state.temporarySelectedProducts.length;
    },
    fetchProductList: (state: any, action) => {
      state.loder = true;
      state.ProductListData = action.payload["results"];
      state.ProductListData.forEach(function (product: any) {
        if (state.temporarySelectedProducts.length !== 0) {
          const available = state.temporarySelectedProducts.some(
            (selected: any) => (selected["id"] === product["id"] ? true : false)
          );
          if (available) {
            product["checked"] = true;
            product["newQTY"] = "";
          } else {
            product["checked"] = false;
            product["newQTY"] = "";
          }
        } else {
          product["checked"] = false;
          product["newQTY"] = "";
        }
      });
      state.loder = false;
    },
    updateQTY: (state: any, action) => {
      const { sid, value, isNew } = action.payload;
      const decideState = isNew
        ? state.AdjustStockForm["selectedProducts"]
        : state.updateStockForm["selectedProducts"];
      decideState
        .filter((product: any) => product.sid === sid)
        .map((productSID: any) => (productSID["newQTY"] = value));
    },
    updateSelecetAll: (state: any, action) => {
      const { check } = action.payload;
      state.ProductListData = state.ProductListData.map((product: any) => {
        return { ...product, checked: check };
      });
      check
        ? (state.temporarySelectedProducts = state.ProductListData)
        : (state.temporarySelectedProducts = []);
      state.selectedProducts = check ? state.ProductListData.length : 0;
    },
    addSelected: (state: any, action) => {
      const { isNew } = action.payload;
      const selectedProducts = isNew
        ? state.AdjustStockForm["selectedProducts"]
        : state.updateStockForm["selectedProducts"];
      let lastProduct =
        selectedProducts.length > 0 ? selectedProducts.length + 1 : 0;
      state.temporarySelectedProducts.map((selected: any) => {
        selected["sid"] = lastProduct;
        selectedProducts.push(selected);
        lastProduct += 1;
      });
      state.ProductListData.forEach(function (product: any) {
        product["checked"] = false;
        product["newQTY"] = "";
      });
      state.temporarySelectedProducts = [];
      state.selectedProducts = 0;
    },
    deleteSelectedProduct: (state: any, action) => {
      const { sid, isNew } = action.payload;
      const decideState = isNew ? state.AdjustStockForm : state.updateStockForm;

      const index = decideState["selectedProducts"].findIndex(
        (product: any) => product["sid"] === sid
      );
      decideState["selectedProducts"].splice(index, 1);
    },
    setError: (state: any, action: any) => {
      const { title, message, type } = action.payload;
      state.errorMessage = {
        title: title,
        desc: message,
        type: type,
      };
    },
    setDummyUpdateStockForm: (state: any) => {
      state.dummyUpdateStockForm = state.updateStockForm;
    },
    updateMarkasComplete: (state: any, action: any) => {
      action.payload["lines"].forEach(function (product: any) {
        state.updateStockForm["selectedProducts"].some((selected: any) => {
          if (selected["index_number"] === product["index_number"]) {
            selected["stocklevels"].some((v: any) => {
              if (v["warehouse_id"] === product["warehouse"]) {
                v["in_stock"] = product["product"]["in_stock"];
                v["booked"] = product["product"]["booked"];
              }
            });
          }
        });
      });
      state.updateStockForm["is_complete"] = action.payload["is_complete"];
      state.loder = false;
    },
    clearTemporarySelectedProducts: (state: any) => {
      state.temporarySelectedProducts = [];
      state.selectedProducts = 0;
    },
    clearAdjustStockForm: (state: any) => {
      state.AdjustStockForm = {
        warehouse: 0,
        reason: "",
        notes: "",
        adjustmentType: APP_CONSTANTS.STOCK_ACTION.ADD,
        selectedProducts: [],
      };
    },
    clearUpdateStockForm: (state: any) => {
      state.updateStockForm = {
        warehouse: 0,
        reason: "",
        notes: "",
        adjustmentType: "",
        selectedProducts: [],
        max_index: 0,
        is_complete: false,
      };
    },
    clearErroMessage: (state: any) => {
      state.errorMessage = {};
    },

    // old
  },
  extraReducers: (builder) => {
    builder
      // case for product list
      .addCase(getProducts.pending, (state, action) => {
        state.loder = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.ProductListData = action.payload["results"];
        state.ProductListData.forEach(function (product: any) {
          if (state.temporarySelectedProducts.length !== 0) {
            const available = state.temporarySelectedProducts.some(
              (selected: any) =>
                selected["id"] === product["id"] ? true : false
            );
            if (available) {
              product["checked"] = true;
              product["newQTY"] = "";
            } else {
              product["checked"] = false;
              product["newQTY"] = "";
            }
          } else {
            product["checked"] = false;
            product["newQTY"] = "";
          }
        });
        state.loder = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loder = false;
        state.errorMessage = {
          title: "Error While  Fetching Product",
          desc: action.payload
            ? JSON.stringify(action.payload)
            : action.error.message,
          type: "error",
        };
      })
      .addCase(getStockDocument.pending, (state, action) => {
        state.loder = true;
      })
      .addCase(getStockDocument.fulfilled, (state, action) => {
        state.listStockDocuments["data"] = action.payload.results;
        state.listStockDocuments["next"] = action.payload.next;
        state.listStockDocuments["previous"] = action.payload.previous;
        const sortedData = state.listStockDocuments["data"]?.sort(
          (a: any, b: any) => parseInt(a["number"]) - parseInt(b["number"])
        );
        state.listStockDocuments["data"] = sortedData;
        state.loder = false;
      })
      .addCase(getStockDocument.rejected, (state, action) => {
        state.loder = false;
        state.errorMessage = {
          title: "Error While  Fetching Document",
          desc: action.payload
            ? JSON.stringify(action.payload)
            : action.error.message,
          type: "error",
        };
      })
      // case for update stock document
      .addCase(getUpdateDocumentData.pending, (state, action) => {
        state.loder = true;
      })
      .addCase(getUpdateDocumentData.fulfilled, (state, action) => {
        const formatedData = formateDocumentdata({
          dataList: action.payload["lines"],
          productList: state.ProductListData,
          max_index: 0,
        });
        const sortedData = formatedData["SelectedProducts"]?.sort(
          (a: any, b: any) =>
            parseInt(a["index_number"]) - parseInt(b["index_number"])
        );
        state.updateStockForm = state.updateStockForm = {
          created_at: action.payload["created"],
          updated_at: action.payload["updated"],
          user: action.payload["user"]["full_name"],
          number: action.payload["number"],
          warehouse: action.payload["warehouse_id"],
          reason: action.payload["reason"],
          notes: action.payload["notes"],
          adjustmentType:
            action.payload["adjustment_type"] === "ADD"
              ? APP_CONSTANTS.STOCK_ACTION.ADD
              : action.payload["adjustment_type"] === "SUB"
              ? APP_CONSTANTS.STOCK_ACTION.SUB
              : APP_CONSTANTS.STOCK_ACTION.SET,
          selectedProducts: sortedData,
          max_index: formatedData["maxIndex"],
          is_complete: action.payload["is_complete"],
        };

        state.dummyUpdateStockForm = JSON.parse(
          JSON.stringify(state.updateStockForm)
        );
        state.loder = false;
      })
      .addCase(getUpdateDocumentData.rejected, (state, action) => {
        state.loder = false;
        state.errorMessage = {
          title: "Error While  Fetching Document Data",
          desc: action.payload
            ? JSON.stringify(action.payload)
            : action.error.message,
          type: "error",
        };
      })
      // case for updating stock document
      .addCase(putUpdateStock.pending, (state, action) => {
        state.loder = true;
      })
      .addCase(putUpdateStock.fulfilled, (state, action) => {
        const formatedData = formateDocumentdata({
          dataList: action.payload["lines"],
          productList: state.ProductListData,
          max_index: state.updateStockForm["max_index"],
        });
        const sortedData = formatedData["SelectedProducts"]?.sort(
          (a: any, b: any) =>
            parseInt(a["index_number"]) - parseInt(b["index_number"])
        );

        state.updateStockForm = {
          created_at: action.payload["created"],
          updated_at: action.payload["updated"],
          user: action.payload["user"]["full_name"],
          number: action.payload["number"],
          warehouse: action.payload["warehouse_id"],
          reason: action.payload["reason"],
          notes: action.payload["notes"],
          adjustmentType: action.payload["adjustment_type"],
          selectedProducts: sortedData,
          max_index: formatedData["maxIndex"],
          is_complete: action.payload["is_complete"],
        };
        state.loder = false;
        state.errorMessage = {
          title: "Product Document Updated!",
          desc: "",
          type: "sucess",
        };
      })
      .addCase(putUpdateStock.rejected, (state, action) => {
        state.loder = false;
        state.errorMessage = {
          title: "Error While  Updating Document",
          desc: action.payload
            ? JSON.stringify(action.payload)
            : action.error.message,
          type: "error",
        };
      })
      // case for mark as completed
      .addCase(putMarkAsComplete.pending, (state) => {
        state.loder = true;
      })
      .addCase(putMarkAsComplete.fulfilled, (state, action) => {
        action.payload["lines"].forEach(function (product: any) {
          state.updateStockForm["selectedProducts"].some((selected: any) => {
            if (selected["index_number"] === product["index_number"]) {
              selected["stocklevels"].some((v: any) => {
                if (v["warehouse_id"] === product["warehouse"]) {
                  v["in_stock"] = product["product"]["in_stock"];
                  v["booked"] = product["product"]["booked"];
                }
              });
            }
          });
        });
        state.updateStockForm["is_complete"] = action.payload["is_complete"];
        state.loder = false;
      })
      .addCase(putMarkAsComplete.rejected, (state, action: any) => {
        state.loder = false;
        state.errorMessage = {
          title: "Error While Completing Action",
          desc: action.payload
            ? JSON.stringify(action.payload.errors)
            : action.error.message,
          type: "error",
        };
      });
  },
});

export const performFetchProductList =
  ({ isNew, id }: any) =>
  async (dispatch: any) => {
    listProducts({ queryParams: { include: "stocklevels" } })
      .then((res) => {
        dispatch(fetchProductList(res.data));
        !isNew && dispatch(getUpdateDocumentData(id));
      })
      .catch((err) => {
        dispatch(
          setError({
            title: "Error While Fetching data from the Server",
            message: JSON.stringify(err.response.data),
            type: "error",
          })
        );
      });
  };

export const performMarkasComplete =
  ({ params }: any) =>
  async (dispatch: any) => {
    completeActionDocument(params)
      .then((res) => {
        let copyRes = JSON.parse(JSON.stringify(res));
        let productID: any = [];
        res["lines"].map((product: any) => {
          productID.push(product["product_id"]);
        });
        listProducts({
          queryParams: {
            include: "stocklevels",
            product_ids: productID.join(),
          },
        })
          .then((stocklist) => {
            copyRes["lines"].forEach(function (product: any) {
              stocklist.data["results"]
                .filter(
                  (selectedProduct: any) =>
                    selectedProduct["id"] === product["product_id"]
                )
                .map((stocklevel: any) => {
                  stocklevel["stocklevels"]
                    .filter(
                      (selectedStock: any) =>
                        selectedStock["warehouse_id"] === res["warehouse_id"]
                    )
                    .map((vv: any) => {
                      product["product"]["in_stock"] = vv["in_stock"];
                      product["product"]["booked"] = vv["booked"];
                    });
                });
            });
            dispatch(updateMarkasComplete(copyRes));
          })
          .catch((error: any) => {
            dispatch(
              setError({
                title: "something went wrong! please try after some time",
                message: JSON.stringify(error.response.data),
                type: "error",
              })
            );
          });
      })
      .catch((err) => {
        dispatch(
          setError({
            title: "Error While Completing Document",
            message: JSON.stringify(err.response.data),
            type: "error",
          })
        );
      });
  };

export const {
  updateAdjustStockFormData,
  updateChecked,
  updateSelecetAll,
  deleteSelectedProduct,
  addSelected,
  updateQTY,
  clearTemporarySelectedProducts,
  clearAdjustStockForm,
  updateUpdateStockForm,
  fetchProductList,
  setDummyUpdateStockForm,
  updateMarkasComplete,
  setError,
  clearErroMessage,
  clearUpdateStockForm,
} = adjustStockForm.actions;
export default adjustStockForm.reducer;
