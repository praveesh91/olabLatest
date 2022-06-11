import React, { FC } from "react";
import { Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "../List.module.scss";

interface IPaginationProps {
  nextBtnActive: boolean;
  prevBtnActive: boolean;
  handleClickNext: () => void;
  handleClickPrev: () => void;
}

const OrderListPagination: FC<IPaginationProps> = ({
  handleClickNext,
  handleClickPrev,
  nextBtnActive,
  prevBtnActive,
}) => {
  return (
    <div className="orderListPagination">
      <Space>
        <Button disabled={prevBtnActive} onClick={handleClickPrev}>
          <LeftOutlined />
          Prev
        </Button>
        <Button disabled={nextBtnActive} onClick={handleClickNext}>
          Next
          <RightOutlined />
        </Button>
      </Space>
    </div>
  );
};
export default OrderListPagination;
