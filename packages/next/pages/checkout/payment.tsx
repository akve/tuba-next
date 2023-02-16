import React, { Component, useEffect } from 'react';
import Link from '@pdeals/next/elements/NextLink';
import { client } from '../../lib/api/api-client';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import { useRouter } from 'next/router';
import { Spinner } from 'reactstrap';
import { serverSetLang, serverTranslate } from '@pdeals/next/lib/utils/serverTranslate';
import { currentLang, setLang } from '@pdeals/next/utils/i18n';

export async function getServerSideProps(context) {
  serverSetLang(context);
  const alldata = await client().get('/open/structure/structure');
  return {
    props: { lang: currentLang(), alldata: serverTranslate( context, alldata) }, // will be passed to the page component as props
  };
}

const CheckoutPage: React.FunctionComponent<any> = ({ lang, uiStore, alldata, orderStore }) => {
  setLang(lang);
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
    <NormalLayout structure={alldata}>
      <Spinner/>
    </NormalLayout>
  );
};

export default inject('uiStore', 'orderStore')(observer(CheckoutPage));
