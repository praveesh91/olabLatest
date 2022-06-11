import { useEffect, useState } from "react";
import { FC } from "React";
import { Image, Table, Typography, Tag, message, Tooltip, Popover } from "antd";
import { ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import syncInventory from "../../../../services/apis/products/sync-inventory-product.service";

import styles from "../List.module.scss";
import {
  IProductDetail,
  IProductTableProps,
} from "../../../../interfaces/IProducts";
import { Link, useHistory } from "react-router-dom";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import type { ColumnsType } from "antd/lib/table";
const { Text, Title } = Typography;
const productDetails: IProductDetail[] = ([] = [
  {
    id: 0,
    in_stock: 0,
    available: 0,
    image_url: "",
    name: "",
    booked: "",
    alert_threshold: "",
    updated: "",
    created: "",
    grade: "",
    sku: "",
    client: "",
    uom: "",
  },
]);

const ProductListTable: FC<IProductTableProps> = ({
  list,
  loading,
  hasSelectedPdt,
}) => {
  const history = useHistory();
  const [selectedPdts, setSelectedPdts] =
    useState<IProductDetail[]>(productDetails);
  const [allproducts, setAllProducts] = useState(list);
  const [syncLoader, setSyncLoader] = useState({ id: "", loading: false });
  const [selectedRowKeys, setselectedRowKeys] = useState<any>([]);

  useEffect(() => {
    setAllProducts(list);
    // setSelectedPdts([]);
  }, [list]);
  useEffect(() => {
    setSelectedPdts(productDetails);
    setselectedRowKeys([]);
  }, [loading]);

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
      key: "id",
      dataIndex: "name",
      width: 300,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {" "}
          <Text strong>
            <Link
              to={"/" + PAGE_PATHS.PRODUCT_DETAIL.replace(":id", record?.id)}>
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
      title: "Online Listings",
      key: "id",
      dataIndex: "listings",
      width: 80,

      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>
          {text}
          <Tooltip placement="topLeft" title="Go to online listings table">
            <Link
              to={`/${PAGE_PATHS.PRODUCT_LISTING.replace(":id", record.id)}`}>
              <InfoCircleOutlined style={{ paddingLeft: "10px" }} />
            </Link>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Category",
      key: "id",
      dataIndex: "category",
      width: 90,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Notes",
      width: 150,
    },
    {
      title: "Alert Threshold",
      key: "id",
      dataIndex: "alert",
      width: 100,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Properties",
      key: "id",
      dataIndex: "properties",
      width: 110,
      render: (text: any, record: any) => (
        <>
          <div className={styles["productTable__tags"]}>
            {record.properties.archieved && <Tag color="success">Archived</Tag>}
          </div>
          <div className={styles["productTable__tags"]}>
            {!record.properties.synched && (
              <Tag color="processing">Not synced</Tag>
            )}
          </div>
          <div className={styles["productTable__tags"]}>
            {record.properties.bundle_type === "BUNDLED" && (
              <Tag color="warning">Bundled</Tag>
            )}
          </div>
        </>
      ),
    },
    {
      key: "id",
      dataIndex: "id",
      render: (text: any, record: any) => (
        <Popover content="Sync">
          <ReloadOutlined
            className={
              syncLoader.loading && syncLoader.id == text
                ? styles["productTable__syncLoading"]
                : styles["productTable__syncLoaded"]
            }
            onClick={() => {
              handleSync(text);
            }}
          />
        </Popover>
      ),
    },
  ];
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setselectedRowKeys(selectedRowKeys);
      setSelectedPdts(selectedRows);
      hasSelectedPdt(selectedRows);
    },
  };

  const productListTableData = allproducts.map(
    (el: IProductDetail, id: number) => ({
      key: id,
      image: el.image_url,
      name: el.name,
      sku: el.sku,
      alert: el.alert_threshold?.slice(0, -5),
      instock: el.in_stock,
      category: el.group1?.name,
      booked: el?.booked?.slice(0, -5),
      id: el.id,
      properties: {
        bundle_type: el.bundle_type,
        synched: el.tracking_type == 2 ? true : false,
        archieved: el.is_archived,
      },
      listings: el.count_links,
      available: el.available,
      incoming: el.incoming?.slice(0, -5),
    })
  );

  const handleSync = async (id: string) => {
    try {
      setSyncLoader({ ...syncLoader, id: id, loading: true });
      const res = await syncInventory(id);
      message.success("Product synced successfully");
      setSyncLoader({ ...syncLoader, id: id, loading: false });
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setSyncLoader({ ...syncLoader, id: id, loading: false });
    }
  };

  return (
    <>
      <div className={styles["productTable"]}>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          loading={loading}
          pagination={false}
          dataSource={productListTableData}
          scroll={{ x: 1300 }}
        />
      </div>
    </>
  );
};

export default ProductListTable;
