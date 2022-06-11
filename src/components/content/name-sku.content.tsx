import React, { ReactNode } from "react";

const NameSkuContent = ({
  name = "",
  sku = "",
  style = {},
  className = "",
  size="xxs"
}: {
  name: string | ReactNode;
  sku: string | ReactNode;
  style?: any;
  className?: string;
  size?:string
}) => {
  return (
    <div className={`des-tag des-tag-${size} ${className}`} style={style}>
      <div className="title title-case">{name}</div>
      <div className="des font-weight-bold">{sku}</div>
    </div>
  );
};

export default NameSkuContent;
