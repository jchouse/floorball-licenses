/* eslint-disable one-var */
'use strict';

import fs from 'fs';
import { migrationScript } from './migrationsScript.js';

const filename = './floorball-prod-export.json';
const rawdata = fs.readFileSync(filename);

const data = JSON.parse(rawdata);

// do smth with data here

const DBconverted = migrationScript(data);

// save data here
fs.writeFileSync('./db_converted.json', JSON.stringify(DBconverted));
