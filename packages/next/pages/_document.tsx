import React from 'react';
import Document, { Head, Main, NextScript, Html, DocumentContext } from 'next/document';
// import Safe from 'react-safe';
// import { MarketingTrackers } from '@pdeals/next/components/MarketingTrackers/MarketingTrackers';


class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const isBot =
      ctx && ctx.req && ctx.req.headers
        ? `${ctx.req.headers['user-agent']}`.toLowerCase().indexOf('googlebot') >= 0
        : false;
    (initialProps as any).isBot = isBot && false;
    return initialProps;
  }

  render() {
    return (
      <Html lang="en" >
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          {((this.props as any).isBot || false) && <link rel="stylesheet" href="/assets/public.css" />}
          {/*<link rel="shortcut icon" href={require('assets/img/brand/favicon.ico')} />
          <link rel="apple-touch-icon" sizes="76x76" href={require('assets/img/brand/apple-icon.png')} />*/}
          {/*<link rel="preconnect" href="https://fonts.gstatic.com" />*/}
          {/*<link rel="preconnect" href="https://fonts.googleapis.com" />*/}
          <link rel="preconnect" href="https://res.cloudinary.com" />
          {/*<link rel="preconnect" href="https://fonts.gstatic.com" />*/}

          {/*<link*/}
          {/*  rel="preload"*/}
          {/*  as="style"*/}
          {/*  href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"*/}
          {/*/>*/}

          {/*<link*/}
          {/*  rel="stylesheet"*/}
          {/*  media="print"*/}
          {/*  onLoad={() => {*/}
          {/*    (this as any).onload = null;*/}
          {/*    (this as any).removeAttribute('media');*/}
          {/*  }}*/}
          {/*  href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"*/}
          {/*/>*/}
        </Head>
        <body>
          <noscript dangerouslySetInnerHTML={{__html:`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M6F26DG" height="0" width="0" style="display:none;visibility:hidden"></iframe>`}}/>
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
