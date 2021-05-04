import { observable } from 'mobx';
import { persist } from 'mobx-persist';
import { serializable } from 'serializr';
// import { find } from 'lodash';

class CartSingleProduct {
  @persist @serializable code: string;

  @persist @serializable name: string;

  @persist @serializable color?: string;

  @persist @serializable amount: number;

  @persist @serializable size: string;

  @persist @serializable price: number;

  @persist @serializable image: string;
}

class Cart {
  @persist('list', CartSingleProduct)
  @observable
  products: CartSingleProduct[] = [];

  constructor() {
    this.products = new Array<CartSingleProduct>();
  }
}

export { CartSingleProduct, Cart };
