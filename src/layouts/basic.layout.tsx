import { useState } from "react";
import { renderRoutes } from "react-router-config";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  performFetchWarehouseList,
} from "../services/redux/slices/components.slice";
import { useEffect } from "react";
import config from "../config/config";
import "./basic.layout.css";
import { Layout, Space } from 'antd';
import Sidebar from "./siderbar.layout";
import Header from "./header.layout";
const { Content } = Layout;



const BasicLayout: any = ({ route }: any) => {

  const dispatcher = useDispatch();

  const initComponentWithData = () => {
    dispatcher(performFetchWarehouseList());
  };


  useEffect(() => {
    initComponentWithData();
  }, []);

  const handleRedirectToAngular = (path: string, e?: any) => {
    e?.preventDefault();
    let url = config.ANGULAR_APP_URL + path;
    window.open(url, "_self");
  }

  return (
    <>
      <Layout id="sumtracker-basic-layout">
        <Sidebar></Sidebar>
        <Layout style={{ backgroundColor: "#f6f7f9", height: "100vh", overflowY: "auto" }}>
          <Header></Header>
          <Content style={{ backgroundColor: "#f6f7f9" }}>
            {renderRoutes(route.routes)}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default BasicLayout;
