import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectDropdown from "../../../../components/dropdowns/select.dropdown";
import listWarehouses from "../../../../services/apis/app-settings/warehouses/list-warehouses.service";
import {
  convertObjToList,
  getDropdownList,
} from "../../../../services/conversion.service";
import {
  performFetchStockList,
  updateGlobalConfig,
} from "../../../../services/redux/slices/inventory.slice";

const WarehouseDropdown = () => {
  const [selectedItem, setSelectedItem] = useState<any>();
  const dispatcher = useDispatch();
  const warehouseList = useSelector((state:any) => state.components.warehouses.list);

  const globalConfig = useSelector(
    (state: any) => state.inventory.globalConfig
  );

  useEffect(() => {
    if (globalConfig.warehouses.length > 0) {
      setSelectedItem({
        label: globalConfig.warehouses[0]["name"],
        value: globalConfig.warehouses[0]["id"],
        fullObj: globalConfig.warehouses[0],
      });
    } else if (warehouseList.length > 0) {
      setSelectedItem({
        label: warehouseList[0]["name"],
        value: warehouseList[0]["id"],
        fullObj: warehouseList[0],
      });
      dispatcher(
        updateGlobalConfig({
          ...globalConfig,
          warehouses: [warehouseList[0]],
        })
      );
    }
  }, [warehouseList]);

  const stockListConfig = useSelector(
    (state: any) => state.inventory.stockList.config
  );

  const handleSelect = (item: any) => {
    let newGlobalConfig = { ...globalConfig, warehouses: [item.fullObj] };
    dispatcher(
      performFetchStockList(
        {
          config: { ...newGlobalConfig, ...stockListConfig },
        },
        () => {
          dispatcher(
            updateGlobalConfig({
              ...globalConfig,
              warehouses: [item.fullObj],
            })
          );
        }
      )
    );
  };

  return (
    <>
      <SelectDropdown
        className="warehouse"
        list={getDropdownList(warehouseList)}
        selected={selectedItem}
        placeHolder="Select Warehouse"
        onChange={handleSelect}
      ></SelectDropdown>
    </>
  );
};

export default WarehouseDropdown;
