import { Tag } from "antd";
import styles from "../List.module.scss";

const ProductFilterTag = ({
  list,
  onFilterRemove = null,
  canClose = true,
}: {
  list: any[];
  onFilterRemove?: any;
  canClose?: boolean;
}) => {
  const handleFilterRemove = (filterList: any[], filter: any, i: number) => {
    let before = [...filterList];
    if (onFilterRemove) {
      onFilterRemove(
        before,
        filterList.filter((el: any) => el !== filter),
        filter
      );
    }
  };
  return (
    <div className={styles["productTagsContainer"]}>
      {list
        .filter((el: any) => el.label !== undefined && el.label !== "Archived")
        .map((filter: any, i: number) => (
          <Tag
            closable={canClose}
            key={i}
            onClose={(e: any) => {
              e.preventDefault();
              handleFilterRemove(list, filter, i);
            }}>
            {filter.label} : {filter.value}
          </Tag>
        ))}
    </div>
  );
};

export default ProductFilterTag;
