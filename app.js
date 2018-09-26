const program = require('commander');
const GoogleSheetApi = require(__dirname+'/src/google-api.js');

var csvFile;
program
  .version('0.0.1')
  .usage('[options] [file]')
  .option('-c, --custom-spreadsheet <spreadsheet>', 'give a custom spreadsheet id as argument')
  .option('-p, --print-majors', 'print majors of example spreadsheet (this is default behavior)')
  .option('-s, --sync-sheet', 'sync toggl (given in csv file) to spreadsheet')
  .arguments('[file]')
  .action(function(file) {
    csvFile = file;
  })
  .parse(process.argv);

gApi = new GoogleSheetApi();
if (program.printMajors) {
  gApi.listMajors(printMajors);
} else if (program.syncSheet) {
  gApi.updateSheet(syncSheet);
} else {
  console.error('none of -p or -s are selected');
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
  console.log(JSON.stringify(res.data));
  var rows = res.data.values;
  if (!!rows && !!rows.length) {
    console.log('sheet');
    // Print columns A and E, which correspond to indices 0 and 4.
    rows.map((row) => {
      console.log(JSON.stringify(row));
    });
  } else {
    console.log('No data found.');
  }
}
