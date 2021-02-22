import React, { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
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
import { filter } from 'lodash';
import { t } from '../../utils/i18n';
import OutsideClickHandler from 'react-outside-click-handler';
import UiStore from '@pdeals/next/stores/uiStore';
import * as i18n from '@pdeals/next/utils/i18n';
import Snippet from '@pdeals/next/components/Snippet/Snippet';
import Breadcrumb from '@pdeals/next/components/Product/Breadcrumb';

interface IProps {
  uiStore?: UiStore;
  currentRoute?: string;
}
function ProductsList(props: IProps) {
  const { uiStore } = props;
  const products = uiStore!.getListByCategory(props.currentRoute!) || [];
  const productsList = products; //.slice(0, 20);

  const onAddToCart = (product: any) => {
    console.log(product);
  };

  return (
    <div className="products-list">
      <Breadcrumb type="category" id={props.currentRoute!} />
      <div className="list-wrapper">
        {productsList.map((product) => (
          <div className="col-lg-4 col-xs-12 product-item" key={`${product.code}`}>
            <Card className="">
              <Link href={`/product/${product.code}`}>
                <img src={product.image || require('assets/img/tuba/logo-top.png')} className="card-img-top" />
              </Link>
              <div className="card-body text-center">
                <Link href={`/product/${product.code}`}>
                  <h4>{i18n.t(product.name)}</h4>
                </Link>
                <div className="text-muted price-text">{product.price} грн</div>
                <button className="btn btn-outline-secondary" onClick={() => onAddToCart(product)}>
                  {i18n.t('[R:В корзину][U:До кошика]')}
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sidebar.defaultProps = {
//   routes: [{}],
//   toggleSidenav: () => {},
//   sidenavOpen: false,
//   rtlActive: false,
// };

export default inject('uiStore')(observer(ProductsList));
