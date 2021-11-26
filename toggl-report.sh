#!/bin/bash
TOGGL_REPORTS_API_URL="https://api.track.toggl.com/reports/api/v2/details.csv"
CONF="toggl.conf"

# {{{ function usage
#
usage() {
  color_and_prefix _cyan "$0 [YEAR]"
  info
  desc="This script retrive toggl inputs for current YEAR (or given YEAR formatted as 2YYY)"
  desc="$desc\nand write it into the file toggl-reports-YEAR.csv"
  info "$desc"
  info
  info "In the automatic mode (current YEAR by default), for first of january (YEAR-01-01),"
  info "last YEAR is used to update YEAR-1 toggl inputs"
  info
  info "Toggl workspace id & token must be declared in file '$CONF'"
  info
  info "Default api_url is '$TOGGL_REPORTS_API_URL'"
  info "(you can override it with TOGGL_REPORTS_API_URL in file '$CONF')"
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

# {{{ loading conf
if [ -f $CONF ] ; then
  source $CONF
  [ -z "${TOGGL_API_KEY+x}" ]      && quit "TOGGL_API_KEY must be set"
  [ -z "${TOGGL_WORKSPACE_ID+x}" ] && quit "TOGGL_WORKSPACE_ID must be set"
  [ -z "${TOGGL_API_KEY}" ]        && quit "TOGGL_API_KEY must NOT be empty"
  [ -z "${TOGGL_WORKSPACE_ID}" ]   && quit "TOGGL_WORKSPACE_ID must NOT be empty"
else
  quit "$CONF : file not found"
fi
# }}}

# {{{ loading parameters : only 'year' for moment
source inc/load-year.inc.sh
# }}}

since="$year-01-01"
until="$year-12-31"
toggl_url="$TOGGL_REPORTS_API_URL?workspace_id=$TOGGL_WORKSPACE_ID&since=$since&until=$until&user_agent=api_test"
csv_file="toggl-reports-$year.csv"

curl -u "$TOGGL_API_KEY:api_token" -X GET "$toggl_url" > $csv_file || quit "curl fail"
