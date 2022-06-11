import { useEffect, useState } from "react";
import { FC } from "React";
import moment from "moment";
import { Image, Table, Typography, Tag, message, Tooltip } from "antd";
import { ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import syncInventory from "../../../../services/apis/products/sync-inventory-product.service";

import "../ProductList.scss";
import {
  IProductDetail,
  IProductTableProps,
} from "../../../../interfaces/IProducts";
import { Link, useHistory } from "react-router-dom";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import type { ColumnsType } from "antd/lib/table";
const { Text, Title } = Typography;

const StockLocationListTable: FC<IProductTableProps> = ({ list, loading }) => {
  const columns: ColumnsType<any> = [
    {
      title: "Image",
      dataIndex: "image",
      key: "id",
      width: 80,
      render: (text: any, record: any) => (
        <Image width={60} src={text} fallback={"/images/fallback.png"} />
      ),
    },
    {
      title: "Name / SKU",
      dataIndex: "pdtName",
      key: "id",
      width: 150,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {" "}
          <Text strong>{text?.name}</Text>
          <div>
            <Text type="secondary">{text?.sku}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Warehouse",
      dataIndex: "name",
      key: "id",
      width: 150,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "In Stock",
      dataIndex: "instock",
      key: "id",
      width: 90,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Booked",
      dataIndex: "booked",
      key: "id",
      width: 80,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "id",
      width: 90,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Incoming",
      key: "id",
      dataIndex: "incoming",
      width: 90,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },

    {
      title: "UOM",
      key: "id",
      dataIndex: "uom",
      width: 70,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },

    {
      title: "Last Updated",
      key: "id",
      dataIndex: "updated",
      width: 130,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
  ];

  const stockLocationTableData = list?.map((el: any, id: number) => ({
    key: id,
    pdtName: { name: el.product.name, sku: el.product.sku },
    image: el.product.image_url,
    name: el.warehouse.name,
    sku: el.sku,
    instock: el.in_stock,
    category: el.group1?.name,
    booked: el?.booked?.slice(0, -5),
    id: el.id,
    uom: el.product.uom,
    available: el.available,
    updated: moment(el.updated).format("DD/MM/YYYY LT"),
    incoming: el.incoming?.slice(0, -5),
  }));

  return (
    <>
      <div>
        <Table
          columns={columns}
          loading={loading}
          pagination={false}
          dataSource={stockLocationTableData}
        />
      </div>
    </>
  );
};

export default StockLocationListTable;
