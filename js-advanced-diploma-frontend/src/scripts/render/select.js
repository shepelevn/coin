import Choices from 'choices.js';

export default initSelect;

const CHOICE_CLASSNAMES = {
  containerOuter: 'select-primary',
  list: 'select-primary__list',
  listSingle: 'select-primary__single',
  listDropdown: 'select-primary__dropdown',
  item: 'select-primary__item',
};

function initSelect(select) {
  select.classList.remove('select-primary');
  const choices = new Choices(select, {
    classNames: CHOICE_CLASSNAMES,
    searchEnabled: false,
    shouldSort: false,
  });

  // const selectSingleDiv = select.parentElement.querySelector('.select-primary__single');
  const selectSingleDiv = select.parentElement.parentElement;
  selectSingleDiv.setAttribute('aria-label', select.dataset.label);

  return choices;
}
