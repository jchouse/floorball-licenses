export const ClubsListDropdown = clubsList => Object.entries(clubsList).map(([key, club]) => ({
    value: key,
    'data-icon': club.logoUrl,
    label: club.shortNameUA,
}));
