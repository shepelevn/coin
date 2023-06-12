import stringToDom from 'string-to-dom';

import { setBlockLoading, unsetBlockLoading } from './renderMain';
import { initFormValidation } from './input';
import initSelect from './select';

import iconUp from '../../images/currency/rate-up.svg';
import iconDown from '../../images/currency/rate-down.svg';

import currencyHtml from '../../static-html/currency.html';

export { renderCurrency, updateRatesDiv, MAX_RATES_ITEMS };

const MAX_RATES_ITEMS = 22;

async function renderCurrency({
  currencyTypesPromise,
  userCurrenciesPromise,
  currencyWebsocketArray,
  validateExchangeCallback,
  submitExchangeFormCallback,
}) {
  addStaticCurrencyHtml();

  setCurrencyBlockLoading();
  const currencyTypes = await currencyTypesPromise;
  const userCurrencies = await userCurrenciesPromise;
  unsetCurrencyBlockLoading();

  renderUserCurrencyBalance(userCurrencies);

  initExchangeForm(
    currencyTypes,
    validateExchangeCallback,
    submitExchangeFormCallback
  );

  initRatesDiv(currencyWebsocketArray);
}

async function renderUserCurrencyBalance(userCurrencies) {
  const balanceDiv = document.getElementById('currency-balance-list');

  for (const balanceDataItem of Object.values(userCurrencies)) {
    const balanceRow = createCurrencyBalanceRow(balanceDataItem);

    if (balanceRow) {
      balanceDiv.append(balanceRow);
    }
  }
}

function createCurrencyBalanceRow(data) {
  if (data.amount === 0) {
    return null;
  }

  return stringToDom(`
    <li class="currency-list__item">
      <p class="currency-list__name">${data.code}</p>
      <div class="currency-list__leader"></div>
      <p class="currency-list__price">${data.amount}</p>
    </li>
  `);
}

function addStaticCurrencyHtml() {
  const mainDiv = document.getElementById('main');
  mainDiv.innerHTML = currencyHtml;
}

async function initExchangeForm(
  currencyTypes,
  exchangeValidationCallback,
  exchangeSubmitCallback
) {
  const exchangeForm = document.getElementById('exchange-form');

  initExchangeSelect('exchange-from', currencyTypes);
  initExchangeSelect('exchange-to', currencyTypes);

  const submitExchange = function (inputsValues) {
    return exchangeSubmitCallback(
      inputsValues.from,
      inputsValues.to,
      inputsValues.amount
    );
  };

  initFormValidation(
    exchangeForm,
    exchangeValidationCallback,
    submitExchange,
    'exchange-loading'
  );
}

function initExchangeSelect(selectId, currencyTypes) {
  const select = document.getElementById(selectId);

  for (const currencyType of currencyTypes) {
    select.innerHTML += `<option class="select-primary__option" value="${currencyType}">${currencyType}</option>`;
  }

  initSelect(select);
}

function initRatesDiv(ratesArray) {
  const ratesDiv = document.getElementById('currency-rates');

  if (ratesDiv) {
    for (let i = 0; i < MAX_RATES_ITEMS && i < ratesArray.length; i++) {
      ratesDiv.innerHTML += createRatesItemHtmlString(ratesArray[i]);
    }
  }
}

function createRatesItemHtmlString(data) {
  let iconSource = '';
  let ariaDescription = '';

  if (data.change > 0) {
    iconSource = iconUp;
    ariaDescription = 'Повышение';
  } else if (data.change < 0) {
    iconSource = iconDown;
    ariaDescription = 'Понижение';
  }

  return `
    <li class="currency-list__item">
      <p class="currency-list__name">${data.from}/${data.to}</p>
      <div class="currency-list__leader"></div>
      <div class="currency-list__price">
        <p>
          ${data.rate}
        </p>
        <img src="${iconSource}" alt="${ariaDescription}">
      </div>
    </li>
  `;
}

function updateRatesDiv(data) {
  const ratesList = document.getElementById('currency-rates');

  if (ratesList) {
    ratesList.innerHTML += createRatesItemHtmlString(data);

    if (ratesList.children.length > MAX_RATES_ITEMS) {
      const firstItem = ratesList.querySelector(
        '.currency-list__item:first-child'
      );
      firstItem.remove();
    }
  }
}

function setCurrencyBlockLoading() {
  setBlockLoading('currency-loading');
}

function unsetCurrencyBlockLoading() {
  unsetBlockLoading('currency-loading');
}
