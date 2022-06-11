import InventoryListTable from "./components/inventory-list.table";
import InventoryFilter from "./components/inventory-filter.modal";
import WarehouseDropdown from "./components/warehouse.dropdown";
import InventoryListSearchbar from "./components/inventory-list.searchbar";
import InventorySortDropdown from "./components/inventory-sort.dropdown";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AppliedFilterGroup from "./components/applied-filters.group";
import {
  performFetchStockList,
  resetGlobalConfig,
  resetStockListConfig,
} from "../../../services/redux/slices/inventory.slice";
import ErrorAlert from "../../../components/alerts/error.alert";
import {
  resetError,
  setError,
} from "../../../services/redux/slices/errors.slice";
import SuccessAlert from "../../../components/alerts/success.alert";
import { resetSuccess } from "../../../services/redux/slices/success.slice";
import { Detector } from "react-detect-offline";
import Page from "../../../components/pages/basic.page";
import GoBackNavigation from "../../../components/navigation/go-back.navigation";

const InventoryList = () => {
  const history = useHistory();
  const dispatcher = useDispatch();
  const pagination = useSelector(
    (state: any) => state.inventory.stockList.pagination
  );

  const error = useSelector((state: any) => state.errors.inventoryPage);
  const success = useSelector((state: any) => state.success.inventoryPage);
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [showSuccessBox, setShowSuccessBox] = useState(false);

  useEffect(() => {
    if (error) {
      setShowErrorBox(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setShowSuccessBox(true);
    }
  }, [success]);

  useEffect(() => {
    return history.listen((location) => {
      localStorage.removeItem("inventory.globalConfig");
      localStorage.removeItem("inventory.stockList.config");
      dispatcher(resetStockListConfig());
      dispatcher(resetGlobalConfig());
    });
  }, [history]);

  const fetchNextItems = (url: any) => {
    dispatcher(
      performFetchStockList({
        url: pagination.next,
      })
    );
  };

  const fetchPrevItems = (url: any) => {
    dispatcher(
      performFetchStockList({
        url: pagination.previous,
      })
    );
  };
  return (
    <>
      <Page extraSpace={true}>
        <Page.Header>
        <div style={{ display: "flex", alignItems: "center", columnGap: "5px" }}>
          {/* <GoBackNavigation></GoBackNavigation> */}
          <Page.Title>Adjust Stock Table</Page.Title>
          </div>
          <div className="tools">
            <button className="btn btn-light icon-btn" hidden>
              <img className="icon-img sm" src="/images/import.png" />
              <span>Import</span>
            </button>
            <button className="btn btn-light icon-btn" hidden>
              <img className="icon-img sm" src="/images/export.png" />
              Export
            </button>
          </div>
        </Page.Header>
        <Page.Body>
          <>
            <div
              className="page-body-top"
              style={{ display: "flex", justifyContent: "space-between", marginBottom:"10px" }}
            >
              <div
                className="filter-search-group"
                style={{ alignItems: "center" }}
              >
                <InventoryFilter></InventoryFilter>
                <InventoryListSearchbar></InventoryListSearchbar>
              </div>
              <div>
                <div className="group gap-md" style={{ flexWrap: "wrap" }}>
                  <WarehouseDropdown></WarehouseDropdown>
                  <InventorySortDropdown></InventorySortDropdown>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: "15px"
              }}
            >
              <AppliedFilterGroup></AppliedFilterGroup>
              <div
                className="pagination right"
                style={{ backgroundColor: "white", alignItems: "center" }}
              >
                <button
                  className="btn btn-default btn-pagination"
                  disabled={!pagination.next}
                  onClick={fetchNextItems}
                >
                  Next<i
                    className="fa fa-angle-right-dark"
                    style={{ marginLeft: ".5rem" }}
                  ></i>
                </button>
                <button
                  className="btn btn-default btn-pagination"
                  disabled={!pagination.previous}
                  onClick={fetchPrevItems}
                >
                  <i
                    className="fa fa-angle-left-dark"
                    style={{ marginRight: ".5rem" }}
                  ></i> Prev
                </button>
              </div>
            </div>
            <div className="page-body-middle" style={{marginBottom:"15px"}}>
              <InventoryListTable list={[]}></InventoryListTable>
            </div>
            <div
              className="pagination right"
              style={{ backgroundColor: "white" }}
            >
              <button
                className="btn btn-default btn-pagination"
                disabled={!pagination.next}
                onClick={fetchNextItems}
              >
                Next<i
                  className="fa fa-angle-right-dark"
                  style={{ marginLeft: ".5rem" }}
                ></i>
              </button>
              <button
                className="btn btn-default btn-pagination"
                disabled={!pagination.previous}
                onClick={fetchPrevItems}
              >
                <i
                  className="fa fa-angle-left-dark"
                  style={{ marginRight: ".5rem" }}
                ></i>Prev
              </button>
            </div>
          </>
        </Page.Body>
        {/* <ErrorAlert
          msg={error}
          isShow={showErrorBox}
          onHide={() => {
            setShowErrorBox(false);
            dispatcher(
              resetError({
                context: "inventoryPage",
              })
            );
          }}
        ></ErrorAlert> */}
        {/* <SuccessAlert
          msg={success}
          isShow={showSuccessBox}
          onHide={() => {
            setShowSuccessBox(false);
            dispatcher(
              resetSuccess({
                context: "inventoryPage",
              })
            );
          }}
        ></SuccessAlert> */}
      </Page>
    </>
  );
};

export default InventoryList;
