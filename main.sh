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

[[ $OSTYPE == "darwin"* ]] && READ_LINK="greadlink" || READ_LINK="readlink"
HERE=`dirname $(${READ_LINK} -f $0)`

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

# {{{ function do_it
#
do_it() {
  func="$1"
  shift
  info "launching '$func'"
  do_${func} $@ \
    && success "'$func' works fine'" \
    || quit "'$func' FAIL"
}
export -f do_it
# }}}

# {{{ function do_google
# send toggl-reports-YEAR.csv to google spreadsheet
# @param $1 spreadsheetId as string
# @param $2 year as int
#
do_google() {
  local spreadsheetId="$1"
  local year="$2"
  node $GOOGLE -c $spreadsheetId -s $year
}
export -f do_google
# }}}

# {{{ function do_toggl
# generate toogle-reports.csv script
# @param $1 year as int
#
do_toggl() {
  local year="$1"
  $TOGGL $year
}
export -f do_toggl
# }}}

# Launch all actions
do_it toggl "$year" \
  && do_it google "$spreadsheetId" "$year"
