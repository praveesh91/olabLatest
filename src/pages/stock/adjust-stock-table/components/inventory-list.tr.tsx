import { useEffect, useState } from "react";
import EditStockForm from "./edit-stock.form";
import HistoryModal from "./history.modal";
import { displayNumber } from "../../../../services/conversion.service";
import ThumbnailImage from "../../../../components/images/thumbnail.image";

const InventoryListTr = ({ row }: any) => {
  const [newStockVal, setNewStockVal] = useState(null);

  return (
    <tr className="align-middle">
      <td>
        <ThumbnailImage
          path={row?.product?.image_url || ""}
          size="md"
          altSize="md"
        ></ThumbnailImage>
      </td>
      <td>
        <div className="des-tag des-tag-xs" style={{ maxWidth: "200px" }}>
          <div className="title title-case">{row["product"]["name"]}</div>
          <div className="des font-weight-bold">{row["product"]["sku"]}</div>
        </div>
      </td>
      <td>
        <div className="comparator-box right">
          <div className="first-obj">
            <div className="value">{displayNumber(row["in_stock"])}</div>
          </div>
          <div
            className="symbol"
            hidden={newStockVal !== null || newStockVal === "" ? false : true}
          >
            <i className="fa fa-angle-right"></i>
          </div>
          <div
            className="second-obj"
            hidden={newStockVal !== null || newStockVal === "" ? false : true}
          >
            <div className="value">{newStockVal}</div>
          </div>
        </div>
      </td>
      <td className="text-end">{displayNumber(row["booked"])}</td>
      <td>
        <EditStockForm
          stockObj={row}
          onUpdate={(value: any) => {
            setNewStockVal(value);
          }}
        ></EditStockForm>
      </td>
      <td className="text-center">
        <HistoryModal stockObj={row}></HistoryModal>
      </td>
    </tr>
  );
};

export default InventoryListTr;
