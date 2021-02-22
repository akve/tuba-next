import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import Snippet from '@pdeals/next/components/Snippet/Snippet';

export async function getServerSideProps(context) {
  const alldata = await client().get('/open/alldata');
  return {
    props: { alldata }, // will be passed to the page component as props
  };
}

const CheckoutPage: React.FunctionComponent<any> = ({ uiStore, alldata }) => {
  // const { query } = useRouter();
  uiStore.setAllData(alldata);
  return (
    <NormalLayout>
      <div className="d-flex w-100">
        <div>
          <Snippet id={'contacts'} />
        </div>
      </div>
    </NormalLayout>
  );
};

export default inject('uiStore')(observer(CheckoutPage));
