import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice";
import metaDataReducer from "../slices/meta-data.slice";
import inventoryReducer from "../slices/inventory.slice";
import errorsSlice from "../slices/errors.slice";
import successSlice from "../slices/success.slice";
import adjustStockFormReducer from "../slices/adjuststockform.slice";
import componentsSlice from "../slices/components.slice";
import alertSlice from "../slices/alert.slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    meta_data: metaDataReducer,
    inventory: inventoryReducer,
    errors: errorsSlice,
    success: successSlice,
    adjust_stock_form: adjustStockFormReducer,
    components: componentsSlice,
    alert: alertSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
