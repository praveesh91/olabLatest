import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Line from "./line.tr";


const StockLines = ({ rows, disabled, toWarehouse, fromWarehouse, onUpdate }: any) => {
    return (
        <div className={`table-container`}>
            <table className={`table sticky-head-table product-list-table`} style={{ minHeight: "100px" }}>
                <thead>
                    <tr>
                        <th scope="col" style={{ minWidth: "100px" }} className="ps-4">
                            S.No.
                        </th>
                        <th scope="col" style={{ minWidth: "100px" }}>
                            Product
                        </th>
                        <th
                            scope="col"
                            style={{ minWidth: "100px" }}
                            className="text-end"
                        >
                            Stock From
                            <OverlayTrigger
                                delay={{ hide: 450, show: 300 }}
                                overlay={(props) => <Tooltip {...props}>
                                    Shows the stock at Transfer From warehouse.
                                </Tooltip>}
                                placement="left"
                            >
                                <i className="fa fa-info-circle ms-2" />
                            </OverlayTrigger>
                        </th>
                        <th
                            scope="col"
                            style={{ minWidth: "100px" }}
                            className="text-end"
                        >
                            Stock To
                            <OverlayTrigger
                                delay={{ hide: 450, show: 300 }}
                                overlay={(props) => <Tooltip {...props}>
                                    Shows the stock at Transfer To warehouse
                                </Tooltip>}
                                placement="left"
                            >
                                <i className="fa fa-info-circle ms-2" />
                            </OverlayTrigger>
                        </th>
                        <th
                            scope="col"
                            style={{ minWidth: "100px" }}
                            className="text-center"
                        >
                            Quantity
                        </th>
                        <th
                            scope="col"
                            style={{ minWidth: "100px" }}
                            className="pe-5"
                        ></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((line: any, index: number) => (
                        <Line
                            disabled={disabled}
                            line={line}
                            index={index}
                            key={index}
                            toWarehouse={toWarehouse}
                            fromWarehouse={fromWarehouse}
                            onUpdate={(line: any) => {
                                let tempLines = rows;
                                tempLines[index] = line;
                                if (onUpdate) {
                                    onUpdate(tempLines);
                                }
                            }}
                            onDeleteLine={(line: any) => {
                                let tempLines = rows;
                                tempLines.splice(index, 1);
                                if (onUpdate) {
                                    onUpdate(tempLines);
                                }
                            }}
                        ></Line>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StockLines;