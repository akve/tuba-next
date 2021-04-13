import React from 'react';
import Link, { LinkProps } from 'next/link';

const NextLink: React.FunctionComponent<LinkProps> = (props) => {
  return (
    <Link prefetch={false} {...props}>
      {props.children}
    </Link>
  );
};

export default NextLink;
