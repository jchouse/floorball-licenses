export const dateFormate = 'dd.MM.yyyy';

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
  Adult_A: {
    name: 'AB',
    value: 'Adult_A',
    ageLimit: 0,
  },
  Adult_B: {
    name: 'AB',
    value: 'Adult_B',
    ageLimit: 0,
  },
  Junior_A: {
    name: 'JA',
    value: 'Junior_A',
    ageLimit: 18,
  },
  Junior_B: {
    name: 'JB',
    value: 'Junior_B',
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
      licensiesTypes.Junior_A,
      licensiesTypes.Junior_B,
      licensiesTypes.Adult_A,
      licensiesTypes.Adult_B,
    ],
  },
  key00002: {
    name: '20/21',
    startDate: 1630454400000, // '2021-09-01'
    endDate: 1661904000000, // 2022-08-31
    active: true,
    possibleLiciensies: [
      licensiesTypes.Junior_A,
      licensiesTypes.Junior_B,
      licensiesTypes.Adult_A,
      licensiesTypes.Adult_B,
    ],
  },
};

export const activeSeason = listOfSeasons.key00002;

export enum Roles {
  ADMIN = 99,
  GUEST = 0,
  USER = 1,
}
