/* eslint-disable one-var */
'use strict';

import fs from 'fs';

const filename = './floorball-prod-export.json';
const rawdata = fs.readFileSync(filename);

const data = JSON.parse(rawdata);

// do smth with data here

const playersKeys = Object.keys(data.players);

playersKeys.forEach(pk => {
  const player = data.players[pk];

  if (player && (player.endActivationDate === 1627682400000 || player.endActivationDate === 1630360800000)) {
    player.endActivationDate = 1625004000000;
  }
});

// save data here
fs.writeFileSync('./db_converted.json', JSON.stringify(data));
