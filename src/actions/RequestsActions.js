export const CREATELICENSEREQUEST  = 'CREATELICENSEREQUEST';
export const ADDPLAYERTOREQUEST  = 'ADDPLAYERTOREQUEST';

export function licenseRequest(status) {
    return {
        type: CREATELICENSEREQUEST,
        newRequest: {
            date: new Date(),
            playersList: {},
            status,
        },
    };
}

export function addPlayerToRequest(player) {
    return {
        type: ADDPLAYERTOREQUEST,
        player,
    };
}