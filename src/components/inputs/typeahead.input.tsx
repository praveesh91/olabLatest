import { Input, Typeahead } from "react-bootstrap-typeahead";
import { generateId } from "../../services/conversion.service";

const TypeaheadInput = ({
  disabled = false,
  selected = [],
  options = [],
  id,
  onChange = null,
  multiple = false,
  placeHolder = "Select",
  onInputClick = null,
  onClear = null,
  withNewButton = false,
  withCrossButton = false,
  onNewClick = null,
  onType=null
}: any) => {
  const uniqueId = id || generateId();
  const clearInput = () => {
    if (onChange) {
      onChange([]);
    }
    if (onClear) {
      onClear();
    }
  };

  return (
    <Typeahead
      disabled={disabled}
      multiple={multiple}
      placeholder={placeHolder}
      id={uniqueId}
      selected={selected}
      onChange={(selected) => {
        if (onChange) {
          onChange(selected);
        }
      }}
      onInputChange={(text) => {
        if(onType) {
          onType(text);
        }
      }}
      options={options}
      renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
        <div className="close-btn-input">
          <Input
            {...inputProps}
            className="form-control text-field"
            ref={(input) => {
              inputRef(input);
              referenceElementRef(input);
            }}
            onClick={(e) => {
              if (onInputClick) {
                onInputClick(e);
              }
            }}
          />
          { withCrossButton && selected.length > 0 && (
            <button
              disabled={disabled}
              className="btn btn-outline-secondary btn-sm clear-btn reset-text"
              onClick={clearInput}
            >
              <span className="font-weight-bold">X</span>
            </button>
          )}
          {withNewButton &&  !disabled && <button className="btn btn-outline-secondary btn-sm" onClick={(e) => {
            if (onNewClick) {
              onNewClick();
            }
          }} style={{ position: "absolute", top: "3px", right: "4px", zIndex: "1" }}>
            + New
          </button>}
        </div>
      )}
    />
  );
};

export default TypeaheadInput;
