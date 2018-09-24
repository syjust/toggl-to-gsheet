const GoogleSheetApi = require(__dirname+'/src/google-api.js');

gApi = new GoogleSheetApi();
//gApi.listMajors(printMajors);
gApi.updateSheet(printSheet);

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
function printSheet(res) {
  var rows = res.data.values;
  if (rows.length) {
    console.log('sheet');
    // Print columns A and E, which correspond to indices 0 and 4.
    rows.map((row) => {
      console.log(JSON.stringify(row));
    });
  } else {
    console.log('No data found.');
  }
}
