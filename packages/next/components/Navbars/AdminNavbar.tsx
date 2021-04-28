import React, { Component } from 'react';
import classnames from 'classnames';
import { withRouter } from 'next/router';
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Navbar,
  NavItem,
  Nav,
  Container,
} from 'reactstrap';
import UserStore from '@pdeals/next/stores/userStore';
import { inject, observer } from 'mobx-react';
import Breadcrumbs from '@pdeals/next/components/common/Breadcrumbs';

interface IProps {
  theme: 'dark' | 'light';
  router: any;
  sidenavOpen: boolean;
  toggleSidenav: () => void;
  userStore: UserStore;
}

class AdminNavbar extends Component<IProps> {
  openSearch = () => {
    document.body.classList.add('g-navbar-search-showing');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-showing');
      document.body.classList.add('g-navbar-search-show');
    }, 150);
    setTimeout(function () {
      document.body.classList.add('g-navbar-search-shown');
    }, 300);
  };

  closeSearch = () => {
    document.body.classList.remove('g-navbar-search-shown');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-show');
      document.body.classList.add('g-navbar-search-hiding');
    }, 150);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hiding');
      document.body.classList.add('g-navbar-search-hidden');
    }, 300);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hidden');
    }, 500);
  };

  handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.props.router.push('/auth/login');
  };

  render() {
    return (
      <>
        <Navbar
          className={classnames(
            'navbar-top navbar-expand border-bottom',
            { 'navbar-dark bg-dark': this.props.theme === 'dark' },
            { 'navbar-light bg-secondary': this.props.theme === 'light' }
          )}
        >
          <Container fluid>
            <Collapse navbar isOpen={true}>
              <Nav className="align-items-center ml-md-auto" navbar>
                <NavItem className="d-xl-none">
                  <div
                    className={classnames(
                      'pr-3 sidenav-toggler',
                      { active: this.props.sidenavOpen },
                      { 'sidenav-toggler-dark': this.props.theme === 'dark' }
                    )}
                    onClick={this.props.toggleSidenav}
                  >
                    <div className="sidenav-toggler-inner">
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                    </div>
                  </div>
                </NavItem>
              </Nav>
              <Nav className="align-items-center ml-auto ml-md-0" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media className="align-items-center">
                      <span className="avatar avatar-sm rounded-circle">USER{/*<img alt="..." src={} />*/}</span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {`${this.props.userStore.me?.firstName} ${this.props.userStore.me?.lastName}`}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href="#pablo" onClick={this.handleLogOut}>
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <div className="header header-dark bg-dark pb-6 content__title content__title--calendar mb--6">
          <Container fluid>
            <div className="header-body">
              <Breadcrumbs />
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default inject('userStore')(withRouter(observer(AdminNavbar)));
