import React, { FC, useCallback, useEffect, useState } from "react";
import addPurchasePrice from "../../../../services/apis/products/add-purchase-price.service";
import getSupplier from "../../../../services/apis/products/get-supplier-list.service";
import {
  IPurchasePriceDetails,
  IParamTypes,
} from "../../../../interfaces/IProducts";
import { useParams, useHistory, useLocation } from "react-router-dom";
import currencyCodes from "currency-codes";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "../Details.module.scss";

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
  InputNumber,
  Button,
} from "antd";
import SearchInput from "../../../../components/inputs/search-input";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";
const { Option } = Select;
const { Title, Text } = Typography;

const initValue = {
  purchase_rate: 0,
  shipping_rate: 0,
  product_id: "",
  pack_size: 0,
  currency: "",
  supplier: "",
  supplier_sku: "",
  pack_uom: "",
  moq: 0,
};
interface IStateType {
  imageUrl: string;
  productName: string;
}
const AddPurchasePriceDetail: FC = () => {
  let { id } = useParams<IParamTypes>();
  const history = useHistory();
  const location = useLocation<IStateType>();
  const [form] = Form.useForm();

  const [suppliers, setSuppliers] = useState([]);
  const [purchasePriceDetails, setPurchasePriceDetails] =
    useState<IPurchasePriceDetails>({ ...initValue, product_id: id });

  const handleSubmit = async () => {
    try {
      await addPurchasePrice(purchasePriceDetails);
      message.success("Purchase price added succesfully");
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    setPurchasePriceDetails({
      ...purchasePriceDetails,
      currency: JSON.parse(localStorage.getItem("default_setting") || "{}")
        .currency,
    });
  }, []);

  const handleGoBack = () => history.goBack();
  const handleSupplier = (e: any) => {
    setPurchasePriceDetails({
      ...purchasePriceDetails,
      contact: e[0],
      contact_id: e[0].id,
    });
  };

  return (
    <div>
      <div className={styles["purchaseRateContainer"]}>
        <div className={styles["purchaseRateContainer__topNav"]}>
          <Row justify="space-between">
            <Col>
              <div className="pdt-name-container">
                <Button
                  onClick={handleGoBack}
                  icon={<ArrowLeftOutlined />}></Button>
                <h5>Purchase Rates</h5>
              </div>
            </Col>
            <Col style={{ display: "flex", justifyContent: "right" }}>
              <Form form={form} onFinish={handleSubmit}>
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                  Save
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
        <div className={styles["purchaseRateContainer__content"]}>
          <div className={styles["purchaseRateContainer__content__heading"]}>
            <Title level={5}>Purchase Price Details</Title>
            <Text type="secondary">
              Detailed information about this product
            </Text>
          </div>
          <Row justify="space-between">
            <Col md={14}>
              <Form
                name="basic"
                requiredMark="optional"
                form={form}
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 15 }}
                labelAlign="left"
                autoComplete="off">
                <Form.Item required label="Product " name="product">
                  <Input disabled defaultValue={location?.state?.productName} />
                </Form.Item>

                <Form.Item required label="Purchase Rate " name="purchase_rate">
                  <Input
                    type={"number"}
                    onWheel={(e: any) => e.target.blur()}
                    style={{ width: "100%" }}
                    name="name"
                    onChange={(e: any) =>
                      setPurchasePriceDetails({
                        ...purchasePriceDetails,
                        purchase_rate: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item label="Supplier" name="supplier">
                  <SearchInput
                    extraParams={{
                      limit: 10,
                    }}
                    url={`${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.CONTACTS}`}
                    handleGetArrRes={handleSupplier}
                  />
                </Form.Item>
                <Form.Item label="Shipping Rate" name="shipping_rate">
                  <Input
                    type={"number"}
                    onWheel={(e: any) => e.target.blur()}
                    style={{ width: "100%" }}
                    name="name"
                    onChange={(e: any) =>
                      setPurchasePriceDetails({
                        ...purchasePriceDetails,
                        shipping_rate: e.target.value,
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  required
                  label="Currency "
                  extra="Currency in which the purchase rate is mentioned"
                  name="currency">
                  <Select
                    defaultValue={
                      JSON.parse(
                        localStorage.getItem("default_setting") || "{}"
                      ).currency
                    }
                    showSearch
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(e) =>
                      setPurchasePriceDetails({
                        ...purchasePriceDetails,
                        currency: e,
                      })
                    }>
                    {currencyCodes.codes().map((el: any, i: number) => (
                      <Option key={i} value={el}>
                        {el}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Supplier SKU"
                  extra="The Supplier SKU to print on the PO"
                  name="supplier_sku">
                  <Input
                    onChange={(e) =>
                      setPurchasePriceDetails({
                        ...purchasePriceDetails,
                        supplier_sku: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Pack Size"
                  extra="If you purchase products in packs, you can enter the pack
              size, else it defaults to 1"
                  name="pack_size"
                  rules={[
                    {
                      pattern: /^[0-9]*$/,
                      message: "Invalid input",
                    },
                  ]}>
                  <Input
                    type={"number"}
                    onWheel={(e: any) => e.target.blur()}
                    style={{ width: "100%" }}
                    name="name"
                    onChange={(e: any) =>
                      setPurchasePriceDetails({
                        ...purchasePriceDetails,
                        pack_size: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Pack UOM"
                  extra="For example, Carton of 12 Pcs, Bag of 100, Pack UOM can be
              printed on the PO for better interpretation"
                  name="pack_uom">
                  <Input
                    onChange={(e) =>
                      setPurchasePriceDetails({
                        ...purchasePriceDetails,
                        pack_uom: e.target.value,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="MOQ"
                  extra="Minimum order quantity field for reference while creating
              PO; system will allow you to order below MOQ as well"
                  name="moq">
                  <Input
                    type={"number"}
                    onWheel={(e: any) => e.target.blur()}
                    style={{ width: "100%" }}
                    name="name"
                    onChange={(e: any) =>
                      setPurchasePriceDetails({
                        ...purchasePriceDetails,
                        moq: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col md={10} style={{ display: "flex", justifyContent: "right" }}>
              {location?.state?.imageUrl !== "" && (
                <Image
                  width={200}
                  height={200}
                  src={location?.state?.imageUrl}
                />
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default AddPurchasePriceDetail;
