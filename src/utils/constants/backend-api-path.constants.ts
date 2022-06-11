import config from "../../config/config";

/**
 * Created by ankit on 14/12/13.
 */
export const BACKEND_API_PATHS = {
  BASE: config.serverAddress,
  //USERS
  LOGIN: "users/login/",
  SIGNUP: "users/signup/",
  STAFF_LOGIN: "users/login/staff/",
  LOGOUT: "users/logout/",
  FORGOT_PASSWORD_LINK: "users/password/forgot/",
  RESET_PASSWORD: "users/password/reset/",
  USERS: "users/",
  USER_INVITATIONS: "users/invitations/",
  SEND_USER_INVITATION: "users/send/invitation/",
  RESEND_USER_INVITATION: "users/invitations/resend/",
  ACCEPT_USER_INVITATION: "users/accept/invitation/",
  SEND_VARIFICATION_TOKEN: "users/send/verification_token/",

  //SETTINGS
  METADATA: "settings/metadata/",
  TAXES: "settings/taxes/",
  PAYMENT_MODES: "settings/payment_modes/",
  SET_USER_SETTING: "settings/set/",
  DEFAULT_SETTINGS: "settings/defaults/",
  WAREHOUSES: "settings/warehouses/",
  DOCUMENT_TYPES: "settings/documents/types/",
  PRINT_CONFIG: "settings/documents/print/configs/",
  DOCUMENT_NUMBER: "settings/documents/types/edit_number/",
  CLIENT_SETTINGS: "settings/client/settings/",
  GET_SETTINGS: "settings/client/settings/",
  SET_SETTINGS: "settings/client/settings/set/",

  //PRODUCTS
  PRODUCTS: "products/",
  PRODUCT_TAGS: "products/tags/",
  PRODUCT_BULK_ACTIONS: {
    BASE: "products/bulk/",
    DELETE: "delete/",
    ARCHIVE: "archive/",
    UNDO_ARCHIVE: "undo-archive/",
    DELETE_BUNDLES: "delete-bundle/",
    SET_TRACKED: "set_tracked/",
    SET_NOT_TRACKED: "set_not_tracked/",
  },
  ALIVE_PRODUCTS: "products/?paginate=False&is_archived=False",
  PRODUCT_GROUP1: "products/groups/1/",
  BUNDLES: "products/bundles/",
  BUNDLE_LINES: "products/bundles/lines/",
  BUNDLES_IMPORT: "products/bundles/import/",
  BUNDLES_STOCK_REPORT: "products/reports/bundles/stock/",
  PRODUCT_PACK_SIZES: "products/pack_sizes/",
  PRODUCT_COUNTS: "products/reports/counts/",
  FORCE_SYNC_PRODUCT_INVENTORY: "sync_inventory/",
  PURCHASE_RATES: "products/purchase/rates/",

  //CONTACTS
  CONTACTS: "contacts/",
  ADDRESSES: "contacts/addresses/",

  WRITE_OFF_TYPES: "operations/stock/write/offs/types/",
  ADDITION_TYPES: "operations/stock/additions/types/",
  PURCHASE_ORDER: "purchases/orders/",
  PURCHASE_RETURN: "purchases/returns/",
  GRN: "purchases/grns/",
  PERFORM_ACTION: "perform_action/",
  PERFORM_BULK_ACTION: "perform_action/bulk/",

  // operations
  WRITE_OFF: "operations/stock/write/offs/",
  WRITE_OFF_IMPORT: "operations/import/write_off/",
  WRITE_OFF_LINES: "operations/stock/write/offs/lines/",
  ADDITION: "operations/stock/additions/",
  ADDITION_IMPORT: "operations/import/addition/",
  ADDITION_LINES: "operations/stock/additions/lines/",
  STOCK_ADDITION_REPORT: "operations/reports/additions/lines/",
  REDUCE_STOCK_REPORT: "operations/reports/write/offs/lines/",
  SET_STOCK: "operations/set_stocks/",
  SET_STOCK_IMPORT: "operations/import/set_stock/",
  SET_STOCK_LINES: "operations/set_stocks/lines/",
  STOCK_TRANSFER: "operations/stock/transfers/",
  STOCK_TRANSFER_IMPORT: "operations/import/stock_transfer/",
  STOCK_TRANSFER_LINES: "operations/stock/transfers/lines/",
  STOCK_LEVELS: "stock/levels/",
  BUNDLE_LOCATION: "stock/levels/bundles/",
  EMAIL_STOCK_LEVELS: "stock/levels/email/",
  STOCK_LOGS: "stock/logs/",
  STOCK_SNAPSHOT: "stock/logs/snapshot/",
  UNDO_ARCHIVE: "undo-archive/",
  IMPORT_STOCK_FROM_SHOPIFY: "ecom/settings/channels/shopify/set_inventory/",
  ADJUST_STOCK: "operations/stock/adjust/document/",
  ADJUST_STOCK_LINE: "operations/stock/adjust/",
  ADJUST_STOCK_IMPORT: "operations/import/",
  PRODUCTS_IMPORT: "products/import/",
  MARK_AS_COMPLETE:
    "operations/stock/adjust/document/perform_action/:id/:action/",
  ADJUSTMENT_REASONS: "operations/adjustment/reasons/",
  STOCK_TRANSFER_MARK_COMPLETE:
    "operations/stock/transfers/perform_action/:id/mark-complete/",

  // NEW COLLECTION
  LIST_ADJUST_STOCK: "operations/stock/adjust/document/",

  // REPORTS
  DASHBOARD_SUMMARY: "dashboard/daily/summary/",
  STOCK_OUTS: "stock/outs/",
  STOCK_LEVELS_REPORT: "stock/reports/levels/",
  SALES_REPORT: "sales/reports/",
  PURCHASES_REPORT: "purchases/reports/",
  PO_VS_GRN_REPORT: "purchases/reports/grns/compare_po_rates/",
  CHANGE_PASSWORD: "users/password/change/",
  SET_WAREHOUSE_LIST: "users/set/warehouse_list/",
  IMPORT: "import/",
  DELETE_LOG: "settings/delete-log/",
  ERROR_LOG: "ecom/settings/error-log/",

  // ECOM URLS
  //settings
  FULFILLMENT_RULES: "ecom/settings/fulfillment/rules/",
  FULFILLMENT_RULES_DELETE: "ecom/settings/fulfillment/rules/bulk/delete/",
  CHANNELS: "ecom/settings/channels/",
  CHANNEL: "ecom/settings/channels/:id/",
  SYNC_CHANNEL: "ecom/settings/channels/sync_inventory/:id/",
  TOGGLE_SYNC_CHANNEL: "ecom/settings/channels/toggle_has_inventory_sync/:id/",
  PRODUCT_LINKS: "ecom/settings/channels/products/links/",
  WAREHOUSE_LINKS: "ecom/settings/channels/warehouses/links/",
  SHIPMENT_CARRIERS: "carriers/",
  INVENTORY_RULES: "ecom/settings/inventory/rules/",
  EBAY_AUTH_URL: "ecom/settings/channels/ebay/auth/get_auth_url/",
  ETSY_AUTH_URL: "ecom/settings/channels/etsy/auth/get_auth_url/",
  WOOCOMMERCE_AUTH_URL: "ecom/settings/channels/woocommerce/auth/get_auth_url/",
  BIGCOMMERCE_AUTH_URL: "ecom/settings/channels/bigcommerce/auth/get_auth_url/",
  AMAZON_AUTH_URL: "ecom/settings/channels/amazon/auth/get_auth_url/",
  //billing
  BILLING_PLANS: "settings/billing/plans/",
  SUBSCRIPTION: "settings/billing/subscription/",
  CREATE_RECURRING_CHARGE:
    "ecom/settings/channels/shopify/billing/recurring_charges/create/",
  CANCEL_RECURRING_CHARGE:
    "ecom/settings/channels/shopify/billing/recurring_charges/cancel/",
  CURRENT_RECURRING_CHARGE:
    "ecom/settings/channels/shopify/billing/recurring_charges/current/",
  CREATE_USAGE_CHARGE:
    "ecom/settings/channels/shopify/billing/recurring_charges/create/usage_charge/",
  LIST_USAGE_CHARGE: "ecom/settings/channels/shopify/billing/usage_charges/",
  CREDIT_BALANCE: "ecom/settings/credit_balance/",

  //stripe
  STRIPE_SUBSCRIPTION_CREATE:
    "settings/billing/stripe/checkout_session/create/",
  STRIPE_SUBSCRIPTION_CANCEL: "settings/billing/stripe/subscription/cancel/",
  STRIPE_SUBSCRIPTION_UPDATE:
    "settings/billing/stripe/subscription/update/:plan_id/",
  STRIPE_PORTAL_CREATE: "settings/billing/stripe/customer_portal/create/",
  STRIPE_CHARGE_GET: "settings/billing/stripe/charge/",
  //shopify
  SHOPIFY_LOCATIONS: "ecom/settings/channels/shopify/locations/",
  SHOPIFY_CONNECT: "ecom/settings/channels/shopify/connect/",
  AMAZON_CONNECT: "ecom/settings/channels/amazon/connect/",
  // ebay
  EBAY_INVENTORY_ITEM_UPDATE:
    "ecom/settings/channels/ebay/inventory_item/update/",
  EBAY_INVENTORY_OFFER_UPDATE:
    "ecom/settings/channels/ebay/inventory_item/offer/update/",
  //bulk
  REFRESH_PRODUCT_LINKS: "ecom/orders/refresh_product_links/",
  //orders
  ORDERS: "ecom/orders/",
  ORDERLINES: "ecom/orders/lines/",
  CHANNEL_ACTIONS_URL: "ecom/settings/channels/:action/:id/",
  CHANNEL_ACTIONS: {
    SYNC_INVENTORY: "sync_inventory",
    TOGGLE_INVENTORY_SYNC: "toggle_has_inventory_sync",
    HARD_REFRESH_INVENTORY: "hard_refresh_inventory",
    SYNC_PRODUCTS: "sync_products",
    HARD_REFRESH_PRODUCTS: "hard_refresh_products",
    DISCONNECT: "disconnect",
    SET_STOCK_FROM_STORE: "set_stock_from_store",
  },
  CREATE_FULFILLMENT_ORDER: "ecom/orders/create_fulfillment_order/",
  //fulfillment
  FULFILLMENT_ORDER: "ecom/fulfillment/orders/",
  //ecom reports
  ORDERS_DAILY_SUMMARY: "ecom/reports/daily/summary/",
  PRODUCTS_DAILY_SUMMARY: "products/reports/summary/",
  ORDERLINES_REPORT: "ecom/reports/orders/lines/",
  ORDER_STATUS_REPORT: "ecom/reports/orders/status/",
  BUNDLE_COMPONENT_SALES: "ecom/reports/fo/components/lines/",
  MONTHLY_STOCK_REPORT: "stock/reports/files/",
  PRODUCT_SALES_REPORT: "ecom/reports/products/sales/",

  CLOUD_STORAGE_URL:
    "https://storage.googleapis.com/sumtracker-assets/inventory-app/",
};
