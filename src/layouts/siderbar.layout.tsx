import AppLogo from "../components/images/app-logo.image";
import { Badge, Button, Layout, Menu, notification, Space, Tag } from "antd";
import PAGE_PATHS from "../utils/constants/page-paths.constants";
import type { MenuProps } from "antd";
import {
  BundlesIcon,
  DashboardIcon,
  InventoryIcon,
  OrdersIcon,
  ProductsIcon,
  ReportsIcon,
  SettingIcon,
  StockLevelsIcon,
} from "../components/icons/basic.icons";
import config from "../config/config";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory, matchPath } from "react-router-dom";
import "./sidebar.layout.scss";
import { UnorderedListOutlined, LogoutOutlined, ReadOutlined, QuestionOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Content } from "antd/lib/layout/layout";
import useLogout from "../hooks/auth/use-logout.hook";
import { removeSlashFromEnds } from "../services/common.services";
import { PopupModal } from "react-calendly";
import CallSchedule from "../components/modals/call-schedule.modal";
import useSubscription from "../hooks/setting/use-subscription";
import APP_CONSTANTS from "../utils/constants/app.constants";

const { Sider } = Layout;
interface MenuItemInterface extends MenuProps {
  nav?: {
    url?: string;
    redirectType?: "external" | "internal";
    target: "_self" | "_blank";
  };
}

type MenuItem = Required<MenuItemInterface | MenuProps>["items"][number];

