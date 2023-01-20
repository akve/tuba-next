import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import Link from '@pdeals/next/elements/NextLink';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import Breadcrumb from '@pdeals/next/components/Product/Breadcrumb';
import ProductContent from '@pdeals/next/components/Product/ProductContent';
import CartPreview from '@pdeals/next/components/Cart/CartPreview';
import CartForm from '@pdeals/next/components/Cart/CartForm';
import * as i18n from '@pdeals/next/utils/i18n';
import {
  Card,
  CardBody,
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

export async function getServerSideProps(context) {
  const alldata = await client().get('/open/structure/structure');
  return {
    props: { alldata }, // will be passed to the page component as props
  };
}

const CheckoutPage: React.FunctionComponent<any> = ({ uiStore, alldata, orderStore }) => {
  // const { query } = useRouter();
  uiStore.setAllData(alldata);
  const isServer = typeof window === 'undefined';
  // if (isServer) return null;
  const { cart } = orderStore!;
  if (!cart.products || cart.products.length === 0) {
    return (
      <NormalLayout>
        <div className="d-flex w-100 justify-content-center flex-column align-items-center pt-100 pb-100">
          <div>{i18n.t('[E:Cart empty :(][R:Корзина пуста :(][U:Корзина пуста]')}</div>
          <div>
            <Link href={'/category/featured'} className="btn btn-outline-default" >
                {i18n.t('[E:Back to shop][R:В магазин][U:До магазину]')}
            </Link>
          </div>
        </div>
      </NormalLayout>
    );
  }
  return (
    <NormalLayout>
      <CartPreview allData={alldata} />
    </NormalLayout>
  );
};

export default inject('uiStore', 'orderStore')(observer(CheckoutPage));
