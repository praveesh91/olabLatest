import config from "../../config/config";

const APP_CONSTANTS: any = {
  SA: config.serverAddress,
  ENVIRONMENT: config.ENVIRONMENT,
  versionNo: config.VERSION_NUMBER,
  versionInteger: config.VERSION_INTEGER,
  versionIntegerKey: config.VERSION_INTEGER_KEY,
  filesURL: "client/components/",
  cookieOptions: config.COOKIE_OPTIONS,
  ROLLBAR_ENVIRONMENT: config.ROLLBAR_ENVIRONMENT,
  ROLLBAR_TOKEN: config.ROLLBAR_TOKEN,
  RECAPTCHA_SITEKEY: config.RECAPTCHA_SITEKEY,
  ACTIONS: {
    PUBLISH: "publish/",
    UNDO_PUBLISH: "undo-publish/",
    RECEIVE: "receive/",
    UNDO_RECEIVE: "undo-receive/",
    ON_ORDER: "on-order/",
    UNDO_ON_ORDER: "undo-on-order/",
    CLOSE: "close/",
    CANCEL: "cancel/",
    UNDO_CLOSE: "undo-close/",
    BOOK: "book/",
    UNDO_BOOK: "undo-book/",
    CREATE_TRANSFER: "create-transfer/",
    ARCHIVE: "archive/",
    UNDO_ARCHIVE: "undo-archive/",
    FINISH: "finish/",
    SET_STOCK: "set/",
    MARK_AS_COMPLETE: "mark-complete/",
    UNDO_COMPLETE: "undo-complete/",
  },
  SETTINGS: {
    CLIENT_ID: "id",
    CLIENT_NAME: "name",
    CLIENT_SOURCE: "source",
    CLIENT_IS_ACTIVE: "is_active",
    LOCALE: "locale",
    SUBSCRIPTION: "subscription",
    TAXES: "taxes",
    TOKEN: "token",
    PRODUCT_GROUP1: "group1s",
    WAREHOUSES: "warehouses",
    CONTENT_TYPE: "content_types",
    BROWSER_KEY: "browser_key",
    DOCUMENT_TYPE: "document_types",
    MENU: "menu",
    USER: "user",
    USERS: "users",
    ADDRESSES: "addresses",
    PERMISSIONS: "permissions",
    PRINT_CONFIG: "print_configs",
    UOMS: "uoms",
    DEFAULT_SETTINGS: "default_setting",
    CLIENT_SETTINGS: "client_settings",
    USER_SETTINGS: "user_settings",
    WRITE_OFF_TYPES: "write_off_types",
    ADDITION_TYPES: "addition_types",
    PRODUCT_UPDATE_TIME: "product_update_time",
  },
  CONTENT_TYPES: {
    PURCHASE_ORDER: "purchaseorder",
    GRN: "grn",
    PURCHASE_RETURN: "purchasereturn",
    STOCK_TRANSFER: "stocktransfer",
    WRITE_OFF: "writeoff",
    ADDITION: "addition",
    SET_STOCK: "setstockdocument",
    STOCK_ADJUSTMENT: "stockadjustment",
    ORDER: "order",
    FULFILLMENT_ORDER: "fulfillmentorder",
  },
  CONTENT_TYPE_NAMES: {
    //documents
    purchaseorder: "Purchase Order",
    grn: "GRN",
    purchasereturn: "Purchase Return",
    stocktransfer: "Stock Transfer",
    writeoff: "Write Off",
    addition: "Addition",
    setstockdocument: "Set Stock",
    stockadjustment: "Stock Adjustment",
    //other docs
    product: "Product",
    warehouse: "Warehouse",
    user: "User",
    order: "Order",
    fulfillmentorder: "Fulfillment Order",
  },
  IDB: {
    DB_NAME: "sumtracker-db",
    DATA_STORE_NAME: {
      PRODUCTS_LIST: "products_list",
    },
  },
  DATE_FORMAT: {
    POST_DATE: "PP",
    POST_DATETIME: "yyyy-MM-dd HH:mm:ss",
    POST_DATETIME_MOMENT: "YYYY-MM-DD HH:mm:ss",
    DISPLAY_DATE_MOMENT: "DD-MMM-YYYY HH:mm:ss",
    DISPLAY_DATETIME: "Pp",
    DISPLAY_DATE: "mediumDate",
    PRINT_DATETIME: "medium",
    PRINT_DATE: "mediumDate",
    //DATE_PICKER: 'DD-MMM-YY',
  },
  TRACKING_TYPE: {
    TRACKED: 2,
    NOT_TRACKED: 5,
  },
  TRACKING_TYPE_NAME: {
    2: "Tracked",
    5: "Not Tracked",
  },
  TRACKING_TYPE_CODE: {
    2: "TRACKED",
    5: "NOT_TRACKED",
  },
  PRODUCT: {
    TYPEAHEAD: {
      MIN_LENGTH: 2,
      WAIT_TIME: 100,
    },
    ARCHIVED_PRODUCT_NAME: "Archived Product",
  },
  PO_STATUS: {
    DEFAULT: 2,
    ON_ORDER: 3,
    CLOSED: 4,
  },
  PO_STATUS_NAMES: {
    2: "Draft",
    3: "On Order",
    4: "Closed",
  },

  DELIVERY_STATUS: {
    DEFAULT: 2,
    DELIVERED: 3,
  },
  DELIVERY_STATUS_NAMES: {
    2: "Draft",
    3: "Delivered",
  },
  STOCK_TRANSFER_STATUS: {
    DEFAULT: 2,
    SHIPPED: 3,
    RECEIVED: 4,
  },
  STOCK_TRANSFER_STATUS_NAMES: {
    2: "Draft",
    3: "Not Received",
    4: "Received",
  },
  WAREHOUSE_TYPE: {
    DEFAULT: 2,
  },
  WAREHOUSE_TYPE_NAMES: {
    2: "Own Warehouse",
  },
  DISPLAY_WAREHOUSE_TYPE: {
    DEFAULT: 2,
  },
  BUNDLE_TYPES: {
    BUNDLE: "BUNDLE",
    ASSEMBLE: "ASSEMBLE",
    NONE: "NONE",
  },
  CONTACT: {
    TYPEAHEAD: {
      MIN_LENGTH: 0,
      WAIT_TIME: 100,
    },
  },
  REGEX: {
    POSITIVE_REAL_NOS_INCL_ZERO: /^[+]?([.]\d+|\d+[.]?\d*)$/, //for prices
    POSITIVE_REAL_NOS_EXCL_ZERO: /^(?!0*(\.0+)?$)(\d+|\d*\.\d+)$/, //for quantity
    POSITIVE_INT_INCL_ZERO: /^\d+$/, //for phone numbers & invoice/order numbering
    REAL_NOS: /^-*[0-9,.]+$/, //for balances
    PERCENTAGE_WITH_2_DECIMALS: /^(\d\d?(\.\d\d?)?|100(\.00?)?)$/,
    PERCENTAGE_WITH_4_DECIMALS: /^(\d\d?(\.\d\d?\d?\d?)?|100(\.00?)?)$/,
    PERCENTAGE_WITH_8_DECIMALS:
      /^(\d\d?(\.\d\d?\d?\d?\d?\d?\d?\d?)?|100(\.00?)?)$/,
    DECIMALS_UPTO_SIX_PLACES: /^(?!0\d|$)\d*(\.\d{1,6})?$/, //for discounts
    NINE_DIGITS_5_DECIMALS: /^\s*?(\d{0,9}(\.\d{1,5})?|\.\d{1,5})\s*$/, //for conversion rate
    DECIMALS_UPTO_TWO_PLACES: /^\s*?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/, //for total prices
    TEN_DIGITS_4_DECIMALS: /^\s*?(\d{0,10}(\.\d{1,4})?|\.\d{1,4})\s*$/, // for unit prices and quantity
    TWELVE_DIGITS_2_DECIMALS: /^\s*?(\d{0,12}(\.\d{1,2})?|\.\d{1,2})\s*$/, // for payments
    GSTIN:
      /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[a-zA-Z][0-9a-zA-Z]{1}$/, //for gst in contacts
    VALID_NAME: /^[&,_\-\s.()+\/'"\\A-Za-z0-9]*$/,
    VALID_CODE_NAME: /^[a-z][_a-z0-9]*$/,
    PRODUCT_SEARCH: /[ \-\_]/,
    VALID_EMAIL: /^[a-zA=Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]+$/,
  },
  INV_FORMAT: {
    LINE_WIDTH_2: 0.2,
    LINE_WIDTH_4: 0.4,
    LINE_WIDTH_6: 0.6,
  },
  PAYMENT_METHOD_LIST: [
    "CASH",
    "CARD",
    "BANK DEPOSIT",
    "CHEQUE",
    "E-WALLET",
    "NONE",
  ],
  PAYMENT_STATUS: {
    PENDING: "PENDING",
    PARTIALLY_PAID: "PARTIALLY_PAID",
    PAID: "PAID",
  },
  PAYMENT_STATUS_NAMES: {
    PENDING: "PENDING",
    PARTIALLY_PAID: "PARTIALLY PAID",
    PAID: "PAID",
  },
  IMPORT_FILE_TYPE: "csv",
  LIMITS: {
    MAX: {
      NOTES_DISPLAY_LENGTH: 60,
      IMPORT_FILE_SIZE: 1536000,
      PRODUCT_IMAGE_SIZE: 204800,
    },
    MIN: {},
  },
  DEBOUNCE: 0,
  REQUEST_TIMEOUT: {
    DEFAULT: 60000, //60 seconds (60*1000)
    IMPORT: 150000, //150 seconds (2.5*60*1000)
  },
  TYPEAHEAD: {
    DEFAULT: {
      WAIT_TIME: 300,
      MIN_LENGTH: 0,
    },
  },
  COLORS: {
    RED: "#ffdfdf",
    YELLOW: "#ffffcb",
    GREEN: "#dbffdb",
  },
  BUTTONS: {
    /*NEW VERSION*/
    CREATE_GRN: "create_grn",
  },
  MONTHS: {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  },
  WEEK: {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  },
  CLIENT_SOURCE: {
    SHOPIFY_APP_STORE: "shopify_app_store",
    ADMIN_PANEL: "admin_panel",
  },
  SUBSCRIPTION_STATUS: {
    FREE_TRIAL: "FREE_TRIAL",
    ACTIVE: "ACTIVE",
    CANCELLED: "CANCELLED",
  },
  SUBSCRIPTION_STATUS_NAMES: {
    FREE_TRIAL: "Free Trial",
    ACTIVE: "ACTIVE",
    CANCELLED: "CANCELLED",
  },
  SUBSCRIPTION_PLANS: {
    YEARLY: "ANNUAL",
    MONTHLY: "EVERY_30_DAYS",
  },
  CONVERSIONS: {
    GM_TO_OZ: 0.035274,
    OZ_TO_GM: 28.3495,
  },
  SETTINGS_CODE: {
    HIDE_SETUP_INSTRUCTIONS: "hide_setup_instructions",
    HIDE_IMPORT_STOCK_FROM_SHOPIFY: "hide_shopify_stock_import",
  },
  TAX_ID_DISPLAY_NAME: {
    AU: "ABN: ",
    IN: "GSTIN: ",
  },
  STOCK_ACTION: {
    ADD: "ADD",
    SET: "SET",
    SUB: "SUB",
  },
  SAMPLE_FILE: {
    ADJUST_STOCK_LINES: "add-stock-import.csv",
  },
  EXPORT_TYPE: {
    ADJUST_STOCK_LINES: "ADJUST_STOCK_LINES",
    STOCK_LOCATIONS: "STOCK_LOCATIONS",
    PRODUCTS: "PRODUCTS",
    BUNDLES: "BUNDLES",
  },
  HELP_LINK: {
    ADJUST_STOCK:
      "https://help.sumtracker.com/article/141-adjust-stock-in-sumtracker",
  },
  SOURCE: {
    AMAZON: "AMAZON",
    SHOPIFY: "SHOPIFY",
    WEBSITE: "WEBSITE",
  },
};

export default APP_CONSTANTS;
