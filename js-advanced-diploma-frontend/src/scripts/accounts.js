import {
  handleServerErrors,
  commonPayloadErrorsHandler,
} from './errorHandling';
import { fetchAccounts, postNewAccount } from './serverApi';
import { getToken } from './login';

import { renderAccounts, renderAccountsCards } from './render/renderAccounts';
import addSnackbar from './render/snackbar';

export default openAccounts;
const forUnitTesting = { sortAccounts };
export { forUnitTesting };

let accountsArrayGlobal = [];
let sortMethodGlobal;

async function openAccounts() {
  renderAccounts({
    createAccountCallback: createAccount,
    changeSortCallback: changeSort,
  });

  accountsArrayGlobal = await getAccounts();

  renderAccountsCards(sortAccounts(accountsArrayGlobal, sortMethodGlobal));
}

function changeSort(value) {
  sortMethodGlobal = value;

  renderAccountsCards(sortAccounts(accountsArrayGlobal, sortMethodGlobal));
}

async function createAccount() {
  const token = getToken();
  const json = await handleServerErrors(() => {
    return postNewAccount(token);
  });

  if (json && json.error) {
    if (!commonPayloadErrorsHandler(json.error)) {
      addSnackbar('Что-то пошло не так', 'error');
    }
  }

  addSnackbar('Новый аккаунт успешно создан', 'success');

  accountsArrayGlobal = await getAccounts();

  renderAccountsCards(sortAccounts(accountsArrayGlobal, sortMethodGlobal));
}

async function getAccounts() {
  const token = getToken();
  const json = await handleServerErrors(() => {
    return fetchAccounts(token);
  });

  if (json) {
    if (json.error === '') {
      return json.payload;
    } else {
      if (!commonPayloadErrorsHandler(json.error)) {
        addSnackbar('Что-то пошло не так', 'error');
      }
    }
  }

  return null;
}

function sortAccounts(accounts, method) {
  switch (method) {
    case 'id':
      return accounts.sort((a, b) => {
        if (a.account > b.account) return -1;
        else if (a.account < b.account) return 1;
        else return 0;
      });
    case 'balance':
      return accounts.sort((a, b) => {
        return parseFloat(b.balance) - parseFloat(a.balance);
      });
    case 'transaction':
      return accounts.sort((a, b) => {
        const aDate =
          a.transactions.length > 0 ? Date.parse(a.transactions[0].date) : 0;
        const bDate =
          b.transactions.length > 0 ? Date.parse(b.transactions[0].date) : 0;

        return bDate - aDate;
      });
    default:
      return accounts;
  }
}
