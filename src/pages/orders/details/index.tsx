import {
  Button,
  Col,
  Form,
  message,
  Row,
  Skeleton,
  Tabs,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  ReloadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./OrderDetails.scss";
import { useHistory, useParams } from "react-router-dom";
import { IParamTypes } from "../../../interfaces/IProducts";
import getOrderDetail from "../../../services/apis/ecom/orders/get-order-details";
import OrderItemsTable from "./components/order-items-table";
import FulfillmentsTable from "./components/fulfillments-table";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import syncOrders from "../../../services/apis/ecom/orders/sync-orders";
import archiveOrders from "../../../services/apis/ecom/orders/archive-orders";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const OrderDetails = () => {
  const history = useHistory();
  let { id } = useParams<IParamTypes>();
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any>();

  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await getOrderDetail(id);
      setOrderDetail(data);
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong !");
    }
  };
  useEffect(() => {
    getOrderDetails();
  }, []);

  const handleGoBack = () => {
    history.push(`/${PAGE_PATHS.ORDER_LIST}`);
  };

  const handleSync = async (id: string, order: string) => {
    try {
      const key = "updatable";
      const res = await syncOrders(id);
      message.loading({ content: "Refreshing in progress.....", key });
      setTimeout(() => {
        message.success({
          content: `Order #${order} will be refreshed in a few seconds`,
          key,
          duration: 2,
        });
      }, 2000);
    } catch (error) {
      message.error("Something went wrong");
    } finally {
    }
  };

  const handleArchive = async (id: [string]) => {
    try {
      const key = "updatable";
      const res = await archiveOrders(id);
      message.loading({ content: "Archiving in progress.....", key });
      setTimeout(() => {
        message.success({
          content: "Order archived successfully!",
          key,
          duration: 2,
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    } finally {
    }
  };

  return (
    <div>
      {" "}
      <div className={"orderDetailsContainer"}>
        <div className={"orderDetailsContainer__topNav"}>
          <Row justify="space-between" align="middle">
            <Col>
              <div className="orderDetailsContainer__topNav__name">
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleGoBack}></Button>
                <Title level={4}>{`Order`}</Title>
                {loading ? (
                  <Skeleton.Input active />
                ) : (
                  <Title level={5}>{`#${orderDetail?.order_number}`}</Title>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <Row gutter={16}>
          <Col md={15}>
            <div className={"orderDetailsContainer__detail"}>
              <Skeleton loading={loading}>
                <div className={"orderDetailsContainer__detail__head"}>
                  <Title level={5}>Order Details</Title>
                  <Text type="secondary">Provides order related details</Text>
                </div>
                <Row gutter={16}>
                  <Col md={12}>
                    <Form
                      labelCol={{ span: 12 }}
                      wrapperCol={{ span: 12 }}
                      labelAlign="left">
                      <Form.Item label="Order Date">
                        {moment(orderDetail?.order_created).format(
                          "DD/MM/YYYY, h:mm A"
                        )}
                      </Form.Item>
                      <Form.Item label="Order No.">
                        {orderDetail?.order_number}
                      </Form.Item>
                      <Form.Item label="Order Id">
                        {orderDetail?.order_id}
                      </Form.Item>
                      <Form.Item label="Country">
                        {orderDetail?.country}
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col md={12}>
                    <Form
                      labelCol={{ span: 12 }}
                      wrapperCol={{ span: 12 }}
                      labelAlign="left">
                      <Form.Item label="Currency">
                        {orderDetail?.currency}
                      </Form.Item>
                      <Form.Item label="Total Fee">
                        {orderDetail?.total_fee.slice(0, -5)}
                      </Form.Item>
                      <Form.Item label="Refund Ids">
                        {orderDetail?.refund_ids}
                      </Form.Item>
                      <Form.Item label="Fulfillment Status">
                        <Tag color={"green"}>
                          {orderDetail?.fulfillment_status}
                        </Tag>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </Skeleton>
            </div>
          </Col>
          <Col md={9}>
            <div className={"orderDetailsContainer__controls"}>
              <Skeleton loading={loading}>
                <div className={"orderDetailsContainer__controls__sections"}>
                  <Row gutter={16} align="middle">
                    <Col md={16}>
                      <Title level={5}>Archive</Title>
                      <Text type="secondary">
                        Archive related explanation text goes here....
                      </Text>
                    </Col>
                    <Col md={8}>
                      <Button
                        onClick={() => handleArchive([id])}
                        icon={<SaveOutlined />}>
                        Archive
                      </Button>
                    </Col>
                  </Row>
                </div>
                <div className={"orderDetailsContainer__controls__sections"}>
                  <Row gutter={16} align="middle">
                    <Col md={16}>
                      <Title level={5}>Refresh</Title>
                      <Text type="secondary">
                        Refresh related explanation text goes here....
                      </Text>
                    </Col>
                    <Col md={8}>
                      <Button
                        onClick={() => handleSync(id, orderDetail.order_number)}
                        icon={<ReloadOutlined />}>
                        Refresh
                      </Button>
                    </Col>
                  </Row>
                </div>
                <div className={"orderDetailsContainer__controls__sections"}>
                  <Row gutter={16} align="middle">
                    <Col md={16}>
                      <Title level={5}>View order</Title>
                      <Text type="secondary">
                        Order related explanation text goes here....
                      </Text>
                    </Col>
                    <Col md={8}>
                      <Button>View order</Button>
                    </Col>
                  </Row>
                </div>
              </Skeleton>
            </div>
          </Col>
        </Row>
        <div className={"orderDetailsContainer__content"}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Order Items" key="1">
              <OrderItemsTable
                loading={loading}
                list={orderDetail}
                hasSelectedPdt={(e: any) => console.log(e)}
              />
            </TabPane>
            {/* <TabPane tab="Fulfillments" key="2">
              <FulfillmentsTable
                loading={loading}
                list={orderDetail}
                hasSelectedPdt={(e: any) => console.log(e)}
              />
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
