import NextLink from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const Link = ({ className, href, children, ...otherProps }) => (
  <NextLink href={href} {...otherProps}>
    <a className={className}>{children}</a>
  </NextLink>
);

Link.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Link.defaultProps = {
  className: null,
};

export default Link;
