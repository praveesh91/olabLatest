import React, { useEffect, useState } from "react";
import { Form, Col, Row, Button, Spinner } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import APP_CONSTANTS from "../../../utils/constants/app.constants";

const AdjustTypeForm = ({
  className = "",
  type,
  isCompleted,
  onTypeChange,
  onMarkComplete,
  options = {
    markComplete: {
      show: true,
      showLoader: false,
    },
    types: {
      disabled: false,
    },
  },
  control,
}: {
  className?: string;
  type: string | null;
  isCompleted: boolean;
  onTypeChange?: (newType: string) => void;
  onMarkComplete?: (item?: any) => void;
  options: { markComplete?: any; types?: any };
  control: any;
}) => {
  const [setting, setSetting] = useState<any>(options);

  const onRadioButtonClick = (value: string) => {
    if (onTypeChange) {
      onTypeChange(value);
    }
  };

  const handleMarkAsComplete = () => {
    if (onMarkComplete) {
      onMarkComplete();
    }
  };

  useEffect(() => {
    setSetting(options);
  }, [options]);

  return (
    <div
      className={`InventoryRadioform-container stock-form-box ${className}`}
    >
      <Form.Label className="head head-xl">
        <div className="title">Adjustment Type</div>
      </Form.Label>

      <div className="mt-3">
        <Form.Group as={Row} className="mb-3">
          <Col sm={10}>
            <Controller
              control={control}
              name="inventoryradio-form"
              render={({ field }: any) => (
                <Form.Check
                  type="radio"
                  label="Add Stock"
                  name="inventoryradio-form"
                  id="Add-Stock"
                  className="mb-3 inventoryradio-form-radio font-md"
                  checked={type === APP_CONSTANTS.STOCK_ACTION.ADD}
                  onChange={() => {
                    field.onChange(APP_CONSTANTS.STOCK_ACTION.ADD);
                    onRadioButtonClick(APP_CONSTANTS.STOCK_ACTION.ADD);
                  }}
                  disabled={options.types.disabled ? true : false}
                />
              )}
            />
            <Controller
              control={control}
              name="inventoryradio-form"
              render={({ field }: any) => (
                <Form.Check
                  type="radio"
                  label="Subtract Stock"
                  name="inventoryradio-form"
                  id="Subtract-Stock"
                  className="mb-3 inventoryradio-form-radio font-md"
                  onChange={() => {
                    field.onChange(APP_CONSTANTS.STOCK_ACTION.SUB);
                    onRadioButtonClick(APP_CONSTANTS.STOCK_ACTION.SUB);
                  }}
                  checked={type === APP_CONSTANTS.STOCK_ACTION.SUB}
                  disabled={options.types.disabled ? true : false}
                />
              )}
            />
            <Controller
              control={control}
              name="inventoryradio-form"
              render={({ field }: any) => (
                <Form.Check
                  type="radio"
                  label="Set Stock"
                  name="inventoryradio-form"
                  id="Set-Stock"
                  className="mb-3 inventoryradio-form-radio font-md"
                  onChange={() => {
                    field.onChange(APP_CONSTANTS.STOCK_ACTION.SET);
                    onRadioButtonClick(APP_CONSTANTS.STOCK_ACTION.SET);
                  }}
                  checked={type === APP_CONSTANTS.STOCK_ACTION.SET}
                  disabled={options.types.disabled ? true : false}
                />
              )}
            />
          </Col>
        </Form.Group>
      </div>

      <Button
        hidden={!setting.markComplete.show}
        onClick={handleMarkAsComplete}
        variant={isCompleted ? "success" : "primary"}
        className="w-100 text-no-wrap"
        disabled={isCompleted}
        style={{ marginBottom: "5px" }}
      >
        {options?.markComplete?.showLoader && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        <span> {isCompleted ? "Completed " : "Mark as Complete "}</span>

        <img
          src="/images/success.svg"
          alt="mark-as-complete"
          className="icon-img md align-middle"
          hidden={!isCompleted}
        />
      </Button>
      {options?.markComplete?.show && !isCompleted && (
        <div className="short-notes">
          Stock levels will change only when you click on Mark as Complete action.
        </div>
      )}
    </div>
  );
};

export default AdjustTypeForm;
