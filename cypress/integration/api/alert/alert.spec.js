import {dashboardPageElements} from '../../../components/dashboard.js'
import {signUpPageElements} from '../../../components/sign-up.js'
import {requestTypes, swaggerSections, swaggerLinks, endpoints} from '../../../components/endpoints.js'

const {generateToken} = require('authenticator')

const baseUrl           = Cypress.env('apiSuite').baseUrl
const signInLink        = Cypress.env('urls').signIn
const userId            = Cypress.env('apiSuite').users.sixth.id
const email             = Cypress.env('apiSuite').users.sixth.email
const password          = Cypress.env('apiSuite').users.sixth.password
const formattedKey      = Cypress.env('apiSuite').users.sixth.formattedKey
const customerId        = Cypress.env('apiSuite').customerId
const alertId           = Cypress.env('apiSuite').alertId
const alertDismiss      = 'ALERT_DISMISS'
const alertUndismiss    = 'ALERT_UNDISMISS'

let formattedToken

describe(`API - Section ${baseUrl}${swaggerSections['alert']}`, function() {

    before(() => {
        // sign in
        cy.visit(signInLink)
        formattedToken = generateToken(formattedKey)
        let array = Array.from(formattedToken)
        cy.signIn(email, password)
        cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5])
        cy.get(signUpPageElements.spinner).should('not.exist')
        cy.get(dashboardPageElements.scoreValue).should('be.visible')

        // get data from local storage
        cy.getLocalStorage('auth.refreshToken').then(val => {
            let refreshToken = val.replaceAll('"', '')
            cy.wrap(refreshToken).as('refreshToken')
        })
        cy.getLocalStorage('auth.idToken').then(val => {
            let idToken = val.replaceAll('"', '')
            cy.wrap(idToken).as('idToken')
        })
        cy.getLocalStorage('auth.accessToken').then(val => {
            let accessToken = val.replaceAll('"', '')
            cy.wrap(accessToken).as('accessToken')
        })
        cy.saveLocalStorage()
    })

    beforeEach(() => {
        cy.restoreLocalStorage()
    })

    it(`Search alert ${baseUrl}${swaggerLinks['search-customer-alerts']}`, function() {
        cy.request(
            {
                method: requestTypes.post,
                url: baseUrl + endpoints.alert['alert-search'],
                auth: {
                    'bearer': this.accessToken
                },
                headers: {
                    'x-customer-id': customerId,
                    'x-id-token': this.idToken
                },
                body: {
                    'pagination': {
                        'skip': 0,
                        'take': 25,
                        'sort': 'createdAt',
                        'sortDir': 'DESC'
                    },
                    'status': [
                        'OPEN'
                    ]
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.pagination).to.be.an('object')
            expect(response.body.records).to.be.an('array')
        })
    })

    it(`Dismiss & undismiss alert ${baseUrl}${swaggerLinks['alert-action']}`, function() {
        cy.request(
            {
                method: requestTypes.patch,
                url: baseUrl + endpoints.alert['alert-action'],
                auth: {
                    'bearer': this.accessToken
                },
                headers: {
                    'x-customer-id': customerId,
                    'x-id-token': this.idToken
                },
                body: {
                    'action': alertDismiss,
                    'alertsIds': [
                      alertId
                    ],
                    'reason': 'test'
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.actionType).to.eq(alertDismiss)
            expect(response.body.committedCount).to.eq(1)
            expect(response.body.failedCount).to.eq(0)
            expect(response.body.results[0].alertId).to.eq(alertId)
            expect(response.body.results[0].actionType).to.eq(alertDismiss)
        })

        cy.request(
            {
                method: requestTypes.patch,
                url: baseUrl + endpoints.alert['alert-action'],
                auth: {
                    'bearer': this.accessToken
                },
                headers: {
                    'x-customer-id': customerId,
                    'x-id-token': this.idToken
                },
                body: {
                    'action': alertUndismiss,
                    'alertsIds': [
                      alertId
                    ],
                    'reason': 'test'
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.actionType).to.eq(alertUndismiss)
            expect(response.body.committedCount).to.eq(1)
            expect(response.body.failedCount).to.eq(0)
            expect(response.body.results[0].alertId).to.eq(alertId)
            expect(response.body.results[0].actionType).to.eq(alertUndismiss)
        })
    })

    it(`Assign alert to user ${baseUrl}${swaggerLinks['alert-assign']}`, function() {
        cy.request(
            {
                method: requestTypes.patch,
                url: baseUrl + endpoints.alert['alert-assign'] + '/' + alertId,
                auth: {
                    'bearer': this.accessToken
                },
                headers: {
                    'x-customer-id': customerId,
                    'x-id-token': this.idToken
                },
                body: {
                    'usersIds': [
                        userId
                    ]
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.assignedTo[0]._id).to.eq(userId)
        })
    })

    it(`Get customer alert statistics ${baseUrl}${swaggerLinks['get-customer-alert-statistics']}`, function() {
        cy.request(
            {
                method: requestTypes.post,
                url: baseUrl + endpoints.alert['alert-customer-statistics'],
                auth: {
                    'bearer': this.accessToken
                },
                headers: {
                    'x-customer-id': customerId,
                    'x-id-token': this.idToken
                },
                body: {
                    'startDate': '1991-04-29T00:00:00.000Z',
                    'endDate': '2091-04-29T00:00:00.000Z',
                    'severity': [
                        'HIGH', 
                        'MEDIUM', 
                        'LOW', 
                        'NONE'
                    ]
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.count).to.be.a('number')
            expect(response.body.entities).to.be.a('number')
            expect(response.body.trend).to.be.a('string')
            expect(response.body.severity).to.be.an('object')
            expect(response.body.types).to.be.an('array')
        })
    })

})