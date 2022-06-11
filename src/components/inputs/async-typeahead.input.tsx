import { Button } from "react-bootstrap";
import { AsyncTypeahead, Input } from "react-bootstrap-typeahead";

const AsyncTypeaheadInput = ({
  selected = [],
  options = [],
  id = null,
  onChange = null,
  multiple = false,
  placeHolder = "Select",
}: any) => {

    return (
        <AsyncTypeahead
        isLoading={false}
        labelKey="login"
        // maxResults={PER_PAGE - 1}
        minLength={2}
        // onInputChange={handleInputChange}
        onSearch={() => {
            console.log("on search");
        }}
        options={options}
        placeholder="Search for a Github user..."
        renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
            <div className="close-btn-input">
              <Input
                {...inputProps}
                className="form-control text-field"
                ref={(input) => {
                  inputRef(input);
                  referenceElementRef(input);
                }}
              />
              {selected.length > 0 && (
                <button
                  className="btn btn-default btn-sm clear-btn"
                  onClick={() => {
                      console.log("clearning");                      
                  }}
                >
                  <span className="text-danger font-weight-bold">X</span>
                </button>
              )}
            </div>
          )}
        // renderMenuItemChildren={(option) => (
        //   <div key={option.id}>
        //     <img
        //       alt={option.login}
        //       src={option.avatar_url}
        //       style={{
        //         height: '24px',
        //         marginRight: '10px',
        //         width: '24px',
        //       }}
        //     />
        //     <span>{option.login}</span>
        //   </div>
        // )}
        useCache={false}
      />
    )
};
