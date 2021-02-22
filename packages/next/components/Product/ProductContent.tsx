import React, { Component, useState } from 'react';
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
    <div className="product-details-wrapper w-100">
      <h2>{i18n.t(product.name)}</h2>
      <div className="content" dangerouslySetInnerHTML={{ __html: product.description }}></div>
      <div className="order-wrapper">
        <h4>{i18n.t('[U:Оберiть розмір][R:Выберите размер]')}</h4>
        <SizeChooser value={size} onChange={(v) => setSize(v)} />
        <h4>{i18n.t('[U:Оберiть колiр][R:Выберите цвет]')}</h4>
        <AmountChooser value={amount} onChange={(v) => setAmount(v)} />
        {/*
        <button className="btn btn-secondary" onClick={() => onAddToCart()}>
          {i18n.t('[R:Добавить в корзину][U:Додати до кошика]')}
        </button>
        */}
        <button className="btn btn-primary" onClick={() => onAddToCart(true)}>
          {i18n.t('[R:Купить][U:Купити]')}
        </button>
      </div>
    </div>
  );
}

export default inject('uiStore', 'orderStore')(observer(ProductContent));
