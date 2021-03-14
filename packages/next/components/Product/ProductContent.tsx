import React, { Component, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
import UiStore from '@pdeals/next/stores/uiStore';
import * as i18n from '@pdeals/next/utils/i18n';
import OrderStore from '@pdeals/next/stores/orderStore';
import AmountChooser from '@pdeals/next/components/common/AmountChooser';
import SizeChooser from '@pdeals/next/components/common/SizeChooser';
import ColorChooser from '@pdeals/next/components/common/ColorChooser';

interface IProps {
  uiStore?: UiStore;
  orderStore?: OrderStore;
}
function ProductContent(props: IProps) {
  const { uiStore } = props;
  const router = useRouter();
  const product = uiStore!.ProductDetails;
  const [amount, setAmount] = useState(1);
  const [size, setSize] = useState('44');
  const [color, setColor] = useState('');
  console.log(product);

  const onAddToCart = (buyImmediately?: boolean) => {
    console.log('S', size);
    props.orderStore!.putToCart({
      name: `${product.name}`,
      code: `${product.code}`,
      color: color,
      amount: amount,
      size: size,
      price: product.pricediscount || product.price,
    });
    router.push('/checkout');
  };

  return (
    <>
      <Head>
        <title>{i18n.t(product.name)} - Tuba-Duba</title>
        <meta name="description" content={`${i18n.t(product.name)} - Tuba-Duba`} />
        <meta name="keywords" content="Туба-дуба, Tuba-Duba" />
        <meta property="og:title" content={`${i18n.t(product.name)} - Tuba-Duba`} key="title" />
        <meta property="og:type" content="product" />
        <meta
          property="og:image"
          content={`${product.data.images && product.data.images.length ? product.data.images[0].image : ''}`}
        />
        <meta property="og:description" content={`${i18n.t(product.name)}`} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="product:price:amount" content={`${product.price}`} />
        <meta property="product:price:currency" content="UAH" />
      </Head>
      <div className="product-details-wrapper w-100">
        <h1>{i18n.t(product.name)}</h1>
        <h3>{product.price} грн</h3>
        <div className="content" dangerouslySetInnerHTML={{ __html: i18n.t(product.description, true) }}></div>
        <div className="content">
          <p>{i18n.t('[R:Шьем по вашим меркам][U:Шиємо за вашими мірочками]')}</p>
        </div>
        <hr />
        <div className="order-wrapper">
          <AmountChooser value={amount} onChange={(v) => setAmount(v)} />
          <h4>{i18n.t('[U:Розмір][R:Размер]')}</h4>
          <SizeChooser
            value={size}
            onChange={(v) => {
              console.log('?????', v);
              setSize(v);
            }}
          />
          <h4>{i18n.t('[U:Колiр][R:Цвет]')}</h4>
          <ColorChooser product={product} value={color} onChange={(v) => setColor(v)} />
          {/*
        <button className="btn btn-secondary" onClick={() => onAddToCart()}>
          {i18n.t('[R:Добавить в корзину][U:Додати до кошика]')}
        </button>
        */}
          <button className="btn btn-primary" onClick={() => onAddToCart(true)}>
            {i18n.t('[R:Купить][U:Купити]')}
          </button>
        </div>
        <hr />
      </div>
    </>
  );
}

export default inject('uiStore', 'orderStore')(observer(ProductContent));
