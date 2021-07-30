export const requestTypes = {
  'get': 'GET',
  'post': 'POST',
  'put': 'PUT',
  'patch': 'PATCH',
  'delete': 'DELETE'
}

export const swaggerLinks = {
  'refresh-tokens': '/api/#/auth/refreshTokens',
  'cognito-pool-settings':'/api/#/auth/getCognitoPoolSettings',
  'sign-up': '/api/#/auth/signUp',
  'sign-in': '/api/#/auth/signIn',
  'sign-out': '/api/#/auth/signOut',
  'role-create': '/api/#/role/createRole',
  'role-update': '/api/#/role/updateRole',
  'role-get': '/api/#/role/getRole',
  'role-search': '/api/#/role/searchForRoles',
  'user-me': '/api/#/user/getMe',
  'get-user-by-id': '/api/#/user/getUserById',
  'update-user': '/api/#/user/updateUser',
  'find-users': '/api/#/user/findUsers',
  'user-change-password': '/api/#/user/userChangePassword',
  'user-reset-password': '/api/#/user/userResetPassword',
  'reset-user-mfa': '/api/#/user/resetUserMFA',
  'remove-user': '/api/#/user/removeUser',
  'search-customer-alerts': '/api/#/alert/searchCustomerAlerts',
  'alert-action': '/api/#/alert/alertsAction',
  'alert-assign': '/api/#/alert/assignUser',
  'get-customer-alerts-statistics': '/api/#/alert/getCustomerAlertsStatistics',
  'get-customer-top-statistics': '/api/#/alert/getCustomerTopStatistics',
  'get-service-alerts-statistics': '/api/#/alert/getServiceAlertsStatistics',
  'get-customer-alert-by-id': '/api/#/alert/getCustomerAlertById',
  'alert-change-vector': '/api/#/alert/changeVector',
  'search-customer-alert-events': '/api/#/alert-events/searchCustomerAlertsEvents',
  'get-customer-alert-event-by-id': '/api/#/alert-events/getCustomerAlertEventById',
  'services': '/api/#/services',
  'get-all-customer-services': '/api/#/services/getAllCustomerServices',
  'order-service-licenses': '/api/#/service-licenses/orderServiceLicenses',
  'setup-service-policies': '/api/#/service-licenses/setupServicePolicies',
  'activate-trial-service-license': '/api/#/service-licenses/activateTrialServiceLicense',
  'search-customer-service-licenses': '/api/#/service-licenses/searchCustomerServiceLicenses',
  'search-customer-children-service-licenses': '/api/#/service-licenses/searchCustomerChildrenServiceLicenses',
  'get-service-license': '/api/#/service-licenses/getServiceLicense',
  'setup-service-account': '/api/#/service-accounts/setupServiceAccount',
  'search-customer-service-accounts': '/api/#/service-accounts/searchCustomerServiceAccounts',
  'get-service-account': '/api/#/service-accounts/getServiceAccount',
  'service-account-action': '/api/#/service-accounts/serviceAccountAction'
}

export const endpoints = {
  'auth': {
    'refresh-tokens':'/auth/refresh-tokens',
    'cognito-pool-settings':'/auth/cognito-pool-settings',
    'sign-up':'/auth/sign-up',
    'sign-in': '/auth/sign-in',
    'sign-out': '/auth/sign-out'
  },
  'role': {
    'role': '/role',
    'role-search': '/role/search'
  },
  'user': {
    'user-me': '/user/me',
    'user': '/user',
    'user-search': '/user/search',
    'user-password-change': '/user/password/change',
    'user-password-reset': '/user/password/reset',
    'user-mfa-reset': '/user/mfa/reset',
    'user-remove': '/user/remove'
  },
  'alert': {
    'alert-search': '/alert/search',
    'alert-action': '/alert/action',
    'alert-assign': '/alert/assign',
    'alert-customer-statistics': '/alert/customer-statistics',
    'alert-customer-top-statistics': '/alert/customer-top-statistics',
    'alert-service-statistics': '/alert/service-statistics',
    'alert': '/alert',
    'alert-change-vector': '/alert/change-vector'
  },
  'alert_events': {
    'alert-events-search': '/alert-events/search',
    'alert-events': '/alert-events'
  },
  'services': {
    'services': '/services',
    'services-customer': '/services/customer'
  },
  'service_licenses': {
    'service-licenses-order': '/service-licenses/order',
    'setup-service-policies': '/service-licenses/policies',
    'service-license-activate-trial': '/service-licenses/activateTrial',
    'service-licenses-search': '/service-licenses/search',
    'service-licenses-children-search': '/service-licenses/search/children',
    'get-service-license': '/service-licenses'
  },
  'service_accounts': {
    'setup-service-account': '/service-accounts/setup',
    'service-accounts-search': '/service-accounts/search',
    'get-service-account': '/service-accounts',
    'service-accounts-action': '/service-accounts/action'
  }
}