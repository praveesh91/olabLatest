import { listeners } from "process";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  performFetchStockList,
  updateStockListConfig,
} from "../../../../services/redux/slices/inventory.slice";

const AppliedFilterGroup = () => {
  const dispatcher = useDispatch();
  const [appliedFilterList, setAppliedFilterList] = useState<any>([]);
  const stockListConfig = useSelector(
    (state: any) => state.inventory.stockList.config
  );
  const globalConfig = useSelector(
    (state: any) => state.inventory.globalConfig
  );

  const createListFromStockConfig = (config: any) => {
    let tempList = [];
    for (let key in config) {
      if (key == "search" && config[key]) {
        tempList.push({
          type: "search",
          label: "search: " + config[key],
          scope: "stockListConfig",
        });
      } else if (key == "category" && config["category"]) {
        tempList.push({
          type: "category",
          label: "category: " + config["category"]["name"],
          scope: "stockListConfig",
        });
      } else if (key == "bundle" && config["bundle"]) {
        let list = config["bundle"]["components"].map((component: any) => {
          return component.component.name;
        });
        tempList.push({
          type: "bundle",
          label: "bundle: " + list.join(),
          scope: "stockListConfig",
        });
      } else if (
        key == "productTags" &&
        config["productTags"] &&
        config["productTags"].length > 0
      ) {
        let list = config["productTags"].map((tag: any) => {
          return tag.name;
        });
        tempList.push({
          type: "productTags",
          label: "tags: " + list.join(),
          scope: "stockListConfig",
        });
      } else if (key == "onlineListing" && config["onlineListing"]) {
        if (config["onlineListing"] == "yes") {
          tempList.push({
            type: "onlineListing",
            label: "listing: Yes",
            scope: "stockListConfig",
          });
        } else if (config["onlineListing"] == "no") {
          tempList.push({
            type: "onlineListing",
            label: "listing: No",
            scope: "stockListConfig",
          });
        }
      } else if (
        key == "belowThreshold" &&
        config["belowThreshold"] &&
        config["belowThreshold"] == "yes"
      ) {
        tempList.push({
          type: "belowThreshold",
          label: "below threshold: Yes",
          scope: "stockListConfig",
        });
      }
    }
    return tempList;
  };

  const removeFilter = (config: any, item: any) => {
    let tempConfig = config;
    if (item.type == "search") {
      tempConfig = { ...tempConfig, search: null };
    } else if (item.type == "bundle") {
      tempConfig = { ...tempConfig, bundle: null };
    } else if (item.type == "productTags") {
      tempConfig = { ...tempConfig, productTags: [] };
    } else if (item.type == "belowThreshold") {
      tempConfig = { ...tempConfig, belowThreshold: "all" };
    } else if (item.type == "onlineListing") {
      tempConfig = { ...tempConfig, onlineListing: "all" };
    } else if (item.type == "category") {
      tempConfig = { ...tempConfig, category: null };
    }
    return tempConfig;
  };

  useEffect(() => {
    let list = createListFromStockConfig(stockListConfig);
    setAppliedFilterList(list);
  }, [stockListConfig]);

  useEffect(() => {}, [stockListConfig.search]);

  return (
    <div
      className="group gap-md"
      style={{ padding: "10px 0px", flexWrap: "wrap" }}
    >
      {appliedFilterList.map((filter: any, i: string | number) => (
        <span key={i} className="tag tag-default">
          {filter.label}
          <span
            className="thin-close cursor-pointer"
            onClick={() => {
              let newConfig = {};
              if ((filter.scope = "stockListConfig")) {
                newConfig = removeFilter(stockListConfig, filter);
              }

              dispatcher(
                performFetchStockList(
                  {
                    config: {...globalConfig, ...newConfig},
                  },
                  () => {
                    if ((filter.scope = "stockListConfig")) {
                      dispatcher(updateStockListConfig(newConfig));
                    }
                  }
                )
              );
            }}
          ></span>
        </span>
      ))}
    </div>
  );
};

export default AppliedFilterGroup;
