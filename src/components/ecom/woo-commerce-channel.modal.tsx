import { Form, Input, Modal, Typography } from "antd";
import { FC } from "react";

interface WooCommerceModalProps {
    visible: boolean,
    handleOk?: (values: any, e: any) => void,
    handleCancel?: (e: any) => void
}

const WooCommerceChannel: FC<WooCommerceModalProps> = ({ visible, handleOk, handleCancel }) => {
    const [form] = Form.useForm();

    const onOk = async (e: any) => {
        try {
            let values: any = await form.validateFields();
            handleOk?.(values, e);
            form.resetFields();
        } catch (error) {
            console.log(error);
        }
    }

    const onCancel = (e: any) => {
        handleCancel?.(e);
    }

    return (
        <Modal
            title={<Typography.Title style={{ margin: "0" }} level={4}>Add WooCommerce Store</Typography.Title>}
            visible={visible}
            onOk={onOk}
            okText="Connect Store"
            onCancel={onCancel}
        >
            <Form
                form={form}
                name="woo-commerce-channel-form"
            >
                <Form.Item label="Website URL"
                    name="url"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter url',
                        }
                    ]}
                >
                    <Input />
                    {/* <Typography.Text style={{ color: "grey", fontSize: "12px" }}>Example: https://www.mystore.com</Typography.Text> */}
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default WooCommerceChannel;