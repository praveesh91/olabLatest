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
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  SearchOutlined,
  CopyOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { IParamTypes } from "../../../../interfaces/IProducts";
import getBundleDetail from "../../../../services/apis/products/bundles/get-bundle-detail.service";
import SearchInput from "../../../../components/inputs/search-input";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";
import "../../details/Detail.scss";
import BrowseProductModal from "../../../../components/modals/browse-product-modal";
import addBundle from "../../../../services/apis/products/bundles/add-bundle.services";

const { Title, Text } = Typography;
const { Search } = Input;
interface IStateProps {
  bundleDetails: any;
}
interface ILocationProps {
  state: IStateProps;
  pathname: any;
}
interface stateType {
  components: any;
  name: string;
  id: string;
  bundle_type: string;
  from: string;
}

const AddBundle = () => {
  const [form] = Form.useForm();

  const { state } = useLocation<stateType>();
  const history = useHistory();
  const location = useLocation<ILocationProps>();
  const [selectedBundle, setSelectedBundle] = useState<any>([]);
  const [selectedComponents, setSelectedComponents] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (state?.from === "copy") {
      setSelectedComponents(
        state.components?.map((el: any, index: number) => ({
          name: el.component.name,
          id: el.component.id,
          key: index,
          available: el.component.available,
          quantity: parseInt(el.quantity),
          image_url: el.component.image_url,
          bundleStock:
            Math.floor(
              (el.component.available - el.component.booked) / el?.quantity
            ) || 0,
        }))
      );
    }
  }, []);

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
          min={0}
          defaultValue={text}
          onChange={(e: any) => {
            let newArr = [...selectedComponents];
            newArr[record.key]["quantity"] = e;
            setSelectedComponents(newArr);
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
            setSelectedComponents(
              selectedComponents.filter((el: any) => el.id !== record.id)
            )
          }
        />
      ),
    },
  ];
  const tableData = selectedComponents.map((el: any, index: number) => ({
    name: el.name,
    id: el.id,
    key: index,
    available: el.available,
    quantity: el.quantity,
    image: el.image_url,
    bundleStock: isFinite(Math.floor((el.available - el.booked) / el?.quantity))
      ? Math.floor((el.available - el.booked) / el?.quantity)
      : 0 || 0,
  }));

  const handleSubmit = async () => {
    const payload = {
      id: selectedBundle[0]?.id || state.id,
      bundle_type: selectedBundle[0]?.bundle_type || state.bundle_type,
      components: selectedComponents.map((el: any) => ({
        component_id: el.id,
        quantity: el.quantity,
      })),
    };
    if (!payload.components.every((el: any) => el.quantity)) {
      message.error("Enter bundle quantity for all items");
      return;
    }
    try {
      setLoading(true);
      const { data } = await addBundle(
        selectedBundle[0]?.id || state.id,
        payload
      );
      setLoading(false);

      message.success("Bundle added succesfully");
      history.push(`/${PAGE_PATHS.BUNDLE_DETAIL.replace(":id", data.id)}`);
    } catch (error) {
      setLoading(false);

      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleGoBack = () => history.push(`/${PAGE_PATHS.BUNDLE_LIST}`);

  return (
    <div className="bundleDetailsContainer">
      <div className="bundleDetailsContainer__topNav">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                onClick={handleGoBack}
                type="default"
                icon={
                  <ArrowLeftOutlined style={{ verticalAlign: "0px" }} />
                }></Button>
              <h5>Add Bundle</h5>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                onClick={handleSubmit}
                // disabled
                type="primary">
                Save
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
      <div className="bundleDetailsContainer__content">
        <Spin spinning={loading}>
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
                  <Form.Item label="Bundle Product" name={"bundleName"}>
                    <SearchInput
                      defaultVal={state?.name}
                      searchFrom="bundleFilter"
                      extraParams={{
                        tracking_type: 2,
                        limit: 25,
                        bundle_type: "BUNDLE",
                      }}
                      url={`${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PRODUCTS}`}
                      handleGetArrRes={(e: any) => setSelectedBundle(e)}
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Col>
            <Col md={6}>
              {/* <div className="bundleDetailsContainer__content__dates">
                <Space>
                  <div>Created on: </div>
                  <div>
                    {" "}
                    {moment(selectedBundle[0]?.created).format(
                      "MMMM Do YYYY, h:mm"
                    )}
                  </div>
                </Space>
                <Space>
                  <div>Updated on:</div>
                  <div>
                    {moment(selectedBundle[0]?.updated).format(
                      "MMMM Do YYYY, h:mm"
                    )}
                  </div>
                </Space>
              </div> */}
              <div className="bundleDetailsContainer__content__image">
                <Image width={150} src={selectedBundle[0]?.image_url} />
              </div>
            </Col>
          </Row>
          <Divider />
          <Row align="middle" justify="space-between">
            <Col md={9}>
              <BrowseProductModal
                onAddProducts={(components: any) => {
                  setSelectedComponents((prevState: any) => [
                    ...prevState,
                    ...components,
                  ]);
                }}
                warehouseId={-1}
              />
            </Col>

            <Col md={4}>
              <div className="bundleDetailsContainer__content__qty">
                <Text type="warning">
                  Total Qty :{" "}
                  {Math.round(
                    selectedComponents
                      .map((obj: any) => (obj.quantity ? obj.quantity : 0))
                      .reduce((accum: number, e: any) => accum + e, 0)
                  ) || 0}
                </Text>
              </div>
            </Col>
          </Row>
          <Row className="bundleDetailsContainer__content__table">
            <Col md={24}>
              <Table
                pagination={false}
                dataSource={tableData}
                columns={columns}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default AddBundle;
