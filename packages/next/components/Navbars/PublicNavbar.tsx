import React, { useEffect } from 'react';
import Link from '@pdeals/next/elements/NextLink';
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
import OrderStore from '@pdeals/next/stores/orderStore';

interface IProps {
  uiStore?: UiStore;
  orderStore?: OrderStore;
  structure?: any;
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

  if (!props.structure.categories.rows.length) return null;

  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-light tuba-navbar" expand="md">
        <div>
          <Link href="/">
            <span>
                <img alt="Tuba-Duba" src="/assets/img/logo-top4.png" width="240" style={{ opacity: 1 }} />
            </span>
          </Link>
        </div>
        <div>
          <Container className="px-1">
            <div className="nav-top-line" style={{ marginLeft: 'auto' }}>
              <div className="top-cart">
                  <Link href="/checkout" style={{ display: 'flex' }}>
                      <img src="/assets/img/cart.svg" width="20" height="20" />
                      <span>{productsInCart}</span>
                  </Link>
              </div>
              <span>
                <a onClick={() => onChangeLang('en')}>Eng</a> | <a onClick={() => onChangeLang('ua')}>Укр</a>
              </span>
            </div>
          </Container>
          <Container className="px-1">
            <div></div>
            <button className="navbar-toggler" id="navbar-collapse-main">
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse navbar toggler="#navbar-collapse-main" id="main-collapse-menu">
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link href="/">
                      <img
                        alt="Tuba-Duba"
                        src="/assets/img/logo-top4.png"
                        width="120"
                        height="38"
                        style={{ opacity: 1 }}
                      />
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button className="navbar-toggler" id="navbar-collapse-main">
                      <span />
                      <span />
                    </button>
                    <a style={{paddingTop: 0, paddingBottom: 0}} href="tel:+380965096789" className="nav-link-icon nav-link">
                      <i className="ni ni-mobile-button" /> +38 (096) 509-67-89
                    </a>
                    <a style={{paddingTop: 0, paddingBottom: 0}} href="tel:+380502943327" className="nav-link-icon nav-link">
                      <i className="ni ni-mobile-button" /> +38 (050) 294-33-27
                    </a>
                  </Col>
                </Row>
              </div>
              <ShopSidebar position="topmenu" structure={props.structure} />
              <Nav className="ml-auto" navbar>
                {/*<NavItem>
                  <Link href="/info/contacts">
                    <NavLink href="/info/contacts" className="nav-link-icon">
                      <span className="nav-link-inner--text">{i18n.t('[R:О нас][U:Про нас]')}</span>
                    </NavLink>
                  </Link>
                </NavItem>*/}
                <NavItem className="d-none d-lg-inline">
                  <a style={{paddingTop: 0, paddingBottom: 0}} href="tel:+380965096789" className="nav-link-icon nav-link">
                    <i className="ni ni-mobile-button" /> +38 (096) 509-67-89
                  </a>
                  <a style={{paddingTop: 0, paddingBottom: 0}} href="tel:+380502943327" className="nav-link-icon nav-link">
                    <i className="ni ni-mobile-button" /> +38 (050) 294-33-27
                  </a>
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
