import React, { FC, useEffect, useState } from "react";
import styles from "../Details.module.scss";
import getProductStockLevels from "../../../../services/apis/products/get-stock-levels.service";

import { Table, Image } from "antd";

import {
  IStockLevelsProps,
  IStockLevelDetail,
  IParamTypes,
} from "../../../../interfaces/IProducts";
import moment from "moment";
import { useParams } from "react-router-dom";

const StockLevel: FC<IStockLevelsProps> = ({}) => {
  let { id } = useParams<IParamTypes>();
  const [loading, setLoading] = useState(false);

  const [stockLevels, setStockLevels] = useState<any>([]);

  const getAllProductStockLevels = async () => {
    setLoading(true);

    const { data } = await getProductStockLevels({
      queryParams: { paginate: "False", product: id },
    });
    setStockLevels(data);
    setLoading(false);
  };
  useEffect(() => {
    getAllProductStockLevels();
  }, []);
  const columns = [
    {
      title: "Product",
      dataIndex: "sku",
      key: "sku",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Warehouse",
      key: "warehouse",
      dataIndex: "warehouse",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "In Stock ",
      key: "instock",
      dataIndex: "instock",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },

    {
      title: "Booked ",
      key: "booked",
      dataIndex: "booked",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Available ",
      key: "available",
      dataIndex: "available",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    // {
    //   title: "Incoming",
    //   key: "incoming",
    //   dataIndex: "incoming",
    // },
    {
      title: "UOM",
      key: "uom",
      dataIndex: "uom",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Last Update",
      key: "updated",
      dataIndex: "updated",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
  ];
  const listingsTableData = stockLevels?.map((el: IStockLevelDetail) => ({
    image: el.product?.image_url,
    name: el.product?.name,
    sku: el.product?.sku,
    warehouse: el.warehouse?.code,
    incoming: el.incoming,
    available: el.available,
    instock: el.in_stock,
    booked: el?.booked?.slice(0, -5),
    uom: el.product?.uom,
    updated: moment(el.stock_update_time).format("DD MMM YYYY"),
  }));

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={listingsTableData}
        pagination={false}
      />
    </div>
  );
};

export default StockLevel;
