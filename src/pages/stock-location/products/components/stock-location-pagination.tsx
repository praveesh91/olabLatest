import React, { FC } from "react";
import { Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "../ProductList.scss";

interface IPaginationProps {
  nextBtnActive: boolean;
  prevBtnActive: boolean;
  handleClickNext: () => void;
  handleClickPrev: () => void;
}

const StockLocationPagination: FC<IPaginationProps> = ({
  handleClickNext,
  handleClickPrev,
  nextBtnActive,
  prevBtnActive,
}) => {
  return (
    <div className={"stockLocationPagination"}>
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
export default StockLocationPagination;
