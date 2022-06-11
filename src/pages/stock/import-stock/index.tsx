import React, { useEffect, useState } from "react";
import { Button, Row, Col, Spinner } from "react-bootstrap";
import Page from "../../../components/pages/basic.page";
import DragAndDrop from "./components/drag-and-drop";
import ConfigForm from "../components/config-form";
import AdjustTypeForm from "../components/adjust-types-form";
import createAdjustStock from "../../../services/apis/operations/adjust-stock/create-adjust-stock.service";
import importAdjustStock from "../../../services/apis/operations/adjust-stock/import-adjust-stock.service";
import { useHistory, useParams } from "react-router-dom";
import getAdjustStock from "../../../services/apis/operations/adjust-stock/get-adjust-stock.service";
import PAGE_PATHS from "../../../utils/constants/page-paths.constants";
import getCSVSample from "../../../services/apis/export/get-csv-sample.service";
import { downloadBlob } from "../../../services/common.services";
import APP_CONSTANTS from "../../../utils/constants/app.constants";
import updateAdjustStock from "../../../services/apis/operations/adjust-stock/update-adjust-stock.service";
import ErrorAlert from "../../../components/alerts/error.alert";
import exportFile from "../../../services/apis/export/export-file.service";
import { createCSVBlob } from "../../../services/conversion.service";
import ImportSummary from "./components/import-summary";
import ImportList from "./components/import-list";
import getImportedStocks from "../../../services/apis/operations/adjust-stock/get-imported-stocks.service";
import { useForm, useFormState } from "react-hook-form";
import listAdjustmentReasons from "../../../services/apis/operations/adjust-stock/adjustment-reasons/list-adjustment-reasons.service";
import createAdjustmentReason from "../../../services/apis/operations/adjust-stock/adjustment-reasons/create-adjustment-reason.service";
import deleteAdjustStock from "../../../services/apis/operations/adjust-stock/delete-adjust-stock.service";
import GoBackNavigation from "../../../components/navigation/go-back.navigation";

