import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import Page from "../../../../components/pages/basic.page";
import Pagination from "../../../../components/paginations/basic.pagination";
import listStockTransfer from "../../../../services/apis/operations/stock-transfer/list-stock-transfer.service";
import { convertJsonToQueryString, processQueryParams } from "../../../../services/conversion.service";
import { getQueryParamsFromUrl } from "../../../../services/get-values.service";
import PAGE_PATHS from "../../../../utils/constants/page-paths.constants";
import StockTransferTable from "./components/stock-transfer.table";
import "./index.css";

const StockTransferListPage = () => {
    const history = useHistory();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<any[]>([]);
    const [paginationData, setPaginationData] = useState<{
        next: {
            url: string | null,
            disabled: boolean
        },
        prev: {
            url: string | null,
            disabled: boolean
        }
    }>({
        next: {
            url: null,
            disabled: true
        },
        prev: {
            url: null,
            disabled: true
        }
    });

    const loadStockTransferList = async (data?: {
        paginationUrl?: string,
        queryParams?: any
    }) => {
        setLoading(true);
        setList([]);
        try {
            let res: any = await listStockTransfer({ paginationUrl: data?.paginationUrl, queryParams: data?.queryParams });
            setList(res.data.results);
            setPaginationData(last => {
                return {
                    ...last,
                    next: {
                        url: res.data.next,
                        disabled: res.data.next ? false : true
                    },
                    prev: {
                        url: res.data.previous,
                        disabled: res.data.previous ? false : true
                    },
                }
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        let params = getQueryParamsFromUrl();
        params = processQueryParams(params);
        loadStockTransferList({
            queryParams: params
        });
    }, [location])

    const handleFetchNext = () => {
        if (!paginationData.next.url) {
            return;
        }
        let queryParams = getQueryParamsFromUrl({ url: paginationData.next.url });
        history.push({
            pathname: "/" + PAGE_PATHS.STOCK_TRANSFER_LIST,
            search: convertJsonToQueryString(queryParams)
        });
    };
    const handleFetchPrevious = () => {
        if (!paginationData.prev.url) {
            return;
        }
        let queryParams = getQueryParamsFromUrl({ url: paginationData.prev.url });
        history.push({
            pathname: "/" + PAGE_PATHS.STOCK_TRANSFER_LIST,
            search: convertJsonToQueryString(queryParams)
        });
    };

    return (
        <Page>
            <Page.Header>
                <Page.Title>
                    Stock Transfer Table
                </Page.Title>
                <div className="tools" style={{ alignItems: "center" }}>
                    <Button variant="primary" className="text-nowrap" onClick={() => {
                        history.push({
                            pathname: "/" + PAGE_PATHS.STOCK_TRANSFER_NEW
                        });
                    }}>
                        <img
                            className="icon-img sm"
                            style={{ marginRight: ".3rem" }}
                            src="/images/add.svg"
                        />
                        New Stock Transfer Form
                    </Button>
                </div>
            </Page.Header>
            <Page.Body style={{ marginBottom: "123px" }}>
                <Pagination
                    style={{ marginBottom: "15px" }}
                    options={{
                        prev: {
                            disabled: paginationData.prev.disabled
                        },
                        next: {
                            disabled: paginationData.next.disabled
                        },
                    }}
                    position="right"
                    onNextClick={() => {
                        handleFetchNext();
                    }}
                    onPrevClick={() => {
                        handleFetchPrevious();
                    }}
                ></Pagination>
                <StockTransferTable list={list} loading={loading} style={{ marginBottom: "15px" }}></StockTransferTable>
                <Pagination
                    options={{
                        prev: {
                            disabled: paginationData.prev.disabled
                        },
                        next: {
                            disabled: paginationData.next.disabled
                        },
                    }}
                    position="right"
                    onNextClick={() => {
                        handleFetchNext();
                    }}
                    onPrevClick={() => {
                        handleFetchPrevious();
                    }}
                ></Pagination>
            </Page.Body>
        </Page>
    )
}

export default StockTransferListPage;