import { getStore } from '../stores/initStore';
import { sentryLog } from './monitoring';

const addNotification = (level: 'info' | 'success' | 'error', title: string, text: string, autoDismiss = 0) => {
  const store = getStore();
  if (level === 'error') {
    const e = new Error(text);
    sentryLog('exception', e);
  }
  store.uiStore.addNotification(level, title, text, 'tr', autoDismiss);
};

const setGlobalLoading = (loading: boolean) => {
  const store = getStore();
  // store.changeGlobalLoadingCounter(loading);
};

export { addNotification, setGlobalLoading };
