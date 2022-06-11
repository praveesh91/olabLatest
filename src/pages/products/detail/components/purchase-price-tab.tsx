import {
  Button,
  Col,
  Row,
  Space,
  Table,
  Typography,
  Modal,
  message,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import {
  CopyOutlined,
  PlusOutlined,
  EditOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import deletePurchasePrice from "../../../../services/apis/products/delete-purchase-price.service";
import getPurchasePrice from "../../../../services/apis/products/get-purchase-price.service";

import { Link, useParams } from "react-router-dom";
import styles from "../Details.module.scss";
import {
  IDetailsProps,
  IParamTypes,
  IPurchasePriceProps,
} from "../../../../interfaces/IProducts";

const { Title, Text } = Typography;
const { confirm } = Modal;

const PurchasePriceTab: FC<IPurchasePriceProps> = ({ productDetailProp }) => {
  let { id } = useParams<IParamTypes>();
  const [loading, setLoading] = useState(false);
  const [purchaseRates, setPurchaseRates] = useState([]);

  const handleDeletePurchaseRate = async (id: number) => {
    try {
      setLoading(true);
      await deletePurchasePrice(id);
      await getAllPurchasePrices();
      message.success("Purchase rate deleted successfully");
      setLoading(false);
    } catch (error) {
      message.error("Delete request connot be completed");
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmDelete = (id: number) => {
    confirm({
      title: "Are you sure you want to delete?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDeletePurchaseRate(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const getAllPurchasePrices = async () => {
    setLoading(true);

    const { data } = await getPurchasePrice({
      queryParams: { paginate: "False", product: id },
    });
    setPurchaseRates(data);
    setLoading(false);
  };

  useEffect(() => {
    getAllPurchasePrices();
  }, [window.location]);

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Supplier SKU",
      dataIndex: "supplier_sku",
      key: "supplier_sku",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Pack UOM",
      key: "pack_uom",
      dataIndex: "pack_uom",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },

    {
      title: "Pack Size",
      key: "pack_size",
      dataIndex: "pack_size",
      width: 100,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
      // @ts-ignore
      // align: "right",
    },
    {
      title: "Purchase Rate",
      key: "purchase_rate",
      dataIndex: "purchase_rate",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Currency",
      key: "currency",
      dataIndex: "currency",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <Space>
          <Link
            to={{
              pathname:
                "/" +
                PAGE_PATHS.EDIT_PURCHASE_RATE.replace(":id", id).replace(
                  ":purchaseId",
                  record.id
                ),
              state: { productDetailProp, record },
            }}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Button
            onClick={() => handleConfirmDelete(record.id)}
            icon={<CloseOutlined />}
          />
        </Space>
      ),
    },
  ];

  const purchaseRateTableData = purchaseRates.map((el: any) => ({
    id: el.id,
    product: el.product.sku,
    supplier: el.contact?.code,
    supplier_sku: el.supplier_sku,
    pack_uom: el.pack_uom,
    purchase_rate: el.purchase_rate.slice(0, -5),
    pack_size: el.pack_size.slice(0, -5),
    currency: el.currency,
    shipping_rate: el.shipping_rate.slice(0, -5),
    moq: el.moq,
    product_id: el.product_id,
    productDetail: el.product,
  }));

  return (
    <div className={styles["detailsContainer__purchase"]}>
      <Row justify="space-between" align="middle">
        <Col>
          <div className={styles["detailsContainer__purchase__heading"]}>
            <Title level={4}>Purchase Rates</Title>
            <Text type="secondary">
              You can select purchase rates while creating Purchase orders
            </Text>
          </div>
        </Col>
        <Col>
          <Link
            to={{
              pathname: "/" + PAGE_PATHS.PURCHASE_RATE.replace(":id", id),
              state: {
                imageUrl: productDetailProp?.image_url,
                productName: productDetailProp?.name,
              },
            }}>
            <Button
              icon={<PlusOutlined style={{ verticalAlign: "0px" }} />}
              type="primary">
              Add Purchase Price
            </Button>
          </Link>
        </Col>
      </Row>
      <Table
        columns={columns}
        loading={loading}
        dataSource={purchaseRateTableData}
        pagination={false}
      />
    </div>
  );
};

export default PurchasePriceTab;
