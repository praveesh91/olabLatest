import { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import SelectDropdown from "../../../components/dropdowns/select.dropdown";
import TypeaheadInput from "../../../components/inputs/typeahead.input";
import listAdjustmentReasons from "../../../services/apis/operations/adjust-stock/adjustment-reasons/list-adjustment-reasons.service";
import {
  displayLocaleDateTime,
  getWarehouseDropdownList,
} from "../../../services/conversion.service";
import APP_CONSTANTS from "../../../utils/constants/app.constants";

const ConfigForm = ({
  data,
  onChange,
  options = {
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
      tagLine: ""
    },
  },
  control,
  onReasonInputClick,
  onNewClick,
  className = ""
}: {
  data: {
    warehouse: any;
    reason: any;
    notes: string;
    description?: any;
    reasonList: any[];
  };
  onChange?: (
    key: string,
    data: { warehouse: any; reason: any; notes: string }
  ) => void;
  options?: {
    warehouse: any;
    reason: any;
    notes: any;
    description: any;
  };
  control: any;
  onReasonInputClick?: any;
  onNewClick?: () => void;
  className?: string;
}) => {
  //fetching warehouse list from redux store
  const warehousesList = useSelector(
    (state: any) => state.components.warehouses.list
  );

  const [config, setConfig] = useState(() => {
    return {
      warehouse: data.warehouse ? data.warehouse : null,
      reason: data?.reason || [],
      notes: data.notes ? data.notes : "",
    };
  });

  const [settings, setSettings] = useState<any>(options);

  useEffect(() => {
    if (data) {
      setConfig(data);
    }
  }, [data]);

  useEffect(() => {
    setSettings(options);
  }, [options]);

  useEffect(() => {
    if (warehousesList.length > 0) {
      if (!data.warehouse) {
        let tempConfig = {
          ...data,
          warehouse: {
            label: warehousesList[0].code,
            value: warehousesList[0].id,
            fullObj: warehousesList[0],
          },
        };
        setConfig(tempConfig);
        if (onChange) {
          onChange("warehouse", tempConfig);
        }
      }
    }
  }, [warehousesList]);

  return (
    <div className={`stock-form-box ${className}`}>
      {
        <div
          style={{
            fontSize: "12px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            alignItems: "start",
            columnGap: "10px"
          }}
        >
          <div style={{ maxWidth: "350px" }}>
            <div className="short-notes" style={{ marginTop: "0px" }}>
              {options?.description?.tagLine || ""}
            </div>
          </div>
          <div hidden={!options.description.show} className="short-notes text-end" style={{marginTop:"0px"}}>
            <div style={{ color: "rgba(78, 78, 78, 0.8)" }} className="text-nowrap">
              Created on:
              {data.description && <span className="ps-1">
                {displayLocaleDateTime(
                  data.description.createdAt,
                  APP_CONSTANTS.DATE_FORMAT.POST_DATE
                )}</span>}
            </div>
            <div style={{ color: "rgba(78, 78, 78, 0.8)" }} className="text-nowrap">
              Updated on:
              {data.description && <span className="ps-1">
                {displayLocaleDateTime(
                  data.description.updatedAt,
                  APP_CONSTANTS.DATE_FORMAT.POST_DATE
                )} </span>}
            </div>
            <div style={{ color: "rgba(78, 78, 78, 0.8)" }}>
              Created by:{data.description && <span className="ps-1">{data.description.user}</span>}
            </div>
          </div>
        </div>
      }
      {/* {loading && <ClockLoader></ClockLoader>} */}
      <div className="form-inline">
        <Form.Group as={Row}>
          <Form.Label column lg={4} className="head head-md">
            <div className="title">Warehouse</div>
            <div className="des">
              Select warehouse where stock levels will change
            </div>
          </Form.Label>
          <Col lg={8}>
            <Controller
              name="config-warehose"
              control={control}
              render={({ field }: any) => (
                <SelectDropdown
                  disabled={settings.warehouse.disabled}
                  list={getWarehouseDropdownList(warehousesList)}
                  selected={config.warehouse}
                  placeHolder="Select Warehouse"
                  onChange={(item: any) => {
                    if (onChange) {
                      onChange("warehouse", { ...config, warehouse: item });
                    }
                    setConfig({ ...config, warehouse: item });
                    field.onChange(item);
                  }}
                />
              )}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column lg={4} className="head head-md">
            <div className="title">Reason</div>
            <div className="des">
              For ex. Stock Take, Customer Return, Damaged Stock
            </div>
          </Form.Label>
          <Col lg={8}>
            <Controller
              name="config-reason"
              control={control}
              render={({ field }: any) => (
                <TypeaheadInput
                  selected={data?.reason || []}
                  disabled={options?.reason.disabled || false}
                  placeHolder="Select Reason"
                  options={data.reasonList}
                  onChange={(selected: any) => {
                    if (onChange && selected.length > 0) {
                      onChange("reason", {
                        ...config,
                        reason: selected,
                      });
                    }
                    setConfig({
                      ...config,
                      reason: selected,
                    });
                    field.onChange(selected);
                  }}
                  onInputClick={() => {
                    if (onReasonInputClick) {
                      onReasonInputClick();
                    }
                  }}
                  withNewButton={true}
                  onNewClick={() => {
                    if (onNewClick) {
                      onNewClick();
                    }
                  }}
                  onType={(text: string) => {
                    if (onChange) {
                      let temp: any = {
                        ...config,
                        reason: [{ label: text, value: -1 }],
                      };
                      onChange("reason", temp);
                    }
                    field.onChange([{ label: text, value: -1 }]);
                  }}
                />
              )}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column lg={4} className="head head-md">
            <div className="title">Notes</div>
          </Form.Label>
          <Col lg={8}>
            <Controller
              name="config-notes"
              control={control}
              render={({ field }: any) => (
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={config.notes ? config.notes : ""}
                  onChange={(e: any) => {
                    if (onChange) {
                      onChange("notes", { ...config, notes: e.target.value });
                    }
                    field.onChange(e.target.value);
                    setConfig({ ...config, notes: e.target.value });
                  }}
                  disabled={options.notes.disabled ? true : false}
                />
              )}
            />
          </Col>
        </Form.Group>
      </div>
    </div>
  );
};

export default ConfigForm;
