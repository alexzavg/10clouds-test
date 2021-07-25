// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:

// Alternatively you can use CommonJS syntax:
require('./commands')
require('cypress-commands')
require('cypress-dark')
require('@shelex/cypress-allure-plugin')
require('cypress-xpath')

// Add Screenshot to Mochawesome Report
import addContext from 'mochawesome/addContext'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})

Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed') {
      const screenshot = `assets/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`
      addContext({ test }, screenshot)
    }
})

// fix for cy.visit() not executing 
// https://github.com/cypress-io/cypress/issues/2938#issuecomment-549565158
Cypress.on('window:before:load', function (window) {
  const original = window.EventTarget.prototype.addEventListener
  window.EventTarget.prototype.addEventListener = function () {
    if (arguments && arguments[0] === 'beforeunload') {
      return
    }
    return original.apply(this, arguments)
  }
  Object.defineProperty(window, 'onbeforeunload', {
    get: function () { },
    set: function () { }
  })
})