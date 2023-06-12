const forUnitTesting = {
  calculateBalanceChartData,
  calculateRatioChartData,
  sumTransactions,
  createPercentageData,
  maxRatio,
};
export { calculateBalanceChartData, calculateRatioChartData, forUnitTesting };

const TICK_STEP = 1000;

function calculateBalanceChartData(
  balance,
  transactions,
  chartLength,
  date = new Date()
) {
  const startOfMonth = createStartOfMonthDate(date);

  let balanceHistory = {
    balance: [balance],
    months: [createMonthString(Date.now())],
  };

  for (let i = transactions.length - 1; i >= 0; ) {
    if (Date.parse(transactions[i].date) < startOfMonth) {
      if (balanceHistory.balance.length >= chartLength) {
        break;
      }

      startOfMonth.setMonth(startOfMonth.getMonth() - 1);

      balanceHistory.balance.unshift(Math.round(balance * 100) / 100);
      balanceHistory.months.unshift(createMonthString(startOfMonth));
    } else {
      balance -= transactions[i].amount;
      i--;
    }
  }

  const min =
    Math.round(Math.min(...balanceHistory.balance) / TICK_STEP) * TICK_STEP;
  const max =
    Math.round(Math.max(...balanceHistory.balance) / TICK_STEP) * TICK_STEP;
  balanceHistory.ticks = [min, max];

  return balanceHistory;
}

function calculateRatioChartData(transactions, chartLength, date = new Date()) {
  const startOfMonth = createStartOfMonthDate(date);

  let transactionsRatioData = {
    income: [],
    expense: [],
    months: [],
  };

  let maximumChartLengthReached = false;

  let income = 0;
  let expense = 0;

  for (let i = transactions.length - 1; i >= 0; ) {
    if (Date.parse(transactions[i].date) < startOfMonth) {
      transactionsRatioData.income.unshift(Math.round(income * 100) / 100);
      transactionsRatioData.expense.unshift(Math.round(expense * 100) / 100);
      transactionsRatioData.months.unshift(createMonthString(startOfMonth));

      startOfMonth.setMonth(startOfMonth.getMonth() - 1);

      income = 0;
      expense = 0;

      if (transactionsRatioData.months.length >= chartLength) {
        maximumChartLengthReached = true;
        break;
      }
    } else {
      const amount = transactions[i].amount;
      if (amount >= 0) {
        income += amount;
      } else {
        expense += Math.abs(amount);
      }

      i--;
    }
  }

  if (!maximumChartLengthReached) {
    transactionsRatioData.income.unshift(Math.round(income * 100) / 100);
    transactionsRatioData.expense.unshift(Math.round(expense * 100) / 100);
    transactionsRatioData.months.unshift(createMonthString(startOfMonth));
  }

  const addedData = sumTransactions(transactionsRatioData);
  const percentageData = createPercentageData(transactionsRatioData, addedData);
  const max = Math.max(...addedData);
  const maxRatioTick = maxRatio(addedData, percentageData);

  transactionsRatioData.ticks = [
    Math.round(max / TICK_STEP) * TICK_STEP,
    Math.round(maxRatioTick / TICK_STEP) * TICK_STEP,
  ];

  return transactionsRatioData;
}

function createStartOfMonthDate(date) {
  const startOfMonth = date;
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return startOfMonth;
}

function createMonthString(date) {
  let formatter = new Intl.DateTimeFormat('ru', {
    month: 'long',
  });

  return formatter.format(new Date(date));
}

function sumTransactions(ratioData) {
  const addedData = [];

  for (const index in ratioData.income) {
    addedData.push(ratioData.income[index] + ratioData.expense[index]);
  }

  return addedData;
}

function createPercentageData(data, addedData) {
  const percentageData = [];

  for (const index in data.income) {
    if (addedData[index] !== 0) {
      percentageData.push(data.income[index] / addedData[index]);
    } else {
      percentageData.push(0);
    }
  }

  return percentageData;
}

function maxRatio(addedData, percentageData) {
  let maxRatio = 0;

  for (const i in addedData) {
    const smallestPercentage =
      percentageData[i] <= 0.5 ? percentageData[i] : 1 - percentageData[i];

    const ratio = addedData[i] * smallestPercentage;
    if (ratio > maxRatio) maxRatio = ratio;
  }

  return Math.round(maxRatio);
}
