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
  const alldata = await client().get('/open/alldata?cache=' + new Date());
  const { id } = context.params;
  return {
    props: { alldata, id: id[0] }, // will be passed to the page component as props
  };
}

const IndexPage: React.FunctionComponent<any> = ({ alldata, id }) => {
  // const { query } = useRouter();
  getStore().uiStore.setCollection(id);
  getStore().uiStore.setAllData(alldata);
  console.log('Rendering now', id, new Date());
  return (
    <NormalLayout>
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
