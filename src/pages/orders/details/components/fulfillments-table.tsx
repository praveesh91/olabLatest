import { Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { FC } from "react";
import { IProductTableProps } from "../../../../interfaces/IProducts";

const FulfillmentsTable: FC<IProductTableProps> = ({
  hasSelectedPdt,
  list,
  loading,
}) => {
  const columns: ColumnsType<any> = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Warehouse",
      dataIndex: "warehouse",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      dataIndex: "property",
      key: "id",
      render: (text: any, record: any) => (
        <div>
          {text ? (
            <Tag color="green">Bundle</Tag>
          ) : (
            <Tag color="blue">Component</Tag>
          )}
        </div>
      ),
    },
  ];

  const tableData = list?.fulfillment_lines.map((el: any, index: number) => ({
    id: index + 1,
    product: el.product.name,
    quantity: el.quantity.slice(0, -5),
    warehouse: el.warehouse.name,
    property: el.is_bundle,
  }));

  return (
    <div>
      <Table
        dataSource={tableData}
        loading={loading}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default FulfillmentsTable;
