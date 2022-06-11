import React, { FC, useState } from "react";
import { Empty, Select, Spin } from "antd";
import axios from "axios";
const { Option } = Select;

interface ISearchInputProps {
  url: string;
  handleGetArrRes: any;
  searchFrom?: string;
  extraParams?: any;
  defaultVal?: any;
}
const SearchInput: FC<ISearchInputProps> = ({
  url,
  handleGetArrRes,
  searchFrom = undefined,
  extraParams = undefined,
  defaultVal = undefined,
}) => {
  const [dataArr, setDataArr] = useState<any>([]);
  const [value, setValue] = useState("");
  let timeout: any;
  let currentValue: any;

  const getData = (searchString: string = "", callback: any) => {
    let params = {
      search: searchString,
      paginate: "False",
      is_archived: "False",
      ...extraParams,
    };
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    const callApi = () => {
      try {
        const res = axios.get(url, { params });
        res.then((e: any) => {
          if (currentValue === value) {
            callback(e.data);
          }
        });
      } catch (error) {}
    };
    timeout = setTimeout(callApi, 200);
  };
  const handleSearch = (value: string) => {
    if (value) {
      getData(value, (data: any) => setDataArr(data));
    } else {
      setDataArr([]);
    }
  };

  const handleChange = (value: any) => {
    setValue(value);
    handleGetArrRes(dataArr?.filter((el: any) => el.id == value));
  };

  const options =
    dataArr.length > 0 ? (
      dataArr?.map((d: any) => <Option key={d.id}>{d.code}</Option>)
    ) : (
      <Option>
        <Empty description="No data" />
      </Option>
    );

  const optionsBundleFilter =
    dataArr.length > 0 ? (
      dataArr?.map((d: any) => (
        <Option key={d.id}>
          <>
            <div>{`${d?.name}/${d?.sku}`}</div>
            <div>{`Category : ${d?.group1?.name}`}</div>
          </>
        </Option>
      ))
    ) : (
      <Option disabled>
        <div style={{ textAlign: "center", padding: "10px 0px " }}>
          <Spin />
        </div>
      </Option>
    );
  return (
    <Select
      showSearch
      // value={state.value}
      // placeholder={placeholder}
      defaultValue={defaultVal}
      // defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onFocus={() => handleSearch(" ")}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}>
      {searchFrom === "bundleFilter" ? optionsBundleFilter : options}
    </Select>
  );
};

export default SearchInput;
