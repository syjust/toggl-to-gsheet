Description
====

This scripts synchronize toggl workspace with a specific google spreadsheet

**USE THIS SCRIPT AT YOUR OWN RISK**

Installation
====

git clone project & install dependencies with npm

```
npm install googleapi@27 --save
npm install commander --save
npm install csvtojson --save
```

Configuration
====

From console.google.com :

* Swith on the spreadsheet api
* Then, import your credentials.json

```
cp toggl.conf-sample toggl.conf
```

Edit toggl.conf with your prefered editor and set your own values for :

* TOGGL_API_KEY
* TOGGL_WORKSPACE_ID

Launch application
====

Main script launch toggl.sh && node app.js with arguments given :

* SPREADSHEET_ID as first one
* [YEAR] as second one

```
bash main.sh $SPREADSHEET_ID
```

Usage(s)
====

You can update main as you want using followings scripts instructions

```
bash ./toggle.sh -h
node app.js -h
```

Crontab installation
====

You can install a crontab based on file crontab-sample with following command. (copy content of file in your favorite editor)

```
crontab -e
```
