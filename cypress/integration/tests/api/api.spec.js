import {dashboardPageElements} from '../../../components/dashboard.js'
import {signUpPageElements} from '../../../components/sign-up.js'
import {requestTypes, swaggerLinks, endpoints} from '../../../components/endpoints.js'
import {getRandomCharLength, getRandomNumberLength, getCurrentTimeISO} from '../../../support/dataGenerator.js'
import {emailsData} from '../../../components/emailsData.js'

const {generateToken} = require('authenticator')

const baseUrl           = Cypress.env('apiSuite').baseUrl
const signInLink        = Cypress.env('urls').signIn
const email             = Cypress.env('apiSuite').users.first.email
const password          = Cypress.env('apiSuite').users.first.password
const id                = Cypress.env('apiSuite').users.first.id
const firstName         = Cypress.env('apiSuite').users.first.firstName
const lastName          = Cypress.env('apiSuite').users.first.lastName
const phoneNumber       = Cypress.env('apiSuite').users.first.phoneNumber
const status            = Cypress.env('apiSuite').users.first.status
const formattedKey      = Cypress.env('apiSuite').users.first.formattedKey
const resetMfaUserId    = Cypress.env('apiSuite').users.third.id
const customerId        = Cypress.env('apiSuite').customerId
const alertIdEdp        = Cypress.env('apiSuite').alertIds.edp
const alertIdMail       = Cypress.env('apiSuite').alertIds.mail
const alertEventId      = Cypress.env('apiSuite').alertEventId
const roleId            = Cypress.env('apiSuite').roleId
const siteUrl           = Cypress.env('apiSuite').siteUrl
const serverId          = Cypress.env('MAILOSAUR_SERVER_ID')
const emailDomain       = Cypress.env('email_domain')
const alertActions      = ['ALERT_DISMISS', 'ALERT_UNDISMISS']
const serviceTypes      = ['EDP', 'WEB', 'MAIL', 'CLOUD_STORAGE', 'BACKUP', 'VMDR', 'MOBILE', 'AWARENESS', 'ASK_THE_ANALYST']
const aggregate         = ['alerts', 'endpoints', 'users']
const statuses          = ['OPEN', 'CLOSED', 'DISMISSED', 'QUARANTINED']
const comment           = 'cypress_autotest'
const name              = getRandomCharLength(30)
const description       = getRandomCharLength(30)
const permission        = 'GET_PROTECTION_SCORE'
const nameNew           = getRandomCharLength(30)
const descriptionNew    = getRandomCharLength(30)
const permissionNew     = 'USER_SEARCH'
const currentTime       = getCurrentTimeISO()

let formattedToken

