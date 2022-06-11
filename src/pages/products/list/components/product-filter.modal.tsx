import { useState, FC, useEffect } from "react";
// import { Modal } from "react-bootstrap";
import listTagsService from "../../../../services/apis/products/list-tags.service";
import listGroupService from "../../../../services/apis/products/groups/list-groups.service";
import listChannelsService from "../../../../services/apis/products/get-channels.service";
import { Typeahead } from "react-bootstrap-typeahead";
import listBundlesService from "../../../../services/apis/products/bundles/list-bundles.service";
import {
  IFilterParams,
  IGroupProps,
  IProductFilterProps,
} from "../../../../interfaces/IProducts";
import { getQueryParamsFromUrl } from "../../../../services/get-values.service";
import {
  Menu,
  Dropdown,
  Button,
  Space,
  Radio,
  Modal,
  Form,
  Input,
  Select,
  Switch,
} from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import styles from "../List.module.scss";
const { Option } = Select;

const ProductFilter: FC<IProductFilterProps> = ({ filterAction }) => {
  const [form] = Form.useForm();

  const [show, setShow] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [bundleList, setBundleList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [channelsList, setChannelsList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<any>();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdateFilter = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
    const { data } = await listGroupService({
      queryParams: {
        paginate: false,
      },
    });
    setGroupList(data);
  };
  const getChannels = async () => {
    const { data } = await listChannelsService({
      queryParams: {
        paginate: false,
      },
    });
    setChannelsList(data);
  };
  const getBundleList = async () => {
    const { data } = await listBundlesService({
      queryParams: {
        paginate: false,
      },
    });
    setBundleList(data);
  };
  const handleReset = () => {
    form.resetFields();
    setFilters({});
  };
  useEffect(() => {
    getTagList();
    getBundleList();
    getListGroup();
    getChannels();
  }, []);

  const handleSubmit = () => {
    Object.keys(filters).forEach((key) => {
      if (filters[key].length === 0) {
        delete filters[key];
      }
    });
    filterAction(filters);
    setIsModalVisible(false);
    form.resetFields();
    setFilters({});
  };
  return (
    <div className={styles["productFilter"]}>
      <Button onClick={showModal} type="default" icon={<FilterOutlined />}>
        Filter
      </Button>
      <Modal
        className={styles["productFilter__modal"]}
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Filters</div>
            <Space>
              {" "}
              {/* <a onClick={handleReset}>Reset All</a> */}
              <Button type="text" onClick={handleReset}>
                Reset All
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Space>
          </div>
        }
        closable={false}
        visible={isModalVisible}
        footer={false}>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
          labelAlign="left"
          autoComplete="off">
          <Form.Item
            label="Category"
            extra="Category description"
            name="group1">
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
              onChange={(e: any) => setFilters({ ...filters, group1: e })}>
              {groupList?.map((el: any, i: number) => (
                <Option key={i} value={el.id}>
                  {el.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Tags" extra="Tags description" name="tags">
            <Select
              showSearch
              mode="tags"
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA: any, optionB: any) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onChange={(e: any) => setFilters({ ...filters, tags: [...e] })}>
              {tagList?.map((el: any, i: number) => (
                <Option key={i} value={el.name}>
                  {el.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Linked with channel"
            extra="Linked with channel description"
            name="channel">
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
              onChange={(e: any) => setFilters({ ...filters, channel: e })}>
              {channelsList?.map((el: any, i: number) => (
                <Option key={i} value={el.id}>
                  {`${el.code} ${el.name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Not Linked with channel"
            extra="Not Linked with channel description"
            name="channel_exclude">
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
                setFilters({ ...filters, channel_exclude: e })
              }>
              {channelsList?.map((el: any, i: number) => (
                <Option key={i} value={el.id}>
                  {`${el.code} ${el.name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            label="Bundle SKU"
            extra="Bundle SKU description"
            name="supplier_sku">
            <Input />
          </Form.Item> */}
          <Form.Item
            label="Below Threshold"
            name="is_below_threshold"
            extra="Below Threshold description">
            <Radio.Group
              name="is_below_threshold"
              className={styles["productFilter__modal__group1"]}>
              <Radio.Button
                onClick={handleUpdateFilter}
                value={""}
                checked={filters?.is_below_threshold === ""}>
                All
              </Radio.Button>
              <Radio.Button
                onClick={handleUpdateFilter}
                value={"True"}
                checked={filters?.is_below_threshold === "True"}>
                Yes
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="has_links"
            label="Has Online Listing"
            extra="Has Online Listing description">
            <Radio.Group
              name="has_links"
              className={styles["productFilter__modal__group2"]}>
              <Radio.Button
                checked={filters?.has_links === ""}
                onClick={handleUpdateFilter}
                value={""}>
                All
              </Radio.Button>
              <Radio.Button
                checked={filters?.has_links === "True"}
                onClick={handleUpdateFilter}
                value={"True"}>
                Yes
              </Radio.Button>
              <Radio.Button
                checked={filters?.has_links === "False"}
                onClick={handleUpdateFilter}
                value={"False"}>
                No
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductFilter;
