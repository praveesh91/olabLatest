import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErroMessage } from "../../../services/redux/slices/adjuststockform.slice";
import Page from "../../../components/pages/basic.page";
import { Button } from "react-bootstrap";
import AppliedFilterGroup from "../adjust-stock-table/components/applied-filters.group";
import StockDocuments from "./components/stock-documents.table";
import ClockLoader from "../../../components/loaders/clock.loder";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import { useHistory, useLocation } from "react-router-dom";
import AlertPopup from "../../../components/alerts/alert-popup";
import APP_CONSTANTS from "../../../utils/constants/app.constants";
import listAdjustStocks from "../../../services/apis/operations/adjust-stock/list-adjust-stock.service";
import GoBackNavigation from "../../../components/navigation/go-back.navigation";
import Filter from "./components/filter.modal";
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
import AppliedFilterList from "./components/applied-filter.list";

const AdjustStockDocuments = () => {
  const dispatch = useDispatch();
  const history: any = useHistory();
  const location = useLocation();

  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState(false);

  const loadStockDocumentList = async (data?: any) => {
    setLoading(true);
    setList([]);
    try {
      let res: any = await listAdjustStocks({
        url: data?.url,
        queryParams: data?.queryParams,
      });
      setList(res.data.results);
      setPagination({
        next: res.data.next,
        previous: res.data.previous,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    let params = getQueryParamsFromUrl();
    params = processQueryParams(params);
    loadStockDocumentList({
      queryParams: params,
    });
    let filterList = getFilterListFromUrl();
  }, [location]);

  const [isError, setIsError] = useState<boolean>(true);

  const handleFetchNext = () => {
    let queryParams = getQueryParamsFromUrl({ url: pagination.next || "" });
    history.push({
      pathname: "/" + PAGE_PATHS.ADJUST_STOCK_LIST,
      search: convertJsonToQueryString(queryParams),
    });
  };
  const handleFetchPrevious = () => {
    let queryParams = getQueryParamsFromUrl({ url: pagination.previous || "" });
    history.push({
      pathname: "/" + PAGE_PATHS.ADJUST_STOCK_LIST,
      search: convertJsonToQueryString(queryParams),
    });
  };

  const handleNewAdjustForm = () => {
    history.push("/" + PAGE_PATHS.ADJUST_STOCK_FORM_NEW);
  };

  const handleNewImport = () => {
    history.push("/" + PAGE_PATHS.ADJUST_STOCK_IMPORT_NEW);
  };

  const handleFilterSubmit = (data: any) => {
    let queryParams = getQueryParamsFromForm(data);
    queryParams = processQueryParams(queryParams);
    let queryString = convertJsonToQueryString(queryParams);
    history.push({
      pathname: "/" + PAGE_PATHS.ADJUST_STOCK_LIST,
      search: queryString,
    });
  };

  const [appliedFilterList, setAppliedFilterList] = useState<any[]>([]);
  return (
    <>
      <Page extraSpace={true}>
        <Page.Header>
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "5px" }}>
            {/* <GoBackNavigation></GoBackNavigation> */}
            <Page.Title>Adjust Stock Forms List</Page.Title>
          </div>
          <div className="tools" style={{ alignItems: "center" }}>
            {/* <button
              className="btn btn-light icon-btn"
              onClick={() => {
                window.open(APP_CONSTANTS.HELP_LINK.ADJUST_STOCK, "_blank");
              }}
            >
              <img className="icon-img sm" src="/images/help.svg" />
              Help
            </button> */}
            {/* <button className="btn btn-light icon-btn">
              <img className="icon-img sm" src="/images/import.svg" />
              Import
            </button> */}
            {/* <button className="btn btn-light icon-btn">
              <img className="icon-img sm" src="/images/export.svg" />
              Export
            </button> */}
            <Button
              variant="primary"
              className="text-nowrap"
              onClick={handleNewAdjustForm}>
              <img
                className="icon-img sm"
                style={{ marginRight: ".3rem" }}
                src="/images/add.svg"
              />
              New Adjust Stock Form
            </Button>
            <Button
              variant="primary"
              className="text-nowrap"
              onClick={handleNewImport}>
              <img
                className="icon-img sm"
                style={{ marginRight: ".3rem" }}
                src="/images/add.svg"
              />
              New Upload File
            </Button>
          </div>
        </Page.Header>
        <Page.Body>
          <>
            <div
              className="page-body-top"
              style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                className="filter-search-group"
                style={{ alignItems: "center" }}>
                {/* <InventoryListSearchbar></InventoryListSearchbar> */}
              </div>
              <div>
                <div className="group gap-md" style={{ flexWrap: "wrap" }}>
                  {/* <WarehouseDropdown></WarehouseDropdown> */}
                  {/* <InventoryFilter></InventoryFilter> */}
                  {/* <InventorySortDropdown></InventorySortDropdown> */}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                paddingTop: "10px",
                marginBottom: "15px",
              }}>
              <Filter
                onFormSubmit={(data) => {
                  handleFilterSubmit(data);
                }}></Filter>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}>
              <AppliedFilterList
                list={appliedFilterList}
                onFilterRemove={(before: any, after: any) => {
                  let queryParams = getQueryParamsFromFilterList(after);
                  let queryString = convertJsonToQueryString(queryParams);
                  history.push({
                    pathname: "/" + PAGE_PATHS.ADJUST_STOCK_LIST,
                    search: queryString,
                  });
                }}></AppliedFilterList>
              <div
                className="pagination right"
                style={{ backgroundColor: "white", alignItems: "center" }}>
                <button
                  className="btn btn-default btn-pagination text-nowrap"
                  disabled={pagination.next === null ? true : false}
                  onClick={() => handleFetchNext()}>
                  Next
                  <i
                    className="fa fa-angle-right-dark"
                    style={{ marginLeft: ".5rem" }}></i>
                </button>
                <button
                  className="btn btn-default btn-pagination"
                  disabled={pagination.previous === null ? true : false}
                  onClick={() => handleFetchPrevious()}>
                  <i
                    className="fa fa-angle-left-dark"
                    style={{ marginRight: ".5rem" }}
                  />
                  Prev
                </button>
              </div>
            </div>
            <div className="page-body-middle" style={{ marginBottom: "15px" }}>
              <StockDocuments list={list} loading={loading} />
            </div>

            <div
              className="pagination right"
              style={{ backgroundColor: "white" }}>
              <button
                className="btn btn-default btn-pagination"
                disabled={pagination.next === null ? true : false}
                onClick={() => handleFetchNext()}>
                Next
                <i
                  className="fa fa-angle-right-dark"
                  style={{ marginLeft: ".5rem" }}
                />
              </button>
              <button
                className="btn btn-default btn-pagination"
                disabled={pagination.previous === null ? true : false}
                onClick={() => handleFetchPrevious()}>
                <i
                  className="fa fa-angle-left-dark"
                  style={{ marginRight: ".5rem" }}
                />
                Prev
              </button>
              {/* <SelectDropdown
                className="pagination-dropdown"
                list={paginationDropdown}
                selected={paginationDropdown[0]}
                // onChange={(item: any) =>
                //   handleAdjustStockForm(item.value, "warehouse")
                // }
              /> */}
            </div>
          </>
        </Page.Body>
      </Page>
    </>
  );
};

export default AdjustStockDocuments;
