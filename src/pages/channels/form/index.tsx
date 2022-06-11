import { Col, Layout, Row, Space, Tabs, Typography, Button } from "antd";
import { Content } from "antd/lib/layout/layout";
import { createContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import GoBackNavigation from "../../../components/navigation/go-back.navigation";
import useEcom from "../../../hooks/ecom/use-ecom.hook";
import getChannel from "../../../services/apis/ecom/channels/get-channel.service";
import { ECOM_CONSTANTS } from "../../../utils/constants/ecom.constants";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import Details from "./details";
import "./index.scss";
import LinkedWarehouses from "./linked-warehouses";
const { Title } = Typography;
const { TabPane } = Tabs;

interface ChannelPageContextInterface {
    channel: any;
    setChannel: any
}

export const ChannelPageContext = createContext<ChannelPageContextInterface>({ channel: null, setChannel: null });

const Channel = () => {

    const [activatedTabKey, setActivatedTabKey] = useState<string>("details");
    const { id, tabKey } = useParams<any>();
    const history = useHistory();
    const [channel, setChannel] = useState<any>(null);
    const { getChannelName } = useEcom();

    let tabMappings: any[] = [
        {
            key: PAGE_PATHS.CHANNEL_TAB_KEYS.DETAILS,
            index: 0,
            title: "Details",
            pathTail: PAGE_PATHS.CHANNEL_TAB_KEYS.DETAILS,
            component: <Details id={id}></Details>
        },
        {
            key: PAGE_PATHS.CHANNEL_TAB_KEYS.WAREHOUSE_LINKED,
            index: 1,
            title: "Warehouse Linked",
            pathTail: PAGE_PATHS.CHANNEL_TAB_KEYS.WAREHOUSE_LINKED,
            component: <LinkedWarehouses channel={{
                id: id
            }}></LinkedWarehouses>
        },
        {
            key: PAGE_PATHS.CHANNEL_TAB_KEYS.ONLINE_LISTING,
            index: 2,
            title: "Online Listings",
            pathTail: PAGE_PATHS.CHANNEL_TAB_KEYS.ONLINE_LISTING,
            component: <div>Details</div>
        },
        {
            key: PAGE_PATHS.CHANNEL_TAB_KEYS.ERRORS,
            index: 3,
            title: "Errors",
            pathTail: PAGE_PATHS.CHANNEL_TAB_KEYS.ERRORS,
            component: <div>Details</div>
        },
    ];

    const handleTabChange = (key: string) => {
        setActivatedTabKey(key);
        history.push("/" + PAGE_PATHS.CHANNEL.replace(":id", id).replace(":tabKey", key));
    }

    useEffect(() => {
        setActivatedTabKey(tabKey);
    }, []);

    useEffect(() => {
        fetchChannelDetails().then((channelRes) => {
            setChannel(channelRes);
        });
    }, []);


    const fetchChannelDetails = async () => {
        try {
            let res: any = await getChannel({ id: id });
            setChannel(res.data);
            return res.data
        } catch (error) {
            console.log(error);
        }
    }

    return (<Layout id="channel-page">
        <Content className="content">
            <Row className="top-line">
                <Col span={24}>
                    <Space align="center" style={{ display: "flex", justifyContent: "space-between" }}>
                        <Space>
                            <div><GoBackNavigation goto={PAGE_PATHS.DASHBOARD}></GoBackNavigation></div>
                            <div>
                                <Title type="secondary" className="title" level={3} style={{ marginBottom: "0" }}>{getChannelName(channel?.channel_type || -1)}</Title>
                            </div>
                        </Space>
                    </Space>
                </Col>
            </Row>
            <div className="tab-container">
                <ChannelPageContext.Provider value={{ channel, setChannel }}>
                    <Tabs
                        activeKey={activatedTabKey}
                        onChange={handleTabChange}
                    >
                        {
                            tabMappings.map((mapping) => (
                                <TabPane tab={mapping.title} key={mapping.key}>
                                    {mapping.component}
                                </TabPane>
                            ))
                        }
                    </Tabs>
                </ChannelPageContext.Provider>
            </div>
        </Content>
    </Layout >)
}

export default Channel;