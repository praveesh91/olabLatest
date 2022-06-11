import { Tag } from "antd";
import styles from "../List.module.scss";

const BundleFilterTag = ({
  list,
  onFilterRemove = null,
}: {
  list: any[];
  onFilterRemove?: any;
}) => {
  const handleFilterRemove = (filterList: any[], filter: any, i: number) => {
    let before = [...filterList];
    let after = [
      ...filterList.slice(0, i),
      ...filterList.slice(i + 1, filterList.length),
    ];
    if (onFilterRemove) {
      onFilterRemove(before, after, filter);
    }
  };
  return (
    <div className={styles["productTagsContainer"]}>
      {list
        .filter((el: any) => el.label !== undefined)
        .map((filter: any, i: number) => (
          <Tag
            closable
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

export default BundleFilterTag;
