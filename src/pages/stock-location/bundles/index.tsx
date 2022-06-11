import {
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import {
  UploadOutlined,
  MailOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import "./BundleList.scss";
import {
  getQueryParamsFromFilterList,
  getQueryParamsFromForm,
  getQueryParamsFromUrl,
} from "../../../services/get-values.service";
import {
  convertJsonToQueryString,
  getFilterListFromUrl,
  processQueryParams,
} from "../../../services/conversion.service";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import BundleLocationPagination from "./components/bundle-location-pagination";
import SelectWarehouse from "../products/components/select-warehouse";
import BundleLocationTable from "./components/bundle-location-table";
import getBundleLocations from "../../../services/apis/products/get-bundle-location.service";
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const BundleLocation = () => {
  const history = useHistory();
  const location = useLocation();
  const [filtersFromWarehoue, setFiltersFromWarehoue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState<any>();
  const [stockLocations, setStockLocations] = useState<any>();
  const [filteredTags, setFilteredTags] = useState<any[]>([]);
  const [productListPagination, setProductListPagination] = useState<{
    next?: string | null;
    prev?: string | null;
  }>({
    next: null,
    prev: null,
  });

  useEffect(() => {
    let params = getQueryParamsFromUrl();
    params = processQueryParams(params);
    getBundleLocationsFunc({
      queryParams: params,
    });
    let filterList = getFilterListFromUrl();
    setFilteredTags(filterList);
  }, [location]);

  const getBundleLocationsFunc = async (data?: any) => {
    try {
      setLoading(true);
      const res = await getBundleLocations({
        url: data?.url,
        queryParams: data?.queryParams,
      });
      setStockLocations(res.data.results);
      setProductListPagination({
        next: res.data.next,
        prev: res.data.previous,
      });
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong !");
    }
  };

  const fetchNextProducts = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.next || "",
    });
    history.push({
      pathname: "/" + PAGE_PATHS.BUNDLE_STOCK_LOCATION,
      search: convertJsonToQueryString(queryParams),
    });
  };

  const fetchPrevProducts = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.prev || "",
    });
    history.push({
      pathname: "/" + PAGE_PATHS.BUNDLE_STOCK_LOCATION,
      search: convertJsonToQueryString(queryParams),
    });
  };
  const onSearch = (search: string) => {
    setSearchString({ search: search });
    let paramsCombined = { ...filtersFromWarehoue, search: search };
    Object.keys(paramsCombined).forEach(
      (k) => !paramsCombined[k] && delete paramsCombined[k]
    );
    let queryParams = getQueryParamsFromForm(paramsCombined);
    queryParams = processQueryParams(queryParams);
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: "/" + PAGE_PATHS.BUNDLE_STOCK_LOCATION,
      search: queryString,
    });
  };
  const handleFilterParams = (filterParam: any) => {
    let queryParams = getQueryParamsFromForm({
      ...filterParam,
      ...searchString,
    });
    queryParams = processQueryParams(queryParams);
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: "/" + PAGE_PATHS.BUNDLE_STOCK_LOCATION,
      search: queryString,
    });
  };

  return (
    <div>
      {" "}
      <div className={"bundleLocationContainer"}>
        <div className={"bundleLocationContainer__topNav"}>
          <Row justify="space-between" align="middle">
            <Col>
              <div className="bundleLocationContainer__topNav__name">
                <Title level={4}>Bundles Stock By Location</Title>
              </div>
            </Col>
          </Row>
        </div>
        <div className={"bundleLocationContainer__content"}>
          <Row className={"bundleLocationContainer__content__controls"}>
            <Col
              md={18}
              className={
                "bundleLocationContainer__content__controls__filterSearch"
              }>
              <Search
                defaultValue={getQueryParamsFromUrl().search}
                allowClear
                placeholder="Search by Name/SKU"
                onSearch={onSearch}
                style={{ width: 300 }}
              />
            </Col>
            <Col md={6}>
              <SelectWarehouse
                filterAction={(filterParams) => {
                  handleFilterParams(filterParams);
                  setFiltersFromWarehoue(filterParams);
                }}
              />
            </Col>
          </Row>
          <Row style={{ padding: "15px 0px" }} align="middle">
            <Col md={19}></Col>
            <Col md={5} style={{ alignItems: "end" }}>
              <BundleLocationPagination
                handleClickNext={fetchNextProducts}
                handleClickPrev={fetchPrevProducts}
                nextBtnActive={
                  productListPagination.next === null ? true : false
                }
                prevBtnActive={
                  productListPagination.prev === null ? true : false
                }
              />
            </Col>
          </Row>

          <BundleLocationTable
            hasSelectedPdt={(e: any) => console.log(e)}
            list={stockLocations}
            loading={loading}
          />
          <div style={{ padding: "10px 0" }}>
            <BundleLocationPagination
              handleClickNext={fetchNextProducts}
              handleClickPrev={fetchPrevProducts}
              nextBtnActive={productListPagination.next === null ? true : false}
              prevBtnActive={productListPagination.prev === null ? true : false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleLocation;
