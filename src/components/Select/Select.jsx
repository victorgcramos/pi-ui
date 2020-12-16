import React from "react";
import { useSelect } from "./hooks";
import PropTypes from "prop-types";
import { classNames } from "../../utils";
import styles from "./styles.css";
import { SelectOptions, SelectControls, blankValue } from "./helpers";
import { animated } from "react-spring";

const Select = ({
  disabled,
  clearable,
  options,
  label,
  separator,
  onChange,
  getOptionLabel,
  getOptionValue,
  optionRenderer,
  valueRenderer,
  optionsFilter,
  className,
  autoFocus,
  value,
  inputValue,
  onInputChange,
  children
}) => {
  const {
    focusedOptionIndex,
    setFocusedOptionIndex,
    menuOpened,
    setMenuOpened,
    onSelectOption,
    openMenu,
    containerRef,
    resetMenu,
    cancelSelection,
    onSearch,
    transitions,
    onTypeArrowHandler,
    onTypeDefaultHandler
  } = useSelect(
    options,
    // removi o setOption e deixei ele como
    // parametro de callback na selectOption
    // removed setOption and left as a
    disabled,
    onInputChange,
    inputValue,
    autoFocus,
    onChange
  );

  const parentClassNames = classNames(
    styles.select,
    getOptionValue(value) && styles.valueSelected,
    menuOpened ? styles.menuOpened : styles.menuClosed,
    separator && styles.hasSeparator,
    clearable && styles.clearable,
    disabled && styles.disabled,
    className
  );

  const Input = () => (
    <input
      disabled={disabled}
      className={styles.input}
      value={inputValue}
      onChange={onSearch}
      autoFocus
    />
  );

  const BlankInput = () => (
    <div className={styles.value}>
      {value !== blankValue &&
        (valueRenderer ? valueRenderer(value) : getOptionLabel(value))}
    </div>
  );

  const OptionsSelected = ({
    options,
    loading,
    loadingClassName,
    loadingMessage,
    onSelect
  }) =>
    transitions.map(
      ({ item, key, props }) =>
        item && (
          <animated.div className={styles.menu} key={key} style={props}>
            {!loading ? (
              <SelectOptions
                options={options}
                value={value}
                selectOption={onSelectOption(onSelect)}
                focusedOptionIndex={focusedOptionIndex}
                setFocusedOptionIndex={setFocusedOptionIndex}
                optionRenderer={optionRenderer}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
              />
            ) : (
              <div className={loadingClassName}>{loadingMessage}</div>
            )}
          </animated.div>
        )
    );

  const ControlWrapper = ({ children, className }) => (
    <div className={classNames(parentClassNames, className)} onClick={openMenu}>
      {children}
    </div>
  );

  const Label = () => label && <label className={styles.label}>{label}</label>;
  const controlsSelectWrapper = (valueSelected) => () => (
    <SelectControls
      clearable={clearable}
      cancelSelection={cancelSelection}
      valueSelected={valueSelected}
      disabled={disabled}
      separator={separator}
      menuOpened={menuOpened}
    />
  );

  return (
    // tirei o props spread, uma vez que ele não será mais necessário
    <div className={parentClassNames}>
      <div className={styles.fieldset} ref={containerRef}>
        {children({
          Input,
          BlankInput,
          OptionsSelected,
          Label,
          controlsSelectWrapper,
          ControlWrapper,
          selectProps: {
            setMenuOpened,
            optionsFilter,
            openMenu,
            resetMenu,
            cancelSelection,
            onTypeArrowHandler,
            onTypeDefaultHandler
          }
        })}
      </div>
    </div>
  );
};

Select.propTypes = {
  disabled: PropTypes.bool,
  clearable: PropTypes.bool,
  options: PropTypes.array,
  label: PropTypes.string,
  separator: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  optionRenderer: PropTypes.func,
  valueRenderer: PropTypes.func,
  optionsFilter: PropTypes.func,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  value: PropTypes.object,
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func,
  children: PropTypes.node
};

Select.defaultProps = {
  optionsFilter: () => true
};
