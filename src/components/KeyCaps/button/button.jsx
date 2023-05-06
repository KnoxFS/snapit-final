import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Link from "../link/link";

const themeStyles = {
  base: " inline-flex items-center transition-colors duration-200",
  outline: "border rounded-xl uppercase text-black-1 border-black-1",
  "outline-gray":
    "border border-gray-2 text-gray-2 rounded-xl uppercase hover:text-black-1 hover:border-black-1",
  orange: "bg-orange font-bold text-white rounded-md",
};

const loaderStyles =
  "background-loader bg-center bg-no-repeat text-transparent";

const sizeStyles = {
  sm: "text-sm py-2.5 px-3.5",
  md: "text-base py-4 px-4",
  lg: "text-lg py-2 px-[18px] tracking-wider",
};
// TODO rearrange component Button
const Button = ({
  className: additionalClassName,
  children,
  theme,
  size,
  href,
  loading,
  ...otherProps
}) => {
  const Tag = href ? Link : "button";
  return (
    <Tag
      className={classNames(
        additionalClassName,
        theme && themeStyles.base,
        themeStyles[theme],
        sizeStyles[size],
        loading && loaderStyles
      )}
      href={href}
      {...otherProps}
    >
      {children}
    </Tag>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  theme: PropTypes.oneOf(Object.keys(themeStyles)),
  size: PropTypes.oneOf(Object.keys(sizeStyles)),
  loading: PropTypes.bool,
};

Button.defaultProps = {
  className: null,
  href: null,
  theme: "outline",
  size: "sm",
  loading: false,
};

export default Button;
