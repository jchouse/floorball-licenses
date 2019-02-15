export const GETCLUBS  = 'GETCLUBS';

export function getClubs(clubsList) {
    return {
        type: GETCLUBS,
        clubsList: clubsList
    };
}
