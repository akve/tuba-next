import React, { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Collapse, NavbarBrand, Navbar, NavItem, NavLink, Nav } from 'reactstrap';

interface IProps {
  toggleSidenav: () => void;
  sidenavOpen: boolean;
  routes: any;
  logo: {
    innerLink?: string;
    outterLink?: string;
    imgSrc: string;
    imgAlt: string;
  };
  rtlActive?: boolean;
  router: any;
}

class Sidebar extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getCollapseStates(props.routes),
    };
  }
  componentDidMount() {
    if (typeof window === 'undefined') return null;

    this.setState({
      windowWidth: window.innerWidth,
      navigatorPlatform: navigator.platform,
    });
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute = (routeName) => {
    return this.props.router.pathname.indexOf(routeName) > -1 ? 'active' : '';
  };
  // makes the sidenav normal on hover (actually when mouse enters on it)
  onMouseEnterSidenav = () => {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.add('g-sidenav-show');
    }
  };
  // makes the sidenav mini on hover (actually when mouse leaves from it)
  onMouseLeaveSidenav = () => {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-show');
    }
  };
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (this.props.router.pathname.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // this is used on mobile devices, when a user navigates
  // the sidebar will autoclose
  closeSidenav = () => {
    if (this.state.windowWidth < 1200) {
      this.props.toggleSidenav();
    }
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        const st = {};
        st[prop['state']] = !this.state[prop.state];
        return (
          <NavItem key={key}>
            <NavLink
              data-toggle="collapse"
              aria-expanded={this.state[prop.state]}
              className={classnames({
                active: this.getCollapseInitialState(prop.views),
              })}
              onClick={(e) => {
                e.preventDefault();
                this.setState(st);
              }}
            >
              {prop.icon ? (
                <>
                  <i className={prop.icon} />
                  <span className="nav-link-text">{prop.name}</span>
                </>
              ) : prop.miniName ? (
                <>
                  <span className="sidenav-mini-icon"> {prop.miniName} </span>
                  <span className="sidenav-normal"> {prop.name} </span>
                </>
              ) : null}
            </NavLink>
            <Collapse isOpen={this.state[prop.state]}>
              <Nav className="nav-sm flex-column">{this.createLinks(prop.views)}</Nav>
            </Collapse>
          </NavItem>
        );
      }
      return (
        <NavItem className={this.activeRoute(prop.layout + prop.path)} key={key}>
          <Link href={prop.layout + prop.path}>
            <NavLink href={prop.layout + prop.path} onClick={this.closeSidenav} style={{ paddingLeft: 40 }}>
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <span className="nav-link-text">{prop.name}</span>
                </>
              ) : prop.miniName !== undefined ? (
                <>
                  <span className="sidenav-mini-icon"> {prop.miniName} </span>
                  <span className="sidenav-normal"> {prop.name} </span>
                </>
              ) : (
                prop.name
              )}
            </NavLink>
          </Link>
        </NavItem>
      );
    });
  };
  render() {
    const { routes, logo } = this.props;

    const scrollBarInner = (
      <div className="scrollbar-inner">
        <div className="sidenav-header d-flex align-items-center">
          {logo && logo.innerLink ? (
            <Link href={logo.innerLink}>
              <span>
                <NavbarBrand href="/">
                  <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
                </NavbarBrand>
              </span>
            </Link>
          ) : null}
          {logo && logo.outterLink ? (
            <NavbarBrand href={logo.outterLink} target="_blank">
              <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
            </NavbarBrand>
          ) : null}
          <div className="ml-auto">
            <div
              className={classnames('sidenav-toggler d-none d-xl-block', {
                active: this.props.sidenavOpen,
              })}
              onClick={this.props.toggleSidenav}
            >
              <div className="sidenav-toggler-inner">
                <i className="sidenav-toggler-line" />
                <i className="sidenav-toggler-line" />
                <i className="sidenav-toggler-line" />
              </div>
            </div>
          </div>
        </div>
        <div className="navbar-inner">
          <Collapse navbar isOpen={true}>
            <Nav navbar>{this.createLinks(routes)}</Nav>
            <hr className="my-3" />
          </Collapse>
        </div>
      </div>
    );
    return (
      <Navbar
        className={
          'sidenav navbar-vertical navbar-expand-xs navbar-light bg-white ' + (this.props.rtlActive ? '' : 'fixed-left')
        }
        onMouseEnter={this.onMouseEnterSidenav}
        onMouseLeave={this.onMouseLeaveSidenav}
      >
        {scrollBarInner}
      </Navbar>
    );
  }
}

export default withRouter(Sidebar);
