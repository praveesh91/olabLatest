import React, { FC, useEffect, useState } from "react";
import styles from "../Details.module.scss";
import getProductListing from "../../../../services/apis/products/get-product-online-listings";

import { Table, Button, Tag } from "antd";
import { LinkOutlined } from "@ant-design/icons";

import { Link, useParams } from "react-router-dom";
import {
  IListingDetail,
  IListingsProps,
  IParamTypes,
} from "../../../../interfaces/IProducts";
import moment from "moment";

const Listings: FC<IListingsProps> = ({}) => {
  let { id } = useParams<IParamTypes>();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<any>([]);

  const getAllProductListings = async () => {
    setLoading(true);

    const { data } = await getProductListing({
      queryParams: { paginate: "False", product: id },
    });
    setListings(data);
    setLoading(false);
  };
  useEffect(() => {
    getAllProductListings();
  }, []);
  const columns = [
    {
      title: "Sumtracker Name",
      dataIndex: "sumtrackerName",
      key: "sumtrackerName",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Listing Name",
      dataIndex: "listingName",
      key: "listingName",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Channel",
      key: "channel",
      dataIndex: "channel",
      render: (text: any, record: any) => (
        <>
          <div>{text.name}</div>
          <div>{text.code}</div>
        </>
      ),
    },

    {
      title: "Listing Link",
      key: "listingLink",
      dataIndex: "listingLink",
      render: (text: any, record: any) =>
        record.channel.name === "SHOPIFY" ? (
          <a
            target="_blank"
            rel="noopener"
            href={`https://${record.channel.code}.myshopify.com/admin/products/${record.remote_product_id}/variants/${record.remote_id}`}>
            <Button icon={<LinkOutlined />} />
          </a>
        ) : (
          <a
            target="_blank"
            rel="noopener"
            href={`https://www.etsy.com/your/shops/${record.channel.code}/tools/listings/${record.remote_product_id}`}>
            <Button icon={<LinkOutlined />} />
          </a>
        ),
    },
    {
      title: "Listing ID",
      key: "listingId",
      dataIndex: "listingId",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "end" }}>{text}</div>
      ),
    },
    {
      title: "Properties",
      key: "properties",
      dataIndex: "properties",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          <div className={styles["productTable__tags"]}>
            {record.properties.archieved && <Tag color="success">Archived</Tag>}
          </div>
          <div className={styles["productTable__tags"]}>
            {record.properties.synched ? (
              <Tag color="processing">Sync on</Tag>
            ) : (
              <Tag color="processing">Sync off</Tag>
            )}
          </div>
          <div className={styles["productTable__tags"]}>
            {record.properties.bundle_type === "BUNDLED" && (
              <Tag color="warning">Bundled</Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Update At",
      key: "updated",
      dataIndex: "updated",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>{text}</div>
      ),
    },
    {
      title: "Inv Sync",
      key: "sync",
      dataIndex: "sync",
      render: (text: any, record: any) => (
        <div style={{ textAlign: "start" }}>
          {text ? (
            <span className={styles["productListing__active"]} />
          ) : (
            <span className={styles["productListing__inactive"]} />
          )}
        </div>
      ),
    },
  ];

  const listingsTableData = listings?.map((el: IListingDetail) => ({
    sumtrackerName: el.remote_name,
    sku: el.remote_sku,
    listingName: el.remote_name,
    channel: { name: el.channel.name, code: el.channel.code },
    channelCode: el.channel.code,
    listingLink: el,
    sync: el.has_inventory_sync,
    listingId: el.remote_id,
    properties: {
      bundle_type: el.product?.bundle_type,
      synched: el.product?.tracking_type == 2 ? true : false,
      archieved: el.product?.is_archived,
    },
    updated: moment(el.stock_update_time).format("DD/MM/YYYY, h:mm A"),
  }));

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={listingsTableData}
        pagination={false}
      />
    </div>
  );
};

export default Listings;
