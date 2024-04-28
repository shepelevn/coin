import { forUnitTesting as moduleFunctions } from '../src/scripts/utils/chartData';
const {
  calculateBalanceChartData,
  calculateRatioChartData,
  createPercentageData,
  sumTransactions,
  maxRatio,
} = moduleFunctions;

const testDate = new Date('2023-06-08T08:51:42+00:00');

describe('Проверка функции sumTransactions', () => {
  test('Проверка случая пустого массива', () => {
    const emptyRatioData = {
      income: [],
      expense: [],
    };

    expect(sumTransactions(emptyRatioData)).toEqual([]);
  });

  test('Проверка на корректную работу', () => {
    const ratioData = {
      income: [0, 1, 1.11, 666.666],
      expense: [0, -1, -0.11, 333.334],
    };

    const expectedData = [0, 0, 1.0, 1000.0];

    expect(sumTransactions(ratioData)).toEqual(expectedData);
  });
});

describe('Проверка функции createPercentageData', () => {
  test('Проверка случая пустого массива', () => {
    const ratioData = {
      income: [],
      expense: [],
    };

    const addedData = [];
    const expectedData = [];

    expect(createPercentageData(ratioData, addedData)).toEqual(expectedData);
  });

  test('Проверка корректной работы функции', () => {
    const ratioData = {
      income: [0, 1, 1, 666.666],
      expense: [0, 1, 3, 333.334],
    };

    const addedData = sumTransactions(ratioData);

    const expectedData = [0, 1 / 2, 1 / 4, 666.666 / 1000];

    expect(createPercentageData(ratioData, addedData)).toEqual(expectedData);
  });
});

describe('Проверка функции maxRatio', () => {
  test('Проверка случая пустого массива', () => {
    expect(maxRatio([], [])).toBe(0);
  });

  test('Проверка корректной работы функции', () => {
    const addedData = [100, 1000, 799];
    const percentageData = [0.1, 0.4, 0.5];

    expect(maxRatio(addedData, percentageData)).toBe(400);
  });
});

