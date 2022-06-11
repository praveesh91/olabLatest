import React, { useState } from "react";
import moment from "moment";
import APP_CONSTANTS from "../../../../utils/constants/app.constants";
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Popover, PopoverBody, Tooltip } from "react-bootstrap";
import {
  castToNumber,
  displayLocaleDateTime,
  displayNumber,
} from "../../../../services/conversion.service";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import { isBlock } from "typescript";
import exportFile from "../../../../services/apis/export/export-file.service";
import { downloadBlob } from "../../../../services/common.services";

const StockDocumentLine = ({ document }: any) => {
  const history: any = useHistory();

  const handleRedirect = (document: any) => {
    if (!document.is_bulk) {
      history.push(
        "/" + PAGE_PATHS.ADJUST_STOCK_FORM_EDIT.replace(":id", document.id)
      );
      return;
    }
    if (document.is_bulk) {
      history.push(
        "/" + PAGE_PATHS.ADJUST_STOCK_IMPORT_EDIT.replace(":id", document.id)
      );
      return;
    }
  };

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

  const getStatusClass = (
    isBulk: boolean,
    isComplete: boolean,
    linesCount: number
  ) => {
    if (isComplete) {
      return "badge-label-success";
    }

    if (isBulk) {
      if (!isComplete && linesCount > 0) {
        return "badge-label-info";
      }
    }

    return "badge-label-primary";
  };

  const handleDownload = () => {
    let filename = "stock_document_lines.csv";
    exportFile({
      filename: filename,
      type: "ADJUST_STOCK_LINES",
      id: document.id,
    })
      .then((res: any) => {
        downloadBlob(res, filename);
      })
      .catch((error: any) => { });
  };

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
        <td onClick={() => handleRedirect(document)}>{document["number"]}</td>
        <td onClick={() => handleRedirect(document)}>
          {document["adjustment_type"]}
        </td>
        <td className="text-break" onClick={() => handleRedirect(document)}>
          {document["warehouse"]["name"]}
        </td>
        <td onClick={() => handleRedirect(document)} className="text-end">
          {document["total_quantity"]}
        </td>
        <td className="text-break" onClick={() => handleRedirect(document)}>{document["reason"]}</td>
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
        <td onClick={() => handleRedirect(document)}>
          <div
            className={`text-nowrap badge-label badge-label-xs ${getStatusClass(
              document?.is_bulk || false,
              document?.is_complete || false,
              castToNumber(document?.total_quantity) || -1
            )}`}
            style={{ minWidth: "86px" }}
          >
            {getStatusString(
              document?.is_bulk || false,
              document?.is_complete || false,
              castToNumber(document?.total_quantity) || -1
            )}
          </div>
        </td>
        <td className="text-end">
          <OverlayTrigger
            overlay={<Tooltip>CSV export</Tooltip>}
            placement="top"
          >
            <img
              hidden={!document.is_bulk}
              src="/images/download.svg"
              alt="download"
              className="icon-img sm"
              onClick={() => handleDownload()}
            />
          </OverlayTrigger>
        </td>
      </tr>
    </>
  );
}

export default StockDocumentLine;
