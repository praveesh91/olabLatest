import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClockLoader from "../../../../components/loaders/clock.loder";
import { convertObjToList } from "../../../../services/conversion.service";
import { performFetchStockList, setLoading } from "../../../../services/redux/slices/inventory.slice";
import InventoryListTr from "./inventory-list.tr";

const InventoryListTable = ({ list }: any) => {
  const inventoryList = useSelector(
    (state: any) => state.inventory.stockList.list
  );
  const loading = useSelector(
    (state: any) => state.inventory.stockList.loading
  );
  const config = useSelector((state: any) => state.inventory.stockList.config);
  const globalConfig = useSelector(
    (state: any) => state.inventory.globalConfig
  );
  const warehouseList = useSelector((state: any) => state.components.warehouses.list);
  const dispatcher = useDispatch();

  const [appliedSort, setAppliedSort] = useState<any>({
    type: null,
    value: null,
  });

  useEffect(() => {
    dispatcher(setLoading(true));
    let newConfig = { ...globalConfig, ...config };
    if(globalConfig.warehouses.length > 0) {
      dispatcher(
        performFetchStockList({
          config: newConfig,
        })
      );
    } else if (warehouseList.length > 0) {
      newConfig["warehouses"] = [warehouseList[0]];
      dispatcher(
        performFetchStockList({
          config: newConfig,
        })
      );
    }

  }, [warehouseList]);

  useEffect(() => {
    if (config.sort.length > 0) {
      setAppliedSort(config.sort[0]);
    } else {
      setAppliedSort({
        type: null,
        value: null,
      });
    }
  }, [config.sort]);

  return (
    <div className={`table-container ${loading ? "table-blur h-min-200px" : ""}`}>
      {loading && <ClockLoader></ClockLoader>}
      <table className={`table sticky-head-table product-list-table`}>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" style={{minWidth:"100px"}}>
              <div
                style={{
                  display: "flex",
                  columnGap: "10px",
                  alignItems: "center",
                }}
              >
                <div>Name/SKU</div>
                {appliedSort.type === "name" &&
                  (appliedSort.value == "+" ? (
                    <img className="icon-img xs" src="/images/up-arrow.png" />
                  ) : (
                    <img className="icon-img xs" src="/images/down-arrow.png" />
                  ))}
              </div>
            </th>
            <th scope="col" className="text-end" style={{minWidth:"100px"}}>
              <div
                style={{
                  display: "flex",
                  columnGap: "10px",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >
                <div>In Stock</div>
                {appliedSort.type === "in_stock" &&
                  (appliedSort.value == "+" ? (
                    <img className="icon-img xs" src="/images/up-arrow.png" />
                  ) : (
                    <img className="icon-img xs" src="/images/down-arrow.png" />
                  ))}
              </div>
            </th>
            <th scope="col" className="text-end" style={{minWidth:"100px"}}>
              Booked
            </th>
            <th scope="col" className="text-center">
              Quantity
            </th>
            <th scope="col" className="text-center" style={{minWidth:"100px"}}>
              History
            </th>
          </tr>
        </thead>
        <tbody>
          {inventoryList.map((item: any, i: string) => {
            return <InventoryListTr row={item} key={i}></InventoryListTr>;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryListTable;
