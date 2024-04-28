import stringToDom from 'string-to-dom';

import xSvg from '../../images/svg/x.svg';

export default addSnackbar;

const SNACKBAR_DURATION = 5 * 1000;

function addSnackbar(text, type) {
  let snackbarTypeClass = '';
  switch (type) {
    case 'error':
      snackbarTypeClass = 'snackbar_error';
      break;
    case 'warning':
      snackbarTypeClass = 'snackbar_warning';
      break;
    case 'success':
      snackbarTypeClass = 'snackbar_success';
      break;
  }

  const snackbar = stringToDom(`
    <div class="snackbar ${snackbarTypeClass}">
      <p class="snackbar__text">${text}</p>
      <button class="snackbar__button clear-button">
        <svg class="snackbar__icon">
          <use xlink:href="${xSvg.url}"></use>
        </svg>
      </button>
    </div>
  `);

  const button = snackbar.querySelector('.snackbar__button');
  button.addEventListener('click', () => removeSnackbar(snackbar));

  const snackbarContainer = document.getElementById('snackbar-container');
  snackbarContainer.append(snackbar);

  setTimeout(() => snackbar.classList.add('snackbar_active'), 100);

  setTimeout(() => removeSnackbar(snackbar), SNACKBAR_DURATION);
}

function removeSnackbar(snackbar) {
  snackbar.classList.remove('snackbar_active');

  setTimeout(() => {
    snackbar.remove();
  }, 1000);
}
