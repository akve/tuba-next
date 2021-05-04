import { client } from '../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import ShopSidebar from '../components/Sidebar/ShopSidebar';
import ProductsList from '@pdeals/next/components/ProductsList/ProductsList';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { HeadNonProduct } from '@pdeals/next/components/Headers/HeadNonProduct';

export async function getServerSideProps(context) {
  const structure = await client().get('/open/structure/structure');
  const list = await client().get('/open/products/category/featured');
  return { props: { structure, list } };
}

const IndexPage: React.FunctionComponent<any> = ({ structure, list }) => {
  // const { query } = useRouter();
  getStore().uiStore.setAllData(structure);
  getStore().uiStore.setList(list);
  // console.log('Rendering now', alldata, new Date());
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
