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
import "../ProductList.scss";
const { Option } = Select;

const StockLocationProductFilter: FC<IProductFilterProps> = ({
  filterAction,
}) => {
  const [form] = Form.useForm();

  const [tagList, setTagList] = useState([]);
  const [groupList, setGroupList] = useState([]);
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
    const { data } = await listGroupService({
      queryParams: {
        paginate: false,
      },
    });
    setGroupList(data);
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
    <div className={"productFilter"}>
      <Button onClick={showModal} type="default" icon={<FilterOutlined />}>
        Filter
      </Button>
      <Modal
        className={"productFilter__modal"}
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
        </Form>
      </Modal>
    </div>
  );
};

export default StockLocationProductFilter;
