import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { renderRoutes } from "react-router-config";
import Page from "../../components/pages/basic.page";
import { getActiveMenu } from "../../services/get-values.service";
import { reset } from "../../services/redux/slices/alert.slice";
import SettingsNav from "./components/settings-nav";

const Settings = ({ route }: any) => {
  const alert = useSelector((state: any) => state.alert.settings);
  const dispatcher = useDispatch();

  const menuList = [
    {
      id: 1,
      title: "Billing",
      img: "billing.svg",
      path: "index/settings/billing/",
      redirectPath: "index/settings/billing/subscription",
    },
    // {
    //   title: "General Settings",
    //   img: "general.svg",
    //   desc: "Manage the Timezone ccountry and other general settings. lern more about",
    //   link: "general setting link",
    // },
    // {
    //   title: "Warehouses",
    //   img: "warehouse.svg",
    //   desc: "Manage the Timezone ccountry and other general settings. lern more about",
    //   link: "general setting link",
    // },
    // {
    //   title: "Taxes",
    //   img: "taxes.svg",
    //   desc: "Manage the Timezone ccountry and other general settings. lern more about",
    //   link: "general setting link",
    // },
    // {
    //   title: "Print Settings",
    //   img: "print.svg",
    //   desc: "Manage the Timezone ccountry and other general settings. lern more about",
    //   link: "general setting link",
    // },
    // {
    //   title: "User Settings",
    //   img: "user-setting.svg",
    //   desc: "Manage the Timezone ccountry and other general settings. lern more about",
    //   link: "general setting link",
    // }
  ];

  return (
    <Page style={{ background: "#f6f7f9" }}>
      <Row>
        <Col xs={12} sm={12} md={3} lg={2} xl={2} xxl={3} className="px-0">
          <SettingsNav
            sidebarList={menuList}
            selectedMenu={getActiveMenu(menuList, route)}
          ></SettingsNav>
        </Col>
        <Col xs={12} sm={12} md={9} lg={10} xl={10} xxl={9} className="px-0">
          {renderRoutes(route.routes)}
          <Page.AlertBox
            isShow={alert.isShow}
            type={alert.type}
            msg={alert.msg}
            autoHide={true}
            onHide={() => {
              dispatcher(reset({ context: "settings" }));
            }}
          ></Page.AlertBox>
        </Col>
      </Row>
    </Page>
  );
};

export default Settings;
