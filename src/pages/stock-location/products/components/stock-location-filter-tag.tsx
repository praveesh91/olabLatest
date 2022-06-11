import { Tag } from "antd";
import "../ProductList.scss";

const StockLocationFilterTag = ({
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
    let after = [
      ...filterList.slice(0, i),
      ...filterList.slice(i + 1, filterList.length),
    ];
    if (onFilterRemove) {
      onFilterRemove(before, after, filter);
    }
  };
  return (
    <div className="productTagsContainer">
      {list
        .filter((el: any) => el.label !== undefined)
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

export default StockLocationFilterTag;
