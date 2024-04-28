import stringToDom from 'string-to-dom';
import autoComplete from '@tarekraafat/autocomplete.js';

import errorIcon from '../../images/common/error.png';
import successIcon from '../../images/common/success.png';
import { setBlockLoading, unsetBlockLoading } from './renderMain';

export { initFormValidation, initSearchInput };

function initFormValidation(
  form,
  dynamicValidation,
  submitValidation,
  loadingDivId
) {
  const inputs = form.elements;

  for (const input of inputs) {
    input.addEventListener('change', () => {
      fireDynamicValidation(form, dynamicValidation, submitValidation);
    });
  }

  form.activated = false;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    form.activated = true;

    fireDynamicValidation(form, dynamicValidation, submitValidation);

    if (form.ok) {
      fireSubmitValidation(form, submitValidation, loadingDivId);
    }
  });
}

function fireDynamicValidation(form, dynamicValidation) {
  if (form.activated) {
    const inputValues = createInputValuesObject(form.elements);
    const dynamicValidationResults = dynamicValidation(inputValues);

    if (dynamicValidationResults.ok) {
      form.ok = true;
    } else {
      form.ok = false;
    }

    setInputsValidationClasses(form, dynamicValidationResults);
  }
}

async function fireSubmitValidation(form, submitValidation, loadingDivId) {
  const inputValues = createInputValuesObject(form.elements);

  setBlockLoading(loadingDivId);
  const submitValidationResults = await submitValidation(inputValues);

  if (submitValidationResults && !submitValidationResults.ok) {
    unsetBlockLoading(loadingDivId);
    setInputsValidationClasses(form, submitValidationResults);
  } else {
    form.activated = false;
    form.reset();
    resetInputs(form);
  }
}

function createInputValuesObject(elements) {
  const valuesObject = {};

  for (const input of elements) {
    if (input.name) {
      valuesObject[input.name] = input.value.trim();
    }
  }

  return valuesObject;
}

function setInputsValidationClasses(form, validationResults) {
  const inputs = form.elements;

  for (const input of inputs) {
    if (input.name && !input.dataset.noCheck) {
      if (validationResults[input.name]) {
        setInputError(input, validationResults[input.name]);
      } else {
        setInputSuccess(input);
      }
    }
  }
}

function setInputError(input, message) {
  input.classList.add('input-primary_error');
  input.classList.remove('input-primary_success');

  const errorMessageDiv = document.getElementById(input.dataset.errorId);
  errorMessageDiv.innerText = message;

  addInputIcon(input, errorIcon);
}

function setInputSuccess(input) {
  input.classList.add('input-primary_success');
  input.classList.remove('input-primary_error');

  const errorMessageDiv = document.getElementById(input.dataset.errorId);

  if (errorMessageDiv) {
    errorMessageDiv.innerText = '';

    addInputIcon(input, successIcon);
  }
}

function addInputIcon(input, path) {
  const oldIcon = input.parentElement.querySelector('.input-group__icon');

  if (oldIcon) oldIcon.remove();

  const newIcon = stringToDom(`
  <img class="input-group__icon" src="${path}" alt="">
    `);

  input.after(newIcon);
}

function resetInputs(form) {
  const inputs = form.querySelectorAll('.input-primary');

  for (const input of inputs) {
    input.classList.remove('input-primary_success');

    const parent = input.parentElement;
    const icon = parent.querySelector('.input-group__icon');
    icon.remove();
  }
}

function initSearchInput(id, autocompleteList) {
  const transactionIdAutocomplete = new autoComplete({
    selector: '#' + id,
    data: {
      src: autocompleteList,
      cache: true,
    },
    wrapper: false,
    resultsList: {
      class: 'input-search__list',
    },
    resultItem: {
      class: 'input-search__item',
      selected: 'input-search__item_highlight',
    },
    events: {
      input: {
        selection: (event) => {
          const selection = event.detail.selection.value;
          transactionIdAutocomplete.input.value = selection;
        },
      },
    },
  });
}
