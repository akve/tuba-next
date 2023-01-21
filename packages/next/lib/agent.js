import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import i18n from '../lib/i18n';

import { addNotification, setGlobalLoading } from '../utils/notifications';

// import commonStore from './stores/commonStore';
import I18n from './i18n';

import config from './config';
import isFunction from 'lodash/isFunction';

const superagent = superagentPromise(_superagent, global.Promise);

const notification = {
  show: (text, status) => {
    addNotification('error', i18n.t('Error'), text);
    //console.log(status, text);
  },
};

const handleErrors = (err, r, skipErrors, skipBlock) => {
  if (err && !skipBlock) setGlobalLoading(false);
  // console.log('HE', JSON.stringify(err));
  if (err && err.toString().indexOf('terminated') >= 0) {
    notification.show(I18n.t('Error connecting to the server'), 'error');
  }

  let text = 'Unknown error connecting to the server';
  if (
    !skipErrors &&
    err &&
    err.response &&
    err.response.body &&
    err.response.body.error &&
    err.response.body.error.message
  ) {
    text = err.response.body.error.message;
    notification.show(text, 'error');
    return err;
  }
  if (!skipErrors && err && err.toString().toLowerCase().indexOf('unsuccessful') >= 0) {
    notification.show(I18n.t('Error finishing server request'), 'error');
  }
  return err;
};

const startRequest = (inner) => {
  setGlobalLoading(true);
  if (!inner || !isFunction(inner)) return inner;
  return inner();
};

const responseBody = (res) => {
  setGlobalLoading(false);
  return res.body;
};

const responseBodyNoBlock = (res) => {
  return res.body;
};

let commonStore = null;

const init = (store) => {
  commonStore = store;
};

const tokenPlugin = (req) => {
  if (commonStore.uiStore.session) {
    req.set('token', `${commonStore.uiStore.session}`);
  }
};

const convertToGetParams = (params) =>
  Object.keys(params).reduce((total, currentValue, currentIndex, arr) => {
    let param = JSON.stringify(params[currentValue]);
    if (!param) {
      return total;
    }
    if (param.indexOf('{') < 0 && param.indexOf('[') < 0) param = param.replace('"', '').replace('"', '');
    return `${total}${currentValue}=${param}&`;
  }, '?');

const requests = {
  del: (url) =>
    startRequest(superagent.del(`${config().API_URL}${url}`).use(tokenPlugin).end(handleErrors).then(responseBody)),
  getWithoutBlock: (url, skipErrors) =>
    superagent
      .get(`${config().API_URL}${url}`)
      .use(tokenPlugin)
      .end((e, r) => handleErrors(e, r, skipErrors, true))
      .then(responseBodyNoBlock),
  get: (url, skipErrors) =>
    startRequest(
      superagent
        .get(`${config().API_URL}${url}`)
        .use(tokenPlugin)
        .end((e, r) => handleErrors(e, r, skipErrors))
        .then(responseBody)
    ),
  put: (url, body, skipErrors) =>
    startRequest(
      superagent
        .put(`${config().API_URL}${url}`, body)
        .use(tokenPlugin)
        .end((e, r) => handleErrors(e, r, skipErrors))
        .then(responseBody)
    ),
  post: (url, body, skipErrors) =>
    startRequest(
      superagent
        .post(`${config().API_URL}${url}`, body)
        .use(tokenPlugin)
        .end((e, r) => handleErrors(e, r, skipErrors))
        .then(responseBody)
    ),
};

const Auth = {
  current: () => requests.getWithoutBlock('/auth/session'),
  getCart: (userId) => requests.getWithoutBlock(`/cart?user=${userId || ''}`),
  putToCart: (data) => requests.put('/cart', data),
  login: (loginData) => requests.post('/auth/login', loginData, false),
  register: (userData) => requests.post('/auth/register', userData, true),
  logout: () => requests.post('/auth/logout'),
  reset: (email) => requests.post('/auth/reset', { email }, true),
};

const CrudApi = (prefix) => {
  return {
    getObjects: (data) => requests.get(`/${prefix}`, data),
    getObject: (id) => requests.get(`/${prefix}/${id}`),
  };
};

export default {
  requests,
  init,
  Auth,
  CrudApi,
  config,
  convertToGetParams,
};
