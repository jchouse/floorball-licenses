import { IClub } from '../Clubs';

export const clubsListDropdown = (clubsList: Record<string, IClub>) => Object.entries(clubsList).map(([key, club]) => ({
    value: key,
    label: club.shortName,
}));
