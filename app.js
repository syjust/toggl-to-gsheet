const program = require('commander');
const GoogleSheetApi = require(__dirname+'/src/google-api.js');
const csv = require('csvtojson');

program
  .version('0.0.1')
  .option('-c, --custom-spreadsheet <spreadsheet>', 'give a custom spreadsheet id as argument')
  .option('-p, --print-majors', 'print majors of example spreadsheet (this is default behavior)')
  .option('-s, --sync-sheet <YEAR>', 'sync toggl (given in toggle-reports-YEAR.csv file) to spreadsheet', parseInt)
  .parse(process.argv);

gApi = new GoogleSheetApi();
if (!!program.printMajors && !!program.syncSheet) {
  console.error('please choose only one option between -p & -s');
  return process.exit(1);
}
if (!!program.printMajors) {
  gApi.listMajors({
    callback: printMajors,
    spreadsheetId: (!!program.customSpreadsheet) ? program.customSpreadsheet : '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  });
} else if (!!program.syncSheet) {
  csv({
    output: 'csv'
  })
  .fromFile(`toggl-reports-${program.syncSheet}.csv`)
  .then((jsonObj)=>{
    gApi.updateSheet({
      // sheet.range must be exists
      range: `Toggl_time_entries_${program.syncSheet}-01-01_to_${program.syncSheet}-12-31!A2:N`,
      data: jsonObj,
      callback: syncSheet,
      spreadsheetId: program.customSpreadsheet
    });
  });
} else {
  console.error('none of -p or -s are selected');
  return process.exit(1);
}

function printMajors(res) {
  var rows = res.data.values;
  if (rows.length) {
    console.log('Name, Major:');
    // Print columns A and E, which correspond to indices 0 and 4.
    rows.map((row) => {
      console.log(`${row[0]}, ${row[4]}`);
    });
  } else {
    console.log('No data found.');
  }
}
function syncSheet(res) {
  //console.log(res.data);
  if (!!res.data) {
    console.log(`Updated SpreadSheet ID:"${res.data.spreadsheetId}"`);
    console.log(`Updated range:"${res.data.updatedRange}"`);
  } else {
    console.log('No data found.');
  }
}
