import stringToDom from 'string-to-dom';

import { formatToRub } from './renderUtils';

import '../../sass/account-header.scss';

export default renderAccountHeader;

function renderAccountHeader(data, goBackPath) {
  const mainDiv = document.getElementById('main');
  const accountHeader = createAccountHeader(data, goBackPath);

  mainDiv.prepend(accountHeader);
}

function createAccountHeader(data, goBackPath) {
  return stringToDom(`
    <section class="account-header">
      <div class="account-header__container container">
        <div class="account-header__top">
          <h1 class="account-header__title h1" tabindex="-1">Просмотр счёта</h1>
          <a class="account-header__back button-primary-icon" href="${goBackPath}" data-navigo>Вернуться назад</a>
        </div>
        <div class="account-header__bottom">
          <h2 class="account-header__id">
            № ${data.account}
          </h2>
          <p class="account-header__balance">
          <span class="account-header__balance-title">Баланс</span>
            ${formatToRub(data.balance)}
          </p>
        </div>
      </div>
    </section>
  `);
}
