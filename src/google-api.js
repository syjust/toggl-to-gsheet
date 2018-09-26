const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const GoogleAuth = require(__dirname+'/google-auth.js');

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
        range: 'Class Data!A2:E'
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        if (self.callbacks.getMajors !== undefined) {
          self.callbacks.getMajors(res);
        }
      });
    }

    this.setSheet = function(auth) {
      var good_sheet    = "1DWRHTx-i4_khB4A6nja54JJ02hPgcXMUY9EsG_d20x4/edit#gid=1703643935";
      var default_sheet = "1DWRHTx-i4_khB4A6nja54JJ02hPgcXMUY9EsG_d20x4";
      const sheets = google.sheets({version: 'v4', auth});
      sheets.spreadsheets.values.update({
        spreadsheetId: default_sheet,
        range: 'Toggl_time_entries_2018-01-01_to_2018-12-31!A:N',
        valueInputOption: 'RAW',
        resource: {
            "range": 'Toggl_time_entries_2018-01-01_to_2018-12-31!A:N',
            "majorDimension": 'ROWS',
            "values": [
              [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N' ],
              [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N' ],
              [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N' ],
              [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N' ],
              [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N' ],
              [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N' ],
            ]
        }
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        if (self.callbacks.setSheet !== undefined) {
          self.callbacks.setSheet(res);
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

  /**
   * @function updateSheet
   *
   * @param callback
   */
  updateSheet(callback = undefined) {
    if (callback !== undefined) {
      this.callbacks.setSheet = callback;
    }
    this.gAuth.loadGoogleApi(this.setSheet);
  }

}
