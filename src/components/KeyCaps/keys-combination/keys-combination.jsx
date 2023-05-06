import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useSettings } from "hooks/use-settings";

import Item from "../item/item";

const sizeStyles = {
  md: "space-x-4",
  lg: "p-2.5 space-x-6",
};

const macCharsMap = {
  command: "⌘",
  cmd: "⌘",
  shift: "⇧",
  ctrl: "⌃",
  control: "⌃",
  option: "⌥",
  alt: "⌥",
  delete: "⌫",
  backspace: "⌫",
  up: "↑",
  right: "→",
  down: "↓",
  left: "←",
};

const KeysCombination = ({ value, theme, themeSelected, size, wrapperRef }) => {
  const [{ macChars }] = useSettings();

  let newValue = value.map((v) => v.toLocaleLowerCase());
  if (macChars) {
    newValue = newValue.map((v) =>
      typeof macCharsMap[v] !== "undefined" ? macCharsMap[v] : v
    );
  }
  return (
    <div
      className={classNames(
        "flex items-center justify-center",
        sizeStyles[size]
      )}
      ref={theme === themeSelected ? wrapperRef : undefined}
    >
      {Boolean(newValue?.length) &&
        newValue.map((text, idx) => {
          const isFirstItem = idx === 0;
          return (
            <Item
              size={size}
              text={text}
              isFirstItem={isFirstItem}
              key={idx}
              theme={theme}
            />
          );
        })}
    </div>
  );
};

KeysCombination.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  theme: PropTypes.string,
  size: PropTypes.string,
  wrapperRef: PropTypes.object,
  themeSelected: PropTypes.string,
};

KeysCombination.defaultProps = {
  value: null,
  theme: "light",
  size: "md",
  wrapperRef: null,
  themeSelected: null,
};

export default KeysCombination;
