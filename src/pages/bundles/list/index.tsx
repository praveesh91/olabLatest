import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  message,
  Row,
  Space,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import getAllBundles from "../../../services/apis/products/bundles/list-bundles.service";
import deleteBundles from "../../../services/apis/products/bundles/delete-bundle.services";
import {
  convertJsonToQueryString,
  createCSVBlob,
  getFilterListFromUrl,
  processQueryParams,
} from "../../../services/conversion.service";
import {
  getQueryParamsFromFilterList,
  getQueryParamsFromForm,
  getQueryParamsFromUrl,
} from "../../../services/get-values.service";
import {
  DownOutlined,
  RightOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  LeftOutlined,
  SearchOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./List.module.scss";
import BundleListTable from "./components/bundle-list-table";
import BundleFilterModal from "./components/bundle-filter-modal";
import BundleFilterTag from "./components/bundle-filter-tag";
import { downloadBlob } from "../../../services/common.services";
import exportFile from "../../../services/apis/export/export-file.service";
import { ISuccessMsg } from "../../../interfaces/IProducts";
import SuccessAlert from "../../../components/alerts/success.alert";
import ErrorAlert from "../../../components/alerts/error.alert";
import importBundles from "../../../services/apis/products/bundles/import-bundles.service";
import productBulkAction from "../../../services/apis/products/bulk-action.service";

const { Search } = Input;
const { confirm } = Modal;

const BundleListPage = () => {
  const history = useHistory();
  const location = useLocation();
  const [bundleList, setBundleList] = useState([]);
  const [bundleListLoading, setBundleListLoading] = useState(true);
  const [filteredTags, setFilteredTags] = useState<any[]>([]);
  const [filtersFromModal, setFiltersFromModal] = useState<any>();
  const [searchString, setSearchString] = useState<any>("");
  const [toastMsg, setToastMsg] = useState<ISuccessMsg>({
    desc: "",
    title: "",
  });
  const [selectedBundles, setSelectedBundles] = useState<any>([]);
  const [productListPagination, setProductListPagination] = useState<{
    next?: string | null;
    prev?: string | null;
  }>({
    next: null,
    prev: null,
  });
  const getAllBundlesFunc = async (data?: any) => {
    try {
      setBundleListLoading(true);
      const res: any = await getAllBundles({
        url: data?.url,
        queryParams: data?.queryParams,
      });
      setBundleList(res.data.results);
      setProductListPagination({
        next: res.data.next,
        prev: res.data.previous,
      });
      setBundleListLoading(false);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setBundleListLoading(false);
    }
  };
  useEffect(() => {
    let params = getQueryParamsFromUrl();
    params = processQueryParams(params);
    getAllBundlesFunc({
      queryParams: params,
    });
    let filterList = getFilterListFromUrl();
    setFilteredTags(filterList);
  }, [location]);

  const handlePaginationNext = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.next || "",
    });
    history.push({
      pathname: "/" + PAGE_PATHS.BUNDLE_LIST,
      search: convertJsonToQueryString(queryParams),
    });
  };

  const handlePaginationPrev = () => {
    let queryParams = getQueryParamsFromUrl({
      url: productListPagination.prev || "",
    });
    history.push({
      pathname: "/" + PAGE_PATHS.BUNDLE_LIST,
      search: convertJsonToQueryString(queryParams),
    });
  };
  const handleFilterParams = (filterParam: any) => {
    let paramsCombined = { ...filterParam, search: searchString };

    Object.keys(paramsCombined).forEach(
      (k) => !paramsCombined[k] && delete paramsCombined[k]
    );
    let queryParams = getQueryParamsFromForm(paramsCombined);
    queryParams = processQueryParams(queryParams);
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: "/" + PAGE_PATHS.BUNDLE_LIST,
      search: queryString,
    });
  };
  const onSearch = (searchString: string) => {
    setSearchString(searchString);
    let paramsCombined = { ...filtersFromModal, search: searchString };

    Object.keys(paramsCombined).forEach(
      (k) => !paramsCombined[k] && delete paramsCombined[k]
    );
    let queryParams = getQueryParamsFromForm(paramsCombined);
    queryParams = processQueryParams(queryParams);
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: "/" + PAGE_PATHS.BUNDLE_LIST,
      search: queryString,
    });
  };

  const handleExport = async () => {
    let filename = "bundles.csv";
    let paramsfromUrl = getQueryParamsFromUrl();
    setBundleListLoading(true);
    exportFile({
      filename: filename,
      type: "BUNDLES",
      extraParams: paramsfromUrl,
    })
      .then((res: any) => {
        downloadBlob(res, filename);
        if (res) {
          setBundleListLoading(false);
          message.success("Exporting process is successfully completed");
        }
      })
      .catch((error: any) => {
        setBundleListLoading(false);
        message.error("An error occured while exporting");
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
      setBundleListLoading(true);
      const res = await importBundles({
        body: fileBody,
      });
      message.success("File import successfully");
      let params = getQueryParamsFromUrl();
      params = processQueryParams(params);
      getAllBundlesFunc({
        queryParams: params,
      });
      setBundleListLoading(false);
      if (res.data.errors && res.data.errors.length > 0) {
        let blobObj = createCSVBlob(res.data.errors);
        downloadBlob(blobObj, "import-bundle-errors.csv");
      }
    } catch (error: any) {
      if (error.response) {
        if (
          error.response.data.errors &&
          error.response.data.errors.length > 0
        ) {
          let blobObj = createCSVBlob(error.response.data.errors);
          downloadBlob(blobObj, "import-bundle-errors.csv");
          message.error("Import errors downloaded");
        }
        message.error("Something went wrong");
        setBundleListLoading(false);
      }
    }
  };
  const handleDeleteBundle = async (path: string) => {
    try {
      setBundleListLoading(true);
      let arrIds = selectedBundles.map((el: any) => el.id);
      const data = await productBulkAction(arrIds, path);
      await setBundleListLoading(false);
      setSelectedBundles([]);
      await getAllBundlesFunc();
      if (data.status === 200) {
        setBundleListLoading(false);
        message.success("Bundle successfully deleted !");
      }
    } catch (error) {
      setBundleListLoading(false);
      message.success("An error occured while deleting !");
    } finally {
      setBundleListLoading(false);
    }
  };
  const confirmDelete = (path: string) => {
    confirm({
      title: `Are you sure?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDeleteBundle(path);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <div className={styles["bundleListContainer"]}>
      {" "}
      <div className={styles["bundleListContainer__header"]}>
        <div className={styles["bundleListContainer__header__title"]}>
          Bundle List
        </div>
        <Space>
          <input
            type="file"
            name="file"
            id="file"
            className={styles["bundleListContainer__uploadBtn"]}
            onChange={handleUpload}
          />
          <label
            htmlFor="file"
            className={styles["bundleListContainer__uploadLabel"]}>
            <DownloadOutlined
              className={styles["bundleListContainer__uploadBtnIcon"]}
            />
            Import
          </label>
          <Button type="text" icon={<UploadOutlined />} onClick={handleExport}>
            Export
          </Button>
          <Link to={"/" + PAGE_PATHS.BUNDLE_NEW}>
            <Button type="primary" icon={<PlusOutlined />}>
              Add New
            </Button>
          </Link>
        </Space>
      </div>
      <div className={styles["bundleListContainer__content"]}>
        <div className={styles["bundleListContainer__content__controls"]}>
          <Row justify="space-between">
            <Col md={24}>
              <div
                className={
                  styles["bundleListContainer__content__controls__filterSearch"]
                }>
                <BundleFilterModal
                  filterAction={(filterParam) => {
                    setFiltersFromModal(filterParam);
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
              </div>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col md={20}>
              <div
                className={
                  styles[
                    "bundleListContainer__content__controls__tagsListDelete"
                  ]
                }>
                {selectedBundles?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <Input
                      disabled
                      width={200}
                      value={`${selectedBundles.length} Selected`}
                    />

                    <Dropdown.Button
                      placement="bottomLeft"
                      overlay={
                        <Menu>
                          <Menu.Item
                            onClick={() => confirmDelete("delete-bundle")}>
                            Delete
                          </Menu.Item>
                        </Menu>
                      }
                      icon={<DownOutlined />}
                      trigger={["click"]}>
                      Bulk Actions
                    </Dropdown.Button>
                  </div>
                )}
                <BundleFilterTag
                  list={filteredTags}
                  onFilterRemove={(before: any, after: any) => {
                    let queryParams = getQueryParamsFromFilterList(after);
                    setFiltersFromModal(queryParams);
                    let queryString = convertJsonToQueryString(queryParams);
                    history.push({
                      pathname: "/" + PAGE_PATHS.BUNDLE_LIST,
                      search: queryString,
                    });
                  }}
                />
              </div>
            </Col>
            <Col md={4}>
              <div
                className={
                  styles["bundleListContainer__content__controls__pagination"]
                }>
                <Space>
                  <Button
                    onClick={handlePaginationPrev}
                    disabled={
                      productListPagination.prev === null ? true : false
                    }>
                    <LeftOutlined />
                    Prev
                  </Button>
                  <Button
                    onClick={handlePaginationNext}
                    disabled={
                      productListPagination.next === null ? true : false
                    }>
                    Next
                    <RightOutlined />
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        <div className={styles["bundleListContainer__content__table"]}>
          <BundleListTable
            hasSelectedBundles={(e: any) => setSelectedBundles(e)}
            allBundles={bundleList}
            tableLoader={bundleListLoading}
          />
        </div>
        <Row justify="end">
          <Col md={24}>
            <div
              className={
                styles["bundleListContainer__content__controls__pagination"]
              }>
              <Space>
                <Button
                  onClick={handlePaginationPrev}
                  disabled={productListPagination.prev === null ? true : false}>
                  <LeftOutlined />
                  Prev
                </Button>
                <Button
                  onClick={handlePaginationNext}
                  disabled={productListPagination.next === null ? true : false}>
                  Next
                  <RightOutlined />
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BundleListPage;