const Sidebar = () => {
  const metaData = useSelector((state: any) => state.meta_data);
  const userData = useSelector((state: any) => state.user);
  const history = useHistory();
  const [isSmaller, setIsSmaller] = useState<boolean>(false);
  const { logout } = useLogout();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [scheduleOpen, setScheduleOpen] = useState<boolean>(false)
  const { getLeftFreeTrialDays } = useSubscription();

  function getItem({
    label,
    key,
    nav,
    icon,
    children,
    type,
  }: {
    label: React.ReactNode;
    key: React.Key;
    nav?: {
      url?: string;
      redirectType?: "external" | "internal";
      target: "_self" | "_blank";
    };
    icon?: React.ReactNode;
    children?: MenuItem[];
    type?: "group";
  }): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
      nav,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem({
      label: 'Dashboard',
      key: 'dashboard',
      icon: <DashboardIcon iconstyle={{ width: "20px" }} />
    }),
    getItem({
      label: 'Orders',
      key: 'orders',
      icon: <OrdersIcon iconstyle={{ width: "20px" }} />
    }),
    getItem(
      {
        label: 'Purchase', key: 'purchase',
        icon: <OrdersIcon iconstyle={{ width: "20px" }} />,
        children: [
          getItem({
            label: 'Purchase Orders', key: 'purchase_purchaseOrders'
          }),
          getItem({
            label: 'Receive Notes', key: 'purchase_recieveNotes'
          }),
          getItem({
            label: 'Suppliers List', key: 'purchase_supplierList'
          }),
          getItem({
            label: 'Purchase Price List', key: 'purchase_purchasePriceList'
          }),
        ]
      }
    ),
    getItem({
      label: 'Products',
      key: 'products',
      icon: < ProductsIcon iconstyle={{ width: "20px" }} />
    }),
    getItem({
      label: 'Bundles',
      key: 'bundles',
      icon: < BundlesIcon iconstyle={{ width: "20px" }} />
    }),
    getItem({
      label: 'Stock by Location',
      key: 'stockByLocation',
      icon: <StockLevelsIcon iconstyle={{ width: "20px" }} />,
      children: [
        getItem({
          label: 'All Products',
          key: 'stockByLocation_allProducts',
        }),
        getItem({
          label: 'Bundles',
          key: 'stockByLocation_bundles',
        })
      ]
    }),
    getItem({
      label: 'Adjust Stock',
      key: 'adjustStock',
      icon: <InventoryIcon iconstyle={{ width: "20px" }} />,
      children: [
        getItem({
          label: 'Adjust Stock Table',
          key: 'adjustStock_adjustStockTable'
        }),
        getItem({
          label: 'Adjust Stock Forms',
          key: 'adjustStock_adjustStockForms',
        }),
        getItem({
          label: 'Stock Transfer',
          key: 'adjustStock_adjustStockTransfer',
        })
      ]
    }),
    getItem({
      label: 'Reports',
      key: 'reports',
      icon: < ReportsIcon iconstyle={{ width: "20px" }} />
    }),
    getItem({
      label: 'Settings',
      key: 'settings',
      icon: <SettingIcon iconstyle={{ width: "20px" }} />,
      children: [
        getItem({
          label: 'App Settings',
          key: 'settings_appSettings',
        }),
        getItem({
          label: 'Users',
          key: 'settings_users',
        }),
        getItem({
          label: 'Shopify Billing',
          key: 'settings_shopifyBilling',
        })
      ]

    }),
    {
      label: 'Support',
      key: 'support',
      icon: <QuestionCircleOutlined style={{ fontSize: "20px" }} />,
      children: [
        getItem({
          label: 'Help Documentation',
          key: 'support_helpDoc',
        }),
        getItem({
          label: 'Schedule Call',
          key: 'support_scheduleCall',
        }),
        // getItem({
        //   label: 'Onboarding Tutorial',
        //   key: 'support_onboardingTutorial',
        // }),
      ]
    }
  ];

  let menuRedirectData: {
    [key: string]: {
      url: string;
      external: boolean;
      target: "_self" | "_blank";
    };
  } = {
    dashboard: {
      url: config.ANGULAR_APP_URL + PAGE_PATHS.ANGULAR_APP_PATHS.DASHBOARD,
      external: true,
      target: "_self",
    },
    orders: {
      url: PAGE_PATHS.ORDER_LIST,
      external: false,
      target: "_self",
    },
    purchase_purchaseOrders: {
      url:
        config.ANGULAR_APP_URL +
        PAGE_PATHS.ANGULAR_APP_PATHS.PURCHASE.PURCHASE_ORDERS,
      external: true,
      target: "_self",
    },
    purchase_recieveNotes: {
      url:
        config.ANGULAR_APP_URL +
        PAGE_PATHS.ANGULAR_APP_PATHS.PURCHASE.RECEIVE_NOTES,
      external: true,
      target: "_self",
    },
    purchase_supplierList: {
      url:
        config.ANGULAR_APP_URL +
        PAGE_PATHS.ANGULAR_APP_PATHS.PURCHASE.SUPPLIERS_LIST,
      external: true,
      target: "_self",
    },
    purchase_purchasePriceList: {
      url: config.ANGULAR_APP_URL + PAGE_PATHS.ANGULAR_APP_PATHS.PURCHASE.PARCHASE_PRICE_LIST,
      external: true,
      target: "_self",
    },
    products: {
      url: PAGE_PATHS.PRODUCT_LIST + "?" + PAGE_PATHS.PRODUCT_LIST_DEFAULT_QUERY_PARAMS,
      external: false,
      target: "_self",
    },
    bundles: {
      url: PAGE_PATHS.BUNDLE_LIST,
      external: false,
      target: "_self",
    },
    stockByLocation_allProducts: {
      url: PAGE_PATHS.PRODUCT_STOCK_LOCATION,
      external: false,
      target: "_self",
    },
    stockByLocation_bundles: {
      url: PAGE_PATHS.BUNDLE_STOCK_LOCATION,
      external: false,
      target: "_self",
    },
    adjustStock_adjustStockTable: {
      url: PAGE_PATHS.STOCK_LIST,
      external: false,
      target: "_self",
    },
    adjustStock_adjustStockForms: {
      url: PAGE_PATHS.ADJUST_STOCK_LIST,
      external: false,
      target: "_self",
    },
    adjustStock_adjustStockTransfer: {
      url:
        config.ANGULAR_APP_URL +
        PAGE_PATHS.ANGULAR_APP_PATHS.ADJUST_STOCK.STOCK_TRANSFERS,
      external: true,
      target: "_self",
    },
    reports: {
      url: config.ANGULAR_APP_URL + PAGE_PATHS.ANGULAR_APP_PATHS.REPORTS,
      external: true,
      target: "_self",
    },
    settings_appSettings: {
      url:
        config.ANGULAR_APP_URL +
        PAGE_PATHS.ANGULAR_APP_PATHS.SETTINGS.APP_SETTINGS,
      external: true,
      target: "_self",
    },
    settings_users: {
      url: config.ANGULAR_APP_URL + PAGE_PATHS.ANGULAR_APP_PATHS.SETTINGS.USERS,
      external: true,
      target: "_self",
    },
    support_helpDoc: {
      url: "https://help.sumtracker.com/",
      external: true,
      target: "_blank"
    },
    support_onboardingTutorial: {
      url: PAGE_PATHS.ON_BOARDING,
      external: false,
      target: "_self"
    }
  };

  useEffect(() => {
    const obj: {
      url: string;
      external: boolean;
      target: "_self" | "_blank";
    } = {
      url:
        metaData?.source === "WEBSITE"
          ? "/index/settings/billing/subscription"
          : config.ANGULAR_APP_URL + PAGE_PATHS.ANGULAR_APP_PATHS.SETTINGS,
      external: !(metaData?.source === "WEBSITE"),
      target: "_self",
    };

    menuRedirectData["settings_shopifyBilling"] = obj;
  }, [metaData]);

  const handleMenuItemClick = ({ key }: { key: string }) => {
    if (key === "support_scheduleCall") {
      setScheduleOpen(true);
      return;
    }
    if (menuRedirectData[key]) {
      if (menuRedirectData[key].external) {
        window.open(menuRedirectData[key].url, menuRedirectData[key].target);
      } else {
        history.push("/" + menuRedirectData[key].url);
      }
    }
  };

  const renderTrigger = () => {
    if (isSmaller) {
      return <UnorderedListOutlined />
    }
    return null;
  }

  const findKeyForActiveRoute = () => {
    let selected: string[] = [];
    for (const key in menuRedirectData) {
      if (removeSlashFromEnds(window.location.pathname) === removeSlashFromEnds(menuRedirectData[key]["url"])) {
        selected.push(key);
      }
    }
    return selected;
  }

  useEffect(() => {
    let keys = findKeyForActiveRoute();
    setSelectedKeys(keys);
  }, []);

  return (
    <>
      <Sider
        onBreakpoint={(broken) => {
          setIsSmaller(broken)
        }}
        trigger={renderTrigger()}
        className="sumtracker-sider"
        theme="light"
        breakpoint="sm"
        collapsedWidth="0"
        collapsible
        width="215px"
        style={{
          overflowX: "visible",
          height: "100vh",
          paddingTop: "0",
          borderRight: "1px solid #ddd"
        }}>
        <Layout style={{ height: "100%", backgroundColor: "white" }}>
          <div
            style={{
              padding: "0px 0px 0px 24px",
            }}
          >
            <Space
              align="center"
              style={{
                // display: "flex",
                // columnGap: "5px",
                height: "64px"
              }}>
              <img className="icon-img lg" src="/images/logo-icon.svg" />
              <img className="nav_logo_text" src="/images/logo-text.svg" />
            </Space>
          </div>
          <Content style={{ overflowY: "auto" }}>
            <Menu
              className="sidebar-nav-menu"
              selectedKeys={selectedKeys}
              mode="inline"
              items={items}
              onSelect={({ key, keyPath, domEvent }) => {
                setSelectedKeys([key]);
                handleMenuItemClick({ key: key });
              }}
            />
          </Content>
        </Layout>
      </Sider>
      <CallSchedule open={scheduleOpen} onModalClose={() => {
        setScheduleOpen(false);
        setSelectedKeys([])
      }}></CallSchedule>
    </>
  );
};

export default Sidebar;
