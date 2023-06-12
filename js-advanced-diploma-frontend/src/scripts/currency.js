import {
  fetchCurrencyTypes,
  fetchCurrencies,
  postCurrencyExchange,
} from './serverApi';
import { getToken } from './login';

import { renderCurrency, updateRatesDiv } from './render/renderCurrency';
import {
  commonPayloadErrorsHandler,
  handleServerErrors,
} from './errorHandling';
import addSnackbar from './render/snackbar';

const forUnitTesting = { validateExchange };
export { openCurrency, updateRates, forUnitTesting };

let currencyWebsocketArrayGlobal;

async function openCurrency(currencyWebsocketArray) {
  const token = getToken();

  const currencyTypesPromise = getCurrencyTypes(token);
  const userCurrenciesPromise = getUserCurrencies(token);

  currencyWebsocketArrayGlobal = currencyWebsocketArray;

  renderCurrency({
    currencyTypesPromise,
    userCurrenciesPromise,
    currencyWebsocketArray,
    validateExchangeCallback: validateExchange,
    submitExchangeFormCallback: exchangeCurrency,
  });
}

async function getUserCurrencies(token) {
  const json = await handleServerErrors(() => {
    return fetchCurrencies(token);
  });

  if (json) {
    if (json.error) {
      if (!commonPayloadErrorsHandler(json.error)) {
        addSnackbar('Что-то пошло не так');
      }
    }

    return json.payload;
  }
}

async function getCurrencyTypes() {
  const json = await handleServerErrors(() => {
    return fetchCurrencyTypes();
  });

  return json.payload;
}

function validateExchange({ amount }) {
  let results = {
    amount: '',
    ok: true,
  };

  if (amount === '') {
    results.amount = 'Введите сумму обмена';
    results.ok = false;
  } else if (parseFloat(amount) <= 0) {
    results.amount = 'Сумма обмена должна быть больше нуля';
    results.ok = false;
  } else if (!/^\d+(\.\d)?\d*$/.test(amount)) {
    results.amount = 'Неверный формат суммы';
    results.ok = false;
  }

  return results;
}

async function exchangeCurrency(from, to, amount) {
  let results = {
    amount: '',
    ok: true,
  };

  const token = getToken();
  const json = await handleServerErrors(() => {
    return postCurrencyExchange(
      from.toUpperCase(),
      to.toUpperCase(),
      amount,
      token
    );
  });

  if (json) {
    if (json.error) {
      if (!commonPayloadErrorsHandler(json.error)) {
        switch (json.error) {
          case 'Invalid amount':
            results.amount = 'Неверный формат суммы перевода';
            results.ok = false;
            break;
          case 'Not enough currency':
            results.amount = 'Недостаточно валюты для списания';
            results.ok = false;
            break;
          case 'Overdraft prevented':
            results.amount = 'Сумма перевода превышает баланс';
            results.ok = false;
            break;
          default:
            addSnackbar('Что-то пошло не так', 'error');
            results.ok = false;
        }
      }
    } else {
      addSnackbar('Перевод успешно выполнен', 'success');
      openCurrency(currencyWebsocketArrayGlobal);
    }
  }

  return results;
}

function updateRates(data) {
  updateRatesDiv(data);
}
