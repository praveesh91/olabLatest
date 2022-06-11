import { OverlayTrigger, Popover } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Badge from "../../../../../components/badges/basic-badge.badge";
import { castToNumber, displayLocaleDateTime } from "../../../../../services/conversion.service";
import APP_CONSTANTS from "../../../../../utils/constants/app.constants";
import PAGE_PATHS from "../../../../../utils/constants/page-paths.constants";

const StockTransferLine = ({ document }: {
    document: any
}) => {
    const history = useHistory();
    const getStatusString = (
        isBulk: boolean,
        isComplete: boolean,
        linesCount: number
    ) => {
        if (isComplete) {
            return "Done";
        }

        if (isBulk) {
            if (!isComplete && linesCount > 0) {
                return "In Progress";
            }
        }

        return "Draft";
    };

    const getStatusVariant = (
        isBulk: boolean,
        isComplete: boolean,
        linesCount: number
    ) => {
        if (isComplete) {
            return "success";
        }

        if (isBulk) {
            if (!isComplete && linesCount > 0) {
                return "info";
            }
        }

        return "primary";
    };

    const handleRedirect = (document: any) => {
        history.push("/" + PAGE_PATHS.STOCK_TRANSFER_EDIT.replace(":id", document.id));
    }

    return (
        <>
            <tr
                className="align-middle"
                style={{ cursor: "pointer" }}
            >
                <td className="align-middle" onClick={() => handleRedirect(document)}>
                    {document["created"] &&
                        displayLocaleDateTime(
                            document["created"],
                            APP_CONSTANTS.DATE_FORMAT.POST_DATE
                        )}
                </td>
                <td onClick={() => handleRedirect(document)}>{document?.number}</td>
                <td onClick={() => handleRedirect(document)}>
                    {document?.warehouse?.code}
                </td>
                <td className="text-break" onClick={() => handleRedirect(document)}>
                    {document?.to_warehouse?.code}
                </td>
                <td onClick={() => handleRedirect(document)}>
                    {/* <div
                        className={`text-nowrap badge-label badge-label-xs ${getStatusVariant(
                            document?.is_bulk || false,
                            document?.is_complete || false,
                            castToNumber(document?.total_quantity) || -1
                        )}`}
                    // style={{ minWidth: "86px" }}
                    >
                        {getStatusString(
                            document?.is_bulk || false,
                            document?.is_complete || false,
                            castToNumber(document?.total_quantity) || -1
                        )}
                    </div> */}
                    <Badge variant={getStatusVariant(
                        document?.is_bulk || false,
                        document?.is_complete || false,
                        castToNumber(document?.total_quantity) || -1
                    )}>
                        {getStatusString(
                            document?.is_bulk || false,
                            document?.is_complete || false,
                            castToNumber(document?.total_quantity) || -1
                        )}
                    </Badge>
                </td>
                <td onClick={() => handleRedirect(document)} className="align-middle text-break">
                    {document["notes"] &&
                        document["notes"].match(/(\w+)/g).length < 15 ? (
                        document["notes"]
                    ) : (
                        <>
                            <p className="two-line-text mb-0">
                                {document?.notes}
                                {document?.notes?.match(/(\w+)/g)?.length > 15 ? "..." : ""}
                            </p>
                            <OverlayTrigger
                                overlay={(props) => (
                                    <Popover {...props}>
                                        <Popover.Body>{document?.notes}</Popover.Body>
                                    </Popover>
                                )}
                                placement="left"
                            >
                                <span
                                    style={{
                                        color: "#1A89AC",
                                        display:
                                            document["notes"] &&
                                                document["notes"].match(/(\w+)/g).length > 15
                                                ? ""
                                                : "none",
                                    }}
                                >
                                    Read More
                                </span>
                            </OverlayTrigger>
                        </>
                    )}
                </td>
            </tr>
        </>
    )
}

export default StockTransferLine;