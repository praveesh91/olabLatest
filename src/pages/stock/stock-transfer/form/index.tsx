import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Controller, useForm, useFormState } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import Badge from "../../../../components/badges/basic-badge.badge";
import GoBackNavigation from "../../../../components/navigation/go-back.navigation";
import Page from "../../../../components/pages/basic.page";
import createStockTransfer from "../../../../services/apis/operations/stock-transfer/create-stock-transfer.service";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import BrowseProductModal from "../../../../components/modals/browse-product-modal";
import ConfigForm from "./components/config-form";
import MarkCompleteForm from "./components/mark-complete-form";
import getStockTransfer from "../../../../services/apis/operations/stock-transfer/get-stock-transfer.service";
import StockLines from "./components/stock-lines.table";
import listStockLevels from "../../../../services/apis/stock/list-stock-levels.service";
import { getMaxIndexNumber, getProductIdsFromLines, getProductIdsFromProductList } from "../../../../services/get-values.service";
import { fillLinesWithStockLevels } from "../../../../services/fill-record.services";
import { sortListBy } from "../../../../services/list-service";
import markComplete from "../../../../services/apis/operations/stock-transfer/mark-complete.service";
import { useSelector } from "react-redux";
import updateStockTransfer from "../../../../services/apis/operations/stock-transfer/update-stock-transfer.service";
import deleteStockTransfer from "../../../../services/apis/operations/stock-transfer/delete-stock-transfer.service";
import "./index.css";

