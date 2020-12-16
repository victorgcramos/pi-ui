import React from "react";
import PropTypes from "prop-types";
import {
  blankValue,
  defaultLabelKeyGetter,
  defaultValueKeyGetter
} from "../helpers";
import { useBasicSelect } from "./hooks";
import { classNames } from "../../../utils";
import styles from "../styles.css";
import Select from "../Select";

const BasicSelect = ({
  disabled,
  clearable,
  options,
  label,
  separator,
  getOptionLabel,
  getOptionValue,
  optionRenderer,
  valueRenderer,
  optionsFilter,
  className,
  autoFocus,
  searchable,
  value,
  onChange,
  inputValue,
  onInputChange,
  ...props
}) => {
  const { filteredOptions, setOption } = useBasicSelect({
    disabled,
    onChange,
    options,
    getOptionLabel,
    getOptionValue,
    optionsFilter,
    value,
    searchable,
    inputValue
  });

  return (
    <Select {...props}>
      {({
        Label,
        Input,
        BlankInput,
        OptionsSelected,
        controlsSelectWrapper,
        ControlWrapper,
        selectProps
      }) => (
        <>
          <Label />
          <ControlWrapper
            className={classNames(searchable && inputValue && styles.search)}>
            {searchable && inputValue ? <Input /> : <BlankInput />}
            {controlsSelectWrapper(getOptionValue(value))}
          </ControlWrapper>
          <OptionsSelected
            options={filteredOptions}
            onSelect={setOption(selectProps.resetMenu)}
          />
        </>
      )}
    </Select>
  );
};

BasicSelect.propTypes = {
  disabled: PropTypes.bool,
  clearable: PropTypes.bool,
  options: PropTypes.array,
  label: PropTypes.string,
  separator: PropTypes.bool,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  optionRenderer: PropTypes.func,
  valueRenderer: PropTypes.func,
  optionsFilter: PropTypes.func,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  searchable: PropTypes.bool,
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func
};

BasicSelect.defaultProps = {
  disabled: false,
  clearable: false,
  options: [],
  label: "",
  separator: false,
  getOptionLabel: defaultLabelKeyGetter,
  getOptionValue: defaultValueKeyGetter,
  optionRenderer: null,
  valueRenderer: null,
  optionsFilter: null,
  className: "",
  autoFocus: false,
  searchable: false,
  value: blankValue,
  inputValue: "",
  onInputChange: null
};

export default BasicSelect;
