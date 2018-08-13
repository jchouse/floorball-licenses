export const GETPLAYERS  = 'GETPLAYERS';

export function getPlayers(playersList) {
    return {
        type: GETPLAYERS,
        playersList: playersList
    };
}
