import React from "react";
import PropTypes from "prop-types";
import { blankValue } from "../helpers";
import { useBasicSelect } from "./hooks";
import { classNames } from "../../../utils";
import styles from "./styles.css";
import { animated, useTransition } from "react-spring";

const BasicSelect = ({
  disabled,
  clearable,
  options,
  defaultValue,
  label,
  separator,
  onChange,
  getOptionLabel,
  getOptionValue,
  optionRenderer,
  valueRenderer,
  filterOptions,
  className,
  autoFocus,
  ...props
}) => {
  const {
    _options,
    optionContainerRef,
    dropdownRef,
    menuOpened,
    selectedOption,
    focusedOptionIndex,
    openMenu,
    setFocusedOptionIndex,
    getValueKey,
    getLabelKey,
    selectOption,
    cancelSelection
  } = useBasicSelect(
    disabled,
    autoFocus,
    onChange,
    options,
    defaultValue,
    getOptionLabel,
    getOptionValue,
    filterOptions
  );

  const parentClassNames = classNames(
    styles.select,
    getValueKey(selectedOption) && styles.valueSelected,
    menuOpened ? styles.menuOpened : styles.menuClosed,
    separator && styles.hasSeparator,
    clearable && styles.clearable,
    disabled && styles.disabled,
    className
  );

  const transitions = useTransition(menuOpened, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    duration: 100
  });

  return (
    <div className={parentClassNames} {...props}>
      <div className={styles.fieldset}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.controls} onClick={openMenu} ref={dropdownRef}>
          <div className={styles.value}>
            {selectedOption !== blankValue &&
              (valueRenderer
                ? valueRenderer(selectedOption)
                : getLabelKey(selectedOption))}
          </div>
          {clearable && (
            <div className={styles.clear} onClick={cancelSelection} />
          )}
          {separator && <span className={styles.separator} />}
          <div className={styles.arrowContainer}>
            <div className={styles.arrow} />
          </div>
        </div>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div
                className={styles.menu}
                key={key}
                ref={optionContainerRef}
                style={props}>
                {_options.map((_option, index) => (
                  <div
                    onClick={selectOption}
                    onMouseEnter={() => setFocusedOptionIndex(index)}
                    key={index}
                    index={index}
                    className={classNames(
                      index === focusedOptionIndex && styles.focusedOption,
                      getValueKey(selectedOption) === getValueKey(_option) &&
                        styles.selected
                    )}>
                    {_option !== blankValue &&
                      (optionRenderer
                        ? optionRenderer(_option)
                        : getLabelKey(_option))}
                  </div>
                ))}
              </animated.div>
            )
        )}
      </div>
    </div>
  );
};

BasicSelect.propTypes = {
  disabled: PropTypes.bool,
  clearable: PropTypes.bool,
  options: PropTypes.array,
  defaultValue: PropTypes.object,
  label: PropTypes.string,
  separator: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  optionRenderer: PropTypes.func,
  valueRenderer: PropTypes.func,
  filterOptions: PropTypes.func,
  className: PropTypes.string,
  autoFocus: PropTypes.bool
};

BasicSelect.defaultProps = {
  disabled: false,
  clearable: false,
  options: [],
  defaultValue: blankValue,
  label: "",
  separator: false,
  getOptionLabel: null,
  getOptionValue: null,
  optionRenderer: null,
  valueRenderer: null,
  filterOptions: null,
  className: "",
  autoFocus: false
};

export default BasicSelect;
