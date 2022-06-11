import { Image, Popover, Table, Typography } from "antd";
import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";

const { Text } = Typography;
interface IBundleListTableProps {
  allBundles: any;
  tableLoader: boolean;
  hasSelectedBundles: any;
}
const BundleListTable: FC<IBundleListTableProps> = ({
  allBundles,
  tableLoader,
  hasSelectedBundles,
}) => {
  const [selectedRowKeys, setselectedRowKeys] = useState<any>([]);

  useEffect(() => {
    setselectedRowKeys([]);
  }, [tableLoader]);
  const columns = [
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
      key: "id",
      dataIndex: "name",
      // width: 200,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {" "}
          <Text strong>
            <Link
              to={"/" + PAGE_PATHS.BUNDLE_DETAIL.replace(":id", record?.id)}>
              {text}
            </Link>
          </Text>
          <div>
            <Text type="secondary">{record?.sku}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Bundle Composition",
      dataIndex: "composition",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {text.components.slice(0, 2).map((el: any, id: number) => (
            <div
              key={id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "5px",
              }}>
              {" "}
              <Text>{`${el.quantity.slice(0, -5)} * ${
                el.component.name
              }`}</Text>
              <Text type="warning">{`(${el.component.in_stock.slice(
                0,
                -5
              )}  left)`}</Text>
            </div>
          ))}
          <div>
            <Popover
              content={text.components.slice(2).map((el: any, id: number) => (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "10px",
                    gap: "30px",
                  }}>
                  {" "}
                  <Text>{`${el.quantity.slice(0, -5)} * ${
                    el.component.name
                  }`}</Text>
                  <Text type="warning">{`(${el.component.in_stock.slice(
                    0,
                    -5
                  )} left)`}</Text>
                </div>
              ))}>
              {text.components.length > 2 && (
                <a>{`${text.components.length - 2} more products`}</a>
              )}
            </Popover>
          </div>
        </div>
      ),
    },

    {
      title: "Available Inventory",
      dataIndex: "available",
      key: "id",
      // width: 50,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
  ];
  const bundleData = allBundles.map((el: any, id: number) => ({
    key: id,
    image: el.image_url,
    name: el.name,
    sku: el.sku,
    composition: { components: el.components },
    instock: el.in_stock,
    booked: el?.booked?.slice(0, -5),
    id: el.id,
    available: el.available,
  }));
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setselectedRowKeys(selectedRowKeys);
      hasSelectedBundles(selectedRows);
    },
  };
  return (
    <div>
      <Table
        loading={tableLoader}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={bundleData}
        pagination={false}
      />
    </div>
  );
};

export default BundleListTable;
