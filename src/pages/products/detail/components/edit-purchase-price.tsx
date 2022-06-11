import React, { FC, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import updatePurchasePrice from "../../../../services/apis/products/update-purchase-price.service";
import {
  IPurchasePriceDetails,
  IParamTypes,
  IProductDetail,
} from "../../../../interfaces/IProducts";
import styles from "../Details.module.scss";

import { useParams, useHistory, useLocation } from "react-router-dom";
import currencyCodes from "currency-codes";
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
  id: 0,
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
  record: IPurchasePriceDetails;
}

const EditPurchasePrice: FC = () => {
  let { id } = useParams<IParamTypes>();
  const history = useHistory();
  const location = useLocation<IStateType>();
  const [form] = Form.useForm();

  const [purchasePriceDetails, setPurchasePriceDetails] =
    useState<IPurchasePriceDetails>(location.state.record);
  const handleSubmit = async () => {
    try {
      await updatePurchasePrice(purchasePriceDetails, purchasePriceDetails.id);
      message.success("Purchase price updated succesfully");
    } catch (error) {
    } finally {
    }
  };
  form.setFieldsValue({
    purchase_rate: purchasePriceDetails.purchase_rate,
    shipping_rate: purchasePriceDetails.shipping_rate,
    product_id: purchasePriceDetails.product_id,
    pack_size: purchasePriceDetails.pack_size,
    currency: purchasePriceDetails.currency,
    supplier: purchasePriceDetails?.contact?.code,
    supplier_sku: purchasePriceDetails.supplier_sku,
    pack_uom: purchasePriceDetails.pack_uom,
    moq: purchasePriceDetails.moq,
  });
  const handleGoBack = () => history.goBack();

  const handleSupplier = (e: any) => {
    setPurchasePriceDetails({
      ...purchasePriceDetails,
      contact: e[0],
      contact_id: e[0].id,
    });
  };
  return (
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
          <Col>
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
          <Text type="secondary">Detailed information about this product</Text>
        </div>
        <Row justify="space-between">
          <Col md={16}>
            <Form
              name="basic"
              requiredMark="optional"
              form={form}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              labelAlign="left"
              autoComplete="off">
              <Form.Item label="Product " required name="product">
                <Input
                  disabled
                  defaultValue={location?.state?.record?.productDetail?.name}
                />
              </Form.Item>
              <Form.Item label="Purchase Rate " required name="purchase_rate">
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
                label="Currency "
                required
                extra="Currency in which the purchase rate is mentioned"
                name="currency">
                <Select
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
              <Form.Item label="Supplier" name="supplier">
                <SearchInput
                  extraParams={{
                    limit: 10,
                  }}
                  defaultVal={purchasePriceDetails?.supplier}
                  url={`${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.CONTACTS}`}
                  handleGetArrRes={handleSupplier}
                />
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
                name="pack_size">
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
          <Col md={8} style={{ display: "flex", justifyContent: "right" }}>
            {location?.state?.record?.productDetail?.image_url && (
              <Image
                width={200}
                height={200}
                src={location?.state?.record?.productDetail?.image_url}
              />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default EditPurchasePrice;
