import { GetServerSideProps } from 'next';
import { sortBy, filter, find } from 'lodash';
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


/*
* <rss xmlns:g="http://base.google.com/ns/1.0" xmlns:c="http://base.google.com/cns/1.0" version="2.0">
  <channel>
    <title>
      <![CDATA[ Unity Store ]]> <!-- Название магазина -->
    </title>

    <link>
      <![CDATA[ https://whounity.com ]]> <!--ссылка на главную -->
    </link>

    <description>
      <![CDATA[ живийсередзомбі ]]> <!--описание магазина (краткое) -->
    </description>

    <item>
      <g:identifier_exists>
      <![CDATA[ false ]]> <!-- Оставить как есть -->
      </g:identifier_exists>

      <g:id>
      <![CDATA[ 8372 ]]> <!-- product_id как в базе данных  -->
      </g:id>

      <title>
      <![CDATA[ <h1> ]]> <!-- meta_title. Если нету - h1  -->
      </title>

      <description>
      <![CDATA[ meta description ]]>
      </description>

      <link>
      <![CDATA[ https://whounity.com/product/the-north-face-steep-tech-logo-tee ]]> <!-- url продукта  -->
      </link>

      <g:product_type>
      <![CDATA[ Футболки ]]> <!-- категория продука (предпоследнее свойство хлебной крошки)  -->
      </g:product_type>

      <g:image_link>
      <![CDATA[ https://whounity.com/storage/product-images/315/1_532_532.png ]]> <!-- абсолютный url на картинку товара  -->
      </g:image_link>


      <!-- Циклом вывести все доп картинки. По одной картинке на тег <g:additional_image_link> -->
      <g:additional_image_link>
      <![CDATA[ https://whounity.com/storage/product-images/315/4.png ]]> <!-- абсолютный url на картинку дополнительную картинку товара. Каждый URL в новом теге additional_image_link  -->
      </g:additional_image_link>

      <g:condition>
      <![CDATA[ New ]]> <!-- Оставить как есть  -->
      </g:condition>

      <g:availability>
      <![CDATA[ in stock ]]> <!-- Оставить как есть  -->
      </g:availability>

      <g:price>
      <![CDATA[ 540 UAH ]]> <!-- целое число, без делимитеров, через пробел, валюта UAH  -->
      </g:price>

      <g:brand>
      <![CDATA[ The North Face ]]>
      </g:brand>

    </item>

    <item>
      ...
    </item>
  </channel>
</rss>
* */
const safeXml = (s) => {
  if (!s) return s;
  return `<![CDATA[ ` + i18n
    .t(s)
    .replace(/&nbsp;/g, ' ')
    .replace(/(<([^>]+)>)/gi, ' ')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    + ` ]]>`;
};
const getImage = (p, showAll?: boolean) => {
  if (p.code === 'ubasquare') {
    console.log('P', p.data.images);
  }
  const res = p.data.images && p.data.images.length ? p.data.images[0].image : '';
  if (!res) return `${ROOT}/assets/img/main.jpg`;
  if (showAll) {
    return p.data.images
      .map((p1) => {
        if (p1.image.indexOf('cloudinary') >= 0) return p1.image;
        return `${ROOT}${p1.image}`;
      })
      .join(',');
  }
  if (res.indexOf('cloudinary') >= 0) return res;
  return `${ROOT}${res}`;
};
const sitemapXML = async () => {
  let res = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" xmlns:c="http://base.google.com/cns/1.0" version="2.0">
<channel>
<title>
      <![CDATA[ Tuba-Duba Store ]]> <!-- Название магазина -->
</title>
<link><![CDATA[ https://tuba-duba.com ]]></link>
<description><![CDATA[ Tuba-Duba store products ]]></description>
  `;
  const alldata: any = await client().get('/open/alldata');
  alldata.products = sortBy(alldata.products, (r) => {
    return r.updatedAt;
  });
  alldata.products = filter(alldata.products, (r: any) => {
    if (r.invisible) return false;
    if (r.code === 'shtanillyani') return false;
    if (r.data && r.data.categories) {
      if (find(r.data.categories, (c) => c.category === 63)) {
        return false;
      }
    }
    return true;
  });
  for (let i = 0; i < alldata.products.length; i++) {
    const p = alldata.products[i];
    let salePrice = '';
    if (p.pricediscount) {
      salePrice = `<g:sale_price>${p.pricediscount} UAH</g:sale_price>`;
    }
    if (p.code !== 'DELETE-ME') {
      res += `
      <item>
      <g:identifier_exists>${safeXml('false')}</g:identifier_exists>
      <g:id>${safeXml('tuba_duba_' + p.code)}</g:id>
      <g:title>${safeXml(p.name)}</g:title>
      <g:description>${safeXml(p.description || p.name)}</g:description>
      <g:link>${ROOT}/product/${p.code}</g:link>
      <g:product_type>${safeXml('woman dresses')}</g:product_type>
      <g:image_link>${getImage(p)}</g:image_link>
      <g:additional_image_link>${getImage(p, true)}</g:additional_image_link>
      <g:brand>Tuba-Duba</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${p.price} UAH</g:price>
      <g:age_group>adult</g:age_group>
      <g:gender>female</g:gender>
      <g:color>variety</g:color>
      <g:size>Custom fit</g:size>
      ${salePrice}
      <g:google_product_category>2271</g:google_product_category>
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
