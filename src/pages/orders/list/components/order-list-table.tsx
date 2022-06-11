import { useEffect, useState } from "react";
import { FC } from "React";
import {
  Image,
  Table,
  Typography,
  Tag,
  message,
  Tooltip,
  Popover,
  Avatar,
} from "antd";
import { ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import syncInventory from "../../../../services/apis/products/sync-inventory-product.service";
import moment from "moment";
import "../OrderList.scss";
import {
  IProductDetail,
  IProductTableProps,
} from "../../../../interfaces/IProducts";
import { Link, useHistory } from "react-router-dom";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import type { ColumnsType } from "antd/lib/table";
import syncOrders from "../../../../services/apis/ecom/orders/sync-orders";
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

const OrderListTable: FC<IProductTableProps> = ({
  list,
  loading,
  hasSelectedPdt,
}) => {
  const history = useHistory();
  const [selectedPdts, setSelectedPdts] =
    useState<IProductDetail[]>(productDetails);
  const [allOrders, setAllOrders] = useState(list);
  const [syncLoader, setSyncLoader] = useState({ id: "", loading: false });
  const [selectedRowKeys, setselectedRowKeys] = useState<any>([]);

  useEffect(() => {
    setAllOrders(list);
    // setSelectedPdts([]);
  }, [list]);
  useEffect(() => {
    setSelectedPdts(productDetails);
    setselectedRowKeys([]);
  }, [loading]);

  const columns: ColumnsType<any> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Order No",
      dataIndex: "order",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {" "}
          <Text strong>
            <Link
              to={"/" + PAGE_PATHS.ORDER_DETAIL.replace(":id", record?.id.id)}>
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
      title: "Channel",
      dataIndex: "channel",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {text.name === "SHOPIFY" && (
            <Avatar src="https://joeschmoe.io/api/v1/random" />
          )}{" "}
          {text.name} {text.code}
        </div>
      ),
    },
    {
      title: "Order Status",
      key: "id",
      dataIndex: "status",
      render: (text: any, record: any) => (
        <>
          <div className={"orderTable__tags"}>
            {text === "CLOSED" && <Tag color="green">CLOSED</Tag>}
            {text === "OPEN" && <Tag color="orange">OPEN</Tag>}
          </div>
        </>
      ),
    },
    {
      title: "Fullfilment Status",
      dataIndex: "fullfilment",
      key: "id",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {" "}
          {text === "COMPLETE" && <Tag color="green">COMPLETE</Tag>}
          {text === "PENDING" && <Tag color="orange">PENDING</Tag>}
        </div>
      ),
    },
    {
      title: "Total",
      key: "id",
      dataIndex: "total",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },

    // {
    //   title: "Resync",
    //   key: "id",
    //   dataIndex: "id",
    //   render: (text: any, record: any) => (
    //     <Popover content="Sync">
    //       <div style={{ textAlign: "end" }}>
    //         <ReloadOutlined
    //           className={
    //             syncLoader.loading && syncLoader.id == text.id
    //               ? "orderTable__syncLoading"
    //               : "orderTable__syncLoaded"
    //           }
    //           onClick={() => handleSync(text.id, text.orderNumber)}
    //         />
    //       </div>
    //     </Popover>
    //   ),
    // },
  ];
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setselectedRowKeys(selectedRowKeys);
      setSelectedPdts(selectedRows);
      hasSelectedPdt(selectedRows);
    },
  };

  const OrderListTableData = allOrders?.map((el: any, id: number) => ({
    key: id,
    id: { id: el.id, orderNumber: el.order_number },
    date: moment(el.created).format("DD/MM/YYYY, h:mm"),
    order: el.order_number,
    channel: {
      code: el.channel?.code,
      name: el.channel?.name,
    },
    status: el.order_status,
    total: el.subtotal.slice(0, -5),
    fullfilment: el.fulfillment_status,
  }));

  const handleSync = async (id: string, order: string) => {
    try {
      setSyncLoader({ ...syncLoader, id: id, loading: true });
      const res = await syncOrders(id);
      message.success(`Order #${order} will be refreshed in a few seconds`);
      setSyncLoader({ ...syncLoader, id: id, loading: false });
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setSyncLoader({ ...syncLoader, id: id, loading: false });
    }
  };

  return (
    <>
      <div className={"orderTable"}>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          loading={loading}
          pagination={false}
          dataSource={OrderListTableData}
        />
      </div>
    </>
  );
};

export default OrderListTable;
