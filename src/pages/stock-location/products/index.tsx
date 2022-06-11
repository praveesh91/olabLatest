import {
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Modal,
  Typography,
} from "antd";
import {
  UploadOutlined,
  MailOutlined,
  PrinterOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import "./ProductList.scss";
import StockLocationListTable from "./components/stock-location-list.table";
import StockLocationProductFilter from "./components/stock-location-filter.modal";
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
import exportFile from "../../../services/apis/export/export-file.service";
import { downloadBlob } from "../../../services/common.services";

import StockLocationFilterTag from "./components/stock-location-filter-tag";
import StockLocationPagination from "./components/stock-location-pagination";
import SelectWarehouse from "./components/select-warehouse";
import listStockLevels from "../../../services/apis/stock/list-stock-levels.service";
import getEmailStockLevel from "../../../services/apis/stock/get-email-stock-level.service";
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const ProductStockLocation = () => {
  const history = useHistory();
  const location = useLocation();
  const [filtersFromModal, setFiltersFromModal] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [stockLocations, setStockLocations] = useState<any>();
  const [searchString, setSearchString] = useState<any>();

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
    getStockLocations({
      queryParams: params,
    });
    let filterList = getFilterListFromUrl();
    setFilteredTags(filterList);
  }, [location]);

  const getStockLocations = async (data?: any) => {
    try {
      setLoading(true);
      const res = await listStockLevels({
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
      pathname: "/" + PAGE_PATHS.PRODUCT_STOCK_LOCATION,
      search: convertJsonToQueryString(queryParams),
    });
  };

  const fetchPrevProducts = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.prev || "",
    });
    history.push({
      pathname: "/" + PAGE_PATHS.PRODUCT_STOCK_LOCATION,
      search: convertJsonToQueryString(queryParams),
    });
  };

  const onSearch = (search: string) => {
    setSearchString({ search: search });
    let paramsCombined = { ...filtersFromModal, search: search };

    Object.keys(paramsCombined).forEach(
      (k) => !paramsCombined[k] && delete paramsCombined[k]
    );
    let queryParams = getQueryParamsFromForm(paramsCombined);
    queryParams = processQueryParams(queryParams);
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: "/" + PAGE_PATHS.PRODUCT_STOCK_LOCATION,
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
      pathname: "/" + PAGE_PATHS.PRODUCT_STOCK_LOCATION,
      search: queryString,
    });
  };

  const confirmExportAction = () => {
    confirm({
      title: `Do you want to continue?`,
      content:
        "This Stock Levels export will not include bundles. To get stock levels with bundles, click on Email Stock. ",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleExport();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const confirmEmailtAction = () => {
    confirm({
      title: `Do you want to continue?`,
      content: "Stock Levels will be emailed to you. . ",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleSendMail();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleExport = async () => {
    let filename = "stock locations.csv";
    let paramsfromUrl = getQueryParamsFromUrl();
    setLoading(true);
    exportFile({
      filename: filename,
      type: "STOCK_LOCATIONS",
      extraParams: paramsfromUrl,
    })
      .then((res: any) => {
        downloadBlob(res, filename);
        if (res) {
          setLoading(false);
          message.success("Exporting process is successfully completed");
        }
      })
      .catch((error: any) => {
        message.error("An error occured while exporting");
      });
  };

  const handleSendMail = async (data?: any) => {
    try {
      setLoading(true);
      const res = await getEmailStockLevel({
        queryParams: data?.queryParams,
      });
      message.success("You have been emailed the stocklevels");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong !");
    }
  };

  return (
    <div>
      {" "}
      <div className={"pdtStockLocationContainer"}>
        <div className={"pdtStockLocationContainer__topNav"}>
          <Row justify="space-between" align="middle">
            <Col>
              <div className="pdtStockLocationContainer__topNav__name">
                <Title level={4}>Stock By Location</Title>
              </div>
            </Col>
            <Col>
              <Button
                type="text"
                onClick={confirmEmailtAction}
                icon={<MailOutlined />}>
                Email
              </Button>
              <Link
                to={{
                  pathname: `/${PAGE_PATHS.PRINT_STOCK_LOCATION_LIST}`,
                  search: `${location.search}`,
                  state: {
                    data: stockLocations,
                    params: [...filteredTags, { paginate: "False" }],
                  },
                }}>
                <Button type="text" icon={<PrinterOutlined />}>
                  Print
                </Button>
              </Link>
              <Button
                type="text"
                onClick={confirmExportAction}
                icon={<UploadOutlined />}>
                Export
              </Button>
            </Col>
          </Row>
        </div>
        <div className={"pdtStockLocationContainer__content"}>
          <Row className={"pdtStockLocationContainer__content__controls"}>
            <Col
              md={18}
              className={
                "pdtStockLocationContainer__content__controls__filterSearch"
              }>
              <StockLocationProductFilter
                filterAction={(filterParam) => {
                  handleFilterParams(filterParam);
                }}
              />
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
                filterAction={(filterParams) =>
                  handleFilterParams(filterParams)
                }
              />
            </Col>
          </Row>
          <Row style={{ padding: "15px 0px" }} align="middle">
            <Col md={19}>
              <StockLocationFilterTag
                list={filteredTags}
                onFilterRemove={(before: any, after: any) => {
                  let queryParams = getQueryParamsFromFilterList(after);
                  let queryString = convertJsonToQueryString(queryParams);
                  history.push({
                    pathname: "/" + PAGE_PATHS.PRODUCT_STOCK_LOCATION,
                    search: queryString,
                  });
                }}
              />
            </Col>
            <Col md={5} style={{ alignItems: "end" }}>
              <StockLocationPagination
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

          <StockLocationListTable
            hasSelectedPdt={(e: any) => console.log(e)}
            list={stockLocations}
            loading={loading}
          />
          <div style={{ padding: "10px 0" }}>
            <StockLocationPagination
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

export default ProductStockLocation;
