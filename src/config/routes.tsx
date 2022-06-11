import ProductListPage from "../pages/products/list";
import BasicLayout from "../layouts/basic.layout";
import AuthorizedRoute from "../routes/authorized.route";
import LoginPage from "../pages/login";
import InventoryList from "../pages/stock/adjust-stock-table";
import AdjustStockDocuments from "../pages/stock/adjust-stock-forms";
import PAGE_PATHS from "../utils/constants/page-paths.constants";
import DefaultRoute from "../routes/default.route";
import InventoryImportForm from "../pages/stock/import-stock";
import AdjustStockForm from "../pages/stock/adjust-stock-form";
import SettingPage from "../components/pages/setting-page";
import Settings from "../pages/settings";
import Billing from "../pages/settings/billing";
import Plans from "../pages/settings/billing/plans";
import Subscription from "../pages/settings/billing/subscription";
import ProductDetailsPage from "../pages/products/detail";
import ResetPage from "../pages/reset-password";
import OnBoardingPage from "../pages/onboarding";
import StockTransferListPage from "../pages/stock/stock-transfer/list";
import StockTransferForm from "../pages/stock/stock-transfer/form";
import SignupPage from "../pages/signup";
import EmailVerification from "../pages/email-verification";
import AddPurchasePriceDetail from "../pages/products/detail/components/add-purchase-price";
import EditPurchasePrice from "../pages/products/detail/components/edit-purchase-price";
import Dashboard from "../pages/dashboard";
import AddnewProduct from "../pages/products/list/components/add-product";
import PrintList from "../pages/products/list/components/print-list";
import BundleListPage from "../pages/bundles/list";
import BundleDetailsPage from "../pages/bundles/details";
import AddBundle from "../pages/bundles/list/components/add-bundle";
import ProductStockLocation from "../pages/stock-location/products";
import BundleStockLocation from "../pages/stock-location/bundles";
import OrdersList from "../pages/orders/list";
import OrderDetails from "../pages/orders/details";
import PrintStockLocationList from "../pages/stock-location/products/components/print-list";
import ConnectStore from "../pages/connect-store";
import Channel from "../pages/channels/form";

const routes: any = [
  {
    component: SignupPage,
    path: "/" + PAGE_PATHS.SIGNUP,
    exact: true,
  },
  {
    component: LoginPage,
    path: "/" + PAGE_PATHS.LOGIN,
    exact: true,
  },
  {
    component: ResetPage,
    path: "/" + PAGE_PATHS.RESET,
    exact: true,
  },
  {
    component: EmailVerification,
    path: "/" + PAGE_PATHS.VERIFICATION,
    expect: true,
  },
  {
    component: AuthorizedRoute,
    path: "/",
    routes: [
      {
        component: OnBoardingPage,
        path: "/" + PAGE_PATHS.ON_BOARDING,
        exact: true,
      },
      {
        component: PrintList,
        path: "/" + PAGE_PATHS.PRINT_PRODUCT_LIST,
        exact: true,
      },
      {
        component: PrintStockLocationList,
        path: "/" + PAGE_PATHS.PRINT_STOCK_LOCATION_LIST,
        exact: true,
      },
      {
        component: BasicLayout,
        path: "/",
        routes: [
          {
            component: Dashboard,
            path: "/" + PAGE_PATHS.DASHBOARD,
            exact: true,
          },
          {
            component: ConnectStore,
            path: "/" + PAGE_PATHS.CONNECT_STORE,
            exact: true,
          },
          {
            component: Channel,
            path: "/" + PAGE_PATHS.CHANNEL,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.PRODUCT_LIST,
            component: ProductListPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.BUNDLE_LIST,
            component: BundleListPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.BUNDLE_DETAIL,
            component: BundleDetailsPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.BUNDLE_NEW,
            component: AddBundle,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.PRODUCT_NEW,
            component: AddnewProduct,
            exact: true,
          },

          {
            path: "/" + PAGE_PATHS.PRODUCT_DETAIL,
            component: ProductDetailsPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.PRODUCT_LISTING,
            component: ProductDetailsPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.PRODUCT_STOCK_LEVEL,
            component: ProductDetailsPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.PRODUCT_INVENTORY,
            component: ProductDetailsPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.PURCHASE_PRICE,
            component: ProductDetailsPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.PURCHASE_RATE,
            component: AddPurchasePriceDetail,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.EDIT_PURCHASE_RATE,
            component: EditPurchasePrice,
            exact: true,
          },

          {
            path: "/" + PAGE_PATHS.STOCK_LIST,
            component: InventoryList,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.ADJUST_STOCK_LIST,
            component: AdjustStockDocuments,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.ADJUST_STOCK_IMPORT_NEW,
            component: InventoryImportForm,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.ADJUST_STOCK_IMPORT_EDIT,
            component: InventoryImportForm,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.ADJUST_STOCK_FORM_NEW,
            component: AdjustStockForm,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.ADJUST_STOCK_FORM_EDIT,
            component: AdjustStockForm,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.PRODUCT_STOCK_LOCATION,
            component: ProductStockLocation,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.BUNDLE_STOCK_LOCATION,
            component: BundleStockLocation,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.ORDER_LIST,
            component: OrdersList,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.ORDER_DETAIL,
            component: OrderDetails,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.STOCK_TRANSFER_LIST,
            component: StockTransferListPage,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.STOCK_TRANSFER_NEW,
            component: StockTransferForm,
            exact: true,
          },
          {
            path: "/" + PAGE_PATHS.STOCK_TRANSFER_EDIT,
            component: StockTransferForm,
            exact: true,
          },
          {
            path: "/" + "index/settings/",
            component: Settings,
            routes: [
              {
                path: "/" + "index/settings/billing/",
                component: Billing,
                routes: [
                  {
                    path: "/" + "index/settings/billing/plans/",
                    component: Plans,
                    exact: true,
                  },
                  {
                    path: "/" + "index/settings/billing/subscription/",
                    component: Subscription,
                    exact: true,
                  },
                  {
                    path: "/" + "index/settings/billing/upgrade/",
                    component: Plans,
                    exact: true,
                  },
                ],
              },
            ],
          },
          {
            path: "*",
            component: DefaultRoute,
          },
        ],
      },
      {
        path: "*",
        component: DefaultRoute,
      },
    ],
  },
  {
    path: "*",
    component: DefaultRoute,
  },
];

export { routes };
