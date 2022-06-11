import { Col, Divider, Form, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { FC } from "react";
import { IProductTableProps } from "../../../../interfaces/IProducts";

const OrderItemsTable: FC<IProductTableProps> = ({ loading, list }) => {
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
      title: "Quantity",
      dataIndex: "quantity",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Fulfilled Quantity",
      dataIndex: "fulfilledQuantity",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Tax/Unit",
      dataIndex: "unit",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
  ];
  const tableData = list?.lines.map((el: any, index: number) => ({
    id: index + 1,
    product: el.product.name,
    quantity: el.quantity.slice(0, -5),
    price: el.pwot,
    fulfilledQuantity: el.fulfillable_quantity.slice(0, -5),
    discount: `${el.line_discount.slice(0, -5)} %`,
    unit: el.line_tax.slice(0, -5),
    tax: `${el.tax_rate.slice(0, -5)} %`,
    total: el.line_total.slice(0, -5),
  }));
  return (
    <div className={"orderTable"}>
      <Table
        dataSource={tableData}
        loading={loading}
        columns={columns}
        pagination={false}
      />
      <Row style={{ paddingTop: "10px" }}>
        <Col offset={20}>
          <Form
            labelCol={{ span: 18 }}
            wrapperCol={{ span: 6 }}
            labelAlign="left">
            <Form.Item label="Subtotal">
              {list?.subtotal.slice(0, -5)}
            </Form.Item>
            <Form.Item label="Total Discount">
              {list?.total_discount.slice(0, -5)}
            </Form.Item>
            <Form.Item label="Total Tax">
              {list?.total_tax.slice(0, -5)}
            </Form.Item>
            <Form.Item label="Total Shipping">
              {list?.total_shipping.slice(0, -5)}
            </Form.Item>
            <Divider />
            <Form.Item label="Total Amount">
              {list?.total_amount.slice(0, -5)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default OrderItemsTable;
