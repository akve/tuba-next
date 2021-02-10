import { Component } from 'react';
import Router from 'next/router';
import PublicNavbar from "@pdeals/next/components/Navbars/PublicNavbar";
import {t, setLang, currentLang} from '@pdeals/next/utils/i18n';
import { client } from '../lib/api/api-client';
import {getStore} from "@pdeals/next/stores/initStore";
import ShopSidebar from '../components/Sidebar/ShopSidebar';
export async function getStaticProps({ params }) {
  const alldata = await client().get('/open/alldata');
  return { props: { alldata } }
}


const IndexPage: React.FunctionComponent<any> = ({alldata}) => {
  // const { query } = useRouter();
  getStore().uiStore.setAllData(alldata);
  console.log('Rendering now', alldata, new Date());
  return (
      <body class="bg-default">
      <div class="main-content">

        <PublicNavbar/>

        {/*<!-- Header -->*/}
        <div class="header bg-gradient-primary py-7 py-lg-8">
          <div class="container">
            <div class="header-body text-center mb-7" style={{marginTop:'30px'}}>
              <div class="row justify-content-center">
                <div class="col-lg-5 col-md-6">
                  <h1 class="text-white">{t('[R:Привет][U:Вiтаємо]')}</h1>
                  <p class="text-lead text-light">Туба-дуба - это одежда с душой</p>
                </div>
              </div>
            </div>
          </div>
          <div class="separator separator-bottom separator-skew zindex-100">
            <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </div>
        {/*<!-- Conent -->*/}
        <div class="container mt--8 pb-5">
          <div class="row justify-content-center">
            <div class="col-lg-12">
              <div class="card bg-secondary shadow border-0">
                <div class="col-lg-3 d-none d-lg-block d-xl-block">
                  <ShopSidebar />
                </div>
                <div className="col-lg-9 col-xs-12">
                  content goes here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<!-- Footer -->*/}
      <footer class="py-5">
        <div class="container">
          <div class="row align-items-center justify-content-xl-between">
            <div class="col-xl-6">
              <div class="copyright text-center text-xl-left text-muted">
                &copy; 2021 Tuba-Duba
              </div>
            </div>
            <div class="col-xl-6">
              <ul class="nav nav-footer justify-content-center justify-content-xl-end">
                <li class="nav-item">
                  <a href="https://www.creative-tim.com" class="nav-link" target="_blank">Creative Tim</a>
                </li>
                <li class="nav-item">
                  <a href="https://www.creative-tim.com/presentation" class="nav-link" target="_blank">About Us</a>
                </li>
                <li class="nav-item">
                  <a href="http://blog.creative-tim.com" class="nav-link" target="_blank">Blog</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      </body>
  );
};

export default IndexPage;
