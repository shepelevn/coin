import stringToDom from 'string-to-dom';

import { navigo } from '../main';

import '../../resources/css/normalize.css';
import '../../sass/main.scss';

import '../../sass/login.scss';
import '../../sass/accounts.scss';
import '../../sass/account.scss';
import '../../sass/balance.scss';
import '../../sass/currency.scss';
import '../../sass/atm-map.scss';

import '../../sass/not-found.scss';

import createHeader from './renderHeader';

import notFoundHtml from '../../static-html/404.html';

export {
  renderMain,
  beforeChangePage,
  afterChangePage,
  setBlockLoading,
  unsetBlockLoading,
  render404,
};

function renderMain() {
  document.body.innerHTML = '';

  const header = createHeader();
  document.body.append(header);

  const mainDiv = stringToDom('<main class="main" id="main"></main>');
  document.body.append(mainDiv);

  initSnackbars();
}

function beforeChangePage(isAuthorized) {
  if (isAuthorized) {
    document.documentElement.style.setProperty(
      '--header-links-display',
      'block'
    );
  } else {
    document.documentElement.style.setProperty(
      '--header-links-display',
      'none'
    );
  }
}

function afterChangePage() {
  navigo.updatePageLinks();

  const titleElement = document.querySelector('h1');

  if (titleElement) {
    titleElement.focus();
  } else {
    const logoLink = document.querySelector('.header__logo');
    logoLink.focus();
  }
}

function initSnackbars() {
  const snackbarContainer = stringToDom(`
    <div class="snackbar-container" id="snackbar-container" aria-live="polite">
    </div>
  `);

  document.body.append(snackbarContainer);
}

function render404() {
  const mainDiv = document.getElementById('main');
  mainDiv.innerHTML = notFoundHtml;
}

function setBlockLoading(id) {
  const loadingOverlay = document.getElementById(id);

  loadingOverlay.classList.add('round-block__loading_visible', 'loading');
}

function unsetBlockLoading(id) {
  const loadingOverlay = document.getElementById(id);

  loadingOverlay.classList.remove('round-block__loading_visible', 'loading');
}
