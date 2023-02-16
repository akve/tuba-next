import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import OrderStore from '@pdeals/next/stores/orderStore';
import { resizeImage } from '@pdeals/next/utils/helpers';
import { Button } from 'reactstrap';
import { router } from 'next/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    const items = [];
    console.log('P', cart.products);
    cart.products.forEach(p => {
      items.push({
        'item_name': `${i18n.t(p.name)}`,       // Name or ID is required.
        'item_id': `${p.code}`,				  // id під яким товар лежить у базі
        'price': `${p.pricediscount || p.price}`,
        'item_brand': 'Tuba Duba',
        'item_category': i18n.t('Сукня'),
        'index': 1,
        'quantity': `${p.amount}`
      });
    });

    window.dataLayer.push({
      'event': 'begin_checkout',
      'ecommerce': {
        items
      }
    });

  }, []);

  const onRemove = (index) => {
    orderStore!.remove(index);
  };
  const onProceed = () => {
    router.push('/checkout/order');
  };
  const total = cart.products.reduce((sum, product) => sum + product.price * product.amount, 0);

  return (
    <>
      <h1 style={{ marginLeft: '20px' }}>{i18n.t('[E:Cart][U:Кошик][R:Корзина]')}</h1>
      <table className="table table-cart">
        <thead>
          <tr>
            <th>{i18n.t('[E:Item][R:Товар][U:Товар]')}</th>
            <th>{i18n.t('[E:Price][R:Цена][U:Цiна]')}</th>
            <th>{i18n.t('[E:Quantity][R:Количество][U:Кількість]')}</th>
            <th>{i18n.t('[E:Cost][R:Стоимость][U:Вартість]')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.products.map((product, index) => (
            <tr key={`${index}`}>
              <td>
                <div className="d-flex ">
                  <img
                    src={resizeImage(product.image || '', 'thumb')}
                    height="60"
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                  <div className="pl-2 ">
                    <b>{i18n.t(product.name)}</b>
                    <br />
                    {i18n.t('[E:Color][R:Цвет][U:Колір]')}: <b>{i18n.t(product.color || '')}</b>
                    <br />
                    {i18n.t('[E:Size][R:Размер][U:Розмір]')}: <b>{i18n.t(product.size || '')}</b>
                  </div>
                </div>
              </td>
              <td>{product.price} {i18n.t('[E:uah][U:грн]')}</td>
              <td>{product.amount}</td>
              <td>{product.price * product.amount} {i18n.t('[E:uah][U:грн]')}</td>
              <td>
                <a onClick={() => onRemove(index)}>
                  <img src="/assets/img/x.svg" style={{ width: '20px', height: '20px' }} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="div-cart">
        {cart.products.map((product, index) => (
          <div className="d-flex flex-column" key={`${index}`}>
            <div className="d-flex justify-content-between flex-row">
              <img
                src={resizeImage(product.image, 'thumb')}
                width="50%"
                style={{ maxHeight: '300px', objectFit: 'contain', marginLeft: '5px' }}
              />
              <div className="text-right" style={{ marginRight: '5px' }}>
                <b className="text-right mr-10">{i18n.t(product.name)}</b>
                <br />
                {i18n.t('[E:Color][R:Цвет][U:Колір]')}: <b>{i18n.t(product.color || '')}</b>
                <br />
                {i18n.t('[E:Size][R:Размер][U:Розмір]')}: <b>{product.size}</b>
                <div>
                  <b>{product.price}</b> {i18n.t('[E:uah][U:грн]')}
                </div>
                <div>
                  <b>{product.amount}</b>
                </div>
              </div>
            </div>
            <div className="d-flex w-100 justify-content-center">
              <a onClick={() => onRemove(index)}>
                <img src="/assets/img/x.svg" style={{ width: '20px', height: '20px' }} />
              </a>
            </div>
            <hr className="justify-content-center mt-0 mb-0" color="gray" style={{ width: '80%' }} />
          </div>
        ))}
      </div>
      <div style={{ marginLeft: '20px', marginBottom: '50px' }}>
        <h3>
          {i18n.t('[E:Total][R:Всего][U:Разом]')}: {total} {i18n.t('[E:uah][U:грн]')}
        </h3>

        <Button color="primary" type="submit" size="lg" className={`order-button`} onClick={() => onProceed()}>
          {i18n.t('[E:Continue the order][R:Оформить заказ][U:Оформити замовлення]')}
        </Button>
      </div>
    </>
  );
};
export default inject('orderStore')(observer(CartPreview));
