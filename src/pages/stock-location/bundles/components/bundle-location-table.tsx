import { useEffect, useState } from "react";
import { FC } from "React";
import moment from "moment";
import {
  Image,
  Table,
  Typography,
  Tag,
  message,
  Tooltip,
  Space,
  Popover,
} from "antd";
import { ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import syncInventory from "../../../../services/apis/products/sync-inventory-product.service";

import "../BundleList.scss";
import {
  IProductDetail,
  IProductTableProps,
} from "../../../../interfaces/IProducts";
import { Link, useHistory } from "react-router-dom";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import type { ColumnsType } from "antd/lib/table";
const { Text, Title } = Typography;

const BundleLocationTable: FC<IProductTableProps> = ({ list, loading }) => {
  const columns: ColumnsType<any> = [
    {
      title: "Image",
      dataIndex: "image",
      key: "id",
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
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "In Stock",
      dataIndex: "instock",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Booked",
      dataIndex: "booked",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },

    {
      title: "Component Stock",
      key: "id",
      dataIndex: "components",
      render: (text: any, record: any) => (
        <div>
          {record.components.slice(0, 3)?.map((el: any) => (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "8px",
                }}>
                <div>{el.product.name}</div>
                <div>{`${el.in_stock} pcs`}</div>
              </div>
            </div>
          ))}
          <div>
            <Popover
              content={record?.components
                ?.slice(2)
                .map((el: any, id: number) => (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "10px",
                      gap: "30px",
                    }}>
                    {" "}
                    <Text>{`${el.product.name}`}</Text>
                    <Text type="warning">{`(${el.in_stock} pcs)`}</Text>
                  </div>
                ))}>
              {record?.components?.length > 3 && (
                <Link to="/">{`${
                  record.components.length - 3
                } more products`}</Link>
              )}
            </Popover>
          </div>
        </div>
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
    available: el.available,
    components: el.components,
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

export default BundleLocationTable;
