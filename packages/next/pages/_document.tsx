import React from 'react';
import Document, { Head, Main, NextScript, Html, DocumentContext } from 'next/document';
import Safe from 'react-safe';
import { MarketingTrackers } from '@pdeals/next/components/MarketingTrackers/MarketingTrackers';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const isBot =
      ctx && ctx.req && ctx.req.headers
        ? `${ctx.req.headers['user-agent']}`.toLowerCase().indexOf('googlebot') >= 0
        : false;
    (initialProps as any).isBot = isBot;
    return initialProps;
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          {(this.props as any).isBot && <link rel="stylesheet" href="/assets/public.css" />}
          {/*<link rel="shortcut icon" href={require('assets/img/brand/favicon.ico')} />
          <link rel="apple-touch-icon" sizes="76x76" href={require('assets/img/brand/apple-icon.png')} />*/}
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
