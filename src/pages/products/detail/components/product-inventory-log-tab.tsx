import React, { FC, useEffect, useState } from "react";
import styles from "../Details.module.scss";
import { RightOutlined } from "@ant-design/icons";
import getProductInventoryLog from "../../../../services/apis/products/get-inventory-log.service";

import { Table, Space } from "antd";

import { useHistory, useParams } from "react-router-dom";
import {
  IInventoryLogDetail,
  IInventoryLogProps,
  IParamTypes,
} from "../../../../interfaces/IProducts";
import moment from "moment";
import ProductPagination from "../../list/components/product-pagination";
import { getQueryParamsFromUrl } from "../../../../services/get-values.service";
import { convertJsonToQueryString } from "../../../../services/conversion.service";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import axios from "axios";

const InventoryLog: FC<IInventoryLogProps> = ({}) => {
  let { id } = useParams<IParamTypes>();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [inventoryLog, setInventoryLog] = useState<any>([]);
  const [productListPagination, setProductListPagination] = useState<{
    next?: string | null;
    prev?: string | null;
  }>({
    next: null,
    prev: null,
  });

  const columns = [
    {
      title: "Date",
      key: "updated",
      dataIndex: "updated",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Product",
      dataIndex: "sku",
      key: "sku",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (text: any, record: any) => (
        <Space>
          <div>
            <div className={styles["inventoryContainer__label"]}>Initial</div>
            <div>{text.initial}</div>
          </div>
          <div className={styles["inventoryContainer__icon"]}>
            <RightOutlined />
          </div>
          <div>
            <div className={styles["inventoryContainer__label"]}>Final</div>
            <div className={styles["inventoryContainer__finalVal"]}>
              {text.final}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "quantity",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },

    {
      title: "Document",
      key: "document",
      dataIndex: "document",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Warehouse",
      key: "wh",
      dataIndex: "wh",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "User",
      key: "user",
      dataIndex: "user",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {text == null ? "System" : text}
        </div>
      ),
    },
  ];

  const getAllProductInventoryLog = async () => {
    setLoading(true);
    const { data } = await getProductInventoryLog({
      queryParams: { paginate: "True", product: id },
    });
    setInventoryLog(data.results);
    setProductListPagination({
      next: data.next,
      prev: data.previous,
    });
    setLoading(false);
  };
  useEffect(() => {
    getAllProductInventoryLog();
  }, []);

  const fetchNextProducts = async () => {
    setLoading(true);
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.next || "",
    });
    const { data } = await getProductInventoryLog({
      queryParams,
    });
    setInventoryLog(data.results);
    setProductListPagination({
      next: data.next,
      prev: data.previous,
    });
    setLoading(false);
  };

  const fetchPrevProducts = async () => {
    setLoading(true);
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.prev || "",
    });
    const { data } = await getProductInventoryLog({
      queryParams,
    });
    setInventoryLog(data.results);
    setProductListPagination({
      next: data.next,
      prev: data.previous,
    });
    setLoading(false);
  };

  const listingsTableData = inventoryLog?.map((el: IInventoryLogDetail) => ({
    sku: el.product.sku,
    stock: {
      initial: parseInt(el.in_stock) - parseInt(el.quantity),
      final: el.in_stock.slice(0, -5),
    },
    instock: el.in_stock.slice(0, -5),
    quantity: el.quantity.slice(0, -5),
    finalStock: el.in_stock,
    document: `${el.content_type.name} ${el.document_number}`,
    wh: el.warehouse.code,
    user: el.user?.full_name,
    updated: moment(el.updated).format("DD MMM YYYY"),
  }));

  return (
    <div className={styles["inventoryContainer"]}>
      <div style={{ padding: "0px 0 20px 0px" }}>
        <ProductPagination
          handleClickNext={fetchNextProducts}
          handleClickPrev={fetchPrevProducts}
          nextBtnActive={productListPagination.next === null ? true : false}
          prevBtnActive={productListPagination.prev === null ? true : false}
        />
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={listingsTableData}
        pagination={false}
      />
      <div style={{ padding: "20px 0 10px 0px" }}>
        <ProductPagination
          handleClickNext={fetchNextProducts}
          handleClickPrev={fetchPrevProducts}
          nextBtnActive={productListPagination.next === null ? true : false}
          prevBtnActive={productListPagination.prev === null ? true : false}
        />
      </div>
    </div>
  );
};

export default InventoryLog;
