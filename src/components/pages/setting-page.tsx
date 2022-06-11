import React from "react";
import { Button } from "react-bootstrap";
import Page from "./basic.page";

const SettingPage = ({ children }: any) => {
  return <Page>{children}</Page>;
};

const Title = () => {
  return (
    // <div className="setting-page-title">Settings</div>
    // <Page.Header>
    <Page.Title>
      <img
        src="/images/back.svg"
        alt=""
        style={{ marginRight: ".9rem", cursor: "pointer" }}
      />
      Settings
    </Page.Title>
    // </Page.Header>
  );
};

const Sidebar = ({ sidebarList, setSelectedMenu, selectedMenu }: any) => {
  return (
    <div className="setting-page-siderbar">
      <div>
        <Title />
      </div>
      <div className="setting-page-sidebar-menu">
        <ul>
          {sidebarList.map((sidebar: any, key: number) => {
            return (
              <li
                key={key}
                className={`"align-middle" ${
                  sidebar.title === selectedMenu ? "selected-setting" : ""
                }`}
                onClick={() => setSelectedMenu(sidebar.title)}
              >
                <img
                  src={`/images/${sidebar.img}`}
                  alt=""
                  className="nav_icon icon-img md"
                  style={{ marginRight: ".4rem" }}
                />
                <span>{sidebar.title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const SidebarHeader = ({ sidebarList, setSelectedMenu, selectedMenu }: any) => {
  return (
    <div>
      {sidebarList
        .filter((page: any) => page.title === selectedMenu)
        .map((selected: any) => {
          return (
            <div className="setting-content-header">
              <div>
                <div className="setting-content-title mb-1">
                  {selected.title}
                </div>
                <div>{selected.desc}</div>
              </div>
              <div>
                <Button>Save</Button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

const Body = ({
  children,
  sidebarList,
  setSelectedMenu,
  selectedMenu,
}: any) => {
  return (
    <Page.Body className="setting-body">
      <Sidebar
        sidebarList={sidebarList}
        setSelectedMenu={setSelectedMenu}
        selectedMenu={selectedMenu}
      />
      <div className="setting-page-content">
        {/* <SidebarHeader
          sidebarList={sidebarList}
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        /> */}
        {children}
      </div>
    </Page.Body>
  );
};

SettingPage.Title = Title;
SettingPage.Body = Body;
SettingPage.Sidebar = Sidebar;
export default SettingPage;
