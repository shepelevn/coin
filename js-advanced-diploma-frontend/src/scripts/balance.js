import {
  calculateBalanceChartData,
  calculateRatioChartData,
} from './utils/chartData';

import signTransactions from './utils/signTransactions';

import { getAccount } from './account';
import { getToken } from './login';

import renderBalance from './render/renderBalance';

export default openBalance;

async function openBalance(id) {
  const accountDataPromise = createBalanceDataPromise(id);
  const balanceChartDataPromise =
    createBalanceChartDataPromise(accountDataPromise);
  const ratioChartDataPromise = createRatioChartDataPromise(accountDataPromise);

  await renderBalance(
    accountDataPromise,
    balanceChartDataPromise,
    ratioChartDataPromise
  );
}

async function createBalanceDataPromise(id) {
  const token = getToken();

  const accountData = await getAccount(id, token);

  signTransactions(accountData);

  return accountData;
}

async function createBalanceChartDataPromise(accountDataPromise) {
  const accountData = await accountDataPromise;

  return calculateBalanceChartData(
    accountData.balance,
    accountData.transactions,
    12
  );
}

async function createRatioChartDataPromise(accountDataPromise) {
  const accountData = await accountDataPromise;

  return calculateRatioChartData(accountData.transactions, 12);
}
