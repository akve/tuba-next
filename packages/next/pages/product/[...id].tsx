import React, { Component, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import Breadcrumb from '@pdeals/next/components/Product/Breadcrumb';
import ProductContent from '@pdeals/next/components/Product/ProductContent';
import ImageModal from '@pdeals/next/components/Product/ImageModal';
const Slider = dynamic(() => import('@pdeals/next/components/Product/Slider'));

export async function getServerSideProps(context) {
  const structure = await client().get('/open/structure/structure');
  const { id } = context.params;
  const from = context.query ? context.query.from : '';
  const product = await client().get(`/open/product/${id[0]}`);
  return { props: { structure, product, id: id[0], from: from || '' } };
}

const ProductPage: React.FunctionComponent<any> = ({ uiStore, structure, product, id, from }) => {
  const [isModalOpened, setModalOpened] = useState<any>(null);

  // const { query } = useRouter();
  uiStore.setProduct(id);
  uiStore.setProductDetails(product);
  uiStore.setAllData(structure);
  console.log('Rendering now', id, new Date(), from);
  const isServer = typeof window === 'undefined';
  return (
    <>
      <NormalLayout structure={structure}>
        <Breadcrumb type="product" id={id} from={from} />
        <ImageModal gallery={isModalOpened} closeModal={() => setModalOpened('')} isModalOpened={isModalOpened} />
        <div
          className="d-flex col-md-5 col-sm-12 flex-wrap"
          style={uiStore.sliderWidth ? { minWidth: uiStore.sliderWidth } : {}}
        >
          {!isServer && <Slider onOpenModal={setModalOpened} />}
        </div>
        <div className="d-flex col-md-7 col-sm-12 ">
          <ProductContent onOpenModal={setModalOpened} />
        </div>
      </NormalLayout>
    </>
  );
};

export default inject('uiStore')(observer(ProductPage));
