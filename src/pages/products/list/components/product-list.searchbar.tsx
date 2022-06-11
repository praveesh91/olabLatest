import { Input } from "antd";
import styles from "../List.module.scss";
const ProductListSearchBar = () => {
  return (
    <div className={styles["productSearch"]}>
      <Input placeholder="Search product" />
    </div>
  );
};

export default ProductListSearchBar;
