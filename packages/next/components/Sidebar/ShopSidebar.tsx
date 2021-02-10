import React, { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Collapse, NavbarBrand, Navbar, NavItem, NavLink, Nav, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import {inject, observer} from 'mobx-react';
import { filter } from 'lodash';
import {t} from '../../utils/i18n';
import OutsideClickHandler from 'react-outside-click-handler';

interface IProps {
    uiStore: any;
    currentRoute: string;
    position?: 'content' | 'topmenu' ;

}

class ShopSidebar extends React.Component<IProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            openroutes: [],
            popoverOpen: false
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
        return typeof window === 'undefined'
    }
    // verifies if routeName is the one active (in browser input)
    activeRoute = (routeName) => {
        return this.props.currentRoute && this.props.currentRoute.indexOf(routeName) > -1 ? 'active' : '';
    };
    // this function creates the links and collapses that appear in the sidebar (left menu)
    createLinks = (routes) => {
        return routes.map((prop, key) => {
            if (prop.redirect) {
                return null;
            }
            if (prop.collapse) {
                const isOpen = !!(this.state.openroutes.indexOf(prop.path) >= 0);
                return (
                    <NavItem key={key}>
                        <NavLink
                            data-toggle="collapse"
                            href={prop.layout + prop.path}
                            aria-expanded={isOpen}
                            className={'sidenav-shop-expandable' + this.activeRoute(prop.path)}
                            style={{ paddingLeft: prop.level * 40 }}
                        >
                           <span className="sidenav-normal"> {prop.name} </span>
                            <span className="sidenav-expander" onClick={(e) => {
                                e.preventDefault();
                                let r;
                                if(isOpen) {
                                    const routes = [...this.state.openroutes];
                                    routes.splice(this.state.openroutes.indexOf(prop.path), 1);
                                    this.setState({openroutes:routes});
                                } else {
                                     r = [...this.state.openroutes, prop.path];
                                     console.log("!", r);
                                    this.setState({openroutes:r});
                                }
                              }}>
                                {isOpen && (<i className="fa fa-minus-circle" />)}
                                {!isOpen && (<i className="fa fa-plus-circle" />)}
                            </span>
                        </NavLink>
                        <Collapse isOpen={isOpen}>
                            <Nav className="nav-sm flex-column">{this.createLinks(prop.views, prop.level)}</Nav>
                        </Collapse>
                    </NavItem>
                );
            }
            return (
                <NavItem className={this.activeRoute(prop.layout + prop.path)} key={key}>
                    <Link href={prop.layout + prop.path}>
                        <NavLink href={prop.layout + prop.path} style={{ paddingLeft: prop.level * 40 }}>
                            <span className="sidenav-normal"> {prop.name} </span>
                        </NavLink>
                    </Link>
                </NavItem>
            );
        });
    };
    prepareRoutes = (rawRoutes) => {
// console.log('R', rawRoutes);
        const findByParent = (parentId:number) => {
            return filter(rawRoutes, (r: any) => {
                    return parentId === 0 ? !r.parent : r.parent === parentId;
                }) || [];
        }
        let res = [];
        const startBuild = (target: any, parent: number, level: number, parentcode: string) => {
            const children = findByParent(parent);
            children.forEach((child: any) => {
                const subcode = parentcode? parentcode + '_' + child.code : child.code;
                const v = {
                    icon: "-",
                    name: t(child.originalName),
                    layout: '',
                    path: '/category/' + subcode,
                    level: level,
                    views: []
                };
                startBuild(v.views, child.id, level + 1, subcode);
                if (v.views.length > 0) v.collapse = true;
                target.push(v);
            })
        };
        startBuild(res, 0, 0, '');
        return res;
    }

    setPopoverOpen = () => {
        this.setState({popoverOpen: !this.state.popoverOpen});
    }

    render() {
        const routes = this.prepareRoutes(this.props.uiStore.allData.categories.rows);
        if (this.props.position === 'topmenu') {
            return (
                <>
                    <div className="d-block d-md-none">
                        <Nav navbar className={'ml-auto'}>{this.createLinks(routes)}</Nav>
                    </div>
                    <div className="d-none d-md-block d-lg-block d-xl-block">
                        <OutsideClickHandler
                            onOutsideClick={() => {this.setState({popoverOpen: false})}}>
                            <>
                                <a id="topshop"> Магазин</a>
                                <Popover
                                    placement={'bottom'}
                                    isOpen={this.state.popoverOpen}
                                    target={'topshop'}
                                    toggle={this.setPopoverOpen}
                                    style={{minWidth:'250px'}}
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
            <div className="d-none d-md-block">
                <Nav navbar>{this.createLinks(routes)}</Nav>
            </div>
        )
    }
}

// Sidebar.defaultProps = {
//   routes: [{}],
//   toggleSidenav: () => {},
//   sidenavOpen: false,
//   rtlActive: false,
// };

export default inject('uiStore')(observer(ShopSidebar));
