import React, { useEffect, useState } from "react";
import Page from "../../../components/pages/basic.page";
import { Button, Col, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import ConfigForm from "../components/config-form";
import AdjustTypeForm from "../components/adjust-types-form";
import getAdjustStock from "../../../services/apis/operations/adjust-stock/get-adjust-stock.service";
import StockLines from "./components/stock-lines.table";
import { sortListBy } from "../../../services/list-service";
import BrowseProductModal from "../../../components/modals/browse-product-modal";
import {
  getMaxIndexNumber,
  getProductIdsFromLines,
  getProductIdsFromProductList,
} from "../../../services/get-values.service";
import listStockLevels from "../../../services/apis/stock/list-stock-levels.service";
import { fillLinesWithStockLevels } from "../../../services/fill-record.services";
import updateAdjustStock from "../../../services/apis/operations/adjust-stock/update-adjust-stock.service";
import createAdjustStock from "../../../services/apis/operations/adjust-stock/create-adjust-stock.service";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import markComplete from "../../../services/apis/operations/adjust-stock/mark-complete.service";
import ClockLoader from "../../../components/loaders/clock.loder";
import { Controller, useForm, useFormState } from "react-hook-form";
import listAdjustmentReasons from "../../../services/apis/operations/adjust-stock/adjustment-reasons/list-adjustment-reasons.service";
import createAdjustmentReason from "../../../services/apis/operations/adjust-stock/adjustment-reasons/create-adjustment-reason.service";
import deleteAdjustStock from "../../../services/apis/operations/adjust-stock/delete-adjust-stock.service";
import APP_CONSTANTS from "../../../utils/constants/app.constants";
import GoBackNavigation from "../../../components/navigation/go-back.navigation";

function AdjustStockForm() {
  const { id: stockDocId }: any = useParams();
  const pageType = stockDocId ? "edit" : "create";
  const [lines, setLines] = useState<any[]>([]);
  const [configFormOptions, setConfigFormOptions] = useState({
    warehouse: {
      disabled: false,
    },
    reason: {
      disabled: false,
    },
    notes: {
      disabled: false,
    },
    description: {
      show: false,
      tagLine: "Use this form to add, subtract or set stock. Stock will be modified based on the Adjustment type you have selected"
    },
  });

  const history = useHistory();

  const [config, setConfig] = useState<any>({
    warehouse: null,
    reason: [],
    notes: "",
    description: null,
    reasonList: [],
  });

  const [adjustTypeFormOptions, setAdjustTypeFormOption] = useState({
    markComplete: {
      show: true,
      showLoader: false,
    },
    types: {
      disabled: true,
    },
  });

  const [adjustmentType, setAdjustmentType] = useState<string | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);

  const [saving, setSaving] = useState(false);

  const [pageLoading, setPageLoading] = useState(false);

  const { control, reset } = useForm<any>({});

  const { isDirty } = useFormState({ control });

  const [stockObject, setStockObject] = useState<any>(null);

  const [reasonList, setReasonList] = useState<any[]>([]);

  useEffect(() => {
    if (pageType === "edit") {
      setPageLoading(true);
      getAdjustStock({
        id: stockDocId,
      })
        .then((res) => {
          let data = res.data;
          initPageWithData(data);
          setPageLoading(false);
        })
        .catch((error) => {
          setPageLoading(false);
          console.log(error);
        });
    }

    if (pageType === "create") {
      setAdjustTypeFormOption((prev) => {
        return {
          ...prev,
          types: {
            disabled: false,
          },
        };
      });
      setLines([]);
    }
  }, []);

  const initPageWithData = async (data: any) => {
    setStockObject(data);
    let sortedLines = sortListBy(data.lines, "index_number", "asc");
    data["lines"] = sortedLines;
    let stockLevels: any[] = [];
    let productIds: any = getProductIdsFromLines(sortedLines);
    try {
      let res = await listStockLevels({
        queryParams: { paginate: false, product_ids: productIds.join() },
      });
      stockLevels = res.data;
    } catch (error) {
      console.log(error);
    }

    data["lines"] = fillLinesWithStockLevels(data["lines"], stockLevels);

    setLines(data.lines);

    setIsCompleted(data.is_complete);
    setAdjustTypeFormOption((prev) => {
      return {
        ...prev,
        markComplete: { ...prev.markComplete, show: true },
        types: {
          disabled: data.is_complete ? true : false,
        },
      };
    });
    setConfig({
      reason: data.reason ? [{ label: data.reason, value: -1 }] : [],
      notes: data.notes,
      warehouse: {
        label: data.warehouse.code,
        value: data.warehouse.id,
        fullObj: data.warehouse,
      },
      description: {
        createdAt: data.created,
        updatedAt: data.updated,
        user: data.user.full_name,
      },
    });
    setConfigFormOptions({
      ...configFormOptions,
      warehouse: {
        disabled: data.is_complete,
      },
      description: {
        ...configFormOptions.description,
        show: pageType === "edit" ? true : false,
      },
    });

    setAdjustmentType(data.adjustment_type);
  };

  const addNewLines = async (products: any) => {
    let newLines: any[] = [];
    let maxIndex = getMaxIndexNumber(lines);
    let selectedIdList = getProductIdsFromProductList(products);
    let stockLevels: any[] = [];
    try {
      let res = await listStockLevels({
        queryParams: { paginate: false, product_ids: selectedIdList.join() },
      });
      stockLevels = res.data;
    } catch (error) {
      console.log(error);
    }

    products.forEach((product: any) => {
      maxIndex += 1;
      let line = createLine(product, maxIndex);
      newLines.push(line);
    });
    newLines = fillLinesWithStockLevels(newLines, stockLevels);

    setLines([...lines, ...newLines]);
  };

  const loadReasonList = async () => {
    try {
      let res: any = await listAdjustmentReasons({
        queryParams: {
          paginate: false,
        },
      });
      let reasons = res.data;
      let mappedList = reasons.map((reason: any) => {
        return {
          label: reason.name,
          value: reason.id,
          fullObj: reason,
        };
      });
      setConfig((prev: any) => {
        return {
          ...prev,
          reasonList: mappedList,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createLine = (product: any, indexNumber: number) => {
    let line = {
      product: product,
      product_id: product.id,
      index_number: indexNumber,
      quantity: "",
      adjustment_type: adjustmentType,
    };
    return line;
  };

  const handleSave = async () => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]["quantity"] === "") {
        setAlert({
          isShow: true,
          type: "error",
          msg: {
            title: "Quantity can not be empty",
          },
        });
        return;
      }
    }
    if (!adjustmentType) {
      setAlert({
        isShow: true,
        type: "error",
        msg: {
          title: "Select adjusment type",
          desc: "",
        },
      });
      return;
    }
    let resData: any;
    if (pageType === "edit") {
      setSaving(true);
      try {
        let res = await updateAdjustStock({
          id: stockDocId,
          body: {
            warehouse_id: config.warehouse.fullObj.id,
            reason: config["reason"][0]?.["label"] || "",
            notes: config.notes,
            adjustment_type: adjustmentType,
            lines: lines,
          },
        });
        resData = res.data;
        setSaving(false);
        reset({});
        setAlert({
          isShow: true,
          type: "success",
          msg: {
            title: "Changes saved",
            desc: "",
          },
        });
      } catch (error) {
        setSaving(false);
        console.log(error);
      }
    }

    if (pageType === "create") {
      setSaving(true);
      try {
        let res = await createAdjustStock({
          body: {
            warehouse_id: config.warehouse.fullObj.id,
            reason: config["reason"][0]?.["label"] || "",
            notes: config.notes,
            adjustment_type: adjustmentType,
            lines: lines,
          },
        });
        resData = res.data;
        setSaving(false);
        reset({});
        history.push(
          "/" +
          PAGE_PATHS.ADJUST_STOCK_FORM_EDIT.replace(":id", resData.id) +
          ""
        );
      } catch (error) {
        setSaving(false);
        console.log(error);
      }
    }
  };

  const handleMakrComplete = async () => {
    if (isAnyChange()) {
      setAlert({
        isShow: true,
        type: "error",
        msg: {
          title: "Save changes",
        },
      });
      return;
    }

    if (lines.length === 0) {
      setAlert({
        isShow: true,
        type: "error",
        msg: {
          title: "Please add product(s)",
        },
      });
      return;
    }

    setAdjustTypeFormOption({
      ...adjustTypeFormOptions,
      markComplete: {
        ...adjustTypeFormOptions.markComplete,
        showLoader: true,
      },
    });
    try {
      const res: any = await markComplete({
        id: stockDocId,
        action: "mark-complete",
      });
      initPageWithData(res.data);
      setAdjustTypeFormOption({
        ...adjustTypeFormOptions,
        markComplete: {
          ...adjustTypeFormOptions.markComplete,
          showLoader: false,
        },
      });
    } catch (error) {
      setAdjustTypeFormOption({
        ...adjustTypeFormOptions,
        markComplete: {
          ...adjustTypeFormOptions.markComplete,
          showLoader: false,
        },
      });
      console.log(error);
    }
  };

  const [alert, setAlert] = useState<any>({
    isShow: false,
    type: "success",
    msg: {
      title: "",
      desc: "",
    },
  });

  const getStatusString = (isComplete?: boolean) => {
    if (isComplete) {
      return "Done";
    }

    return "Draft";
  };

  const getStatusClass = (isComplete?: boolean) => {
    if (isComplete) {
      return "badge-label-success";
    }
    return "badge-label-primary";
  };

  const isAnyChange = () => {
    if (pageType === "create") {
      return true;
    }

    return isDirty;
  };

  const handleAddNewReason = async () => {
    let reason = prompt("Add New Reason");
    if (reason) {
      try {
        let res: any = await createAdjustmentReason({
          body: {
            name: reason
          }
        });
        setAlert({
          isShow: true,
          type: "success",
          msg: {
            title: "Reason added",
            desc: "",
          },
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Document will be deleted. Are you sure?")) {
      return;
    }
    try {
      setPageLoading(true);
      let res = await deleteAdjustStock({ id: stockDocId || -1 });
      setPageLoading(false);
      history.push("/" + PAGE_PATHS.ADJUST_STOCK_LIST);
    } catch (error) {
      setPageLoading(false);
      console.log(error);
    }
  }

  const allowDelete = () => {
    return pageType === "edit" && !isCompleted;
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
    }}>
      <Page loading={pageLoading} extraSpace={true} >
        <Page.Header>
          <div style={{ display: "flex", alignItems: "center", columnGap: "5px" }}>
            <GoBackNavigation></GoBackNavigation>
            <Page.Title>
              Adjust Stock Form
              <span className="doc-number ms-1">
                {pageType === "edit" && stockObject?.number
                  ? "#" + stockObject?.number
                  : ""}
              </span>
            </Page.Title>
          </div>
          <div className="tools" style={{ alignItems: "center" }}>
            <div
              className={`badge-label ${getStatusClass(
                isCompleted
              )}`}
            >
              {getStatusString(isCompleted)}
            </div>
            {/* <button className="btn btn-light icon-btn adjust-form-head">
            <img className="icon-img sm" src="/images/help.svg" />
            Help
          </button> */}
            {/* <button className="btn btn-light icon-btn">
            <img className="icon-img sm" src="/images/print.svg" />
            Print
          </button> */}
            {allowDelete() && <img className={`icon-img cursor-pointer`} src="/images/delete.svg" onClick={() => handleDelete()} />}
            {
              isAnyChange() ? <button
                className={`btn btn-warning`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "3px",
                }}
                onClick={() => {
                  handleSave();
                }}
              >
                {saving && (
                  <div
                    className="spinner-border text-white spinner-md"
                    role="status"
                  ></div>
                )}
                <img className="icon-img exclamation-mark" src="/images/exclamation.svg" /> <span>Save</span>
              </button> : <button
                className={`btn btn-success`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "3px",
                }}
              >
                <img className="icon-img sm" src="/images/success.svg" /> <span> Saved</span>
              </button>
            }
          </div>
        </Page.Header>

        <Page.Body
          className="app-bg-color px-0"
          style={{ overflowX: "hidden" }}
        >
          <Row>
            <Col md={8} lg={8} xl={8}>
              <ConfigForm
                options={configFormOptions}
                data={config}
                onChange={(key, data) => {
                  setConfig(data);
                }}
                control={control}
                onReasonInputClick={() => {
                  loadReasonList();
                }}
                onNewClick={() => {
                  handleAddNewReason();
                }}
                className={"h-100"}
              ></ConfigForm>
            </Col>
            <Col md={4} lg={4} xl={4}>
              <AdjustTypeForm
                className="h-100"
                options={adjustTypeFormOptions}
                type={adjustmentType}
                isCompleted={isCompleted}
                onTypeChange={(type) => {
                  setAdjustmentType(type);
                }}
                onMarkComplete={() => handleMakrComplete()}
                control={control}
              ></AdjustTypeForm>
            </Col>
          </Row>
          <Row className="mt-4" style={{ padding: "0 11.25px" }}>
            <Col
              className="bg-white"
              style={{ paddingTop: "11.25px", paddingBottom: "11.25px" }}
            >
              <div className="mb-5">
                <Controller
                  name="form-browse-product"
                  control={control}
                  render={({ field }: any) => (
                    <BrowseProductModal
                      onAddProducts={(products: any) => {
                        addNewLines(products);
                        field.onChange(products);
                      }}
                      warehouseId={config.warehouse?.value || -1}
                      warehouseCode={ config.warehouse?.label || ""}
                      disabled={isCompleted}
                    />
                  )}
                />
              </div>
              <Controller
                name="form-stock-lines"
                control={control}
                render={({ field }: any) => (
                  <StockLines
                    disabled={isCompleted}
                    rows={lines}
                    warehouse={config.warehouse?.fullObj || null}
                    adjustmentType={adjustmentType}
                    onUpdate={(lines: any) => {
                      setLines([...lines]);
                      field.onChange(lines);
                    }}
                    control={control}
                  ></StockLines>
                )}
              />
            </Col>
          </Row>
        </Page.Body>

        <Page.AlertBox
          isShow={alert.isShow}
          type={alert.type}
          msg={alert.msg}
          autoHide={true}
          onHide={() => {
            setAlert({
              isShow: false,
              type: "success",
              msg: null,
            });
          }}
        ></Page.AlertBox>
      </Page>
    </form >
  );
}

export default AdjustStockForm;
