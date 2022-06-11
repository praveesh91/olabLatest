import { Image, Table, Tag, Typography, Avatar } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IProductDetail } from "../../../../interfaces/IProducts";
import getOrderList from "../../../../services/apis/ecom/orders/get-order-list";
import listProducts from "../../../../services/apis/products/list-products.service";
import { processQueryParams } from "../../../../services/conversion.service";
import { getQueryParamsFromUrl } from "../../../../services/get-values.service";
import "../ProductList.scss";
import OrderFilterTags from "../../../orders/list/components/order-filter-tags";
import StockLocationFilterTag from "./stock-location-filter-tag";
import listStockLevels from "../../../../services/apis/stock/list-stock-levels.service";

const { Text, Title, Link } = Typography;

const PrintStockLocationList = () => {
  const location: any = useLocation();
  const [stockLocationList, setStockLocationList] = useState<any>();
  const [filteredTags, setFilteredTags] = useState<any>([]);

  useEffect(() => {
    let params = getQueryParamsFromUrl();
    params = processQueryParams(params);
    getAllOrdersFunc({
      queryParams: params,
    });
  }, [location]);
  useEffect(() => {
    setFilteredTags(location?.state?.params);
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: "Image",
      dataIndex: "image",
      key: "id",
      width: 80,
      render: (text: any, record: any) => (
        <Image width={60} src={text} fallback={"/images/fallback.png"} />
      ),
    },

    {
      title: "Warehouse",
      dataIndex: "name",
      key: "id",
      width: 150,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "In Stock",
      dataIndex: "instock",
      key: "id",
      width: 90,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Booked",
      dataIndex: "booked",
      key: "id",
      width: 80,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "id",
      width: 90,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Incoming",
      key: "id",
      dataIndex: "incoming",
      width: 90,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },

    {
      title: "UOM",
      key: "id",
      dataIndex: "uom",
      width: 70,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },

    {
      title: "Last Updated",
      key: "id",
      dataIndex: "updated",
      width: 130,
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
  ];
  const getAllOrdersFunc = async (data?: any) => {
    try {
      const res: any = await listStockLevels({
        url: data?.url,
        queryParams: { ...data?.queryParams, paginate: "False" },
      });
      setStockLocationList(res.data);

      return data;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const stockLocationTableData = stockLocationList?.map(
    (el: any, id: number) => ({
      key: id,
      image: el.product.image_url,
      name: el.warehouse.name,
      sku: el.sku,
      instock: el.in_stock,
      category: el.group1?.name,
      booked: el?.booked?.slice(0, -5),
      id: el.id,
      uom: el.product.uom,
      available: el.available,
      updated: moment(el.updated).format("DD/MM/YYYY LT"),
      incoming: el.incoming?.slice(0, -5),
    })
  );

  return (
    <div className={"productTablePrint"}>
      {" "}
      <div className={"productTablePrint__headers"}>
        <Title level={5}>Product List</Title>
        <Text strong>Print Time: {moment().format("L LT")}</Text>
        <div className={"productTablePrint__headers__filterTag"}>
          <Text style={{ paddingRight: "10px" }}>Filters Applied:{""}</Text>
          <StockLocationFilterTag list={filteredTags} canClose={false} />
        </div>
      </div>
      <Table
        columns={columns}
        pagination={false}
        dataSource={stockLocationTableData}
      />
    </div>
  );
};

export default PrintStockLocationList;
