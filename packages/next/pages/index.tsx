import { Component } from 'react';
import Router from 'next/router';
import PublicNavbar from '@pdeals/next/components/Navbars/PublicNavbar';
import { t, setLang, currentLang } from '@pdeals/next/utils/i18n';
import { client } from '../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import ShopSidebar from '../components/Sidebar/ShopSidebar';
import ProductsList from '@pdeals/next/components/ProductsList/ProductsList';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { HeadNonProduct } from '@pdeals/next/components/Headers/HeadNonProduct';

export async function getServerSideProps({ params }) {
  const alldata = await client().get('/open/alldata');
  return { props: { alldata } };
}

const IndexPage: React.FunctionComponent<any> = ({ alldata }) => {
  // const { query } = useRouter();
  getStore().uiStore.setAllData(alldata);
  console.log('Rendering now', alldata, new Date());
  return (
    <NormalLayout withHeading>
      <HeadNonProduct />
      <div className="col-lg-2 d-none d-lg-block d-xl-block">
        <ShopSidebar currentRoute="featured" />
      </div>
      <div className="col-lg-10 col-xs-12">
        <ProductsList currentRoute="featured" isForCollection={false} />
      </div>
    </NormalLayout>
  );
};

export default IndexPage;
