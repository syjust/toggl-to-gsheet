#!/bin/bash

if [ -z "$1" ] ; then
  # auto year
  year=`date "+%Y"`
  month=`date "+%m"`
  day=`date "+%d"`
  if [ "x$month" == "x01" -a "x$day" == "x01" ] ; then
    # taking last year please
    let year--
  fi
else
  # manual year
  year="$1"
  shift
  if ! [[ $year =~ ^2[0-9]{3}$ ]] ; then
    quit "'$year' : YEAR is not well formatted"
  fi
fi
