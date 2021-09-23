import {mainPageLocators, mainPageText} from '../components/main.js'

describe('10Clouds test task', function() {

    it('Case 1', function() {
        cy.visit('/')
        cy.contains(mainPageLocators.navbarOption, mainPageText.careers).click()
        cy.contains(mainPageLocators.jobOfferTitle, mainPageText.qa_automation).should('have.length', 1)
    })

    it.only('Case 2', function() {
        cy.visit('/')
        cy.contains(mainPageLocators.navbarOption, mainPageText.careers).click()
        cy.get(mainPageLocators.jobSearchField).type(mainPageText.automation).should('have.value', mainPageText.automation)
        cy.get(mainPageLocators.jobOfferTitle).each($el => {
            expect($el).to.contain(mainPageText.automation)
        })
    })

})