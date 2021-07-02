import {dashboardPageElements, dashboardPageData} from '../../../../components/dashboard.js'
import {signUpPageElements} from '../../../../components/sign-up.js'
import {alertsPageElements} from '../../../../components/alerts.js'
import {requests} from '../../../../components/requests.js'
import {ValidInDays, ValidInWeeks, PostExtractTimes, ValidInHours} from '../../../../support/dataGenerator.js'

const {generateToken} = require('authenticator')

describe('Dashboard', function() {

    const signInLink        = Cypress.env('urls').signIn
    const dashboardLink     = Cypress.env('urls').dashboard
    const alertsLink        = Cypress.env('urls').alerts
    const edpLink           = Cypress.env('urls').edp
    const mailLink          = Cypress.env('urls').mail
    const cloudStorageLink  = Cypress.env('urls').cloudStorage
    const email             = Cypress.env('users').third.email
    const password          = Cypress.env('users').third.password 
    const formattedKey      = Cypress.env('users').third.formattedKey

    let formattedToken

    before(() => {
        cy.visit(signInLink)
        formattedToken = generateToken(formattedKey)
        let array = Array.from(formattedToken)
        cy.signIn(email, password)
        cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5])
        cy.get(signUpPageElements.spinner).should('not.exist')
        cy.get(dashboardPageElements.scoreValue).should('be.visible')
    })

    describe('Collapsed Top Menu', function() {

        beforeEach(() => {
            cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics')
            cy.intercept(requests['customer-statistics']).as('customer-statistics')
            cy.get(dashboardPageElements.topMenuBlock).invoke('attr', 'class').then((value) => {
                if(value == 'top-menu opened'){
                    cy.get(dashboardPageElements.topMenuOpenBtn).click()
                    cy.get(dashboardPageElements.topMenuBlock).should('have.attr', 'class', 'top-menu')
                }
            })
        })

        it('[Collapsed Top Menu] - select & unselect [High] severity', function () {
            // select
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.high).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.high).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })

        it('[Collapsed Top Menu] - unselect [High] severity with [X] button', function () {
            // select
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.high).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severityUnselectBtn).click()
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.high).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })
    
        it('[Collapsed Top Menu] - select & unselect [Medium] severity', function () {
            // select
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.medium).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.medium).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })
    
        it('[Collapsed Top Menu] - unselect [Medium] severity with [X] button', function () {
            // select
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.medium).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severityUnselectBtn).click()
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.medium).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })
    
        it('[Collapsed Top Menu] - select & unselect [Low] severity', function () {
            // select
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.low).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.low).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })
    
        it('[Collapsed Top Menu] - unselect [Low] severity with [X] button', function () {
            // select
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.low).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
            })
            
            // unselect
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severityUnselectBtn).click()
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.low).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })

        it('[Collapsed Top Menu] - select & unselect [Low, Medium, High] severity', function () {
            // select
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.low).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
            })
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.medium).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
            })
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.high).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.low).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH'])
            })
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.medium).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
            })
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.high).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })

        it('[Collapsed Top Menu] - unselect [Low, Medium, High] severity with [X] button', function () {
            // select
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.low).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
            })
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.medium).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
            })
            cy.get(dashboardPageElements.topMenuClosed).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.high).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severityUnselectBtn).click()
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.low).should('not.exist')
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.medium).should('not.exist')
            cy.get(dashboardPageElements.topMenuClosed).find(dashboardPageElements.severitySelected.high).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })

    })

    describe('Expanded Top Menu', function() {

        beforeEach(() => {
            cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics')
            cy.intercept(requests['customer-statistics']).as('customer-statistics')
            cy.get(dashboardPageElements.topMenuBlock).invoke('attr', 'class').then((value) => {
                if(value == 'top-menu'){
                    cy.get(dashboardPageElements.topMenuOpenBtn).click()
                    cy.get(dashboardPageElements.topMenuBlock).should('have.attr', 'class', 'top-menu opened')
                }
            })
        })

        it('[Expanded Top Menu] - select & unselect [High] severity', function () {
            // select
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.high).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.high).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })

        it('[Expanded Top Menu] - unselect [High] severity with [X] button', function () {
            // select
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.high).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severityUnselectBtn).click()
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.high).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })
    
        it('[Expanded Top Menu] - select & unselect [Medium] severity', function () {
            // select
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.medium).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.medium).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })
    
        it('[Expanded Top Menu] - unselect [Medium] severity with [X] button', function () {
            // select
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.medium).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severityUnselectBtn).click()
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.medium).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })
    
        it('[Expanded Top Menu] - select & unselect [Low] severity', function () {
            // select
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.low).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.low).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })
    
        it('[Expanded Top Menu] - unselect [Low] severity with [X] button', function () {
            // select
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.low).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
            })
            
            // unselect
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severityUnselectBtn).click()
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.low).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })

        it('[Expanded Top Menu] - select & unselect [Low, Medium, High] severity', function () {
            // select
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.low).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
            })
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.medium).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
            })
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.high).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.low).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['MEDIUM', 'HIGH'])
            })
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.medium).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['HIGH'])
            })
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.high).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })

        it('[Expanded Top Menu] - unselect [Low, Medium, High] severity with [X] button', function () {
            // select
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityLow).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.low).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW'])
            })
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityMedium).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.medium).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM'])
            })
            cy.get(dashboardPageElements.topMenuOpen).within(() => {
                cy.contains(dashboardPageElements.severityBlock, dashboardPageData.severityHigh).click()
            })
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.high).should('be.visible')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', ['LOW', 'MEDIUM', 'HIGH'])
            })
    
            // unselect
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severityUnselectBtn).click()
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.low).should('not.exist')
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.medium).should('not.exist')
            cy.get(dashboardPageElements.topMenuOpen).find(dashboardPageElements.severitySelected.high).should('not.exist')
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-top-statistics').its('request.body.severity').should('deep.eq', [])
                cy.wait('@customer-statistics').its('request.body.severity').should('deep.eq', [])
            })
        })

    })

    describe('Top Right [Time Range] Dropdown', function() {

        beforeEach(() => {
            cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics')
            cy.intercept(requests['customer-statistics']).as('customer-statistics')
        })

        it('[Top Right Dropdown] - check statistics for [Last 1 hour] option', function() {
            cy.get(dashboardPageElements.dropdownSnapshot).click()
            cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last1Hour).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
                    cy.wait(250)
                })
            })
        })
        
        it('[Top Right Dropdown] - check statistics for [Last 6 hour] option', function() {
            cy.get(dashboardPageElements.dropdownSnapshot).click()
            cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last6hour).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
                    cy.wait(250)
                })
            })
        })
    
        it('[Top Right Dropdown] - check statistics for [Last 12 hour] option', function() {
            cy.get(dashboardPageElements.dropdownSnapshot).click()
            cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last12hour).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
                    cy.wait(250)
                })
            })
        })
    
        it('[Top Right Dropdown] - check statistics for [Last 24 hour] option', function() {
            cy.get(dashboardPageElements.dropdownSnapshot).click()
            cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last24hour).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
                    cy.wait(250)
                })
            })
        })
    
        it('[Top Right Dropdown] - check statistics for [Last 1 week] option', function() {
            cy.get(dashboardPageElements.dropdownSnapshot).click()
            cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last1week).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
                    cy.wait(250)
                })   
                cy.wait('@customer-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
                    cy.wait(250)
                }) 
            })
        })
    
        it('[Top Right Dropdown] - check statistics for [Last 3 months] option', function() {
            cy.get(dashboardPageElements.dropdownSnapshot).click()
            cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.Last3month).click()
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                // ! Need dev fix, difference is now in days, should be 3 calendar months
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
                    cy.wait(250)
                })
                cy.wait('@customer-top-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
                    cy.wait(250)
                })  
                cy.wait('@customer-statistics').then((interception) => {
                    const geturl = PostExtractTimes(interception)
                    cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
                    cy.wait(250)
                })  
            })
        })

    })

    describe('Right [Top Statistics] Menu', function() {

        beforeEach(() => {
            cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics')
            cy.intercept(requests['protection-scores']).as('protection-scores')
            cy.intercept(requests['service-statistics']).as('service-statistics')
            cy.intercept(requests['device-search']).as('device-search')
            cy.intercept(requests['alert-search']).as('alert-search')
        })

        it('[Right Menu] - open & close [Regulation]', function() {
            cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.regulation).click()
            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).should('be.visible')
            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible')
            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).click()
            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).should('not.exist')
            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist')
        })
    
        it('[Right Menu] - open & close [Top News]', function() {
            cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topNews).click()
            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).should('be.visible')
            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible')
            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).click()
            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).should('not.exist')
            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist')
        })
    
        it('[Right Menu] - open [Top Endpoints] & check redirect to [Alerts] page', function() {
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topEndpoints).click()
                cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible').then(() => {
                    cy.wait(1500)
                    cy.get(dashboardPageElements.rightMenuCategoryOpen).then((value) => {
                        if (value.text().includes(dashboardPageData.nothingHere)) {
                            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).click()
                            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).should('not.exist')
                            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist')
                        }
                        else {
                            cy.get(dashboardPageElements.rightMenuCategoryOpen).find(dashboardPageElements.rightMenuItem).first().click()
                            cy.url().should('eq', alertsLink)
                            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@protection-scores').its('response.statusCode').should('eq', 200)
                                cy.wait('@service-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                                cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                                cy.wait('@alert-search').its('response.statusCode').should('eq', 200)
                                cy.get(alertsPageElements.filtersBtn).should('be.visible')
                                cy.visit(dashboardLink)
                            })
                        }
                    })
                })
            })
        })
    
        it('[Right Menu] - open [Top Alerts] & check redirect to [Alerts] page', function() {
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topAlerts).click()
                cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).should('be.visible')
                cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible').then(() => {
                    cy.wait(1500)
                    cy.get(dashboardPageElements.rightMenuCategoryOpen).then((value) => {
                        if (value.text().includes(dashboardPageData.nothingHere)) {
                            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).click()
                            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).should('not.exist')
                            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist')
                        }
                        else {
                            cy.get(dashboardPageElements.rightMenuCategoryOpen).find(dashboardPageElements.rightMenuItem).first().click()
                            cy.url().should('eq', alertsLink)
                            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@protection-scores').its('response.statusCode').should('eq', 200)
                                cy.wait('@service-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                                cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                                cy.wait('@alert-search').its('response.statusCode').should('eq', 200)
                                cy.get(alertsPageElements.filtersBtn).should('be.visible')
                                cy.visit(dashboardLink)
                            })
                        }
                    })
                })
            })
        })
    
        it('[Right Menu] - open [Top Users] & check redirect to [Alerts] page', function() {
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topUsers).click()
                cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).should('be.visible')
                cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible').then(() => {
                    cy.wait(1500)
                    cy.get(dashboardPageElements.rightMenuCategoryOpen).then((value) => {
                        if (value.text().includes(dashboardPageData.nothingHere)) {
                            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).click()
                            cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).should('not.exist')
                            cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist')
                        }
                        else {
                            cy.get(dashboardPageElements.rightMenuCategoryOpen).find(dashboardPageElements.rightMenuItem).first().click()
                            cy.url().should('eq', alertsLink)
                            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@protection-scores').its('response.statusCode').should('eq', 200)
                                cy.wait('@service-statistics').its('response.statusCode').should('eq', 200)
                                cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                                cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                                cy.wait('@alert-search').its('response.statusCode').should('eq', 200)
                                cy.get(alertsPageElements.filtersBtn).should('be.visible')
                                cy.visit(dashboardLink)
                            })
                        }
                    })
                })
            })
        })

        it('[Polygon] - click on [EDP] service & check redirect to [EDP] page', function() {
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.contains(dashboardPageElements.polygon.serviceArea, dashboardPageData.services.mail).should('be.visible').then(val => {
                    if (val.text().includes(dashboardPageData.notProtected)) {
                        cy.log('Service is not active')
                    }
                    else {
                        cy.contains(dashboardPageElements.polygon.serviceArea, dashboardPageData.services.edp).find(dashboardPageElements.polygon.alertsChart).click()
                        cy.url().should('eq', edpLink)
                        cy.get(alertsPageElements.filtersBtn).should('be.visible')
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@protection-scores').its('response.statusCode').should('eq', 200)
                        cy.wait('@service-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                        cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                        cy.wait('@alert-search').its('response.statusCode').should('eq', 200)
                        cy.visit(dashboardLink)
                    }
                })
            })
        })

        it('[Polygon] - click on [MAIL] service & check redirect to [MAIL] page', function() {
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.contains(dashboardPageElements.polygon.serviceArea, dashboardPageData.services.mail).should('be.visible').then(val => {
                    if (val.text().includes(dashboardPageData.notProtected)) {
                        cy.log('Service is not active')
                    }
                    else {
                        cy.contains(dashboardPageElements.polygon.serviceArea, dashboardPageData.services.mail).find(dashboardPageElements.polygon.alertsChart).click()
                        cy.url().should('eq', mailLink)
                        cy.get(alertsPageElements.filtersBtn).should('be.visible')
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@protection-scores').its('response.statusCode').should('eq', 200)
                        cy.wait('@service-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                        cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                        cy.wait('@alert-search').its('response.statusCode').should('eq', 200)
                        cy.visit(dashboardLink)
                    }
                })
            })
        })

        it('[Polygon] - click on [CLOUD STORAGE] service & check redirect to [CLOUD STORAGE] page', function() {
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.contains(dashboardPageElements.polygon.serviceArea, dashboardPageData.services.mail).should('be.visible').then(val => {
                    if (val.text().includes(dashboardPageData.notProtected)) {
                        cy.log('Service is not active')
                    }
                    else {
                        cy.contains(dashboardPageElements.polygon.serviceArea, dashboardPageData.services.cloudStorage).find(dashboardPageElements.polygon.alertsChart).click()
                        cy.url().should('eq', cloudStorageLink)
                        cy.get(alertsPageElements.filtersBtn).should('be.visible')
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@protection-scores').its('response.statusCode').should('eq', 200)
                        cy.wait('@service-statistics').its('response.statusCode').should('eq', 200)
                        cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                        cy.wait('@device-search').its('response.statusCode').should('eq', 200)
                        cy.wait('@alert-search').its('response.statusCode').should('eq', 200)
                        cy.visit(dashboardLink)
                    }
                })
            })
        })

    })

})