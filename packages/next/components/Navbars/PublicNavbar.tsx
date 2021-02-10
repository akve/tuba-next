import React from "react";
import Link from "next/link";
import {useRouter} from 'next/router';

// reactstrap components
import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col,
} from "reactstrap";
import {t, setLang, currentLang} from '@pdeals/next/utils/i18n';
import {getStore} from "@pdeals/next/stores/initStore";
import {inject, observer} from 'mobx-react';
import ShopSidebar from '../Sidebar/ShopSidebar';

function PublicNavbar({uiStore}) {
    const router = useRouter();

    const onChangeLang = (lang) => {
        setLang(lang);
        window.location.reload();
    }
    //console.log('???', uiStore.allData);

    return (
        <>
        <Navbar className="navbar-top navbar-horizontal navbar-light tuba-navbar" expand="md">
            <div>
                <Link href="/admin/dashboard">
                    <span>
                      <NavbarBrand href="/">
                        <img
                            alt="..."
                            src={require("assets/img/tuba/logo-top.png")}
                        />
                      </NavbarBrand>
                    </span>
                </Link>
            </div>
            <div>
            <Container className="px-4">
                <div className="nav-top-line">
                    <a onClick={() => onChangeLang('ru')}>Русский</a> |
                    <a onClick={() => onChangeLang('ua')}>Українська</a>
                </div>
            </Container>
            <Container className="px-4">
                <div>

                </div>
                <button className="navbar-toggler" id="navbar-collapse-main">
                    <span className="navbar-toggler-icon" />
                </button>
                <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
                    <div className="navbar-collapse-header d-md-none">
                        <Row>
                            <Col className="collapse-brand" xs="6">
                                <Link href="/admin/dashboard">
                                    <img
                                        alt="..."
                                        src={require("assets/img/tuba/logo-top.png")}
                                    />
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
                    <ShopSidebar position="topmenu"/>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <Link href="/admin/dashboard">
                                <NavLink href="#pablo" className="nav-link-icon">
                                    <i className="ni ni-planet" />
                                    <span className="nav-link-inner--text">Dashboard</span>
                                </NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/auth/register">
                                <NavLink href="#pablo" className="nav-link-icon">
                                    <i className="ni ni-circle-08" />
                                    <span className="nav-link-inner--text">Register</span>
                                </NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/auth/login">
                                <NavLink href="#pablo" className="nav-link-icon">
                                    <i className="ni ni-key-25" />
                                    <span className="nav-link-inner--text">Login</span>
                                </NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/admin/profile">
                                <NavLink href="#pablo" className="nav-link-icon">
                                    <i className="ni ni-single-02" />
                                    <span className="nav-link-inner--text">Profile</span>
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

export default inject('uiStore')(observer(PublicNavbar));
