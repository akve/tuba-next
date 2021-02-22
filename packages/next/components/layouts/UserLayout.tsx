import React, { useState, useRef, useEffect } from 'react';
import { withRouter, Router } from 'next/router';

import AdminNavbar from '@pdeals/next/components/Navbars/AdminNavbar';
import Sidebar from '@pdeals/next/components/Sidebar/Sidebar';

import routes from '@pdeals/next/routes.user';
import PublicNavbar from '@pdeals/next/components/Navbars/PublicNavbar';
import { t } from '@pdeals/next/utils/i18n';
import ShopSidebar from '@pdeals/next/components/Sidebar/ShopSidebar';
import ProductsList from '@pdeals/next/components/ProductsList/ProductsList';

const UserLayout = (props) => {
  return <>{props.children}</>;
};

export default withRouter(UserLayout);
