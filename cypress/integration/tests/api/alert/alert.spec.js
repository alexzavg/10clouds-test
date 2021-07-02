import {dashboardPageElements} from '../../../../components/dashboard.js'
import {signUpPageElements} from '../../../../components/sign-up.js'
import {requestTypes, swaggerSections, swaggerLinks, endpoints} from '../../../../components/endpoints.js'

const {generateToken} = require('authenticator')

const baseUrl           = Cypress.env('apiSuite').baseUrl
const signInLink        = Cypress.env('urls').signIn
const userId            = Cypress.env('apiSuite').users.sixth.id
const email             = Cypress.env('apiSuite').users.sixth.email
const password          = Cypress.env('apiSuite').users.sixth.password
const formattedKey      = Cypress.env('apiSuite').users.sixth.formattedKey
const customerId        = Cypress.env('apiSuite').customerId
const alertIdEdp        = Cypress.env('apiSuite').alertIds.edp
const alertIdMail       = Cypress.env('apiSuite').alertIds.mail
const alertActions      = ['ALERT_DISMISS', 'ALERT_UNDISMISS']
const serviceTypes      = ['EDP', 'WEB', 'MAIL', 'CLOUD_STORAGE', 'BACKUP', 'VMDR', 'MOBILE', 'AWARENESS', 'ASK_THE_ANALYST']
const aggregate         = ['alerts', 'endpoints', 'users']
const statuses          = ['OPEN', 'CLOSED', 'DISMISSED', 'QUARANTINED']
const comment           = 'cypress_autotest'

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
        alertActions.forEach(action => {
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
                        'action': action,
                        'alertsIds': [
                          alertIdEdp
                        ],
                        'reason': comment
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.actionType).to.eq(action)
                expect(response.body.committedCount).to.eq(1)
                expect(response.body.failedCount).to.eq(0)
                expect(response.body.results[0].alertId).to.eq(alertIdEdp)
                expect(response.body.results[0].actionType).to.eq(action)
            })
        })
    })

    it(`Assign alert to user ${baseUrl}${swaggerLinks['alert-assign']}`, function() {
        cy.request(
            {
                method: requestTypes.patch,
                url: baseUrl + endpoints.alert['alert-assign'] + '/' + alertIdEdp,
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

    it(`Get customer alert statistics ${baseUrl}${swaggerLinks['get-customer-alerts-statistics']}`, function() {
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

    it(`Get customer top statistics ${baseUrl}${swaggerLinks['get-customer-top-statistics']}`, function() {
        serviceTypes.forEach(service => {
            aggregate.forEach(category => {
                cy.request(
                    {
                        method: requestTypes.post,
                        url: baseUrl + endpoints.alert['alert-customer-top-statistics'],
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
                            'top': '5',
                            'aggregate': category,
                            'serviceType': service,
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
                    expect(response.body).to.have.property(category).that.is.an('array')
                })
            })
        })
    })

    it(`Get service alerts statistics ${baseUrl}${swaggerLinks['get-customer-alerts-statistics']}`, function() {
        serviceTypes.forEach(service => {
            statuses.forEach(status => {
                cy.request(
                    {
                        method: requestTypes.post,
                        url: baseUrl + endpoints.alert['alert-service-statistics'],
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        },
                        body: {
                            'serviceType': service,
                            'startDate': '1991-04-29T00:00:00.000Z',
                            'endDate': '2091-04-29T00:00:00.000Z',
                            'status': [
                                status
                            ]
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.serviceType).to.be.an('array')
                    expect(response.body.count).to.be.a('number')
                    expect(response.body.entities).to.be.a('number')
                    expect(response.body.severity).to.be.an('object')
                    expect(response.body.category).to.be.an('array')
                    expect(response.body.attackVector).to.be.an('array')
                })
            })
        })
    })

    it(`Get customer alert by id ${baseUrl}${swaggerLinks['get-customer-alert-by-id']}`, function() {
        cy.request(
            {
                method: requestTypes.get,
                url: baseUrl + endpoints.alert['alert'] + '/' + alertIdEdp,
                auth: {
                    'bearer': this.accessToken
                },
                headers: {
                    'x-customer-id': customerId,
                    'x-id-token': this.idToken
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body._id).to.eq(alertIdEdp)
        })
    })

    it(`Change MAIL alert vector ${baseUrl}${swaggerLinks['alert-change-vector']}`, function() {
        cy.request(
            {
                method: requestTypes.get,
                url: baseUrl + endpoints.alert['alert'] + '/' + alertIdMail,
                auth: {
                    'bearer': this.accessToken
                },
                headers: {
                    'x-customer-id': customerId,
                    'x-id-token': this.idToken
                }
            }
        ).should((response) => {
            expect(response.status).to.eq(200)
            cy.wrap(response.body.serviceDetails.verdict.verdict).as('subVerdict')
        })

        cy.get('@subVerdict').then(subVerdict => {
            let verdicts
            
            // get verdicts that !== current verdict
            if(subVerdict == 'Clean'){
                verdicts = [ 'SPM', 'MAL', 'BLK', 'SUS' ]
            }
            if(subVerdict == 'Spam'){
                verdicts = [ 'CLN', 'MAL', 'BLK', 'SUS' ]
            }
            if(subVerdict == 'Malicious'){
                verdicts = [ 'CLN', 'SPM', 'BLK', 'SUS' ]
            }
            if(subVerdict == 'Restricted'){
                verdicts = [ 'CLN', 'SPM', 'MAL', 'SUS' ]
            }
            if(subVerdict == 'Suspicious'){
                verdicts = [ 'CLN', 'SPM', 'MAL', 'BLK' ]
            }

            verdicts.forEach(verdict => {
                cy.request(
                    {
                        method: requestTypes.put,
                        url: baseUrl + endpoints.alert['alert-change-vector'] + '/' + alertIdMail,
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        },
                        body: {
                            'comment': comment,
                            'sub_verdict': verdict,
                            'handle_investigation': true
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(200)
                })
            })
        })
    })

})