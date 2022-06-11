import ClockLoader from "../../../../../components/loaders/clock.loder";
import StockTransferLine from "./stock-transfer.tr";

const StockTransferTable = ({ list, loading, style = {} }: any) => {
    return (
        <div className={`table-container ${loading ? "overflow-hidden h-200px" : ""}`} style={{ ...style }}>
            {loading && <ClockLoader></ClockLoader>}
            <table className={`table sticky-head-table`} >
                <thead>
                    <tr className="align-middle">
                        <th scope="col" className="text-nowrap" style={{ minWidth: "130px" }}>
                            Date
                        </th>
                        <th scope="col" className="text-nowrap" style={{ minWidth: "130px" }}>
                            Document No
                        </th>
                        <th scope="col" className="text-nowrap" style={{ minWidth: "130px" }}>
                            Transfer From
                        </th>
                        <th scope="col" className="text-nowrap" style={{ minWidth: "130px" }}>
                            Transfer To
                        </th>
                        <th scope="col" className="text-nowrap" style={{ minWidth: "130px" }}>
                            Status
                        </th>
                        <th scope="col" className="text-nowrap" style={{ minWidth: "130px" }}>
                            Notes
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map((item: any, index: number) => {
                            return <StockTransferLine document={item} key={index} />
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default StockTransferTable;