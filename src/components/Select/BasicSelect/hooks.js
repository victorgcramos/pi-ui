import { useState, useEffect } from "react";
import { blankValue, matchOption, findExact } from "../helpers";

export function useBasicSelect({
  disabled,
  onChange,
  options,
  getOptionLabel,
  getOptionValue,
  optionsFilter,
  value,
  searchable,
  inputValue
}) {
  const [filteredOptions, setOptions] = useState([]);

  useEffect(() => {
    let filteredOptions = options.filter(optionsFilter);
    if (searchable && inputValue)
      filteredOptions = matchOption(
        filteredOptions,
        getOptionLabel,
        inputValue
      );
    setOptions(filteredOptions);
  }, [searchable, inputValue, optionsFilter, options, getOptionLabel]);

  useEffect(() => {
    if (optionsFilter && !optionsFilter(value) && getOptionLabel(value))
      onChange(blankValue);
  }, [disabled, value, optionsFilter, onChange, getOptionLabel]);

  const setOption = (option, knownIndex, cb) => {
    const index =
      knownIndex ||
      findExact(filteredOptions, getOptionLabel, getOptionValue, option);
    onChange(option);
    cb(index);
  };

  return {
    filteredOptions,
    setOption
  };
}
