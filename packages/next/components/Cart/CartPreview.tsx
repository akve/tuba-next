import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import { find } from 'lodash';
import OrderStore from '@pdeals/next/stores/orderStore';

interface IProps {
  orderStore?: OrderStore;
  allData: any;
}
const CartPreview = (props: IProps) => {
  const { orderStore, allData } = props;
  const { cart } = orderStore!;
  const getProduct = (product) => {
    console.log(allData, product.code);
    const p = find(allData.products, (r) => r.code === product.code);
    return p;
  };
  const onRemove = (index) => {
    orderStore!.remove(index);
  };

  return (
    <>
      <h1 style={{ marginLeft: '20px' }}>{i18n.t('[U:Кошик][R:Корзина]')}</h1>
      <table className="table table-cart">
        <thead>
          <tr>
            <th>Товар</th>
            <th>{i18n.t('[R:Цена][U:Цiна]')}</th>
            <th>{i18n.t('[R:Количество][U:Кількість]')}</th>
            <th>{i18n.t('[R:Стоимость][U:Вартість]')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.products.map((product, index) => (
            <tr key={`${index}`}>
              <td>
                <div className="d-flex ">
                  <img
                    src={getProduct(product).image}
                    height="60"
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                  <div className="pl-2 ">
                    <b>{i18n.t(product.name)}</b>
                    <br />
                    {i18n.t('[R:Цвет][U:Колір]')}: <b>{product.color}</b>
                    <br />
                    {i18n.t('[R:Размер][U:Розмір]')}: <b>{product.size}</b>
                  </div>
                </div>
              </td>
              <td>{product.price} грн</td>
              <td>{product.amount}</td>
              <td>{product.price * product.amount} грн</td>
              <td>
                <a onClick={() => onRemove(index)}>
                  <i className="ni ni-fat-remove" style={{ fontSize: '20px' }} />
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
                src={getProduct(product).image}
                width="50%"
                style={{ maxHeight: '300px', objectFit: 'contain', marginLeft: '5px' }}
              />
              <div className="text-right" style={{ marginRight: '5px' }}>
                <b className="text-right mr-10">{i18n.t(product.name)}</b>
                <br />
                {i18n.t('[R:Цвет][U:Колір]')}: <b>{i18n.t(product.color || '')}</b>
                <br />
                {i18n.t('[R:Размер][U:Розмір]')}: <b>{product.size}</b>
                <div>
                  <b>{product.price}</b> грн
                </div>
                <div>
                  <b>{product.amount}</b> од.
                </div>
              </div>
            </div>
            <div className="d-flex w-100 justify-content-center">
              <a onClick={() => onRemove(index)}>
                <i className="ni ni-fat-remove" style={{ fontSize: '20px', color: 'darkred' }} />
              </a>
            </div>
            <hr className="justify-content-center mt-0 mb-0" color="gray" style={{ width: '80%' }} />
          </div>
        ))}
      </div>
    </>
  );
};
export default inject('orderStore')(observer(CartPreview));
