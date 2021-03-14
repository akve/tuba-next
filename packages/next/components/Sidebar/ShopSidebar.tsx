import React, { Component } from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Collapse, NavbarBrand, Navbar, NavItem, NavLink, Nav, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import { filter } from 'lodash';
import { t } from '../../utils/i18n';
import OutsideClickHandler from 'react-outside-click-handler';
import Router from 'next/router';
interface IProps {
  uiStore?: any;
  currentRoute?: string;
  position?: 'content' | 'topmenu';
}

class ShopSidebar extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      openroutes: [],
      popoverOpen: false,
      // ...this.getCollapseStates(props.routes),
    };
  }
  componentDidMount() {
    this.setState({
      windowWidth: this.isServer() ? 1000 : window.innerWidth,
      navigatorPlatform: this.isServer() ? 'mac' : navigator.platform,
    });
  }
  isServer = () => {
    return typeof window === 'undefined';
  };
  // verifies if routeName is the one active (in browser input)
  activeRoute = (routeName) => {
    return this.props.currentRoute && routeName.indexOf(this.props.currentRoute) > -1 ? 'active' : '';
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        const isOpen = !!(this.state.openroutes.indexOf(prop.path) >= 0);
        const onOpen = (e: any) => {
          e.preventDefault();
          let r;
          if (isOpen) {
            const routes = [...this.state.openroutes];
            routes.splice(this.state.openroutes.indexOf(prop.path), 1);
            this.setState({ openroutes: routes });
          } else {
            r = [...this.state.openroutes, prop.path];
            console.log('!', r);
            this.setState({ openroutes: r });
          }
        };
        return (
          <NavItem key={key}>
            <NavLink
              data-toggle="collapse"
              href={prop.path ? prop.layout + prop.path : null}
              aria-expanded={isOpen}
              className={'sidenav-shop-expandable' + this.activeRoute(prop.path)}
              style={{ paddingLeft: prop.level * 40 }}
              onClick={prop.path ? null : onOpen}
            >
              <span className="sidenav-normal"> {prop.name} </span>
              <span className="sidenav-expander" onClick={onOpen}>
                {isOpen && <i className="fa fa-minus-circle" />}
                {!isOpen && <i className="fa fa-plus-circle" />}
              </span>
            </NavLink>
            <Collapse isOpen={isOpen}>
              <Nav className="nav-sm flex-column">{this.createLinks(prop.views)}</Nav>
            </Collapse>
          </NavItem>
        );
      }
      return (
        <NavItem className={this.activeRoute(prop.layout + prop.path)} key={key}>
          <Link href={prop.layout + prop.path} data-path={prop.layout + prop.path}>
            <NavLink
              href={prop.layout + prop.path}
              data-path={prop.layout + prop.path}
              style={{ paddingLeft: prop.level * 40 }}
            >
              <span className="sidenav-normal" data-path={prop.layout + prop.path}>
                {' '}
                {prop.name}{' '}
              </span>
            </NavLink>
          </Link>
        </NavItem>
      );
    });
  };
  prepareRoutes = (rawRoutes, rawCollections) => {
    // console.log('R', rawRoutes);
    const findByParent = (parentId: number) => {
      return (
        filter(rawRoutes, (r: any) => {
          return (parentId === 0 ? !r.parent : r.parent === parentId) && r.invisible !== 'true';
        }) || []
      );
    };
    const res: any = [];
    const startBuild = (target: any, parent: number, level: number, parentcode: string) => {
      const children = findByParent(parent);
      children.forEach((child: any) => {
        const subcode = parentcode ? parentcode + '_' + child.code : child.code;
        const v: any = {
          icon: '-',
          name: t(child.originalName),
          layout: '',
          path: '/category/' + subcode,
          level: level,
          views: [],
        };
        startBuild(v.views, child.id, level + 1, subcode);
        if (v.views.length > 0) v.collapse = true;
        target.push(v);
      });
    };
    startBuild(res, 0, 0, '');
    const collections = {
      icon: '-',
      name: t('[R:Коллекции][U:Колекції]'),
      layout: '',
      path: '',
      level: 0,
      collapse: true,
      views: rawCollections.map((c) => {
        return {
          icon: '-',
          name: t(c.name),
          layout: '',
          path: '/collection/' + c.code,
          level: 1,
        };
      }),
    };
    res.push(collections);
    return res;
  };

  setPopoverOpen = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  };

  render() {
    const routes = this.prepareRoutes(
      this.props.uiStore.allData.categories.rows,
      this.props.uiStore.allData.collections
    );
    if (this.props.position === 'topmenu') {
      return (
        <>
          <div className="d-block d-md-none">
            <Nav navbar className={'ml-auto'}>
              {this.createLinks(routes)}
            </Nav>
          </div>
          <div className="d-none d-md-block d-lg-block d-xl-block">
            <OutsideClickHandler
              onOutsideClick={(e) => {
                this.setState({ popoverOpen: false });
                if (e && e.target && e.target.getAttribute('data-path')) {
                  Router.push(e.target.getAttribute('data-path'));
                }
              }}
            >
              <>
                <i className="ni ni-bag-17" />
                <a id="topshop"> Магазин</a>
                <Popover
                  placement={'bottom'}
                  isOpen={this.state.popoverOpen}
                  target={'topshop'}
                  toggle={this.setPopoverOpen}
                  style={{ minWidth: '250px' }}
                >
                  <PopoverHeader>Магазин</PopoverHeader>
                  <PopoverBody>
                    <Nav navbar>{this.createLinks(routes)}</Nav>
                  </PopoverBody>
                </Popover>
              </>
            </OutsideClickHandler>
          </div>
        </>
      );
    }
    return (
      <div className="d-none d-md-block shop-sidebar">
        <Nav navbar>{this.createLinks(routes)}</Nav>
      </div>
    );
  }
}

// Sidebar.defaultProps = {
//   routes: [{}],
//   toggleSidenav: () => {},
//   sidenavOpen: false,
//   rtlActive: false,
// };

export default inject('uiStore')(observer(ShopSidebar));
