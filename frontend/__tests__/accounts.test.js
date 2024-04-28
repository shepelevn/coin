import { forUnitTesting as accountsFunctions } from '../src/scripts/accounts';
const { sortAccounts } = accountsFunctions;

function toBeSortedByField(inArray, fieldname) {
  for (let i = 0; i < inArray.length - 1; i++) {
    if (!inArray[i][fieldname]) {
      return {
        message: `Didn't find property ${fieldname} in array`,
        pass: false,
      };
    }

    if (inArray[i][fieldname] < inArray[i + 1][fieldname]) {
      return { message: `Array is not sorted by ${fieldname}`, pass: false };
    }
  }

  return { pass: true };
}

function toBeSortedByTransactionDate(inArray) {
  for (let i = 0; i < inArray.length - 1; i++) {
    const aDate = new Date(inArray[i].transactions[0].date);
    const bDate = new Date(inArray[i + 1].transactions[0].date);

    if (aDate < bDate) {
      return {
        message: 'Array is not sorted by transaction date',
        pass: false,
      };
    }
  }

  return { pass: true };
}

expect.extend({
  toBeSortedByField,
  toBeSortedByTransactionDate,
});

let accountsArray = [
  {
    account: '999999999999999999999999991',
    balance: 4.01,
    transactions: [
      {
        amount: 1,
        date: '2021-09-02T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ],
  },
  {
    account: '999999999999999999999999992',
    balance: 4,
    transactions: [
      {
        amount: 1,
        date: '2021-09-05T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ],
  },
  {
    account: '999999999999999999999999993',
    balance: 4,
    transactions: [
      {
        amount: 1,
        date: '2021-09-04T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ],
  },
  {
    account: '999999999999999999999999994',
    balance: 1,
    transactions: [
      {
        amount: 1,
        date: '2021-09-01T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ],
  },
  {
    account: '999999999999999999999999995',
    balance: 3,
    transactions: [
      {
        amount: 1,
        date: '2021-09-03T23:05:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ],
  },
];

describe('Проверка функции sortAccounts', () => {
  test('Проверка сортировки пустого массива ', () => {
    expect(sortAccounts([], 'id')).toEqual([]);
    expect(sortAccounts([], 'balance')).toEqual([]);
    expect(sortAccounts([], 'transaction')).toEqual([]);
    expect(sortAccounts([])).toEqual([]);
  });

  test('Проверка сортировки по id ', () => {
    expect(sortAccounts(accountsArray, 'id')).toBeSortedByField('account');
    expect(sortAccounts(accountsArray, 'balance')).not.toBeSortedByField(
      'account'
    );
  });

  test('Проверка сортировки по балансу ', () => {
    expect(sortAccounts(accountsArray, 'balance')).toBeSortedByField('balance');
    expect(sortAccounts(accountsArray, 'id')).not.toBeSortedByField('balance');
  });

  test('Проверка сортировки по последней транзакции ', () => {
    expect(
      sortAccounts(accountsArray, 'transaction')
    ).toBeSortedByTransactionDate();
    expect(sortAccounts(accountsArray, 'id')).not.toBeSortedByTransactionDate();
  });
});
