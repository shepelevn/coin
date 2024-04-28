import stringToDom from 'string-to-dom';

import { initFormValidation, initSearchInput } from './input';
import { setBlockLoading, unsetBlockLoading } from './renderMain';

import renderAccountHeader from './renderAccountHeader';
import { drawBalanceChart } from './renderChart';
import { initAccountHistory, renderAccountHistory } from './renderHistory';

import accountHtml from '../../static-html/account.html';

export default renderAccount;

const ACCOUNT_HISTORY_LINES_COUNT = 10;

async function renderAccount(
  accountDataPromise,
  chartDataPromise,
  autocompletions,
  transactionValidationCallback,
  transactionSubmitCallback
) {
  addStaticAccountHtml();

  setChartLoading();

  initAccountHistory(ACCOUNT_HISTORY_LINES_COUNT);
  renderAccountHistory('account-container', accountDataPromise);

  const accountData = await accountDataPromise;
  const balanceChartData = await chartDataPromise;

  unsetChartLoading();

  renderAccountHeader(accountData, '/accounts');

  initTransactionForm(
    accountData,
    autocompletions,
    transactionValidationCallback,
    transactionSubmitCallback
  );

  initChart(balanceChartData);

  initBalanceLinks(accountData.account);
}

function addStaticAccountHtml() {
  const mainDiv = document.getElementById('main');
  mainDiv.innerHTML = accountHtml;
}

function initTransactionForm(
  accountData,
  autocompleteList,
  transactionValidationCallback,
  transactionSubmitCallback
) {
  const transactionForm = document.getElementById('transaction-form');

  initSearchInput('transaction-receiver', autocompleteList);

  const submitTransaction = function (inputsValues) {
    return transactionSubmitCallback(
      accountData.account,
      inputsValues.receiver,
      inputsValues.amount
    );
  };

  initFormValidation(
    transactionForm,
    transactionValidationCallback,
    submitTransaction,
    'transaction-loading'
  );
}

function initChart(chartData) {
  const balanceChartCanvas = document.getElementById('account-chart');

  drawBalanceChart(
    balanceChartCanvas,
    chartData.months,
    chartData.balance,
    chartData.ticks
  );
}

function initBalanceLinks(id) {
  const chartLink = document.getElementById('chart-link');
  chartLink.setAttribute('href', `/balance&id=${id}`);

  const tableElement = document.getElementById('history-table');

  if (tableElement) {
    const paginationDiv = document.getElementById('history-pagination');
    const tableParent = tableElement.parentElement;
    const link = stringToDom(`
    <a class="history__link" href="/balance&id=${id}" data-navigo></a>
  `);

    link.append(tableElement);
    tableParent.append(link);
    tableParent.append(paginationDiv);
  }
}

function setChartLoading() {
  setBlockLoading('chart-block-loading');
}

function unsetChartLoading() {
  unsetBlockLoading('chart-block-loading');
}
