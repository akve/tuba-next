import Head from 'next/head';
import { safeJson } from '@pdeals/next/utils/helpers';
import * as i18n from '@pdeals/next/utils/i18n';
import React from 'react';

const HeadNonProduct = () => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://tuba-duba.com/#organization",
              "name": "Tuba-Duba",
              "url": "https://tuba-duba.com/",
              "sameAs": [],
              "logo": {
                "@type": "ImageObject",
                "@id": "https://tuba-duba.com/#logo",
                "inLanguage": "uk",
                "url": "https://tuba-duba.com/assets/img/logo.png",
                "width": 228,
                "height": 74,
                "caption": "Tuba-Duba"
              },
              "image": {
                "@id": "https://tuba-duba.com/#logo"
              }
            },
            {
              "@type": "WebSite",
              "@id": "https://tuba-duba.com/#website",
              "url": "https://tuba-duba.com/",
              "name": "Tuba-Duba",
              "description": "Виробництво дизайнерського одягу від украінського бренду Tuba-Duba",
              "publisher": {
                "@id": "https://tuba-duba.com/#organization"
              },
              "inLanguage": "uk"
            },
            {
              "@type": "ImageObject",
              "@id": "https://tuba-duba.com/#primaryimage",
              "inLanguage": "uk",
              "url": "https://tuba-duba.com/assets/img/main.jpg",
              "width": 1920,
              "height": 1080
            },
            {
              "@type": "WebPage",
              "@id": "https://tuba-duba.com/#webpage",
              "url": "https://tuba-duba.com/",
              "name": "Головна - Tuba-Duba",
              "isPartOf": {
                "@id": "https://tuba-duba.com/#website"
              },
              "about": {
                "@id": "https://tuba-duba.com/#organization"
              },
              "primaryImageOfPage": {
                "@id": "https://tuba-duba.com/#primaryimage"
              },
              "datePublished": "2021-01-23T14:38:33+00:00",
              "dateModified": "2021-04-04T19:20:56+00:00",
              "inLanguage": "uk",
              "potentialAction": [
                {
                  "@type": "ReadAction",
                  "target": [
                    "https://tuba-duba.com/"
                  ]
                }
              ]
            }
          ]
        }`,
        }}
      />
    </Head>
  );
};

export { HeadNonProduct };
