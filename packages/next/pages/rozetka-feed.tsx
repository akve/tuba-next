import { GetServerSideProps } from 'next';
import { sortBy, filter, find } from 'lodash';
import { client } from '../lib/api/api-client';
import * as i18n from '@pdeals/next/utils/i18n';
const ROOT = 'https://tuba-duba.com';
import { RozetkaCategoryLookup } from '@pdeals/next/utils/rozetkaHelper';

const safeXml = (s) => {
  if (!s) return s;
  return i18n
    .t(s)
    .replace(/&nbsp;/g, ' ')
    .replace(/(<([^>]+)>)/gi, ' ')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;');
};
const getImage = (p, showAll?: boolean) => {
  const res = p.data.images && p.data.images.length ? p.data.images[0].image : '';
  if (!res) return `${ROOT}/assets/img/main.jpg`;
  if (showAll) {
    return p.data.images.map((p1) => {
      if (p1.image.indexOf('cloudinary') >= 0) return p1.image;
      return `${ROOT}${p1.image}`;
    });
  }
  if (res.indexOf('cloudinary') >= 0) return res;
  return `${ROOT}${res}`;
};

const getColors = (p, alldata) => {
  const colors = p.data.colors;
  if (!colors) return ``;
  let res = '';
  colors.forEach((color) => {
    const c = find(alldata.colors, (r) => {
      `${r.id}` === `${color.color}`;
    });
    if (res) res += ', ';
    if (c) {
      res += c.name;
    } else {
      res += i18n.t(color.name).split(',')[0];
    }
  });
  return res;
};
const sitemapXML = async () => {
  let res = `<?xml version="1.0"?>
<yml_catalog date="${new Date().toISOString()}">
<shop>
<name>Tuba-Duba</name>
<company>Tuba-Duba</company>
<url>https://tuba-duba.com</url>
<currencies>
<currency id="UAH" rate="1"/>
</currencies>
<categories>
  `;
  RozetkaCategoryLookup.options?.forEach((option) => {
    if (option.value) {
      res += `<category id="${option.value}" rz_id="${option.value}">${option.label}</category>`;
    }
  });
  res += `</categories>
<offers>`;

  const alldata: any = await client().get('/open/alldata');
  alldata.products = sortBy(alldata.products, (r) => {
    return r.updatedAt;
  });
  alldata.products = filter(alldata.products, (r: any) => {
    if (r.invisible) return false;
    if (!r.rz_category) return false;
    return true;
  });
  for (let i = 0; i < alldata.products.length; i++) {
    const p = alldata.products[i];
    let salePrice = `<price>${p.price}</price>`;
    if (p.pricediscount) {
      salePrice = `<price>${p.pricediscount}</price><price_old>${p.price}</price_old>`;
    }
    const fabricFull = alldata.fabrics.find((r) => r.id === p.fabric);
    const fabric = fabricFull ? fabricFull.name : 'Хлопок';
    const color = getColors(p, alldata);
    if (p.code !== 'DELETE-ME') {
      res += `
      <offer available="true" id="${p.code}">
        <stock_quantity>10</stock_quantity>
        <url>${ROOT}/product/${p.code}</url>
        ${salePrice}
        <currencyId>UAH</currencyId>
        <categoryId>${p.rz_category}</categoryId>
        <vendor>Tuba-Duba</vendor>
        <name>${safeXml(p.name)}</name>
        <description><![CDATA[ ${safeXml(p.description || p.name)}]]></description>
        <param name="Страна-производитель товара" paramid="98900" valueid="544338">Украина</param>
        <param name="Ткань">${safeXml(fabric)}</param>
        <param name="Цвета">${safeXml(color)}</param>
        <param name="Доставка/Оплата" paramid="2019">
          <![CDATA[Оплата картой Visa/MasterCard Доставка: самовывоз из Новой почты, Курьер Новая почта ]]>
        </param>
      `;
      getImage(p, true).forEach((img) => {
        res += `<picture>${img}</picture>`;
      });
      res += `</offer>`;
    }
  }
  res += `</offers>
</shop>
</yml_catalog>`;
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

function RozetkaFeed() {
  return null;
}

export default RozetkaFeed;
