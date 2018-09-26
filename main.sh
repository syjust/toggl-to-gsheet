#!/bin/bash

# {{{ function usage
#
usage() {
  color_and_prefix _cyan "$0 SPREADSHEETID [YEAR]"
  info
  info "This script manage TOGGL & GOOGLE scripts to work with YEAR (if given, else, the current year is used)"
  info "TOGGL script retrieve toggl inputs for YEAR given"
  info "GOOGLE script send toggle-reports-YEAR.csv into YEAR tab of configured spreadsheet"
  info "tab Toggl_time_entries_YEAR-01-01_to_YEAR-12-31 must exists in target spreadsheet given as argument with SPREADSHEETID"
}
export -f usage
# }}}

HERE=`dirname $0`

# {{{ include log.inc.sh
if [ -f $HERE/inc/log.inc.sh ] ; then
  source $HERE/inc/log.inc.sh
else
  echo "$HERE/inc/log.inc.sh : file not found"
  exit 1
fi
# }}}

cd $HERE

# {{{ loading parameters : 'YEAR' and 'SPREADSHEETID' as parameter
# @param $1 SPREADSHEETID
# @param $2 [YEAR]
[ -z $1 ] && quit "I need SPREADSHEETID as first argument"
spreadsheetId=$1 ; shift
source $HERE/inc/load-year.inc.sh
# }}}

TOGGL="./toggl-report.sh"
GOOGLE="app.js"

for script in TOGGL GOOGLE ; do
  [ -f "${!script}" ] || quit "${!script} : $script script not found"
done

# generate toogle-reports.csv script && send it to google spreadsheet
$TOGGL $year \
  && node $GOOGLE -c $spreadsheetId -s $year
