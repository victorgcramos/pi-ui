import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import { animated, useTransition } from "react-spring";
import { classNames } from "../../utils";
import styles from "./styles.css";
import Dropdown from "../Dropdown/Dropdown.jsx";
import DropdownItem from "../Dropdown/DropdownItem.jsx";

const TabDropdownTrigger = ({
  onClick,
  open,
  ArrowComponent,
  childrenTabs,
  activeTabIndex,
  className
}) => (
  <div className={className}>
    {React.Children.map(childrenTabs, (child, index) => {
      if (index === activeTabIndex) {
        return React.cloneElement(child, {
          onClick: onClick,
          className: styles.activeDropdownTabClass,
          isActive: true,
          mode: "dropdown"
        });
      }
    })}
    <ArrowComponent onClick={onClick} open={open} />
  </div>
);

const Tabs = ({
  onSelectTab,
  activeTabIndex,
  style,
  className,
  children,
  wrap,
  mode,
  contentClassName,
  activeTabClassName,
  ...props
}) => {
  const dropdownMode = mode === "dropdown";
  const vertical = mode === "vertical" || dropdownMode;
  const renderChildrenTabs = useCallback(() => {
    return React.Children.toArray(children)
      .filter(Boolean)
      .map((child, index) => {
        const element = React.cloneElement(child, {
          "data-testid": `tab-${index}`,
          onSelect: onSelectTab,
          tabIndex: index,
          isActive: index === activeTabIndex,
          mode
        });
        return vertical ? (
          <DropdownItem className={styles.customDropdownItem}>
            {element}
          </DropdownItem>
        ) : (
          element
        );
      });
  }, [children, activeTabIndex, mode, vertical, onSelectTab]);

  const tabs = useMemo(
    () => (
      <ul
        className={classNames(
          vertical ? styles.tabsNavVertical : styles.tabsNav,
          wrap && styles.wrap,
          className
        )}
        style={style}
        {...props}>
        {renderChildrenTabs()}
      </ul>
    ),
    [vertical, wrap, className, props, renderChildrenTabs, style]
  );

  const getActiveChild = (props) => {
    return (
      <TabDropdownTrigger
        {...props}
        childrenTabs={children}
        activeTabIndex={activeTabIndex}
        className={classNames(
          activeTabClassName,
          styles.activeDropdownTabWrapper
        )}
      />
    );
  };

  const transitions = useTransition(activeTabIndex, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 350 }
  });

  return (
    <>
      {dropdownMode ? (
        <Dropdown
          customDropdownTrigger={getActiveChild}
          closeOnOutsideClick={true}
          className={className}
          itemsListClassName={classNames(styles.dropdownListClass)}>
          {tabs}
        </Dropdown>
      ) : (
        tabs
      )}
      {transitions.map(({ item, key, props }) => {
        return (
          item === activeTabIndex && (
            <animated.div key={key} style={props} className={contentClassName}>
              {children[item] && children[item].props.children}
            </animated.div>
          )
        );
      })}
    </>
  );
};

TabDropdownTrigger.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool,
  ArrowComponent: PropTypes.func,
  childrenTabs: PropTypes.node,
  activeTabIndex: PropTypes.number,
  className: PropTypes.string
};

Tabs.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onSelectTab: PropTypes.func.isRequired,
  activeTabIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  wrap: PropTypes.bool,
  mode: PropTypes.oneOf(["horizontal", "vertical", "dropdown"]),
  contentClassName: PropTypes.string,
  activeTabClassName: PropTypes.string
};

Tabs.defaultProps = {
  wrap: false,
  mode: "horizontal"
};

export default Tabs;
