import React from 'react';
import ReactDOM from 'react-dom';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import Safe from 'react-safe';
// import { Head } from 'next/document';

//import PageChange from 'components/PageChange/PageChange.js';

import { Provider } from 'mobx-react';

import '../assets/scss/nextjs-argon-dashboard-pro.scss';
// import 'assets/css/out.css';
//import 'react-notification-alert/dist/animate.css';
//import '../assets/plugins/nucleo/css/nucleo.module.css';
import '../assets/vendor/nucleo/css/nucleo.css';
// import '../assets/vendor/quill/dist/quill.core.css';
// import '../assets/css/nprogress.css';

import { ToastWrapper } from '../components/common/ToastWrapper';
import { NotificationProvider } from '@pdeals/next/lib/contexts/NotificationContext';

//import Admin from '@pdeals/next/components/layouts/Admin';

import UserLayout from '../components/layouts/UserLayout';
import { getStore, initalizeStoreClean, hydrateEverything } from '../stores/initStore';
// import { readFileSync } from 'fs';
// import { join } from 'path';

const Admin = dynamic(() => import('@pdeals/next/components/layouts/Admin'));

import NProgress from 'nprogress';
import dynamic from 'next/dynamic';
import { MarketingTrackers } from '../components/MarketingTrackers/MarketingTrackers';

NProgress.configure({ showSpinner: true });

Router.events.on('routeChangeStart', (url) => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', async () => {
  NProgress.done();
  const store = await getStore();
  if (Router.router.pathname.includes('/admin') && store.userStore.me && store.userStore.me.role !== 'admin') {
    store.userStore.logout();
    Router.push('/auth/login');
    return;
  }
});
Router.events.on('routeChangeError', () => {
  NProgress.done();
});

function dedupe(bundles) {
  const files = new Set();
  const kept = [];

  for (const bundle of bundles) {
    if (files.has(bundle.file)) continue;
    files.add(bundle.file);
    kept.push(bundle);
  }
  return kept;
}

export default class MyApp extends App {
  state = {
    mobxStore: initalizeStoreClean(),
  };

  /*static async getInitialProps(appContext) {
    const mobxStore = await initalizeStoreClean();
    appContext.ctx.mobxStore = mobxStore;
    const appProps = await App.getInitialProps(appContext);
    const req = appContext.ctx ? appContext.ctx.req : appContext.req;
    appProps.url = req ? req.url : '';
    console.log(appProps.url);
    return {
      ...appProps,
      initialMobxState: mobxStore,
    };
  }*/

  constructor(props) {
    super(props);
    //const isServer = typeof window === 'undefined';
    // props.initialMobxState
    hydrateEverything(this.state.mobxStore);
    // this.mobxStore = isServer ? props.initialMobxState : initializeStore();
  }

  render() {
    const { Component, pageProps, url } = this.props;

    //if (!this.state.mobxStore) return null;
    //console.log('???', this.props);

    const isAdminPath =
      typeof window === 'undefined'
        ? url && url.indexOf('/admin') === 0
        : Router.router.pathname.indexOf('/admin') === 0;

    const Layout = Component.layout || (isAdminPath ? Admin : UserLayout) || (({ children }) => <>{children}</>);
    // console.log('l', La)

    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>TubaDuba</title>
          <meta
            name="description"
            content="Волшебная одежда, созданная с легкостью и любовью для Вас. Проект, объединяющий творческих людей. С радостью ответим на ваши вопросы: 38 050 176 42 23"
          />
          <meta name="keywords" content="Дизайнерская одежда, Украина, Туба-Дуба, Tuba-Duba, женская одежда" />
          <meta property="og:title" content="Туба-дуба: пространство легкости и красоты" />
          <meta property="og:description" content="Одежда, которая обнимает..." />
          <meta
            property="description"
            content="Волшебная одежда, созданная с легкостью и любовью для Вас. Проект, объединяющий творческих людей. С радостью ответим на ваши вопросы: 38 050 176 42 23"
          />
          <meta name="facebook-domain-verification" content="t4wqwx21dk9zpgtbdltyn6gmb7r5le" />
          <meta property="fb:app_id" content="785826554851503" />
          <meta property="og:url" content="https://tuba-duba.com" />
          <meta property="og:image" content="https://tuba-duba.com/assets/img/main.jpg" />
          {/*<style dangerouslySetInnerHTML={{ __html: require('../assets/css/out.css').default }}></style>*/}
          <meta name="p:domain_verify" content="f80bef3d9d034afebf0911637637190e" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-84542153-1"></script>
          <Safe.script>
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-84542153-1');`}
          </Safe.script>

          {/*<Safe.script>
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '366138666843162');
            fbq('track', 'PageView');`}
          </Safe.script>
          <Safe.script>
            {`
               (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
               m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
               (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

               ym(75263086, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true,
                    ecommerce:"dataLayer"
               });
            `}
          </Safe.script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=366138666843162&ev=PageView&noscript=1"
            />
          </noscript>*/}
        </Head>
        <Provider {...this.state.mobxStore}>
          <NotificationProvider>
            <Layout>
              <MarketingTrackers />

              <Component {...pageProps} />
            </Layout>
          </NotificationProvider>
        </Provider>
      </React.Fragment>
    );
  }
}