const StockTransferForm = () => {
  const { id: docId }: any = useParams();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const history = useHistory();
  const pageType = docId ? "edit" : "create";
  const [configFormOptions, setConfigFormOptions] = useState({
    fromWarehouse: {
      disabled: false,
    },
    toWarehouse: {
      disabled: false,
    },
    notes: {
      disabled: false,
    },
    description: {
      show: false,
      tagLine: "Use this form to Transfer Stock between warehouses"
    },
  });
  const [isChanged, setIsChanged] = useState<boolean>(true);
  const [configFormData, setConfigFormData] = useState<any>({
    fromWarehouse: null,
    toWarehouse: null,
    notes: "",
    description: null,
  });
  const warehousesList = useSelector(
    (state: any) => state.components.warehouses.list
  );
  const [lines, setLines] = useState<any[]>([]);
  const { control, reset } = useForm<any>({});
  const { isDirty } = useFormState({ control });
  const [alert, setAlert] = useState<any>({
    isShow: false,
    type: "success",
    msg: {
      title: "",
      desc: "",
    },
  });

  const [allowDelete, setAllowDelete] = useState<boolean>(true);

  const [markCompleteConfig, setMarkCompleteConfig] = useState<any>(
    {
      markComplete: {
        show: true,
        showLoader: false,
        completed: false,
        disabled: false,
      }
    }
  );

  const getDocStatus = (isComplete?: boolean) => {
    if (isComplete) {
      return "Done";
    }

    return "Draft";
  };

  useEffect(() => {
    setAllowDelete(pageType === "edit" && !markCompleteConfig.markComplete.completed);
  }, [markCompleteConfig.markComplete.completed]);

  const getStatusVariant = (
    isComplete: boolean,
  ) => {
    if (isComplete) {
      return "success";
    }

    return "primary";
  };

  const isAnyChange = () => {
    if (pageType === "create") {
      return true;
    }

    return isDirty;
  };

  useEffect(() => {
    setIsChanged(isAnyChange());
  }, [isDirty]);

  useEffect(() => {
    if (pageType === "edit") {
      setPageLoading(true);
      getStockTransfer({
        id: docId,
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
  }, [])

  const initPageWithData = async (data: any) => {
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

    data.lines = fillLinesWithStockLevels(data["lines"], stockLevels);

    setLines(data.lines);

    setMarkCompleteConfig((last: any) => {
      return {
        ...last,
        markComplete: {
          show: true,
          showLoader: false,
          completed: data?.is_complete || false,
        }
      }
    });


    setConfigFormOptions((last: any) => {
      return {
        ...last,
        fromWarehouse: {
          disabled: data?.is_complete || false
        },
        toWarehouse: {
          disabled: data?.is_complete || false
        },
        notes: {
          disabled: false
        },
        description: {
          ...last.description,
          show: true
        }
      }
    });

    setConfigFormData((last: any) => {
      return {
        ...last,
        fromWarehouse: {
          label: data.warehouse.code,
          value: data.warehouse.id,
          fullObj: data.warehouse,
        },
        toWarehouse: {
          label: data.to_warehouse.code,
          value: data.to_warehouse.id,
          fullObj: data.to_warehouse,
        },
        notes: data.notes,
        description: {
          createdAt: data.created,
          updatedAt: data.updated,
          user: data?.user?.full_name || "",
        },
      }
    });

  }

  useEffect(() => {
    if (!configFormData.toWarehouse) {
      if (warehousesList.length >= 2) {
        setConfigFormData({
          ...configFormData,
          toWarehouse: {
            label: warehousesList[1].code,
            value: warehousesList[1].id,
            fullObj: warehousesList[1],
          },
          fromWarehouse: {
            label: warehousesList[0].code,
            value: warehousesList[0].id,
            fullObj: warehousesList[0]
          }
        })
      }
    }
  }, [warehousesList]);

  const handleSave = async () => {
    if (!configFormData.fromWarehouse) {
      setAlert({
        isShow: true,
        type: "error",
        msg: {
          title: "please select From Warehouse",
        },
      });
      return;
    }

    if (!configFormData.toWarehouse) {
      setAlert({
        isShow: true,
        type: "error",
        msg: {
          title: "Please select To Warehouse",
        },
      });
    }


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

    if (configFormData.fromWarehouse?.fullObj?.id === configFormData.toWarehouse?.fullObj?.id) {
      setAlert({
        isShow: true,
        type: "error",
        msg: {
          title: "Warehouses can not be same",
        },
      });
      return
    }

    let resData: any;
    if (pageType === "edit") {
      setSaving(true);
      try {
        let res = await updateStockTransfer({
          id: docId,
          body: {
            warehouse_id: configFormData.fromWarehouse.fullObj.id,
            to_warehouse_id: configFormData.toWarehouse.fullObj.id,
            notes: configFormData.notes,
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
        let res = await createStockTransfer({
          body: {
            warehouse_id: configFormData.fromWarehouse.fullObj.id,
            to_warehouse_id: configFormData.toWarehouse.fullObj.id,
            notes: configFormData.notes,
            lines: lines,
          },
        });
        resData = res.data;
        setSaving(false);
        reset({});
        history.push(
          "/" +
          PAGE_PATHS.STOCK_TRANSFER_EDIT.replace(":id", resData.id) +
          ""
        );
      } catch (error) {
        setSaving(false);
        console.log(error);
      }
    }
  };

  const [saving, setSaving] = useState<boolean>(false);

  const handleMarkComplete = async () => {
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

    setMarkCompleteConfig((last: any) => {
      return {
        ...last,
        markComplete: {
          ...last.markComplete,
          showLoader: true,
          disabled: true,
        }
      }
    })

    setConfigFormOptions((last: any) => {
      return {
        ...last,
        fromWarehouse: {
          disabled: true
        },
        toWarehouse: {
          disabled: true
        },
        notes: {
          disabled: true
        }
      }
    });
    try {
      const res: any = await markComplete({
        id: docId,
      });
      initPageWithData(res.data);
      setMarkCompleteConfig((last: any) => {
        return {
          ...last,
          markComplete: {
            ...last.markComplete,
            showLoader: false
          }
        }
      })
    } catch (error) {
      setConfigFormOptions((last: any) => {
        return {
          ...last,
          fromWarehouse: {
            disabled: false
          },
          toWarehouse: {
            disabled: false
          },
          notes: {
            disabled: false
          }
        }
      });
      setMarkCompleteConfig((last: any) => {
        return {
          ...last,
          markComplete: {
            ...last.markComplete,
            showLoader: false
          }
        }
      })
      console.log(error);
    }
  }

  const createLine = (product: any, indexNumber: number) => {
    let line = {
      product: product,
      product_id: product.id,
      index_number: indexNumber,
      quantity: "",
    };
    return line;
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

  const handleDelete = async () => {
    if (!window.confirm("Document will be deleted. Are you sure?")) {
      return;
    }
    try {
      setPageLoading(true);
      let res = await deleteStockTransfer({ id: docId || -1 });
      setPageLoading(false);
      history.push("/" + PAGE_PATHS.STOCK_TRANSFER_LIST);
    } catch (error) {
      setPageLoading(false);
      console.log(error);
    }
  }

  return (
    <Page loading={pageLoading} className={`h-100 ${!pageLoading ? "custom-overflow-auto-imp" : ""}`}>
      <Page.Header>
        <div style={{ display: "flex", alignItems: "center", columnGap: "5px" }}>
          <GoBackNavigation></GoBackNavigation>
          <Page.Title>Stock Transfer Form</Page.Title>
        </div>
        <div className="tools" style={{ alignItems: "center" }}>
          <Badge variant={getStatusVariant(markCompleteConfig.markComplete.completed)}>
            {
              getDocStatus(markCompleteConfig.markComplete.completed)
            }
          </Badge>
          {allowDelete && <img className={`icon-img cursor-pointer`} src="/images/delete.svg" onClick={() => handleDelete()} />}
          {
            isChanged ? <button
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
      <Page.Body style={{ backgroundColor: "#f6f7f9", marginBottom: "123px" }}>
        <Container className="p-0 mb-4">
          <Row>
            <Col md={8} lg={8} xl={8}>
              <div className="bg-white h-100">
                <ConfigForm
                  options={configFormOptions}
                  data={configFormData}
                  onChange={(key, data) => {
                    setConfigFormData(data);
                  }}
                  control={control}
                  className={"h-100"}
                ></ConfigForm>
              </div>
            </Col>
            <Col md={4} lg={4} xl={4}>
              <div className="bg-white h-100">
                <MarkCompleteForm
                  options={markCompleteConfig}
                  onMarkComplete={() => {
                    handleMarkComplete();
                  }}
                >
                </MarkCompleteForm>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="pt-3 bg-white">
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
                  warehouseId={configFormData?.fromWarehouse?.value || -1}
                  warehouseCode={configFormData?.fromWarehouse?.label || ""}
                  disabled={markCompleteConfig.markComplete.showLoader || markCompleteConfig.markComplete.completed}
                />
              )}
            />
          </div>
          <Controller
            name="form-stock-lines"
            control={control}
            render={({ field }: any) => (
              <StockLines
                rows={lines}
                disabled={markCompleteConfig.markComplete.showLoader || markCompleteConfig.markComplete.completed}
                fromWarehouse={configFormData.fromWarehouse?.fullObj || null}
                toWarehouse={configFormData.toWarehouse?.fullObj || null}
                onUpdate={(lines: any) => {
                  setLines([...lines]);
                  field.onChange(lines);
                }}></StockLines>
            )}
          />
        </Container>
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
    </Page >
  )
};

export default StockTransferForm;
