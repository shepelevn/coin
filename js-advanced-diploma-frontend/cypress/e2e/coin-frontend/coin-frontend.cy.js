/// <reference types="cypress" />

const URL = 'http://localhost:8080';

describe('Тестирование основного функционала приложения Coin.', () => {
  beforeEach(() => {
    cy.visit(URL);

    cy.get('input[name="username"]').type('developer');
    cy.get('input[name="password"]').type('skillbox');
    cy.get('button[type="submit"]').click().wait(2000);

    cy.get('h1').should('have.text', 'Ваши счета');
  });

  it('Добавления счета и просмотр списка счетов', () => {
    cy.get('#accounts-list .accounts__item')
      .its('length')
      .then(($initialLength) => {
        cy.get('#new-account').click().wait(2000);

        cy.get('#accounts-list .accounts__item').should(
          'have.length',
          $initialLength + 1
        );
      });
  });

  it('Возможность перевести сумму со счёта на счёт', () => {
    cy.get('.accounts__item')
      .contains('0,00 ₽')
      .parent('.accounts__item')
      .children('.account-card__id')
      .then(($newAccountIdDiv) => {
        const newAccountId = $newAccountIdDiv.text();

        cy.get('.accounts__item')
          .contains('74213041477477406320783754')
          .parent('.accounts__item')
          .contains('Открыть')
          .click()
          .wait(2000);

        transferMoney(newAccountId, '111.11');

        cy.get('.account-header__back').click().wait(2000);

        cy.get('.accounts__item')
          .contains(newAccountId)
          .parent('.accounts__item')
          .contains('Открыть')
          .click()
          .wait(2000);

        cy.get('.account-header__balance')
          .invoke('text')
          .should('include', '111,11\xa0₽');

        transferMoney('74213041477477406320783754', '111.11');

        cy.get('.account-header__balance')
          .invoke('text')
          .should('include', '0,00\xa0₽');
      });
  });

  it('Возможность обменять валюту', () => {
    cy.get('a').contains('Валюта').click().wait(2000);
    getCurrencyAmountElement('RUB').then(($rubAmountElement) => {
      const initialRubAmount = $rubAmountElement.text();

      getCurrencyAmountElement('USD').then(($usdAmountElement) => {
        const initialUsdAmount = $usdAmountElement.text();

        exchangeCurrency('RUB', 'USD', 1);

        getCurrencyAmountElement('RUB').should(
          'have.text',
          initialRubAmount - 1
        );

        getCurrencyAmountElement('USD').then(($usdAmountElement) => {
          const newUsdAmoun = $usdAmountElement.text();
          const usdDelta = newUsdAmoun - initialUsdAmount;

          exchangeCurrency('USD', 'RUB', usdDelta);

          getCurrencyAmountElement('USD').should('have.text', initialUsdAmount);
          getCurrencyAmountElement('RUB').should('have.text', initialRubAmount);
        });
      });
    });
  });
});

function transferMoney(to, amount) {
  cy.get('#transaction-receiver').type(to);
  cy.get('#transaction-amount').type(amount);
  cy.get('button[type="submit"]').click().wait(2000);
}

function exchangeCurrency(from, to, amount) {
  selectChoice('#exchange-from', from);
  selectChoice('#exchange-to', to);

  cy.get('#exchange-amount').type(amount);
  cy.get('.exchange__button').click().wait(2000);
}

function getCurrencyAmountElement(currencyType) {
  return cy
    .get('.currency-list__item')
    .contains(currencyType)
    .parent('.currency-list__item')
    .children('.currency-list__price');
}

function selectChoice(selectId, value) {
  cy.get(selectId).parents('.select-primary').click().contains(value).click();
}
