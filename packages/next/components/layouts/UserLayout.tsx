import React from 'react';
import { withRouter } from 'next/router';

const UserLayout = (props) => {
  return <>{props.children}</>;
};

export default withRouter(UserLayout);
