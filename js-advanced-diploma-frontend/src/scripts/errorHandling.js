import { navigo } from './main';

import addSnackbar from './render/snackbar';
import { render404 } from './render/renderMain';

export {
  initErrorHandling,
  handleServerErrors,
  commonPayloadErrorsHandler,
  openNotFound,
};

function initErrorHandling() {
  window.addEventListener('offline', offlineHandler);
  window.addEventListener('online', onlineHandler);
}

function openNotFound() {
  render404();
}

function offlineHandler() {
  addSnackbar('Потеряно соединение с интернетом', 'warning');
}

function onlineHandler() {
  addSnackbar('Вы снова онлайн', 'success');
}

async function handleServerErrors(attemptedFunction, tryCount = 0) {
  try {
    return await attemptedFunction();
  } catch (error) {
    switch (error.name) {
      case 'SyntaxError':
        if (tryCount < 3) {
          return handleServerErrors(attemptedFunction, ++tryCount);
        } else {
          addSnackbar('Ошибка в переданных данных. Попробуйте позже.', 'error');
        }
        break;
      case 'NetworkError':
        addSnackbar(
          'Произошла ошибка, проверьте подключение к интернету',
          'error'
        );
        break;
      case 'ResponseError':
        switch (error.status) {
          case 404:
            openNotFound();
            break;
          case 500:
            if (tryCount < 3) {
              return handleServerErrors(attemptedFunction, ++tryCount);
            } else {
              addSnackbar('Ошибка сервера. Попробуйте позже.', 'error');
            }
            break;
        }
        break;
      default:
        addSnackbar('Что-то пошло не так...', 'error');
        throw error;
    }
  }

  return;
}

function commonPayloadErrorsHandler(error) {
  switch (error) {
    case 'Unauthorized':
      navigo.navigate('/login');
      return true;
  }

  return false;
}
