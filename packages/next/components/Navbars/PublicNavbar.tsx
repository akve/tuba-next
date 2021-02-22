import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// reactstrap components
import {
  Badge,
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import { getStore } from '@pdeals/next/stores/initStore';
import { inject, observer } from 'mobx-react';
import ShopSidebar from '../Sidebar/ShopSidebar';
import UiStore from '@pdeals/next/stores/uiStore';
import * as i18n from '@pdeals/next/utils/i18n';

interface IProps {
  uiStore?: UiStore;
  orderStore?: UiStore;
}
function PublicNavbar(props: IProps) {
  const { uiStore } = props;
  const router = useRouter();
  const { cart } = props.orderStore!;

  const onChangeLang = (lang) => {
    setLang(lang);
    window.location.reload();
  };

  const productsInCart = cart && cart.products ? cart.products.length : 0;
  //console.log('???', uiStore.allData);

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-light tuba-navbar" expand="md">
        <div>
          <Link href="/admin/dashboard">
            <span>
              <NavbarBrand href="/">
                <img alt="..." src={require('assets/img/tuba/logo-top.png')} />
              </NavbarBrand>
            </span>
          </Link>
        </div>
        <div>
          <Container className="px-4">
            <div className="nav-top-line" style={{ marginLeft: 'auto' }}>
              <div className="top-cart">
                {productsInCart === 0 && <i className="ni ni-cart" />}
                {productsInCart > 0 && (
                  <Link href="/checkout">
                    <a href="/checkout">
                      <i className="ni ni-cart" />
                      <span>{productsInCart}</span>
                    </a>
                  </Link>
                )}
              </div>
              <span>
                <a onClick={() => onChangeLang('ru')}>Рус</a> | <a onClick={() => onChangeLang('ua')}>Укр</a>
              </span>
            </div>
          </Container>
          <Container className="px-4">
            <div></div>
            <button className="navbar-toggler" id="navbar-collapse-main">
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link href="/">
                      <img alt="..." src={require('assets/img/tuba/logo-top.png')} />
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button className="navbar-toggler" id="navbar-collapse-main">
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <ShopSidebar position="topmenu" />
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link href="/admin/dashboard">
                    <NavLink href="#pablo" className="nav-link-icon">
                      <i className="ni ni-planet" />
                      <span className="nav-link-inner--text">{i18n.t('[R:О нас][U:Про нас]')}</span>
                    </NavLink>
                  </Link>
                </NavItem>
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </div>
      </Navbar>
    </>
  );
}

export default inject('uiStore', 'orderStore')(observer(PublicNavbar));
