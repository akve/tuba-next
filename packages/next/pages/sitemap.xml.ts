import { GetServerSideProps } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';
import { client } from '../lib/api/api-client';

const sitemapXML = async () => {
  const ROOT = 'https://tuba-duba.com/';
  const stream = new SitemapStream({ hostname: ROOT });
  const alldata: any = await client().get('/open/alldata');

  stream.write({
    url: ROOT,
    changefreq: 'daily',
    priority: 1,
  });
  for (let i = 0; i < alldata.products.length; i++) {
    const p = alldata.products[i];
    stream.write({
      url: `/product/${p.code}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  }
  for (let i = 0; i < alldata.categories.rows.length; i++) {
    const cat = alldata.categories.rows[i];
    stream.write({
      url: `/category/${cat.code}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  }
  for (let i = 0; i < alldata.collections.length; i++) {
    const c = alldata.collections[i];
    stream.write({
      url: `/collection/${c.code}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  }

  stream.write({
    url: `/info/contacts`,
    changefreq: 'weekly',
    priority: 1,
  });

  stream.write({
    url: `/info/otzyvy`,
    changefreq: 'weekly',
    priority: 1,
  });

  stream.end();
  return streamToPromise(stream).then((data) => data.toString());

  /*const sm = sitemap.createSitemap({
      hostname: 'https://www1.purplepass.com',
      cacheTime: 60000 * 60 * 24, //1 day cache
      urls: urls,
  });*/
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  console.log('start');
  //  const res = await serverSideFetch(`/general/sitemap`, context.req);
  //  const data = await res.json();
  console.log('finita');
  context.res.setHeader('Content-Type', 'text/xml');
  const xml = await sitemapXML();
  context.res.write(xml);
  context.res.end();
  return { props: {} };
};

function Sitemap() {
  return null;
}

export default Sitemap;
