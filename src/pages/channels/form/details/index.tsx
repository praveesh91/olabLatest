import { Button, Col, Divider, Form, Input, notification, Row, Space, Tag, Typography } from "antd";
import { FC, ReactNode, useContext, useEffect, useState } from "react";
import "./index.scss";
import { CheckCircleTwoTone, CloseCircleTwoTone, SyncOutlined, UndoOutlined, DisconnectOutlined } from '@ant-design/icons';
import SyncIntstruction from "../../../../components/modals/sync-instruction.modal";
import { displayLocaleDateTime } from "../../../../services/conversion.service";
import APP_CONSTANTS from "../../../../utils/constants/app.constants";
import performChannelAction from "../../../../services/apis/ecom/channels/perform-channel-action.service";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";
import useEcom from "../../../../hooks/ecom/use-ecom.hook";
import { ECOM_CONSTANTS } from "../../../../utils/constants/ecom.constants";
import { AmazonShortHandIcon, EbayShortHandIcon, EtsyShortHandIcon, ShopifyShortHandIcon, WooCommerceShortHandIcon } from "../../../../components/icons/basic.icons";
import { ChannelPageContext } from "..";
import updateChannel from "../../../../services/apis/ecom/channels/update-channel.service";
import ConnectChannel from "../../../../components/ecom/connect-channel";

const { Title, Text } = Typography;

interface ExtraProps { description: string };

const Extra: FC<ExtraProps> = ({ description }) => {
    return (
        <Text type="secondary" style={{ fontSize: "12px" }}>
            {description}
        </Text>
    )
}

interface ChannelProps {
    id: number
}

