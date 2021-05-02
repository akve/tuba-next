import React, { Component } from 'react';
import PublicNavbar from '@pdeals/next/components/Navbars/PublicNavbar';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import Link from '@pdeals/next/elements/NextLink';

const NormalLayout: React.FunctionComponent<any> = (props) => {
  const links = [
    { href: '/', title: 'Магазин' },
    { href: '/info/otzyvy', title: t('[R:Отзывы][U:Відгуки]') },
    { href: '/info/contacts', title: t('[R:Контакты][U:Контакти]') },
  ];

  return (
    <div className="bg-default">
      <div className="main-content">
        <PublicNavbar />

        {/*<!-- Header -->*/}
        <div className="header bg-gradient-primary py-3 py-lg-3" style={{ paddingTop: '0 !important' }}>
          {(props.withHeading || true) && (
            <div className="container heading-container" style={{ paddingBottom: '20px' }}>
              <div className="header-body text-center mb-7">
                <div className="row justify-content-center">
                  <div className="col-lg-5 col-md-6">
                    <h2 style={{ opacity: 0.8, fontWeight: 'normal' }}>
                      {t('[R:Одежда которая вдохновляет][U:Одяг що надихає]')}
                    </h2>
                    <img
                      src="/assets/img/logo-only.png"
                      alt="Tuba-Duba"
                      style={{ marginTop: '-20px', marginBottom: '20px', maxWidth: '100%' }}
                    />
                    <div className="main-menu">
                      {links.map((link, index) => (
                        <Link href={link.href} key={`${index}`}>
                          <a href={link.href}>{link.title}</a>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              x="0"
              y="0"
              viewBox="0 0 2560 100"
              preserveAspectRatio="none"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon className="fill-default" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </div>
        {/*<!-- Conent -->*/}
        <div className="container mt--8 pb-5 main-content-block">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="card shadow border-0 d-flex flex-row flex-wrap">{props.children}</div>
            </div>
          </div>
        </div>
      </div>
      {/*<!-- Footer -->*/}
      <footer className="py-5">
        <div className="container">
          <div className="row align-items-center justify-content-xl-between">
            <div className="col-xl-6">
              <div className="copyright text-center text-xl-left text-muted">&copy; 2021 Tuba-Duba</div>
            </div>
            <div className="col-xl-6">
              <ul className="nav nav-footer justify-content-center justify-content-xl-end">
                <li className="nav-item">
                  <a href="https://www.facebook.com/tubaiduba" className="nav-link" target="_blank">
                    <i className="fa fa-facebook" /> Facebook
                  </a>
                </li>
                <li className="nav-item">
                  <a href="https://www.instagram.com/tubaiduba/" className="nav-link" target="_blank">
                    <i className="fa fa-instagram" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NormalLayout;
