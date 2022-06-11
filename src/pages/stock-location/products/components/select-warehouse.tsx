import { Form, Input, Select } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IProductFilterProps } from "../../../../interfaces/IProducts";
import { getQueryParamsFromUrl } from "../../../../services/get-values.service";
const { Option } = Select;
const SelectWarehouse: FC<IProductFilterProps> = ({ filterAction }) => {
  const [form] = Form.useForm();

  const [selectedItem, setSelectedItem] = useState<any>();

  let warehousesList = [
    ...useSelector((state: any) => state?.components?.warehouses?.list),
    { id: "", name: "All Warehouses", code: "All Warehouses" },
  ];

  useEffect(() => {
    setSelectedItem(
      getQueryParamsFromUrl().warehouse !== undefined
        ? warehousesList.filter(
            (el: any) => el.id == getQueryParamsFromUrl().warehouse
          )[0]
        : warehousesList[warehousesList.length - 1]
    );
  }, [warehousesList]);
  form.setFieldsValue({ warehouse: selectedItem?.name });

  const handleSelect = (e: any) => {
    setSelectedItem(warehousesList.filter((el: any) => el.id === e)[0]);
    filterAction({ warehouse: e });
  };
  return (
    <div>
      {" "}
      <Form form={form}>
        <Form.Item name="warehouse">
          <Select
            value={selectedItem?.name}
            onChange={handleSelect}
            style={{ display: "block", margin: "auto" }}>
            {warehousesList?.map((el: any) => (
              <Option key={el.id} value={el.id}>
                {el?.code}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SelectWarehouse;
