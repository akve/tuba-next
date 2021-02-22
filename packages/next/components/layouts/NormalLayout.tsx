import React, { Component } from 'react';
import Router from 'next/router';
import PublicNavbar from '@pdeals/next/components/Navbars/PublicNavbar';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import Snippet from '@pdeals/next/components/Snippet/Snippet';

const NormalLayout: React.FunctionComponent<any> = (props) => {
  return (
    <div className="bg-default">
      <div className="main-content">
        <PublicNavbar />

        {/*<!-- Header -->*/}
        <div className="header bg-gradient-primary py-7 py-lg-8">
          {props.withHeading && (
            <div className="container">
              <div className="header-body text-center mb-7" style={{ marginTop: '30px' }}>
                <div className="row justify-content-center">
                  <div className="col-lg-5 col-md-6">
                    <h1 className="text-white">{t('[R:Привет][U:Вiтаємо]')}</h1>
                    <p className="text-lead text-light">Туба-дуба - это одежда с душой</p>
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
              <div className="card bg-secondary shadow border-0 d-flex flex-row flex-wrap">{props.children}</div>
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
                  <a href="https://www.creative-tim.com" className="nav-link" target="_blank">
                    Creative Tim
                  </a>
                </li>
                <li className="nav-item">
                  <a href="https://www.creative-tim.com/presentation" className="nav-link" target="_blank">
                    About Us
                  </a>
                </li>
                <li className="nav-item">
                  <a href="http://blog.creative-tim.com" className="nav-link" target="_blank">
                    Blog
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