describe('API', function() {
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

        // get fixtures
        cy.fixture('alert_event.json').as('alert_event')
        cy.fixture('services.json').as('services')
        cy.fixture('services_customer.json').as('services_customer')
    })

    beforeEach(() => {
        cy.restoreLocalStorage()
    })

    describe('auth', function() {
        it(`Refresh tokens ${baseUrl}${swaggerLinks['refresh-tokens']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.auth['refresh-tokens'],
                    body: {
                        'refreshToken': this.refreshToken,
                        'idToken': this.idToken
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.jwtToken).to.be.a('string')
                expect(response.body.refreshToken).to.be.a('string')
                expect(response.body.idToken).to.be.a('string')
            })
        })
    
        it(`Get Cognito pool settings ${baseUrl}${swaggerLinks['cognito-pool-settings']}`, function() {
            cy.request(
                {
                    method: requestTypes.get,
                    url: baseUrl + endpoints.auth['cognito-pool-settings'] + `?siteUrl=${siteUrl}`
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.region).to.be.a('string')
                expect(response.body.userPoolId).to.be.a('string')
                expect(response.body.userPoolsClientId).to.be.a('string')
            })
        })
    
        it(`Sign in ${baseUrl}${swaggerLinks['sign-in']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.auth['sign-in'],
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
            })
        })
    })

    describe('role', function() {
        it(`Create role ${baseUrl}${swaggerLinks['role-create']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.role['role'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    },
                    body: {
                        'name': name,
                        'permissions': {
                            'root': [
                                permission
                            ],
                            'children': [
                                permission
                            ]
                        },
                        'description': description
                    }
                }
            ).then((response) => {
                expect(response.status).to.eq(201)
                expect(response.body.name).to.eq(name)
                expect(response.body.permissions.root).to.contain(permission)
                expect(response.body.permissions.children).to.contain(permission)
                expect(response.body.description).to.eq(description)
                expect(response.body.createdBy).to.eq(id)
                expect(response.body.createdAt).to.be.a('string')
                expect(response.body.updatedAt).to.be.a('string')
                cy.wrap(response.body._id).as('roleId')
            })
        })
    
        it(`Update role ${baseUrl}${swaggerLinks['role-update']}`, function() {
            cy.request(
                {
                    method: requestTypes.patch,
                    url: baseUrl + endpoints.role['role'] + '/' + this.roleId,
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    },
                    body: {
                        'name': nameNew,
                        'permissions': {
                            'root': [
                                permissionNew
                            ],
                            'children': [
                                permissionNew
                            ]
                        },
                        'description': descriptionNew
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
            })
        })
    
        it(`Get role info ${baseUrl}${swaggerLinks['role-get']}`, function() {
            cy.request(
                {
                    method: requestTypes.get,
                    url: baseUrl + endpoints.role['role'] + '/' + this.roleId,
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
                expect(response.body.name).to.eq(nameNew)
                expect(response.body.permissions.root).to.contain(permissionNew)
                expect(response.body.permissions.children).to.contain(permissionNew)
                expect(response.body.description).to.eq(descriptionNew)
                expect(response.body.createdBy).to.eq(id)
                expect(response.body.createdAt).to.be.a('string')
                expect(response.body.updatedAt).to.be.a('string')
            })
        })
    
        it(`Search role ${baseUrl}${swaggerLinks['role-search']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.role['role-search'],
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    },
                    body: {
                        'fullTextSearch': {
                          'fields': [
                            'description',
                            'name'
                          ],
                          'value': nameNew
                        }
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.records[0]._id).to.eq(this.roleId)
                expect(response.body.records[0].name).to.eq(nameNew)
                expect(response.body.records[0].permissions.root[0]).to.contain(permissionNew)
                expect(response.body.records[0].permissions.children[0]).to.contain(permissionNew)
                expect(response.body.records[0].description).to.eq(descriptionNew)
                expect(response.body.records[0].createdBy).to.eq(id)
                expect(response.body.records[0].createdAt).to.be.a('string')
                expect(response.body.records[0].updatedAt).to.be.a('string')
            })
        })
    
    })

    describe('user', function() {
        describe('existing user', function() {
            it(`Get current user info ${baseUrl}${swaggerLinks['user-me']}`, function() {
                cy.request(
                    {
                        method: requestTypes.get,
                        url: baseUrl + endpoints.user['user-me'],
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
                    expect(response.body.cognitoUserId).to.eq(id)
                    expect(response.body.firstName).to.eq(firstName)
                    expect(response.body.lastName).to.eq(lastName)
                    expect(response.body.email).to.eq(email)
                    expect(response.body.phoneNumber).to.eq(phoneNumber)
                    expect(response.body._id).to.eq(id)
                    expect(response.body.status).to.eq(status)
                })
            })
    
            it(`Get user by id ${baseUrl}${swaggerLinks['get-user-by-id']}`, function() {
                cy.request(
                    {
                        method: requestTypes.get,
                        url: baseUrl + endpoints.user['user'] + '/' + id,
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
                    expect(response.body.cognitoUserId).to.eq(id)
                    expect(response.body.firstName).to.eq(firstName)
                    expect(response.body.lastName).to.eq(lastName)
                    expect(response.body.email).to.eq(email)
                    expect(response.body.phoneNumber).to.eq(phoneNumber)
                    expect(response.body._id).to.eq(id)
                    expect(response.body.status).to.eq(status)
                })
            })
    
            it(`Find user ${baseUrl}${swaggerLinks['find-users']}`, function() {
                cy.request(
                    {
                        method: requestTypes.post,
                        url: baseUrl + endpoints.user['user-search'],
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        },
                        body: {
                            'fullTextSearch': {
                                'fields': [
                                    'email',
                                    'firstName',
                                    'lastName'
                                ],
                                'value': email
                            }
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.records[0].cognitoUserId).to.eq(id)
                    expect(response.body.records[0].firstName).to.eq(firstName)
                    expect(response.body.records[0].lastName).to.eq(lastName)
                    expect(response.body.records[0].email).to.eq(email)
                    expect(response.body.records[0].phoneNumber).to.eq(phoneNumber)
                    expect(response.body.records[0]._id).to.eq(id)
                    expect(response.body.records[0].status).to.eq(status)
                })
            })
        })
    
        describe('existing user - reset & change password', function() {
    
            const resetPswdUserEmail    = Cypress.env('apiSuite').users.second.email
            const resetPswdUserPassword = Cypress.env('apiSuite').users.second.password
    
            it(`Reset password ${baseUrl}${swaggerLinks['user-reset-password']}`, function() {
                cy.request(
                    {
                        method: requestTypes.post,
                        url: baseUrl + endpoints.user['user-password-reset'],
                        body: {
                            'email': resetPswdUserEmail,
                            'siteUrl': siteUrl
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body.email).to.eq(resetPswdUserEmail)
                    expect(response.body.siteUrl).to.eq(siteUrl)
                })
    
                // get code from email
                cy.mailosaurGetMessage(serverId, {
                    sentFrom: emailsData.emails.support,
                    sentTo: resetPswdUserEmail,
                    subject: emailsData.subjects.resetUserPassword
                }, {
                    receivedAfter: new Date(currentTime),
                    timeout: 60000
                }).then(mail => {
                    const body = mail.text.body
                    let confirmationCode = body.split('following verification code\n\n')[1].slice(0,6)
                    cy.log(confirmationCode)
                    cy.wrap(confirmationCode).as('confirmationCode')
                })
            })
    
            it(`Change password ${baseUrl}${swaggerLinks['user-change-password']}`, function() {
                cy.request(
                    {
                        method: requestTypes.post,
                        url: baseUrl + endpoints.user['user-password-change'],
                        body: {
                            'verificationCode': this.confirmationCode,
                            'newPassword': resetPswdUserPassword,
                            'email': resetPswdUserEmail,
                            'siteUrl': siteUrl
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body.email).to.eq(resetPswdUserEmail)
                    expect(response.body.siteUrl).to.eq(siteUrl)
                })
            })
        })
    
        // ! due to bug https://qfortress.atlassian.net/browse/FORT-650
        // todo after fix -> create additional user for this case
        describe.skip('existing user - reset MFA', function() {
            it(`Reset MFA ${baseUrl}${swaggerLinks['reset-user-mfa']}`, function() {
                cy.request(
                    {
                        method: requestTypes.post,
                        url: baseUrl + endpoints.user['user-mfa-reset'],
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-id-token': this.idToken
                        },
                        body: {
                            'userId': resetMfaUserId
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(201)
                })
            })
        })
    
        describe('new user', function() {
    
            const firstName     = 'cypress' + getRandomCharLength(8)
            const lastName      = 'cypress' + getRandomCharLength(8)
            const email         = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + emailDomain
            const phoneNumber   = '+38098' + getRandomNumberLength(7)
    
            it(`Create user ${baseUrl}${swaggerLinks['sign-up']}`, function() {
                cy.request(
                    {
                        method: requestTypes.post,
                        url: baseUrl + endpoints.auth['sign-up'],
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        },
                        body: {
                            'firstName': firstName,
                            'lastName': lastName,
                            'email': email,
                            'phoneNumber': phoneNumber,
                            'roleId': roleId
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.firstName).to.eq(firstName)
                    expect(response.body.lastName).to.eq(lastName)
                    expect(response.body.email).to.eq(email)
                    expect(response.body.phoneNumber).to.eq(phoneNumber)
                    expect(response.body._id).to.eq(response.body.cognitoUserId)
                    cy.wrap(response.body._id).as('userId')
                })
            })
    
            it(`Update user ${baseUrl}${swaggerLinks['update-user']}`, function() {
                cy.request(
                    {
                        method: requestTypes.patch,
                        url: baseUrl + endpoints.user['user'] + '/' + this.userId,
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        },
                        body: {
                            'firstName': firstName,
                            'lastName': lastName,
                            'phoneNumber': phoneNumber,
                            'status': true,
                            'role': 'Organization Admin',
                            'score': 1,
                            'expirationDate': '2121-06-18T11:05:21.270Z',
                            'expirationPass': '2121-06-18T11:05:21.270Z'
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(200)
                })
            })
    
            // ! disabled due to bug https://qfortress.atlassian.net/browse/FORT-523
            it.skip(`Remove user ${baseUrl}${swaggerLinks['remove-user']}`, function() {
                cy.request(
                    {
                        method: requestTypes.post,
                        url: baseUrl + endpoints.user['user-remove'],
                        auth: {
                            'bearer': this.accessToken
                        },
                        headers: {
                            'x-customer-id': customerId,
                            'x-id-token': this.idToken
                        },
                        body: {
                            'userId': this.userId
                        }
                    }
                ).should((response) => {
                    expect(response.status).to.eq(201)
                })
            })
        })
    })

    describe('alert', function() {
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
                            id
                        ]
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.assignedTo[0]._id).to.eq(id)
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
    
    describe('alert-events', function() {
        it(`Get EDP alert events ${baseUrl}${swaggerLinks['search-customer-alerts']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.alert_events['alert-events-search'],
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
                            'take': 25
                        },
                        'fullTextSearch': {
                            'fields': [
                              '_id',
                              'serviceType',
                              'serviceProvider',
                              'type',
                              'details',
                              'alert',
                              'alertNanoid'
                            ],
                            'value': alertIdEdp
                        },
                        'startDate': '1991-04-29T10:48:00.000Z',
                        'endDate': '2091-04-29T10:48:30.000Z'
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.pagination).to.be.an('object')
                expect(response.body.records).to.be.an('array')
                expect(response.body.total).to.be.a('number')
            })
        })
    
        it(`Get EDP alert event info ${baseUrl}${swaggerLinks['get-customer-alert-event-by-id']}`, function() {
            cy.request(
                {
                    method: requestTypes.get,
                    url: baseUrl + endpoints.alert_events['alert-events'] + '/' + alertEventId,
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
                expect(response.body).to.deep.eq(this.alert_event)
            })
        })
    })

    describe('services', function() {  
        it(`Get services info ${baseUrl}${swaggerLinks['services']}`, function() {
            cy.request(
                {
                    method: requestTypes.get,
                    url: baseUrl + endpoints.services['services']
                }
            ).should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.eq(this.services)
            })
        })

        it(`Get services info ${baseUrl}${swaggerLinks['get-all-customer-services']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.services['services-customer'] + '/' + customerId,
                    auth: {
                        'bearer': this.accessToken
                    },
                    headers: {
                        'x-customer-id': customerId,
                        'x-id-token': this.idToken
                    }
                }
            ).should((response) => {
                expect(response.status).to.eq(201)
                expect(response.body).to.deep.eq(this.services_customer)
            })
        })
    })

    describe('sign out', function() {
        it(`Sign out ${baseUrl}${swaggerLinks['sign-out']}`, function() {
            cy.request(
                {
                    method: requestTypes.post,
                    url: baseUrl + endpoints.auth['sign-out'],
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
            })
        })
    })

})