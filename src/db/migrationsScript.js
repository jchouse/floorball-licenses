export const migrationScript = function (data) {
  Object.keys(data.clubs).forEach(key => {
    const club = data.clubs[key];

    if (Object.prototype.hasOwnProperty.call(club, 'fullNameEN')) {
      club.fullNameInt = club.fullNameEN;

      delete club.fullNameEN;
    }

    if (Object.prototype.hasOwnProperty.call(club, 'fullNameUA')) {
      club.fullName = club.fullNameUA;

      delete club.fullNameUA;
    }

    if (Object.prototype.hasOwnProperty.call(club, 'shortNameEN')) {
      club.shortNameInt = club.shortNameEN;

      delete club.shortNameEN;
    }

    if (Object.prototype.hasOwnProperty.call(club, 'shortNameUA')) {
      club.shortName = club.shortNameUA;

      delete club.shortNameUA;
    }

    if (Object.prototype.hasOwnProperty.call(club, 'address')) {
      club.city = club.address.city || '';
      club.line = club.address.line || '';
      club.postCode = club.address.postCode || '';
      club.country = club.address.country || '';
      club.region = '';

      delete club.address;
    }

    if (!club.added) {
      club.added = new Date().valueOf();
    }

    if (!club.founded) {
      club.founded = new Date().valueOf();
    }
  });

  Object.keys(data.players).forEach(key => {
    const player = data.players[key];

    if (Object.prototype.hasOwnProperty.call(player, 'firstNameEN')) {
      player.firstNameInt = player.firstNameEN;

      delete player.firstNameEN;
    }

    if (Object.prototype.hasOwnProperty.call(player, 'firstNameUA')) {
      player.firstName = player.firstNameUA;

      delete player.firstNameUA;
    }

    if (Object.prototype.hasOwnProperty.call(player, 'lastNameEN')) {
      player.lastNameInt = player.lastNameEN;

      delete player.lastNameEN;
    }

    if (Object.prototype.hasOwnProperty.call(player, 'lastNameUA')) {
      player.lastName = player.lastNameUA;

      delete player.lastNameUA;
    }

    if (Object.prototype.hasOwnProperty.call(player, 'secondNameUA')) {
      player.secondName = player.secondNameUA;

      delete player.secondNameUA;
    }

    if (Object.prototype.hasOwnProperty.call(player, 'license')) {
      player.license = parseInt(player.license);
    }

    if (Object.prototype.hasOwnProperty.call(player, 'licenseType')) {
      const _licenseType = player.licenseType;

      if (_licenseType === 'SENIOR' || _licenseType === 'Adult_A') {
        player.licenseType = 'Adult_1';
      } else if (_licenseType === 'JUNIOR' || _licenseType === 'Junior_A') {
        player.licenseType = 'Junior_1';
      } else if (_licenseType === 'Junior_B') {
        player.licenseType = 'Junior_2';
      } else if (_licenseType === 'Adult_B') {
        player.licenseType = 'Adult_2';
      }
    }

    if (Object.prototype.hasOwnProperty.call(player, 'endActivationDate')) {
      player.lastActiveSeason = player.endActivationDate;

      delete player.endActivationDate;
    }

    if (Object.prototype.hasOwnProperty.call(player, 'taxnumber')) {
      player.uniqueExternId = player.taxnumber;

      delete player.taxnumber;
    } else if (!Object.prototype.hasOwnProperty.call(player, 'uniqueExternId')) {
      player.uniqueExternId = '0000000000';
    }

    if (Object.prototype.hasOwnProperty.call(player, 'club')) {
      const playerTransfers = Object.entries(data.transfers)
        .filter(([, transfer]) => transfer.player === key && !transfer.endDate)
        .sort(([, a], [, b]) => a.startDate - b.startDate);

      if (playerTransfers.length > 0) {
        playerTransfers.sort((transferA, transferB) => (
          transferA[1].date - transferB[1].date
        ));

        const [[ ,firstTransfer ]] = playerTransfers;

        player.firstClub = firstTransfer.fromClub;

        const [ , lastTransfer ] = playerTransfers[playerTransfers.length - 1];

        player.currentClub = lastTransfer.toClub;
      } else {
        player.firstClub = player.club;
        player.currentClub = player.club;
      }

      delete player.club;
    }

    if (Object.prototype.hasOwnProperty.call(player, 'lastTransfer')) {
      delete player.lastTransfer;
    }
  });

  return data;
};
