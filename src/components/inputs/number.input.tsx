import { useEffect, useState } from "react";

const NumberInput = ({
  className = null,
  style = {},
  onChange = null,
  value = null,
  min = null,
  max = null,
}: any) => {
  const [inputVal, setInputVal] = useState<any>(value);

  useEffect(() => {
    if (onChange) {
      onChange(inputVal);
    }
  }, [inputVal]);

  useEffect(() => {
    setInputVal(value);
  }, [value]);

  useEffect(() => {
    if(inputVal !== null && min != null && inputVal < min) {
      setInputVal(min);
    }
  }, [min]);

  useEffect(() => {
    if(inputVal !== null && max != null && inputVal > max) {
      setInputVal(max);
    }
  }, [max]);

  const upOrDownValue = (type: string) => {
    let finalValue = null;
    if (isNaN(parseInt(inputVal))) {
      finalValue = 0;
    } else if (type === "+") {
      finalValue = inputVal + 1;
    } else if (type === "-") {
      finalValue = inputVal - 1;
    }

    if (min !== null && finalValue < min) {
      finalValue = min;
    }

    if (max !== null && finalValue > max) {
      finalValue = max;
    }
    setInputVal(finalValue);
  };

  return (
    <>
      <div className={`number-type ${className}`} style={{ ...style }}>
        <input
          className="form-control"
          value={inputVal === null || inputVal === undefined ? "" : inputVal}
          onChange={(event) => {
            if(event.target.value === "") {
              setInputVal(null);
              return;
            }
            let parsedVal = parseInt(event.target.value);
            if (isNaN(parsedVal)) {
              setInputVal(0);
            } else {
              setInputVal(parsedVal);
            }
          }}
        />
        <i className="fa fa-angle-up" onClick={() => upOrDownValue("+")}></i>
        <i className="fa fa-angle-down" onClick={() => upOrDownValue("-")}></i>
      </div>
    </>
  );
};

export default NumberInput;
