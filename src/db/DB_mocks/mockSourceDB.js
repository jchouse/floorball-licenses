/* eslint-disable max-len */
export const mockSourcedDB = {
  clubs: {
    'club-key-1' : {
      'address' : {
        'city' : 'м. City',
        'country' : 'Україна',
        'line' : 'вул. Street, 12/2',
        'postCode' : '88000',
      },
      'email' : 'name.name@gmail.com',
      'fullNameEN' : 'Floorball Club \'Alfa\'',
      'fullNameUA' : 'Флорбольний клуб \'Альфа\'',
      'phone' : '+380990000000',
      'photo' : 'photo-key-1',
      'shortNameEN' : 'FlC \'Alfa\'',
      'shortNameUA' : 'ФЛК \'Альфа\'',
      'url' : '',
    },
    'club-key-2' : {
      'address' : {
        'city' : 'м. Київ',
        'country' : 'Ukraine',
        'line' : 'пр-т. Avenue, 18/18',
        'postCode' : '02000',
      },
      'email' : 's.syrkin@gmail.com',
      'fullNameEN' : 'Kyiv Floorball Club',
      'fullNameUA' : 'Київський флорбольний клуб',
      'phone' : '+38 097 000 00 00',
      'photo' : 'photo-key-2',
      'shortNameEN' : 'KFC',
      'shortNameUA' : 'КФК',
      'url' : '',
    },
    'club-key-3' : {
      'address' : {
        'city' : 'м. Луцьк',
        'country' : 'Україна',
        'line' : 'вул. Станіславського',
        'postCode' : '43000',
      },
      'email' : 'icebergfimiam@gmail.com',
      'fullNameEN' : 'Sport Club \'Fimiam\'',
      'fullNameUA' : 'Громадська організація спортивний клуб \'Фіміам\'',
      'phone' : '+380950000000, +380500000000',
      'photo' : 'photo-key-3',
      'shortNameEN' : 'SC \'Iceberg-Fimiam\'',
      'shortNameUA' : 'СК \'Айсберг-Фіміам\'',
      'url' : '',
    },
  },
  'counters' : {
    'playerID' : 1983,
  },
  'images' : {
    'photo-key-1' : {
      'downloadURL' : 'Some str with url',
      'fileName' : 'some file name',
      'lastModified' : 1487169999000,
      'md5Hash' : 'asjdkhkajsdhkjhasd',
      'size' : 68928,
      'tags' : [ 'iceberg' ],
      'type' : 'image/jpeg',
    },
    'photo-key-2' : {
      'downloadURL' : 'Some str with url',
      'fileName' : 'Name.jpg',
      'lastModified' : 1487170002000,
      'md5Hash' : 'qS284P1ktF4EPJVUT+s7OQ==',
      'size' : 80912,
      'tags' : [ 'iceberg' ],
      'type' : 'image/jpeg',
    },
    'photo-key-3' : {
      'downloadURL' : '',
      'fileName' : 'Some Name.jpg',
      'lastModified' : 1487170038000,
      'md5Hash' : 'rl5INeorusR7cg7auEH+XA==',
      'size' : 164659,
      'tags' : [ 'iceberg' ],
      'type' : 'image/jpeg',
    },
  },
  'players' : {
    'player-key-1' : {
      'born' : 892846800000,
      'citizenship' : 'UA',
      'club' : 'club-key-1',
      'endActivationDate' : 1656540000000,
      'firstNameEN' : '',
      'firstNameUA' : 'Name',
      'gender' : 'MALE',
      'height' : '190',
      'lastNameEN' : '',
      'lastNameUA' : 'SecondName',
      'license' : '00000001',
      'licenseType' : 'Adult_A',
      'photo' : 'photo-key-4',
      'position' : 'FORWARD',
      'registrDate' : 1486245600000,
      'secondNameUA' : 'NoNoName',
      'side' : 'L',
      'taxnumber' : '1231231231',
      'weight' : '79',
    },
    'player-key-2' : {
      'born' : 904424400000,
      'citizenship' : 'UA',
      'club' : 'club-key-3',
      'endActivationDate' : 1625004000000,
      'firstNameEN' : '',
      'firstNameUA' : 'Name',
      'gender' : 'FEMALE',
      'height' : '173',
      'lastNameEN' : '',
      'lastNameUA' : 'NameName',
      'license' : '00000002',
      'licenseType' : 'SENIOR',
      'photo' : 'photo-key-5',
      'position' : 'FORWARD',
      'registrDate' : 1486245600000,
      'secondNameUA' : 'MiddleName',
      'side' : 'R',
      'taxnumber' : '1231231231',
      'weight' : '55',
    },
    'player-key-3' : {
      'born' : 981496800000,
      'citizenship' : 'UA',
      'club' : 'club-key-3',
      'endActivationDate' : 1535673600000,
      'firstNameEN' : '',
      'firstNameUA' : 'Name',
      'gender' : 'MALE',
      'height' : '60',
      'lastNameEN' : '',
      'lastNameUA' : 'NoName',
      'license' : '00000003',
      'licenseType' : 'JUNIOR',
      'photo' : 'photo-key-6',
      'position' : '',
      'registrDate' : 1486245600000,
      'secondNameUA' : 'MiddleName',
      'side' : 'R',
      'weight' : '178',
    },
    'player-key-4' : {
      'born' : 981496800000,
      'citizenship' : 'UA',
      'club' : 'club-key-1',
      'endActivationDate' : 1535673600000,
      'firstNameEN' : '',
      'firstNameUA' : 'Name',
      'gender' : 'MALE',
      'height' : '60',
      'lastNameEN' : '',
      'lastNameUA' : 'NoName',
      'license' : '00000003',
      'licenseType' : 'JUNIOR',
      'photo' : 'photo-key-6',
      'position' : '',
      'registrDate' : 1486245600000,
      'secondNameUA' : 'MiddleName',
      'side' : 'R',
      'weight' : '178',
    },
  },
  'transfers' : {
    'transfer-key-1' : {
      'date' : 1485907200000,
      'endDate' : 1496188800000,
      'fromClub' : 'club-key-1',
      'player' : 'player-key-1',
      'toClub' : 'club-key-2',
    },
    'transfer-key-2' : {
      'date' : 1495929600000,
      'fromClub' : 'club-key-1',
      'player' : 'player-key-2',
      'toClub' : 'club-key-2',
    },
    'transfer-key-3' : {
      'date' : 1495929600000,
      'fromClub' : 'club-key-2',
      'player' : 'player-key-2',
      'toClub' : 'club-key-3',
    },
    'transfer-key-4' : {
      'date' : 1495929600000,
      'fromClub' : 'club-key-1',
      'player' : 'player-key-4',
      'toClub' : 'club-key-2',
    },
    'transfer-key-5' : {
      'date' : 1499939600000,
      'endDate' : 1499999600000,
      'fromClub' : 'club-key-2',
      'player' : 'player-key-4',
      'toClub' : 'club-key-3',
    },
  },
  'users' : {
    'user-key-1' : {
      'displayName' : 'Name Name',
      'email' : 'name.name@gmail.com',
      'photoURL' : 'someurlstring.com',
      'role' : 99,
    },
  },
};
