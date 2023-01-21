import { Component } from 'react';
import Router, { useRouter } from 'next/router';
import PublicNavbar from '@pdeals/next/components/Navbars/PublicNavbar';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import ShopSidebar from '../../components/Sidebar/ShopSidebar';
import ProductsList from '@pdeals/next/components/ProductsList/ProductsList';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';

export async function getServerSideProps(context) {
  const structure = await client().get('/open/structure/structure');
  const { id } = context.params;
  console.log(`/open/products/collection/${id[0]}`);
  const list = await client().get(`/open/products/collection/${id[0]}`);
  return { props: { structure, list, id: id[0] } };
}

const IndexPage: React.FunctionComponent<any> = ({ structure, list, id }) => {
  // const { query } = useRouter();
  getStore().uiStore.setCollection(id);
  getStore().uiStore.setList(list);
  getStore().uiStore.setAllData(structure);
  console.log('Rendering now', id, new Date());
  return (
    <NormalLayout  structure={structure}>
      <div className="col-lg-2 d-none d-lg-block d-xl-block">
        <ShopSidebar currentRoute={id} />
      </div>
      <div className="col-lg-10 col-xs-12">
        <ProductsList currentRoute={id} isForCollection />
      </div>
    </NormalLayout>
  );
};

export default IndexPage;
