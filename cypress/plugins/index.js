/// <reference types="cypress" />
/// <reference types="@shelex/cypress-allure-plugin" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const allureWriter = require('@shelex/cypress-allure-plugin/writer')

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  allureWriter(on, config)
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {

      // ** CHROME ARGS https://peter.sh/experiments/chromium-command-line-switches
      launchOptions.args.push('--window-size=1920,1080')
      launchOptions.args.push('--disable-dev-shm-usage')
      // launchOptions.args.push('--auto-open-devtools-for-tabs');

      /** 
      * * CHROME LAUNCH PREFERENCES https://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/pref_names.cc?view=markup
      * * Cypress doc https://docs.cypress.io/api/plugins/browser-launch-api#Modify-browser-launch-arguments-preferences-and-extensions
      * in Chromium, preferences can exist in Local State, Preferences, or Secure Preferences
      * via launchOptions.preferences, these can be acccssed as `localState`, `default`, and `secureDefault`
      * for example, to set `somePreference: true` in Preferences:
      * launchOptions.preferences.default['preference'] = true;
      * launchOptions.preferences.default['preference'] = 'string';
      * launchOptions.preferences.default['preference'] = 12345;
      */

      // * CHROME EXTENSIONS https://docs.cypress.io/api/plugins/browser-launch-api#Modify-browser-launch-arguments-preferences-and-extensions
      // launchOptions.extensions.push('/path/to/extension');

      console.log(launchOptions.args)

      return launchOptions
    }
  })
  return config
}