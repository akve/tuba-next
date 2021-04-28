import React from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document';
import Safe from 'react-safe';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          {/*<link rel="shortcut icon" href={require('assets/img/brand/favicon.ico')} />
          <link rel="apple-touch-icon" sizes="76x76" href={require('assets/img/brand/apple-icon.png')} />*/}
          <link rel="preconnect" href="https://fonts.gstatic.com/" />
          <link rel="stylesheet" as="style" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" />
        </Head>
        <body>
          <div id="fb-root"></div>
          {/*<Safe.script>
            {`window.fbAsyncInit = function() {
          FB.init({
            xfbml            : true,
            version          : 'v10.0'
          });
        };

          (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = 'https://connect.facebook.net/ru_RU/sdk/xfbml.customerchat.js';
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));`}
          </Safe.script>
          <div
            dangerouslySetInnerHTML={{
              __html: `<div class="fb-customerchat" attribution="setup_tool" page_id="785826554851503"></div>`,
            }}
          />*/}

          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
