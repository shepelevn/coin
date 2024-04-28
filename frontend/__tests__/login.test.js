import { forUnitTesting as loginFunctions } from '../src/scripts/login';
const { preFetchValidate } = loginFunctions;

describe('Проверка функции preFetchValidate', () => {
  test('Правильный логин и пароль корректно обрабатываются', () => {
    expect(
      preFetchValidate({ username: 'username123', password: 'password123' })
    ).toMatchObject({ username: '', password: '', ok: true });
  });

  test('Длина логина должна быть не менее 6 символов', () => {
    expect(
      preFetchValidate({ username: 'usern', password: 'password123' }).ok
    ).toBe(false);
  });

  test('Логин не должен содержать пробел', () => {
    expect(
      preFetchValidate({ username: 'user name123', password: 'password123' }).ok
    ).toBe(false);
  });

  test('Длина пароля должна быть не менее 6 символов', () => {
    expect(
      preFetchValidate({ username: 'username123', password: 'pass' }).ok
    ).toBe(false);
  });

  test('Пароль не должен содержать пробел', () => {
    expect(
      preFetchValidate({ username: 'user name123', password: 'password 123' }).ok
    ).toBe(false);
  });
});
