import { forUnitTesting as moduleFunctions } from '../src/scripts/currency';
const { validateExchange } = moduleFunctions;

describe('Тестирование функции validateExchange', () => {
  test('Правильная сумма корректно обрабатывается', () => {
    expect(validateExchange({ amount: '1' })).toMatchObject({
      amount: '',
      ok: true,
    });

    expect(validateExchange({ amount: '666' })).toMatchObject({
      amount: '',
      ok: true,
    });

    expect(validateExchange({ amount: '666.6' })).toMatchObject({
      amount: '',
      ok: true,
    });

    expect(validateExchange({ amount: '666.66' })).toMatchObject({
      amount: '',
      ok: true,
    });
  });

  test('Сумма обмена введена', () => {
    expect(validateExchange({ amount: '' }).ok).toBe(false);
  });

  test('Сумма обмена должна быть больше нуля', () => {
    expect(validateExchange({ amount: '0' }).ok).toBe(false);
    expect(validateExchange({ amount: '-1' }).ok).toBe(false);
    expect(validateExchange({ amount: '-666.66' }).ok).toBe(false);
  });

  test('Сумма должна быть верного формата', () => {
    expect(validateExchange({ amount: 'a666' }).ok).toBe(false);
    expect(validateExchange({ amount: '666a' }).ok).toBe(false);
    expect(validateExchange({ amount: '.' }).ok).toBe(false);
    expect(validateExchange({ amount: '0.' }).ok).toBe(false);
    expect(validateExchange({ amount: '.1' }).ok).toBe(false);
  });
});
