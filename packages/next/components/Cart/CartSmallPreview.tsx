import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import { find } from 'lodash';
import OrderStore from '@pdeals/next/stores/orderStore';
import { resizeImage } from '@pdeals/next/utils/helpers';
import { Button } from 'reactstrap';
import { router } from 'next/client';
import { useRouter } from 'next/router';

interface IProps {
  orderStore?: OrderStore;
  allData: any;
}
const CartPreview = (props: IProps) => {
  const { orderStore, allData } = props;
  const { cart } = orderStore!;
  const router = useRouter();
  /*const getProduct = (product) => {
    console.log(allData, product.code);
    const p = find(allData.products, (r) => r.code === product.code);
    return p;
  };*/
  const onRemove = (index) => {
    orderStore!.remove(index);
  };
  const onProceed = () => {
    router.push('/checkout/order');
  };
  const total = cart.products.reduce((sum, product) => sum + product.price * product.amount, 0);

  return (
    <>
      <h2 style={{ marginLeft: '20px' }}>{i18n.t('[U:Ваше замовлення][R:Ваш заказ]')}</h2>
      <div className="div-cart-small">
        {cart.products.map((product, index) => (
          <div className="d-flex flex-column" key={`${index}`}>
            <div className="d-flex justify-content-between flex-row">
              <div style={{ marginLeft: '20px' }}>
                <b className="text-right mr-10">{i18n.t(product.name)}</b>
                <br />
                {i18n.t('[R:Цвет][U:Колір]')}: <b>{i18n.t(product.color || '')}</b>, {i18n.t('[R:Размер][U:Розмір]')}:{' '}
                <b>{product.size}</b>
                <div>
                  <b>{product.price}</b> грн,
                  <b>{product.amount}</b> од.
                </div>
              </div>
            </div>
            <hr
              className="justify-content-center mt-0 mb-0"
              color="gray"
              style={{ width: '80%', marginTop: '10px !important' }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
export default inject('orderStore')(observer(CartPreview));
