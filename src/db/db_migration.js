/* eslint-disable one-var */
'use strict';

const fs = require('fs');

const filename = './floorball-b5840-export.json';
const rawdata = fs.readFileSync(filename);

const data = JSON.parse(rawdata);

// do smth with data here

// save data here
fs.writeFileSync('./db_conveted.json', JSON.stringify(data));
