import {
  Button,
  Col,
  message,
  Row,
  Space,
  Typography,
  Form,
  Divider,
  Image,
  Input,
  Table,
  InputNumber,
  Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";
import "./Detail.scss";
import moment from "moment";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  SearchOutlined,
  CopyOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { IParamTypes } from "../../../interfaces/IProducts";
import getBundleDetail from "../../../services/apis/products/bundles/get-bundle-detail.service";
import BrowseProductModal from "../../../components/modals/browse-product-modal";
import addBundle from "../../../services/apis/products/bundles/add-bundle.services";
import _ from "lodash";

const { Title, Text } = Typography;
const BundleDetailsPage = () => {
  let { id } = useParams<IParamTypes>();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [bundleDetail, setBundleDetail] = useState<any>();

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      render: (text: string) => <a>{text + 1}</a>,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (text: any, record: any) => <Image src={text} width={60} />,
    },
    {
      title: "Components",
      dataIndex: "name",
    },
    {
      title: "Available",
      dataIndex: "available",
    },
    {
      title: "Quantity in Bundle",
      dataIndex: "quantity",
      render: (text: any, record: any) => (
        <InputNumber
          defaultValue={text}
          onChange={(e: any) => {
            let newArr = { ...bundleDetail };
            newArr.components[record.key]["quantity"] = e;
            setBundleDetail(newArr);
            setDirty(true);
          }}
        />
      ),
    },
    {
      title: "Bundles stock possible",
      dataIndex: "bundleStock",
    },
    {
      key: "key",
      dataIndex: "key",
      render: (text: any, record: any) => (
        <DeleteOutlined
          onClick={() =>
            setBundleDetail({
              ...bundleDetail,
              components: bundleDetail.components.filter(
                (el: any) => el.id !== record.id
              ),
            })
          }
        />
      ),
    },
  ];
  const getBundleDetails = async () => {
    try {
      setLoading(true);
      const { data } = await getBundleDetail(id);
      setBundleDetail({
        ...data,
        components: data.components.map((el: any) => ({
          ...el,
          quantity: parseInt(el.quantity),
        })),
      });
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong !");
    }
  };
  const handleUpdateBundle = async () => {
    const payload = {
      id: bundleDetail?.id,
      bundle_type: bundleDetail?.bundle_type,
      components: bundleDetail?.components.map((el: any) => ({
        component_id: el.component_id,
        quantity: el.quantity,
      })),
    };
    if (!payload.components.every((el: any) => el.quantity)) {
      message.error("Enter bundle quantity for all items");
      return;
    }
    try {
      setLoading(true);
      const { data } = await addBundle(bundleDetail?.id, payload);
      setLoading(false);
      message.success("Bundle updated succesfully");
      setDirty(false);
      history.push(`/${PAGE_PATHS.BUNDLE_DETAIL.replace(":id", data.id)}`);
    } catch (error) {
      setLoading(false);

      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBundleDetails();
  }, [location]);

  const handleGoBack = () => history.push(`/${PAGE_PATHS.BUNDLE_LIST}`);

  const handleDeleteBundle = async () => {
    const payload = {
      id: bundleDetail?.id,
      bundle_type: bundleDetail?.bundle_type,
      components: [],
    };
    try {
      const { data } = await addBundle(bundleDetail?.id, payload);
      message.success("Bundle components deleted succesfully");
      history.push(`/${PAGE_PATHS.BUNDLE_LIST}`);
    } catch (error) {
      setLoading(false);

      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const tableData = bundleDetail?.components?.map((obj: any, key: number) => ({
    key: key,
    id: obj.id,
    image: obj.component.image_url,
    name: obj.component.name,
    available: obj.component.available,
    quantity: obj.quantity,
    bundleStock: isFinite(
      Math.floor(
        (obj.component.available - obj.component.booked) / obj?.quantity
      )
    )
      ? Math.floor(
          (obj.component.available - obj.component.booked) / obj?.quantity
        )
      : 0 || 0,
  }));

  return (
    <div className="bundleDetailsContainer">
      <div className="bundleDetailsContainer__topNav">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                type="default"
                icon={<ArrowLeftOutlined style={{ verticalAlign: "0px" }} />}
                onClick={handleGoBack}></Button>
              <h5>{bundleDetail?.name}</h5>
            </Space>
          </Col>
          <Col>
            <Space>
              <Link
                to={{
                  pathname: `/${PAGE_PATHS.BUNDLE_NEW}`,
                  state: { from: "copy", ...bundleDetail },
                }}>
                <Button
                  type="text"
                  icon={<CopyOutlined style={{ verticalAlign: "0px" }} />}>
                  <span style={{ paddingLeft: "5px" }}>Copy</span>
                </Button>
              </Link>
              <Button
                onClick={handleDeleteBundle}
                type="text"
                icon={<DeleteOutlined style={{ verticalAlign: "0px" }} />}>
                <span style={{ paddingLeft: "5px" }}>Delete</span>
              </Button>
              <Button onClick={handleUpdateBundle} type="primary">
                {dirty && <ExclamationOutlined />}
                Save
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
      <div className="bundleDetailsContainer__content">
        <Skeleton loading={loading} paragraph={{ rows: 5 }}>
          <Row>
            <Col md={18}>
              <div className="bundleDetailsContainer__content__heading">
                <Title level={4}>Bundle Composition</Title>
                <Text type="secondary">
                  Detailed information about this bundle
                </Text>
              </div>
              <Col md={16}>
                <Form
                  name="basic"
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 14 }}>
                  <Form.Item label="Bundle Product">
                    {bundleDetail?.name}
                  </Form.Item>
                  <Form.Item label="Bundle Stock Availble">
                    {bundleDetail?.available}
                  </Form.Item>
                </Form>
              </Col>
            </Col>
            <Col md={6}>
              <div className="bundleDetailsContainer__content__dates">
                <Space>
                  <div>Created on: </div>
                  <div>
                    {" "}
                    {moment(bundleDetail?.created).format("MMMM Do YYYY, h:mm")}
                  </div>
                </Space>
                <Space>
                  <div>Updated on:</div>
                  <div>
                    {moment(bundleDetail?.updated).format("MMMM Do YYYY, h:mm")}
                  </div>
                </Space>
              </div>
              <div className="bundleDetailsContainer__content__image">
                <Image width={150} src={bundleDetail?.image_url} />
              </div>
            </Col>
          </Row>
        </Skeleton>
        <Divider />
        <Row align="middle" justify="space-between">
          <Col md={9}>
            <BrowseProductModal
              onAddProducts={(newComponents: any) => {
                let formatedComponent = newComponents.map((el: any) => ({
                  id: el.id,
                  component_id: el.id,
                  component: {
                    available: el.available,
                    name: el.name,
                    image_url: el.image_url,
                    booked: el.booked,
                  },
                }));
                setDirty(true);
                setBundleDetail({
                  ...bundleDetail,
                  components: [
                    ...bundleDetail.components,
                    ...formatedComponent,
                  ],
                });
              }}
              warehouseId={-1}
            />
          </Col>
          <Col md={4}>
            <div className="bundleDetailsContainer__content__qty">
              <Text type="warning">
                Total Qty :
                {bundleDetail?.components
                  .map((obj: any) =>
                    obj.quantity ? parseInt(obj.quantity) : 0
                  )
                  .reduce((accum: number, e: any) => accum + e, 0) || 0}
              </Text>
            </div>
          </Col>
        </Row>
        <Row className="bundleDetailsContainer__content__table">
          <Col md={24}>
            <Table
              dataSource={tableData}
              columns={columns}
              pagination={false}
              loading={loading}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BundleDetailsPage;
