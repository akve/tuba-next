import { GetServerSideProps } from 'next';
import { sortBy } from 'lodash';
import { client } from '../lib/api/api-client';
import * as i18n from '@pdeals/next/utils/i18n';
const ROOT = 'https://tuba-duba.com';

/*
<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Test Store</title>
<link>http://www.example.com</link>
<description>An example item from the feed</description>
<item>
<g:id>DB_1</g:id>
<g:title>Dog Bowl In Blue</g:title>
<g:description>Solid plastic Dog Bowl in marine blue color</g:description>
<g:link>http://www.example.com/bowls/db-1.html</g:link>
<g:image_link>http://images.example.com/DB_1.png</g:image_link>
<g:brand>Example</g:brand>
<g:condition>new</g:condition>
<g:availability>in stock</g:availability>
<g:price>9.99 GBP</g:price>
<g:shipping>
<g:country>UK</g:country>
<g:service>Standard</g:service>
<g:price>4.95 GBP</g:price>
</g:shipping>
<g:google_product_category>Animals &gt; Pet Supplies</g:google_product_category>
<g:custom_label_0>Made in Waterford, IE</g:custom_label_0>
</item>
</channel>
</rss>

* */
const safeXml = (s) => {
  return i18n.t(s).replace(/>/g, '&gt;').replace(/</g, '&lt;');
};
const getImage = (p) => {
  const res = p.data.images && p.data.images.length ? p.data.images[0].image : '';
  if (!res) return `${ROOT}/assets/img/main.jpg`;
  if (res.indexOf('cloudinary') >= 0) return res;
  return `${ROOT}${res}`;
};
const sitemapXML = async () => {
  let res = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Tuba-Duba Store</title>
<link>https://tuba-duba.com</link>
<description>Tuba-Duba store products</description>
  `;
  const alldata: any = await client().get('/open/alldata');
  alldata.products = sortBy(alldata.products, (r) => {
    return r.updatedAt;
  });
  for (let i = 0; i < alldata.products.length; i++) {
    const p = alldata.products[i];
    if (p.code !== 'DELETE-ME') {
      res += `
      <item>
      <g:id>tuba_duba_${p.code}</g:id>
      <g:title>${safeXml(p.name)}</g:title>
      <g:description>${safeXml(p.name)}</g:description>
      <g:link>${ROOT}/product/${p.code}</g:link>
      <g:image_link>${getImage(p)}</g:image_link>
      <g:brand>Tuba-Duba</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${p.price} UAH</g:price>
      <g:google_product_category>Clothing &amp; Accessories &gt; Clothing &gt;   Dresses</g:google_product_category>
      </item>
      `;
    }
  }
  res += `</channel>
</rss>`;
  return res;
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

function FbFeed() {
  return null;
}

export default FbFeed;
