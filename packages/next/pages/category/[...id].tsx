import { Component } from 'react';
import Router, { useRouter } from 'next/router';
import PublicNavbar from '@pdeals/next/components/Navbars/PublicNavbar';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import ShopSidebar from '../../components/Sidebar/ShopSidebar';
import ProductsList from '@pdeals/next/components/ProductsList/ProductsList';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { serverSetLang, serverTranslate } from '@pdeals/next/lib/utils/serverTranslate';

export async function getServerSideProps(context) {
  serverSetLang(context);

  const structure = await client().get('/open/structure/structure');
  const { id } = context.params;
  const list = await client().get(`/open/products/category/${id[0]}`);
  return { props: {lang: currentLang(), structure: serverTranslate(context, structure), list: serverTranslate(context, list), id: id[0] } };
}

const IndexPage: React.FunctionComponent<any> = ({ lang, structure, list, id }) => {
  setLang(lang);
  // const { query } = useRouter();
  getStore().uiStore.setCategory(id);
  getStore().uiStore.setAllData(structure);
  getStore().uiStore.setList(list);
  console.log('Rendering now', id, new Date());
  return (
    <NormalLayout structure={structure}>
      <div className="col-lg-2 d-none d-lg-block d-xl-block">
        <ShopSidebar currentRoute={id} structure={structure}/>
      </div>
      <div className="col-lg-10 col-xs-12">
        <ProductsList currentRoute={id} />
      </div>
    </NormalLayout>
  );
};

export default IndexPage;
