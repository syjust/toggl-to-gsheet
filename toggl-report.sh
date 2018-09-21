#!/bin/bash
TOGGL_REPORTS_API_URL="https://toggl.com/reports/api/v2/details.csv"

if [ -f toggl.conf ] ; then
  source toggl.conf
  [ -z "${TOGGL_API_KEY+x}" ] && echo "TOGGL_API_KEY must be set" && exit 1
  [ -z "${TOGGL_WORKSPACE_ID+x}" ] && echo "TOGGL_WORKSPACE_ID must be set" && exit 1
else
  echo "toggl.conf : file not found"
  exit 1
fi

year=`date "+%Y"`
since="$year-01-01"
until="$year-12-31"
toggl_url="$TOGGL_REPORTS_API_URL?workspace_id=$TOGGL_WORKSPACE_ID&since=$since&until=$until&user_agent=api_test"

curl -u $TOGGL_API_KEY:api_token -X GET $toggl_url > toggl-reports-$year.csv
