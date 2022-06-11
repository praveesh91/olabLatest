import { Col, Image, Layout, Row, Space } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Typography } from 'antd';
import "./index.scss";
import { Button } from "antd";
import NewStore from "./components/new-store.widget";
import Messages from "./components/messages.widget";
import StoreList from "./components/store-list.widget";
const { Title, Text } = Typography;

const Dashboard = () => {
    return (<Layout id="dashboard">
        <Content className="dashboard-content">
            <Row>
                <Col>
                    <Title type="secondary" className="title" level={3}>Dashboard</Title>
                </Col>
            </Row>

            <NewStore></NewStore>

            <Row gutter={[16, 16]}>
                <Col span={24} >
                    <div style={{ backgroundColor: "white" }}>
                        <StoreList></StoreList>
                    </div>
                </Col>
                <Col span={24} >
                    <div style={{ backgroundColor: "white" }}>
                        <Messages></Messages>
                    </div>
                </Col>
            </Row>
        </Content>
    </Layout >)
}

export default Dashboard;