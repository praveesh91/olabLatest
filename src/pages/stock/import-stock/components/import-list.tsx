import moment from "moment";
import { useEffect, useState } from "react";
import ClockLoader from "../../../../components/loaders/clock.loder";
import Pagination from "../../../../components/paginations/basic.pagination";
import getImportedStocks from "../../../../services/apis/operations/adjust-stock/get-imported-stocks.service";

const ImportList = ({ docId }: { docId: number }) => {
  const [lines, setLines] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [paginationConfig, setPaginationConfig] = useState({
    prev: {
      disabled: true,
    },
    next: {
      disabled: true,
    },
    orientation: "right",
  });

  const [paginationData, setPaginationData] = useState({
    prevUrl: null,
    nextUrl: null,
  });

  useEffect(() => {
    getImportedStocks({
      queryParams: { document: docId, paginate: true },
    }).then((res) => {
      setPaginationConfig({
        ...paginationConfig,
        prev: {
          disabled: res.data.previous ? false : true,
        },
        next: {
          disabled: res.data.next ? false : true,
        },
      });
      setLines(res.data.results);
      setPaginationData({
        nextUrl: res.data.next,
        prevUrl: res.data.previous,
      });
    });
  }, []);

  const fetchNextPage = () => {
    let url = paginationData.nextUrl ? paginationData.nextUrl : undefined;
    loadPage(url);
  };

  const fetchPrevPage = () => {
    let url = paginationData.prevUrl ? paginationData.prevUrl : undefined;
    loadPage(url);
  };

  const loadPage = (url?: string) => {
    setLoading(true);
    getImportedStocks({
      url: url ? url : undefined,
      queryParams: url
        ? undefined
        : { document: docId, paginate: true, limit: 10 },
    })
      .then((res) => {
        setLoading(false);
        setPaginationConfig({
          ...paginationConfig,
          prev: {
            disabled: res.data.previous ? false : true,
          },
          next: {
            disabled: res.data.next ? false : true,
          },
        });
        setLines(res.data.results);
        setPaginationData({
          nextUrl: res.data.next,
          prevUrl: res.data.previous,
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <>
      <div className="head">
        <div className="title">Import Stock List</div>
        <div className="des">Provide Adjust Stock Document Related Details</div>
      </div>
      <div>
        <div>
          <Pagination
            options={paginationConfig}
            onNextClick={() => {
              fetchNextPage();
            }}
            onPrevClick={() => {
              fetchPrevPage();
            }}
          ></Pagination>
        </div>
        <div>
          {loading && <ClockLoader></ClockLoader>}
          <table className={`table sticky-head-table product-list-table`}>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">
                  <div>Name/SKU</div>
                </th>
                <th scope="col" className="text-end">
                  <div>Quantity</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line: any, index: any) => {
                return (
                  <tr className="align-middle" key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="des-tag des-tag-xs" style={{ maxWidth: "200px" }}>
                        <div className="title title-case">
                          {line["product"]["name"]}
                        </div>
                        <div className="des font-weight-bold">
                          {line["product"]["sku"]}
                        </div>
                      </div>
                    </td>
                    <td className="text-end">{line.quantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          options={paginationConfig}
          onNextClick={() => {
            fetchNextPage();
          }}
          onPrevClick={() => {
            fetchPrevPage();
          }}
        ></Pagination>
      </div>
    </>
  );
};

export default ImportList;
