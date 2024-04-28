import { setBlockLoading, unsetBlockLoading } from './renderMain';

import renderAccountHeader from './renderAccountHeader';
import { drawBalanceChart, drawRatioChart } from './renderChart';
import { initAccountHistory, renderAccountHistory } from './renderHistory';

import balanceHtml from '../../static-html/balance.html';

export default renderBalance;

const ACCOUNT_HISTORY_LINES_COUNT = 25;

async function renderBalance(
  accountDataPromise,
  balanceChartDataPromise,
  ratioChartDataPromise
) {
  addStaticBalanceHtml();

  setBalanceChartLoading();
  setRatioChartLoading();
  const accountData = await accountDataPromise;
  const balanceChartData = await balanceChartDataPromise;
  const ratioChartData = await ratioChartDataPromise;
  unsetBalanceChartLoading();
  unsetRatioChartLoading();

  renderAccountHeader(accountData, `/account&id=${accountData.account}`);

  initBalanceChart(balanceChartData);
  initRatioChart(ratioChartData);

  initAccountHistory(ACCOUNT_HISTORY_LINES_COUNT);
  renderAccountHistory('balance-container', accountData);
}

function addStaticBalanceHtml() {
  const mainDiv = document.getElementById('main');
  mainDiv.innerHTML = balanceHtml;
}

function initBalanceChart(chartData) {
  const balanceChartCanvas = document.getElementById('balance-dynamic');

  drawBalanceChart(
    balanceChartCanvas,
    chartData.months,
    chartData.balance,
    chartData.ticks
  );
}

function initRatioChart(chartData) {
  const ratioChartCanvas = document.getElementById('balance-ratio');

  drawRatioChart(
    ratioChartCanvas,
    chartData.months,
    chartData.expense,
    chartData.income,
    chartData.ticks
  );
}

function setBalanceChartLoading() {
  setBlockLoading('balance-chart-loading');
}

function setRatioChartLoading() {
  setBlockLoading('ratio-chart-loading');
}

function unsetBalanceChartLoading() {
  unsetBlockLoading('balance-chart-loading');
}

function unsetRatioChartLoading() {
  unsetBlockLoading('ratio-chart-loading');
}
