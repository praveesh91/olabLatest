import React, { useState, useEffect } from "react";
import axios from "axios";
import { getWarehouseDropdownList } from "../../services/conversion.service";
import { BACKEND_API_PATHS } from "../../utils/constants/backend-api-path.constants";
import SelectDropdown from "./select.dropdown";

function WarehouseDropdown({ onChange = null }: any) {
  const [warehouseData, setWarehouseData] = useState<any>([]);

  const url = BACKEND_API_PATHS.BASE + BACKEND_API_PATHS.WAREHOUSES;
  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        const WarehouseDropdownList = getWarehouseDropdownList(res.data);
        setWarehouseData(WarehouseDropdownList);
      })
      .catch((err) => {
        console.log("WarehouseDropdown-Error:", err);
      });
  }, []);
  return (
    <SelectDropdown
      className="browse-products-modal-select"
      list={warehouseData}
      selected={warehouseData[0]}
      placeHolder="Select Warehouse"
      onChange={onChange}
    ></SelectDropdown>
  );
}

export default WarehouseDropdown;
