import React, { Component } from 'react';
import PublicNavbar from '@pdeals/next/components/Navbars/PublicNavbar';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import Link from '@pdeals/next/elements/NextLink';
import { useRouter } from 'next/router';
import { Nav, NavItem, NavLink } from 'reactstrap';
import * as i18n from '@pdeals/next/utils/i18n';

const NormalLayout: React.FunctionComponent<any> = (props) => {
  const router = useRouter();
  const links = [
    { href: '/category/featured', title: 'Каталог' },
    { href: '/info/otzyvy', title: t('[R:Отзывы][U:Відгуки]') },
    { href: '/info/contacts', title: t('[R:Контакты][U:Контакти]') },
    { href: '/info/onas', title: t('[R:О нас][U:Про нас]') },
  ];

  return (
    <div className="bg-default">
      <div className="main-content">
        <PublicNavbar />

        {/*<!-- Header -->*/}
        <div className={`header bg-gradient-primary ${router.asPath === '/' ? '' : 'py-3 py-lg-3'}`}>
          {router.asPath === '/' && false && (
            <div className="main-message">
              <div className="main-message--center">
                {/*<h2>{t('[U:нарешті тепло][R:наконец тепло]')}</h2>
                <a href="/category/featured" className="btn btn-primary">
                  {t('[U:Перейти до каталогу][R:Перейти в каталог]')}
                </a>*/}
              </div>
            </div>
          )}
          {(props.withHeading || true) && (
            <div className="container heading-container" style={{ paddingBottom: '20px' }}>
              <div className="header-body text-center mb-7">
                <div className="row justify-content-center">
                  {/*
                  <div className="main-message">
                    <div>
                      <img src="/assets/img/logo-only.png" alt="Tuba-Duba" height="100" />
                    </div>
                    <div>
                      {t('[R:Индивидуальный пошив женской одежды][U:Індивідуальний пошив жіночого одягу]')}
                      <br />
                      &nbsp;&nbsp;&nbsp;
                      {t(
                        '[R:Производство без остатков, полностью в Украине. ][U:Виробництво без залишків, цілком в Україні]'
                      )}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {t('[R:Дизайн и качество с 2016 года ][U:Дизайн та якість з 2016 року]')}
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-lg-5 col-md-6">
                    {/*<h2 style={{ opacity: 0.8, fontWeight: 'normal' }}>
                      {t('[R:Одежда которая вдохновляет][U:Одяг що надихає]')}
                    </h2>
                    <img
                      src="/assets/img/logo-only.png"
                      alt="Tuba-Duba"
                      style={{ marginTop: '-20px', marginBottom: '20px', maxWidth: '100%' }}
                    />*/}
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
                  <a href="/info/dostavka/" className="nav-link">
                    {t('[R:Доставка и оплата][U:Доставка та оплата]')}
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/info/vozvrat/" className="nav-link">
                    {t('[R:Обмен и возврат][U:Обмін та повернення]')}
                  </a>
                </li>
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
