#!/bin/bash
# launch main.sh manually (as crontab do)
[[ $OSTYPE == "darwin"* ]] && READ_LINK="greadlink" || READ_LINK="readlink"
HERE=`dirname $(${READ_LINK} -f $0)`

SHEET_ID="xxxxxx"
TOG_TO_GOO="$HERE/main.sh"
LOG="$HERE/togtogo.log"
ADMIN="xxxxxx@xxx.xx"
# m h  dom mon dow   command
[ -f $TOG_TO_GOO ] && bash $TOG_TO_GOO $SHEET_ID 2>&1 | tee -a $LOG || echo "$TOG_TO_GOO FAILED"

