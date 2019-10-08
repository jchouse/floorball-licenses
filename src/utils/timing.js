export const getCurrentSeason = (date) => {
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
        seasonStart: new Date(`${startSeasonYear}-05-01`),
        seasonEnd: new Date(`${endSeasonYear}-07-31`)
    };
}