import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import listProducts from "../../../services/apis/products/list-products.service";
import importProducts from "../../../services/apis/products/import-products.service";
import bulkAction from "../../../services/apis/products/bulk-action.service";
import exportFile from "../../../services/apis/export/export-file.service";
import { downloadBlob } from "../../../services/common.services";
import styles from "./List.module.scss";
import ProductFilter from "./components/product-filter.modal";
import ProductListSort from "./components/product-sort.dropdown";
import ProductListSearchBar from "./components/product-list.searchbar";
import ProductListTable from "./components/product-list.table";
import ProductPagination from "./components/product-pagination";
import SuccessAlert from "../../../components/alerts/success.alert";
import ErrorAlert from "../../../components/alerts/error.alert";
import ProductFilterTag from "./components/product-filter-tag";

import {
  DownOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  PrinterOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import {
  getQueryParamsFromFilterList,
  getQueryParamsFromForm,
  getQueryParamsFromUrl,
} from "../../../services/get-values.service";
import {
  convertJsonToQueryString,
  createCSVBlob,
  getFilterListFromUrl,
  processQueryParams,
} from "../../../services/conversion.service";
import {
  IProductDetail,
  ISuccessMsg,
  IFilterParams,
} from "../../../interfaces/IProducts";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import {
  Alert,
  Dropdown,
  Input,
  Menu,
  message,
  Modal,
  Button,
  Space,
  Upload,
  Row,
  Col,
} from "antd";

const productDetails = [
  {
    id: 0,
    in_stock: 0,
    available: 0,
    image_url: "",
    name: "",
    booked: "",
    alert_threshold: "",
    updated: "",
    created: "",
    grade: "",
    sku: "",
    client: "",
    uom: "",
  },
];
let defaultParams = {
  include: "count_links",
  is_archived: "false",
};
const { confirm } = Modal;
const { Search } = Input;
const ProductListPage: any = ({ route }: any) => {
  const history = useHistory();
  const location = useLocation();
  const [searchString, setSearchString] = useState<any>();

  const [productList, setProductList] = useState([]);
  const [productListLoading, setProductListLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [filteredTags, setFilteredTags] = useState<any[]>([]);
  const [filtersFromModal, setFiltersFromModal] = useState<any>();
  const [toastMsg, setToastMsg] = useState<ISuccessMsg>({
    desc: "",
    title: "",
  });
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
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
      setProductListLoading(true);
      const res: any = await listProducts({
        url: data?.url,
        queryParams: data?.queryParams,
      });
      setProductList(res.data.results);
      setProductListPagination({
        next: res.data.next,
        prev: res.data.previous,
      });
      setProductListLoading(false);

      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setProductListLoading(false);
    }
  };

  const fetchNextProducts = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.next || "",
    });
    queryParams = processQueryParams(queryParams);
    queryParams = { ...defaultParams, ...queryParams };
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: `/${PAGE_PATHS.PRODUCT_LIST}`,
      search: queryString,
    });
  };

  const fetchPrevProducts = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.prev || "",
    });
    queryParams = processQueryParams(queryParams);
    queryParams = { ...defaultParams, ...queryParams };
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: `/${PAGE_PATHS.PRODUCT_LIST}`,
      search: queryString,
    });
  };

  const handleExport = async () => {
    let filename = "products.csv";
    let paramsfromUrl = getQueryParamsFromUrl();
    setProductListLoading(true);
    exportFile({
      filename: filename,
      type: "PRODUCTS",
      extraParams: paramsfromUrl,
    })
      .then((res: any) => {
        downloadBlob(res, filename);
        if (res) {
          setProductListLoading(false);
          message.success("Exporting process is successfully completed");
        }
      })
      .catch((error: any) => {
        setProductListLoading(false);
        message.error("An error occured while exporting");
      });
  };

  const handleBulkActions = async (path: string, params?: any) => {
    try {
      setProductListLoading(true);
      let arrIds = selectedProducts.map((el: IProductDetail) => el.id);
      const data = await bulkAction(arrIds, path, params);
      // await getAllProductsFunc();
      let urlParams = getQueryParamsFromUrl();
      urlParams = processQueryParams(urlParams);
      await getAllProductsFunc({
        queryParams: urlParams,
      });
      setSelectedProducts([]);
      setProductListLoading(false);
      message.success("Bulk action successfully completed");
    } catch (error) {
      setProductListLoading(false);
      message.error("An error occured while bulk action");
    } finally {
      setProductListLoading(false);
    }
  };

  const confirmBulkAction = (path: string, params?: any) => {
    confirm({
      title: `Are you sure?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleBulkActions(path, params);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  // const menu = (
  //   <Menu>
  //     {filteredTags.filter((el: any) => el.label === "Archived")[0]?.value ? (
  //       <>
  //         <Menu.Item onClick={() => confirmBulkAction("undo-archive")}>
  //           Unarchive Products
  //         </Menu.Item>
  //         <Menu.Item onClick={() => confirmBulkAction("delete")}>
  //           Delete selected Products
  //         </Menu.Item>
  //       </>
  //     ) : (
  //       <>
  //         <Menu.Item onClick={() => confirmBulkAction("set_tracked")}>
  //           Set Tracked
  //         </Menu.Item>
  //         <Menu.Item onClick={() => confirmBulkAction("set_not_tracked")}>
  //           Set Not Tracked
  //         </Menu.Item>
  //         <Menu.Item onClick={() => confirmBulkAction("archive")}>
  //           Archive Products
  //         </Menu.Item>
  //       </>
  //     )}
  //   </Menu>
  // );
  const menu = (
    <Menu>
      <>
        <Menu.Item onClick={() => confirmBulkAction("set_tracked")}>
          Set Tracked
        </Menu.Item>
        <Menu.Item onClick={() => confirmBulkAction("set_not_tracked")}>
          Set Not Tracked
        </Menu.Item>
        <Menu.Item onClick={() => confirmBulkAction("archive")}>
          Archive Products
        </Menu.Item>
      </>
    </Menu>
  );

  const handleFilterParams = (filterParam: any) => {
    let queryParams = getQueryParamsFromForm({
      ...filterParam,
      ...searchString,
    });
    queryParams = processQueryParams(queryParams);
    queryParams = { ...defaultParams, ...queryParams };
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: `/${PAGE_PATHS.PRODUCT_LIST}`,
      search: queryString,
    });
  };

  const handleUpload = async (e: any) => {
    if (e.target.files[0].type !== "text/csv") {
      message.error("Upload only CSV files");
      return;
    }
    if (e.target.files[0].size / 1024 / 1024 > 25) {
      message.error("File size cannot exceed 25MB");
      return;
    }
    let fileBody = new Blob([e.target.files[0]], {
      type: "text/csv",
    });
    try {
      // setProductListLoading(true);
      const res = await importProducts({
        body: fileBody,
      });
      message.success("File import successfully");
      let params = getQueryParamsFromUrl();
      params = processQueryParams(params);
      getAllProductsFunc({
        queryParams: params,
      });
      // setProductListLoading(false);

      if (res.data.errors && res.data.errors.length > 0) {
        let blobObj = createCSVBlob(res.data.errors);
        downloadBlob(blobObj, "import-product-errors.csv");
      }
    } catch (error: any) {
      if (error.response) {
        if (
          error.response.data.errors &&
          error.response.data.errors.length > 0
        ) {
          let blobObj = createCSVBlob(error.response.data.errors);
          downloadBlob(blobObj, "import-product-errors.csv");
        }
        message.error("Something went wrong");
        setProductListLoading(false);
      }
    }
  };

  const onSearch = (search: string) => {
    if (search) {
      setSearchString({ search: search });
    } else {
      setSearchString({});
    }

    let paramsCombined = {
      ...filtersFromModal,
      search: search,
    };
    Object.keys(paramsCombined).forEach(
      (k) => !paramsCombined[k] && delete paramsCombined[k]
    );

    let queryParams = getQueryParamsFromForm({
      ...paramsCombined,
      ...searchString,
    });
    queryParams = processQueryParams(queryParams);
    queryParams = { ...defaultParams, ...queryParams };
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: `/${PAGE_PATHS.PRODUCT_LIST}`,
      search: queryString,
    });
  };

  return (
    <div className={styles["productListMain"]}>
      <div className="page">
        <div className="page-header">
          <div className="page-title">Product List</div>
          <Space>
            <Button type="text" icon={<QuestionCircleOutlined />}>
              Help
            </Button>
            <Link
              to={{
                pathname: `/${PAGE_PATHS.PRINT_PRODUCT_LIST}`,
                search: `${location.search}`,
                state: {
                  data: productList,
                  params: [...filteredTags, { paginate: "False" }],
                },
              }}>
              <Button type="text" icon={<PrinterOutlined />}>
                Print
              </Button>
            </Link>
            <input
              type="file"
              name="file"
              id="file"
              className={styles["productListMain__uploadBtn"]}
              onChange={handleUpload}
            />
            <label
              htmlFor="file"
              className={styles["productListMain__uploadLabel"]}>
              <DownloadOutlined
                className={styles["productListMain__uploadBtnIcon"]}
              />
              Import
            </label>
            <Button
              type="text"
              icon={<UploadOutlined />}
              onClick={handleExport}>
              Export
            </Button>
            <Link to={"/" + PAGE_PATHS.PRODUCT_NEW}>
              <Button type="primary" icon={<PlusOutlined />}>
                New Product
              </Button>
            </Link>
          </Space>
        </div>
        <div className="page-body">
          <div
            className="page-body-top"
            style={{ display: "flex", gap: "10px" }}>
            <div className="filter-search-group">
              <ProductFilter
                filterAction={(filterParam) => {
                  handleFilterParams(filterParam);
                  setFiltersFromModal(filterParam);

                  setFilter(true);
                }}
              />
              <Search
                defaultValue={getQueryParamsFromUrl().search}
                allowClear
                placeholder="Search by Name/SKU"
                onSearch={onSearch}
                style={{ width: 300 }}
              />
            </div>
            <ProductListSort
              sortAction={(filterParam) => {
                handleFilterParams(filterParam);
              }}
            />
          </div>
          <Row style={{ padding: "15px 0px" }}>
            <Col md={19}>
              <Space>
                {selectedProducts?.length > 0 && (
                  <>
                    <>
                      <Input
                        className={styles["productListMain__drop"]}
                        disabled
                        addonAfter={
                          <Dropdown.Button
                            placement="bottomLeft"
                            overlay={menu}
                            icon={<DownOutlined />}
                            trigger={["click"]}>
                            Bulk Actions
                          </Dropdown.Button>
                        }
                        value={`${selectedProducts.length} Selected`}
                      />
                    </>
                    {filteredTags.filter(
                      (el: any) => el.label === "Archived"
                    )[0]?.value === "true" && (
                      <Button
                        onClick={() =>
                          confirmBulkAction("delete", { is_select_all: "True" })
                        }>
                        Delete all archived products
                      </Button>
                    )}
                  </>
                )}
                <ProductFilterTag
                  list={filteredTags}
                  onFilterRemove={(before: any, after: any) => {
                    setFiltersFromModal(
                      after.reduce(
                        (acc: any, cur: any) => ({
                          ...acc,
                          [cur.index]: cur.value,
                        }),
                        {}
                      )
                    );

                    let queryParams = getQueryParamsFromFilterList(after);
                    queryParams = { ...defaultParams, ...queryParams };

                    let queryString = convertJsonToQueryString(queryParams);
                    history.push({
                      pathname: "/" + PAGE_PATHS.PRODUCT_LIST,
                      search: queryString,
                    });
                  }}
                />
              </Space>
            </Col>
            <Col md={5}>
              <ProductPagination
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

          <div className="page-body-middle">
            <ProductListTable
              hasSelectedPdt={(e: any) => setSelectedProducts(e)}
              list={productList}
              loading={productListLoading}
            />
          </div>
          <div style={{ padding: "10px 0" }}>
            <ProductPagination
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

export default ProductListPage;
