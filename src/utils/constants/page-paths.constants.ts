const PAGE_PATHS = {
  //auth
  LOGIN: "login/",
  RESET: "reset/password/:token",
  SIGNUP: "signup/",
  VERIFICATION: "verify/",

  //common
  AUTHORIZED_PATH_HEAD: "index/",
  BASIC_LAYOUT: "index/",
  HOME: "index/adjust-stock-table/",
  DASHBOARD: "index/dashboard",
  CONNECT_STORE: "index/connect-store",

  //channels
  CHANNEL: "index/channels/:id/:tabKey",
  CHANNEL_TAB_KEYS: {
    DETAILS: "details",
    WAREHOUSE_LINKED: "warehouse-linked",
    ONLINE_LISTING: "online-listings",
    ERRORS: "errors",
  },
  // CHANNEL_WAREHOUSE_LINKED: "index/channels/:id/:tabKey",
  // CHANNEL_ONLINE_LISTINGS: "index/channels/:id/online-listings",
  // CHANNEL_ERRORS: "index/channels/:id/errors",

  //onboarding
  ON_BOARDING: "index/onboarding/",

  //stock
  STOCK_LIST: "index/adjust-stock-table/",
  ADJUST_STOCK_LIST: "index/adjust-stock-forms/",
  ADJUST_STOCK_IMPORT_NEW: "index/adjust-stock/import/new/",
  ADJUST_STOCK_IMPORT_EDIT: "index/adjust-stock/import/edit/:id",
  ADJUST_STOCK_IMPORT: "index/adjust-stock/import/",
  ADJUST_STOCK_FORM_NEW: "index/adjust-stock/form/new/",
  ADJUST_STOCK_FORM_EDIT: "index/adjust-stock/form/edit/:id/",
  STOCK_TRANSFER_LIST: "index/stock-transfer/list",
  STOCK_TRANSFER_EDIT: "index/stock-transfer/form/edit/:id/",
  STOCK_TRANSFER_NEW: "index/stock-transfer/form/new",
  PRODUCT_STOCK_LOCATION: "index/product/stock-levels/",
  BUNDLE_STOCK_LOCATION: "index/product/bundles-stock-by-location/",

  //product
  PRODUCT_LIST: "index/product/list/",
  PRODUCT_LIST_DEFAULT_QUERY_PARAMS: "include=count_links&is_archived=false",
  PRODUCT_NEW: "index/product/new",
  PRODUCT_DETAIL: "index/product/:id/product-details",
  PRODUCT_LISTING: "index/product/:id/online-listings",
  PURCHASE_PRICE: "index/product/:id/purchase-rates",
  PRODUCT_INVENTORY: "index/product/:id/stock-logs",
  PRODUCT_INVENTORY_PAGINATE: "index/product/stock/logs/",
  PRODUCT_STOCK_LEVEL: "index/product/:id/stock-by-location",
  PURCHASE_RATE: "index/product/:id/purchase-rates/new",
  EDIT_PURCHASE_RATE: "index/product/:id/purchase-rates/:purchaseId",
  PRINT_PRODUCT_LIST: "product/print-list",
  PRINT_STOCK_LOCATION_LIST: "product/stock-levels-print",

  //bundles
  BUNDLE_LIST: "index/bundles/list",
  BUNDLE_NEW: "index/bundle/new",
  BUNDLE_DETAIL: "index/bundle/edit/:id",

  // orders
  ORDER_LIST: "index/ecom/order-list/",
  ORDER_DETAIL: "index/ecom/order/:id",

  ANGULAR_APP_PATHS: {
    DASHBOARD: "index/dashboard",
    ORDERS: "index/ecom/order-list?tab_id=1",
    PURCHASE: {
      PURCHASE_ORDERS: "index/purchase/order/list?tab_id=1",
      RECEIVE_NOTES: "index/purchase/grn/list",
      SUPPLIERS_LIST: "index/contact/list",
      PARCHASE_PRICE_LIST: "index/ecom/settings/pack-size-list",
    },
    PRODUCTS: "index/product/list?is_archived=False&include=count_links",
    BUNDLES: "index/bundles/list?is_archived=False",
    STOCK_BY_LOCATION: {
      ALL_PRODUCTS:
        "index/product/stock-levels?tab_id=1&product_is_archived=False&product_tracking_type=2",
      BUNDLES: "index/product/bundles-stock-by-location",
    },
    ADJUST_STOCK: {
      STOCK_TRANSFERS: "index/stock-transfer/list",
    },
    REPORTS: "index/reports-dashboard",
    SETTINGS: {
      APP_SETTINGS: "index/settings/1",
      USERS: "index/settings/2",
      SHOPIFY_BILLING: "index/billing/shopify",
    },
  },
};

export default PAGE_PATHS;
