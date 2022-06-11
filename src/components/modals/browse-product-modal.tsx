import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import NameSkuContent from "../content/name-sku.content";
import SelectDropdown from "../dropdowns/select.dropdown";
import ThumbnailImage from "../images/thumbnail.image";
import listProducts from "../../services/apis/products/list-products.service";
import { getElementIndex } from "../../services/common.services";
import { getListFromObj, getObjFromListBy } from "../../services/conversion.service";
import { useDebounce } from 'use-lodash-debounce-throttle';
import "./browse-product-modal.css";

function BrowseProductModal({
  onAddProducts,
  warehouseId,
  disabled = false,
  warehouseCode = ""
}: {
  onAddProducts?: any;
  warehouseId: number;
  disabled?: boolean;
  warehouseCode?: string;
}) {
  const [toggle, setToggle] = useState(false);
  const closeModal = () => setToggle(false);
  const showModal = () => setToggle(true);
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>([]);
  const [searchTypes, setSearchTypes] = useState([
    {
      label: "Name / SKU",
      value: "search",
    },
    {
      label: "Tag",
      value: "tags",
    },
    {
      label: "Bundle",
      value: "bundle_search",
    },
  ]);
  const [selectedSearchType, setSelectedSearchType] = useState<any>({
    label: "Name / SKU",
    value: "search",
  });

  const [searchText, setSearchText] = useState<string>("");

  const [alertThreshold, setAlertThreshold] = useState(false);

  const [isAllChecked, setIsAllChecked] = useState(false);

  const togglSearchRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const modalSearchRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  const handleShowModal = () => {
    showModal();
    loadProducts({
      searchText: searchText,
      selectedSearchType: selectedSearchType,
      alertThreshold: alertThreshold,
    });
  };

  //focus search bar when modal prompts
  useEffect(() => {
    modalSearchRef?.current?.focus?.();
  }, [modalSearchRef.current]);

  const loadProducts = (data: any) => {
    let queryParams: any = {
      [data.selectedSearchType.value]: data.searchText,
      include: "stocklevels",
      is_archived: false,
      bundle_type: "NONE",
      paginate: true,
    }

    if (data.alertThreshold) {
      queryParams["is_below_threshold"] = data.alertThreshold;
    }

    listProducts({
      queryParams: queryParams,
    })
      .then((res) => {
        let selectedListByObj = getObjFromListBy(selected, "id");

        res.data.results.forEach((product: any) => {
          if (product.id in selectedListByObj) {
            product.checked = true;
          } else {
            product.checked = false;
          }
          product["stockLevelsByWarehouse"] = getObjFromListBy(
            product.stocklevels,
            "warehouse_id"
          );
        });

        let checkedStatus = isAllItemsChecked(res.data.results);

        setIsAllChecked(checkedStatus);

        setList(res.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isAllItemsChecked = (items: any[]) => {
    let totalItems: number = items.length;
    if (totalItems === 0) {
      return false;
    }
    let totalNoOfChecked: number = 0;
    items.forEach((item) => {
      if (item.checked) {
        totalNoOfChecked += 1;
      }
    });
    return totalNoOfChecked === totalItems;
  }

  const handleCheckOrUncheck = (product: any, checked: boolean) => {
    //checking product
    if (checked === true) {
      // list[position]["checked"] = true;
      let position = getElementIndex(list, product, "id");
      if (position !== -1) {
        list[position]["checked"] = true;
      }
      setList([...list]);
      selected.push(product);
      setSelected([...selected]);
      let allCheckStatus = isAllItemsChecked(list);
      setIsAllChecked(allCheckStatus);
    }

    //unchecking product
    if (checked === false) {
      let position = getElementIndex(list, product, "id");
      if (position !== -1) {
        list[position]["checked"] = false;
      }
      setList([...list]);

      let index = getElementIndex(selected, product, "id");
      if (index !== -1) {
        selected.splice(index, 1);
        setSelected([...selected]);
      }
      // let allCheckStatus = isAllItemsChecked(list);
      setIsAllChecked(false);
    }
  };

  const handleAddProduct = () => {
    if (onAddProducts) {
      onAddProducts(selected);
    }
    closeModal();
    cleanData();
  };

  const handleSearchBy = (searchType: any) => {
    setSelectedSearchType(searchType);

    loadProducts({
      selectedSearchType: searchType,
      searchText: searchText,
      alertThreshold: alertThreshold,
    });
  };

  const handleSearch = (text: string) => {
    loadProducts({
      selectedSearchType: selectedSearchType,
      searchText: text,
      alertThreshold: alertThreshold,
    });
  };

  const handleSearchDebounce = useDebounce((text: string) => {
    handleSearch(text);
  }, 500);

  const handleAlertThreshold = (alertThreshold: boolean) => {
    setAlertThreshold(alertThreshold);
    loadProducts({
      selectedSearchType: selectedSearchType,
      searchText: searchText,
      alertThreshold: alertThreshold,
    });
  };

  const cleanData = () => {
    setList([]);
    setSelected([]);
    setSearchText("");
    setSelectedSearchType({
      label: "Name / SKU",
      value: "search",
    });
    togglSearchRef.current.value = "";
  };

  const handleModalClose = () => {
    closeModal();
    cleanData();
  };

  const handleToggleSearch = (text: string) => {
    showModal();
    setSearchText(text);
    loadProducts({
      searchText: text,
      selectedSearchType: selectedSearchType,
      alertThreshold: alertThreshold,
    });
  };

  const handleToggleSearchDebounce = useDebounce((text: string) => {
    handleToggleSearch(text);
  }, 500);

  // const f = (list: any[]) => {
  //   if (list.length > 0) {
  //     let totalChecked = 0;
  //     list.forEach(product => {
  //       if (product.checked) {
  //         totalChecked += 1;
  //       }
  //     });
  //     return totalChecked === list.length;
  //   }
  //   return false;
  // }

  const handleAllCheckUncheck = (checked: boolean) => {
    setIsAllChecked(checked);
    setList((prev: any[]) => {
      prev.forEach((item: any) => {
        item.checked = checked
      });
      return prev;
    });

    let selectedListByObj = getObjFromListBy(selected, "id");

    if (checked) {
      list.forEach((item: any) => {
        selectedListByObj[item.id] = item;
      });
    } else {
      list.forEach((item: any) => {
        if (item.id in selectedListByObj) {
          delete selectedListByObj[item.id];
        }
      });
    }

    let newSelectedItemsList = getListFromObj(selectedListByObj);
    setSelected(newSelectedItemsList);
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="search-bar" style={{ width: "350px" }}>
          <img
            className="icon-img icon-img-primary sm"
            src="/images/search.svg"
            alt="Search"
          />
          <input
            disabled={disabled}
            ref={togglSearchRef}
            type="text"
            className="form-control"
            style={{ borderRadius: "5px 0px 0px 5px" }}
            placeholder="Search here"
            onChange={(e: any) => {
              if (e.target.value) {
                handleToggleSearchDebounce(e.target.value);
              }
            }}
          />
        </div>
        <Button
          disabled={disabled}
          className="inventoryform-browse-btn icon-btn text-nowrap"
          onClick={() => {
            handleShowModal();
          }}
          variant="outline-primary"
        >
          <span>Add Products</span>
        </Button>
      </div>

      <Modal
        scrollable={true}
        className="product-list-modal"
        show={toggle}
        onHide={() => {
          handleModalClose();
        }}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Product List</Modal.Title>
          <div style={{ display: "flex", columnGap: "5px" }}>
            <button
              className="btn btn-primary text-nowrap"
              style={{ width: "10rem" }}
              onClick={() => {
                handleAddProduct();
              }}
            >
              Add {selected.length} Product{selected.length > 1 ? "s" : ""}
            </button>
            <button
              className="btn btn-outline-secondary"
              style={{ padding: "8px 8px" }}
              onClick={() => {
                handleModalClose();
              }}
            >
              <img
                src="/images/borderless-cross.svg"
                alt="cross"
                style={{ cursor: "pointer" }}
              />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="left-dropdown-search-bar">
              <SelectDropdown
                style={{ minWidth: "130px" }}
                toggleStyle={{ borderRadius: "5px 0px 0px 5px" }}
                list={searchTypes}
                selected={selectedSearchType}
                onChange={(selected: any) => handleSearchBy(selected)}
              ></SelectDropdown>
              <div className="search-bar" style={{ width: "300px" }}>
                <img
                  className="icon-img icon-img-primary sm"
                  src="/images/search.svg"
                  alt="Search"
                />
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: "0px 5px 5px 0px" }}
                  placeholder="Search here"
                  value={searchText}
                  ref={modalSearchRef}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    handleSearchDebounce(e.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: "14px", color: "#4b4b4b", border: "1px solid #ced4da", borderRadius: "5px", padding: "6px" }}>
              {/* <span style={{ fontWeight: "bold" }}>Warehouse: </span> */}
              <span>{warehouseCode || ""}</span>
            </div>
            {/* <div style={{ display: "flex" }} hidden>
              <div className="form-check inline-check">
                <label className="form-check-label" htmlFor="defaultCheck1">
                  Alert Threshold
                </label>
                <input
                  id="low_stock"
                  className="form-check-input"
                  type="checkbox"
                  checked={alertThreshold}
                  onChange={(e: any) => handleAlertThreshold(e.target.checked)}
                />
              </div>
            </div> */}
          </div>
          <div className={`table-container`} style={{ minHeight: "150px" }}>
            <table
              className={`table sticky-head-table product-list-table`}
            >
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    <Form.Check
                      type="checkbox"
                      id="all_products_check"
                      className="sumtracker-form-check-input"
                      checked={isAllChecked}
                      onChange={(e: any) => {
                        handleAllCheckUncheck(e.target.checked);
                      }}
                    />
                  </th>
                  <th scope="col" className="text-center"></th>
                  <th scope="col">Name / SKU</th>
                  <th scope="col" className="text-end">
                    In Stock
                  </th>
                  <th scope="col" className="text-end">
                    Booked
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((product: any, i: number) => {
                  return (
                    <tr key={i} className="align-middle">
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          id={`product_${i}`}
                          className="sumtracker-form-check-input"
                          checked={product.checked ? product.checked : false}
                          onChange={(e) => {
                            handleCheckOrUncheck(product, e.target.checked);
                          }}
                        />
                      </td>
                      <td>
                        <ThumbnailImage
                          path={product?.image_url || ""}
                          size="md"
                          altSize="md"
                        ></ThumbnailImage>
                      </td>
                      <td>
                        <NameSkuContent
                          name={product.name}
                          sku={product.sku}
                          style={{
                            maxWidth: "200px",
                            wordBreak: "break-word",
                          }}
                          size="xs"
                        ></NameSkuContent>
                      </td>
                      <td className="text-end">
                        {product["stockLevelsByWarehouse"][warehouseId]
                          ? product["stockLevelsByWarehouse"][warehouseId][
                          "in_stock"
                          ]
                          : ""}
                      </td>
                      <td className="text-end">{product.booked}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BrowseProductModal;
