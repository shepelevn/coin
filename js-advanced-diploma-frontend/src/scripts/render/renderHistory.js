import stringToDom from 'string-to-dom';

import { formatToRub } from './renderUtils';

import lt from '../../images/svg/lt.svg';
import gt from '../../images/svg/gt.svg';

import '../../sass/history.scss';

import historyHtml from '../../static-html/history.html';

export { initAccountHistory, renderAccountHistory };

let accountHistoryLinesCount;

function initAccountHistory(linesCount) {
  accountHistoryLinesCount = linesCount;
}

async function renderAccountHistory(containerId, accountDataPromise) {
  const historyTableElement = stringToDom(historyHtml);
  const containerDiv = document.getElementById(containerId);

  containerDiv.append(historyTableElement);

  const accountData = await accountDataPromise;

  const transactionsReversed = accountData.transactions.reverse();

  if (transactionsReversed.length > 0) {
    historyTableElement.classList.remove('history_hidden');

    let currentPage = 0;

    if (transactionsReversed.length > accountHistoryLinesCount) {
      renderHistoryPagination(transactionsReversed, currentPage);
    }

    renderHistoryRows(transactionsReversed, currentPage);
  }
}

function renderHistoryPagination(transactions, currentPage) {
  const pagesCount = Math.ceil(transactions.length / accountHistoryLinesCount);

  const firstPaginationIndex = Math.max(0, currentPage - 3);
  const lastPaginationIndex = Math.min(pagesCount - 1, currentPage + 3);

  const paginationDiv = document.getElementById('history-pagination');
  const paginationList = paginationDiv.querySelector('.pagination__list');
  paginationList.innerHTML = '';

  if (currentPage !== 0) {
    addPaginationButton(
      paginationList,
      `
      <svg class="pagination__icon">
        <use xlink:href="${lt.url}"></use>
      </svg>
    `,
      'Перейти назад',
      currentPage - 1,
      transactions
    );
  }

  if (firstPaginationIndex !== 0) {
    addPaginationButton(
      paginationList,
      '...',
      'Перейти дальше назад',
      firstPaginationIndex - 1,
      transactions
    );
  }

  for (let i = firstPaginationIndex; i <= lastPaginationIndex; i++) {
    const paginationItem = addPaginationButton(
      paginationList,
      i + 1,
      i + 1,
      i,
      transactions
    );

    if (i === currentPage) {
      const paginationButton = paginationItem.querySelector(
        '.pagination__button'
      );
      paginationButton.classList.add('pagination__button_active');
      paginationButton.setAttribute('aria-description', 'Выделено');
    }
  }

  if (lastPaginationIndex !== pagesCount - 1) {
    addPaginationButton(
      paginationList,
      '...',
      'Перейти дальше',
      lastPaginationIndex + 1,
      transactions
    );
  }

  if (currentPage !== pagesCount - 1) {
    addPaginationButton(
      paginationList,
      `
      <svg class="pagination__icon">
        <use xlink:href="${gt.url}"></use>
      </svg>
    `,
      'Перейти вперёд',
      currentPage + 1,
      transactions
    );
  }
}

function addPaginationButton(
  container,
  html,
  ariaLabel,
  pageIndex,
  transactions
) {
  const paginationItem = stringToDom(`
    <li class="pagination__item">
      <button class="pagination__button clear-button" aria-label="${ariaLabel}">${html}</button>
    </li>
  `);

  container.append(paginationItem);

  const paginationButton = paginationItem.querySelector('.pagination__button');

  paginationButton.addEventListener('click', () => {
    renderHistoryPagination(transactions, pageIndex);
    renderHistoryRows(transactions, pageIndex);
  });

  return paginationItem;
}

function renderHistoryRows(transactions, currentPage) {
  const historyTable = document.getElementById('history-table');
  const historyTableBody = historyTable.querySelector('tbody');

  historyTableBody.innerHTML = '';

  for (let i = 0; i < accountHistoryLinesCount; i++) {
    if (!transactions[i + accountHistoryLinesCount * currentPage]) {
      return;
    }

    const historyRow = createHistoryRow(
      transactions[i + accountHistoryLinesCount * currentPage]
    );
    historyTableBody.append(historyRow);
  }
}

function createHistoryRow(data) {
  const isPositive = data.amount >= 0 ? true : false;
  const moneyClass = isPositive ? 'money-positive' : 'money-negative';
  const sign = isPositive ? '+ ' : '- ';
  const formattedAmount = sign + formatToRub(Math.abs(data.amount));

  const dateString = new Date(data.date).toLocaleString('ru', {
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  });

  const historyRow = document.createElement('tr');
  historyRow.classList.add('history-table__tr');

  historyRow.innerHTML = `
      <td class="history-table__td">${data.from}</td>
      <td class="history-table__td">${data.to}</td>
      <td class="history-table__td">
        <pre class="${moneyClass}">${formattedAmount}</pre>
      </td>
      <td class="history-table__td">${dateString}</td>
  `;

  return historyRow;
}
