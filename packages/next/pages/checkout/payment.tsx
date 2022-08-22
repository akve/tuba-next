import React, { Component, useEffect } from 'react';
import Link from '@pdeals/next/elements/NextLink';
import { client } from '../../lib/api/api-client';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import { useRouter } from 'next/router';
import { Spinner } from 'reactstrap';

export async function getServerSideProps(context) {
  const alldata = await client().get('/open/structure/structure');
  return {
    props: { alldata }, // will be passed to the page component as props
  };
}

const CheckoutPage: React.FunctionComponent<any> = ({ uiStore, alldata, orderStore }) => {
  uiStore.setAllData(alldata);
  const router = useRouter();
  const isServer = typeof window === 'undefined';
  // if (isServer) return null;
  const { cart } = orderStore!;
  useEffect(() => {
    const load = async () => {
      await orderStore.markAsPaid(router.query.id);
      router.push(`/checkout/thanks`);
    };
    load();
  }, []);


  return (
    <NormalLayout>
      <Spinner/>
    </NormalLayout>
  );
};

export default inject('uiStore', 'orderStore')(observer(CheckoutPage));
