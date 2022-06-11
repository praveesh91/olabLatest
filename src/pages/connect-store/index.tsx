import { Col, Image, Layout, notification, Row, Space, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import { ReactNode, useState } from "react";
import { AmazonShortHandIcon, BigCommerceShortHandIcon, EbayShortHandIcon, EtsyShortHandIcon, ShopifyShortHandIcon, WooCommerceShortHandIcon } from "../../components/icons/basic.icons";
import getChannelAuthURL from "../../services/apis/ecom/channels/get-channel-auth-url.service";
import { BACKEND_API_PATHS } from "../../utils/constants/backend-api-path.constants";
import { ECOM_CONSTANTS } from "../../utils/constants/ecom.constants";
import AmazonChannel from "../../components/ecom/amazon-channel.modal"
import WooCommerceChannel from "../../components/ecom/woo-commerce-channel.modal";
import "./index.scss";

const { Title, Text } = Typography;
interface channelElementProps {
    index: number;
    text: string;
    icon: ReactNode;
    onClick?: () => void;
}
const ConnectStore = () => {
    const [amazonPopup, setAmazonPopup] = useState({
        visible: false
    });

    const [wooCommercePopup, setWooCommercePopup] = useState({
        visible: false
    });

    const connectChannel = async (args: { authURL: string, storeURL?: string }) => {
        try {
            let queryParams: Record<string, any> = {};
            if (args.storeURL) {
                queryParams['store_url'] = args.storeURL
            }
            let res: any = await getChannelAuthURL({
                authUrl: args.authURL,
                queryParams: queryParams
            });

            if (res.data.auth_url) {
                window.open(res.data.auth_url, "_self");
            }
        } catch (error: any) {
            notification.error({
                message: "Channel",
                description: "Couldn't connect channel. Please try again"
            });
            return Promise.reject(error);
        }
    }

    const connectShopify = () => {
        window.open(ECOM_CONSTANTS.SHOPIFY_APP_STORE_URL);
    }

    const connectEtsy = () => {
        let authURL: string = BACKEND_API_PATHS.ETSY_AUTH_URL;
        connectChannel({ authURL: authURL });
    }

    const connectEbay = () => {
        let authURL: string = BACKEND_API_PATHS.EBAY_AUTH_URL;
        connectChannel({ authURL: authURL });
    }

    const connectAmazon = (id: string) => {
        let authURL: string = BACKEND_API_PATHS.AMAZON_AUTH_URL + id;
        connectChannel({ authURL: authURL });
    }

    const connectWooCommerce = (url: string) => {
        let authURL: string = BACKEND_API_PATHS.WOOCOMMERCE_AUTH_URL;
        connectChannel({ authURL: authURL, storeURL: url })
    }

    const openAmazonModal = () => {
        setAmazonPopup((prev: any) => {
            return {
                ...prev,
                visible: true
            }
        });
    }

    const openWooCommerceModal = () => {
        setWooCommercePopup((prev: any) => {
            return {
                ...prev,
                visible: true
            }
        });
    }

    const channelElements: channelElementProps[] = [
        {
            index: 0,
            text: "Shopify",
            icon: <ShopifyShortHandIcon></ShopifyShortHandIcon>,
            onClick: connectShopify
        },
        {
            index: 1,
            text: "WooCommerce",
            icon: <WooCommerceShortHandIcon></WooCommerceShortHandIcon>,
            onClick: openWooCommerceModal
        },
        {
            index: 2,
            text: "Amazon",
            icon: <AmazonShortHandIcon></AmazonShortHandIcon>,
            onClick: openAmazonModal
        },
        {
            index: 3,
            text: "Ebay",
            icon: <EbayShortHandIcon></EbayShortHandIcon>,
            onClick: connectEbay
        },
        {
            index: 4,
            text: "Etsy",
            icon: <EtsyShortHandIcon></EtsyShortHandIcon>,
            onClick: connectEtsy
        }
    ]

    const handleAmazonCancel = () => {
        setAmazonPopup((prev: any) => {
            return {
                ...prev,
                visible: false
            }
        });

    }

    const handleWooCommerceCancel = () => {
        setWooCommercePopup((prev: any) => {
            return {
                ...prev,
                visible: false
            }
        });

    }

    const handleAmazonConnect = (values: any) => {
        setAmazonPopup((prev: any) => {
            return {
                ...prev,
                visible: false
            }
        });
        connectAmazon(values.market_place);
    }

    const handleWooCommerceConnect = (values: any) => {
        setWooCommercePopup((prev: any) => {
            return {
                ...prev,
                visible: false
            }
        });
        connectWooCommerce(values.url);
    }


    return (
        <>
            <Layout id="add-channel">
                <Content className="add-channel-content">
                    <Row>
                        <Col>
                            <Title type="secondary" className="title" level={3}>New Store</Title>
                        </Col>
                    </Row>
                    <div style={{ backgroundColor: "white", padding: "5px 10px", borderRadius: "5px" }}>
                        <Row>
                            <Col>
                                <Typography.Title level={4} style={{ marginBottom: "2px" }}>Store List</Typography.Title>
                                <Typography.Paragraph>
                                    Different stores list with inventory details
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <div>
                                    <div>
                                        <div style={{ width: "400px", borderRadius: "0.5rem", padding: "1rem", marginBottom: "20px" }}>
                                            <div style={{ marginBottom: "20px" }}>
                                                <Typography.Title level={4} style={{ marginBottom: "2px" }} >Inventory Sync</Typography.Title>
                                                <Typography.Text className="des">Inventory Synced from Sumtracker to Store</Typography.Text>
                                            </div>
                                            <div className="mb-4">
                                                <div className="d-inline-flex align-items-center" style={{ columnGap: "10px" }}>
                                                    <div className="text-center">
                                                        <Image src="/images/logo-icon.svg" preview={false} style={{ width: "50px" }}></Image>
                                                        <div className="head head-lg">
                                                            <div className="title fw-" style={{ fontWeight: "300" }}>Store</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Image preview={false} src="/images/lr-transition-arrow.svg"></Image>
                                                    </div>
                                                    <div className="text-center">
                                                        <Image src="/images/house.svg" preview={false} style={{ height: "50px" }}></Image>
                                                        <div className="head head-lg">
                                                            <div className="title" style={{ fontWeight: "300" }}>Sumtracker</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="lines line-space-md">
                                                <li className="line">
                                                    <span>
                                                        <img className="icon-img" src="/images/success-v2.svg" />
                                                    </span>
                                                    <Typography.Text>Bundles & Kits</Typography.Text>
                                                </li>
                                                <li className="line">
                                                    <span>
                                                        <img className="icon-img" src="/images/success-v2.svg" />
                                                    </span>
                                                    <Typography.Text>Purchase Orders</Typography.Text>
                                                </li>
                                                <li className="line">
                                                    <span>
                                                        <img className="icon-img" src="/images/success-v2.svg" />
                                                    </span>
                                                    <Typography.Text>Duplicate SKU syncing</Typography.Text>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div style={{ width: "400px", borderRadius: "0.5rem", padding: "1rem" }}>
                                        <div style={{ marginBottom: "20px" }}>
                                            <Typography.Title level={4} style={{ marginBottom: "2px" }} >Product Sync</Typography.Title>
                                            <Typography.Text className="des">Product Synced from Store to Sumtracker</Typography.Text>
                                        </div>
                                        <div className="mb-4">
                                            <div className="d-inline-flex align-items-center" style={{ columnGap: "10px" }}>
                                                <div className="text-center">
                                                    <Image preview={false} src="/images/house.svg" style={{ width: "50px" }}></Image>
                                                    <div className="head head-lg">
                                                        <div className="title fw-" style={{ fontWeight: "300" }}>Store</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Image preview={false} src="/images/lr-transition-arrow.svg"></Image>
                                                </div>
                                                <div className="text-center">
                                                    <Image preview={false} src="/images/logo-icon.svg" style={{ height: "50px" }}></Image>
                                                    <div className="head head-lg">
                                                        <div className="title" style={{ fontWeight: "300" }}>Sumtracker</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="lines line-space-md">
                                            <li className="line">
                                                <span>
                                                    <img className="icon-img" src="/images/success-v2.svg" />
                                                </span>
                                                <Typography.Text>Bundles & Kits</Typography.Text>
                                            </li>
                                            <li className="line">
                                                <span>
                                                    <img className="icon-img" src="/images/success-v2.svg" />
                                                </span>
                                                <Typography.Text>Purchase Orders</Typography.Text>
                                            </li>
                                            <li className="line">
                                                <span>
                                                    <img className="icon-img" src="/images/success-v2.svg" />
                                                </span>
                                                <Typography.Text>Duplicate SKU syncing</Typography.Text>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <Space direction="vertical" size={20}>
                                    {
                                        channelElements.map((ele: channelElementProps, index: number) => (
                                            <Space align="center"
                                                key={index}
                                                style={{ padding: "10px", backgroundColor: "#F6F7F9", width: "300px", border: "1px solid #EEEEEE", justifyContent: "center", borderRadius: "5px" }}
                                                size={20} onClick={ele.onClick}>
                                                <div>
                                                    {ele.icon}
                                                </div>
                                                <div>
                                                    <Typography.Title level={4} style={{ marginBottom: "2px", color: "#4E4E4E" }}>{ele.text}</Typography.Title>
                                                </div>
                                            </Space>
                                        ))
                                    }
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Content>
            </Layout>
            <AmazonChannel visible={amazonPopup.visible}
                handleOk={handleAmazonConnect}
                handleCancel={handleAmazonCancel}>
            </AmazonChannel>
            <WooCommerceChannel visible={wooCommercePopup.visible}
                handleOk={handleWooCommerceConnect}
                handleCancel={handleWooCommerceCancel}>
            </WooCommerceChannel>
        </>
    )
}

export default ConnectStore;