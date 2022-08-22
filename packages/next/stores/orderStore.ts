import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { client } from '../lib/api/api-client';
import { Cart, CartSingleProduct } from '@pdeals/next/stores/Cart';

class OrderStore {
  @observable
  @persist('object', Cart)
  cart: Cart = new Cart();

  @action setCart(s: any) {
    this.cart = s;
  }

  @action clear() {
    this.cart = new Cart();
  }

  @action putToCart(product: CartSingleProduct) {
    this.cart.products.push(product);
  }

  @action remove(index: number) {
    this.cart.products.splice(index, 1);
  }

  @action async send(payload: any) {
    let total = 0;
    this.cart.products.forEach(p => {
      total += p.amount * p.price;
    })
    payload.total = total;
    return await client().post('/open/order', payload);
  }
  @action async getPaymentRedirect(id) {
    return await client().get(`/open/checkout-fondy-url/${id}`);
  }
  @action async markAsPaid(id) {
    return await client().get(`/open/checkout-paid/${id}`);
  }
}

export default OrderStore;
