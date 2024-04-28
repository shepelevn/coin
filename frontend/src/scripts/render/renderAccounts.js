import stringToDom from 'string-to-dom';

import { setBlockLoading, unsetBlockLoading } from './renderMain';
import initSelect from './select';
import { formatToRub, formatDate } from './renderUtils';

import accountsHtml from '../../static-html/accounts.html';

export { renderAccounts, renderAccountsCards };

function renderAccounts({ createAccountCallback, changeSortCallback }) {
  addStaticAccountsHtml();

  initSortSelect(changeSortCallback);

  initCreateAccountButton(createAccountCallback);
}

function initSortSelect(changeSortCallback) {
  const sortSelect = document.getElementById('accounts-sort');
  initSelect(sortSelect);

  sortSelect.addEventListener('change', () => {
    changeSortCallback(sortSelect.value);
  });

  changeSortCallback(sortSelect.value);
}

function initCreateAccountButton(createAccountCallback) {
  const createAccountButton = document.getElementById('new-account');

  createAccountButton.addEventListener('click', createAccountCallback);
}

async function renderAccountsCards(accountsArrayPromise) {
  setAccountsLoading();
  const accountsArray = await accountsArrayPromise;
  unsetAccountsLoading();

  const accountsList = document.getElementById('accounts-list');
  accountsList.innerHTML = '';

  for (const accountData of accountsArray) {
    accountsList.append(createAccountCard(accountData));
  }
}

function createAccountCard(data) {
  const balance = formatToRub(data.balance);

  let transactionLabel = '';
  let date = '';
  let timeElementString = '';

  if (data.transactions.length > 0) {
    transactionLabel = 'Последняя&nbsp;транзакция:';
    const datetime = data.transactions[0].date;
    date = formatDate(datetime);

    timeElementString = `
      <time class="account-card__transaction-time"
        datetime="${datetime}">
        ${date}
      </time>
    `;
  }

  const accountCard = stringToDom(`
    <li class="accounts__item account-card">
      <h2 class="account-card__id">${data.account}</h2>
      <p class="account-card__balance">${balance}</p>
      <div class="account-card__bottom">
        <div class="account-card__transaction">
          <p class="account-card__transaction-title">
          ${transactionLabel}
          </p>
          ${timeElementString}
        </div>
        <a class="button-primary" href="/account&id=${data.account}" data-navigo>Открыть</a>
      </div>
    </li>
  `);

  return accountCard;
}

function addStaticAccountsHtml() {
  const mainDiv = document.getElementById('main');
  mainDiv.innerHTML = accountsHtml;
}

function setAccountsLoading() {
  setBlockLoading('accounts-loading');
}

function unsetAccountsLoading() {
  unsetBlockLoading('accounts-loading');
}
