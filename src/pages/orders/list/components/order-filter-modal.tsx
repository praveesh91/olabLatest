import { useState, FC, useEffect } from "react";
// import { Modal } from "react-bootstrap";
import listTagsService from "../../../../services/apis/products/list-tags.service";
import listGroupService from "../../../../services/apis/products/groups/list-groups.service";
import {
  IFilterParams,
  IGroupProps,
  IProductFilterProps,
} from "../../../../interfaces/IProducts";
import { Button, Modal, Form, Select, DatePicker, Badge } from "antd";
import type { DatePickerProps } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import "../OrderList.scss";
import listChannels from "../../../../services/apis/ecom/channels/list-channels.service";
const { Option } = Select;

const OrderFilter: FC<IProductFilterProps> = ({
  filterAction,
  filterCount,
}) => {
  const [form] = Form.useForm();

  const [tagList, setTagList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<any>();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getTagList = async () => {
    const { data } = await listTagsService({
      queryParams: {
        paginate: false,
      },
    });
    setTagList(data);
  };
  const getListGroup = async () => {
    const { data } = await listChannels();
    setChannelList(data);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({});
  };
  useEffect(() => {
    getTagList();
    getListGroup();
  }, []);

  const handleSubmit = () => {
    filterAction(filters);
    setIsModalVisible(false);
  };
  return (
    <div className={"orderFilter"}>
      <Badge count={filterCount}>
        <Button onClick={showModal} type="default" icon={<FilterOutlined />}>
          Filter
        </Button>
      </Badge>
      <Modal
        className={"orderFilter__modal"}
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Filters</div>
            <div>
              {" "}
              <a onClick={handleReset}>Reset All</a>
            </div>
          </div>
        }
        closable={false}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
          labelAlign="left"
          autoComplete="off">
          <Form.Item
            label="Channel"
            extra="Channel description"
            name="channelId">
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA: any, optionB: any) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onChange={(e: any) => setFilters({ ...filters, channelId: e })}>
              {channelList?.map((el: any, i: number) => (
                <Option key={i} value={el.id}>
                  {el.code}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Fulfilment"
            extra="Fulfilment description"
            name="fulfillment_status">
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA: any, optionB: any) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onChange={(e: any) =>
                setFilters({ ...filters, fulfillment_status: e })
              }>
              <Option key="PENDING" value="PENDING">
                PENDING
              </Option>
              <Option key="COMPLETE" value="COMPLETE">
                COMPLETE
              </Option>
              <Option key="PARTIAL" value="PARTIAL">
                PARTIAL
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Order Status"
            extra="Order Status description"
            name="order_status">
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA: any, optionB: any) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onChange={(e: any) =>
                setFilters({ ...filters, order_status: e })
              }>
              <Option key="OPEN" value="OPEN">
                OPEN
              </Option>
              <Option key="CLOSED" value="CLOSED">
                FULFILLED
              </Option>
              <Option key="CANCELLED" value="CANCELLED">
                CANCELLED
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Created After"
            extra="Created After description"
            name="order_created_range_after">
            <DatePicker
              onChange={(e: any) =>
                setFilters({
                  ...filters,
                  order_created_range_after: moment(e).format(),
                })
              }
            />
          </Form.Item>
          <Form.Item
            label="Created Before"
            extra="Created Before description"
            name="order_created_range_before">
            <DatePicker
              onChange={(e: any) =>
                setFilters({
                  ...filters,
                  order_created_range_before: moment(e).format(),
                })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderFilter;
