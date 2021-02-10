import React, { useState, useRef, useEffect } from 'react';
import { withRouter, Router } from 'next/router';

import AdminNavbar from '@pdeals/next/components/Navbars/AdminNavbar';
import Sidebar from '@pdeals/next/components/Sidebar/Sidebar';

import routes from '@pdeals/next/routes.user';

const UserLayout = (props) => {
  const [sidenavOpen, setSidenavOpen] = useState(true);

  useEffect(() => {
    document.body.classList.add('g-sidenav-hidden');
  }, []);

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      const route: any = routes[i];
      if (props.router.pathname.indexOf(route.layout + route.path) !== -1) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };

  const toggleSidenav = (e) => {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
    }
    setSidenavOpen((prevSidenavOpen) => !prevSidenavOpen);
  };

  const getNavbarTheme = () => {
    return props.router.pathname.indexOf('admin/alternative-dashboard') === -1 ? 'dark' : 'light';
  };

  const closeSidenav = () => {
    setSidenavOpen(false);
  };

  return (
    <>

        {props.children}

    </>
  );
};

export default withRouter(UserLayout);
