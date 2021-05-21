import FB from 'fb';
import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import Link from '@pdeals/next/elements/NextLink';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import Snippet from '@pdeals/next/components/Snippet/Snippet';

export async function getServerSideProps(context) {
  FB.api(
    'oauth/access_token',
    {
      // BUSINESS
      // client_id: '307232144213890',
      // client_secret: '57cd38cc88ccf7a6f1af89b188345cfb',

      client_id: '215370513419841',
      client_secret: '493b9322b5d948a3b8ffb4da5cd00ff0',
      grant_type: 'client_credentials',
    },
    function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }

      console.log('AC', res.access_token);
      // var accessToken = res.access_token;
    }
  );

  return {
    props: {}, // will be passed to the page component as props
  };
}

const CheckoutPage: React.FunctionComponent<any> = ({ uiStore }) => {
  // const { query } = useRouter();

  return <div>:)</div>;
};

export default inject('uiStore')(observer(CheckoutPage));
