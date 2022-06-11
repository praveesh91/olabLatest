const AppliedFilterList = ({
  list,
  onFilterRemove = null,
}: {
  list: any[];
  onFilterRemove: any;
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
    <div
      className="group gap-md"
      style={{ padding: "10px 0px", flexWrap: "wrap" }}>
      {list.map((filter: any, i: number) => (
        <span key={i} className="tag tag-default">
          {filter.label} : {filter.value}
          <span
            className="thin-close cursor-pointer"
            onClick={() => {
              handleFilterRemove(list, filter, i);
            }}></span>
        </span>
      ))}
    </div>
  );
};

export default AppliedFilterList;
