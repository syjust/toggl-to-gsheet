const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const GoogleAuth = require('./google-auth.js');

module.exports = class GoogleSheetApi {

  /**
   * @param {callbacks} map with action to do for each functions
   */
  constructor(callbacks = {}) {
    this.gAuth = new GoogleAuth();
    this.callbacks = callbacks ;

    this.initBoundedFunctions();
  }

  /**
   * @function initBoundedFunctions
   *
   * define here functions that need to be used as callback with this references inside them
   */
  initBoundedFunctions() {
    var self = this;

    /**
     * @function getMajors
     *
     * Get the names and majors of students in a sample spreadsheet:
     *
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     */
    this.getMajors = function(auth) {
      const sheets = google.sheets({version: 'v4', auth});
      sheets.spreadsheets.values.get({
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        if (self.callbacks.getMajors !== undefined) {
          self.callbacks.getMajors(res);
        }
      });
    }
  }

  /**
   * @function listMajors
   *
   * @param callback
   */
  listMajors(callback = undefined) {
    if (callback !== undefined) {
      this.callbacks.getMajors = callback;
    }
    this.gAuth.loadGoogleApi(this.getMajors);
  }

}
