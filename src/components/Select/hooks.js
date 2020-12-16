import { useEffect, useState } from "react";
import { useClickOutside } from "hooks";
import { blankValue } from "./helpers";
import { useTransition } from "react-spring";

export function useSelect(
  options,
  disabled,
  onInputChange,
  inputValue,
  autoFocus,
  onChange,
  searchable = true,
  error = false
) {
  // Common Select Hooks
  const resetMenu = (focusedIndex = 0) => {
    setFocusedOptionIndex(focusedIndex);
    setMenuOpened(false);
    if (searchable && onInputChange && inputValue) onInputChange("");
  };

  const onSelectOption = (cb) => {
    if (!menuOpened) return;
    const optionIndex = focusedOptionIndex;
    const optionByIndex = options[optionIndex];
    if (options[optionIndex].onClick !== undefined) {
      options[optionIndex].onClick();
      return;
    }
    cb(optionByIndex, optionIndex);
  };

  const openMenu = () =>
    setMenuOpened((menuOpened) => !disabled && !menuOpened);

  const cancelSelection = (e) => {
    if (disabled) return;
    onChange(blankValue);
    resetMenu();
    e.stopPropagation();
  };

  const onSearch = (e) => {
    const searchValue = e.target.value;
    if (onInputChange) onInputChange(searchValue);
  };

  // Keyboard Handlers
  const onTypeArrowHandler = (isUp) => {
    if (!menuOpened) return;
    const maxOptionIndex = options.length - 1;
    const newIndex =
      focusedOptionIndex === maxOptionIndex
        ? 0
        : focusedOptionIndex + (isUp ? -1 : 1);
    setFocusedOptionIndex(newIndex);
  };
  const onTypeDefaultHandler = (e) => {
    if (!menuOpened) return;
    const canChangeInput =
      searchable &&
      !inputValue &&
      String.fromCharCode(e.keyCode).match(/(\w|\s)/g) && // rename this to a variable
      onInputChange;
    canChangeInput && onInputChange(e.key);
  };

  const [menuOpened, setMenuOpened] = useState(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const [containerRef] = useClickOutside(resetMenu);

  useEffect(() => {
    if (disabled) {
      setMenuOpened(false);
      if (searchable && onInputChange && inputValue) onInputChange("");
      return;
    }
    if (autoFocus) setMenuOpened(true);
  }, [disabled, autoFocus, searchable, inputValue, onInputChange]);

  useEffect(() => {
    if (searchable && inputValue && !error) setMenuOpened(options.length > 0);
  }, [searchable, inputValue, options, error]);

  const transitions = useTransition(menuOpened, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    duration: 100
  });

  return {
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
    onTypeDefaultHandler,
    onTypeArrowHandler
  };
}

export function useHandleKeyboardHook(
  onArrowDownHandler,
  onArrowUpHandler,
  onEnterHandler,
  onTypeDefaultHandler
) {
  const handleKeyboard = (event) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        onArrowDownHandler(event);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        onArrowUpHandler(event);
        break;
      }
      case "Enter": {
        event.preventDefault();
        onEnterHandler(event);
        break;
      }
      default:
        if (onTypeDefaultHandler) onTypeDefaultHandler(event);
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("keydown", handleKeyboard);
    };
  });
}
