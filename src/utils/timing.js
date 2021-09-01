export const getCurrentSeason = date => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  let startSeasonYear = currentYear;

  let endSeasonYear = currentYear;

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
