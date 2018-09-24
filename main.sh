#!/bin/bash

# {{{ function usage
#
usage() {
  color_and_prefix _cyan "$0 [YEAR]"
  info
  info "This script manage TOGGL & GOOGLE scripts to work with YEAR (if given, else, the current year is used)"
  info "TOGGL script retrieve toggl inputs for YEAR given"
  info "GOOGLE script send toggle-reports-YEAR.csv into YEAR tab of configured spreadsheet"
}
export -f usage
# }}}

# {{{ include log.inc.sh
if [ -f inc/log.inc.sh ] ; then
  source inc/log.inc.sh
else
  echo "inc/log.inc.sh : file not found"
  exit 1
fi
# }}}

# {{{ loading parameters : only 'year' for moment
source inc/load-year.inc.sh
# }}}

TOGGL="toggl-report.sh"
GOOGLE="app.js"

for script in TOGGL GOOGLE ; do
  [ -f "${!script}" ] || quit "${!script} : $script script not found"
done

$TOGGL $year
node $GOOGLE toggle-reports-$year.csv
