export const migrationScript = function(data) {
  Object.keys(data.clubs).forEach(key => {
    const club = data.clubs[key];

    if (club.hasOwnProperty('fullNameEN')) {
      club.fullNameInt = club.fullNameEN;

      delete club.fullNameEN;
    }

    if (club.hasOwnProperty('fullNameUA')) {
      club.fullName = club.fullNameUA;

      delete club.fullNameUA;
    }

    if (club.hasOwnProperty('shortNameEN')) {
      club.shortNameInt = club.shortNameEN;

      delete club.shortNameEN;
    }

    if (club.hasOwnProperty('shortNameUA')) {
      club.shortName = club.shortNameUA;

      delete club.shortNameUA;
    }

    if (club.hasOwnProperty('address')) {
      club.city = club.address.city || '';
      club.line = club.address.line || '';
      club.postCode = club.address.postCode || '';
      club.country = club.address.country || '';
      club.region = '';

      delete club.address;
    }
  });

  Object.keys(data.players).forEach(key => {
    const player = data.players[key];

    if (player.hasOwnProperty('firstNameEN')) {
      player.firstNameInt = player.firstNameEN;

      delete player.firstNameEN;
    }

    if (player.hasOwnProperty('firstNameUA')) {
      player.firstName = player.firstNameUA;

      delete player.firstNameUA;
    }

    if (player.hasOwnProperty('lastNameEN')) {
      player.lastNameInt = player.lastNameEN;

      delete player.lastNameEN;
    }

    if (player.hasOwnProperty('lastNameUA')) {
      player.lastName = player.lastNameUA;

      delete player.lastNameUA;
    }

    if (player.hasOwnProperty('secondNameUA')) {
      player.secondName = player.secondNameUA;

      delete player.secondNameUA;
    }

    if (player.hasOwnProperty('license')) {
      player.license = parseInt(player.license);
    }

    if (player.hasOwnProperty('endActivationDate')) {
      player.lastActiveSeason = player.endActivationDate;

      delete player.endActivationDate;
    }

    if (player.hasOwnProperty('taxnumber')) {
      player.uniqueExternId = player.taxnumber;

      delete player.taxnumber;
    } else if (!player.hasOwnProperty('uniqueExternId')) {
      player.uniqueExternId = '0000000000';
    }

    if (player.hasOwnProperty('club')) {
      const playerTransfers = Object.entries(data.transfers)
        .filter((transfer) => transfer[1].player === key);

      if (playerTransfers.length > 1) {
        playerTransfers.sort((transferA, transferB) => (
          transferA[1].date - transferB[1].date
        ));

        player.firstClub = playerTransfers[0][1].fromClub;
        player.lastTransfer = playerTransfers[playerTransfers.length - 1][0];
      } else if (playerTransfers.length === 1) {
        player.firstClub = playerTransfers[0][1].fromClub;
        player.lastTransfer = playerTransfers[0][0];
      } else {
        player.firstClub = player.club;
        player.lastTransfer = '';
      }

      delete player.club;
    }
  });

  return data;
};
