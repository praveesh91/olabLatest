import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  performFetchStockList,
  updateStockListConfig,
} from "../../../../services/redux/slices/inventory.slice";

const InventoryListSearchbar = () => {
  const dispatcher = useDispatch();
  const config = useSelector((state: any) => state.inventory.stockList.config);
  const globalConfig = useSelector(
    (state: any) => state.inventory.globalConfig
  );
  const [text, setText] = useState<string>("");

  const handleChange = (event: any) => {
    setText(event.target.value);
  };

  const handleKeyPress = (event: any) => {
    let newConfig = {
      ...globalConfig,
      ...config,
      search: text == "" ? null : text,
    };
    if (event.key == "Enter") {
      dispatcher(
        performFetchStockList(
          {
            config: newConfig,
          },
          () => {
            dispatcher(
              updateStockListConfig({
                ...config,
                search: text == "" ? null : text,
              })
            );
          }
        )
      );
    }
  };
  return (
    <div className="search-bar" style={{ minWidth: "350px" }}>
      <img className="icon-img icon-img-primary sm" src="/images/search.svg" />
      <input
        type="text"
        className="form-control"
        placeholder="Search By Name/SKU"
        value={text}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default InventoryListSearchbar;
