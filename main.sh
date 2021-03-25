#!/bin/bash

# {{{ function usage
#
usage() {
  echo
  color_and_prefix _cyan "$0 [OPTIONS] SPREADSHEETID [YEAR]"
  echo
  info "This script manage TOGGL_SH & GOOGLE_JS scripts to work with YEAR (if given, else, the current year is used)"
  info "TOGGL_SH script retrieve toggl inputs for YEAR given"
  info "GOOGLE_JS script send toggle-reports-YEAR.csv into YEAR tab of configured spreadsheet"
  info "tab Toggl_time_entries_YEAR-01-01_to_YEAR-12-31 must exists in target spreadsheet given as argument with SPREADSHEETID"
  echo
  info "\t[OPTIONS] can be on of following parameters"
  info "\t\t-h|--help    print this message and exit without error code"
  echo
}
export -f usage
# }}}

[[ $OSTYPE == "darwin"* ]] && READ_LINK="greadlink" || READ_LINK="readlink"
HERE=`dirname $(${READ_LINK} -f $0)`
cd $HERE

# {{{ include log.inc.sh
if [ -f $HERE/inc/log.inc.sh ] ; then
  source $HERE/inc/log.inc.sh
else
  echo "$HERE/inc/log.inc.sh : file not found"
  exit 1
fi
# }}}

# {{{ working on OPTIONS
while [ ! -z "$1" -a "x${1:0:1}" == "x-" ] ; do
  case $1 in
    -h|--help) usage ; exit 0 ;;
    *) quit "'$1' : invalid options" ;;
  esac
  shift
done
# }}}

# {{{ Testing script availability
YEAR_SH="$HERE/inc/load-year.inc.sh"
TOGGL_SH="$HERE/toggl-report.sh"
GOOGLE_JS="$HERE/app.js"

for script in YEAR_SH TOGGL_SH GOOGLE_JS ; do
  [ -f "${!script}" ] || quit "${!script} : $script script not found"
done
# }}}

# {{{ loading parameters : 'YEAR' and 'SPREADSHEETID' as parameters
# @param $1 SPREADSHEETID
# @param $2 [YEAR]
[ -z $1 ] && quit "I need SPREADSHEETID as first argument"
spreadsheetId=$1 ; shift
source $HERE/inc/load-year.inc.sh
# }}}

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
  node $GOOGLE_JS -c $spreadsheetId -s $year
}
export -f do_google
# }}}

# {{{ function do_toggl
# generate toogle-reports.csv script
# @param $1 year as int
#
do_toggl() {
  local year="$1"
  $TOGGL_SH $year
}
export -f do_toggl
# }}}

# Launch all actions
do_it toggl "$year" \
  && do_it google "$spreadsheetId" "$year"
