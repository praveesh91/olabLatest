import { useEffect, useState } from "react";
import { generateId } from "../../services/conversion.service";

const SelectDropdown = ({
  list = [],
  selected = null,
  onChange = null,
  className = null,
  placeHolder = null,
  disabled = false,
  id = null,
  style = {},
  toggleStyle = {},
}: any) => {
  const uniqueId = id || generateId();
  const defaultText = placeHolder ? placeHolder : "Select";
  const [tempSelected, setTempSelected] = useState<{
    label: string;
    value: string | number | null;
  }>(() => {
    if (!selected) {
      selected = {
        label: selected ? selected.label : defaultText,
        value: selected ? selected.value : null,
      };
    }
    return selected;
  });

  useEffect(() => {
    if (selected) {
      setTempSelected(selected);
    } else {
      setTempSelected({
        label: selected ? selected.label : defaultText,
        value: selected ? selected.value : null,
      });
    }
  }, [selected]);
  return (
    <>
      <div className={`dropdown select ${className}`} style={style}>
        <button
          className="btn btn-outline-primary dropdown-toggle"
          id={uniqueId}
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ width: "100%", color: "#7D7AB9", ...toggleStyle }}
          disabled={disabled}
        >
          <span className="text" style={{ overflow: "hidden" }}>
            {" "}
            {tempSelected.label}
          </span>
          <i className="indicator fa fa-toggle-angle"></i>
        </button>
        <ul
          className="dropdown-menu"
          aria-labelledby={uniqueId}
          style={{ minWidth: "100px" }}
        >
          {list.map((item: any, i: any) => {
            return (
              <li key={i}>
                <div
                  className={`dropdown-item ${
                    tempSelected.value === item.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setTempSelected(item);
                    if (onChange) {
                      onChange(item);
                    }
                  }}
                >
                  {item.label}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SelectDropdown;
