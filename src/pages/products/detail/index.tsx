import React, { useEffect, useState } from "react";
import Detail from "./components/product-detail-tab";
import styles from "./Details.module.scss";
import { Tabs, Button, Space, message, Tag, Modal } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import { useHistory } from "react-router-dom";
import { IParamTypes, IProductDetail } from "../../../interfaces/IProducts";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import updateProductDetail from "../../../services/apis/products/update-product-detail.service";
import getProductDetail from "../../../services/apis/products/get-product-detail.service";

import bulkAction from "../../../services/apis/products/bulk-action.service";
import deleteProduct from "../../../services/apis/products/delete-product.service";

import { useParams } from "react-router-dom";
import { Col, Row, Tab } from "react-bootstrap";
import Listings from "./components/product-listing-tab";
import StockLevel from "./components/product-stock-level-tab";
import InventoryLog from "./components/product-inventory-log-tab";
import PurchasePriceTab from "./components/purchase-price-tab";

const { TabPane } = Tabs;
const { confirm } = Modal;

const sampleProductDetail = {
  name: "",
  sku: "",
  alert_threshold: "",
  created: "",
  updated: "",
  image_url: "",
  tags: [],
};

const ProductDetailsPage = () => {
  let { id } = useParams<IParamTypes>();
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [productDetail, setProductDetail] = useState<any>();

  const getProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await getProductDetail(id);
      setProductDetail(data);
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong !");
    }
  };

  const handleUpdateProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await updateProductDetail(id, productDetail);
      setProductDetail(data);
      setLoading(false);
      message.success("Product updated successfully");
    } catch (error) {
      message.error("Something went wrong !");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProductDetails();
  }, []);

  const onChangeDetails = (e: any) => {
    setProductDetail(e);
  };

  const handleArchiveProduct = async () => {
    try {
      const res = await bulkAction([id], "archive");
      getProductDetails();
      message.success("Product archived successfully");
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleConfirmDelete = () => {
    confirm({
      title: "Are you sure you want to delete?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDeleteProduct();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await deleteProduct(id);
      handleGoBack();
      message.success("Product deleted successfully");
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleUnArchiveProduct = async () => {
    try {
      const res = await bulkAction([id], "undo-archive");
      getProductDetails();
      message.success("Product unarchived successfully");
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleGoBack = () => {
    history.push(
      `/${
        PAGE_PATHS.PRODUCT_LIST +
        "?" +
        PAGE_PATHS.PRODUCT_LIST_DEFAULT_QUERY_PARAMS
      }`
    );
  };
  const handleCallToRouter = (value: string) => history.push(value);

  return (
    <>
      {/* {loading && <ClockLoader />} */}
      <div className={styles["top-nav"]}>
        <Row className="justify-space-between">
          <Col>
            <div className={styles["top-nav__pdt-name-container"]}>
              <Button
                type="default"
                icon={<ArrowLeftOutlined style={{ verticalAlign: "0px" }} />}
                onClick={handleGoBack}></Button>
              <h5>{productDetail?.name}</h5>
              <div style={{ lineHeight: "3" }}>
                {productDetail?.is_archived && (
                  <Tag color="orange">Archived</Tag>
                )}
              </div>
            </div>
          </Col>
          <Col style={{ display: "flex", justifyContent: "right" }}>
            {history.location.pathname.split("/").pop() ===
              "product-details" && (
              <Space>
                {productDetail?.is_archived ? (
                  <Button
                    onClick={handleUnArchiveProduct}
                    type="text"
                    icon={<SaveOutlined style={{ verticalAlign: "0px" }} />}>
                    <span style={{ paddingLeft: "5px" }}>Unarchive</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleArchiveProduct}
                    type="text"
                    icon={<SaveOutlined style={{ verticalAlign: "0px" }} />}>
                    <span style={{ paddingLeft: "5px" }}>Archive</span>
                  </Button>
                )}
                <Button
                  onClick={() => handleConfirmDelete()}
                  type="text"
                  icon={<DeleteOutlined style={{ verticalAlign: "0px" }} />}>
                  <span style={{ paddingLeft: "5px" }}>Delete</span>
                </Button>
                <Button onClick={handleUpdateProductDetails} type="primary">
                  Save
                </Button>
              </Space>
            )}
          </Col>
        </Row>
      </div>
      <div className={styles["tabsContainer"]}>
        <Tabs
          // defaultActiveKey={"online-listings"}
          defaultActiveKey={history.location.pathname.split("/").pop()}
          onChange={handleCallToRouter}>
          <TabPane tab="Details" key="product-details">
            <Detail
              loading={loading}
              onChangeDetails={onChangeDetails}
              productDetailProp={productDetail}
            />
          </TabPane>

          <TabPane tab="Listings" key="online-listings">
            <Listings />
          </TabPane>
          <TabPane tab="Inventory" key="stock-by-location">
            <StockLevel />
          </TabPane>
          <TabPane tab="Inventory History" key="stock-logs">
            <InventoryLog />
          </TabPane>
          <TabPane tab="Purchase Rate" key="purchase-rates">
            <PurchasePriceTab productDetailProp={productDetail} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};
export default ProductDetailsPage;