describe('Проверка функции calculateBalanceChartData', () => {
  const transactions = [
    {
      amount: -10 * 1000,
      date: '2022-01-01T01:00:00.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -10 * 1000,
      date: '2023-01-01T01:00:00.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -20 * 1000,
      date: '2023-01-15T01:00:00.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -40 * 1000,
      date: '2023-01-30T23:55:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -80 * 1000,
      date: '2023-02-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 320 * 1000,
      date: '2023-02-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 80 * 1000,
      date: '2023-03-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 80 * 1000,
      date: '2023-05-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -160 * 1000,
      date: '2023-05-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 10 * 1000,
      date: '2023-05-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 20 * 1000,
      date: '2023-06-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 40 * 1000,
      date: '2023-06-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -80 * 1000,
      date: '2023-06-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
  ];

  test('Проверка корректной работы функции', () => {
    const expectedBalanceHistory = {
      balance: [
        -159 * 1000,
        -159 * 1000,
        -159 * 1000,
        -159 * 1000,
        -159 * 1000,
        -159 * 1000,
        -229 * 1000,
        11 * 1000,
        91 * 1000,
        91 * 1000,
        21 * 1000,
        1000,
      ],
      months: [
        'июль',
        'август',
        'сентябрь',
        'октябрь',
        'ноябрь',
        'декабрь',
        'январь',
        'февраль',
        'март',
        'апрель',
        'май',
        'июнь',
      ],
      ticks: [-229 * 1000, 91 * 1000],
    };

    expect(
      calculateBalanceChartData(
        1000,
        transactions,
        12,
        new Date(testDate.getTime())
      )
    ).toEqual(expectedBalanceHistory);
  });

  test('Проверка пропуска месяца в транзакциях', () => {
    const skippedMonthsTransactions = [
      {
        amount: 40 * 1000,
        date: '2023-01-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 140 * 1000,
        date: '2023-03-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 10 * 1000,
        date: '2023-03-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -40 * 1000,
        date: '2023-03-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -40 * 1000,
        date: '2023-06-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -80 * 1000,
        date: '2023-06-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ];

    const expectedBalanceHistory = {
      balance: [11 * 1000, 121 * 1000, 121 * 1000, 121 * 1000, 1000],
      months: ['февраль', 'март', 'апрель', 'май', 'июнь'],
      ticks: [1000, 121 * 1000],
    };

    expect(
      calculateBalanceChartData(
        1000,
        skippedMonthsTransactions,
        5,
        new Date(testDate.getTime())
      )
    ).toEqual(expectedBalanceHistory);
  });

  test('Проверка случая, пустого массива транзакций', () => {
    const emptyTransactions = [];

    const expectedBalanceHistory = {
      balance: [1000],
      months: ['июнь'],
      ticks: [1000, 1000],
    };

    expect(
      calculateBalanceChartData(
        1000,
        emptyTransactions,
        4,
        new Date(testDate.getTime())
      )
    ).toEqual(expectedBalanceHistory);
  });

  test('Проверка случая, минимальной длины графика', () => {
    const expectedBalanceHistory = {
      balance: [1000],
      months: ['июнь'],
      ticks: [1000, 1000],
    };

    expect(
      calculateBalanceChartData(
        1000,
        transactions,
        1,
        new Date(testDate.getTime())
      )
    ).toEqual(expectedBalanceHistory);
  });

  test('Проверка случая, когда транзакции слишком старые чтобы быть включены в генерацию', () => {
    const oldTransactions = [
      {
        amount: -10 * 1000,
        date: '2023-01-01T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -20 * 1000,
        date: '2023-02-02T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -40 * 1000,
        date: '2023-03-03T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -80 * 1000,
        date: '2023-04-04T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ];

    const expectedBalanceHistory = {
      balance: [81 * 1000, 1000, 1000, 1000],
      months: ['март', 'апрель', 'май', 'июнь'],
      ticks: [1000, 81 * 1000],
    };

    expect(
      calculateBalanceChartData(
        1000,
        oldTransactions,
        4,
        new Date(testDate.getTime())
      )
    ).toEqual(expectedBalanceHistory);
  });
});

describe('Проверка функции calculateRatioChartData', () => {
  const transactions = [
    {
      amount: -10 * 1000,
      date: '2022-01-01T01:00:00.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -10 * 1000,
      date: '2023-01-01T01:00:00.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -20 * 1000,
      date: '2023-01-15T01:00:00.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -40 * 1000,
      date: '2023-01-30T23:55:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -80 * 1000,
      date: '2023-02-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 320 * 1000,
      date: '2023-02-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 80 * 1000,
      date: '2023-03-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 80 * 1000,
      date: '2023-05-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -160 * 1000,
      date: '2023-05-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 10 * 1000,
      date: '2023-05-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 20 * 1000,
      date: '2023-06-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: 40 * 1000,
      date: '2023-06-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
    {
      amount: -80 * 1000,
      date: '2023-06-15T23:00:44.486Z',
      from: '61253747452820828268825011',
      to: '74213041477477406320783754',
    },
  ];

  test('Проверка корректной работы функции', () => {
    const expectedRatioHistory = {
      income: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        320 * 1000,
        80 * 1000,
        0,
        90 * 1000,
        60 * 1000,
      ],
      expense: [
        0,
        0,
        0,
        0,
        0,
        0,
        70 * 1000,
        80 * 1000,
        0,
        0,
        160 * 1000,
        80 * 1000,
      ],
      months: [
        'июль',
        'август',
        'сентябрь',
        'октябрь',
        'ноябрь',
        'декабрь',
        'январь',
        'февраль',
        'март',
        'апрель',
        'май',
        'июнь',
      ],
      ticks: [400 * 1000, 90 * 1000],
    };

    expect(
      calculateRatioChartData(transactions, 12, new Date(testDate.getTime()))
    ).toEqual(expectedRatioHistory);
  });

  test('Проверка пропуска месяца в транзакциях', () => {
    const skippedMonthsTransactions = [
      {
        amount: 40 * 1000,
        date: '2023-01-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 140 * 1000,
        date: '2023-03-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 10 * 1000,
        date: '2023-03-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -40 * 1000,
        date: '2023-03-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 20 * 1000,
        date: '2023-06-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 10 * 1000,
        date: '2023-06-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -40 * 1000,
        date: '2023-06-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -80 * 1000,
        date: '2023-06-15T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ];

    const expectedRatioHistory = {
      income: [40 * 1000, 0, 150 * 1000, 0, 0, 30 * 1000],
      expense: [0, 0, 40 * 1000, 0, 0, 120 * 1000],
      months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь'],
      ticks: [190 * 1000, 40 * 1000],
    };

    expect(
      calculateRatioChartData(
        skippedMonthsTransactions,
        12,
        new Date(testDate.getTime())
      )
    ).toEqual(expectedRatioHistory);
  });

  test('Проверка случая, пустого массива транзакций', () => {
    const expectedRatioHistory = {
      income: [0],
      expense: [0],
      months: ['июнь'],
      ticks: [0, 0],
    };

    expect(
      calculateRatioChartData([], 12, new Date(testDate.getTime()))
    ).toEqual(expectedRatioHistory);
  });

  test('Проверка случая, минимальной длины графика', () => {
    const expectedRatioHistory = {
      income: [60 * 1000],
      expense: [80 * 1000],
      months: ['июнь'],
      ticks: [140 * 1000, 60 * 1000],
    };

    expect(
      calculateRatioChartData(transactions, 1, new Date(testDate.getTime()))
    ).toEqual(expectedRatioHistory);
  });

  test('Проверка случая, когда транзакции слишком старые чтобы быть включены в генерацию', () => {
    const oldTransactions = [
      {
        amount: 80 * 1000,
        date: '2023-01-01T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -10 * 1000,
        date: '2023-01-01T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 40 * 1000,
        date: '2023-02-02T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -20 * 1000,
        date: '2023-02-02T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 10 * 1000,
        date: '2023-03-03T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: 20 * 1000,
        date: '2023-03-03T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -40 * 1000,
        date: '2023-03-03T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
      {
        amount: -80 * 1000,
        date: '2023-04-04T23:00:44.486Z',
        from: '61253747452820828268825011',
        to: '74213041477477406320783754',
      },
    ];

    const expectedRatioHistory = {
      income: [30 * 1000, 0, 0, 0],
      expense: [40 * 1000, 80 * 1000, 0, 0],
      months: ['март', 'апрель', 'май', 'июнь'],
      ticks: [80 * 1000, 30 * 1000],
    };

    expect(
      calculateRatioChartData(oldTransactions, 4, new Date(testDate.getTime()))
    ).toEqual(expectedRatioHistory);
  });
});
