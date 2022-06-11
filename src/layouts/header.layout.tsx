import { Col, Dropdown, Layout, Menu, notification, Row, Space, Tag, Typography } from "antd";
import { FC } from "react";
import { useSelector } from "react-redux";
import useSubscription from "../hooks/setting/use-subscription";
import APP_CONSTANTS from "../utils/constants/app.constants";
import "./header.layout.scss";
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import useLogout from "../hooks/auth/use-logout.hook";
import { useHistory } from "react-router-dom";
import PAGE_PATHS from "../utils/constants/page-paths.constants";


const { Header: AntdHeader, Content } = Layout;


const Header: FC = () => {
    const metaData = useSelector((state: any) => state.meta_data);
    const userData = useSelector((state: any) => state.user);
    const { getLeftFreeTrialDays } = useSubscription();
    const { logout } = useLogout();
    const history = useHistory();

    const menu = (
        <Menu
            items={[
                {
                    key: 'logout',
                    label: (
                        <span>
                            Logout
                        </span>
                    ),
                    icon: <LogoutOutlined />,
                    onClick: async () => {
                        try {
                            await logout()
                            history.push("/" + PAGE_PATHS.LOGIN);
                            notification.success({
                                message: "Logout",
                                description: "You are logout"
                            })
                        } catch (error) {
                            notification.error({
                                message: "Logout",
                                description: "You couldn't logout. Try again."
                            })
                        }

                    }
                }
            ]}
        />
    );

    return (

        <AntdHeader className="basic-layout-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* <Row> */}
                {/* <Col span={12} sm={{span:20}}> */}
                <div>
                    <Space align="start">
                        <div><Typography.Text>{metaData?.name}</Typography.Text></div>
                        <div>
                            <Tag color="#108ee9">
                                {metaData?.subscription?.status}{metaData?.subscription?.status === APP_CONSTANTS.SUBSCRIPTION_STATUS.FREE_TRIAL ? ": " + getLeftFreeTrialDays() + "days left" : ""}
                            </Tag >
                        </div>
                    </Space>
                </div>
                {/* </Col> */}
                {/* <Col span={12} sm={{span:4}}> */}
                <div>
                    <div style={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
                        <div>
                            <Dropdown overlay={menu} trigger={['click']} arrow>
                                <Typography.Text>
                                    <Space align="center">
                                        <span>{userData?.user?.first_name + " " + userData?.user?.last_name}</span>
                                        <DownOutlined />
                                    </Space>
                                </Typography.Text>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                {/* </Col> */}
                {/* </Row> */}
            </div>
        </AntdHeader>
    )
}

export default Header;