const InventoryImportForm = () => {
  const history = useHistory();

  const [pageLoading, setPageLoading] = useState(false);
  const [config, setConfig] = useState<any>({
    warehouse: null,
    reason: "",
    notes: "",
    description: null,
    reasonList: [],
  });

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
      tagLine:
        "Use this form to add, subtract or set stock in bulk using a csv file. Stock will be modified based on the Adjustment type you have selected",
    },
  });

  const [adjustTypeFormOptions, setAdjustTypeFormOption] = useState({
    markComplete: {
      show: false,
    },
    types: {
      disabled: false,
    },
  });

  const [dropBoxOptions, setDropBoxOptions] = useState({
    dropBox: {
      show: true,
    },
  });

  const [summary, setSummary] = useState({
    rows: 0,
    quantity: 0,
  });

  const [stockObject, setStockObject] = useState<any>(null);

  const [adjustmentType, setAdjustmentType] = useState<string | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);

  const { id: stockDocId }: any = useParams();

  const pageType = stockDocId ? "edit" : "create";

  const [alert, setAlert] = useState<any>({
    isShow: false,
    type: "success",
    msg: null,
  });

  const [saving, setSaving] = useState(false);

  const { control, reset } = useForm<any>({});

  const { isDirty } = useFormState({ control });

  const isAnyChange = () => {
    if (pageType === "create") {
      return true;
    }

    return isDirty;
  };

  useEffect(() => {
    if (pageType === "edit") {
      setPageLoading(true);
      getAdjustStock({
        id: stockDocId,
      })
        .then((res) => {
          let data: any = res.data;
          initPageWithData(data);
          setPageLoading(false);
        })
        .catch((error) => {
          setPageLoading(false);
          console.log(error);
        });
    }
  }, []);

  const initPageWithData = (data: any) => {
    setStockObject(data);
    let inProcessing = isProcessing({
      isBulk: data?.is_bulk || false,
      isCompleted: data?.is_complete || false,
      linesCount: data?.lines_count || -1,
    });
    setIsCompleted(data.is_complete);
    setAdjustTypeFormOption({
      ...adjustTypeFormOptions,
      types: {
        disabled: data.is_complete || inProcessing,
      },
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
        user: data.user?.full_name,
      },
    });
    setConfigFormOptions({
      ...configFormOptions,
      warehouse: {
        disabled: data.is_complete || inProcessing,
      },
      // reason: {
      //   disabled: data.is_complete || inProcessing,
      // },
      // notes: {
      //   disabled: data.is_complete || inProcessing,
      // },
      description: {
        ...configFormOptions.description,
        show: pageType === "edit",
      },
    });

    setSummary({
      rows: data.lines_count ? data.lines_count : 0,
      quantity: parseFloat(data.total_quantity),
    });

    setAdjustmentType(data.adjustment_type);
  };

  const handleUpload = async (files: FileList) => {
    if (!adjustmentType) {
      setAlert({
        isShow: true,
        type: "error",
        msg: {
          title: "Select adjusment type",
        },
      });
      return;
    }

    if (files.length <= 0) {
      return;
    }
    let inputFR: any = new FileReader();
    inputFR.readAsText(files[0]);
    inputFR.onload = async () => {
      let body = new Blob([inputFR.result], { type: "text/csv" });
      let createdDoc: any;
      if (pageType === "edit") {
        try {
          let res = await importAdjustStock({
            id: stockDocId,
            body: body,
          });

          if (res.data.errors && res.data.errors.length > 0) {
            let blobObj = createCSVBlob(res.data.errors);
            downloadBlob(blobObj, "import-stock-errors.csv");
          } else {
            initPageWithData(res.data);
            reset({});
          }
        } catch (error: any) {
          if (error.response) {
            if (
              error.response.data.errors &&
              error.response.data.errors.length > 0
            ) {
              let blobObj = createCSVBlob(error.response.data.errors);
              downloadBlob(blobObj, "import-stock-errors.csv");
            }
          }
        }
      }

      if (pageType === "create") {
        try {
          //first create doc
          let res = await createAdjustStock({
            body: {
              warehouse_id: config.warehouse.value,
              reason: config["reason"][0]?.["label"] || "",
              notes: config.notes,
              adjustment_type: adjustmentType,
              is_bulk: true,
              lines: [],
            },
          });
          createdDoc = res.data;
          reset({});
        } catch (error) {
          console.log(error);
          return;
        }

        // secondly, upload csv to import
        try {
          let res = await importAdjustStock({
            id: createdDoc.id,
            body: files[0],
          });
          if (res.data.errors && res.data.errors.length > 0) {
            let blobObj = createCSVBlob(res.data.errors);
            downloadBlob(blobObj, "import-stock-errors.csv");
            if (createdDoc) {
              history.push(
                "/" +
                  PAGE_PATHS.ADJUST_STOCK_IMPORT_EDIT.replace(
                    ":id",
                    createdDoc.id
                  )
              );
            }
          } else {
            history.push(
              "/" +
                PAGE_PATHS.ADJUST_STOCK_IMPORT +
                "edit/" +
                createdDoc.id +
                "/"
            );
          }
        } catch (error: any) {
          if (error.response) {
            if (
              error.response.data.errors &&
              error.response.data.errors.length > 0
            ) {
              let blobObj = createCSVBlob(error.response.data.errors);
              downloadBlob(blobObj, "import-stock-errors.csv");
            }
          }
          if (createdDoc) {
            history.push(
              "/" +
                PAGE_PATHS.ADJUST_STOCK_IMPORT_EDIT.replace(
                  ":id",
                  createdDoc.id
                )
            );
          }
        }
      }
    };
  };

  const downloadSampleCSV = () => {
    let filename = APP_CONSTANTS.SAMPLE_FILE.ADJUST_STOCK_LINES;
    getCSVSample({
      filename: filename,
    })
      .then((res: any) => {
        downloadBlob(res, "stock-import-sample.csv");
      })
      .catch((error: any) => {});
  };

  const downloadFile = () => {
    let filename = "stock_document_lines.csv";
    exportFile({
      filename: filename,
      type: "ADJUST_STOCK_LINES",
      id: stockDocId,
    })
      .then((res: any) => {
        downloadBlob(res, filename);
      })
      .catch((error: any) => {});
  };

  const handleSaveDoc = async () => {
    if (!adjustmentType) {
      setAlert({
        isShow: true,
        type: "error",
        msg: {
          title: "Select adjusment type",
        },
      });
      return;
    }
    let doc: any;
    if (pageType === "create") {
      try {
        setSaving(true);
        let res = await createAdjustStock({
          body: {
            warehouse_id: config.warehouse.value,
            reason: config["reason"][0]?.["label"] || "",
            notes: config.notes,
            adjustment_type: adjustmentType,
            is_bulk: true,
            lines: [],
          },
        });
        doc = res.data;
        initPageWithData(doc);
        setSaving(false);
        reset({});
        history.push(
          "/" + PAGE_PATHS.ADJUST_STOCK_IMPORT + "edit/" + doc.id + "/"
        );
      } catch (error: any) {
        setSaving(false);
        console.log(error);
      }
    }

    if (pageType === "edit") {
      try {
        setSaving(true);
        let res = await updateAdjustStock({
          id: stockDocId,
          body: {
            warehouse_id: config.warehouse.value,
            reason: config["reason"][0]?.["label"] || "",
            notes: config.notes,
            adjustment_type: adjustmentType,
            is_bulk: true,
            lines: [],
          },
        });
        setSaving(false);
        doc = res.data;
        reset({});
        initPageWithData(doc);
      } catch (error) {
        setSaving(false);
      }
    }
  };

  const isProcessing = (data: {
    linesCount: number;
    isCompleted: boolean;
    isBulk: boolean;
  }) => {
    if (
      data.linesCount > 0 &&
      data.isCompleted === false &&
      data.isBulk === true
    ) {
      return true;
    }
    return false;
  };

  const showImportList = () => {
    if (pageType === "create") {
      return false;
    }

    if (pageType === "edit") {
      if (stockObject?.lines_count > 0) {
        return true;
      }
    }

    return false;
  };

  const showImportSummary = () => {
    if (pageType === "create") {
      return false;
    }

    if (pageType === "edit") {
      if (stockObject?.lines_count > 0) {
        return true;
      }
    }

    return false;
  };

  const showDragDropBox = () => {
    if (pageType === "create") {
      return true;
    }

    if (pageType === "edit") {
      if (stockObject?.lines_count === 0) {
        return true;
      }
    }

    return false;
  };

  const getStatusString = (isComplete?: boolean, linesCount?: number) => {
    if (isComplete) {
      return "Done";
    }

    if (linesCount) {
      if (linesCount > 0 && !isComplete) {
        return "In Progress";
      }
    }

    return "Draft";
  };

  const getStatusClass = (isComplete?: boolean, linesCount?: number) => {
    if (isComplete) {
      return "badge-label-success";
    }

    if (linesCount) {
      if (linesCount > 0 && !isComplete) {
        return "badge-label-info";
      }
    }

    return "badge-label-primary";
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

  const handleAddNewReason = async () => {
    let reason = prompt("Add New Reason");
    if (reason) {
      try {
        let res: any = await createAdjustmentReason({
          body: {
            name: reason,
          },
        });
        setAlert({
          isShow: true,
          type: "success",
          msg: {
            title: "Reason added",
            desc: "",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

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
  };

  const allowDelete = () => {
    return pageType === "edit" && !isCompleted && stockObject?.lines_count <= 0;
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Page loading={pageLoading} extraSpace={true}>
        <Page.Header>
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "5px" }}>
            <GoBackNavigation></GoBackNavigation>
            <Page.Title>
              <span>Upload File</span>
              <span className="doc-number ms-1">
                {pageType === "edit" && stockObject?.number
                  ? "#" + stockObject["number"]
                  : ""}
              </span>
            </Page.Title>
          </div>
          <div className="tools" style={{ alignItems: "center" }}>
            {/* <button className="btn btn-light icon-btn adjust-form-head">
              <img className="icon-img sm" src="/images/help.svg" />
              Help
            </button> */}
            <div
              className={`text-nowrap badge-label ${getStatusClass(
                isCompleted,
                stockObject?.lines_count
              )}`}>
              {getStatusString(isCompleted, stockObject?.lines_count)}
            </div>
            {allowDelete() && (
              <img
                className={`icon-img cursor-pointer`}
                src="/images/delete.svg"
                onClick={() => handleDelete()}
              />
            )}
            {isAnyChange() ? (
              <button
                className={`text-nowrap btn btn-warning`}
                onClick={() => {
                  handleSaveDoc();
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "3px",
                }}>
                <Spinner
                  hidden={!saving}
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  className="border-sm spinner-md"
                  aria-hidden="true"
                />
                <img
                  className="icon-img exclamation-mark"
                  src="/images/exclamation.svg"
                />{" "}
                <span>Save</span>
              </button>
            ) : (
              <button
                className={`text-nowrap btn btn-success`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: "3px",
                }}>
                <img className="icon-img sm" src="/images/success.svg" />{" "}
                <span>Saved</span>
              </button>
            )}
          </div>
        </Page.Header>

        <div className="inventory-form-container">
          <Row>
            <Col lg={8}>
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
                className="h-100"></ConfigForm>
            </Col>
            <Col lg={4}>
              <AdjustTypeForm
                className="h-100"
                options={adjustTypeFormOptions}
                type={adjustmentType}
                isCompleted={isCompleted}
                onTypeChange={(type) => {
                  setAdjustmentType(type);
                }}
                control={control}></AdjustTypeForm>
            </Col>
          </Row>
          <div className="inventory-form"></div>

          {/* <div className="mt-3"> */}

          <Row className="mt-4">
            <Col lg={8}>
              <Page.Body>
                {showDragDropBox() && (
                  <div style={{ padding: "10px" }}>
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="outline-primary"
                        className="mb-3 import-download-btn"
                        style={{ color: "#5f5f5f" }}
                        onClick={() => {
                          downloadSampleCSV();
                        }}>
                        <img
                          src="/images/download.svg"
                          alt="download"
                          className="icon-img sm"
                          style={{ marginRight: ".5rem" }}
                        />
                        Download Sample
                      </Button>
                    </div>
                    <DragAndDrop
                      allowType=".csv"
                      onUpload={(files: FileList) => {
                        // console.log(files);
                        handleUpload(files);
                      }}
                      onError={(errors: any) => {
                        // console.log(errors)
                      }}
                    />
                  </div>
                )}
                {showImportList() && (
                  <ImportList docId={stockDocId}></ImportList>
                )}
              </Page.Body>
            </Col>
            <Col lg={4}>
              {showImportSummary() && (
                <div className="bg-white p-4">
                  <div style={{ textAlign: "right" }}>
                    <Button
                      variant="outline-primary"
                      className="mb-3 import-download-btn"
                      style={{ color: "#5f5f5f" }}
                      onClick={() => {
                        downloadFile();
                      }}>
                      <img
                        src="/images/download.svg"
                        alt="download"
                        className="icon-img sm"
                        style={{ marginRight: ".5rem" }}
                      />
                      Download File
                    </Button>
                  </div>
                  <ImportSummary data={summary}></ImportSummary>
                </div>
              )}
            </Col>
          </Row>
          {/* </div> */}
        </div>
        {alert.isShow && (
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
            }}></Page.AlertBox>
        )}
      </Page>
    </form>
  );
};

export default InventoryImportForm;
