import React, { FC, useEffect, useState } from "react";
import styles from "../List.module.scss";
import {
  CopyOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { IProductDetail, IParamTypes } from "../../../../interfaces/IProducts";
import {
  Row,
  Col,
  Form,
  Input,
  Switch,
  Select,
  message,
  Typography,
  Button,
  Spin,
} from "antd";
import { useHistory } from "react-router-dom";
import localStore from "../../../../services/local-storage.service";
import listGroupService from "../../../../services/apis/products/groups/list-groups.service";
import getTaxesService from "../../../../services/apis/app-settings/get-tax.services";
import addProduct from "../../../../services/apis/products/add-product.service";

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const AddnewProduct: FC = () => {
  let history = useHistory();

  const [form] = Form.useForm();
  const [groupList, setGroupList] = useState([]);
  const [taxList, setTaxList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productDetails, setproductDetails] = useState<any>({});

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

  const handleSubmit = async () => {
    if (form.getFieldValue("name") == undefined) {
      message.error("Please enter product name");
      return;
    }
    if (form.getFieldValue("sku") == undefined) {
      message.error("Please enter product SKU");
      return;
    }
    try {
      setLoading(true);
      const res = await addProduct(productDetails);
      setLoading(false);
      message.success("Product added succesfully");
      history.push(`/index/product/${res.data.id}/product-details`);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListGroup();
    getTax();
  }, [window.location]);
  const handleGoBack = () => history.goBack();

  return (
    <div className={styles["addProductContainer"]}>
      <div className={styles["addProductContainer__topNav"]}>
        <Row justify="space-between">
          <Col>
            <div className={styles["addProductContainer__topNav__pdtName"]}>
              <Button
                type="default"
                icon={<ArrowLeftOutlined style={{ verticalAlign: "0px" }} />}
                onClick={handleGoBack}></Button>
              <h5>Add Product</h5>
            </div>
          </Col>
          <Col style={{ display: "flex", justifyContent: "right" }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              icon={<SaveOutlined style={{ verticalAlign: "0px" }} />}>
              <span style={{ paddingLeft: "5px" }}>Save</span>
            </Button>
          </Col>
        </Row>
      </div>
      <div className={styles["addProductContainer__addDetails"]}>
        <Spin spinning={loading}>
          <Row justify="space-between">
            <Col md={14}>
              <div
                className={styles["addProductContainer__addDetails__heading"]}>
                <Title level={5}>Product Details</Title>
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
                      setproductDetails({
                        ...productDetails,
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
                      setproductDetails({
                        ...productDetails,
                        sku: e.target.value,
                      })
                    }
                    suffix={
                      <CopyOutlined
                        onClick={() => handleCopy(productDetails?.sku)}
                      />
                    }
                  />
                </Form.Item>
                <Form.Item label="UOM" extra="Unit of measurement" name="uom">
                  <Select
                    defaultValue={productDetails?.uom}
                    onChange={(e) =>
                      setproductDetails({
                        ...productDetails,
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
                      setproductDetails({
                        ...productDetails,
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
                      setproductDetails({
                        ...productDetails,
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
                    defaultValue={productDetails?.tax}
                    onChange={(e) =>
                      setproductDetails({
                        ...productDetails,
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
                      setproductDetails({
                        ...productDetails,
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
                      setproductDetails({
                        ...productDetails,
                        close_at_quantity: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item label="Notes" name="notes">
                  <TextArea
                    showCount
                    maxLength={100}
                    style={{ height: 120 }}
                    onChange={(e) =>
                      setproductDetails({
                        ...productDetails,
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
                      setproductDetails({
                        ...productDetails,
                        tracking_type: e ? 2 : 5,
                      })
                    }
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};
export default AddnewProduct;
