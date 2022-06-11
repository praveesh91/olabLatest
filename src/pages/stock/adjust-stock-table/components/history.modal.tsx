import moment from "moment";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import ThumbnailImage from "../../../../components/images/thumbnail.image";
import ClockLoader from "../../../../components/loaders/clock.loder";
import listStockLog from "../../../../services/apis/stock/list-stock-log.service";
import { displayLocaleDateTime, displayNumber } from "../../../../services/conversion.service";
import APP_CONSTANTS from "../../../../utils/constants/app.constants";

const HistoryModal = ({ stockObj }: any) => {
  const [toggle, setToggle] = useState(false);
  const handleClose = () => setToggle(false);
  const showModal = () => setToggle(true);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const handleHistoryClick = async () => {
    showModal();
    setLoading(true);
    const res = await listStockLog({
      queryParams: {
        paginate: false,
        product: stockObj["product"]["id"],
        limit: 5,
        warehouse: stockObj["warehouse_id"]
          ? stockObj["warehouse_id"]
          : undefined,
      },
    });
    setLoading(false);
    setList(res.data);
  };

  return (
    <>
      <img
        className="icon-img lg cursor-pointer"
        src="/images/history.svg"
        onClick={handleHistoryClick}
      />

      <Modal
        className="history-modal top-space-md"
        show={toggle}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Inventory History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="group gap-md" style={{ alignItems: "center" }}>
            <ThumbnailImage
              path={stockObj?.product?.image_url || ""}
              size="md"
              altSize="md"
            ></ThumbnailImage>
            <div>
              <div className="des-tag des-tag-xxs">
                <div className="title title-case">
                  {stockObj["product"] && stockObj["product"]["name"]}
                </div>
                <div className="des font-weight-bold">
                  {stockObj["product"] && stockObj["product"]["sku"]}
                </div>
              </div>
            </div>
          </div>
          <div className={`table-container ${loading ? "table-blur" : ""}`} style={{ minHeight: "150px" }}>
            {loading && <ClockLoader></ClockLoader>}
            <table
              className={`table sticky-head-table product-list-table`}
            >
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-center">
                    Stock
                  </th>
                  <th scope="col" className="text-end">
                    Quantity
                  </th>
                  <th scope="col">
                    <div>Document</div>
                  </th>
                  <th scope="col">Warehouse</th>
                  <th scope="col">User</th>
                </tr>
              </thead>
              <tbody>
                {list.map((log: any, i: any) => {
                  return (
                    <tr key={i} className="align-middle">
                      <td>
                        {
                          displayLocaleDateTime(log?.updated || "", APP_CONSTANTS.DATE_FORMAT.POST_DATE)
                        }
                        {/* {moment(log["updated"]).format(
                          APP_CONSTANTS.DATE_FORMAT.POST_DATE
                        )} */}
                      </td>
                      <td>
                        <div className="comparator-box centered">
                          <div className="first-obj">
                            <div className="desc">Initial</div>
                            {parseFloat(log["in_stock"]) -
                              parseFloat(log["quantity"])}
                            <div className="value"></div>
                          </div>
                          <div className="symbol">
                            <i className="fa fa-angle-right"></i>
                          </div>
                          <div className="second-obj">
                            <div className="desc">Final</div>
                            <div className="value">
                              {displayNumber(log["in_stock"])}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-end">
                        {displayNumber(log["quantity"])}
                      </td>
                      <td>{log["content_type"]["name"]} {log?.channel?.code}</td>
                      <td>
                        {log?.warehouse?.code || ""}
                      </td>
                      <td>{log["user"] && log["user"]["full_name"]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            <img className="icon-img sm" src="/images/link.svg" /> See More
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default HistoryModal;
