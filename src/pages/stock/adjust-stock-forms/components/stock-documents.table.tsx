import React from "react";
import ClockLoader from "../../../../components/loaders/clock.loder";
import StockDocumentLine from "./stock-document-line.tr";

const StockDocuments = ({ list, loading }: any) => {
  return (
    <div className={`table-container ${loading ? "overflow-hidden h-200px" : ""}`}>
      {loading && <ClockLoader></ClockLoader>}
      <table className={`table sticky-head-table product-list-table`} >
        <thead>
          <tr className="align-middle">
            <th scope="col" style={{ minWidth: "60px" }}>
              Date
            </th>
            <th scope="col" style={{ minWidth: "90px" }}>
              Number
            </th>
            <th scope="col" style={{ minWidth: "60px" }}>
              Type
            </th>
            <th scope="col" style={{ minWidth: "90px" }}>
              Warehouse
            </th>
            <th scope="col" style={{ minWidth: "90px" }}>
              Quantity
            </th>
            <th scope="col" style={{ minWidth: "90px" }}>
              Reasons
            </th>
            <th scope="col" style={{ minWidth: "120px", width: "200px" }}>
              Notes
            </th>
            <th scope="col" style={{ minWidth: "90px" }}>
              Completed
            </th>
            <th scope="col">
            </th>
          </tr>
        </thead>
        <tbody>
          {
            list.map((item: any, index: number) => {
              return <StockDocumentLine document={item} key={index} />
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default StockDocuments;
