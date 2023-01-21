import { client } from '../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import ShopSidebar from '../components/Sidebar/ShopSidebar';
import ProductsList from '@pdeals/next/components/ProductsList/ProductsList';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { HeadNonProduct } from '@pdeals/next/components/Headers/HeadNonProduct';
import { serverSetLang, serverTranslate } from '@pdeals/next/lib/utils/serverTranslate';
import { currentLang, setLang } from '@pdeals/next/utils/i18n';

export async function getServerSideProps(context) {
  serverSetLang(context);
  const structure = await client().get('/open/structure/structure');
  const list = await client().get('/open/products/category/featured');
  return { props: { lang: currentLang(), structure: serverTranslate(context, structure), list: serverTranslate(context, list) } };
}

const IndexPage: React.FunctionComponent<any> = ({ lang, structure, list }) => {
  // const { query } = useRouter();
  setLang(lang);
  console.log('S', list);
  getStore().uiStore.setAllData(structure);
  getStore().uiStore.setList(list);
  // console.log('Rendering now', alldata, new Date());
  return (
    <NormalLayout withHeading structure={structure}>
      <HeadNonProduct />
      <div className="col-lg-2 d-none d-lg-block d-xl-block">
        <ShopSidebar currentRoute="featured" structure={structure} />
      </div>
      <div className="col-lg-10 col-xs-12">
        <ProductsList currentRoute="featured" isForCollection={false} />
      </div>
    </NormalLayout>
  );
};

export default IndexPage;
