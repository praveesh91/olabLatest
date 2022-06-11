import { useHistory } from "react-router-dom";
import GoBackNavigation from "../../../components/navigation/go-back.navigation";
import Page from "../../../components/pages/basic.page";

const SettingsNav = ({ sidebarList, setSelectedMenu, selectedMenu }: any) => {
  const history = useHistory();
  return (
    <div className="setting-page-siderbar">
      <div style={{display:"flex", alignItems:"center", columnGap:"5px"}}>
      <GoBackNavigation></GoBackNavigation>
        <Page.Title>
         <span> Settings</span>
        </Page.Title>
      </div>
      <div className="setting-page-sidebar-menu">
        <ul>
          {sidebarList.map((sidebar: any, key: number) => {
            return (
              <li
                key={key}
                className={`"align-middle" ${
                  sidebar.id === selectedMenu.id ? "selected-setting" : ""
                }`}
                onClick={() => history.push("/" + sidebar.redirectPath)}
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

export default SettingsNav;
