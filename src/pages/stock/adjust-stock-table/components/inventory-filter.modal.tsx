import { useEffect, useState } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import SelectDropdown from "../../../../components/dropdowns/select.dropdown";
import listBundlesService from "../../../../services/apis/products/bundles/list-bundles.service";
import listTagsService from "../../../../services/apis/products/list-tags.service";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  performFetchStockList,
  updateStockListConfig,
} from "../../../../services/redux/slices/inventory.slice";
import {
  convertObjToList,
  getDropdownList,
} from "../../../../services/conversion.service";
import TypeaheadInput from "../../../../components/inputs/typeahead.input";
import listGroups from "../../../../services/apis/products/groups/list-groups.service";

const InventoryFilter = () => {
  const [toggle, setToggle] = useState(false);
  const handleClose = () => setToggle(false);
  const handleShow = () => setToggle(true);
  const [tagList, setTagList] = useState([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [bundleList, setBundleList] = useState([]);
  const { handleSubmit, control, reset, setValue } = useForm({});
  const dispatcher = useDispatch();
  const config = useSelector((state: any) => state.inventory.stockList.config);
  const globalConfig = useSelector(
    (state: any) => state.inventory.globalConfig
  );
  const [selectedBundle, setSelectedBundle] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [selectedProductTag, setSelectedProductTag] = useState<any>();

  const [belowThreshold, setBelowThreshold] = useState<any>("all");
  const [onlineListing, setOnlineListing] = useState<any>("all");
  const categories = useSelector((state: any) => state.meta_data.group1s);

  useEffect(() => {
    listTagsService({
      queryParams: {
        paginate: false,
      },
    }).then((res) => {
      let tempList = res.data.map((tag: any) => {
        return {
          label: tag.name,
          value: tag.name,
          fullObj: tag,
        };
      });
      setTagList(tempList);
    });
  }, []);

  useEffect(() => {
    let list = convertObjToList(categories);
    list = getDropdownList(list);
    setCategoryList(list);
  }, []);

  useEffect(() => {
    listBundlesService({
      queryParams: {
        paginate: false,
      },
    }).then((res) => {
      let tempBundleList = res.data.map((bundle: any) => {
        return {
          label: bundle.name,
          value: bundle.id,
          fullObj: bundle,
        };
      });
      setBundleList(tempBundleList);
    });
  }, []);

  useEffect(() => {
    listGroups({
      queryParams: {
        paginate: false,
      },
    }).then((res) => {
      let tempList = res.data.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
          fullObj: item,
        };
      });
      setCategoryList(tempList);
    });
  }, []);

  const onSubmit = (data: any) => {
    let newStockListConfig = {
      ...config,
      bundle: data.bundle ? data.bundle : null,
      productTags: data.productTag ? [data.productTag] : [],
      belowThreshold: data.belowThreshold ? data.belowThreshold : "all",
      onlineListing: data.onlineListing ? data.onlineListing : "all",
      category: data.category ? data.category : null,
    };

    let newMergedConfig = {
      ...globalConfig,
      ...newStockListConfig,
    };
    dispatcher(
      performFetchStockList(
        {
          config: newMergedConfig,
        },
        () => {
          dispatcher(updateStockListConfig(newStockListConfig));
        }
      )
    );
  };

  const initForm = () => {
    if (config.category) {
      setSelectedCategory({
        label: config.category.name,
        value: config.category.id,
        fullObj: config.category,
      });
    } else {
      setSelectedCategory(undefined);
      resetFormField("category");
    }

    if (config.productTags.length > 0) {
      setSelectedProductTag({
        label: config.productTags[0].name,
        value: config.productTags[0].id,
        fullObj: config.productTags[0],
      });
    } else {
      setSelectedProductTag(undefined);
      resetFormField("productTag");
    }

    if (config.bundle) {
      setSelectedBundle({
        label: config.bundle.name,
        value: config.bundle.id,
        fullObj: config.bundle,
      });
    } else {
      setSelectedBundle(undefined);
      resetFormField("bundle");
    }

    setBelowThreshold(config.belowThreshold);
    if (config.belowThreshold == "all") {
      resetFormField("belowThreshold");
    }

    setOnlineListing(config.onlineListing);
    if (config.onlineListing == "all") {
      resetFormField("onlineListing");
    }
  };

  const openModal = () => {
    initForm();
    handleShow();
  };

  const resetFormField = (key: string) => {
    setValue(key, undefined);
  };

  const resetForm = () => {
    setSelectedCategory(undefined);
    resetFormField("category");
    setSelectedProductTag(undefined);
    resetFormField("productTag");
    setSelectedBundle(undefined);
    resetFormField("bundle");
    setBelowThreshold("all");
    resetFormField("belowThreshold");
    setOnlineListing("all");
    resetFormField("onlineListing");
  };

  return (
    <>
      <Button
        className="filter-btn icon-btn"
        onClick={openModal}
        variant="outline-primary"
      >
        <img className="icon-img sm" src="/images/filter.svg" />
        <span className="middle-txt">Filter</span>
        <i className="fa fa-toggle-angle"></i>
      </Button>

      <Modal
        className="filter-modal top-space-md"
        show={toggle}
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title>Filters</Modal.Title>
          <div
            className="reset-text"
            onClick={() => {
              resetForm();
            }}
          >
            Reset All
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="vertical-form">
              <div className="row line">
                <div className="col-6">
                  <div className="input-title">Category</div>
                  {/* <div className="input-des">This is category</div> */}
                </div>
                <div className="col-6">
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }: any) => (
                      <TypeaheadInput
                        placeHolder="Select Category"
                        selected={selectedCategory ? [selectedCategory] : []}
                        options={categoryList}
                        onChange={(items: any) => {
                          if (items.length > 0) {
                            field.onChange(items[0].fullObj);
                            setSelectedCategory(items[0]);
                          } else {
                            field.onChange(undefined);
                            setSelectedCategory(undefined);
                          }
                        }}
                        withCrossButton={true}
                      ></TypeaheadInput>
                    )}
                  />
                </div>
              </div>
              <div className="row line">
                <div className="col-6">
                  <div className="input-title">Tags</div>
                  {/* <div className="input-des">This is tag</div> */}
                </div>
                <div className="col-6">
                  <Controller
                    control={control}
                    name="productTag"
                    render={({ field }) => {
                      return (
                        <TypeaheadInput
                          placeHolder="Select Product"
                          selected={
                            selectedProductTag ? [selectedProductTag] : []
                          }
                          options={tagList}
                          onChange={(items: any) => {
                            if (items.length > 0) {
                              field.onChange(items[0].fullObj);
                              setSelectedProductTag(items[0]);
                            } else {
                              field.onChange(undefined);
                              setSelectedProductTag(undefined);
                            }
                          }}
                          withCrossButton={true}
                        ></TypeaheadInput>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="row line">
                <div className="col-6">
                  <div className="input-title">Bundle Sku</div>
                  {/* <div className="input-des">This is tag</div> */}
                </div>
                <div className="col-6">
                  <Controller
                    control={control}
                    name="bundle"
                    render={({ field }) => {
                      return (
                        <TypeaheadInput
                          placeHolder="Select Bundle"
                          selected={selectedBundle ? [selectedBundle] : []}
                          options={bundleList}
                          onChange={(items: any) => {
                            if (items.length > 0) {
                              field.onChange(items[0].fullObj);
                              setSelectedBundle(items[0]);
                            } else {
                              field.onChange(undefined);
                              setSelectedBundle(undefined);
                            }
                          }}
                          withCrossButton={true}
                        ></TypeaheadInput>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="row line">
                <div className="col-6">
                  <div className="input-title">Below Threshold</div>
                  {/* <div className="input-des">This is threshold value</div> */}
                </div>
                <div className="col-6">
                  <div className="btn-group">
                    <Controller
                      control={control}
                      name="belowThreshold"
                      render={({ field }) => {
                        return (
                          <>
                            <Button
                              variant={
                                belowThreshold == "all"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setBelowThreshold("all");
                                field.onChange("all");
                              }}
                            >
                              All
                            </Button>
                            <Button
                              variant={
                                belowThreshold == "yes"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setBelowThreshold("yes");
                                field.onChange("yes");
                              }}
                            >
                              Yes
                            </Button>
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row line">
                <div className="col-6">
                  <div className="input-title">Has Online Listing</div>
                  {/* <div className="input-des">This is online listing</div> */}
                </div>
                <div className="col-6">
                  <div className="btn-group">
                    <Controller
                      control={control}
                      name="onlineListing"
                      render={({ field }) => {
                        return (
                          <>
                            <Button
                              variant={
                                onlineListing == "all"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setOnlineListing("all");
                                field.onChange("all");
                              }}
                            >
                              All
                            </Button>
                            <Button
                              variant={
                                onlineListing == "yes"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setOnlineListing("yes");
                                field.onChange("yes");
                              }}
                            >
                              Yes
                            </Button>
                            <Button
                              variant={
                                onlineListing == "no"
                                  ? "primary"
                                  : "outline-secondary"
                              }
                              onClick={() => {
                                setOnlineListing("no");
                                field.onChange("no");
                              }}
                            >
                              No
                            </Button>
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={handleClose}>
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="modal-apply-btn"
              onClick={handleClose}
            >
              Apply
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default InventoryFilter;