const Details: FC<ChannelProps> = ({ id }) => {
    const [form] = Form.useForm();
    // const [channel, setChannel] = useState<any>(null);
    const [syncingInventory, setSyncingInventory] = useState(false);
    const [syncingListing, setSyncingListing] = useState(false);
    const [invHardRefreshing, setInvHardRefreshing] = useState(false);
    const [listingHardRefreshing, setListingHardRefreshing] = useState(false);
    const [turningOffInvSync, setTurningOffInvSync] = useState(false);
    const { getMarketPlaceRegionName } = useEcom();
    const { channel, setChannel } = useContext(ChannelPageContext);
    const [saving, setSaving] = useState<boolean>(false);

    const renderChannelConnection = ({ channel, afterRefresh }: { channel: any, afterRefresh?: (channel: any) => void }) => {
        if (channel.is_connected) {
            if (channel.has_inventory_sync) {
                return (
                    <Space>
                        <div>
                            <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="green" style={{ height: "32px", borderRadius: "5px", display: "flex", alignItems: "center" }}>Connected</Tag>
                        </div>
                        <div>
                            <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="green" style={{ height: "32px", borderRadius: "5px", display: "flex", alignItems: "center" }}>Inv Sync On</Tag>
                        </div>
                    </Space>
                )
            }

            if (!channel.has_inventory_sync) {
                return (
                    <Space>
                        <div>
                            <Tag icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} color="green" style={{ height: "32px", borderRadius: "5px", display: "flex", alignItems: "center" }}>Connected </Tag>
                        </div>
                        <div>
                            <SyncIntstruction channel={{
                                id: channel?.id || -1,
                                channelType: channel?.channel_type || -1
                            }} afterSync={(channel: any) => {
                                console.log(channel);
                                setChannel({ ...channel });
                            }}></SyncIntstruction>
                        </div>
                    </Space>
                )
            }
        }

        if (!channel.is_connected) {
            return (
                <ConnectChannel channel={{
                    channelType: channel?.channel_type || -1
                }} />
            )
        }
    }

    const handleTurnOffInvSync = async () => {
        setTurningOffInvSync(true);
        try {
            let res: any = await performChannelAction({
                id: id,
                action: BACKEND_API_PATHS.CHANNEL_ACTIONS.TOGGLE_INVENTORY_SYNC
            });
            setTurningOffInvSync(false);
            setChannel(res.data);
        } catch (error) {
            setTurningOffInvSync(false);
            console.log(error);
        }
    }

    const handleInventorySync = async () => {
        setSyncingInventory(true);
        try {
            let res: any = await performChannelAction({
                id: id,
                action: BACKEND_API_PATHS.CHANNEL_ACTIONS.SYNC_INVENTORY
            })
            setChannel(res.data);
            setSyncingInventory(false);
        } catch (error: any) {
            setSyncingInventory(false);
            console.log(error);
            notification.error({
                message: "Inventory Sync",
                description: error?.response?.data.errors?.[0] || "Something went wrong"
            })
        }
    }

    const handleInvHardRefresh = async () => {
        setInvHardRefreshing(true);
        try {
            let res: any = await performChannelAction({
                id: id,
                action: BACKEND_API_PATHS.CHANNEL_ACTIONS.HARD_REFRESH_INVENTORY
            })
            setChannel(res.data);
            setInvHardRefreshing(false);
        } catch (error: any) {
            setInvHardRefreshing(false);
            notification.error({
                message: "Inventory Hard Refresh",
                description: error?.response?.data.errors?.[0] || "Something went wrong"
            })
            console.log(error);
        }
    }

    const handleSyncListing = async () => {
        setSyncingListing(true);
        try {
            let res: any = await performChannelAction({
                id: id,
                action: BACKEND_API_PATHS.CHANNEL_ACTIONS.SYNC_PRODUCTS
            })
            setChannel(res.data);
            setSyncingListing(false);
        } catch (error) {
            setSyncingListing(false);
            console.log(error);
        }
    }

    const handleHardRefreshListings = async () => {
        setListingHardRefreshing(true);
        try {
            let res: any = await performChannelAction({
                id: id,
                action: BACKEND_API_PATHS.CHANNEL_ACTIONS.HARD_REFRESH_PRODUCTS
            })
            setListingHardRefreshing(false);
            setChannel(res.data);
        } catch (error) {
            setListingHardRefreshing(false);
            console.log(error);
        }
    }

    const getChannelImage = (channelType: number): ReactNode => {
        if (channelType === ECOM_CONSTANTS.CHANNEL_TYPE.AMAZON) {
            return (
                <AmazonShortHandIcon iconstyle={{ width: "100px" }}></AmazonShortHandIcon>
            )
        }
        if (channelType === ECOM_CONSTANTS.CHANNEL_TYPE.EBAY) {
            return (
                <EbayShortHandIcon iconstyle={{ width: "100px" }}></EbayShortHandIcon>
            )
        }
        if (channelType === ECOM_CONSTANTS.CHANNEL_TYPE.SHOPIFY) {
            return (
                <ShopifyShortHandIcon iconstyle={{ width: "100px" }}></ShopifyShortHandIcon>
            )
        }
        if (channelType === ECOM_CONSTANTS.CHANNEL_TYPE.ETSY) {
            return (
                <EtsyShortHandIcon iconstyle={{ width: "100px" }}></EtsyShortHandIcon>
            )
        }
        if (channelType === ECOM_CONSTANTS.CHANNEL_TYPE.WOOCOMMERCE) {
            return (
                <WooCommerceShortHandIcon iconstyle={{ width: "100px" }}></WooCommerceShortHandIcon>
            )
        }
        return null
    }

    const renderConnectStatus = (channel: any) => {
        if (channel?.is_connected) {
            return (
                <Space size="middle" align="center">
                    <div>
                        <Space>
                            <Text strong={true}>
                                Connected
                            </Text>
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                        </Space>
                    </div>
                    <div>
                        <Button icon={<DisconnectOutlined />} onClick={handleDisconnect}>
                            Disconnect
                        </Button>
                    </div>
                </Space>
            )
        } else {
            return (<div style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
                <Text strong={true}>
                    Disconnected
                </Text>
                <CloseCircleTwoTone twoToneColor="red" />
            </div >
            )
        }
    }

    const handleDisconnect = async () => {
        try {
            let res: any = await performChannelAction({
                id: id,
                action: ECOM_CONSTANTS.CHANNEL_ACTIONS.DISCONNECT
            });
            setChannel(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            let values: any = await form.validateFields();
            let res: any = await updateChannel({
                id: id,
                body: {
                    name: values['channel-name'],
                    channel_type: channel.channel_type,
                    code: channel.code,
                    has_inventory_sync: channel.has_inventory_sync
                }
            });
            setChannel(res.data);
            setSaving(false);
        } catch (error: any) {
            setSaving(false);
            console.log(error);
            if (error?.response) {
                notification.error({
                    message: "Channel Update",
                    description: error.response?.data?.errors?.[0] || "Something went wrong. Try again"
                });
                console.log(error?.response.data.errors);
            }
        }
    }

    useEffect(() => {
        form.setFieldsValue({
            "channel-name": channel?.name
        });
    }, [channel?.name]);


    return (
        <div id="channel-details-tab">
            <Row justify="space-between">
                <Col sm={{ span: 16 }} md={{ span: 16 }}>
                    <Form
                        name="channel-details-form"
                        form={form}
                        className="channel-details-form"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        labelAlign="left"
                        autoComplete="off"
                    >
                        <Row>
                            <Col span={8}>
                                <div className="form-title" >
                                    <Title level={4}>Channel Details</Title>
                                    <Text type="secondary">
                                        Provides channel related details
                                    </Text>
                                </div>
                            </Col>
                            <Col span={16}>
                                {
                                    channel && renderChannelConnection({
                                        channel: channel
                                    })
                                }
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: "25px" }}>
                            <Col span={8}> <Typography.Text>Code:</Typography.Text></Col>
                            <Col span={16}> <Typography.Text>{channel?.code}</Typography.Text></Col>
                        </Row>
                        <Form.Item label="Channel Name" name="channel-name" rules={[{ required: true, message: "Channel name cannot be empty" }]}>
                            <Input />
                        </Form.Item>
                        <Row hidden={![ECOM_CONSTANTS.CHANNEL_TYPE.AMAZON, ECOM_CONSTANTS.CHANNEL_TYPE.EBAY].includes(channel?.channel_type)}>
                            <Col span={8}>
                                <Text>Market Place Regions:</Text>
                            </Col>
                            <Col span={16}>
                                <Text>
                                    {getMarketPlaceRegionName(channel?.channel_type || -1, channel?.marketplace_regions || "")}
                                </Text>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col sm={{ span: 8 }} md={{ span: 8 }}>
                    <Space style={{ display: "flex", justifyContent: "right" }}>
                        <div>
                            <Button type="primary" loading={saving} onClick={handleSave}>Save</Button>
                        </div>
                    </Space>
                    <Space direction="horizontal" style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                        {
                            getChannelImage(channel?.channel_type || -1)
                        }
                    </Space>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col sm={{ span: 16 }} md={{ span: 16 }}>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col>
                            <div>
                                <Title level={4} style={{ marginBottom: "0" }}>Actions</Title>
                                <Text type="secondary">
                                    Provides action related details
                                </Text>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>Turn on / off Inv Sync:</Text>
                        </Col>
                        <Col span={16}>
                            {
                                channel?.has_inventory_sync ? (
                                    <Space size="middle">
                                        <Space>
                                            <Text strong={true}>
                                                Inv Sync On
                                            </Text>
                                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                                        </Space>
                                        <div>
                                            <Button onClick={handleTurnOffInvSync} loading={turningOffInvSync}>
                                                Turn off Inv Sync
                                            </Button>
                                        </div>
                                    </Space>
                                ) :
                                    (<div style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
                                        <Space>
                                            <Text strong={true}>
                                                Inv Sync Off
                                            </Text>
                                            <CloseCircleTwoTone twoToneColor="red" />
                                        </Space>
                                    </div>
                                    )
                            }
                            <div>
                                <Extra description="Extra props goes here. Extra props goes here. Extra props goes here. Extra props goes here.Extra props goes here." />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>
                                Sync Inventory:
                            </Text>
                        </Col>
                        <Col span={16}>
                            <Button icon={<SyncOutlined spin={syncingInventory} />} onClick={handleInventorySync}>
                                Sync Inventory
                            </Button>
                            <div>
                                <Extra description="Extra props goes here. Extra props goes here. Extra props goes here. Extra props goes here.Extra props goes here." />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>
                                Hard Refresh Inventory:
                            </Text>
                        </Col>
                        <Col span={16}>
                            <Button icon={<UndoOutlined spin={invHardRefreshing} />} onClick={handleInvHardRefresh}>
                                Hard Refresh Inventory
                            </Button>
                            <div>
                                <Extra description="Extra props goes here. Extra props goes here. Extra props goes here. Extra props goes here.Extra props goes here." />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>
                                Sync Listings:
                            </Text>
                        </Col>
                        <Col span={16}>
                            <Button icon={<SyncOutlined spin={syncingListing} />} onClick={handleSyncListing}>
                                Sync Listings
                            </Button>
                            <div>
                                <Extra description="Extra props goes here. Extra props goes here. Extra props goes here. Extra props goes here.Extra props goes here." />
                            </div>
                            <div>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>
                                Hard Refresh Listings:
                            </Text>
                        </Col>
                        <Col span={16}>
                            <Button icon={<UndoOutlined spin={listingHardRefreshing} />} onClick={handleHardRefreshListings}>
                                Hard Refresh Listings
                            </Button>
                            <div>
                                <Extra description="Extra props goes here. Extra props goes here. Extra props goes here. Extra props goes here.Extra props goes here." />
                            </div>
                            <div>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>
                                Connect/Disconnect:
                            </Text>
                        </Col>
                        <Col span={16}>
                            {
                                renderConnectStatus(channel)
                            }
                            <div>
                                <Extra description="Extra props goes here. Extra props goes here. Extra props goes here. Extra props goes here.Extra props goes here." />
                            </div>
                            <div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col sm={{ span: 16 }} md={{ span: 16 }}>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col>
                            <div>
                                <Title level={4} style={{ marginBottom: "0" }}>Sync Time</Title>
                                <Text type="secondary">
                                    Provides time related details
                                </Text>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>
                                Last Connected Time:
                            </Text>
                        </Col>
                        <Col span={16}>
                            <div>
                                <Text>
                                    {
                                        displayLocaleDateTime(channel?.last_connected_time, APP_CONSTANTS.DATE_FORMAT.DISPLAY_DATETIME)
                                    }
                                </Text>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>
                                Last Inventory Sync Time:
                            </Text>
                        </Col>
                        <Col span={16}>
                            <div>
                                <Text>
                                    {
                                        channel && displayLocaleDateTime(channel.inventory_sync_end_time, APP_CONSTANTS.DATE_FORMAT.DISPLAY_DATETIME)
                                    }
                                </Text>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "25px" }}>
                        <Col span={8}>
                            <Text>
                                Last Listing Sync Time:
                            </Text>
                        </Col>
                        <Col span={16}>
                            <div>
                                <Text>
                                    {
                                        displayLocaleDateTime(channel?.product_sync_end_time, APP_CONSTANTS.DATE_FORMAT.DISPLAY_DATETIME)
                                    }
                                </Text>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default Details;