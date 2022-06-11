import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Modal,
  Typography,
  Space,
} from "antd";
import {
  UploadOutlined,
  MailOutlined,
  PrinterOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "./OrderList.scss";
import OrderFilter from "./components/order-filter-modal";
import {
  getQueryParamsFromFilterList,
  getQueryParamsFromForm,
  getQueryParamsFromUrl,
} from "../../../services/get-values.service";
import { useHistory, useLocation } from "react-router-dom";
import {
  convertJsonToQueryString,
  getFilterListFromUrl,
  processQueryParams,
} from "../../../services/conversion.service";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import getOrderList from "../../../services/apis/ecom/orders/get-order-list";
import OrderListPagination from "./components/order-list-pagination";
import OrderListTable from "./components/order-list-table";
import OrderFilterTags from "./components/order-filter-tags";
import archiveOrders from "../../../services/apis/ecom/orders/archive-orders";

const { Title, Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;

const OrdersList = () => {
  const history = useHistory();
  const location = useLocation();
  const [filtersFromModal, setFiltersFromModal] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState<any>();
  const [searchString, setSearchString] = useState<any>();
  const [selectedOrders, setSelectedOrders] = useState<any>();

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
    getAllProductsFunc({
      queryParams: params,
    });
    let filterList = getFilterListFromUrl();
    setFilteredTags(filterList);
  }, [location]);

  const getAllProductsFunc = async (data?: any) => {
    try {
      setLoading(true);
      const res: any = await getOrderList({
        url: data?.url,
        queryParams: data?.queryParams,
      });
      setOrderList(res.data.results);
      setProductListPagination({
        next: res.data.next,
        prev: res.data.previous,
      });
      setLoading(false);

      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNextProducts = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.next || "",
    });
    history.push({
      pathname: "/" + PAGE_PATHS.ORDER_LIST,
      search: convertJsonToQueryString(queryParams),
    });
  };

  const fetchPrevProducts = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.prev || "",
    });
    history.push({
      pathname: "/" + PAGE_PATHS.ORDER_LIST,
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
      pathname: "/" + PAGE_PATHS.ORDER_LIST,
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
      pathname: "/" + PAGE_PATHS.ORDER_LIST,
      search: queryString,
    });
  };
  const handleConfirmArchive = () => {
    confirm({
      title: `Are you sure?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleArchive();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleArchive = async () => {
    let arrIds = selectedOrders.map((el: any) => el?.id.id);
    try {
      setLoading(true);
      const res = await archiveOrders(arrIds);
      setLoading(false);
      setSelectedOrders([]);
      message.success("Order archived successfully!");
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    } finally {
    }
  };
  return (
    <div className={"orderListContainer"}>
      <div className={"orderListContainer__topNav"}>
        <Row justify="space-between" align="middle">
          <Col>
            <div className="orderListContainer__topNav__name">
              <Title level={4}>Orders</Title>
            </div>
          </Col>
          <Col>
            <Button type="text" icon={<QuestionCircleOutlined />}>
              Help
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
            <OrderFilter
              filterCount={filteredTags.length}
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
          <Col md={6}></Col>
        </Row>
        <Row style={{ padding: "15px 0px" }} align="middle">
          <Col md={19}>
            <Space>
              {selectedOrders?.length > 0 && (
                <Button onClick={() => handleConfirmArchive()}>Archive</Button>
              )}

              <OrderFilterTags
                list={filteredTags}
                onFilterRemove={(before: any, after: any) => {
                  let queryParams = getQueryParamsFromFilterList(after);
                  let queryString = convertJsonToQueryString(queryParams);
                  history.push({
                    pathname: "/" + PAGE_PATHS.ORDER_LIST,
                    search: queryString,
                  });
                }}
              />
            </Space>
          </Col>
          <Col md={5} style={{ alignItems: "end" }}>
            <OrderListPagination
              handleClickNext={fetchNextProducts}
              handleClickPrev={fetchPrevProducts}
              nextBtnActive={productListPagination.next === null ? true : false}
              prevBtnActive={productListPagination.prev === null ? true : false}
            />
          </Col>
        </Row>

        <OrderListTable
          hasSelectedPdt={(e: any) => setSelectedOrders(e)}
          list={orderList}
          loading={loading}
        />
        <div style={{ padding: "10px 0" }}>
          <OrderListPagination
            handleClickNext={fetchNextProducts}
            handleClickPrev={fetchPrevProducts}
            nextBtnActive={productListPagination.next === null ? true : false}
            prevBtnActive={productListPagination.prev === null ? true : false}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
