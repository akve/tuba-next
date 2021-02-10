import React from 'react';
import ReactDOM from 'react-dom';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';

import PageChange from 'components/PageChange/PageChange.js';

import { Provider } from 'mobx-react';

import 'react-notification-alert/dist/animate.css';
import 'assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/scss/nextjs-argon-dashboard-pro.scss';
import 'assets/vendor/quill/dist/quill.core.css';
import { ToastWrapper } from '../components/common/ToastWrapper';
import { NotificationProvider } from '@pdeals/next/lib/contexts/NotificationContext';
import Admin from '@pdeals/next/components/layouts/Admin';
import UserLayout from '../components/layouts/UserLayout';
import {getStore, initalizeStoreClean, hydrateEverything} from '../stores/initStore';

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add('body-page-transition');
  ReactDOM.render(<PageChange path={url} />, document.getElementById('page-transition'));
});
Router.events.on('routeChangeComplete', async () => {
  const store = await getStore();
  if (Router.router.pathname.includes('/admin') && store.userStore.me && store.userStore.me.role !== 'admin') {
    store.userStore.logout();
    Router.push('/auth/login');
    return;
  }
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});
Router.events.on('routeChangeError', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
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

    const isAdminPath = typeof window === 'undefined' ? false : (Router.router.pathname.indexOf('/admin') === 0);

    const Layout = Component.layout || (isAdminPath ? Admin : UserLayout) || (({ children }) => <>{children}</>);
    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>TubaDuba</title>
        </Head>
        <Provider {...this.state.mobxStore}>
          <NotificationProvider>
            <Layout>
      {/*<ToastWrapper />*/}
              <Component {...pageProps} />
            </Layout>
          </NotificationProvider>
        </Provider>
      </React.Fragment>
    );
  }
}
