import React, { FC, useEffect, useState } from "react";
import styles from "../Details.module.scss";
import {
  CopyOutlined,
  PlusOutlined,
  EditOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { IDetailsProps, IParamTypes } from "../../../../interfaces/IProducts";
// import fallBack from "images/fallback-image.png";
import {
  Row,
  Col,
  Form,
  Input,
  Switch,
  Select,
  Tag,
  Image,
  message,
  Typography,
  Divider,
  Modal,
  Skeleton,
} from "antd";
import { Link, useParams } from "react-router-dom";
import localStore from "../../../../services/local-storage.service";
import listGroupService from "../../../../services/apis/products/groups/list-groups.service";
import getTaxesService from "../../../../services/apis/app-settings/get-tax.services";

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const Detail: FC<IDetailsProps> = ({
  onChangeDetails,
  productDetailProp,
  loading,
}) => {
  let { id } = useParams<IParamTypes>();
  const [form] = Form.useForm();
  const [groupList, setGroupList] = useState([]);
  const [taxList, setTaxList] = useState([]);
  // const [loading, setLoading] = useState(false);

  const handleCopy = (val: any) => {
    navigator.clipboard.writeText(val);
    message.info("Copied to clipboard!");
  };
  const getListGroup = async () => {
    const { data } = await listGroupService({
      queryParams: {
        paginate: false,
      },
    });
    setGroupList(data);
  };

  const getTax = async () => {
    const { data } = await getTaxesService({
      queryParams: {
        paginate: false,
      },
    });
    setTaxList(data);
  };

  useEffect(() => {}, []);
  form.setFieldsValue({
    name: productDetailProp?.name,
    uom: productDetailProp?.uom,
    sku: productDetailProp?.sku,
    alert_threshold: productDetailProp?.alert_threshold,
    close_at_quantity: productDetailProp?.close_at_quantity,
    barcode: productDetailProp?.barcode,
    group1: productDetailProp?.group1?.name,
    group1_id: productDetailProp?.group1_id,
    tax: productDetailProp?.tax?.name,
    notes: productDetailProp?.notes,
  });
  useEffect(() => {
    getListGroup();
    getTax();
  }, [window.location]);

  return (
    <Skeleton loading={loading} paragraph={{ rows: 12 }}>
      <div className={styles["detailsContainer"]}>
        <div className={styles["detailsContainer__product"]}>
          <Row justify="space-between">
            <Col md={14}>
              <div className={styles["detailsContainer__product__heading"]}>
                <Title level={4}>Product Details</Title>
                <Text type="secondary">
                  Detailed information about this product
                </Text>
              </div>
              <Form
                name="basic"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off">
                <Form.Item
                  label="Name"
                  extra="Updates from online listings; cannot be changed if product is created through store."
                  name="name"
                  rules={[{ required: true, message: "Please input name!" }]}>
                  <TextArea
                    name="name"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="SKU"
                  extra="Updates from online listings; cannot be changed if product
              is created through store"
                  name="sku"
                  rules={[{ required: true, message: "Please input sku !" }]}>
                  <Input
                    name="sku"
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        sku: e.target.value,
                      })
                    }
                    suffix={
                      <CopyOutlined
                        onClick={() => handleCopy(productDetailProp?.sku)}
                      />
                    }
                  />
                </Form.Item>
                <Form.Item label="UOM" extra="Unit of measurement" name="uom">
                  <Select
                    defaultValue={productDetailProp?.uom}
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        uom: e,
                      })
                    }>
                    {localStore.get("uoms")?.map((el: any, i: number) => (
                      <Option key={i} value={el}>
                        {el}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={"Category"}
                  extra="Updates from Product type on Shopify; can be modified if
product is not linked to Shopify"
                  name="group1">
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        group1: Object.assign(
                          {},
                          ...groupList.filter((el: any) => el.id == e)
                        ),
                        group1_id: Object.assign(
                          {},
                          ...groupList.filter((el: any) => el.id == e)
                        ).id,
                      })
                    }>
                    {groupList?.map((el: any, i: number) => (
                      <Option key={i} value={el.id}>
                        {el.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={"Barcode"}
                  extra=" Updates from Barcode on Shopify; can be modified if
                            product is not linked to Shopify"
                  name="barcode">
                  <Input
                    name="barcode"
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        barcode: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={"Tax"}
                  extra="Tax is used in purchase orders"
                  name="tax">
                  <Select
                    defaultValue={productDetailProp?.tax}
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        tax_id: e,
                      })
                    }>
                    {taxList?.map((el: any, i: number) => (
                      <Option key={i} value={el.id}>
                        {el.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={"Alert Threshold"}
                  extra="Get low stock products email on reaching alert threshold"
                  name="alert_threshold">
                  <Input
                    name="alert_threshold"
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        alert_threshold: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={"Close Quantity"}
                  extra="Product will be marked as out of stock online on reaching
                            this quantity"
                  name="close_at_quantity">
                  <Input
                    name="close_at_quantity"
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        close_at_quantity: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={"Tags"}
                  extra="Updates from Product tags on Shopify"
                  name="tags">
                  <Input disabled />
                  <div style={{ paddingTop: "10px" }}>
                    {productDetailProp?.tags?.map((el: any, i: number) => (
                      <Tag key={i}>{el}</Tag>
                    ))}
                  </div>
                </Form.Item>
                <Form.Item label="Notes" name="notes">
                  <TextArea
                    showCount
                    maxLength={100}
                    style={{ height: 120 }}
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        notes: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={"Inventory Tracking"}
                  extra="Turn off Inventory sync if you don’t want Sumtracker to
                            update this products inventory to your store"
                  valuePropName="tracking_type"
                  name="tracking_type">
                  <Switch
                    onChange={(e) =>
                      onChangeDetails({
                        ...productDetailProp,
                        tracking_type: e ? 2 : 5,
                      })
                    }
                    checked={
                      productDetailProp?.tracking_type == 2 ? true : false
                    }
                  />
                </Form.Item>
              </Form>
            </Col>

            <Col md={10} style={{ display: "flex", justifyContent: "right" }}>
              <div>
                <div className="dates">
                  <div>Created on: </div>
                  <div>
                    {" "}
                    {moment(productDetailProp?.created).format("DD MMM YYYY")}
                  </div>
                </div>
                <div className="dates">
                  <div>Updated on: </div>
                  <div>
                    {" "}
                    {moment(productDetailProp?.updated).format("DD MMM YYYY")}
                  </div>
                </div>
                <Row>
                  {productDetailProp?.image_url !== "" && (
                    <div className="image-container">
                      <Image
                        width={200}
                        height={200}
                        src={productDetailProp?.image_url}
                      />
                    </div>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
          <Row></Row>
        </div>
        <Divider />
      </div>
    </Skeleton>
  );
};
export default Detail;
