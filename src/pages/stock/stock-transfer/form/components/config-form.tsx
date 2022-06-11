import { FC, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import SelectDropdown from "../../../../../components/dropdowns/select.dropdown";
import { displayLocaleDateTime, getWarehouseDropdownList } from "../../../../../services/conversion.service";
import APP_CONSTANTS from "../../../../../utils/constants/app.constants";

export interface ConfigFromInterface {
    data: {
        fromWarehouse: any;
        toWarehouse: any;
        notes: string;
        description?: any;
        reasonList: any[];
    };
    onChange?: (
        key: string,
        data: { toWarehouse: any; fromWarehouse: any, notes: string }
    ) => void;
    options?: {
        fromWarehouse: any;
        toWarehouse: any;
        notes: any;
        description: any;
    };
    control: any;
    onReasonInputClick?: any;
    onNewClick?: () => void;
    className?: string;
}

const ConfigForm: FC<ConfigFromInterface> = ({
    data,
    onChange,
    options = {
        toWarehouse: {
            disabled: false,
        },
        fromWarehouse: {
            disabled: false,
        },
        notes: {
            disabled: false,
        },
        description: {
            show: false,
            tagLine: ""
        },
    },
    control,
}) => {
    const warehousesList = useSelector(
        (state: any) => state.components.warehouses.list
    );

    return (
        <div style={{ padding: "1.8rem 1.8rem" }} className="bg-white">
            <div
                style={{
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    alignItems: "baseline",
                    columnGap: "10px"
                }}
            >
                <div style={{ maxWidth: "350px" }}>
                    <div className="short-notes">
                        {options?.description.tagLine || ""}
                    </div>
                </div>
                <div hidden={!options.description.show} className="short-notes text-end">
                    <div style={{ color: "rgba(78, 78, 78, 0.8)" }} className="text-nowrap">
                        Created on:
                        {data.description && <span className="ps-1">
                            {displayLocaleDateTime(
                                data.description.createdAt,
                                APP_CONSTANTS.DATE_FORMAT.POST_DATE
                            )}</span>}
                    </div>
                    <div style={{ color: "rgba(78, 78, 78, 0.8)" }} className="text-nowrap">
                        Updated on:
                        {data.description && <span className="ps-1">
                            {displayLocaleDateTime(
                                data.description.updatedAt,
                                APP_CONSTANTS.DATE_FORMAT.POST_DATE
                            )} </span>}
                    </div>
                    <div style={{ color: "rgba(78, 78, 78, 0.8)" }}>
                        Created by:{data.description && <span className="ps-1">{data.description.user}</span>}
                    </div>
                </div>
            </div>
            <Form>
                <Form.Group as={Row}>
                    <Form.Label column lg={4} className="head head-md">
                        <div className="title">Transfer From</div>
                        <div className="des">
                            Stock will be reduced in this warehouse
                        </div>
                    </Form.Label>
                    <Col lg={8}>
                        <Controller
                            name="configFromWarehouse"
                            control={control}
                            render={({ field }: any) => (
                                <SelectDropdown
                                    disabled={options.fromWarehouse.disabled}
                                    list={getWarehouseDropdownList(warehousesList)}
                                    selected={data.fromWarehouse}
                                    placeHolder="Select Warehouse"
                                    onChange={(item: any) => {
                                        if (onChange) {
                                            onChange("fromWarehouse", { ...data, fromWarehouse: item });
                                        }
                                        field.onChange(item);
                                    }}
                                />
                            )}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column lg={4} className="head head-md">
                        <div className="title">Transfer To</div>
                        <div className="des">
                            Stock will be added to this warehouse
                        </div>
                    </Form.Label>
                    <Col lg={8}>
                        <Controller
                            name="configToWarehouse"
                            control={control}
                            render={({ field }: any) => (
                                <SelectDropdown
                                    disabled={options.toWarehouse.disabled}
                                    list={getWarehouseDropdownList(warehousesList)}
                                    selected={data?.toWarehouse}
                                    placeHolder="Select Warehouse"
                                    onChange={(item: any) => {
                                        if (onChange) {
                                            onChange("toWarehouse", { ...data, toWarehouse: item });
                                        }
                                        field.onChange(item);
                                    }}
                                />
                            )}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column lg={4} className="head head-md">
                        <div className="title">Notes</div>
                    </Form.Label>
                    <Col lg={8}>
                        <Controller
                            name="configNotes"
                            control={control}
                            render={({ field }: any) => (
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e: any) => {
                                        if (onChange) {
                                            onChange("notes", { ...data, notes: e.target.value });
                                        }
                                        field.onChange(e.target.value);
                                    }}
                                    disabled={options.notes.disabled ? true : false}
                                />
                            )}
                        />
                    </Col>
                </Form.Group>
            </Form>
        </div>
    )
}

export default ConfigForm;