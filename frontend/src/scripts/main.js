import Navigo from 'navigo';

import initExchangeRateStream from './websocketExchangeRate';

import { initErrorHandling } from './errorHandling';

import {
  renderMain,
  beforeChangePage,
  afterChangePage,
} from './render/renderMain';

import { checkAuthorization, logout } from './login';
import openAccounts from './accounts';
import { openAccount } from './account';
import openBalance from './balance';
import { openCurrency } from './currency';
import openMap from './map';
import { openNotFound } from './errorHandling';

const navigo = new Navigo('/');
export { navigo, initMain };

function initMain() {
  renderMain();

  initNavigo();

  initErrorHandling();
}

function initNavigo() {
  navigo.on('/login', function () {
    beforeChangePage(false);

    logout();

    afterChangePage();
  });

  navigo.on('/', function () {
    navigo.navigate('/accounts');
  });

  navigo.on('/accounts', async function () {
    if (checkAuthorization()) {
      beforeChangePage(true);

      await openAccounts();

      afterChangePage();
    }
  });

  navigo.on('/account&id=:id', async function (navigoObject) {
    if (checkAuthorization()) {
      beforeChangePage(true);

      await openAccount(navigoObject.data.id);

      afterChangePage();
    }
  });

  navigo.on('/balance&id=:id', async function (navigoObject) {
    if (checkAuthorization()) {
      beforeChangePage(true);

      await openBalance(navigoObject.data.id);

      afterChangePage();
    }
  });

  const currencyWebsocketArray = initExchangeRateStream();
  navigo.on('/currency', function () {
    if (checkAuthorization()) {
      beforeChangePage(true);

      openCurrency(currencyWebsocketArray);

      afterChangePage();
    }
  });

  navigo.on('/map', function () {
    if (checkAuthorization()) {
      beforeChangePage(true);

      openMap();

      afterChangePage();
    }
  });

  navigo.notFound(() => {
    openNotFound();
  });

  navigo.resolve();

  const mainDiv = document.getElementById('main');
  const observerConfig = { childList: true, subtree: true };
  const observer = new MutationObserver(() => {
    navigo.updatePageLinks();
  });

  observer.observe(mainDiv, observerConfig);
}

// eslint-disable-next-line no-undef
if (module.hot) {
  // eslint-disable-next-line no-undef
  module.hot.accept();
}
