import { useStaticRendering } from 'mobx-react';
import { create } from 'mobx-persist';
import UiStore from './uiStore';
import UserStore from './userStore';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

let store = null;

export const getStore = () => store || initializeStore();
const initalizeStoreClean = () => {
  if (!store) {
    store =  {
      uiStore: new UiStore(),
      userStore: new UserStore(),
    };
  }
  return store;
}
export default async function initializeStore() {
  if (store === null) {

    store = initalizeStoreClean();
    const userStore = new UserStore();
    const uiStore = new UiStore();
    store = {
      uiStore,
      userStore,
    };
  }

  return store;
}
export async function hydrateEverything(store) {
  if (typeof localStorage === 'undefined') return;
  const hydrate = create({
    storage: localStorage, // or AsyncStorage in react-native.
    // default: localStorage
    jsonify: true, // if you use AsyncStorage, here shoud be true
    // default: true
  });

  await hydrate('userStore', store.userStore).then(() => {
    console.log('userStore has been hydrated');
    // store.userStore.clearTokenData();
  });
  // await hydrate('uiStore', store.uiStore);
}

export {initalizeStoreClean};
