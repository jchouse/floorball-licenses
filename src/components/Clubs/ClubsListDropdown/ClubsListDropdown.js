export const clubsListDropdown = clubsList => Object.entries(clubsList).map(([key, club]) => ({
    value: key,
    label: club.shortNameUA,
}));
