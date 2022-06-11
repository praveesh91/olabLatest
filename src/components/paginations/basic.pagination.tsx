import { useEffect, useState } from "react";

const Pagination = ({
  options = {
    prev: {
      disabled: true,
    },
    next: {
      disabled: true,
    },
  },
  onNextClick,
  onPrevClick,
  className = "",
  position = "right",
  style = {}
}: {
  options: {
    prev: {
      disabled: boolean;
    };
    next: {
      disabled: boolean;
    };
  };
  onNextClick?: any;
  onPrevClick?: any;
  className?: string;
  position?: string;
  style?: any;
}) => {
  return (
    <div
      className={`pagination ${position} ${className}`}
      style={{ backgroundColor: "white", alignItems: "center", ...style }}
    >
      <button
        className="btn btn-default btn-pagination"
        disabled={options?.next.disabled}
        onClick={() => {
          if (onNextClick) {
            onNextClick();
          }
        }}
      >
        Next
        <i
          className="fa fa-angle-right-dark"
          style={{ marginLeft: ".5rem" }}
        ></i>
      </button>
      <button
        className="btn btn-default btn-pagination"
        disabled={options?.prev.disabled}
        onClick={() => {
          if (onPrevClick) {
            onPrevClick();
          }
        }}
      >
        <i className="fa fa-angle-left-dark" style={{ marginRight: ".5rem" }} />
        Prev
      </button>
    </div>
  );
};

export default Pagination;
