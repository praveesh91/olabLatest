import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  performFetchStockList,
  updateStockListConfig,
} from "../../../../services/redux/slices/inventory.slice";

const InventorySortDropdown = () => {
  const config = useSelector((state: any) => state.inventory.stockList.config);
  const globalConfig = useSelector(
    (state: any) => state.inventory.globalConfig
  );
  const dispatcher = useDispatch();

  useEffect(() => {
    if (config.sort && config.sort.length > 0) {
      setSelectedSort(config.sort[0]);
    } else {
      setSelectedSort({
        type: null,
        value: null,
      });
    }
  }, [config.sort]);

  const applySort = (data: any) => {
    setSelectedSort(data);
    dispatcher(
      performFetchStockList(
        {
          config: { ...globalConfig, ...config, sort: [data] },
        },
        () => {
          dispatcher(updateStockListConfig({ ...config, sort: [data] }));
        }
      )
    );
  };

  const [selectedSort, setSelectedSort] = useState<any>({
    type: null,
    value: null,
  });

  const resetSort = () => {
    dispatcher(
      performFetchStockList(
        {
          config: { ...globalConfig, ...config, sort: [] },
        },
        () => {
          dispatcher(updateStockListConfig({ ...config, sort: [] }));
        }
      )
    );
  };

  return (
    <>
      <div className="dropdown sort-dropdown">
        <button
          className="sort-btn icon-btn btn btn-outline-primary dropdown-toggle"
          id="sortDropdownMenu"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            className="icon-img icon-img-primary sm"
            src="/images/sort.svg"
          />
          <span className="middle-txt">Sort</span>
          <i className="fa fa-toggle-angle"></i>
        </button>
        <ul
          className="dropdown-menu"
          aria-labelledby="sortDropdownMenu"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <li className="dropdown-list-head">
            <div className="title">Sort By</div>
            <div
              className="reset-text"
              onClick={() => {
                resetSort();
              }}
            >
              Reset
            </div>
          </li>
          <li>
            <div className="dropdown-item">
              <input
                id="stock-sort-stock-asc"
                className=" form-check-input"
                type="radio"
                name="inventory-sort"
                checked={
                  selectedSort.type == "in_stock" && selectedSort.value == "+"
                }
                onChange={() => {
                  applySort({
                    type: "in_stock",
                    value: "+",
                  });
                }}
              />
              <label
                className="form-check-label"
                htmlFor="stock-sort-stock-asc"
              >
                In stock (ascending)
              </label>
            </div>
          </li>
          <li>
            <div className="dropdown-item">
              <input
                id="stock-sort-stock-desc"
                className=" form-check-input"
                type="radio"
                name="inventory-sort"
                checked={
                  selectedSort.type == "in_stock" && selectedSort.value == "-"
                }
                onChange={() => {
                  applySort({
                    type: "in_stock",
                    value: "-",
                  });
                }}
              />
              <label
                className="form-check-label"
                htmlFor="stock-sort-stock-desc"
              >
                In stock (descending)
              </label>
            </div>
          </li>
          <li>
            <div className="dropdown-item">
              <input
                id="stock-sort-a-z"
                className=" form-check-input"
                type="radio"
                name="inventory-sort"
                checked={
                  selectedSort.type == "product_name" && selectedSort.value == "+"
                }
                onChange={() => {
                  applySort({
                    type: "product_name",
                    value: "+",
                  });
                }}
              />
              <label className="form-check-label" htmlFor="stock-sort-a-z">
                Name/sku title A-Z
              </label>
            </div>
          </li>
          <li>
            <div className="dropdown-item">
              <input
                id="stock-sort-z-a"
                className="form-check-input"
                type="radio"
                name="inventory-sort"
                checked={
                  selectedSort.type == "product_name" && selectedSort.value == "-"
                }
                onChange={() => {
                  applySort({
                    type: "product_name",
                    value: "-",
                  });
                }}
              />
              <label className="form-check-label" htmlFor="stock-sort-z-a">
                Name/sku title Z-A
              </label>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default InventorySortDropdown;
