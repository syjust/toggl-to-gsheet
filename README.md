Installation
====

git clone project & install dependencies with npm

```
npm install googleapis@27 --save
npm install commander --save
npm install csvtojson --save
```

Launch
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
