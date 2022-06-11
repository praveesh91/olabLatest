import { Button, notification } from "antd";
import { FC, ReactNode, useState } from "react";
import getChannelAuthURL from "../../services/apis/ecom/channels/get-channel-auth-url.service";
import { BACKEND_API_PATHS } from "../../utils/constants/backend-api-path.constants";
import { ECOM_CONSTANTS } from "../../utils/constants/ecom.constants";
import AmazonChannel from "./amazon-channel.modal";
import WooCommerceChannel from "./woo-commerce-channel.modal";
import { DisconnectOutlined } from '@ant-design/icons';

interface ConnectChannelProps {
    title?: ReactNode
    channel: {
        channelType: any;
    }
}

const ConnectChannel: FC<ConnectChannelProps> = ({ channel, title = "Connect" }) => {
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

    const handleConnect = () => {
        if (channel.channelType === ECOM_CONSTANTS.CHANNEL_TYPE.SHOPIFY) {
            connectShopify();
        }

        if (channel.channelType === ECOM_CONSTANTS.CHANNEL_TYPE.AMAZON) {
            openAmazonModal();
        }

        if (channel.channelType === ECOM_CONSTANTS.CHANNEL_TYPE.EBAY) {
            connectEbay();
        }

        if (channel.channelType === ECOM_CONSTANTS.CHANNEL_TYPE.ETSY) {
            connectEtsy();
        }

        if (channel.channelType === ECOM_CONSTANTS.CHANNEL_TYPE.WOOCOMMERCE) {
            openWooCommerceModal();
        }
    }
    return (
        <>
            <Button type="primary" icon={<DisconnectOutlined />} onClick={handleConnect}>{title}</Button>
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

export default ConnectChannel;