import { Modal, Button, Typography, notification, Space, Checkbox, Form } from "antd";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import toggleSync from "../../services/apis/ecom/channels/toggle-sync.service";
import { QuestionCircleOutlined } from '@ant-design/icons';
import Title from "antd/lib/skeleton/Title";
import { ECOM_CONSTANTS } from "../../utils/constants/ecom.constants";
import performChannelAction from "../../services/apis/ecom/channels/perform-channel-action.service";
import { BACKEND_API_PATHS } from "../../utils/constants/backend-api-path.constants";

interface SyncIntstructionProps {
    channel: {
        id: number;
        channelType: number
    },
    afterSync?: (channel: any) => void
}

const SyncIntstruction: FC<SyncIntstructionProps> = ({ channel, afterSync }) => {
    const buttonRef = useRef<HTMLElement>(null);
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [isCopyStockFromOnline, setIsCopyStockFromOnline] = useState(false);
    const [showCopyStockCheck, setShowCopyStockCheck] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    }

    useEffect(() => {
        if (channel.channelType === ECOM_CONSTANTS.CHANNEL_TYPE.SHOPIFY
            || channel.channelType === ECOM_CONSTANTS.CHANNEL_TYPE.ETSY) {
            setShowCopyStockCheck(true);
        }
    }, [channel.channelType]);

    const handleOk = async () => {
        form
            .validateFields()
            .then(async values => {
                form.resetFields();
                setSyncing(true);
                try {
                    let res: any;
                    if (showCopyStockCheck && isCopyStockFromOnline) {
                        res = await performChannelAction({
                            id: channel.id,
                            action: BACKEND_API_PATHS.CHANNEL_ACTIONS.SET_STOCK_FROM_STORE
                        });
                    } else {
                        res = await toggleSync({ id: channel.id });
                    }
                    afterSync?.(res.data);
                    setSyncing(false);
                    // hideModal();
                    notification.success({
                        message: "Sync",
                        description: "Inventory sync is turned on."
                    });
                } catch (error) {
                    setSyncing(false);
                    console.log(error);
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>Instructions to turn on sync</Button>
            <Modal
                title={<Typography.Title style={{ margin: "0" }} level={4}>Turn on Inventory Sync</Typography.Title>}
                visible={visible}
                onOk={handleOk}
                okText="Turn on Sync"
                confirmLoading={syncing}
                onCancel={handleCancel}
            >
                <div style={{ border: "1px solid #f0f0f0", borderRadius: "5px", padding: "5px 10px 0px 10px", marginBottom: "20px" }}>
                    <Space align="start">
                        <QuestionCircleOutlined />
                        <div>
                            <Typography.Title level={5}>Help docs to refer before turning on Sync</Typography.Title>
                            <ul>
                                <li><Typography.Link href="https://help.sumtracker.com/article/104-what-happens-when-inventory-sync-is-turned-on" target="_blank">How Inventory Sync works</Typography.Link></li>
                                <li><Typography.Link href="https://help.sumtracker.com/article/129-set-stock" target="_blank">How to set stock in Sumtracker</Typography.Link></li>
                            </ul>
                        </div>
                    </Space>
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <table>
                        <thead>
                            <tr>
                                <th><Typography.Text> Products Summary</Typography.Text></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Products</td>
                                <td style={{ padding: "5px 10px" }}>87</td>
                            </tr>
                            <tr>
                                <td>No. of products with stock</td>
                                <td style={{ padding: "5px 10px" }}>45</td>
                            </tr>
                            <tr>
                                <td>No. of bundles</td>
                                <td style={{ padding: "5px 10px" }}>25</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {
                    showCopyStockCheck && <Space style={{ marginBottom: "20px" }}>
                        <div><Typography.Text strong={true}>Copy Stock from your online store</Typography.Text>
                        </div>
                        <Checkbox onChange={(event: any) => {
                            setIsCopyStockFromOnline(event.target.checked)
                        }}></Checkbox></Space>
                }
                <Form
                    form={form}
                    name="syncAgreement"
                >
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Please check this box before turning on sync')),
                            }
                        ]}
                    >
                        <Space style={{ backgroundColor: "#FBFBFD" }}>
                            <Checkbox>I understand that after turning on sync, stock from sumtracker will be updated on my store</Checkbox>
                            <div>
                            </div>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SyncIntstruction;