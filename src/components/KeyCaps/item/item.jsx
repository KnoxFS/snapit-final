import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useSettings } from "hooks/use-settings";

const classes = {
  base: "relative inline-flex items-center justify-center font-bold leading-none uppercase border-t",
  theme: {
    light: "text-gray-700 bg-gray-50 border-gray-100 shadow-md rounded-lg",
    dark: "shadow-primary text-gray-50 border-gray-600 bg-gray-700 rounded-lg",
    "light-gray":
      "bg-gray-7 shadow-gray border border-gray-6 bg-white rounded-lg",
    "dark-gray": "shadow-inset bg-black-2 text-white rounded-lg",
    gray: "shadow-gray border border-gray-6 bg-white rounded-lg",
    black:
      "bg-black-3 shadow-black-primary rounded-lg border-2 text-white border-white border-opacity-20",
    outline: "rounded border border-black bg-white ring-1 ring-black",
  },
  size: {
    md: "px-3 min-w-[40px] py-2.5",
    lg: "px-10 py-9 text-3xl",
  },
  iconSize: {
    md: "mr-4",
    lg: "mr-6",
  },
};

// eslint-disable-next-line react/prop-types
const OutlineLines = ({ size }) => (
  <>
    <span
      className={classNames(
        "absolute h-px w-2 rotate-[35deg] bg-black",
        size === "md" && "left-[-3px] top-0 w-1",
        size === "lg" && "left-[-7px] -top-px w-2"
      )}
    />
    <span
      className={classNames(
        "absolute h-px w-2 rotate-[140deg] bg-black",
        size === "md" && "right-[-3px] top-0 w-1",
        size === "lg" && "right-[-7px] -top-px w-2"
      )}
    />
    <span
      className={classNames(
        "absolute h-px w-2 rotate-[140deg] bg-black",
        size === "md" && "left-[-3px] bottom-0 w-1",
        size === "lg" && "left-[-7px] -bottom-px w-2"
      )}
    />
    <span
      className={classNames(
        "absolute h-px w-2 rotate-[35deg] bg-black",
        size === "md" && "right-[-3px] bottom-0 w-1",
        size === "lg" && "right-[-7px] -bottom-px w-2"
      )}
    />
  </>
);

const Item = ({ text, isFirstItem, theme, size }) => {
  const [settings] = useSettings();
  return (
    <div className="flex items-center">
      {!isFirstItem && settings.showPlus ? (
        <PlusIcon className={classNames("h-6 w-6", classes.iconSize[size])} />
      ) : null}
      <div className="relative">
        <span
          className={classNames(
            classes.base,
            theme && classes.theme[theme],
            size && classes.size[size],
            theme === "outline" && size === "md" && "ring-offset-4",
            theme === "outline" && size === "lg" && "ring-offset-8"
          )}
        >
          {text}
        </span>
        {theme === "outline" && <OutlineLines size={size} />}
      </div>
    </div>
  );
};

Item.propTypes = {
  text: PropTypes.string,
  isFirstItem: PropTypes.bool,
  theme: PropTypes.oneOf(Object.keys(classes.theme)),
  size: PropTypes.oneOf(Object.keys(classes.size)),
};

Item.defaultProps = {
  text: null,
  isFirstItem: false,
  theme: "light",
  size: "md",
};

export default Item;
