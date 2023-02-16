import React, { Component, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from '@pdeals/next/elements/NextLink';
import { useRouter, withRouter } from 'next/router';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Card,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';

import UiStore from '@pdeals/next/stores/uiStore';
import * as i18n from '@pdeals/next/utils/i18n';
import OrderStore from '@pdeals/next/stores/orderStore';
import AmountChooser from '@pdeals/next/components/common/AmountChooser';
import SizeChooser from '@pdeals/next/components/common/SizeChooser';
import ColorChooser from '@pdeals/next/components/common/ColorChooser';
import { resizeImage, safeJson } from '@pdeals/next/utils/helpers';

interface IProps {
  uiStore?: UiStore;
  orderStore?: OrderStore;
  onOpenModal?: any;
}
function ProductContent(props: IProps) {
  const { uiStore } = props;
  const router = useRouter();
  const product = uiStore!.ProductDetails;
  const [amount, setAmount] = useState(1);
  const [size, setSize] = useState('44');
  const [color, setColor] = useState('');
  //console.log('PROD', product);

  const getFabric = () => {
    if (!product.product.data.colors || !product.product.data.colors.length) return null;
    const color = product.product.data.colors[0];
    if (!color.color) return null;
    const colorFull = find(product.colors, (r) => `${r.id}` === `${color.color}`);
    if (!colorFull) return null;
    const f = find(product.fabrics, (r) => r.id === colorFull.fabric);
    if (f) {
      return f;
    }
    return null;
  };

  const fbEffect = (event) => {
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    const p = product.product;
    // console.log(window._breadcrumbs);
    let category = 'Плаття';
    if (window._breadcrumbs && window._breadcrumbs.length) {
      category = window._breadcrumbs[0].title
    }


    // @ts-ignore
    window.dataLayer.push({
      'event': event,
      'ecommerce': {
        'items': [
          {
            'item_name': `${i18n.t(p.name)}`,       // Name or ID is required.
            'item_id': `${p.code}`,				  // id під яким товар лежить у базі
            'price': `${p.pricediscount || p.price}`,
            'item_brand': 'Tuba Duba',
            'item_category': i18n.t(category),
            'index': 1,
            'quantity': '1'
          }]
      }
    });
  }

  useEffect(()=> {
    fbEffect('view_item');
  }, [])

  const onAddToCart = (buyImmediately?: boolean) => {
    console.log('S', size);
    const p = product.product;
    fbEffect('add_to_cart');
    props.orderStore!.putToCart({
      image: `${p.image || p.data.images[0].image}`,
      name: `${p.name}`,
      code: `${p.code}`,
      color: color,
      amount: amount,
      size: size,
      price: p.pricediscount || p.price,
    });
    router.push('/checkout');
  };

  if (!product.product || !product.product.id) return <h1>This product is not found</h1>;
  const colors = !product.product.data.colors
    ? ''
    : product.product.data.colors.reduce((acc, cv) => {
        return acc + cv.name + ' / ';
      }, '');
  const fabric = getFabric();
  // console.log('C', colors, fabric);
  return (
    <>
      <Head>
        <title>{i18n.t(product.product.name)} - Tuba-Duba</title>
        <meta name="description" content={`${safeJson(i18n.t(product.product.name))} - Tuba-Duba`} />
        <meta name="keywords" content="Туба-дуба, Tuba-Duba" />
        <meta property="og:title" content={`${safeJson(i18n.t(product.product.name))} - Tuba-Duba`} key="title" />
        <meta property="og:type" content="product" />
        <meta
          property="og:image"
          content={`${
            product.product.data.images && product.product.data.images.length
              ? resizeImage(product.product.data.images[0].image, 'normal')
              : ''
          }`}
        />
        <meta property="og:description" content={`${safeJson(i18n.t(product.product.name))}`} />
        <meta
          property="og:url"
          content={
            typeof window !== 'undefined'
              ? window.location.href
              : `https://tuba-duba.com/product/${product.product.code}`
          }
        />
        <meta property="product:price:amount" content={`${product.product.price}`} />
        <meta property="product:price:currency" content="UAH" />
        <meta property="productID" itemProp="productID" content={`tuba_duba_${product.product.code}`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
      "@context": "https://schema.org",
      "@type": "Product",
      "productID":"tuba_duba_${product.product.code}",
      "name": "${safeJson(i18n.t(product.product.name))} Tuba-Duba",
      "image": "${
        product.product.data.images && product.product.data.images.length
          ? resizeImage(product.product.data.images[0].image, 'normal')
          : ''
      }",
      "description": "${safeJson(i18n.t(product.product.description), true)}",
      "brand": {
        "@type": "Thing",
        "name": "Tuba-Duba"
      },
      "logo": "https://tuba-duba.com/assets/img/logo.png",
      "offers": {
        "@type": "Offer",
        "price": "${product.product.price}",
        "priceCurrency": "UAH",
        "url": "https://tuba-duba.com/product/${product.product.code}",
        "availability": "https://schema.org/InStock",
        "offerCount": "1",
        "itemOffered":{
          "@type": "IndividualProduct",
          "name": "${safeJson(i18n.t(product.product.name))}",
          "model": "${product.product.id}",
          "color":"${safeJson(i18n.t(colors))}"
          },
        "seller": {"@type":"Organization","name":"Tuba-Duba"}
      }      
    }`,
          }}
        />
      </Head>
      <div className="product-details-wrapper w-100">
        <h1>{i18n.t(product.product.name)}</h1>
        <h3>
          {!!product.product.pricediscount && (
            <>
              <span className="strikeover">{product.product.price}</span> {product.product.pricediscount} грн
            </>
          )}
          {!product.product.pricediscount && <>{product.product.price} {i18n.t('[E:uah][U:грн]')}</>}
        </h3>
        <div className="content" dangerouslySetInnerHTML={{ __html: i18n.t(product.product.description, true) }}></div>
        {!!fabric && (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: i18n.t(fabric.description || fabric.name, true) }}
          ></div>
        )}
        {!product.product.description && (
          <div className="content">
            <p>{i18n.t('[E:We sew according to your measurements][R:Шьем по вашим меркам][U:Шиємо за вашими мірочками]')}</p>
          </div>
        )}
        <hr />
        <div className="order-wrapper">
          <AmountChooser value={amount} onChange={(v) => setAmount(v)} />
          <h4>{i18n.t('[E:Size][U:Розмір][R:Размер]')}</h4>
          <SizeChooser
            value={size}
            onChange={(v) => {
              // console.log('?????', v);
              setSize(v);
            }}
            onOpenModal={props.onOpenModal}
          />
          <h4>{i18n.t('[E:Color][U:Колiр][R:Цвет]')}</h4>
          <ColorChooser product={product} value={color} onChange={(v) => setColor(v)} onOpenModal={props.onOpenModal} />
          {/*
        <button className="btn btn-secondary" onClick={() => onAddToCart()}>
          {i18n.t('[R:Добавить в корзину][U:Додати до кошика]')}
        </button>
        */}
          <button className="btn btn-primary" onClick={() => onAddToCart(true)}>
            {i18n.t('[E:Buy][R:Купить][U:Купити]')}
          </button>
        </div>
        <hr />
      </div>
    </>
  );
}

export default inject('uiStore', 'orderStore')(observer(ProductContent));
