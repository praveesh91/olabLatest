import { useEffect, useState } from "react";
import { Form, OverlayTrigger, Row, Col, Tooltip } from "react-bootstrap";
import NameSkuContent from "../../../../components/content/name-sku.content";
import { displayNumber } from "../../../../services/conversion.service";
import APP_CONSTANTS from "../../../../utils/constants/app.constants";

const Line = ({
  line,
  index,
  onUpdate,
  onDeleteLine,
  warehouse,
  adjustmentType,
  disabled = false
}: any) => {
  const getFutureStockValue = (
    oldValue: number,
    quantity: number,
    adjustmentType: string
  ) => {
    if (oldValue === null) {
      return 0;
    }

    if (adjustmentType === APP_CONSTANTS.STOCK_ACTION.ADD) {
      return oldValue + quantity;
    }

    if (adjustmentType === APP_CONSTANTS.STOCK_ACTION.SUB) {
      return oldValue - quantity;
    }

    if (adjustmentType === APP_CONSTANTS.STOCK_ACTION.SET) {
      return quantity;
    }

    return oldValue;
  };

  const getTrackingTypeName = (id?: number) => {
    if (id) {
      return APP_CONSTANTS.TRACKING_TYPE_NAME[id];
    }
    return "";
  }

  return (
    <tr className="align-middle inventory-form-tr">
      <td className="ps-4 text-center">{index + 1}</td>
      <td className="align-middle">
        <NameSkuContent size="xs" name={
          <>{line?.product?.name || ""}
            <OverlayTrigger
              delay={{ hide: 450, show: 300 }}
              overlay={(props) => <Tooltip {...props}>
                <div style={{ textAlign: "left" }}>
                  <div>Name: {line?.product?.name}</div>
                  <div>Sku: {line?.product?.sku}</div>
                  <div>UOM: {line?.product?.uom}</div>
                  <div>Category: {line?.product?.group1?.name}</div>
                  <div>Tracking Type: {getTrackingTypeName(line?.product?.tracking_type)}</div>
                </div>
              </Tooltip>}
              placement="left"
            >
              <i className="fa fa-info-circle ms-2" />
            </OverlayTrigger></>
        } sku={line?.product?.sku || ""}></NameSkuContent>
      </td>
      <td className="text-end">
        {disabled ? line["stockByWarehouse"]?.[warehouse?.id]?.["in_stock"] : <div className="comparator-box right">
          <div className="first-obj">
            <div className="value">
              {line["stockByWarehouse"]?.[warehouse?.id]?.["in_stock"]}
            </div>
          </div>
          <div className="symbol" hidden={line.quantity === "" || !adjustmentType ? true : false}>
            <i className="fa fa-angle-right"></i>
          </div>
          <div
            className="second-obj"
            hidden={line.quantity === "" || !adjustmentType ? true : false}
          >
            <div className="value">
              {getFutureStockValue(
                displayNumber(
                  line["stockByWarehouse"]?.[warehouse?.id]?.["in_stock"]
                ) || 0,
                displayNumber(line?.quantity) || 0,
                adjustmentType
              )}
            </div>
          </div>
        </div>}
      </td>
      <td className="text-end">{line?.product?.booked}</td>
      <td className="align-middle">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingLeft: "2rem",
          }}
        >
          <Form.Group as={Row}>
            <Form.Label
              column
              lg={1}
              className="me-4"
              style={{ fontSize: "1.1rem", color: "#7d7ab9" }}
            >
              {adjustmentType || line.adjustment_type}
            </Form.Label>
            <Col>
              <Form.Control
                disabled={disabled}
                // required
                name="qty"
                type="number"
                maxLength={10}
                style={{ maxWidth: "10rem" }}
                value={line?.quantity || ""}
                onWheel={(e: any) => e.target.blur()}
                onChange={(e) => {
                  let tempLine = { ...line, quantity: e.target.value };
                  if (onUpdate) {
                    onUpdate(tempLine);
                  }
                }}
              />
            </Col>
          </Form.Group>
        </div>
      </td>
      <td className="text-end">
        <button className="btn btn-outline-secondary btn-one-icon p-2" disabled={disabled} onClick={() => {
          if (onDeleteLine) {
            onDeleteLine(line);
          }
        }}><img
            src="/images/simple-cross.svg"
            alt="cross"
            className="icon-img"
            style={{ cursor: "pointer" }}
          /></button>
      </td>
    </tr >
  );
};

export default Line;
