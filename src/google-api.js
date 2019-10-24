const {google} = require('googleapis');
const GoogleAuth = require(__dirname+'/google-auth.js');

module.exports = class GoogleSheetApi {

  /**
   * {{{ @function constructor
   * @param {configs} map with action to do for each configs
   */
  constructor(configs = {}) {
    this.gAuth = new GoogleAuth();
    this.configs = configs;

    this.initBoundedFunctions();
  }
  // }}}

  /**
   * {{{ @function initBoundedFunctions
   *
   * define here configs that need to be used as callback with this references inside them
   */
  initBoundedFunctions() {
    var self = this;

    /**
     * {{{ @function getMajors
     *
     * Get the names and majors of students in a sample spreadsheet:
     *
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     */
    this.getMajors = function(auth) {
      const config = self.configs.getMajors;
      const sheets = google.sheets({version: 'v4', auth});
      sheets.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: 'Class Data!A2:E'
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        if (config.callback !== undefined) {
          config.callback(res);
        }
      });
    }
    // }}}

    /**
     * {{{ @function setSheet
     */
    this.setSheet = function(auth) {
      const config = self.configs.setSheet
      const sheets = google.sheets({version: 'v4', auth});
      sheets.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range: config.range,
        valueInputOption: 'USER_ENTERED',
        //responseDateTimeRenderOption: "SERIAL_NUMBER",
        resource: {
            range: config.range,
            "majorDimension": 'ROWS',
            "values": config.data
        }
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        if (config.callback !== undefined) {
          config.callback(res);
        }
      });
    }
    // }}}
  }
  // }}}

  /**
   * @function listMajors
   *
   * @param callback
   */
  listMajors(config = {}) {
    this.configs.getMajors = config;
    this.gAuth.loadGoogleApi(this.getMajors);
  }

  /**
   * @function updateSheet
   *
   * @param callback
   */
  updateSheet(config = {}) {
    this.configs.setSheet = config;
    this.gAuth.loadGoogleApi(this.setSheet);
  }

}
