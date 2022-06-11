import { useEffect, useState, FC } from "react";
import { Menu, Dropdown, Button, Space, Radio } from "antd";
import { DownOutlined, SwapOutlined } from "@ant-design/icons";
import styles from "../List.module.scss";
interface ISortProps {
  sortAction: (arg: any) => void;
}

const ProductListSort: FC<ISortProps> = ({ sortAction }) => {
  const [selectedSort, setSelectedSort] = useState<any>({});

  const menu = (
    <div className={styles["productSortDropdown__menu"]}>
      <Menu>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 10px",
          }}>
          <div>Sort By</div>
          <div>
            <a
              onClick={() => {
                sortAction({});
                setSelectedSort({});
              }}>
              Reset
            </a>
          </div>
        </div>
        <Menu.Item>
          {" "}
          <Radio
            value={1}
            checked={selectedSort.o == "sku"}
            onChange={() => {
              setSelectedSort({ o: "sku" });
              sortAction({ o: "sku" });
            }}>
            SKU A-Z
          </Radio>
        </Menu.Item>
        <Menu.Item>
          {" "}
          <Radio
            value={2}
            checked={selectedSort.o == "-sku"}
            onChange={() => {
              setSelectedSort({ o: "-sku" });
              sortAction({ o: "-sku" });
            }}>
            SKU Z-A
          </Radio>
        </Menu.Item>
        <Menu.Item>
          {" "}
          <Radio
            value={3}
            checked={selectedSort.o == "-in_stock"}
            onChange={() => {
              setSelectedSort({ o: "-in_stock" });
              sortAction({ o: "-in_stock" });
            }}>
            In stock (descending)
          </Radio>
        </Menu.Item>
        <Menu.Item>
          {" "}
          <Radio
            value={4}
            checked={selectedSort.o == "in_stock"}
            onChange={() => {
              setSelectedSort({ o: "in_stock" });
              sortAction({ o: "in_stock" });
            }}>
            In stock (ascending)
          </Radio>
        </Menu.Item>
        <Menu.Item>
          {" "}
          <Radio
            value={5}
            checked={selectedSort.o == "booked"}
            onChange={() => {
              setSelectedSort({ o: "booked" });
              sortAction({ o: "booked" });
            }}>
            {" "}
            Booked (descending)
          </Radio>
        </Menu.Item>
        <Menu.Item>
          {" "}
          <Radio
            value={6}
            checked={selectedSort.o == "-booked"}
            onChange={() => {
              setSelectedSort({ o: "-booked" });
              sortAction({ o: "-booked" });
            }}>
            {" "}
            Booked (ascending)
          </Radio>
        </Menu.Item>
      </Menu>
    </div>
  );

  return (
    <div className={styles["productSortDropdown"]}>
      <Dropdown.Button
        className={styles["productSortDropdown__button"]}
        placement="bottomLeft"
        overlay={menu}
        icon={<DownOutlined />}
        trigger={["click"]}>
        <SwapOutlined
          style={{
            color: "#7d7ab9",
            transform: "rotate(90deg)",
          }}
        />
        Sort
      </Dropdown.Button>
    </div>
  );
};

export default ProductListSort;
