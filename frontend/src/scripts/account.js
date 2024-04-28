import { calculateBalanceChartData } from './utils/chartData';
import signTransactions from './utils/signTransactions';

import { navigo } from './main';
import {
  commonPayloadErrorsHandler,
  handleServerErrors,
  openNotFound,
} from './errorHandling';
import { fetchAccount, postTransaction } from './serverApi';
import { getToken } from './login';

import addSnackbar from './render/snackbar';
import renderAccount from './render/renderAccount';

export { openAccount, getAccount };

async function openAccount(id) {
  const accountData = createAccountData(id);
  const balanceChartData = createAccountChartData(accountData);

  await renderAccount(
    accountData,
    balanceChartData,
    getIdAutocompletions(),
    validateTransaction,
    transferFunds
  );
}

async function createAccountData(id) {
  const token = getToken();

  const accountData = await getAccount(id, token);

  signTransactions(accountData);

  return accountData;
}

async function createAccountChartData(accountDataPromise) {
  const accountData = await accountDataPromise;

  return calculateBalanceChartData(
    accountData.balance,
    accountData.transactions,
    6
  );
}

async function getAccount(id, token) {
  const json = await handleServerErrors(() => {
    return fetchAccount(id, token);
  });

  if (json) {
    if (json.error) {
      if (!commonPayloadErrorsHandler(json.error)) {
        switch (json.error) {
          case 'No such account':
            openNotFound();
            break;
          default:
            addSnackbar('Что-то пошло не так', 'error');
        }
      }
    } else {
      return json.payload;
    }
  }
}

function validateTransaction({ receiver, amount }) {
  let results = {
    receiver: '',
    amount: '',
    ok: true,
  };

  if (receiver === '') {
    results.receiver = 'Введите номер счёта получателя';
    results.ok = false;
  } else if (!/^\d*$/.test(receiver)) {
    results.receiver = 'Номер счёта может состоять только из цифр';
    results.ok = false;
  }

  if (amount === '') {
    results.amount = 'Введите сумму перевода';
    results.ok = false;
  } else if (!/^\d+.?\d{0,2}$/.test(amount)) {
    results.amount = 'Неверный формат суммы';
    results.ok = false;
  } else if (parseInt(amount) <= 0) {
    results.amount = 'Сумма перевода должна быть больше нуля';
    results.ok = false;
  }

  return results;
}

async function transferFunds(sender, receiver, amount) {
  let results = {
    receiver: '',
    amount: '',
    ok: true,
  };

  const token = getToken();
  const json = await handleServerErrors(() => {
    return postTransaction(sender, receiver, amount, token);
  });

  if (json) {
    if (json.error) {
      if (!commonPayloadErrorsHandler(json.error)) {
        switch (json.error) {
          case 'Invalid account from':
            navigo.navigate('/');
            break;
          case 'Invalid account to':
            results.receiver = 'Данного счёта не существует';
            results.ok = false;
            break;
          case 'Invalid amount':
            results.amount = 'Неверно указана сумма перевода';
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
      addSnackbar('Перевод выполнен успешно', 'success');
      addIdAutocompletion(receiver);
      openAccount(sender);
    }
  }

  return results;
}

function addIdAutocompletion(receiver) {
  let savedIds = JSON.parse(localStorage.getItem('accountsAutocompletions'));
  savedIds = savedIds ? savedIds : [];

  if (!savedIds.includes(receiver)) {
    savedIds.push(receiver);
  }

  localStorage.setItem('accountsAutocompletions', JSON.stringify(savedIds));
}

function getIdAutocompletions() {
  let savedIds = JSON.parse(localStorage.getItem('accountsAutocompletions'));
  savedIds = savedIds ? savedIds : [];

  return savedIds;
}
