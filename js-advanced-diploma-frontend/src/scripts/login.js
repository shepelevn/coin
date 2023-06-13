import { navigo } from './main';
import { handleServerErrors } from './errorHandling';

import { login } from './serverApi';

import renderLogin from './render/renderLogin';

export {
  saveToken,
  getToken,
  removeToken,
  checkAuthorization,
  logout,
  forUnitTesting,
};
const forUnitTesting = { preFetchValidate };

function logout() {
  removeToken();

  renderLogin(preFetchValidate, loginFormSubmit);
}

function checkAuthorization() {
  const token = getToken();

  if (!token) {
    navigo.navigate('/login');

    return false;
  }

  return true;
}

async function loginFormSubmit({ username, password }) {
  let results;

  const response = await handleServerErrors(() => {
    return login(username, password);
  });

  if (response) {
    if (response.error) {
      results = postFetchValidate(response);
    } else {
      loginSubmitSuccessHandler(response.payload);
    }
  }

  return results;
}

function preFetchValidate({ username, password }) {
  let results = {
    username: '',
    password: '',
    ok: true,
  };

  if (username.length < 6) {
    results.username = 'Длина логина должна быть не менее 6 символов';
    results.ok = false;
  } else if (username.includes(' ')) {
    results.username = 'Логин содержит недопустимые символы';
    results.ok = false;
  }

  if (password.length < 6) {
    results.password = 'Длина пароля должна быть не менее 6 символов';
    results.ok = false;
  } else if (password.includes(' ')) {
    results.password = 'Пароль содержит недопустимые символы';
    results.ok = false;
  }

  return results;
}

function postFetchValidate(json) {
  let results = {
    username: '',
    password: '',
  };

  switch (json.error) {
    case 'No such user':
      results.username = 'Пользователя с данным именем не существует';
      break;
    case 'Invalid password':
      results.password = 'Неверный пароль';
      break;
    default:
      results.username = json.error;
  }

  return results;
}

function loginSubmitSuccessHandler(payload) {
  saveToken(payload.token);

  navigo.navigate('/accounts');
}

function saveToken(token) {
  sessionStorage.setItem('authorization-token', token);
}

function getToken() {
  return sessionStorage.getItem('authorization-token');
}

function removeToken() {
  sessionStorage.removeItem('authorization-token');
}
