import { Modal, Typography, Form, Select } from "antd";
import { FC } from "react";
import { getObjFromList } from "../../services/conversion.service";
import { ECOM_CONSTANTS } from "../../utils/constants/ecom.constants";

interface AmazonModalProps {
    visible: boolean,
    handleOk?: (values: any, e: any) => void,
    handleCancel?: (e: any) => void
}

const AmazonChannel: FC<AmazonModalProps> = ({ visible, handleCancel, handleOk }) => {
    const [form] = Form.useForm();

    const marketPlaces = ECOM_CONSTANTS.AMAZON_MARKETPLACES;

    const onOk = async (e: any) => {
        try {
            let values: any = await form.validateFields();
            form.resetFields();
            handleOk?.(values, e);
        } catch (error) {
            console.log(error);
        }
    }

    const onCancel = (e: any) => {
        handleCancel?.(e);
    }

    return (
        <Modal
            title={<Typography.Title style={{ margin: "0" }} level={4}>Connect Amazon Store</Typography.Title>}
            visible={visible}
            onOk={onOk}
            okText="Connect Store"
            onCancel={onCancel}
        >
            <Form
                form={form}
                name="amazon-marketplace-form"
            >
                <Form.Item label="Market Place"
                    name="market_place"
                    rules={[
                        {
                            required: true,
                            message: 'Please select market place',
                        }
                    ]}
                >
                    <Select>
                        {
                            marketPlaces.map((place: any, i: number) => (
                                <Select.Option key={i} value={place.id}>{place.name}</Select.Option>
                            ))
                        }

                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AmazonChannel;