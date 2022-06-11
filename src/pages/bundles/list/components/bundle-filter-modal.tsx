import { Button, Form, Modal, Select } from "antd";
import styles from "../List.module.scss";
import React, { FC, useEffect, useState } from "react";
import listGroupService from "../../../../services/apis/products/groups/list-groups.service";

import {
  DownOutlined,
  RightOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  LeftOutlined,
  SearchOutlined,
  FilterOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import SearchInput from "../../../../components/inputs/search-input";
import { BACKEND_API_PATHS } from "../../../../utils/constants/backend-api-path.constants";
import { IProductFilterProps } from "../../../../interfaces/IProducts";

const { Option } = Select;

const BundleFilterModal: FC<IProductFilterProps> = ({ filterAction }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<any>();
  const [groupList, setGroupList] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({});
  };
  const handleSelectComponent = (e: any) =>
    setFilters({
      ...filters,
      component: e[0].id,
    });

  const handleSubmit = () => {
    filterAction(filters);
    setIsModalVisible(false);
  };
  const getListGroup = async () => {
    const { data } = await listGroupService({
      queryParams: {
        paginate: false,
      },
    });
    setGroupList(data);
  };
  useEffect(() => {
    getListGroup();
  }, []);

  return (
    <div>
      {" "}
      <Button
        onClick={showModal}
        icon={
          <FilterOutlined
            style={{
              color: "#7d7ab9",
            }}
          />
        }>
        Filter
        <DownOutlined
          style={{
            fontSize: "11px",
          }}
        />
      </Button>
      <Modal
        className={styles["productFilter__modal"]}
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
          <Form.Item
            label="Product"
            extra="Product description"
            name="component">
            <SearchInput
              searchFrom="bundleFilter"
              url={`${BACKEND_API_PATHS.BASE}${BACKEND_API_PATHS.PRODUCTS}`}
              handleGetArrRes={handleSelectComponent}
              extraParams={{
                is_archived: "False",
                limit: 25,
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BundleFilterModal;
