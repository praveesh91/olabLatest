export const ECOM_CONSTANTS: Record<string, any> = {
  SHOPIFY_APP_STORE_URL:
    "https://apps.shopify.com/sumtracker-fulfil-ship-track",
  AMAZON_APP_STORE_URL:
    "https://sellercentral.amazon.com/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
  ACTIONS: {
    CLOSE: "close/",
    ARCHIVE: "archive/",
    REFRESH: "refresh/",
    OPEN: "open/",
    REFRESH_PRODUCT_LINKS: "refresh-product-links/",
    CANCEL: "cancel/",
    PUBLISH: "publish/",
    SYNC_INVENTORY: "sync_inventory/",
    SYNC_ORDERS: "sync_orders/",
    SYNC_PRODUCTS: "sync_products/",
    DISCONNECT: "disconnect/",
    HARD_REFRESH_INVENTORY: "hard_refresh_inventory/",
    SET_STOCK_FROM_STORE: "set_stock_from_store/"
  },
  SETTINGS: {
    ECOM_CHANNELS: "channels",
  },
  CHANNEL_TYPE: {
    SHOPIFY: 2,
    AMAZON: 3,
    OFFLINE: 5,
    WOOCOMMERCE: 6,
    EBAY: 7,
    ETSY: 8,
  },
  CHANNEL_TYPES_CREATION: {
    AMAZON: 3,
    WOOCOMMERCE: 6,
    EBAY: 7,
    ETSY: 8,
  },
  CHANNEL_DATA: {
    2: {
      shorthand: "/images/shopify-shorthand.svg",
      NAME: "SHOPIFY",
    },
    3: {
      shorthand: "/images/amazon-shorthand.svg",
      NAME: "AMAZON",
    },
    6: {
      shorthand: "/images/woo-shorthand.svg",
      NAME: "WOO COMMERCE",
    },
    7: {
      shorthand: "/images/ebay-shorthand.svg",
      NAME: "EBAY",
    },
    8: {
      shorthand: "/images/etsy-shorthand.svg",
      NAME: "ETSY",
    },
  },
  ORDER_STATUS: {
    OPEN: "OPEN",
    CANCELLED: "CANCELLED",
    CLOSED: "CLOSED",
    INVALID: "INVALID",
  },
  ORDER_STATUS_NAMES: {
    OPEN: "OPEN",
    CANCELLED: "CANCELLED",
    CLOSED: "CLOSED",
    INVALID: "INVALID",
  },
  FULFILLMENT_STATUS: {
    PENDING: "PENDING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
  },
  FULFILLMENT_STATUS_NAMES: {
    PENDING: "PENDING",
    COMPLETE: "FULFILLED",
    PARTIAL: "PARTIAL",
  },
  EBAY_MARKETPLACES: [
    {
      id: "US",
      name: "Ebay United States",
    },
    {
      id: "GB",
      name: "Ebay Great Britain",
    },
    {
      id: "CA",
      name: "Ebay Canada",
    },
    {
      id: "AU",
      name: "Ebay Australia",
    },
    {
      id: "SG",
      name: "Ebay Singapore",
    },
    {
      id: "DE",
      name: "Ebay Germany",
    },
    {
      id: "HK",
      name: "Ebay Hong Kong",
    },
  ],
  AMAZON_MARKETPLACES: [
    {
      id: "US",
      name: "Amazon US",
      url: "https://sellercentral.amazon.com/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "GB",
      name: "Amazon UK",
      url: "https://sellercentral-europe.amazon.com/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "CA",
      name: "Amazon Canada",
      url: "https://sellercentral.amazon.ca/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "AU",
      name: "Amazon Australia",
      url: "https://sellercentral.amazon.com.au/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "SG",
      name: "Amazon Singapore",
      url: "https://sellercentral.amazon.sg/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "DE",
      name: "Amazon Germany",
      url: "https://sellercentral-europe.amazon.com/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "IN",
      name: "Amazon India",
      url: "https://sellercentral.amazon.in/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "MX",
      name: "Amazon Mexico",
      url: "https://sellercentral.amazon.com.mx/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "BR",
      name: "Amazon Brazil",
      url: "https://sellercentral.amazon.com.br/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "ES",
      name: "Amazon Spain",
      url: "https://sellercentral-europe.amazon.com/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "FR",
      name: "Amazon France",
      url: "https://sellercentral-europe.amazon.com/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "NL",
      name: "Amazon Netherlands",
      url: "https://sellercentral.amazon.nl/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "IT",
      name: "Amazon Italy",
      url: "https://sellercentral-europe.amazon.com/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "SE",
      name: "Amazon Sweden",
      url: "https://sellercentral.amazon.se/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "PL",
      name: "Amazon Poland",
      url: "https://sellercentral.amazon.pl/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "TR",
      name: "Amazon Turkey",
      url: "https://sellercentral.amazon.com.tr/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "AE",
      name: "Amazon Arab Emirates",
      url: "https://sellercentral.amazon.ae/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
    {
      id: "JP",
      name: "Amazon Japan",
      url: "https://sellercentral.amazon.co.jp/partnernetwork/dp/amzn1.sp.solution.db49df36-15af-4531-b9c1-5512407b15a3",
    },
  ],
  SHOPIFY_PLAN_STATUS: {
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
  },
};
