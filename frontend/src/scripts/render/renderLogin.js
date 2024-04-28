import { initFormValidation } from './input';

import loginHtml from '../../static-html/login.html';

export default renderLogin;

function renderLogin(dynamicValidationCallback, submitValidationCallback) {
  addStaticLoginHtml();

  const loginForm = document.getElementById('login-form');
  initFormValidation(
    loginForm,
    dynamicValidationCallback,
    submitValidationCallback,
    'login-loading'
  );
}

function addStaticLoginHtml() {
  const mainDiv = document.getElementById('main');
  mainDiv.innerHTML = loginHtml;
}
