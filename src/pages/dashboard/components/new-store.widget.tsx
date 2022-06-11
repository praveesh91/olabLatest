import { Button, Col, Image, Row, Space, Typography } from "antd";
import { useHistory } from "react-router-dom";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";


const { Title, Text } = Typography;


const NewStore = () => {
    const history = useHistory();
    return (
        <Row style={{ marginBottom: "16px" }}>
            <Col span={24}>
                <Space style={{ display: "flex", justifyContent: "space-between", backgroundColor: "white", padding: "10px", borderRadius: "5px" }}>
                    <Space direction="vertical" style={{ display: "flex", justifyContent: "start" }}>
                        <Title level={3}>Add New Store from the plateforms supported by Sumtracker</Title>
                        <Space size="small" align="center" style={{ justifyContent: "start" }}>
                            <Image src="/images/shopify-shorthand.svg" />
                            <Image src="/images/woo-shorthand.svg" />
                            <Image src="/images/amazon-shorthand.svg" />
                            <Image src="/images/ebay-shorthand.svg" />
                            <Image src="/images/etsy-shorthand.svg" />
                        </Space>
                    </Space>
                    <div>
                        <Button size="large" type="primary" icon={<Image src="/images/store.svg" />} style={{ height: "60px", minWidth: "197px" }}
                            onClick={() => {
                                history.push("/" + PAGE_PATHS.CONNECT_STORE);
                            }}>
                            <Text style={{ color: "white" }}><span style={{ paddingLeft: "5px", minWidth: "197px" }}>Add New Store</span></Text>
                        </Button>
                    </div>
                </Space>
            </Col>
        </Row>
    )
}

export default NewStore;