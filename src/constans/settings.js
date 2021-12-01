export const dateFormate = 'MM.dd.yyyy';

export const licensiesTypes = {
  Adult: {
    name: 'Adult',
    value: 'Adult',
    ageLimit: 0,
  },
  Junior: {
    name: 'Junior',
    value: 'Junior',
    ageLimit: 18,
  },
  Adult_1: {
    name: 'A1',
    value: 'Adult_1',
    ageLimit: 0,
  },
  Adult_2: {
    name: 'A2',
    value: 'Adult_2',
    ageLimit: 0,
  },
  Junior_1: {
    name: 'J1',
    value: 'Junior_1',
    ageLimit: 18,
  },
  Junior_2: {
    name: 'J2',
    value: 'Junior_2',
    ageLimit: 18,
  },
};

export const listOfSeasons = {
  key00000: {
    name: '19/20',
    startDate: 1567296000000, // '2019-09-01'
    endDate: 1598832000000, // 2020-08-31
    active: false,
    possibleLiciensies: [
      licensiesTypes.Junior,
      licensiesTypes.Adult,
    ],
  },
  key00001: {
    name: '20/21',
    startDate: 1598918400000, // '2020-09-01'
    endDate: 1630368000000, // 2021-08-31
    active: false,
    possibleLiciensies: [
      licensiesTypes.Junior_1,
      licensiesTypes.Junior_2,
      licensiesTypes.Adult_1,
      licensiesTypes.Adult_2,
    ],
  },
  key00002: {
    name: '20/21',
    startDate: 1630454400000, // '2021-09-01'
    endDate: 1661904000000, // 2022-08-31
    active: true,
    possibleLiciensies: [
      licensiesTypes.Junior_1,
      licensiesTypes.Junior_2,
      licensiesTypes.Adult_1,
      licensiesTypes.Adult_2,
    ],
  },
};

export const activeSeason = listOfSeasons.key00002;
