export const getCurrentSeason = date => {
  const currentMonth = date.getMonth(),
    currentYear = date.getFullYear();

  let startSeasonYear = currentYear,
    endSeasonYear = currentYear;

  if (currentMonth > 5) {
    endSeasonYear = ++endSeasonYear;
  } else {
    startSeasonYear = --startSeasonYear;
  }

  return {
    start: new Date(`${startSeasonYear}-06-01`),
    end: new Date(`${endSeasonYear}-08-31`),
  };
};
