import React, { Component, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import Breadcrumb from '@pdeals/next/components/Product/Breadcrumb';
import ProductContent from '@pdeals/next/components/Product/ProductContent';

const Slider = dynamic(() => import('@pdeals/next/components/Product/Slider'));

export async function getServerSideProps(context) {
  const alldata = await client().get('/open/alldata');
  const { id } = context.params;
  const from = context.query ? context.query.from : '';

  return {
    props: { alldata, id: id[0], from }, // will be passed to the page component as props
  };
}

const ProductPage: React.FunctionComponent<any> = ({ uiStore, alldata, id, from }) => {
  // const { query } = useRouter();
  uiStore.setProduct(id);
  uiStore.setAllData(alldata);
  console.log('Rendering now', id, new Date(), from);
  const isServer = typeof window === 'undefined';
  return (
    <NormalLayout>
      <Breadcrumb type="product" id={id} from={from} />
      <div
        className="d-flex col-md-5 col-sm-12 flex-wrap"
        style={uiStore.sliderWidth ? { minWidth: uiStore.sliderWidth } : {}}
      >
        {!isServer && <Slider />}
      </div>
      <div className="d-flex col-md-7 col-sm-12 ">
        <ProductContent />
      </div>
    </NormalLayout>
  );
};

export default inject('uiStore')(observer(ProductPage));
