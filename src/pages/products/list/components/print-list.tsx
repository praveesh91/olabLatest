import { Image, Table, Tag, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IProductDetail } from "../../../../interfaces/IProducts";
import listProducts from "../../../../services/apis/products/list-products.service";
import { processQueryParams } from "../../../../services/conversion.service";
import { getQueryParamsFromUrl } from "../../../../services/get-values.service";
import styles from "../List.module.scss";
import ProductFilterTag from "./product-filter-tag";

const { Text, Title } = Typography;

const PrintList = () => {
  const location: any = useLocation();
  const [productList, setProductList] = useState([]);
  const [filteredTags, setFilteredTags] = useState<any>([]);

  useEffect(() => {
    let params = getQueryParamsFromUrl();
    params = processQueryParams(params);
    getAllProductsFunc({
      queryParams: params,
    });
  }, [location]);
  useEffect(() => {
    setFilteredTags(location?.state?.params);
  }, []);

  const getAllProductsFunc = async (data?: any) => {
    try {
      const res: any = await listProducts({
        url: data?.url,
        queryParams: { ...data?.queryParams, paginate: "False" },
      });
      setProductList(res.data);

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "id",
      render: (text: any, record: any) => (
        <Image width={60} src={text} fallback={"/images/fallback.png"} />
      ),
    },
    {
      title: "Name / SKU",
      key: "id",
      dataIndex: "name",
      render: (text: any, record: any) => (
        <>
          {" "}
          <Text strong>{text}</Text>
          <div>
            <Text type="secondary">{record?.sku}</Text>
          </div>
        </>
      ),
    },
    {
      title: "In Stock",
      dataIndex: "instock",
      key: "id",
    },
    {
      title: "Booked",
      dataIndex: "booked",
      key: "id",
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "id",
    },
    {
      title: "Incoming",
      key: "id",
      dataIndex: "incoming",
    },

    {
      title: "Category",
      key: "id",
      dataIndex: "category",
    },

    {
      title: "Online Listings",
      key: "id",
      dataIndex: "listings",
    },
    {
      title: "Alert Threshold",
      key: "id",
      dataIndex: "alert",
    },
    {
      title: "Properties",
      key: "id",
      dataIndex: "properties",
      render: (text: any, record: any) => (
        <>
          <div className={styles["productTable__tags"]}>
            {record.properties.archieved && <Tag color="success">Archived</Tag>}
          </div>
          <div className={styles["productTable__tags"]}>
            {record.properties.synched && <Tag color="processing">Synced</Tag>}
          </div>
          <div className={styles["productTable__tags"]}>
            {record.properties.bundle_type === "BUNDLED" && (
              <Tag color="warning">Bundled</Tag>
            )}
          </div>
        </>
      ),
    },
  ];
  const productListTableData = productList?.map(
    (el: IProductDetail, id: number) => ({
      key: id,
      image: el.image_url,
      name: el.name,
      sku: el.sku,
      alert: el.alert_threshold,
      instock: el.in_stock,
      category: el.group1?.name,
      booked: el.booked,
      id: el.id,
      properties: {
        bundle_type: el.bundle_type,
        synched: el.tracking_type == 2 ? true : false,
        archieved: el.is_archived,
      },
      listings: el.count_links,
      available: el.available,
      incoming: el.incoming,
    })
  );

  return (
    <div className={styles["productTablePrint"]}>
      {" "}
      <div className={styles["productTablePrint__headers"]}>
        <Title level={5}>Product List</Title>
        <Text strong>Print Time: {moment().format("L LT")}</Text>
        <div className={styles["productTablePrint__headers__filterTag"]}>
          <Text style={{ paddingRight: "10px" }}>Filters Applied:{""}</Text>
          <ProductFilterTag list={filteredTags} canClose={false} />
        </div>
      </div>
      <Table
        columns={columns}
        pagination={false}
        dataSource={productListTableData}
      />
    </div>
  );
};

export default PrintList;
