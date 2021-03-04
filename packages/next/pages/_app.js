import React from 'react';
import ReactDOM from 'react-dom';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import Safe from 'react-safe';

import PageChange from 'components/PageChange/PageChange.js';

import { Provider } from 'mobx-react';

import 'react-notification-alert/dist/animate.css';
import 'assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/scss/nextjs-argon-dashboard-pro.scss';
import 'assets/vendor/quill/dist/quill.core.css';
import '../assets/css/nprogress.css';

import { ToastWrapper } from '../components/common/ToastWrapper';
import { NotificationProvider } from '@pdeals/next/lib/contexts/NotificationContext';
import Admin from '@pdeals/next/components/layouts/Admin';
import UserLayout from '../components/layouts/UserLayout';
import { getStore, initalizeStoreClean, hydrateEverything } from '../stores/initStore';

import NProgress from 'nprogress';

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

export default class MyApp extends App {
  state = {
    mobxStore: initalizeStoreClean(),
  };

  static async getInitialProps(appContext) {
    const mobxStore = await initalizeStoreClean();
    appContext.ctx.mobxStore = mobxStore;
    const appProps = await App.getInitialProps(appContext);
    return {
      ...appProps,
      initialMobxState: mobxStore,
    };
  }

  constructor(props) {
    super(props);
    //const isServer = typeof window === 'undefined';
    // props.initialMobxState
    hydrateEverything(this.state.mobxStore);
    // this.mobxStore = isServer ? props.initialMobxState : initializeStore();
  }

  render() {
    const { Component, pageProps } = this.props;

    //if (!this.state.mobxStore) return null;

    const isAdminPath = typeof window === 'undefined' ? false : Router.router.pathname.indexOf('/admin') === 0;

    const Layout = Component.layout || (isAdminPath ? Admin : UserLayout) || (({ children }) => <>{children}</>);
    // console.log('l', La)
    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>TubaDuba</title>
          <meta property="og:title" content="Туба-дуба: пространство легкости и красоты" />
          <meta property="og:description" content="Одежда, которая обнимает..." />
          <meta
            property="description"
            content="Волшебная одежда, созданная с легкостью и любовью для Вас. Проект, объединяющий творческих людей. С радостью ответим на ваши вопросы: 38 050 050 176 42 23"
          />
          <meta
            property="og:image"
            content="https://tuba-duba.com/wp-content/uploads/2016/08/13932973_1088930401199199_138885520_n.jpg"
          />
          <meta name="p:domain_verify" content="f80bef3d9d034afebf0911637637190e" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-84542153-1"></script>
          <Safe.script>
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
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=366138666843162&ev=PageView&noscript=1"
            />
          </noscript>
        </Head>
        <Provider {...this.state.mobxStore}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </React.Fragment>
    );
  }
}
